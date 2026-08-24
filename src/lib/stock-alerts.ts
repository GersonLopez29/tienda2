import "server-only";
import { prisma } from "@/lib/db";
import type { Category } from "@/generated/prisma/client";

export async function getUserAlertCategories(userId: string) {
  const alerts = await prisma.stockAlert.findMany({ where: { userId }, select: { category: true } });
  return new Set(alerts.map((a) => a.category));
}

export async function toggleStockAlert(userId: string, category: Category) {
  const existing = await prisma.stockAlert.findUnique({
    where: { userId_category: { userId, category } },
  });
  if (existing) {
    await prisma.stockAlert.delete({ where: { id: existing.id } });
    return false;
  }
  await prisma.stockAlert.create({ data: { userId, category } });
  return true;
}

export function getSubscribersForCategory(category: Category) {
  return prisma.stockAlert.findMany({
    where: { category },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}
