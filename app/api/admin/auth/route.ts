import { NextResponse } from "next/server";
import { isValidAdminSecret } from "@/lib/admin-auth";
import { readThemeState } from "@/lib/theme-store";

/** Verifies the admin passphrase and, in the same round trip, returns the
    full persisted state (live/default/presets) so the console has
    something real to seed itself with. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const secret = typeof body?.secret === "string" ? body.secret : "";

  if (!isValidAdminSecret(secret)) {
    return NextResponse.json({ ok: false, error: "invalid secret" }, { status: 401 });
  }

  const state = await readThemeState();
  return NextResponse.json({ ok: true, state });
}
