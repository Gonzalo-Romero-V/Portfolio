import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dictionary } from "@/lib/i18n";
import { buildAlternates, isLocale, ogImage } from "@/lib/seo";
import { ContactView } from "@/app/[locale]/contact/contact-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = dictionary[locale];
  const description = `${t.contact.title} ${t.contact.intro}`;

  return {
    title: t.contact.title,
    description,
    alternates: buildAlternates(locale, "/contact"),
    openGraph: {
      title: t.contact.title,
      description,
      url: buildAlternates(locale, "/contact").canonical,
      images: [ogImage],
    },
  };
}

export default function ContactPage() {
  return <ContactView />;
}
