const regionNames = new Intl.DisplayNames(["es"], { type: "region" });

function countryLabel(code: string) {
  if (code === "XX") return "Desconocido";
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

function dateLabel(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export type VisitsByDate = { date: string; countries: { country: string; count: number }[] };

export function VisitsByCountry({ visits }: { visits: VisitsByDate[] }) {
  const total = visits.reduce((sum, day) => sum + day.countries.reduce((s, c) => s + c.count, 0), 0);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <h2 className="mb-6 text-xl font-extrabold">Visitas por país y fecha ({total})</h2>
      <div className="flex flex-col gap-4">
        {visits.length === 0 ? (
          <p className="text-sm text-ink-faint">Todavía no hay visitas registradas.</p>
        ) : (
          visits.map((day) => (
            <div key={day.date} className="rounded-2xl border border-line bg-surface p-4">
              <p className="mb-3 text-xs font-bold tracking-wide text-ink-faint uppercase">{dateLabel(day.date)}</p>
              <div className="flex flex-col gap-2">
                {day.countries.map((c) => (
                  <div key={c.country} className="flex items-center justify-between">
                    <span className="text-sm font-bold">{countryLabel(c.country)}</span>
                    <span className="fvnum text-sm font-bold text-ink-faint">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
