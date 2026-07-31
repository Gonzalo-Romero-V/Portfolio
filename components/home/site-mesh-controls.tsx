"use client";

import { useState } from "react";
import { readCssVarNumber } from "@/components/home/css-var";

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-0.5 font-mono text-[10px] text-muted-foreground/80">
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="text-foreground/70">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="accent-primary disabled:opacity-40"
      />
    </label>
  );
}

const VARS = {
  opacity: "--mesh-opacity",
  blurScale: "--mesh-blur-scale",
  speed: "--mesh-speed",
  amount: "--mesh-amount",
  cursor: "--mesh-cursor",
} as const;

const DEFAULTS = { opacity: 0.7, blurScale: 0.52, speed: 2.5, amount: 2.85, cursor: 0 };

const TONE_VARS = { h: "--mesh-2-h", s: "--mesh-2-s", l: "--mesh-2-l" } as const;

/** Reads the tone's CURRENT effective value. While anchored, this
    reproduces app/theme.css's original relationship exactly: hue tracks
    --primary-h (that part was always anchored), saturation/lightness are
    fixed at the project's original 80%/33% — they were NEVER meant to
    track --primary-s/-l, on purpose, so this doesn't read --primary-s here.
    (--mesh-2-h is itself calc()'d off --primary-h in app/theme.css, and
    getComputedStyle doesn't reliably resolve nested calc()/var() custom
    properties to a plain number — it can return the substituted-but-
    unevaluated expression string, which parseFloat can't read — so this
    recomputes hue from the primitive instead of reading --mesh-2-h
    directly, to avoid going stale.) Once unanchored, --mesh-2-* holds a
    real literal value (no calc chain), so reading it directly is fine. */
function readTone(anchored: boolean) {
  if (anchored) {
    return {
      h: readCssVarNumber("--primary-h", 8) - 13,
      s: 80,
      l: 33,
    };
  }
  return {
    h: readCssVarNumber(TONE_VARS.h, -5),
    s: readCssVarNumber(TONE_VARS.s, 80),
    l: readCssVarNumber(TONE_VARS.l, 33),
  };
}

/** The ambient background mesh's procedural motion — --mesh-* in
    app/theme.css, read live each animation frame by
    components/layout/site-background.tsx (which lives in the root layout,
    outside this component's tree entirely — CSS custom properties are how
    this panel reaches it, same as Site theme / Site chrome above). */
export function SiteMeshControls() {
  const [values, setValues] = useState(() => ({
    opacity: readCssVarNumber(VARS.opacity, DEFAULTS.opacity),
    blurScale: readCssVarNumber(VARS.blurScale, DEFAULTS.blurScale),
    speed: readCssVarNumber(VARS.speed, DEFAULTS.speed),
    amount: readCssVarNumber(VARS.amount, DEFAULTS.amount),
    cursor: readCssVarNumber(VARS.cursor, DEFAULTS.cursor),
  }));

  // Secondary tone: anchored (default) means app/theme.css's own
  // calc()-from-primary rule is in charge and these sliders just display
  // it; unchecking writes an inline override (seeded from whatever the
  // anchor currently resolves to, so there's no jump) and lets you steer it
  // independently. Re-checking removes the override — back to exactly
  // the calc(), nothing lost.
  const [toneAnchored, setToneAnchored] = useState(true);
  const [tone, setTone] = useState(() => readTone(true));

  function set(key: keyof typeof VARS, next: number) {
    setValues((v) => ({ ...v, [key]: next }));
    document.documentElement.style.setProperty(VARS[key], `${next}`);
  }

  function reset() {
    for (const key of Object.keys(VARS) as (keyof typeof VARS)[]) {
      document.documentElement.style.removeProperty(VARS[key]);
    }
    setValues({
      opacity: readCssVarNumber(VARS.opacity, DEFAULTS.opacity),
      blurScale: readCssVarNumber(VARS.blurScale, DEFAULTS.blurScale),
      speed: readCssVarNumber(VARS.speed, DEFAULTS.speed),
      amount: readCssVarNumber(VARS.amount, DEFAULTS.amount),
      cursor: readCssVarNumber(VARS.cursor, DEFAULTS.cursor),
    });
    setToneAnchor(true);
  }

  function setToneAnchor(anchored: boolean) {
    if (anchored) {
      document.documentElement.style.removeProperty(TONE_VARS.h);
      document.documentElement.style.removeProperty(TONE_VARS.s);
      document.documentElement.style.removeProperty(TONE_VARS.l);
      setToneAnchored(true);
      setTone(readTone(true));
      return;
    }
    const current = readTone(true);
    document.documentElement.style.setProperty(TONE_VARS.h, `${current.h}`);
    document.documentElement.style.setProperty(TONE_VARS.s, `${current.s}%`);
    document.documentElement.style.setProperty(TONE_VARS.l, `${current.l}%`);
    setToneAnchored(false);
    setTone(current);
  }

  function setTonePart(key: keyof typeof TONE_VARS, next: number) {
    setTone((v) => ({ ...v, [key]: next }));
    const unit = key === "h" ? "" : "%";
    document.documentElement.style.setProperty(TONE_VARS[key], `${next}${unit}`);
  }

  return (
    <div className="flex flex-col gap-1.5 border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-widest text-accent uppercase">Site background (mesh)</p>
        <button
          type="button"
          onClick={reset}
          className="font-mono text-[9px] text-muted-foreground hover:text-foreground"
        >
          reset
        </button>
      </div>
      <p className="font-mono text-[9px] leading-relaxed text-muted-foreground/60">
        Procedural drift (summed sine waves, not a fixed loop) + cursor
        parallax — never restarts on page navigation.
      </p>
      <Slider label="opacity" value={values.opacity} min={0} max={2} step={0.02} onChange={(v) => set("opacity", v)} />
      <Slider label="blur scale" value={values.blurScale} min={0.2} max={2} step={0.02} onChange={(v) => set("blurScale", v)} />
      <Slider label="drift speed" value={values.speed} min={0} max={3} step={0.05} onChange={(v) => set("speed", v)} />
      <Slider label="drift amount" value={values.amount} min={0} max={3} step={0.05} onChange={(v) => set("amount", v)} />
      <Slider label="cursor influence" value={values.cursor} min={0} max={2} step={0.05} onChange={(v) => set("cursor", v)} />

      <div className="mt-1 flex flex-col gap-1.5 rounded-lg bg-white/[0.03] p-2">
        <label className="flex items-center justify-between font-mono text-[9px] text-muted-foreground/70 uppercase">
          <span>Secondary tone — anchored to primary</span>
          <input
            type="checkbox"
            checked={toneAnchored}
            onChange={(e) => setToneAnchor(e.target.checked)}
            className="accent-primary"
          />
        </label>
        <Slider
          label="hue"
          value={tone.h}
          min={-180}
          max={180}
          step={1}
          onChange={(v) => setTonePart("h", v)}
          disabled={toneAnchored}
        />
        <Slider
          label="saturation"
          value={tone.s}
          min={0}
          max={100}
          step={1}
          onChange={(v) => setTonePart("s", v)}
          disabled={toneAnchored}
        />
        <Slider
          label="lightness"
          value={tone.l}
          min={10}
          max={90}
          step={1}
          onChange={(v) => setTonePart("l", v)}
          disabled={toneAnchored}
        />
        {toneAnchored && (
          <p className="font-mono text-[9px] text-muted-foreground/50">
            Showing the live anchored value — uncheck to steer independently.
          </p>
        )}
      </div>
    </div>
  );
}
