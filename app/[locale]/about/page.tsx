import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dictionary } from "@/lib/i18n";
import { buildAlternates, isLocale, ogImage } from "@/lib/seo";
import { AboutView } from "@/app/[locale]/about/about-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = dictionary[locale];

  const title =
    locale === "es"
      ? "Sobre mí — Estudiante de Ingeniería de Software"
      : "About me — Software Engineering Student";

  return {
    title,
    description: t.about.bio,
    alternates: buildAlternates(locale, "/about"),
    openGraph: {
      title,
      description: t.about.bio,
      url: buildAlternates(locale, "/about").canonical,
      images: [ogImage],
    },
  };
}

export default function AboutPage() {
  return <AboutView />;
}
