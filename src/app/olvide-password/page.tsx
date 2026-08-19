"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-[0_20px_50px_-16px_rgba(46,42,34,0.3)]">
        <h1 className="text-xl font-extrabold text-olive-ink">K&N&apos;Store</h1>
        <p className="mt-1 text-sm text-ink-soft">Recuperá tu contraseña</p>

        {sent ? (
          <p className="mt-6 text-sm text-ink-soft">
            Si ese correo tiene una cuenta, te enviamos un enlace para restablecer tu contraseña.
          </p>
        ) : (
          <form onSubmit={onSubmit}>
            <label className="mt-6 block text-sm font-semibold" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line-strong bg-surface-2 px-3.5 py-2.5 text-sm outline-none focus-visible:border-olive"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-bold text-surface hover:bg-olive disabled:opacity-60"
            >
              {loading ? "Enviando…" : "Enviar enlace"}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-ink-faint">
          <Link href="/login" className="font-semibold text-olive-ink hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
