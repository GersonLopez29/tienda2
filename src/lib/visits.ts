import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export async function recordVisitAndGetCount() {
  const country = (await headers()).get("x-vercel-ip-country") ?? "XX";
  const [visit] = await Promise.all([
    prisma.pageVisit.upsert({
      where: { id: "home" },
      create: { id: "home", count: 1 },
      update: { count: { increment: 1 } },
    }),
    prisma.countryVisit.upsert({
      where: { country },
      create: { country, count: 1 },
      update: { count: { increment: 1 } },
    }),
  ]);
  return visit.count;
}

export function getVisitsByCountry() {
  return prisma.countryVisit.findMany({ orderBy: { count: "desc" } });
}
