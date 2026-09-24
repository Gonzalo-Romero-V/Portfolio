import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isValidAdminSecret } from "@/lib/admin-auth";
import { readThemeState, writeThemeState } from "@/lib/theme-store";

/** The two actions that treat "default" as its own value, separate from
    "vigente" (see the comment on ThemeStoreState in lib/theme-config.ts):

    - "promote": approving something as live does NOT make it the default —
      this is the explicit, separate step that does. Copies live → default.
    - "restore": the recovery action. Copies default → live (and publishes
      it, same as a normal save) — "go back to the safety net" for when an
      edit went wrong. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const secret = typeof body?.secret === "string" ? body.secret : "";

  if (!isValidAdminSecret(secret)) {
    return NextResponse.json({ ok: false, error: "invalid secret" }, { status: 401 });
  }

  const action = body?.action;
  if (action !== "promote" && action !== "restore") {
    return NextResponse.json({ ok: false, error: "invalid action" }, { status: 400 });
  }

  const state = await readThemeState();
  if (action === "promote") {
    state.default = state.live;
  } else {
    state.live = state.default;
  }

  try {
    await writeThemeState(state);
  } catch (error) {
    console.error("[api/admin/theme/default] write failed", error);
    return NextResponse.json({ ok: false, error: "storage write failed" }, { status: 502 });
  }

  // "promote" only touches `default`, which visitors never read directly —
  // no need to revalidate. "restore" changes `live`, which they do.
  if (action === "restore") revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, state });
}
