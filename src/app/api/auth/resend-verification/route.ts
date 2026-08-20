import { NextResponse } from "next/server";
import crypto from "crypto";
import { requireUser } from "@/lib/require-user";
import { setVerificationToken } from "@/lib/users";
import { sendVerificationEmail } from "@/lib/resend";

const VERIFICATION_TOKEN_HOURS = 24;

// ponytail: no IP rate limit — this requires an authenticated session, so
// abuse is bounded by account creation friction. Add a cooldown if resend
// spam becomes a problem.
export async function POST() {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  if (user.emailVerified) return NextResponse.json({ ok: true });

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_HOURS * 60 * 60_000);
  await setVerificationToken(user.id, verificationToken, verificationTokenExpiresAt);
  await sendVerificationEmail(user.email, user.name, verificationToken);

  return NextResponse.json({ ok: true });
}
