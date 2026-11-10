import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const DEFAULT_SECRET = "lumiere-studio-ultra-luxury-secret-key-2026-photographie-paris-ny";
const rawSecret = process.env.JWT_SECRET || DEFAULT_SECRET;

if (process.env.NODE_ENV === "production" && rawSecret === DEFAULT_SECRET) {
  console.warn(
    "[SECURITY WARNING] Using default fallback JWT_SECRET in production. Set a strong, unique JWT_SECRET in your .env.production file!"
  );
}

const JWT_SECRET = new TextEncoder().encode(rawSecret);

export const AUTH_COOKIE_NAME = "lumiere_admin_session";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAdminToken(payload: {
  id: string;
  email: string;
  name: string;
  role: string;
  mustChangePassword?: boolean;
}): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as {
      id: string;
      email: string;
      name: string;
      role: string;
      mustChangePassword?: boolean;
    };
  } catch {
    return null;
  }
}

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
