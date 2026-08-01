"use client";

import { ArrowUpRight, BarChart3, MessageCircle, Repeat, Wallet } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { useLocale } from "@/components/layout/locale-provider";

const projects = [
  {
    icon: Wallet,
    name: "FinanceHub",
    key: "financehub" as const,
    tags: ["TypeScript"],
    href: "https://financehub.cc",
  },
  {
    icon: Repeat,
    name: "Habit-Tracker",
    key: "habitTracker" as const,
    tags: ["TypeScript"],
    href: "https://habittracker.gonzaloromero.dev",
  },
  {
    icon: BarChart3,
    name: "BI-MERCADO-EC",
    key: "biMercado" as const,
    tags: ["Python"],
    href: "https://github.com/Gonzalo-Romero-V/BI-MERCADO-EC",
  },
];

export default function PortfolioPage() {
  const { t } = useLocale();
  const portfolio = t.portfolio;

  return (
    <main className="relative flex flex-1 flex-col text-foreground">
      <Container>
        <div className="max-w-[560px] py-16">
          <SectionEyebrow index="01" label={portfolio.eyebrow} />

          <h1 className="mt-6 font-heading text-h2 text-balance">
            {portfolio.title}
          </h1>

          <p className="mt-6 text-body text-pretty text-muted-foreground">
            {portfolio.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(({ icon: Icon, name, key, tags, href }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_24px_60px_rgba(0,0,0,.4)] backdrop-blur-2xl transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-9 items-center justify-center rounded-[11px] border border-primary/30 bg-primary/10 text-accent">
                  <Icon className="size-[17px]" />
                </span>
                <ArrowUpRight className="size-[16px] text-muted-foreground/60 transition-all group-hover:text-foreground" />
              </div>

              <h3 className="mt-5 font-heading text-h4">{name}</h3>
              <p className="mt-2 text-small font-normal text-muted-foreground">
                {portfolio.projects[key]}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[9.5px] tracking-[.14em] text-muted-foreground/80 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start gap-6 pb-20">
          <h2 className="font-heading text-h3 text-balance">
            {portfolio.closingTitle}
          </h2>

          <a
            href="https://wa.me/593989519635"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-[14px] bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-[26px] py-[15px] text-[13.5px] font-semibold text-primary-foreground shadow-[0_14px_42px_hsl(var(--primary-2-h)_var(--primary-2-s)_var(--primary-2-l)_/_.44),inset_0_1px_0_rgba(255,255,255,.28)]"
          >
            {portfolio.ctaWhatsapp} <MessageCircle className="size-[15px]" />
          </a>
        </div>
      </Container>
    </main>
  );
}
