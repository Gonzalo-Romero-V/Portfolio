import type { Locale } from "@/lib/i18n";

export const locales: readonly Locale[] = ["es", "en"];
export const defaultLocale: Locale = "es";
export const siteUrl = "https://www.gonzaloromero.dev";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Builds the canonical + hreflang alternates for a given route across every
    supported locale. `path` is locale-less, e.g. "" for home or "/about". */
export function buildAlternates(locale: Locale, path: string) {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      es: `/es${path}`,
      en: `/en${path}`,
      "x-default": `/${defaultLocale}${path}`,
    },
  };
}

export const socialLinks = {
  github: "https://github.com/Gonzalo-Romero-V",
  linkedin: "https://www.linkedin.com/in/gonzalo-romero-a50a902bb",
  instagram: "https://instagram.com/gonzaloromero.me",
};

export const ogImage = {
  url: "/pictures/og-picture.png",
  width: 1200,
  height: 630,
  alt: "Gonzalo Romero",
};
