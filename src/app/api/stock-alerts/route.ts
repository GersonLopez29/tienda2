import { NextResponse } from "next/server";
import { requireUser } from "@/lib/require-user";
import { toggleStockAlert } from "@/lib/stock-alerts";
import { stockAlertSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = stockAlertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const subscribed = await toggleStockAlert(user.id, parsed.data.category);
  return NextResponse.json({ subscribed });
}
