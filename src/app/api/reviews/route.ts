import { NextResponse } from "next/server";
import { requireUser } from "@/lib/require-user";
import { upsertReview } from "@/lib/reviews";
import { reviewSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  if (parsed.data.sellerId === user.id) {
    return NextResponse.json({ error: "No puedes reseñarte a ti mismo" }, { status: 400 });
  }

  const review = await upsertReview(parsed.data.sellerId, user.id, parsed.data.rating, parsed.data.comment);
  return NextResponse.json({ review }, { status: 201 });
}
