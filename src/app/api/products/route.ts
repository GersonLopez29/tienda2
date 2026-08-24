import { NextResponse, after } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/require-user";
import { createProduct } from "@/lib/products";
import { productSchema } from "@/lib/validation";
import { getSubscribersForCategory } from "@/lib/stock-alerts";
import { sendNewStockAlertEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  if (!user.emailVerified) {
    return NextResponse.json({ error: "Verifica tu correo antes de publicar prendas" }, { status: 403 });
  }

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

  after(async () => {
    const subscribers = await getSubscribersForCategory(product.category);
    await Promise.all(
      subscribers
        .filter((s) => s.userId !== user.id)
        .map((s) => sendNewStockAlertEmail(s.user.email, s.user.name, product.title, product.id))
    );
  });

  return NextResponse.json({ product }, { status: 201 });
}
