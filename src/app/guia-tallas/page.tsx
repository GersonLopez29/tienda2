import Link from "next/link";

const MUJER = [
  { talla: "S", busto: "82–87", cintura: "62–67", cadera: "90–95" },
  { talla: "M", busto: "88–93", cintura: "68–73", cadera: "96–101" },
  { talla: "L", busto: "94–99", cintura: "74–79", cadera: "102–107" },
];

const HOMBRE = [
  { talla: "S", pecho: "88–93", cintura: "74–79" },
  { talla: "M", pecho: "94–99", cintura: "80–85" },
  { talla: "L", pecho: "100–105", cintura: "86–91" },
];

function SizeTable({ title, rows }: { title: string; rows: Record<string, string>[] }) {
  const columns = Object.keys(rows[0]);
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
      <h2 className="border-b border-line px-5 py-4 text-sm font-extrabold uppercase tracking-wide">
        {title}
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-faint">
            {columns.map((c) => (
              <th key={c} className="px-5 py-2 font-semibold capitalize">
                {c === "talla" ? "Talla" : `${c} (cm)`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.talla} className="border-t border-line">
              {columns.map((c) => (
                <td key={c} className="fvnum px-5 py-2.5">
                  {row[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const metadata = {
  title: "Guía de tallas — K&N'Store",
  description: "Referencia de medidas en centímetros para tallas S, M y L de ropa de mujer y hombre.",
};

export default function GuiaTallasPage() {
  return (
    <main className="min-h-dvh bg-bg px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-[640px]">
        <p className="text-xs text-ink-faint">K&N&apos;Store</p>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Guía de tallas</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Esta tabla es una referencia general para comparar tallas rápido. Como es ropa de segunda
          mano, cada prenda puede variar un poco según la marca — por eso siempre publicamos las
          medidas exactas de cada pieza en su página de producto.
        </p>

        <SizeTable title="Mujer" rows={MUJER} />
        <SizeTable title="Hombre" rows={HOMBRE} />

        <p className="mt-6 text-xs text-ink-faint">
          ¿Es ropa de niño/a o una talla que no aparece aquí? Revisa las medidas exactas en la
          ficha de cada prenda, o{" "}
          <Link href="/" className="font-bold text-olive-ink underline underline-offset-2">
            vuelve al catálogo
          </Link>{" "}
          y consulta con el vendedor por WhatsApp desde el producto.
        </p>
      </div>
    </main>
  );
}
