import "server-only";
import { prisma } from "@/lib/db";

export async function getSellerRatingSummary(sellerId: string) {
  const agg = await prisma.review.aggregate({
    where: { sellerId },
    _avg: { rating: true },
    _count: true,
  });
  return { avg: agg._avg.rating ?? 0, count: agg._count };
}

export function getReviewsForSeller(sellerId: string, limit = 5) {
  return prisma.review.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { author: { select: { name: true } } },
  });
}

export function getMyReviewForSeller(sellerId: string, authorId: string) {
  return prisma.review.findUnique({ where: { sellerId_authorId: { sellerId, authorId } } });
}

export function upsertReview(sellerId: string, authorId: string, rating: number, comment: string) {
  return prisma.review.upsert({
    where: { sellerId_authorId: { sellerId, authorId } },
    create: { sellerId, authorId, rating, comment },
    update: { rating, comment },
  });
}
