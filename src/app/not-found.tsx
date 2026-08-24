import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
      <p className="text-sm font-semibold tracking-wide text-olive-ink uppercase">Error 404</p>
      <h1 className="text-3xl font-extrabold text-balance sm:text-4xl">
        No encontramos esta página
      </h1>
      <p className="max-w-[40ch] text-ink-soft">
        Puede que la prenda ya se haya vendido o que el enlace esté roto.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-ink px-6 py-3 text-sm font-bold text-surface hover:bg-olive"
      >
        Volver a la tienda
      </Link>
    </main>
  );
}
