import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Archivo, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteBackground } from "@/components/layout/site-background";
import { ScrollPause } from "@/components/layout/scroll-pause";
import { LocaleProvider } from "@/components/layout/locale-provider";
import { dictionary, type Locale } from "@/lib/i18n";
import { defaultLocale, isLocale, locales, ogImage, siteUrl, socialLinks } from "@/lib/seo";
import { readTheme } from "@/lib/theme-store";
import type { ThemeConfig } from "@/lib/theme-config";
import "../globals.css";

// ISR, not full per-request rendering: readTheme() fetches with
// force-cache (see lib/theme-store.ts), so this route segment config is
// what actually makes it revalidate instead of caching forever. The admin
// save route (app/api/admin/theme/route.ts) also calls revalidatePath on
// every save, so a change reaches visitors on the next request after a
// save, not after waiting out this window — this is only the fallback.
export const revalidate = 60;

/** Only overrides the CSS custom properties the admin console actually
    edited (readTheme() returns undefined until the first save) — otherwise
    theme.css's own :root/.dark values apply untouched, light and dark kept
    distinct as designed. Once an admin saves, the saved brand/mesh/chrome
    numbers become a single inline-style override with higher specificity
    than both :root and .dark, so light and dark visitors see the same
    admin-picked look for these properties specifically — a deliberate
    simplification: the console has no separate light/dark editing mode. */
function themeStyle(theme: ThemeConfig | undefined): React.CSSProperties | undefined {
  if (!theme) return undefined;
  const style: Record<string, string> = {
    "--primary-h": `${theme.brand.h}`,
    "--primary-s": `${theme.brand.s}%`,
    "--primary-l": `${theme.brand.l}%`,
    "--mesh-opacity": `${theme.background.opacity}`,
    "--mesh-blur-scale": `${theme.background.blurScale}`,
    "--mesh-speed": `${theme.background.speed}`,
    "--mesh-amount": `${theme.background.amount}`,
    "--mesh-cursor": `${theme.background.cursor}`,
    "--chrome-opacity": `${theme.chrome.opacity}%`,
    "--chrome-blur": `${theme.chrome.blur}px`,
  };
  if (!theme.background.toneAnchored) {
    style["--mesh-2-h"] = `${theme.background.tone.h}`;
    style["--mesh-2-s"] = `${theme.background.tone.s}%`;
    style["--mesh-2-l"] = `${theme.background.tone.l}%`;
  }
  return style as React.CSSProperties;
}

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const isEs = locale === "es";
  const t = dictionary[locale];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      // Name first, consistently, across every page's <title> (SEO for the
      // name itself) — "%s" is each page's own descriptive part.
      template: "Gonzalo Romero | %s",
      default: "Gonzalo Romero",
    },
    description: t.home.heroParagraph,
    openGraph: {
      siteName: "Gonzalo Romero",
      locale: isEs ? "es_EC" : "en_US",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage.url],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const theme = await readTheme();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Gonzalo Romero",
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}/pictures/profile-picture.jpeg`,
    // Matches the tagline already rendered under the photo on the site
    // (components/home/profile-emblem.tsx) — not a new claim.
    jobTitle: "Software Developer",
    description: dictionary[locale].about.bio,
    sameAs: [socialLinks.github, socialLinks.linkedin, socialLinks.instagram],
  };

  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
      style={themeStyle(theme)}
      suppressHydrationWarning
    >
      <head>
        {/* Runs synchronously before paint to avoid a light->dark flash.
            suppressHydrationWarning on <html> is required because this
            mutates the class before React hydrates. Default is dark
            (ignores system preference) unless the visitor has explicitly
            picked light via the toggle, which persists to localStorage. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light")document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteBackground />
        <ScrollPause />
        <LocaleProvider locale={locale}>
          <Header />
          {children}
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
