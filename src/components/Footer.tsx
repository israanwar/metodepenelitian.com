import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const base = `/${lang}`;
  const year = new Date().getFullYear();

  const cols = [
    {
      title: dict.footer.product,
      links: [
        { href: `${base}/learn`, label: dict.nav.learn },
        { href: `${base}/research-hub`, label: dict.nav.researchHub },
        { href: `${base}/ai`, label: dict.nav.ai },
        { href: `${base}/tools`, label: dict.nav.tools },
        { href: `${base}/repository`, label: dict.nav.repository },
      ],
    },
    {
      title: dict.footer.resources,
      links: [
        { href: `${base}/blog`, label: dict.nav.blog },
        { href: `${base}/knowledge-base`, label: "Knowledge Base" },
        { href: `${base}/community`, label: dict.nav.community },
        { href: `${base}/faq`, label: dict.footer.faq },
      ],
    },
    {
      title: dict.footer.company,
      links: [
        { href: `${base}/about`, label: dict.footer.about },
        { href: `${base}/contact`, label: dict.footer.contact },
        { href: `${base}/pricing`, label: dict.nav.pricing },
        { href: `${base}/privacy`, label: dict.footer.privacy },
        { href: `${base}/terms`, label: dict.footer.terms },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              MP
            </span>
            <span className="text-lg font-bold text-slate-900">
              MetodePenelitian<span className="text-brand-600">.com</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-600">{dict.footer.tagline}</p>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-slate-900">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-600 transition hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-sm text-slate-500 sm:flex-row">
          <p>© {year} MetodePenelitian.com. {dict.footer.rights}</p>
          <p>Made for Indonesian academia 🎓</p>
        </div>
      </div>
    </footer>
  );
}
