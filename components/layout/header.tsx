import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About me" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="w-full border-b border-border bg-[color-mix(in_srgb,var(--background)_var(--chrome-opacity),transparent)] py-8 backdrop-blur-[var(--chrome-blur)]">
      <Container>
        <nav className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2 font-heading text-[15px] font-black tracking-tight">
            GR<span className="text-primary">.</span>
          </span>

          <div className="flex items-center gap-6">
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

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 rounded-full border border-border bg-card p-[3px] backdrop-blur-md">
              <span className="rounded-full bg-primary px-2.5 py-1 font-mono text-[10px] tracking-wider text-primary-foreground">
                ES
              </span>
              <span className="rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                EN
              </span>
            </div>
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  );
}
