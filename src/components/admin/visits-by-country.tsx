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

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <h2 className="mb-6 text-xl font-extrabold">Visitas por país ({total})</h2>
      <div className="flex flex-col gap-2">
        {visits.length === 0 ? (
          <p className="text-sm text-ink-faint">Todavía no hay visitas registradas.</p>
        ) : (
          visits.map((v) => (
            <div
              key={v.country}
              className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4"
            >
              <span className="text-sm font-bold">{countryLabel(v.country)}</span>
              <span className="fvnum text-sm font-bold text-ink-faint">{v.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
