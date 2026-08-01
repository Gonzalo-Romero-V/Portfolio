"use client";

import { ArrowRight, MessageCircle, BriefcaseBusiness, LayoutGrid, Cpu, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { useLocale } from "@/components/layout/locale-provider";
import { ProfileEmblem } from "@/components/home/profile-emblem";
import { StatCard } from "@/components/home/stat-card";

export default function Home() {
  const { t } = useLocale();
  const home = t.home;

  return (
    <main className="relative flex flex-1 flex-col text-foreground">
      <Container>
        <div className="relative grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <ProfileEmblem />

          <div className="flex max-w-[540px] flex-col">
            <SectionEyebrow index="01" label={home.eyebrow} trailing={home.location} />

            <h1 className="mt-6 font-heading text-h1 text-balance">
              {home.heroTitlePrefix}{" "}
              <span className="font-black text-primary [text-shadow:0_0_52px_hsl(var(--primary-h)_var(--primary-s)_var(--primary-l)_/_.55)]">
                {home.heroTitleHighlight}
              </span>
              .
            </h1>

            <p className="mt-7 max-w-[470px] text-body text-pretty text-muted-foreground">
              {home.heroParagraph}
            </p>

            <div className="mt-9 flex flex-wrap gap-3.5">
              <a
                href="https://wa.me/593989519635"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-[14px] bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-[26px] py-[15px] text-[13.5px] font-semibold text-primary-foreground shadow-[0_14px_42px_hsl(var(--primary-2-h)_var(--primary-2-s)_var(--primary-2-l)_/_.44),inset_0_1px_0_rgba(255,255,255,.28)]"
              >
                {home.ctaWhatsapp} <MessageCircle className="size-[15px]" />
              </a>
              <a
                href="/portfolio"
                className="inline-flex items-center gap-2.5 rounded-[14px] border border-border bg-card px-[26px] py-[15px] text-[13.5px] font-medium text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.16)] backdrop-blur-[18px]"
              >
                {home.ctaProjects}{" "}
                <ArrowRight className="size-[15px] text-muted-foreground" />
              </a>
            </div>

            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10.5px] tracking-[.14em] text-muted-foreground/60 uppercase"
              style={{ marginTop: "52px" }}
            >
              <span>Next.js</span>
              <span className="size-[3px] rounded-full bg-accent/70" />
              <span>Laravel</span>
              <span className="size-[3px] rounded-full bg-accent/70" />
              <span>Postgres</span>
              <span className="size-[3px] rounded-full bg-accent/70" />
              <span>Python</span>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-5 pb-16 lg:grid-cols-4">
          <StatCard
            icon={BriefcaseBusiness}
            value={3}
            prefix="+"
            label={home.stats.years}
          />
          <StatCard
            icon={LayoutGrid}
            value={15}
            prefix="+"
            label={home.stats.projects}
          />
          <StatCard
            icon={Cpu}
            value={6}
            prefix="+"
            label={home.stats.tech}
          />
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_24px_60px_rgba(0,0,0,.4)] backdrop-blur-2xl transition-all">
            <span className="flex size-9 items-center justify-center rounded-[11px] border border-primary/40 bg-primary/20 text-warning">
              <Sparkles className="size-[17px]" />
            </span>
            <div className="mt-6 font-heading text-[21px] leading-tight font-black tracking-tight text-primary [text-shadow:0_0_44px_hsl(var(--primary-h)_var(--primary-s)_var(--primary-l)_/_.5)]">
              {home.stats.areasValue}
            </div>
            <div className="mt-2 font-mono text-[9.5px] tracking-[.16em] text-muted-foreground/80 uppercase">
              {home.stats.areasLabel}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
