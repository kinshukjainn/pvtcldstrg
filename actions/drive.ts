"use server";

import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";
import { auth, currentUser } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

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
    VALUES (${clerkId}, ${email}, ${name}, ${clerkUser.imageUrl ?? null}, 0, 5368709120)
    ON CONFLICT (clerk_id) DO NOTHING
    RETURNING id, storage_used, storage_limit
  `;

  // ON CONFLICT DO NOTHING returns 0 rows if the webhook snuck in between our SELECT and INSERT
  if (inserted.length > 0) {
    return inserted[0] as {
      id: string;
      storage_used: number;
      storage_limit: number;
    };
  }

  // Re-fetch — the webhook inserted it between our two queries
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

// 1. Get S3 Upload URL & Enforce 5GB Limit
export async function getUploadUrl(
  fileName: string,
  contentType: string,
  fileSize: number,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getDbUser(userId);

  if (Number(user.storage_used) + fileSize > Number(user.storage_limit)) {
    throw new Error("Storage limit exceeded (5GB Max).");
  }

  const sanitized = fileName.replace(/\s+/g, "-");
  const key = `uploads/${userId}/${Date.now()}-${sanitized}`;

  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  return { url, key };
}

// 2. Confirm Upload → insert file record + update storage_used
export async function confirmUploadDB(
  key: string,
  fileName: string,
  fileSize: number,
  contentType?: string,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getDbUser(userId);

  await sql.transaction([
    sql`
      INSERT INTO files (user_id, file_key, original_name, file_size, content_type)
      VALUES (${user.id}, ${key}, ${fileName}, ${fileSize}, ${contentType ?? null})
    `,
    sql`
      UPDATE users
      SET storage_used = storage_used + ${fileSize}, updated_at = NOW()
      WHERE id = ${user.id}
    `,
  ]);
}

// 3. List Files (from DB, generate fresh signed URLs)
export async function listPhotos() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getDbUser(userId);

  const files = await sql`
    SELECT id, file_key AS key, original_name AS name, file_size AS size, content_type
    FROM files
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `;

  const bucketName = getBucketName();
  const filesWithUrls = await Promise.all(
    files.map(async (file) => {
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: file.key as string,
      });
      const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
      return { ...file, url };
    }),
  );

  return filesWithUrls;
}

// 4. Delete File (S3 + DB)
export async function deletePhoto(key: string, fileSize: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!key.includes(userId)) throw new Error("Unauthorized");

  const user = await getDbUser(userId);

  const command = new DeleteObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });
  await s3Client.send(command);

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
  if (!userId || !key.includes(userId)) throw new Error("Unauthorized");

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
