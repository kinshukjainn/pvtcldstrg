import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { s3Client } from "@/lib/s3";
import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const getBucketName = () => {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket)
    throw new Error("Server configuration error: BUCKET_NAME missing.");
  return bucket;
};

/**
 * Deletes ALL S3 objects under a user's upload prefix.
 * This prevents orphaned files when a user is removed from the DB.
 */
async function deleteAllUserS3Files(clerkId: string) {
  const bucket = getBucketName();
  const prefix = `uploads/${clerkId}/`;

  let continuationToken: string | undefined;

  do {
    const listResponse = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );

    const objects = listResponse.Contents ?? [];

    // Delete in parallel batches of 25 to avoid overwhelming S3
    const BATCH_SIZE = 25;
    for (let i = 0; i < objects.length; i += BATCH_SIZE) {
      const batch = objects.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((obj) =>
          s3Client.send(
            new DeleteObjectCommand({ Bucket: bucket, Key: obj.Key! }),
          ),
        ),
      );
    }

    continuationToken = listResponse.IsTruncated
      ? listResponse.NextContinuationToken
      : undefined;
  } while (continuationToken);
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env",
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error -- no svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // ── user.created ──
  if (evt.type === "user.created") {
    const {
      id,
      email_addresses,
      primary_email_address_id,
      first_name,
      last_name,
      image_url,
    } = evt.data;

    const primaryEmail =
      email_addresses.find((e) => e.id === primary_email_address_id)
        ?.email_address ?? email_addresses[0]?.email_address;

    if (!primaryEmail) {
      console.error("user.created: no email found for", id);
      return NextResponse.json({ error: "No email" }, { status: 400 });
    }

    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    try {
      // plan_id defaults to 'free' via the DB column default,
      // which links to the plans table for storage_limit & file_count_limit.
      await sql`
        INSERT INTO users (clerk_id, email, name, avatar_url)
        VALUES (
          ${id},
          ${primaryEmail},
          ${name},
          ${image_url ?? null}
        )
        ON CONFLICT (clerk_id) DO NOTHING
      `;
      return NextResponse.json({ message: "User synced" }, { status: 201 });
    } catch (error) {
      console.error("Database insertion error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  // ── user.updated ──
  if (evt.type === "user.updated") {
    const {
      id,
      email_addresses,
      primary_email_address_id,
      first_name,
      last_name,
      image_url,
    } = evt.data;

    const primaryEmail =
      email_addresses.find((e) => e.id === primary_email_address_id)
        ?.email_address ?? email_addresses[0]?.email_address;

    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    try {
      await sql`
        UPDATE users
        SET
          email      = ${primaryEmail},
          name       = ${name},
          avatar_url = ${image_url ?? null},
          updated_at = NOW()
        WHERE clerk_id = ${id}
      `;
      return NextResponse.json({ message: "User updated" }, { status: 200 });
    } catch (error) {
      console.error("Database update error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  // ── user.deleted ──
  if (evt.type === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      return NextResponse.json({ error: "No user id" }, { status: 400 });
    }

    try {
      // 1. Purge all of the user's files from S3 BEFORE the DB cascade
      //    wipes the file_key references we'd need to find them.
      await deleteAllUserS3Files(id);

      // 2. Now delete the user row — CASCADE will clean up the files table.
      await sql`DELETE FROM users WHERE clerk_id = ${id}`;

      return NextResponse.json({ message: "User deleted" }, { status: 200 });
    } catch (error) {
      console.error("User deletion error:", error);
      return NextResponse.json({ error: "Deletion error" }, { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}
