import Link from "next/link";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const moduleIcons: Record<string, string> = {
  knowledgeBase: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z",
  ai: "M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4-2.5 5.2V17a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-2.8C6.2 13 5 11.4 5 9a7 7 0 0 1 7-7ZM9 21h6",
  tools: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2-.5-.5-2 2.1-2.1Z",
  repository: "M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z",
  academy: "M22 10 12 5 2 10l10 5 10-5ZM6 12v5c0 1 3 3 6 3s6-2 6-3v-5",
  community: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
};

const moduleHrefs: Record<string, string> = {
  knowledgeBase: "/knowledge-base",
  ai: "/ai",
  tools: "/tools",
  repository: "/repository",
  academy: "/learn",
  community: "/community",
};

export default function LandingPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);
  const base = `/${lang}`;
  const m = dict.modules.items;
  const p = dict.personas.items;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="container grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              {dict.hero.badge}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
              {dict.hero.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">{dict.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`${base}/register`}
                className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                {dict.hero.ctaPrimary}
              </Link>
              <Link
                href={`${base}/tools`}
                className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {dict.hero.ctaSecondary}
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
              {[dict.hero.stat1, dict.hero.stat2, dict.hero.stat3].map((s) => (
                <p key={s} className="text-sm font-medium text-slate-600">
                  {s}
                </p>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-slate-400">AI Research Title Generator</span>
              </div>
              <div className="space-y-3 pt-4">
                <p className="text-xs font-semibold uppercase text-slate-400">Topik</p>
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  Pengaruh media sosial terhadap motivasi belajar mahasiswa
                </p>
                <p className="text-xs font-semibold uppercase text-slate-400">Saran Judul</p>
                {[
                  "Analisis Pengaruh Intensitas Penggunaan Media Sosial terhadap Motivasi Belajar Mahasiswa",
                  "Peran Media Sosial dalam Membentuk Motivasi Akademik: Studi pada Mahasiswa S1",
                  "Hubungan Penggunaan Instagram dan TikTok dengan Prestasi Belajar Mahasiswa",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-brand-500">✦</span>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">{dict.modules.title}</h2>
          <p className="mt-3 text-slate-600">{dict.modules.subtitle}</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(m) as Array<keyof typeof m>).map((key) => (
            <Link
              key={key}
              href={`${base}${moduleHrefs[key]}`}
              className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
            >
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={moduleIcons[key]} />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{m[key].title}</h3>
              <p className="mt-2 text-sm text-slate-600">{m[key].desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Personas */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">{dict.personas.title}</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(p) as Array<keyof typeof p>).map((key) => (
              <div key={key} className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-brand-700">{p[key].title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p[key].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 md:py-24">
        <div className="rounded-2xl bg-brand-600 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">{dict.cta.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">{dict.cta.subtitle}</p>
          <Link
            href={`${base}/register`}
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            {dict.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
