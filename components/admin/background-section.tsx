import { Section, Slider } from "@/components/admin/controls";
import type { BackgroundConfig } from "@/lib/theme-config";

/** The ambient mesh behind every page (components/layout/site-background.tsx,
    mounted once in the root layout — never remounts on navigation). */
export function BackgroundSection({
  value,
  onChange,
  onReset,
}: {
  value: BackgroundConfig;
  onChange: (next: BackgroundConfig) => void;
  onReset: () => void;
}) {
  function set<K extends keyof BackgroundConfig>(key: K, v: BackgroundConfig[K]) {
    onChange({ ...value, [key]: v });
  }
  function setTone<K extends keyof BackgroundConfig["tone"]>(key: K, v: number) {
    onChange({ ...value, tone: { ...value.tone, [key]: v } });
  }

  return (
    <Section
      title="Fondo"
      description="El mesh animado detrás de todo el sitio — mismo elemento en cada página, nunca se remonta al navegar entre rutas."
      onReset={onReset}
    >
      <Slider label="opacity" value={value.opacity} min={0} max={2} step={0.02} decimals={2} onChange={(v) => set("opacity", v)} />
      <Slider
        label="blur scale"
        value={value.blurScale}
        min={0.2}
        max={2}
        step={0.02}
        decimals={2}
        onChange={(v) => set("blurScale", v)}
      />
      <Slider label="drift speed" value={value.speed} min={0} max={3} step={0.05} decimals={2} onChange={(v) => set("speed", v)} />
      <Slider label="drift amount" value={value.amount} min={0} max={3} step={0.05} decimals={2} onChange={(v) => set("amount", v)} />
      <Slider
        label="cursor influence"
        value={value.cursor}
        min={0}
        max={2}
        step={0.05}
        decimals={2}
        onChange={(v) => set("cursor", v)}
      />

      <div className="mt-1 flex flex-col gap-3 rounded-xl border border-border bg-background/40 p-3">
        <label className="flex items-center justify-between font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
          <span>Tono secundario — anclado al color de marca</span>
          <input
            type="checkbox"
            checked={value.toneAnchored}
            onChange={(e) => set("toneAnchored", e.target.checked)}
            className="accent-primary"
          />
        </label>
        <Slider
          label="hue"
          value={value.tone.h}
          min={-180}
          max={180}
          step={1}
          disabled={value.toneAnchored}
          onChange={(v) => setTone("h", v)}
        />
        <Slider
          label="saturation"
          value={value.tone.s}
          min={0}
          max={100}
          step={1}
          disabled={value.toneAnchored}
          onChange={(v) => setTone("s", v)}
        />
        <Slider
          label="lightness"
          value={value.tone.l}
          min={10}
          max={90}
          step={1}
          disabled={value.toneAnchored}
          onChange={(v) => setTone("l", v)}
        />
      </div>
    </Section>
  );
}
