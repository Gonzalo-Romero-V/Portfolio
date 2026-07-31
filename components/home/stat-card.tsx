import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/home/count-up";

export function StatCard({
  icon: Icon,
  value,
  prefix,
  suffix,
  label,
  highlight = false,
}: {
  icon: LucideIcon;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_24px_60px_rgba(0,0,0,.4)] backdrop-blur-2xl transition-all",
        highlight
          ? "border-primary/20 bg-gradient-to-br from-primary/10 to-transparent"
          : "border-border bg-card",
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-[11px] border",
          highlight
            ? "border-primary/40 bg-primary/20 text-warning"
            : "border-primary/30 bg-primary/10 text-accent",
        )}
      >
        <Icon className="size-[17px]" />
      </span>
      <div
        className={cn(
          "mt-6 font-heading text-[42px] leading-none font-black tracking-tight",
          highlight &&
            "text-primary [text-shadow:0_0_44px_hsl(var(--primary-h)_var(--primary-s)_var(--primary-l)_/_.5)]",
        )}
      >
        <CountUp value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="mt-2 font-mono text-[9.5px] tracking-[.16em] text-muted-foreground/80 uppercase">
        {label}
      </div>
    </div>
  );
}
