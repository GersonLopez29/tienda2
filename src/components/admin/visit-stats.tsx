const regionNames = new Intl.DisplayNames(["es"], { type: "region" });

function countryLabel(code: string) {
  if (code === "XX") return "Desconocido";
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

function shortDate(isoDate: string) {
  const [, month, day] = isoDate.split("-");
  return `${day}/${month}`;
}

const TOP_COUNTRIES = 7;

export type VisitStats = {
  total: number;
  today: number;
  last7Days: number;
  daily: { date: string; count: number }[];
  byCountry: { country: string; count: number }[];
};

export function VisitStats({ stats }: { stats: VisitStats }) {
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.count));
  const top = stats.byCountry.slice(0, TOP_COUNTRIES);
  const restCount = stats.byCountry.slice(TOP_COUNTRIES).reduce((sum, c) => sum + c.count, 0);
  const rows = restCount > 0 ? [...top, { country: "__rest", count: restCount }] : top;
  const maxCountry = Math.max(1, ...rows.map((r) => r.count));

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <h2 className="mb-6 text-xl font-extrabold">Estadísticas de visitas</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Visitas totales", value: stats.total },
          { label: "Hoy", value: stats.today },
          { label: "Últimos 7 días", value: stats.last7Days },
        ].map((tile) => (
          <div key={tile.label} className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-xs font-bold tracking-wide text-ink-faint uppercase">{tile.label}</p>
            <p className="fvnum mt-1 text-3xl font-extrabold">{tile.value.toLocaleString("es-PE")}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
        <p className="mb-4 text-sm font-bold">Visitas por día (últimos 30 días)</p>
        <div className="overflow-x-auto">
          <div className="flex h-32 min-w-[500px] gap-1">
            {stats.daily.map((d) => (
              <div key={d.date} className="group relative h-full flex-1" title={`${shortDate(d.date)}: ${d.count} visitas`}>
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-[4px] bg-olive transition-[filter] group-hover:brightness-95"
                  style={{ height: `${Math.max(2, Math.round((d.count / maxDaily) * 100))}%` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-semibold text-ink-faint">
          <span>{shortDate(stats.daily[0].date)}</span>
          <span>{shortDate(stats.daily[stats.daily.length - 1].date)}</span>
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer select-none text-xs font-bold text-olive-ink">Ver tabla de datos</summary>
          <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-line">
            <table className="w-full text-xs">
              <tbody>
                {stats.daily
                  .slice()
                  .reverse()
                  .map((d) => (
                    <tr key={d.date} className="border-b border-line last:border-b-0">
                      <td className="px-3 py-1.5 text-ink-soft">{shortDate(d.date)}</td>
                      <td className="fvnum px-3 py-1.5 text-right font-bold text-ink-faint">{d.count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
        <p className="mb-4 text-sm font-bold">Visitas por país</p>
        {rows.length === 0 ? (
          <p className="text-sm text-ink-faint">Todavía no hay visitas registradas.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {rows.map((r) => {
              const isRest = r.country === "__rest";
              const pct = Math.max(4, Math.round((r.count / maxCountry) * 100));
              return (
                <div key={r.country} className="flex items-center gap-3">
                  <span className="w-32 flex-none truncate text-xs font-bold text-ink-soft sm:w-44">
                    {isRest ? "Otros países" : countryLabel(r.country)}
                  </span>
                  <div className="h-6 min-w-0 flex-1 rounded-sm bg-surface-2">
                    <div
                      className={`h-6 rounded-r-[4px] ${isRest ? "bg-ink-faint" : "bg-olive"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="fvnum w-10 flex-none text-right text-xs font-bold text-ink-faint">{r.count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
