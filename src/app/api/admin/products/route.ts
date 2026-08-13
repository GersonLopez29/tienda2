import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { createProduct } from "@/lib/products";
import { productSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const product = await createProduct({
    ...parsed.data,
    originalPrice: parsed.data.originalPrice ?? null,
  });
  return NextResponse.json({ product }, { status: 201 });
}
