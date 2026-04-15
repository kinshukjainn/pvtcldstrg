"use server";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";
import { auth, currentUser } from "@clerk/nextjs/server";
import { sql } from "@/lib/db"; // NeonDB

const FILE_LIST_PAGE_SIZE = 30;

// ── FIX 1: Content type allowlist ──
// Covers images, documents, spreadsheets, presentations, archives, audio, video.
// BLOCKED: text/html, application/xhtml+xml, text/javascript, application/javascript,
//          application/x-httpd-php, .exe, .bat, .sh, .svg+xml — anything that
//          could execute code in a browser or OS.
const ALLOWED_CONTENT_TYPES = new Set([
  // ── Images ──
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/bmp",
  "image/tiff",
  "image/x-icon",

  // ── Documents ──
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.oasis.opendocument.text", // .odt
  "application/rtf", // .rtf
  "text/plain", // .txt
  "text/csv", // .csv
  "text/markdown", // .md

  // ── Spreadsheets ──
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.oasis.opendocument.spreadsheet", // .ods

  // ── Presentations ──
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.oasis.opendocument.presentation", // .odp

  // ── Archives ──
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/vnd.rar",
  "application/x-7z-compressed",
  "application/gzip",
  "application/x-tar",
  "application/x-bzip2",

  // ── Audio ──
  "audio/mpeg", // .mp3
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/flac",
  "audio/x-m4a",
  "audio/mp4",

  // ── Video ──
  "video/mp4",
  "video/quicktime", // .mov
  "video/x-msvideo", // .avi
  "video/webm",
  "video/x-matroska", // .mkv
  "video/mpeg",

  // ── Other common ──
  "application/json",
  "application/xml",
  "text/xml",
]);

// ── FIX 2: Hard server-side max file size (500MB — covers video) ──
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

// ── FIX 3: In-memory rate limiter ──
// In production, replace with Redis-backed limiter (e.g. @upstash/ratelimit)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(
  userId: string,
  action: string,
  maxRequests: number,
  windowMs: number,
): void {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    throw new Error("Too many requests. Please slow down and try again.");
  }
}

const getBucketName = () => {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket) throw new Error("Server configuration error.");
  return bucket;
};

