import "server-only";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/** Defense in depth: proxy already gates /api/admin/*, but each handler re-checks. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}
