import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-user";
import { setUserBlocked, deleteUser } from "@/lib/users";
import { Prisma } from "@/generated/prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { user, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (id === user.id) {
    return NextResponse.json({ error: "No puedes bloquearte a ti mismo" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (typeof body?.isBlocked !== "boolean") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const updated = await setUserBlocked(id, body.isBlocked);
  revalidatePath("/admin");
  return NextResponse.json({ user: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { user, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (id === user.id) {
    return NextResponse.json({ error: "No puedes eliminarte a ti mismo" }, { status: 400 });
  }

  try {
    await deleteUser(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return NextResponse.json(
        { error: "No se puede eliminar: el usuario tiene prendas publicadas" },
        { status: 409 },
      );
    }
    throw error;
  }

  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
