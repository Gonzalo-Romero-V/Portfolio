/** Shared shape for the site-wide appearance the admin console edits. Used
    by: the admin UI (components/admin/*), the protected routes
    (app/api/admin/*), and the public root layout that applies it
    (app/[locale]/layout.tsx) — one definition instead of scattered copies. */

export interface BrandColor {
  h: number;
  s: number;
  l: number;
}

export interface ToneConfig {
  h: number;
  s: number;
  l: number;
}

export interface BackgroundConfig {
  opacity: number;
  blurScale: number;
  speed: number;
  amount: number;
  cursor: number;
  /** true = tone tracks --primary-h - 13 / 80% / 33% (a calc()-from-primary
      relationship); false = `tone` below is a literal value. theme.css's
      compiled defaults are NOT anchored (see DEFAULT_THEME_PAIR) — this
      only matters once someone edits away from them. */
  toneAnchored: boolean;
  tone: ToneConfig;
}

export interface ChromeConfig {
  opacity: number;
  blur: number;
}

export interface ThemeConfig {
  brand: BrandColor;
  background: BackgroundConfig;
  chrome: ChromeConfig;
}

export type ThemeMode = "light" | "dark";

/** Light and dark are edited independently — theme.css itself keeps them
    separate (:root vs .dark), so "vigente" and "default" both need one
    ThemeConfig per mode, not a single value applied to both. */
export type ThemePair = Record<ThemeMode, ThemeConfig>;

export interface ThemePreset {
  id: string;
  name: string;
  theme: ThemePair;
  createdAt: number;
}

/** Everything persisted in the store, under one Global Config key:
    - live: what's actually served to visitors right now ("vigente").
    - default: the safety net "restaurar a default" reverts to. Does NOT
      change when `live` changes — only an explicit "promote" call copies
      live → default (see app/api/admin/theme/default/route.ts).
    - presets: named snapshots of `live`, saved/applied/deleted on demand. */
export interface ThemeStoreState {
  live: ThemePair;
  default: ThemePair;
  presets: ThemePreset[];
}

/** Transcribed directly from app/theme.css's :root and .dark blocks — the
    site's real compiled appearance before any admin edit. This is what
    ThemeStoreState.default seeds to on first read (see readThemeState in
    lib/theme-store.ts) and what "restaurar a default" returns to until an
    admin explicitly promotes a different live value over it.

    Note --mesh-2-* is a literal value in BOTH modes in theme.css, not the
    "--primary-h - 13 / 80% / 33%" anchor formula the old dev-only tuner
    (components/home/site-mesh-controls.tsx) offers as a convenience — so
    toneAnchored is false here, matching the actual compiled CSS exactly. */
export const DEFAULT_THEME_PAIR: ThemePair = {
  light: {
    brand: { h: 149, s: 51, l: 62 },
    background: {
      opacity: 0.7,
      blurScale: 0.52,
      speed: 2.5,
      amount: 2.85,
      cursor: 0,
      toneAnchored: false,
      tone: { h: 130, s: 100, l: 33 },
    },
    chrome: { opacity: 44, blur: 0 },
  },
  dark: {
    brand: { h: 149, s: 51, l: 45 },
    background: {
      // Not redeclared under .dark in theme.css, so they're the same
      // numbers as :root's — .dark only overrides brand.l and mesh-2-h.
      opacity: 0.7,
      blurScale: 0.52,
      speed: 2.5,
      amount: 2.85,
      cursor: 0,
      toneAnchored: false,
      tone: { h: 173, s: 100, l: 33 },
    },
    chrome: { opacity: 44, blur: 0 },
  },
};

/** Same ranges as the sliders in components/admin/*-section.tsx. Runtime
    validation for data crossing a trust boundary (an authenticated request
    body is still attacker-shaped input, and Global Config has no schema of
    its own) — rejects anything malformed instead of writing it through to
    the store and, from there, into every visitor's <html>. */
function num(value: unknown, min: number, max: number): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value < min || value > max ? null : value;
}

