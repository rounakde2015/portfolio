import { getClientIp, signAdminToken, verifyAdminPassword } from "@/lib/auth";
import { clearAttempts, isLockedOut, recordFailed } from "@/lib/ratelimit";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (isLockedOut(ip)) {
    return NextResponse.json(
      { detail: "Too many failed attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 });
  }

  const password = body.password ?? "";
  const ok = await verifyAdminPassword(password);

  if (!ok) {
    recordFailed(ip);
    return NextResponse.json({ detail: "Invalid password" }, { status: 401 });
  }

  clearAttempts(ip);
  const { token, expiresAt } = await signAdminToken();
  return NextResponse.json({ token, expires_at: expiresAt.toISOString() });
}
