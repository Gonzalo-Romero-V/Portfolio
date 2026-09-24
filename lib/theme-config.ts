/** Shared shape for the site-wide appearance override the admin console
    edits. Used by: the admin UI (components/admin/*), the two protected
    routes (app/api/admin/*), and the public root layout that applies it
    (app/[locale]/layout.tsx) — one definition instead of three copies. */

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
  /** true = tone tracks --primary-h - 13 / 80% / 33% (theme.css's own
      calc()); false = `tone` below is a literal override. */
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

/** Mirrors app/theme.css's :root (light theme) values — the starting point
    before any admin edit has ever been saved. Not necessarily what .dark
    shows (its --primary-l/--mesh-2-h differ); see the layout override
    comment in app/[locale]/layout.tsx for why that's an accepted tradeoff. */
export const DEFAULT_THEME: ThemeConfig = {
  brand: { h: 149, s: 51, l: 62 },
  background: {
    opacity: 0.7,
    blurScale: 0.52,
    speed: 2.5,
    amount: 2.85,
    cursor: 0,
    toneAnchored: true,
    tone: { h: 149 - 13, s: 80, l: 33 },
  },
  chrome: { opacity: 44, blur: 0 },
};

/** Same ranges as the sliders in components/admin/*-section.tsx. Runtime
    validation for data crossing a trust boundary (an authenticated request
    body is still attacker-shaped input, and Global Config has no schema of
    its own) — rejects anything malformed instead of writing it through to
    the store and, from there, into every visitor's <html style>. */
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
