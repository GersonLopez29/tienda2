"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo restablecer la contraseña");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-[0_20px_50px_-16px_rgba(46,42,34,0.3)]"
      >
        <h1 className="text-xl font-extrabold text-olive-ink">K&N&apos;Store</h1>
        <p className="mt-1 text-sm text-ink-soft">Elige una contraseña nueva</p>

        {!token && (
          <p role="alert" className="mt-4 text-sm text-terracotta-ink">
            Falta el código del enlace. Pide uno nuevo desde{" "}
            <Link href="/olvide-password" className="underline">
              acá
            </Link>
            .
          </p>
        )}

        <label className="mt-6 block text-sm font-semibold" htmlFor="password">
          Contraseña nueva
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-line-strong bg-surface-2 px-3.5 py-2.5 text-sm outline-none focus-visible:border-olive"
        />

        {error && (
          <p role="alert" className="mt-3 text-sm text-terracotta-ink">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !token}
          className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-bold text-surface hover:bg-olive disabled:opacity-60"
        >
          {loading ? "Guardando…" : "Restablecer contraseña"}
        </button>
      </form>
    </main>
  );
}
