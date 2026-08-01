"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useLocale } from "@/components/layout/locale-provider";
import { cn } from "@/lib/utils";

function LocaleSwitch({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-border bg-card p-[3px] backdrop-blur-md",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("es")}
        aria-pressed={locale === "es"}
        className={cn(
          "rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider transition-colors",
          locale === "es"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider transition-colors",
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </button>
    </div>
  );
}

export function Header() {
  const { t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="w-full border-b border-border bg-[color-mix(in_srgb,var(--background)_var(--chrome-opacity),transparent)] py-8 backdrop-blur-[var(--chrome-blur)]">
      <Container>
        <nav className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2 font-heading text-[15px] font-black tracking-tight">
            GR<span className="text-primary">.</span>
          </span>

          <div className="hidden items-center gap-6 sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-small text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <LocaleSwitch />
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground backdrop-blur-md sm:hidden"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </nav>

        {menuOpen && (
          <div
            id="mobile-nav"
            className="mt-5 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 backdrop-blur-2xl sm:hidden"
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-small text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
              <LocaleSwitch />
              <ThemeToggle />
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
