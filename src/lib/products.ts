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

export function getAllProducts() {
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export function createProduct(data: ProductInput) {
  return prisma.product.create({ data });
}

export function updateProduct(id: string, data: ProductInput) {
  return prisma.product.update({ where: { id }, data });
}

export function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}
