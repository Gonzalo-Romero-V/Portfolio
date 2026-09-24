import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isValidAdminSecret } from "@/lib/admin-auth";
import { readThemeState, writeThemeState } from "@/lib/theme-store";
import type { ThemePreset } from "@/lib/theme-config";

const MAX_NAME_LENGTH = 60;
const MAX_PRESETS = 50; // generous relative to the 1MB store limit, just a sanity cap

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const secret = typeof body?.secret === "string" ? body.secret : "";

  if (!isValidAdminSecret(secret)) {
    return NextResponse.json({ ok: false, error: "invalid secret" }, { status: 401 });
  }

  const action = body?.action;
  const state = await readThemeState();

  if (action === "save") {
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    if (!name || name.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ ok: false, error: "invalid preset name" }, { status: 400 });
    }
    if (state.presets.length >= MAX_PRESETS) {
      return NextResponse.json({ ok: false, error: "too many presets — delete one first" }, { status: 400 });
    }
    const preset: ThemePreset = {
      id: crypto.randomUUID(),
      name,
      theme: state.live, // snapshots what's live right now (both modes)
      createdAt: Date.now(),
    };
    state.presets = [...state.presets, preset];
  } else if (action === "apply") {
    const id = typeof body?.id === "string" ? body.id : "";
    const preset = state.presets.find((p) => p.id === id);
    if (!preset) {
      return NextResponse.json({ ok: false, error: "preset not found" }, { status: 404 });
    }
    state.live = preset.theme;
  } else if (action === "delete") {
    const id = typeof body?.id === "string" ? body.id : "";
    state.presets = state.presets.filter((p) => p.id !== id);
  } else {
    return NextResponse.json({ ok: false, error: "invalid action" }, { status: 400 });
  }

  try {
    await writeThemeState(state);
  } catch (error) {
    console.error("[api/admin/theme/presets] write failed", error);
    return NextResponse.json({ ok: false, error: "storage write failed" }, { status: 502 });
  }

  // Only "apply" changes what visitors see (`live`) — "save"/"delete" only
  // touch the presets list.
  if (action === "apply") revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, state });
}
