import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

function today() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function recordVisitAndGetCount() {
  const country = (await headers()).get("x-vercel-ip-country") ?? "XX";
  const date = today();
  const [visit] = await Promise.all([
    prisma.pageVisit.upsert({
      where: { id: "home" },
      create: { id: "home", count: 1 },
      update: { count: { increment: 1 } },
    }),
    prisma.countryVisit.upsert({
      where: { country_date: { country, date } },
      create: { country, date, count: 1 },
      update: { count: { increment: 1 } },
    }),
  ]);
  return visit.count;
}

export async function getVisitsByCountry() {
  const rows = await prisma.countryVisit.findMany({ orderBy: [{ date: "desc" }, { count: "desc" }] });
  const byDate = new Map<string, { country: string; count: number }[]>();
  for (const row of rows) {
    const key = row.date.toISOString().slice(0, 10);
    const list = byDate.get(key) ?? [];
    list.push({ country: row.country, count: row.count });
    byDate.set(key, list);
  }
  return [...byDate.entries()].map(([date, countries]) => ({ date, countries }));
}
