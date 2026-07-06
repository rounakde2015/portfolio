import { requireAdmin } from "@/lib/auth";
import type { ContactMessage } from "@/lib/models";
import { getDb } from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const { id } = await params;

  let body: { read?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 });
  }
  const read = Boolean(body.read);

  const db = await getDb();
  const result = await db
    .collection<ContactMessage>("contact_messages")
    .findOneAndUpdate(
      { id },
      { $set: { read } },
      { returnDocument: "after", projection: { _id: 0 } },
    );

  if (!result) {
    return NextResponse.json({ detail: "Message not found" }, { status: 404 });
  }
  return NextResponse.json({ ...result, read: result.read ?? read });
}
