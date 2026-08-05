import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/seo";

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (acceptLanguage.toLowerCase().startsWith("en")) return "en";

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Excludes: _next internals, /api, anything with a file extension
  // (images, robots.txt, sitemap.xml, etc.), and the extension-less
  // generated icon/OG-image routes, which would otherwise get redirected
  // to e.g. /es/icon and 404.
  matcher: ["/((?!_next|api|icon$|apple-icon$|opengraph-image$|twitter-image$|.*\\..*).*)"],
};
