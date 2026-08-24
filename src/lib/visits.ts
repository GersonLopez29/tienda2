import "server-only";
import { prisma } from "@/lib/db";

export async function recordVisitAndGetCount() {
  const visit = await prisma.pageVisit.upsert({
    where: { id: "home" },
    create: { id: "home", count: 1 },
    update: { count: { increment: 1 } },
  });
  return visit.count;
}
