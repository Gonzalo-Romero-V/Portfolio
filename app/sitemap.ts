import type { MetadataRoute } from "next";
import { buildAlternates, locales, siteUrl } from "@/lib/seo";

const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "monthly" },
  { path: "/portfolio", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: `${siteUrl}${buildAlternates(locale, path).canonical}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(buildAlternates(locale, path).languages).map(([lang, href]) => [
            lang,
            `${siteUrl}${href}`,
          ]),
        ),
      },
    })),
  );
}
