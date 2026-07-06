import { requireAdmin } from "@/lib/auth";
import type { ContactMessage } from "@/lib/models";
import { getDb } from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const db = await getDb();
  const rows = await db
    .collection<ContactMessage>("contact_messages")
    .find({}, { projection: { _id: 0 } })
    .sort({ timestamp: -1 })
    .limit(500)
    .toArray();

  const normalized = rows.map((r) => ({ ...r, read: r.read ?? false }));
  return NextResponse.json(normalized);
}
