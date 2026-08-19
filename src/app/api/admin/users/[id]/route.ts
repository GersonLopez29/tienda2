import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-user";
import { setUserBlocked } from "@/lib/users";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { user, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (id === user.id) {
    return NextResponse.json({ error: "No podés bloquearte a vos mismo" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (typeof body?.isBlocked !== "boolean") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const updated = await setUserBlocked(id, body.isBlocked);
  revalidatePath("/admin");
  return NextResponse.json({ user: updated });
}
