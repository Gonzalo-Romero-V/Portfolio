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
import "../globals.css";

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
      // Kept deliberately distinct from any page's own title (e.g. the
      // home page's): if a child's resolved title string is identical to
      // this default, Next.js 16 treats it as "no override" and skips
      // applying the template to it.
      template: "%s | Gonzalo Romero",
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
