import { z } from "zod";

export const productSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(120),
  brand: z.string().trim().min(1, "La marca es obligatoria").max(60),
  category: z.enum(["HOMBRE", "MUJER", "UNISEX"]),
  size: z.string().trim().min(1, "La talla es obligatoria").max(20),
  condition: z.enum(["COMO_NUEVA", "POCO_USO", "VINTAGE"]),
  price: z.coerce.number().int().positive("El precio debe ser mayor a 0"),
  originalPrice: z.coerce.number().int().positive().nullable().optional(),
  material: z.string().trim().min(1, "El material es obligatorio").max(200),
  story: z.string().trim().min(1, "Cuenta la historia de la prenda").max(600),
  pairing: z.string().trim().min(1, "Agrega una sugerencia de combinación").max(600),
  measurements: z.record(z.string(), z.coerce.number().positive()),
  images: z.array(z.string().url()).max(6),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});
