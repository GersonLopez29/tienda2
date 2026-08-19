import { NextResponse } from "next/server";
import { verifyUserCredentials } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Correo o contraseña inválidos" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const result = await verifyUserCredentials(email, password);

  if (!result.ok) {
    if (result.reason === "locked") {
      return NextResponse.json(
        { error: "Cuenta bloqueada temporalmente por varios intentos fallidos. Prueba de nuevo en 30 minutos." },
        { status: 403 }
      );
    }
    if (result.reason === "blocked") {
      return NextResponse.json({ error: "Esta cuenta fue bloqueada por un administrador." }, { status: 403 });
    }
    return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
  }

  await createSession(result.user.id);
  return NextResponse.json({ ok: true });
}
