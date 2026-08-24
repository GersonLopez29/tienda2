import "server-only";
import { prisma } from "@/lib/db";

export type OrderItemInput = { productId: string; title: string; price: number; qty: number };

export function createOrder(buyerId: string, sellerId: string, items: OrderItemInput[]) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return prisma.order.create({
    data: {
      buyerId,
      sellerId,
      total,
      items: { create: items },
    },
  });
}

export function getOrdersForBuyer(buyerId: string) {
  return prisma.order.findMany({
    where: { buyerId },
    orderBy: { createdAt: "desc" },
    include: { seller: { select: { name: true } }, items: true },
  });
}
