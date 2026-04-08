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
import { sql } from "@/lib/db";
import { DEFAULT_STORAGE_LIMIT_BYTES, FILE_LIST_PAGE_SIZE } from "./constants";

const getBucketName = () => {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket) throw new Error("Server configuration error.");
  return bucket;
};

// ── Helper: get internal user from clerk_id, auto-provision if webhook hasn't fired yet ──
async function getDbUser(clerkId: string) {
  const rows = await sql`
    SELECT id, storage_used, storage_limit FROM users WHERE clerk_id = ${clerkId}
  `;

  if (rows.length > 0) {
    return rows[0] as {
      id: string;
      storage_used: number;
      storage_limit: number;
    };
  }

  // Webhook hasn't arrived yet — provision the row from Clerk's server API
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) throw new Error("No email found on Clerk user");

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  const inserted = await sql`
    INSERT INTO users (clerk_id, email, name, avatar_url, storage_used, storage_limit)
    VALUES (
      ${clerkId},
      ${email},
      ${name},
      ${clerkUser.imageUrl ?? null},
      0,
      ${DEFAULT_STORAGE_LIMIT_BYTES}
    )
    ON CONFLICT (clerk_id) DO NOTHING
    RETURNING id, storage_used, storage_limit
  `;

  if (inserted.length > 0) {
    return inserted[0] as {
      id: string;
      storage_used: number;
      storage_limit: number;
    };
  }

  const retry = await sql`
    SELECT id, storage_used, storage_limit FROM users WHERE clerk_id = ${clerkId}
  `;
  if (retry.length === 0) throw new Error("User not found in DB");
  return retry[0] as {
    id: string;
    storage_used: number;
    storage_limit: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Get S3 Presigned POST URL — enforces content-length-range at the AWS level
//    FIX: replaced PutObjectCommand presigned URL with createPresignedPost so
//    AWS itself rejects uploads that exceed the declared fileSize, preventing
//    the "upload 1 KB, then send 500 GB" exploit.
// ─────────────────────────────────────────────────────────────────────────────
export async function getUploadUrl(
  fileName: string,
  contentType: string,
  fileSize: number,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getDbUser(userId);

  if (Number(user.storage_used) + fileSize > Number(user.storage_limit)) {
    throw new Error("Storage limit exceeded (5 GB max).");
  }

  const sanitized = fileName.replace(/\s+/g, "-");
  const key = `uploads/${userId}/${Date.now()}-${sanitized}`;

  // createPresignedPost embeds a content-length-range condition directly in
  // the AWS policy token — S3 rejects the upload at bucket level if violated.
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: getBucketName(),
    Key: key,
    Conditions: [
      ["content-length-range", 1, fileSize], // min 1 byte, max declared size
      ["starts-with", "$Content-Type", contentType.split("/")[0]], // correct MIME family
    ],
    Fields: { "Content-Type": contentType },
    Expires: 60, // URL valid for 60 seconds
  });

  return { url, fields, key };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Confirm Upload → verify the object actually landed in S3 first, then
//    insert the file record and update storage_used.
//    FIX: HeadObject call guarantees (a) the file genuinely reached S3 before
//    we trust the client, and (b) we use the real ContentLength from AWS, not
//    whatever size the client claims — closing both the orphan and spoof gaps.
// ─────────────────────────────────────────────────────────────────────────────
export async function confirmUploadDB(
  key: string,
  fileName: string,
  fileSize: number,
  contentType?: string,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Ensure the key belongs to this user — never trust the client's key string
  if (!key.startsWith(`uploads/${userId}/`)) throw new Error("Unauthorized");

  // Verify the object actually exists in S3 and get its real byte count
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

  // Re-check storage with the real S3 size (not the client-supplied value)
  if (Number(user.storage_used) + actualSize > Number(user.storage_limit)) {
    // Clean up the orphaned object since we won't record it
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
// 3. List Files — paginated to prevent signing thousands of URLs at once.
//    FIX: added LIMIT / OFFSET so only the current page of files is fetched
//    and signed, keeping server response times fast even for large libraries.
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

  // Also fetch total count so the UI knows whether more pages exist
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

// 4. Delete File (S3 + DB)
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

// 5. Get Download URL
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

// 6. Get user storage info
export async function getStorageInfo() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getDbUser(userId);
  return {
    used: Number(user.storage_used),
    limit: Number(user.storage_limit),
  };
}
