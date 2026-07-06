import { requireAdmin } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ valid: true });
}
