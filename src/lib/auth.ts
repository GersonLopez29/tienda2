import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

// Compared against even when the email doesn't match any user, so a failed
// login doesn't reveal whether the email exists (timing-attack mitigation).
const FALLBACK_HASH = "$2b$12$K8Z3Q5f9y1v9nJ5X5wq5xeYFhF5w9c1cE1a1S1e1e1e1e1e1e1e1u";

const LOCKOUT_MAX_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 30;

export type LoginResult =
  | { ok: true; user: { id: string; isBlocked: boolean } }
  | { ok: false; reason: "invalid" | "locked" | "blocked" };

export async function verifyUserCredentials(email: string, password: string): Promise<LoginResult> {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });

  if (user?.lockedUntil && user.lockedUntil > new Date()) {
    return { ok: false, reason: "locked" };
  }

  const passwordMatches = await bcrypt.compare(password, user?.passwordHash ?? FALLBACK_HASH);
  if (!user || !passwordMatches) {
    if (user) {
      const failedLoginAttempts = user.failedLoginAttempts + 1;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts,
          lockedUntil:
            failedLoginAttempts >= LOCKOUT_MAX_ATTEMPTS
              ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
              : null,
        },
      });
    }
    return { ok: false, reason: "invalid" };
  }

  if (user.isBlocked) return { ok: false, reason: "blocked" };

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });

  return { ok: true, user: { id: user.id, isBlocked: user.isBlocked } };
}
