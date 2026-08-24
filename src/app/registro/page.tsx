"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, whatsapp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo crear la cuenta");
        return;
      }
      router.replace("/?welcome=1");
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-[0_20px_50px_-16px_rgba(46,42,34,0.3)]"
      >
        <h1 className="text-xl font-extrabold text-olive-ink">K&N&apos;Store</h1>
        <p className="mt-1 text-sm text-ink-soft">Crea tu cuenta para comprar o vender</p>

        <label className="mt-6 block text-sm font-semibold" htmlFor="name">
          Nombre
        </label>
        <input
          id="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-line-strong bg-surface-2 px-3.5 py-2.5 text-sm outline-none focus-visible:border-olive"
        />

        <label className="mt-4 block text-sm font-semibold" htmlFor="email">
          Correo
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-line-strong bg-surface-2 px-3.5 py-2.5 text-sm outline-none focus-visible:border-olive"
        />

        <label className="mt-4 block text-sm font-semibold" htmlFor="whatsapp">
          WhatsApp
        </label>
        <input
          id="whatsapp"
          type="tel"
          required
          placeholder="51999999999"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-line-strong bg-surface-2 px-3.5 py-2.5 text-sm outline-none focus-visible:border-olive"
        />
        <p className="mt-1 text-xs text-ink-faint">
          Compradores y vendedores lo usan para coordinar directamente.
        </p>

        <label className="mt-4 block text-sm font-semibold" htmlFor="password">
          Contraseña
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
          disabled={loading}
          className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-bold text-surface hover:bg-olive disabled:opacity-60"
        >
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </button>

        <p className="mt-4 text-center text-sm text-ink-faint">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-olive-ink hover:underline">
            Ingresa
          </Link>
        </p>
      </form>
    </main>
  );
}
