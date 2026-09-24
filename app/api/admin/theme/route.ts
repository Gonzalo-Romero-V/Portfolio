import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isValidAdminSecret } from "@/lib/admin-auth";
import { readThemeState, writeThemeState } from "@/lib/theme-store";
import { parseThemeConfig, parseThemeMode } from "@/lib/theme-config";

/** Publishes an edit to ONE mode's "vigente" (live) theme — light and dark
    are saved independently, since they're edited independently. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const secret = typeof body?.secret === "string" ? body.secret : "";

  if (!isValidAdminSecret(secret)) {
    return NextResponse.json({ ok: false, error: "invalid secret" }, { status: 401 });
  }

  const mode = parseThemeMode(body?.mode);
  const theme = parseThemeConfig(body?.theme);
  if (!mode || !theme) {
    return NextResponse.json({ ok: false, error: "invalid theme payload" }, { status: 400 });
  }

  const state = await readThemeState();
  state.live = { ...state.live, [mode]: theme };

  try {
    await writeThemeState(state);
  } catch (error) {
    console.error("[api/admin/theme] write failed", error);
    return NextResponse.json({ ok: false, error: "storage write failed" }, { status: 502 });
  }

  // Every locale page shares app/[locale]/layout.tsx — this is the "refresh
  // everything" recipe (revalidatePath docs, "Revalidating all data").
  // Route Handlers revalidate on the NEXT visit to each path, not this
  // instant, so the very first visitor after a save can still get the old
  // cached HTML while it regenerates in the background.
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, state });
}
