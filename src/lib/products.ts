import "server-only";
import { prisma } from "@/lib/db";
import type { Category, Condition } from "@/generated/prisma/client";

export type ProductMeasurements = Record<string, number>;

export type ProductInput = {
  title: string;
  brand: string;
  category: Category;
  size: string;
  condition: Condition;
  price: number;
  originalPrice: number | null;
  material: string;
  story: string;
  pairing: string;
  measurements: ProductMeasurements;
  images: string[];
};

const SELLER_SELECT = { id: true, name: true, whatsapp: true } as const;

export function getAllProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { seller: { select: SELLER_SELECT } },
  });
}

export function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { seller: { select: SELLER_SELECT } },
  });
}

export function getProductsBySeller(sellerId: string) {
  return prisma.product.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
    include: { seller: { select: SELLER_SELECT } },
  });
}

export function createProduct(data: ProductInput, sellerId: string) {
  return prisma.product.create({ data: { ...data, sellerId } });
}

export function updateProduct(id: string, data: ProductInput) {
  return prisma.product.update({ where: { id }, data });
}

export function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export function setProductDiscount(id: string, price: number, originalPrice: number | null) {
  return prisma.product.update({ where: { id }, data: { price, originalPrice } });
}
