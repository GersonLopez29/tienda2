import { NextResponse } from "next/server";
import { sendSuggestionEmail } from "@/lib/resend";
import { suggestionSchema } from "@/lib/validation";

// ponytail: no rate limiting/spam protection — add if this gets abused.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = suggestionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  await sendSuggestionEmail(parsed.data.message, parsed.data.contact);
  return NextResponse.json({ ok: true });
}
