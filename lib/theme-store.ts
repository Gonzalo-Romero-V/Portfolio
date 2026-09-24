import "server-only";
import { createClient } from "@vercel/global-config";
import { DEFAULT_THEME_PAIR, type ThemeStoreState } from "@/lib/theme-config";

const STORE_KEY = "theme";

// force-cache is required here: @vercel/global-config fetches with
// no-store by default, which would force every route that calls
// readThemeState() into fully dynamic (per-request) rendering — defeating
// the point of keeping app/[locale] statically generated. With
// force-cache, Next's caching applies instead (see the route segment's
// `revalidate` export), and the admin write routes' revalidatePath calls
// are what push a fresh read out on save instead of waiting for that
// window.
const client = process.env.GLOBAL_CONFIG ?? process.env.EDGE_CONFIG
  ? createClient(process.env.GLOBAL_CONFIG ?? process.env.EDGE_CONFIG, { cache: "force-cache" })
  : undefined;

/** Reads the full persisted state (live + default + presets). Falls back to
    an all-default state — never undefined — when Global Config isn't
    connected yet (env var missing — e.g. local dev before the Vercel
    dashboard step) or nothing has ever been saved, so callers never need to
    special-case "no override yet" themselves. */
export async function readThemeState(): Promise<ThemeStoreState> {
  const fallback: ThemeStoreState = { live: DEFAULT_THEME_PAIR, default: DEFAULT_THEME_PAIR, presets: [] };
  if (!client) return fallback;
  try {
    const stored = await client.get<ThemeStoreState>(STORE_KEY);
    return stored ?? fallback;
  } catch (error) {
    console.error("[theme-store] read failed", error);
    return fallback;
  }
}

/** Writes the full state. Global Config has no write method in the SDK on
    purpose (it's built for high-read/rare-write) — writes go through the
    regular Vercel REST API instead. Needs GLOBAL_CONFIG_ID (the store's id)
    and VERCEL_API_TOKEN (a token scoped to the account/team that owns it,
    with Full Account access — Global Config is an account/team-level
    resource, a project-scoped token can't reach it) as server-only env
    vars. */
export async function writeThemeState(state: ThemeStoreState): Promise<void> {
  const storeId = process.env.GLOBAL_CONFIG_ID;
  const token = process.env.VERCEL_API_TOKEN;
  if (!storeId || !token) {
    throw new Error("Global Config write is not configured (GLOBAL_CONFIG_ID / VERCEL_API_TOKEN missing).");
  }

  const url = new URL(`https://api.vercel.com/v1/global-config/${storeId}/items`);
  if (process.env.VERCEL_TEAM_ID) url.searchParams.set("teamId", process.env.VERCEL_TEAM_ID);

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ operation: "upsert", key: STORE_KEY, value: state }],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Global Config write failed (${res.status}): ${body}`);
  }
}
