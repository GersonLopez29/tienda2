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

export async function getVisitStats() {
  const [pageVisit, rows] = await Promise.all([
    prisma.pageVisit.findUnique({ where: { id: "home" } }),
    prisma.countryVisit.findMany(),
  ]);

  const todayDate = today();
  const todayKey = todayDate.toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(todayDate);
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);

  let todayCount = 0;
  let last7Days = 0;
  const dailyTotals = new Map<string, number>();
  const countryTotals = new Map<string, number>();

  for (const row of rows) {
    const key = row.date.toISOString().slice(0, 10);
    dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + row.count);
    countryTotals.set(row.country, (countryTotals.get(row.country) ?? 0) + row.count);
    if (key === todayKey) todayCount += row.count;
    if (row.date >= sevenDaysAgo) last7Days += row.count;
  }

  const daily = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(todayDate);
    d.setUTCDate(d.getUTCDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    return { date: key, count: dailyTotals.get(key) ?? 0 };
  });

  const byCountry = [...countryTotals.entries()]
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  return { total: pageVisit?.count ?? 0, today: todayCount, last7Days, daily, byCountry };
}
