import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const { id } = await params;
  const db = await getDb();
  const result = await db.collection("contact_messages").deleteOne({ id });
  if (result.deletedCount === 0) {
    return NextResponse.json({ detail: "Message not found" }, { status: 404 });
  }
  return NextResponse.json({ status: "deleted", id });
}
