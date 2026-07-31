import type { PrimaryHsl } from "@/components/home/emblem-state";

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-0.5 font-mono text-[10px] text-muted-foreground/80">
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="text-foreground/70">{value.toFixed(0)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-primary"
      />
    </label>
  );
}

/** Unlike everything else in this panel, these three sliders don't touch
    EmblemState — they're the site's --primary-h/-s/-l, owned by
    ProfileEmblem (which also uses them directly to color the big circle —
    see ColorSlot there) and mirrored onto document.documentElement's style
    so the rest of the page (Header, CTA gradient, stat cards) repaints too.
    Every other warm token (--primary-2, --accent, --warning, --ring,
    ::selection) is calc()'d from these three in app/theme.css, so turning
    the hue rotates the whole palette together, the way spinning the hue
    wheel in an image editor recolors everything derived from a base
    swatch. This is the "control the site" submenu, as opposed to "control
    this component" (the small circle below still picks its own color
    independently — that's by design, not an oversight). Freeze by copying
    the three numbers into app/theme.css's :root/.dark once you land on
    something. */
export function SiteThemeControls({
  value,
  onChange,
  onReset,
}: {
  value: PrimaryHsl;
  onChange: (next: PrimaryHsl) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-widest text-accent uppercase">Site theme (global, not this component)</p>
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-[9px] text-muted-foreground hover:text-foreground"
        >
          reset
        </button>
      </div>
      <p className="font-mono text-[9px] leading-relaxed text-muted-foreground/60">
        --primary-2 / --accent / --warning / --ring / ::selection — and the
        big circle&apos;s own color — all derive from these three.
      </p>
      <Slider label="hue" value={value.h} min={0} max={360} step={1} onChange={(h) => onChange({ ...value, h })} />
      <Slider label="saturation" value={value.s} min={0} max={100} step={1} onChange={(s) => onChange({ ...value, s })} />
      <Slider label="lightness" value={value.l} min={10} max={90} step={1} onChange={(l) => onChange({ ...value, l })} />
    </div>
  );
}
