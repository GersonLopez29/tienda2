const regionNames = new Intl.DisplayNames(["es"], { type: "region" });

function countryLabel(code: string) {
  if (code === "XX") return "Desconocido";
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export function VisitsByCountry({ visits }: { visits: { country: string; count: number }[] }) {
  const total = visits.reduce((sum, v) => sum + v.count, 0);
  const max = Math.max(1, ...visits.map((v) => v.count));

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <h2 className="mb-6 text-xl font-extrabold">Visitas por país ({total})</h2>
      {visits.length === 0 ? (
        <p className="text-sm text-ink-faint">Todavía no hay visitas registradas.</p>
      ) : (
        <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5">
          {visits.map((v) => {
            const pct = Math.max(4, Math.round((v.count / max) * 100));
            return (
              <div
                key={v.country}
                className="group flex items-center gap-3"
                title={`${countryLabel(v.country)}: ${v.count} visita${v.count === 1 ? "" : "s"}`}
              >
                <span className="w-28 flex-none truncate text-xs font-bold text-ink-soft sm:w-40">
                  {countryLabel(v.country)}
                </span>
                <div className="h-6 min-w-0 flex-1 rounded-sm bg-surface-2">
                  <div
                    className="h-6 rounded-r-[4px] bg-olive transition-[filter] group-hover:brightness-95"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="fvnum w-8 flex-none text-right text-xs font-bold text-ink-faint">{v.count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
