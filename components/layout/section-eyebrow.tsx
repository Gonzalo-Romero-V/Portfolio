import type { ReactNode } from "react";

export function SectionEyebrow({
  index,
  label,
  trailing,
}: {
  index: string;
  label: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 font-mono text-[10.5px] tracking-[.24em] uppercase">
      <span className="text-primary">{index}</span>
      <span className="text-accent">{label}</span>
      {trailing && (
        <>
          <span className="h-px w-9 bg-border" />
          <span className="text-muted-foreground/70">{trailing}</span>
        </>
      )}
    </div>
  );
}
