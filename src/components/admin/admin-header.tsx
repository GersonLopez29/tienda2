"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminHeader({ title }: { title: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  };

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <div>
          <p className="text-xs text-ink-faint">K&N'Store</p>
          <h1 className="text-lg font-extrabold">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-sm font-semibold text-olive-ink hover:underline">
            Usuarios
          </a>
          <a href="/admin/descuentos" className="text-sm font-semibold text-olive-ink hover:underline">
            Descuentos
          </a>
          <a href="/mis-prendas" className="text-sm font-semibold text-olive-ink hover:underline">
            Mis prendas
          </a>
          <a href="/" className="text-sm font-semibold text-olive-ink hover:underline">
            Ver tienda
          </a>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="rounded-full border border-line-strong px-4 py-2 text-sm font-semibold hover:border-ink disabled:opacity-60"
          >
            {loggingOut ? "Saliendo…" : "Cerrar sesión"}
          </button>
        </div>
      </div>
    </header>
  );
}
