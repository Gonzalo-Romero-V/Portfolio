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

  return {
    title: t.portfolio.title,
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
