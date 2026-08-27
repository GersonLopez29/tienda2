import type { Category, Condition, GarmentType } from "@/generated/prisma/client";

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: Category;
  type: GarmentType;
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
  seller: { id: string; name: string; whatsapp: string };
  createdAt: Date;
  updatedAt: Date;
};

export const CATEGORY_LABEL: Record<Category, string> = {
  HOMBRE: "Hombre",
  MUJER: "Mujer",
  UNISEX: "Unisex",
};

export const TYPE_LABEL: Record<GarmentType, string> = {
  CASACA: "Casaca/Chaqueta",
  HOODIE: "Hoodie/Buzo",
  POLERA: "Polera/Camisa",
  PANTALON: "Pantalón/Jean",
  VESTIDO: "Vestido/Falda",
  ZAPATILLA: "Zapatillas",
  OTRO: "Otro",
};

export const CONDITION_LABEL: Record<Condition, string> = {
  COMO_NUEVA: "Como nueva",
  POCO_USO: "Poco uso",
  VINTAGE: "Vintage",
};
