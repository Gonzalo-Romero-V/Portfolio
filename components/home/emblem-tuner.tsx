"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { BlobParams } from "@/components/home/blob-path";
import {
  defaultEmblemState,
  type BackdropConfig,
  type CircleLayer,
  type EmblemState,
  type GlowConfig,
  type ImageTransform,
  type PrimaryHsl,
  type RimParams,
  type SocialConfig,
  type TextPosition,
} from "@/components/home/emblem-state";
import { SiteThemeControls } from "@/components/home/site-theme-controls";
import { SiteChromeControls } from "@/components/home/site-chrome-controls";
import { SiteMeshControls } from "@/components/home/site-mesh-controls";
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
        <span className="text-foreground/70">{value.toFixed(2)}</span>
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

function Group({
  label,
  onReset,
  children,
}: {
  label: string;
  onReset?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-widest text-accent uppercase">{label}</p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="font-mono text-[9px] text-muted-foreground hover:text-foreground"
          >
            reset
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Sub({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-white/[0.03] p-2">
      <p className="font-mono text-[9px] tracking-wide text-muted-foreground/70 uppercase">{label}</p>
      {children}
    </div>
  );
}

function BlobControls({ value, onChange }: { value: BlobParams; onChange: (next: BlobParams) => void }) {
  function set<K extends keyof BlobParams>(key: K, v: number) {
    onChange({ ...value, [key]: v });
  }

  return (
    <Sub label="Shape">
      <Slider label="cx" value={value.cx} min={0} max={1} step={0.01} onChange={(v) => set("cx", v)} />
      <Slider label="cy" value={value.cy} min={0} max={1} step={0.01} onChange={(v) => set("cy", v)} />
      <Slider label="radius" value={value.radius} min={0.1} max={0.5} step={0.01} onChange={(v) => set("radius", v)} />
      <Slider label="scale" value={value.scale} min={0.3} max={2} step={0.02} onChange={(v) => set("scale", v)} />
      <Slider label="points" value={value.points} min={4} max={12} step={1} onChange={(v) => set("points", v)} />
      <Slider
        label="irregularity"
        value={value.irregularity}
        min={0}
        max={0.4}
        step={0.01}
        onChange={(v) => set("irregularity", v)}
      />
      <Slider
        label="rotation"
        value={value.rotation}
        min={-180}
        max={180}
        step={1}
        onChange={(v) => set("rotation", v)}
      />
      <button
        type="button"
        onClick={() => set("seed", Math.floor(Math.random() * 1000))}
        className="mt-1 self-start rounded-full border border-white/15 px-2 py-0.5 font-mono text-[9px] text-muted-foreground hover:text-foreground"
      >
        reroll seed ({value.seed})
      </button>
    </Sub>
  );
}

function GlowControls({ value, onChange }: { value: GlowConfig; onChange: (next: GlowConfig) => void }) {
  function set<K extends keyof GlowConfig>(key: K, v: number) {
    onChange({ ...value, [key]: v });
  }
  return (
    <Sub label="External glow">
      <Slider label="opacity" value={value.opacity} min={0} max={0.6} step={0.01} onChange={(v) => set("opacity", v)} />
      <Slider label="blur (px)" value={value.blur} min={0} max={140} step={2} onChange={(v) => set("blur", v)} />
      <Slider label="spread" value={value.spread} min={1} max={2} step={0.02} onChange={(v) => set("spread", v)} />
    </Sub>
  );
}

function BackdropControls({ value, onChange }: { value: BackdropConfig; onChange: (next: BackdropConfig) => void }) {
  function set<K extends keyof BackdropConfig>(key: K, v: number) {
    onChange({ ...value, [key]: v });
  }
  return (
    <Sub label="Glass backdrop (0 blur = solid disc)">
      <Slider label="blur (px)" value={value.blur} min={0} max={40} step={1} onChange={(v) => set("blur", v)} />
      <Slider label="saturate (%)" value={value.saturate} min={100} max={250} step={5} onChange={(v) => set("saturate", v)} />
    </Sub>
  );
}

function RimControls({ value, onChange }: { value: RimParams; onChange: (next: RimParams) => void }) {
  function set<K extends keyof RimParams>(key: K, v: number) {
    onChange({ ...value, [key]: v });
  }
  return (
    <Sub label="Rim / edge">
      <Slider label="opacity" value={value.opacity} min={0} max={1} step={0.02} onChange={(v) => set("opacity", v)} />
      <Slider label="width (px)" value={value.width} min={0.5} max={4} step={0.1} onChange={(v) => set("width", v)} />
      <Slider label="glow" value={value.glow} min={0} max={20} step={0.5} onChange={(v) => set("glow", v)} />
    </Sub>
  );
}

function CircleLayerControls<T extends CircleLayer>({
  label,
  value,
  defaultValue,
  onChange,
  colorSlot,
}: {
  label: string;
  value: T;
  defaultValue: T;
  onChange: (next: T) => void;
  /** Hue/saturation sliders for circles with their own independent color,
      or a note for ones that inherit the site's primary hue instead. */
  colorSlot?: React.ReactNode;
}) {
  function set<K extends keyof T>(key: K, v: T[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <Group label={label} onReset={() => onChange(defaultValue)}>
      <BlobControls value={value.blob} onChange={(v) => set("blob", v)} />
      <Sub label="Fill">
        {colorSlot}
        <Slider label="fill alpha" value={value.fillAlpha} min={0} max={1} step={0.02} onChange={(v) => set("fillAlpha", v)} />
      </Sub>
      <GlowControls value={value.glow} onChange={(v) => set("glow", v)} />
      <BackdropControls value={value.backdrop} onChange={(v) => set("backdrop", v)} />
      <RimControls value={value.rim} onChange={(v) => set("rim", v)} />
    </Group>
  );
}

function TextControls({
  value,
  defaultValue,
  onChange,
}: {
  value: TextPosition;
  defaultValue: TextPosition;
  onChange: (next: TextPosition) => void;
}) {
  function set<K extends keyof TextPosition>(key: K, v: number) {
    onChange({ ...value, [key]: v });
  }

  return (
    <Group label="Text position & size" onReset={() => onChange(defaultValue)}>
      <Slider label="x (right edge)" value={value.x} min={0} max={1} step={0.01} onChange={(v) => set("x", v)} />
      <Slider label="y (top)" value={value.y} min={0} max={1} step={0.01} onChange={(v) => set("y", v)} />
      <Slider label="width" value={value.width} min={0.2} max={1} step={0.01} onChange={(v) => set("width", v)} />
      <Slider label="name size (px)" value={value.nameSize} min={14} max={64} step={1} onChange={(v) => set("nameSize", v)} />
      <Slider
        label="tagline size (px)"
        value={value.taglineSize}
        min={7}
        max={20}
        step={0.5}
        onChange={(v) => set("taglineSize", v)}
      />
      <Slider label="gap (px)" value={value.gap} min={0} max={24} step={1} onChange={(v) => set("gap", v)} />
    </Group>
  );
}

function ImageControls({
  value,
  defaultValue,
  onChange,
}: {
  value: ImageTransform;
  defaultValue: ImageTransform;
  onChange: (next: ImageTransform) => void;
}) {
  function set<K extends keyof ImageTransform>(key: K, v: ImageTransform[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <Group label="Image (plain, no crop — position + size only)" onReset={() => onChange(defaultValue)}>
      <label className="flex items-center justify-between font-mono text-[10px] text-muted-foreground/80">
        <span>visible (hidden ≠ deleted)</span>
        <input
          type="checkbox"
          checked={value.visible}
          onChange={(e) => set("visible", e.target.checked)}
          className="accent-primary"
        />
      </label>
      <Slider label="horizontal (x)" value={value.x} min={0} max={100} step={1} onChange={(v) => set("x", v)} />
      <Slider label="vertical (y)" value={value.y} min={0} max={100} step={1} onChange={(v) => set("y", v)} />
      <Slider label="size" value={value.size} min={30} max={400} step={2} onChange={(v) => set("size", v)} />
    </Group>
  );
}

function SocialControls({
  value,
  defaultValue,
  onChange,
}: {
  value: SocialConfig;
  defaultValue: SocialConfig;
  onChange: (next: SocialConfig) => void;
}) {
  function set<K extends keyof SocialConfig>(key: K, v: number) {
    onChange({ ...value, [key]: v });
  }

  return (
    <Group label="Social icons" onReset={() => onChange(defaultValue)}>
      <Slider
        label="button size (px)"
        value={value.buttonSize}
        min={16}
        max={48}
        step={1}
        onChange={(v) => set("buttonSize", v)}
      />
      <Slider label="icon size (px)" value={value.iconSize} min={7} max={24} step={1} onChange={(v) => set("iconSize", v)} />
      <Slider label="gap (px)" value={value.gap} min={0} max={20} step={1} onChange={(v) => set("gap", v)} />
      <Slider
        label="margin top (px)"
        value={value.marginTop}
        min={0}
        max={32}
        step={1}
        onChange={(v) => set("marginTop", v)}
      />
    </Group>
  );
}

function pick<T, K extends keyof T>(source: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) result[key] = source[key];
  return result;
}

export function EmblemTuner({
  state,
  onChange,
  primary,
  onPrimaryChange,
  onPrimaryReset,
}: {
  state: EmblemState;
  onChange: (next: EmblemState) => void;
  primary: PrimaryHsl;
  onPrimaryChange: (next: PrimaryHsl) => void;
  onPrimaryReset: () => void;
}) {
  const mounted = useSyncExternalStore(subscribeNever, isClient, isServer);
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  function set<K extends keyof EmblemState>(key: K, v: EmblemState[K]) {
    onChange({ ...state, [key]: v });
  }

  function resetKeys<K extends keyof EmblemState>(keys: K[]) {
    onChange({ ...state, ...pick(defaultEmblemState, keys) });
  }

  async function copyConfig() {
    // "state" is only the emblem's own knobs — primary/chrome/mesh live as
    // CSS custom properties owned by their own self-contained panels (see
    // site-theme/-chrome/-mesh-controls.tsx), not in this component's props
    // or state. Read them straight off the root element at export time so
    // one "copy" actually captures everything currently on screen, not just
    // the emblem.
    const combined = {
      emblem: state,
      primary,
      chrome: {
        opacity: readCssVarNumber("--chrome-opacity", 85),
        blur: readCssVarNumber("--chrome-blur", 40),
      },
      mesh: {
        opacity: readCssVarNumber("--mesh-opacity", 1),
        blurScale: readCssVarNumber("--mesh-blur-scale", 1),
        speed: readCssVarNumber("--mesh-speed", 1),
        amount: readCssVarNumber("--mesh-amount", 1),
        cursor: readCssVarNumber("--mesh-cursor", 0.5),
        toneHue: readCssVarNumber("--mesh-2-h", -13),
        toneSaturation: readCssVarNumber("--mesh-2-s", 80),
        toneLightness: readCssVarNumber("--mesh-2-l", 33),
      },
    };
    const json = JSON.stringify(combined, null, 2);
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      // Clipboard permission denied — the JSON is still in the console.
    }
    console.log("[emblem-tuner] current state:", json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 w-72 max-w-[calc(100vw-2rem)]">
      <div className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-white/10 bg-black/80 p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,.6)] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full cursor-pointer items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground uppercase"
        >
          Emblem tuner (temporal)
          <span>{open ? "–" : "+"}</span>
        </button>

        {open && (
          <div className="mt-4 flex flex-col gap-4">
            <SiteThemeControls value={primary} onChange={onPrimaryChange} onReset={onPrimaryReset} />
            <SiteChromeControls />
            <SiteMeshControls />

            <Group label="Canvas / outer frame" onReset={() => resetKeys(["canvasScale"])}>
              <Slider
                label="headroom (scale)"
                value={state.canvasScale}
                min={1}
                max={2.5}
                step={0.05}
                onChange={(v) => set("canvasScale", v)}
              />
            </Group>

            <CircleLayerControls
              label="Layer 1 — Big circle"
              value={state.big}
              defaultValue={defaultEmblemState.big}
              onChange={(v) => set("big", v)}
              colorSlot={
                <p className="font-mono text-[9px] leading-relaxed text-muted-foreground/50">
                  hue/saturation inherited live from Site theme ↑ — not set here.
                </p>
              }
            />
            <CircleLayerControls
              label="Layer 2 — Small circle"
              value={state.small}
              defaultValue={defaultEmblemState.small}
              onChange={(v) => set("small", v)}
              colorSlot={
                <>
                  <Slider
                    label="hue"
                    value={state.small.hue}
                    min={0}
                    max={360}
                    step={1}
                    onChange={(v) => set("small", { ...state.small, hue: v })}
                  />
                  <Slider
                    label="saturation"
                    value={state.small.saturation}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(v) => set("small", { ...state.small, saturation: v })}
                  />
                </>
              }
            />

            <ImageControls value={state.image} defaultValue={defaultEmblemState.image} onChange={(v) => set("image", v)} />
            <Group label="Photo opacity" onReset={() => resetKeys(["photoOpacity"])}>
              <Slider
                label="opacity"
                value={state.photoOpacity}
                min={0.4}
                max={1}
                step={0.02}
                onChange={(v) => set("photoOpacity", v)}
              />
            </Group>

            <TextControls value={state.text} defaultValue={defaultEmblemState.text} onChange={(v) => set("text", v)} />
            <SocialControls value={state.social} defaultValue={defaultEmblemState.social} onChange={(v) => set("social", v)} />

            <button
              type="button"
              onClick={() => onChange(defaultEmblemState)}
              className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] text-muted-foreground uppercase hover:text-foreground"
            >
              reset everything
            </button>

            <button
              type="button"
              onClick={copyConfig}
              className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[10px] text-primary uppercase hover:bg-primary/20"
            >
              {copied ? "copied ✓ (also logged to console)" : "copy config JSON"}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

function subscribeNever() {
  return () => {};
}
function isClient() {
  return true;
}
function isServer() {
  return false;
}
