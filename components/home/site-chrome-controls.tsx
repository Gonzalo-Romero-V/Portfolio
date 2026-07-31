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

/** Header/Footer's glass translucency + blur — --chrome-opacity/-blur in
    app/theme.css, shared by both (not this component). Doesn't need to be
    lifted into ProfileEmblem's state like the primary hue does: nothing in
    JS reads these, they're pure CSS, so a self-contained control (read once
    on mount, write straight to the root element) is enough. */
export function SiteChromeControls() {
  const [opacity, setOpacityState] = useState(() => readCssVarNumber("--chrome-opacity", 44));
  const [blur, setBlurState] = useState(() => readCssVarNumber("--chrome-blur", 0));

  function setOpacity(next: number) {
    setOpacityState(next);
    document.documentElement.style.setProperty("--chrome-opacity", `${next}%`);
  }

  function setBlur(next: number) {
    setBlurState(next);
    document.documentElement.style.setProperty("--chrome-blur", `${next}px`);
  }

  function reset() {
    document.documentElement.style.removeProperty("--chrome-opacity");
    document.documentElement.style.removeProperty("--chrome-blur");
    setOpacityState(readCssVarNumber("--chrome-opacity", 44));
    setBlurState(readCssVarNumber("--chrome-blur", 0));
  }

  return (
    <div className="flex flex-col gap-1.5 border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-widest text-accent uppercase">Site chrome (header / footer glass)</p>
        <button
          type="button"
          onClick={reset}
          className="font-mono text-[9px] text-muted-foreground hover:text-foreground"
        >
          reset
        </button>
      </div>
      <Slider label="translucency (%)" value={opacity} min={30} max={100} step={1} onChange={setOpacity} />
      <Slider label="blur (px)" value={blur} min={0} max={80} step={1} onChange={setBlur} />
    </div>
  );
}
