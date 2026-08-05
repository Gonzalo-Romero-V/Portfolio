"use client";

import { Layers, MessageCircle, Search, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { useLocale } from "@/components/layout/locale-provider";

const principleIcons = [Sparkles, Search, MessageCircle, Layers];

const stack = [
  "Next.js",
  "Laravel",
  "Postgres",
  "Python",
  "TypeScript",
  "Dart",
  "Java",
];

export function AboutView() {
  const { t } = useLocale();
  const about = t.about;

  return (
    <main className="relative flex flex-1 flex-col text-foreground">
      <Container>
        <div className="max-w-[620px] py-16">
          <SectionEyebrow index="01" label={about.eyebrow1} />

          <h1 className="mt-6 font-heading text-h2 text-balance">
            Gonzalo Romero
          </h1>

          <p className="mt-6 text-body text-pretty text-muted-foreground">
            {about.bio}
          </p>
        </div>

        <div className="pb-16">
          <SectionEyebrow index="02" label={about.eyebrow2} />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {about.principles.map(({ title, body }, i) => {
              const Icon = principleIcons[i];
              return (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_24px_60px_rgba(0,0,0,.4)] backdrop-blur-2xl"
                >
                  <span className="flex size-9 items-center justify-center rounded-[11px] border border-primary/30 bg-primary/10 text-accent">
                    <Icon className="size-[17px]" />
                  </span>
                  <h2 className="mt-5 font-heading text-h4">{title}</h2>
                  <p className="mt-2 text-small font-normal text-muted-foreground">
                    {body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pb-16">
          <SectionEyebrow index="03" label={about.eyebrow3} />

          <div className="mt-6 flex flex-wrap gap-3">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-card px-4 py-2 font-mono text-[10.5px] tracking-[.14em] text-muted-foreground uppercase backdrop-blur-[10px]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 pb-20">
          <SectionEyebrow index="04" label={about.eyebrow4} />

          <h2 className="font-heading text-h3 text-balance">
            {about.closingTitle}
          </h2>

          <a
            href="https://wa.me/593989519635"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-[14px] bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-[26px] py-[15px] text-[13.5px] font-semibold text-primary-foreground shadow-[0_14px_42px_hsl(var(--primary-2-h)_var(--primary-2-s)_var(--primary-2-l)_/_.44),inset_0_1px_0_rgba(255,255,255,.28)]"
          >
            {about.ctaWhatsapp} <MessageCircle className="size-[15px]" />
          </a>
        </div>
      </Container>
    </main>
  );
}
