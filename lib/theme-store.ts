import "server-only";
import { createClient } from "@vercel/global-config";
import type { ThemeConfig } from "@/lib/theme-config";

const STORE_KEY = "theme";

// force-cache is required here: @vercel/global-config fetches with
// no-store by default, which would force every route that calls readTheme()
// into fully dynamic (per-request) rendering — defeating the point of
// keeping app/[locale] statically generated. With force-cache, Next's
// caching applies instead (see the route segment's `revalidate` export),
// and app/api/admin/theme's revalidatePath call is what pushes a fresh read
// out on save instead of waiting for the time window.
const client = process.env.GLOBAL_CONFIG ?? process.env.EDGE_CONFIG
  ? createClient(process.env.GLOBAL_CONFIG ?? process.env.EDGE_CONFIG, { cache: "force-cache" })
  : undefined;

/** Reads the persisted theme override. Returns undefined if Global Config
    isn't connected yet (env var missing — e.g. local dev before the Vercel
    dashboard step) or nothing has been saved yet, so callers fall back to
    the compiled theme.css defaults instead of crashing. */
export async function readTheme(): Promise<ThemeConfig | undefined> {
  if (!client) return undefined;
  try {
    return await client.get<ThemeConfig>(STORE_KEY);
  } catch (error) {
    console.error("[theme-store] read failed", error);
    return undefined;
  }
}

/** Writes the theme override. Global Config has no write method in the SDK
    on purpose (it's built for high-read/rare-write) — writes go through the
    regular Vercel REST API instead. Needs GLOBAL_CONFIG_ID (the store's id,
    "ecfg_...") and VERCEL_API_TOKEN (a token scoped to the team/account
    that owns it) as server-only env vars. */
export async function writeTheme(theme: ThemeConfig): Promise<void> {
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
      items: [{ operation: "upsert", key: STORE_KEY, value: theme }],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Global Config write failed (${res.status}): ${body}`);
  }
}