// ── Helper: Get user and their plan limits via SQL JOIN ──
// FIX 4: Race condition — use advisory lock or INSERT ... RETURNING with fallback
async function getDbUser(clerkId: string) {
  const rows = await sql`
    SELECT 
      u.id, 
      u.storage_used, 
      u.plan_id,
      p.storage_limit AS plan_storage_limit, 
      p.file_count_limit AS plan_file_count_limit
    FROM users u
    JOIN plans p ON u.plan_id = p.id
    WHERE u.clerk_id = ${clerkId}
  `;

  if (rows.length > 0) {
    return rows[0] as {
      id: string;
      storage_used: number;
      plan_id: string;
      plan_storage_limit: number;
      plan_file_count_limit: number;
    };
  }

  // Provision new user from Clerk
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("No email found on Clerk user");

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  // Use INSERT ... ON CONFLICT ... RETURNING to handle the race atomically
  const inserted = await sql`
    INSERT INTO users (clerk_id, email, name, avatar_url)
    VALUES (${clerkId}, ${email}, ${name}, ${clerkUser.imageUrl ?? null})
    ON CONFLICT (clerk_id) DO UPDATE SET updated_at = NOW()
    RETURNING id
  `;

  if (inserted.length === 0) {
    throw new Error("User provision failed");
  }

  // Now fetch with JOIN (guaranteed to exist)
  const retry = await sql`
    SELECT 
      u.id, 
      u.storage_used, 
      u.plan_id,
      p.storage_limit AS plan_storage_limit, 
      p.file_count_limit AS plan_file_count_limit
    FROM users u
    JOIN plans p ON u.plan_id = p.id
    WHERE u.clerk_id = ${clerkId}
  `;

  if (retry.length === 0) throw new Error("User provision failed");

  return retry[0] as {
    id: string;
    storage_used: number;
    plan_id: string;
    plan_storage_limit: number;
    plan_file_count_limit: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Get S3 Presigned POST URL
// ─────────────────────────────────────────────────────────────────────────────
export async function getUploadUrl(
  fileName: string,
  contentType: string,
  fileSize: number,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // FIX: Rate limit uploads — 30 requests per 60 seconds
  checkRateLimit(userId, "upload", 30, 60_000);

  // FIX: Validate content type against allowlist
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error(
      "File type not allowed. Supported: images, documents, spreadsheets, presentations, archives, audio, and video.",
    );
  }

  // FIX: Enforce hard server-side max file size
  if (fileSize <= 0 || fileSize > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `Invalid file size. Maximum allowed is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`,
    );
  }

  const user = await getDbUser(userId);

  // 1. Check File Count Limit against the Plan
  const countResult =
    await sql`SELECT COUNT(*)::int AS total FROM files WHERE user_id = ${user.id}`;
  const currentFileCount = countResult[0]?.total ?? 0;

  if (currentFileCount >= Number(user.plan_file_count_limit)) {
    throw new Error(
      `Upload blocked. Your ${user.plan_id} plan is limited to ${user.plan_file_count_limit} files.`,
    );
  }

  // 2. Check Storage Capacity Limit against the Plan
  if (Number(user.storage_used) + fileSize > Number(user.plan_storage_limit)) {
    const limitInGb = Math.round(
      Number(user.plan_storage_limit) / (1024 * 1024 * 1024),
    );
    throw new Error(
      `Storage limit exceeded. Your ${user.plan_id} plan allows ${limitInGb} GB max.`,
    );
  }

  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  const key = `uploads/${userId}/${Date.now()}-${sanitized}`;

  // FIX: Presigned POST conditions now enforce the EXACT content type
  // and cap upload at server-side max, not just the client-claimed size.
  // The content-length-range upper bound uses the smaller of: client claim or hard max.
  const maxAllowed = Math.min(fileSize, MAX_FILE_SIZE_BYTES);

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: getBucketName(),
    Key: key,
    Conditions: [
      ["content-length-range", 1, maxAllowed],
      // FIX: Exact content type match, not prefix
      ["eq", "$Content-Type", contentType],
    ],
    Fields: { "Content-Type": contentType },
    Expires: 60,
  });

  return { url, fields, key };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Confirm Upload
