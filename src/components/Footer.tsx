import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getFooterColumns } from "@/lib/nav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

const CONTACT_EMAIL = "admin@metodepenelitian.com";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const base = `/${lang}`;
  const year = new Date().getFullYear();
  const columns = getFooterColumns(base);

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div>
          <div className="flex items-center gap-2">
            <Logo size={44} />
            <span className="font-display text-[13px] font-semibold uppercase leading-none tracking-[0.17em] text-ink-800">
              MetodePenelitian<span className="text-slate-400">.com</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-600">{dict.footer.tagline}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 inline-block text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) =>
                  l.href ? (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-slate-600 transition hover:text-brand-700">
                        {l.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <span aria-disabled="true" className="cursor-default text-sm text-slate-400">
                        {l.label}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-slate-500 sm:flex-row">
          <p>
            © {year} MetodePenelitian.com. {dict.footer.rights}
          </p>
          <LanguageSwitcher lang={lang} />
        </div>
      </div>
    </footer>
  );
}
