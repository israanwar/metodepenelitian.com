"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const base = `/${lang}`;

  const links = [
    { href: `${base}/learn`, label: dict.nav.learn },
    { href: `${base}/research-hub`, label: dict.nav.researchHub },
    { href: `${base}/ai`, label: dict.nav.ai },
    { href: `${base}/tools`, label: dict.nav.tools },
    { href: `${base}/repository`, label: dict.nav.repository },
    { href: `${base}/community`, label: dict.nav.community },
    { href: `${base}/pricing`, label: dict.nav.pricing },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href={base} className="flex items-center gap-2 shrink-0">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            MP
          </span>
          <span className="hidden text-lg font-bold text-slate-900 sm:inline">
            MetodePenelitian
            <span className="text-brand-600">.com</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-brand-700"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher lang={lang} />
          <Link
            href={`${base}/login`}
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-700 sm:inline-block"
          >
            {dict.nav.login}
          </Link>
          <Link
            href={`${base}/register`}
            className="hidden rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 sm:inline-block"
          >
            {dict.nav.register}
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-md text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-2 pt-2">
              <Link href={`${base}/login`} className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-medium">
                {dict.nav.login}
              </Link>
              <Link href={`${base}/register`} className="flex-1 rounded-md bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white">
                {dict.nav.register}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
