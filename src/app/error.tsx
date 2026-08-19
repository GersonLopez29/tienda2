"use client";

import Link from "next/link";

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
      <p className="text-sm font-semibold tracking-wide text-terracotta-ink uppercase">Algo salió mal</p>
      <h1 className="text-3xl font-extrabold text-balance sm:text-4xl">
        Ocurrió un error inesperado
      </h1>
      <p className="max-w-[40ch] text-ink-soft">
        Probá de nuevo en un momento. Si el problema sigue, avisanos.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-surface hover:bg-olive"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-full border border-line-strong px-6 py-3 text-sm font-bold hover:border-ink"
        >
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}
