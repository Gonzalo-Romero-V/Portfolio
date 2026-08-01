import { Container } from "@/components/layout/container";

const links = [
  { href: "https://github.com/Gonzalo-Romero-V", label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/gonzalo-romero-a50a902bb",
    label: "LinkedIn",
  },
  { href: "https://instagram.com/gonzaloromero.me", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-[color-mix(in_srgb,var(--background)_var(--chrome-opacity),transparent)] py-8 backdrop-blur-[var(--chrome-blur)]">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="flex items-center gap-2 font-heading text-[13px] font-black tracking-tight">
            GR<span className="text-primary">.</span>
            <span className="font-mono text-[10px] font-normal tracking-[.14em] text-muted-foreground/60 uppercase">
              © 2026 Gonzalo Romero
            </span>
          </span>

          <div className="flex items-center gap-5 font-mono text-[10px] tracking-[.14em] text-muted-foreground/60 uppercase">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
