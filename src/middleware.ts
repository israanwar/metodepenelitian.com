import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

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

  // URL sudah eksplisit /id atau /en -> biarkan apa adanya.
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  // Tidak ada prefix locale di URL: sajikan locale default (id) secara
  // transparan lewat rewrite, bukan redirect — address bar tetap "/",
  // "/learn", dst, tidak berubah jadi "/id/...". Locale lain (mis. en)
  // hanya bisa diakses lewat prefix eksplisit "/en", tidak lagi dideteksi
  // otomatis dari header Accept-Language browser, supaya perilakunya
  // konsisten untuk semua pengunjung, bukan tergantung setelan bahasa
  // browser masing-masing.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
