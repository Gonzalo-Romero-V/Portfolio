"use client";

import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { useLocale } from "@/components/layout/locale-provider";

export default function ContactPage() {
  const { t } = useLocale();
  const contact = t.contact;

  return (
    <main className="relative flex flex-1 flex-col text-foreground">
      <Container>
        <div className="max-w-[560px] py-16">
          <SectionEyebrow index="01" label={contact.eyebrow} />

          <h1 className="mt-6 font-heading text-h2 text-balance">
            {contact.title}
          </h1>

          <p className="mt-6 text-body text-pretty text-muted-foreground">
            {contact.intro}
          </p>

          <div className="mt-9 flex flex-wrap gap-3.5">
            <a
              href="https://wa.me/593989519635"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-[14px] bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-[26px] py-[15px] text-[13.5px] font-semibold text-primary-foreground shadow-[0_14px_42px_hsl(var(--primary-2-h)_var(--primary-2-s)_var(--primary-2-l)_/_.44),inset_0_1px_0_rgba(255,255,255,.28)]"
            >
              {contact.ctaWhatsapp} <MessageCircle className="size-[15px]" />
            </a>
            <a
              href="mailto:hello.gonzaloromero@gmail.com"
              className="inline-flex items-center gap-2.5 rounded-[14px] border border-border bg-card px-[26px] py-[15px] text-[13.5px] font-medium text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.16)] backdrop-blur-[18px]"
            >
              <span className="break-all">hello.gonzaloromero@gmail.com</span>
              <Mail className="size-[15px] shrink-0 text-muted-foreground" />
            </a>
          </div>

          <div
            className="flex items-center gap-2 font-mono text-[10.5px] tracking-[.14em] text-muted-foreground/60 uppercase"
            style={{ marginTop: "40px" }}
          >
            <MapPin className="size-[13px]" />
            <span>{contact.location}</span>
          </div>
        </div>

        <div className="pb-20">
          <SectionEyebrow index="02" label={contact.eyebrow2} />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {contact.steps.map(({ title, body }, i) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_24px_60px_rgba(0,0,0,.4)] backdrop-blur-2xl"
              >
                <span className="font-mono text-[10.5px] tracking-[.14em] text-primary uppercase">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-heading text-h4">{title}</h3>
                <p className="mt-2 text-small font-normal text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
