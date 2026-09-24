import { Section, Slider } from "@/components/admin/controls";
import type { ChromeConfig } from "@/lib/theme-config";

/** Header/Footer's glass translucency + blur — --chrome-opacity/-blur,
    shared by both, on every page. The strip below is a standalone mock (not
    the real Header, which needs LocaleProvider/i18n this page deliberately
    doesn't load) just so the blur/opacity are visible without leaving the
    page. */
export function ChromeSection({
  value,
  onChange,
  onReset,
}: {
  value: ChromeConfig;
  onChange: (next: ChromeConfig) => void;
  onReset: () => void;
}) {
  return (
    <Section
      title="Vidrio del sitio"
      description="Translucidez/blur del Header y el Footer — --chrome-opacity/-blur, la misma pareja de valores en las dos."
      onReset={onReset}
    >
      <div
        className="flex h-12 w-full items-center justify-between rounded-xl border border-border px-4 font-mono text-[10px] tracking-widest uppercase"
        style={{
          background: `color-mix(in srgb, var(--background) ${value.opacity}%, transparent)`,
          backdropFilter: `blur(${value.blur}px)`,
          WebkitBackdropFilter: `blur(${value.blur}px)`,
        }}
        aria-hidden
      >
        <span>
          GR<span className="text-primary">.</span>
        </span>
        <span className="text-muted-foreground">vista previa</span>
      </div>
      <Slider
        label="translucency (%)"
        value={value.opacity}
        min={30}
        max={100}
        step={1}
        onChange={(v) => onChange({ ...value, opacity: v })}
      />
      <Slider label="blur (px)" value={value.blur} min={0} max={80} step={1} onChange={(v) => onChange({ ...value, blur: v })} />
    </Section>
  );
}
