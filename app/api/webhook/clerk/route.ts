import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

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

    // Use the actual primary email, not just the first in the array
    const primaryEmail =
      email_addresses.find((e) => e.id === primary_email_address_id)
        ?.email_address ?? email_addresses[0]?.email_address;

    if (!primaryEmail) {
      console.error("user.created: no email found for", id);
      return NextResponse.json({ error: "No email" }, { status: 400 });
    }

    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    try {
      await sql`
        INSERT INTO users (clerk_id, email, name, avatar_url, storage_used, storage_limit)
        VALUES (${id}, ${primaryEmail}, ${name}, ${image_url ?? null}, 0, 5368709120)
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
        SET email = ${primaryEmail}, name = ${name}, avatar_url = ${image_url ?? null}, updated_at = NOW()
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
      // CASCADE on files table will handle file records
      await sql`DELETE FROM users WHERE clerk_id = ${id}`;
      return NextResponse.json({ message: "User deleted" }, { status: 200 });
    } catch (error) {
      console.error("Database deletion error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  // Unhandled event type — acknowledge it
  return new Response("", { status: 200 });
}
