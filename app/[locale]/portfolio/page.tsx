import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dictionary } from "@/lib/i18n";
import { buildAlternates, isLocale, ogImage } from "@/lib/seo";
import { PortfolioView } from "@/app/[locale]/portfolio/portfolio-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = dictionary[locale];

  const seoTitle =
    locale === "es"
      ? "Proyectos Web, IA y Automatización"
      : "Web, AI and Automation Projects";

  return {
    // Plain string, not `absolute` — this segment is nested below the root
    // layout, so title.template ("Gonzalo Romero | %s") applies normally.
    title: seoTitle,
    description: t.portfolio.intro,
    alternates: buildAlternates(locale, "/portfolio"),
    openGraph: {
      title: t.portfolio.title,
      description: t.portfolio.intro,
      url: buildAlternates(locale, "/portfolio").canonical,
      images: [ogImage],
    },
  };
}

export default function PortfolioPage() {
  return <PortfolioView />;
}
