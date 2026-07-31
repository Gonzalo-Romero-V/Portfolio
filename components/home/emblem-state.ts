import type { BlobParams } from "@/components/home/blob-path";

export interface RimParams {
  /** Stroke alpha, 0..1. */
  opacity: number;
  /** Crisp stroke width, px. */
  width: number;
  /** 0 = hairline only. Higher adds a soft blurred duplicate behind it
      (the "hairline rim + soft glow" recipe glassmorphism guides call for). */
  glow: number;
}

export interface GlowConfig {
  /** External glow alpha — an enlarged, blurred, unclipped copy of the
      circle's own silhouette sitting behind it. 0 turns it off. */
  opacity: number;
  /** Blur radius, px. */
  blur: number;
  /** Multiplies the circle's radius for the glow silhouette ("spread"). */
  spread: number;
}

export interface BackdropConfig {
  /** backdrop-filter blur, px. 0 = no glass effect (a plain solid circle). */
  blur: number;
  /** backdrop-filter saturate(), % — professional glass recipes lean on
      150-200% so what's behind doesn't read as washed-out. */
  saturate: number;
}

/** One full "circle" layer: every circle in the emblem (big or small) is
    configured with exactly this same shape — position/size, internal fill
    strength, external glow, glass backdrop, and rim/edge. Color (hue/
    saturation) is deliberately NOT part of this: see ColorableCircleLayer. */
export interface CircleLayer {
  blob: BlobParams;
  /** Strength of the circle's own internal fill/tint, 0..1. */
  fillAlpha: number;
  glow: GlowConfig;
  backdrop: BackdropConfig;
  rim: RimParams;
}

/** A circle layer with its own independent color. Used for the small
    (glass) circle — the big one instead inherits hue/saturation live from
    the site's --primary-h/-s (see ProfileEmblem), so its color is never
    hardcoded independently of the site theme. Glow/backdrop/rim strength
    stay per-component either way — inheriting a hue doesn't mean
    inheriting how intensely it glows. */
export interface ColorableCircleLayer extends CircleLayer {
  hue: number;
  saturation: number;
}

export interface TextPosition {
  /** Right-edge anchor, 0..1 of the container width (block grows leftward from here). */
  x: number;
  /** Top edge of the text block, 0..1 of the container height. */
  y: number;
  /** Max width of the text block, 0..1 of the container width. */
  width: number;
  /** Name font size, px. */
  nameSize: number;
  /** Tagline font size, px. */
  taglineSize: number;
  /** Gap between name and tagline, px. */
  gap: number;
}

export interface SocialConfig {
  /** Circular button diameter, px. */
  buttonSize: number;
  /** Glyph size, px. */
  iconSize: number;
  /** Gap between buttons, px. */
  gap: number;
  /** Space above the row (from the tagline), px. */
  marginTop: number;
}

export interface ImageTransform {
  /** Horizontal center of the image, % of the container. */
  x: number;
  /** Vertical center of the image, % of the container. */
  y: number;
  /** Image width, % of the container (height follows its natural aspect
      ratio — no cropping, no object-fit, just a plain resized <img>). */
  size: number;
  /** Hidden ≠ deleted: everything about the photo (position, size, the
      intersection clip) stays defined, it just doesn't render. */
  visible: boolean;
}

/** The site's brand hue, lifted out of CSS custom properties into React
    state so the big circle (see ProfileEmblem) can read it directly instead
    of polling the DOM — and so the Site-theme sliders and --primary-h/-s/-l
    on :root always agree. */
export interface PrimaryHsl {
  h: number;
  s: number;
  l: number;
}

export interface EmblemState {
  /** How much bigger the working canvas is than the visible square, so the
      two circles have room to pan/grow before hitting the frame — applies
      only to the circle layers, never to the photo. See canvas-space.ts. */
  canvasScale: number;

  big: CircleLayer;
  small: ColorableCircleLayer;

  photoOpacity: number;
  image: ImageTransform;
  text: TextPosition;
  social: SocialConfig;
}

// Frozen from the tuner's "copy config JSON" — the emblem's actual look now
// lives here, not scattered across separate turn-by-turn patches. The
// tuner (components/home/emblem-tuner.tsx) stays available for further
// iteration; it always starts from these values and its "reset" buttons
// return to them.
export const defaultEmblemState: EmblemState = {
  canvasScale: 1.05,

  big: {
    blob: { cx: 0.51, cy: 0.44, radius: 0.44, scale: 1, points: 12, irregularity: 0.31, seed: 7, rotation: 57 },
    fillAlpha: 1,
    glow: { opacity: 0.34, blur: 80, spread: 1.15 },
    backdrop: { blur: 0, saturate: 100 },
    rim: { opacity: 0.22, width: 1, glow: 0 },
  },
  small: {
    blob: { cx: 0.59, cy: 0.32, radius: 0.28, scale: 1, points: 8, irregularity: 0.29, seed: 42, rotation: 81 },
    hue: 0,
    saturation: 0,
    fillAlpha: 0.35,
    glow: { opacity: 0.12, blur: 40, spread: 1.1 },
    backdrop: { blur: 18, saturate: 180 },
    rim: { opacity: 0.18, width: 1, glow: 0 },
  },

  photoOpacity: 1,
  image: { x: 55, y: 44, size: 58, visible: false },
  text: { x: 0.83, y: 0.64, width: 0.6, nameSize: 26, taglineSize: 9, gap: 2 },
  social: { buttonSize: 24, iconSize: 11, gap: 6, marginTop: 8 },
};
