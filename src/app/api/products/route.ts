import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/require-user";
import { createProduct } from "@/lib/products";
import { productSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const product = await createProduct(
    { ...parsed.data, originalPrice: parsed.data.originalPrice ?? null },
    user.id
  );
  revalidatePath("/");
  revalidatePath("/mis-prendas");
  return NextResponse.json({ product }, { status: 201 });
}
