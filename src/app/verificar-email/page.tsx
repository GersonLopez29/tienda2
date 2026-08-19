import Link from "next/link";
import { getUserByVerificationToken, verifyUserEmail } from "@/lib/users";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const result = await verify(token);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 text-center shadow-[0_20px_50px_-16px_rgba(46,42,34,0.3)]">
        <h1 className="text-xl font-extrabold text-olive-ink">K&N&apos;Store</h1>
        <p className="mt-3 text-sm text-ink-soft">{result.message}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-surface hover:bg-olive"
        >
          Ir a la tienda
        </Link>
      </div>
    </main>
  );
}

async function verify(token: string | undefined): Promise<{ message: string }> {
  if (!token) return { message: "Falta el código de verificación." };

  const user = await getUserByVerificationToken(token);
  if (!user) return { message: "El enlace de verificación es inválido o ya fue usado." };
  if (user.emailVerified) return { message: "Tu correo ya estaba verificado." };
  if (!user.verificationTokenExpiresAt || user.verificationTokenExpiresAt < new Date()) {
    return { message: "El enlace de verificación venció. Vuelve a pedirlo desde tu cuenta." };
  }

  await verifyUserEmail(user.id);
  return { message: "¡Listo! Tu correo quedó verificado." };
}
