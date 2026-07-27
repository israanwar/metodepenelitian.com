import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

function getLocale(request: NextRequest): string {
  const accept = request.headers.get("accept-language");
  if (accept) {
    const preferred = accept.split(",").map((p) => p.split(";")[0].trim().slice(0, 2));
    for (const p of preferred) {
      if ((locales as readonly string[]).includes(p)) return p;
    }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths and files with extensions
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
