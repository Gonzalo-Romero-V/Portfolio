import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dictionary } from "@/lib/i18n";
import { buildAlternates, isLocale, ogImage } from "@/lib/seo";
import { HomeView } from "@/app/[locale]/home-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = dictionary[locale];

  const heroTitle = `${t.home.heroTitlePrefix} ${t.home.heroTitleHighlight}`;
  const seoTitle =
    locale === "es"
      ? "Desarrollador Full Stack — Ecuador"
      : "Full Stack Developer — Ecuador";

  return {
    // Home lives in the same route segment as the root layout that defines
    // title.template, so the template isn't applied automatically here the
    // way it is for nested pages (about/contact/portfolio) — `absolute` is
    // set explicitly instead, built by hand in the same "Name | ..." shape
    // the template produces everywhere else.
    title: { absolute: `Gonzalo Romero | ${seoTitle}` },
    description: t.home.heroParagraph,
    alternates: buildAlternates(locale, ""),
    openGraph: {
      title: heroTitle,
      description: t.home.heroParagraph,
      url: buildAlternates(locale, "").canonical,
      images: [ogImage],
    },
  };
}

export default function Home() {
  return <HomeView />;
}
