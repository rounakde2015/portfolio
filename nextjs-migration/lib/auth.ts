import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET is not set");
const encoder = new TextEncoder();
const key = encoder.encode(secret);

const EXPIRE_HOURS = Number.parseInt(process.env.JWT_EXPIRE_HOURS ?? "2", 10);

// Bcrypt-hash the admin password once at module load (matches the FastAPI impl).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ADMIN_PASSWORD_HASH = ADMIN_PASSWORD
  ? bcrypt.hashSync(ADMIN_PASSWORD, bcrypt.genSaltSync(12))
  : "";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD_HASH) return false;
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export async function signAdminToken(): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + EXPIRE_HOURS * 60 * 60 * 1000);
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(key);
  return { token, expiresAt };
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function requireAdmin(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization") ?? "";
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return false;
  return verifyAdminToken(token);
}

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
