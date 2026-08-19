import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/require-user";
import { isAdmin } from "@/lib/session";
import { getProductById, updateProduct, deleteProduct } from "@/lib/products";
import { productSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await getProductById(id);
  if (!existing) return NextResponse.json({ error: "Prenda no encontrada" }, { status: 404 });
  if (existing.sellerId !== user.id && !isAdmin(user)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const product = await updateProduct(id, {
    ...parsed.data,
    originalPrice: parsed.data.originalPrice ?? null,
  });
  revalidatePath("/");
  revalidatePath("/mis-prendas");
  revalidatePath(`/producto/${id}`);
  return NextResponse.json({ product });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await getProductById(id);
  if (!existing) return NextResponse.json({ error: "Prenda no encontrada" }, { status: 404 });
  if (existing.sellerId !== user.id && !isAdmin(user)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await deleteProduct(id);
  revalidatePath("/");
  revalidatePath("/mis-prendas");
  return NextResponse.json({ ok: true });
}
