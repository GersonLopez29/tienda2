import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { registerSchema } from "@/lib/validation";
import { createUser, getUserByEmail, setVerificationToken } from "@/lib/users";
import { createSession } from "@/lib/session";
import { checkAndRecordAttempt } from "@/lib/rate-limit";
import { sendVerificationEmail, sendDuplicateRegistrationNotice } from "@/lib/resend";

const VERIFICATION_TOKEN_HOURS = 24;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = await checkAndRecordAttempt("registration", ip, 5, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiados intentos. Probá de nuevo en un rato." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const { name, email, password, whatsapp } = parsed.data;

  const existing = await getUserByEmail(email);
  if (existing) {
    // Don't leak that the email is taken — just notify the real owner.
    await sendDuplicateRegistrationNotice(existing.email, existing.name);
    return NextResponse.json({ ok: true });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_HOURS * 60 * 60_000);

  const user = await createUser({ name, email, passwordHash, whatsapp });
  await setVerificationToken(user.id, verificationToken, verificationTokenExpiresAt);

  await createSession(user.id);
  await sendVerificationEmail(user.email, user.name, verificationToken);

  return NextResponse.json({ ok: true });
}
