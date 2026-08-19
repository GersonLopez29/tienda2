import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/lib/validation";
import { getUserByResetToken, resetUserPassword } from "@/lib/users";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const { token, password } = parsed.data;

  const user = await getUserByResetToken(token);
  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
    return NextResponse.json({ error: "El enlace es inválido o venció. Pedí uno nuevo." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await resetUserPassword(user.id, passwordHash);
  await createSession(user.id);

  return NextResponse.json({ ok: true });
}
