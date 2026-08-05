"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useLocale } from "@/components/layout/locale-provider";
import { cn } from "@/lib/utils";

/** Sets the NEXT_LOCALE cookie so a later bare-domain visit (proxy.ts)
    remembers the choice, on top of the real navigation Link already does —
    unlike the old client-state toggle, switching language now lands on a
    distinct, crawlable /es or /en URL. */
function LocaleSwitch({
  className,
  restPath,
}: {
  className?: string;
  restPath: string;
}) {
  const { locale } = useLocale();

  function remember(next: "es" | "en") {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-border bg-card p-[3px] backdrop-blur-md",
        className,
      )}
    >
      <Link
        href={`/es${restPath}`}
        onClick={() => remember("es")}
        aria-pressed={locale === "es"}
        className={cn(
          "rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider transition-colors",
          locale === "es"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        ES
      </Link>
      <Link
        href={`/en${restPath}`}
        onClick={() => remember("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider transition-colors",
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </Link>
    </div>
  );
}

export function Header() {
  const { t, locale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const restPath = pathname.replace(/^\/(es|en)/, "");

  const links = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/portfolio`, label: t.nav.portfolio },
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ];

  return (
    <header className="w-full border-b border-border bg-[color-mix(in_srgb,var(--background)_var(--chrome-opacity),transparent)] py-8 backdrop-blur-[var(--chrome-blur)]">
      <Container>
        <nav className="flex items-center justify-between gap-6">
          {/* aria-hidden + aria-label: "GR." read aloud is "gr." — the
              Spanish abbreviation for "gramo" — so screen readers/TTS
              expand it to "gramo" instead of spelling it out. The visible
              mark stays as-is; assistive tech gets the real name instead. */}
          <span
            className="flex items-center gap-2 font-heading text-[15px] font-black tracking-tight"
            aria-label="Gonzalo Romero"
          >
            <span aria-hidden="true">
              GR<span className="text-primary">.</span>
            </span>
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
            <LocaleSwitch restPath={restPath} />
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
              <LocaleSwitch restPath={restPath} />
              <ThemeToggle />
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
