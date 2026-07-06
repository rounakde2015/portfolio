import crypto from "node:crypto";
import { sendContactNotification } from "@/lib/email";
import type { ContactMessage } from "@/lib/models";
import { getDb } from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || name.length > 120) {
    return NextResponse.json({ detail: "Invalid name" }, { status: 422 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ detail: "Invalid email" }, { status: 422 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ detail: "Invalid message" }, { status: 422 });
  }

  const emailSent = await sendContactNotification(name, email, message);

  const doc: ContactMessage = {
    id: crypto.randomUUID(),
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
    email_sent: emailSent,
    read: false,
  };

  const db = await getDb();
  await db.collection("contact_messages").insertOne(doc);

  return NextResponse.json({ status: "success", id: doc.id, email_sent: emailSent });
}
