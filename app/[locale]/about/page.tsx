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

  const ogTitle =
    locale === "es"
      ? "Sobre mí — Estudiante de Ingeniería de Software"
      : "About me — Software Engineering Student";
  const seoTitle = locale === "es" ? "Sobre mí" : "About me";

  return {
    // Plain string, not `absolute` — this segment is nested below the root
    // layout, so title.template ("Gonzalo Romero | %s") applies normally.
    title: seoTitle,
    description: t.about.bio,
    alternates: buildAlternates(locale, "/about"),
    openGraph: {
      title: ogTitle,
      description: t.about.bio,
      url: buildAlternates(locale, "/about").canonical,
      images: [ogImage],
    },
  };
}

export default function AboutPage() {
  return <AboutView />;
}
