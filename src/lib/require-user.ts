import "server-only";
import { NextResponse } from "next/server";
import { getCurrentUser, isAdmin, type CurrentUser } from "@/lib/session";

/** Defense in depth: proxy already gates the whole site, each handler re-checks. */
export async function requireUser(): Promise<
  { user: CurrentUser; unauthorized: null } | { user: null; unauthorized: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, unauthorized: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
  }
  return { user, unauthorized: null };
}

export async function requireAdmin(): Promise<
  { user: CurrentUser; unauthorized: null } | { user: null; unauthorized: NextResponse }
> {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return { user: null, unauthorized };
  if (!isAdmin(user)) {
    return { user: null, unauthorized: NextResponse.json({ error: "No autorizado" }, { status: 403 }) };
  }
  return { user, unauthorized: null };
}
