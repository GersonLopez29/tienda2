import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-user";
import { getProductById, setProductDiscount } from "@/lib/products";

const discountSchema = z.object({
  price: z.coerce.number().int().positive("El precio debe ser mayor a 0"),
  originalPrice: z.coerce.number().int().positive().nullable(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await getProductById(id);
  if (!existing) return NextResponse.json({ error: "Prenda no encontrada" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = discountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  if (parsed.data.originalPrice != null && parsed.data.originalPrice <= parsed.data.price) {
    return NextResponse.json(
      { error: "El precio original debe ser mayor al precio con descuento" },
      { status: 400 },
    );
  }

  const product = await setProductDiscount(id, parsed.data.price, parsed.data.originalPrice);
  revalidatePath("/");
  revalidatePath(`/producto/${id}`);
  return NextResponse.json({ product });
}
