import { NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Correo o contraseña inválidos" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const isValid = await verifyAdminCredentials(email, password);
  if (!isValid) {
    return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
  }

  await createSession(email);
  return NextResponse.json({ ok: true });
}
