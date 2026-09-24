import { Section, Slider } from "@/components/admin/controls";
import type { BrandColor } from "@/lib/theme-config";

/** --primary-h/-s/-l — the one thing that rotates the whole site palette
    together (see the comment on components/home/site-theme-controls.tsx,
    the dev-only tuner this panel replaces for real, persisted edits). */
export function BrandColorSection({
  value,
  onChange,
  onReset,
}: {
  value: BrandColor;
  onChange: (next: BrandColor) => void;
  onReset: () => void;
}) {
  function set<K extends keyof BrandColor>(key: K, v: number) {
    onChange({ ...value, [key]: v });
  }

  return (
    <Section
      title="Colores de marca"
      description="--primary-h/-s/-l. --primary-2, --accent, --warning, --ring, ::selection y el círculo grande del emblema derivan de estos tres números."
      onReset={onReset}
    >
      <div
        className="h-12 w-full rounded-xl border border-border"
        style={{ background: `hsl(${value.h} ${value.s}% ${value.l}%)` }}
        aria-hidden
      />
      <Slider label="hue" value={value.h} min={0} max={360} step={1} onChange={(v) => set("h", v)} />
      <Slider label="saturation" value={value.s} min={0} max={100} step={1} onChange={(v) => set("s", v)} />
      <Slider label="lightness" value={value.l} min={10} max={90} step={1} onChange={(v) => set("l", v)} />
    </Section>
  );
}
