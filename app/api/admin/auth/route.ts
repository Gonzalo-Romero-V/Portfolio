import { NextResponse } from "next/server";
import { isValidAdminSecret } from "@/lib/admin-auth";
import { readTheme } from "@/lib/theme-store";
import { DEFAULT_THEME } from "@/lib/theme-config";

/** Verifies the admin passphrase and, in the same round trip, returns the
    current theme (persisted value if one was ever saved, DEFAULT_THEME
    otherwise) so the console has something real to seed its sliders with —
    not the CSS defaults baked into this document, which for /admin's own
    independent layout would be the theme.css compile-time values, not
    necessarily what's live for visitors. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const secret = typeof body?.secret === "string" ? body.secret : "";

  if (!isValidAdminSecret(secret)) {
    return NextResponse.json({ ok: false, error: "invalid secret" }, { status: 401 });
  }

  const theme = (await readTheme()) ?? DEFAULT_THEME;
  return NextResponse.json({ ok: true, theme });
}
