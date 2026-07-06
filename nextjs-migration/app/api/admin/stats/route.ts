import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const db = await getDb();
  const col = db.collection("contact_messages");
  const total = await col.countDocuments({});
  const unread = await col.countDocuments({ read: { $ne: true } });
  return NextResponse.json({ total, unread });
}