export function parseThemeConfig(input: unknown): ThemeConfig | null {
  if (typeof input !== "object" || input === null) return null;
  const v = input as Record<string, unknown>;
  const brand = v.brand as Record<string, unknown> | undefined;
  const background = v.background as Record<string, unknown> | undefined;
  const chrome = v.chrome as Record<string, unknown> | undefined;
  if (!brand || !background || !chrome) return null;

  const h = num(brand.h, 0, 360);
  const s = num(brand.s, 0, 100);
  const l = num(brand.l, 10, 90);

  const opacity = num(background.opacity, 0, 2);
  const blurScale = num(background.blurScale, 0.2, 2);
  const speed = num(background.speed, 0, 3);
  const amount = num(background.amount, 0, 3);
  const cursor = num(background.cursor, 0, 2);
  const toneAnchored = typeof background.toneAnchored === "boolean" ? background.toneAnchored : null;
  const toneRaw = background.tone as Record<string, unknown> | undefined;
  const toneH = toneRaw ? num(toneRaw.h, -180, 180) : null;
  const toneS = toneRaw ? num(toneRaw.s, 0, 100) : null;
  const toneL = toneRaw ? num(toneRaw.l, 10, 90) : null;

  const chromeOpacity = num(chrome.opacity, 30, 100);
  const chromeBlur = num(chrome.blur, 0, 80);

  if (
    h === null || s === null || l === null ||
    opacity === null || blurScale === null || speed === null || amount === null || cursor === null ||
    toneAnchored === null || toneH === null || toneS === null || toneL === null ||
    chromeOpacity === null || chromeBlur === null
  ) {
    return null;
  }

  return {
    brand: { h, s, l },
    background: { opacity, blurScale, speed, amount, cursor, toneAnchored, tone: { h: toneH, s: toneS, l: toneL } },
    chrome: { opacity: chromeOpacity, blur: chromeBlur },
  };
}

export function parseThemeMode(input: unknown): ThemeMode | null {
  return input === "light" || input === "dark" ? input : null;
}

function cssVars(theme: ThemeConfig): string {
  const vars: Record<string, string> = {
    "--primary-h": `${theme.brand.h}`,
    "--primary-s": `${theme.brand.s}%`,
    "--primary-l": `${theme.brand.l}%`,
    "--mesh-opacity": `${theme.background.opacity}`,
    "--mesh-blur-scale": `${theme.background.blurScale}`,
    "--mesh-speed": `${theme.background.speed}`,
    "--mesh-amount": `${theme.background.amount}`,
    "--mesh-cursor": `${theme.background.cursor}`,
    "--mesh-2-h": `${theme.background.tone.h}`,
    "--mesh-2-s": `${theme.background.tone.s}%`,
    "--mesh-2-l": `${theme.background.tone.l}%`,
    "--chrome-opacity": `${theme.chrome.opacity}%`,
    "--chrome-blur": `${theme.chrome.blur}px`,
  };
  return Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}

/** A <style> block's worth of CSS overriding both modes at once, one
    selector per mode. Used identically on the server (app/[locale]/layout.tsx,
    the real override visitors get) and on the client (components/admin/
    admin-console.tsx, live-previewing an unsaved edit in that tab) — same
    mechanism, same specificity trick, so what the admin sees IS what
    visitors would see. `html:root`/`html.dark` (not plain `:root`/`.dark`)
    only to guarantee this wins over theme.css's own rules regardless of
    stylesheet order, not because the extra specificity is otherwise
    needed. */
export function themePairToCss(pair: ThemePair): string {
  return `html:root{${cssVars(pair.light)}}html.dark{${cssVars(pair.dark)}}`;
}

export function parseThemePair(input: unknown): ThemePair | null {
  if (typeof input !== "object" || input === null) return null;
  const v = input as Record<string, unknown>;
  const light = parseThemeConfig(v.light);
  const dark = parseThemeConfig(v.dark);
  if (!light || !dark) return null;
  return { light, dark };
}
