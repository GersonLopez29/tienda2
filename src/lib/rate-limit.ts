import "server-only";
import { prisma } from "@/lib/db";

type AttemptModel = "registration" | "passwordReset";

/**
 * Records an attempt for `ip` and reports whether it exceeds the allowed
 * rate. Always records first so a burst of requests can't race past the
 * check before any of them are counted.
 */
export async function checkAndRecordAttempt(
  model: AttemptModel,
  ip: string,
  maxAttempts: number,
  windowMinutes: number
): Promise<{ allowed: boolean }> {
  const since = new Date(Date.now() - windowMinutes * 60_000);
  const where = { ip, createdAt: { gte: since } };

  const count =
    model === "registration"
      ? await prisma.registrationAttempt.create({ data: { ip } }).then(() => prisma.registrationAttempt.count({ where }))
      : await prisma.passwordResetAttempt.create({ data: { ip } }).then(() => prisma.passwordResetAttempt.count({ where }));

  return { allowed: count <= maxAttempts };
}
