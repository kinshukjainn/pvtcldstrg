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

const getBucketName = () => {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket) throw new Error("Server configuration error.");
  return bucket;
};

// ── Helper: Get user and their plan limits via SQL JOIN ──
async function getDbUser(clerkId: string) {
  // We use a JOIN to get the user's data AND their plan limits instantly
  const query = sql`
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

  const rows = await query;

  if (rows.length > 0) {
    return rows[0] as {
      id: string;
      storage_used: number;
      plan_id: string;
      plan_storage_limit: number;
      plan_file_count_limit: number;
    };
  }

  // Provision new user from Clerk (NeonDB automatically assigns plan_id = 'free')
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("No email found on Clerk user");

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  await sql`
    INSERT INTO users (clerk_id, email, name, avatar_url)
    VALUES (${clerkId}, ${email}, ${name}, ${clerkUser.imageUrl ?? null})
    ON CONFLICT (clerk_id) DO NOTHING
  `;

  // Fetch again to get the auto-assigned plan defaults
  const retry = await query;
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

  const sanitized = fileName.replace(/\s+/g, "-");
  const key = `uploads/${userId}/${Date.now()}-${sanitized}`;

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: getBucketName(),
    Key: key,
    Conditions: [
      ["content-length-range", 1, fileSize],
      ["starts-with", "$Content-Type", contentType.split("/")[0]],
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

  let actualSize: number;
  try {
    const head = await s3Client.send(
      new HeadObjectCommand({ Bucket: getBucketName(), Key: key }),
    );
    actualSize = head.ContentLength ?? fileSize;
  } catch {
    throw new Error(
      "File not found in storage. Upload may have failed — please try again.",
    );
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
        ${contentType ?? null}
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
        expiresIn: 3600,
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
export async function deletePhoto(key: string, fileSize: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!key.startsWith(`uploads/${userId}/`)) throw new Error("Unauthorized");

  const user = await getDbUser(userId);

  await s3Client.send(
    new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }),
  );

  await sql.transaction([
    sql`DELETE FROM files WHERE file_key = ${key} AND user_id = ${user.id}`,
    sql`
      UPDATE users
      SET storage_used = GREATEST(storage_used - ${fileSize}, 0), updated_at = NOW()
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
