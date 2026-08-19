import { NextResponse } from "next/server";
import crypto from "crypto";
import { forgotPasswordSchema } from "@/lib/validation";
import { getUserByEmail, setResetToken } from "@/lib/users";
import { checkAndRecordAttempt } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/resend";

const RESET_TOKEN_HOURS = 1;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = await checkAndRecordAttempt("passwordReset", ip, 5, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiados intentos. Probá de nuevo en un rato." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }

  const user = await getUserByEmail(parsed.data.email);
  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_HOURS * 60 * 60_000);
    await setResetToken(user.id, resetToken, resetTokenExpiresAt);
    await sendPasswordResetEmail(user.email, user.name, resetToken);
  }

  // Always the same response — don't reveal whether the email exists.
  return NextResponse.json({ ok: true });
}
