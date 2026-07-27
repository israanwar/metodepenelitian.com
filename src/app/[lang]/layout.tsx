import type { Metadata } from "next";
import "../globals.css";
import { locales, isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    alternates: {
      languages: { id: "/id", en: "/en" },
    },
  };
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);

  return (
    <html lang={lang}>
      <body className="flex min-h-screen flex-col">
        <Header lang={lang} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} dict={dict} />
      </body>
    </html>
  );
}
