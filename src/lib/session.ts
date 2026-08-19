import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "refit_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

const CURRENT_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  whatsapp: true,
  role: true,
  isBlocked: true,
  emailVerified: true,
} as const;

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** DB-backed, per-request-memoized: the real source of truth for role/isBlocked/emailVerified. */
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const userId = payload.userId;
    if (typeof userId !== "string") return null;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: CURRENT_USER_SELECT });
    if (!user || user.isBlocked) return null;
    return user;
  } catch {
    return null;
  }
});

export function isAdmin(user: { role: string } | null) {
  return user?.role === "admin";
}
