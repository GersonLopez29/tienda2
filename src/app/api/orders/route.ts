import { NextResponse } from "next/server";
import { requireUser } from "@/lib/require-user";
import { createOrder } from "@/lib/orders";
import { orderSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const order = await createOrder(user.id, parsed.data.sellerId, parsed.data.items);
  return NextResponse.json({ order }, { status: 201 });
}