// ─────────────────────────────────────────────────────────────────────────────
export async function confirmUploadDB(
  key: string,
  fileName: string,
  fileSize: number,
  contentType?: string,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!key.startsWith(`uploads/${userId}/`)) throw new Error("Unauthorized");

  // FIX: Rate limit confirms
  checkRateLimit(userId, "confirm", 30, 60_000);

  // FIX: Validate content type on confirm as well
  if (contentType && !ALLOWED_CONTENT_TYPES.has(contentType)) {
    // Delete the uploaded file since it shouldn't exist
    await s3Client
      .send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }))
      .catch(() => {}); // best-effort cleanup
    throw new Error("File type not allowed.");
  }

  let actualSize: number;
  let actualContentType: string | undefined;
  try {
    const head = await s3Client.send(
      new HeadObjectCommand({ Bucket: getBucketName(), Key: key }),
    );
    actualSize = head.ContentLength ?? fileSize;
    actualContentType = head.ContentType;
  } catch {
    throw new Error(
      "File not found in storage. Upload may have failed — please try again.",
    );
  }

  // FIX: Double-check content type from S3 metadata (defense in depth)
  if (actualContentType && !ALLOWED_CONTENT_TYPES.has(actualContentType)) {
    await s3Client
      .send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }))
      .catch(() => {});
    throw new Error("Uploaded file type not allowed. File removed.");
  }

  // FIX: Enforce hard max even at confirm stage
  if (actualSize > MAX_FILE_SIZE_BYTES) {
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }),
    );
    throw new Error("File exceeds maximum allowed size. File removed.");
  }

  const user = await getDbUser(userId);

  if (
    Number(user.storage_used) + actualSize >
    Number(user.plan_storage_limit)
  ) {
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }),
    );
    throw new Error("Storage limit exceeded. File removed.");
  }

  await sql.transaction([
    sql`
      INSERT INTO files (user_id, file_key, original_name, file_size, content_type)
      VALUES (
        ${user.id},
        ${key},
        ${fileName},
        ${actualSize},
        ${actualContentType ?? contentType ?? null}
      )
    `,
    sql`
      UPDATE users
      SET storage_used = storage_used + ${actualSize}, updated_at = NOW()
      WHERE id = ${user.id}
    `,
  ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. List Files — paginated
// ─────────────────────────────────────────────────────────────────────────────
export async function listPhotos(page = 0) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // FIX: Rate limit listing
  checkRateLimit(userId, "list", 60, 60_000);

  const user = await getDbUser(userId);
  const offset = page * FILE_LIST_PAGE_SIZE;

  const files = await sql`
    SELECT id, file_key AS key, original_name AS name, file_size AS size, content_type
    FROM files
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
    LIMIT ${FILE_LIST_PAGE_SIZE}
    OFFSET ${offset}
  `;

  const countResult = await sql`
    SELECT COUNT(*)::int AS total FROM files WHERE user_id = ${user.id}
  `;
  const total: number = countResult[0]?.total ?? 0;

  const bucketName = getBucketName();
  const filesWithUrls = await Promise.all(
    files.map(async (file) => {
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: file.key as string,
      });
      const url = await getSignedUrl(s3Client, getCommand, {
        // FIX: Reduced from 3600 (1 hour) to 900 (15 minutes)
        expiresIn: 900,
      });
      return { ...file, url };
    }),
  );

  return {
    files: filesWithUrls,
    total,
    hasMore: offset + files.length < total,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Delete File (S3 + DB)
// ─────────────────────────────────────────────────────────────────────────────
// FIX: Remove client-provided fileSize entirely — fetch from DB
export async function deletePhoto(key: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!key.startsWith(`uploads/${userId}/`)) throw new Error("Unauthorized");

  // FIX: Rate limit deletes
  checkRateLimit(userId, "delete", 60, 60_000);

  const user = await getDbUser(userId);

  // FIX: Fetch actual file size from the database, not from the client
  const fileRows = await sql`
    SELECT file_size FROM files
    WHERE file_key = ${key} AND user_id = ${user.id}
  `;

  if (fileRows.length === 0) {
    throw new Error(
      "File not found or you don't have permission to delete it.",
    );
  }

  const actualSize = Number(fileRows[0].file_size);

  await s3Client.send(
    new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }),
  );

  await sql.transaction([
    sql`DELETE FROM files WHERE file_key = ${key} AND user_id = ${user.id}`,
    sql`
      UPDATE users
      SET storage_used = GREATEST(storage_used - ${actualSize}, 0), updated_at = NOW()
      WHERE id = ${user.id}
    `,
  ]);

  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Get Download URL
// ─────────────────────────────────────────────────────────────────────────────
export async function getDownloadUrl(key: string) {
  const { userId } = await auth();
  if (!userId || !key.startsWith(`uploads/${userId}/`))
    throw new Error("Unauthorized");

  // FIX: Rate limit downloads
  checkRateLimit(userId, "download", 60, 60_000);

  const command = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    ResponseContentDisposition: `attachment; filename="${key.split("/").pop()}"`,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 60 });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Get user storage info
// ─────────────────────────────────────────────────────────────────────────────
export async function getStorageInfo() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // FIX: Rate limit info endpoint
  checkRateLimit(userId, "storage-info", 60, 60_000);

  const user = await getDbUser(userId);

  const countResult =
    await sql`SELECT COUNT(*)::int AS total FROM files WHERE user_id = ${user.id}`;

  return {
    used: Number(user.storage_used) || 0,
    limit: Number(user.plan_storage_limit),
    fileCountLimit: Number(user.plan_file_count_limit),
    currentFileCount: countResult[0]?.total ?? 0,
    planId: user.plan_id,
  };
}
