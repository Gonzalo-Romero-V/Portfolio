import type { ReactNode } from "react";

/** Shared primitives for the admin console's sections — same slider/panel
    idea as components/home/*-controls.tsx (the dev-only emblem tuner), but
    styled with the site's real design tokens (border-border, bg-card,
    text-muted-foreground) instead of the tuner's hardcoded white/10, since
    this page is meant to look native to the site, not like a dev overlay. */
export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled,
  decimals = 0,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  decimals?: number;
}) {
  return (
    <label className="flex flex-col gap-1 font-mono text-xs text-muted-foreground">
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="text-foreground/80">{value.toFixed(decimals)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-primary disabled:opacity-40"
      />
    </label>
  );
}

export function Section({
  title,
  description,
  onReset,
  children,
}: {
  title: string;
  description?: string;
  onReset: () => void;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-sm font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground/70">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 font-mono text-[10px] tracking-wide text-muted-foreground uppercase hover:text-foreground"
        >
          reset
        </button>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
