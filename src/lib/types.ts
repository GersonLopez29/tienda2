import type { Category, Condition } from "@/generated/prisma/client";

export type Product = {
  id: string;
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
  measurements: Record<string, number>;
  images: string[];
  sold: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const CATEGORY_LABEL: Record<Category, string> = {
  HOMBRE: "Hombre",
  MUJER: "Mujer",
  UNISEX: "Unisex",
};

export const CONDITION_LABEL: Record<Condition, string> = {
  COMO_NUEVA: "Como nueva",
  POCO_USO: "Poco uso",
  VINTAGE: "Vintage",
};
