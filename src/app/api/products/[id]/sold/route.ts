import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/require-user";
import { isAdmin } from "@/lib/session";
import { getProductById } from "@/lib/products";
import { prisma } from "@/lib/db";

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
  if (typeof body?.sold !== "boolean") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const product = await prisma.product.update({ where: { id }, data: { sold: body.sold } });
  revalidatePath("/");
  revalidatePath("/mis-prendas");
  revalidatePath(`/producto/${id}`);
  return NextResponse.json({ product });
}
