import Link from "next/link";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default function ToolsPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);
  const base = `/${lang}/tools`;

  const tools = [
    { href: `${base}/sample-size`, ...dict.tools.sampleSize },
    { href: `${base}/slovin`, ...dict.tools.slovin },
    { href: `${base}/cronbach`, ...dict.tools.cronbach },
    { href: `${base}/citation`, ...dict.tools.citation },
  ];

  return (
    <section className="container py-12">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">{dict.tools.title}</h1>
        <p className="mt-3 text-slate-600">{dict.tools.subtitle}</p>
      </header>

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">
              {t.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{t.desc}</p>
            <span className="mt-4 inline-block text-sm font-medium text-brand-700">
              {dict.tools.open} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
