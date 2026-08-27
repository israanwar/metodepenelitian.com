"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getMyResearchNav, getPrimaryNav } from "@/lib/nav";
import { Logo } from "./Logo";
import { MobileNavAccordion, NavDropdown } from "./NavDropdown";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";

/**
 * `isAuthenticated` default ke false karena situs ini belum punya mekanisme
 * autentikasi nyata (lihat src/lib/supabase — belum ada session/JWT check).
 * Prop ini adalah sambungan siap pakai untuk saat autentikasi sungguhan
 * dipasang, bukan status yang ditebak — tidak ada pemanggil yang mengirim
 * true hari ini.
 */
export function Header({
  lang,
  dict,
  isAuthenticated = false,
}: {
  lang: Locale;
  dict: Dictionary;
  isAuthenticated?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const base = `/${lang}`;

  const primaryNav = getPrimaryNav(base);
  const myResearchNav = getMyResearchNav();

  function closeMobile() {
    setMobileOpen(false);
    setExpandedKeys(new Set());
  }

  function toggleExpanded(key: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href={base}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Logo size={44} />
          <span className="hidden font-display text-[13px] font-semibold uppercase leading-none tracking-[0.17em] text-ink-800 sm:inline">
            MetodePenelitian<span className="text-slate-400">.com</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {primaryNav.map((item) => (
            <NavDropdown key={item.label} item={item} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span
            aria-disabled="true"
            title={dict.common.comingSoon}
            className="hidden cursor-default whitespace-nowrap rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500 md:inline-block"
          >
            Copilot · {dict.common.comingSoon}
          </span>

          {isAuthenticated ? (
            <div className="hidden sm:block">
              <NavDropdown item={myResearchNav} />
            </div>
          ) : (
            <>
              <span
                aria-disabled="true"
                title={dict.common.comingSoon}
                className="hidden cursor-default whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-400 lg:inline-block"
              >
                {dict.nav.login} · {dict.common.comingSoon}
              </span>
              <span
                aria-disabled="true"
                title={dict.common.comingSoon}
                className="hidden cursor-default whitespace-nowrap rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-400 lg:inline-block"
              >
                {dict.nav.register} · {dict.common.comingSoon}
              </span>
            </>
          )}

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-md text-slate-700 hover:bg-slate-100 xl:hidden ${FOCUS_RING}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 py-3 xl:hidden">
          <ul>
            {primaryNav.map((item) => (
              <MobileNavAccordion
                key={item.label}
                item={item}
                expanded={expandedKeys.has(item.label)}
                onToggle={() => toggleExpanded(item.label)}
                onNavigate={closeMobile}
              />
            ))}
            {isAuthenticated && (
              <MobileNavAccordion
                item={myResearchNav}
                expanded={expandedKeys.has(myResearchNav.label)}
                onToggle={() => toggleExpanded(myResearchNav.label)}
                onNavigate={closeMobile}
              />
            )}
          </ul>

          <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
            <span
              aria-disabled="true"
              className="block cursor-default rounded-md bg-slate-100 px-3 py-2 text-center text-sm font-semibold text-slate-500"
            >
              Copilot · {dict.common.comingSoon}
            </span>
            {!isAuthenticated && (
              <div className="flex gap-2">
                <span
                  aria-disabled="true"
                  className="flex-1 cursor-default rounded-md border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-400"
                >
                  {dict.nav.login} · {dict.common.comingSoon}
                </span>
                <span
                  aria-disabled="true"
                  className="flex-1 cursor-default rounded-md border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-400"
                >
                  {dict.nav.register} · {dict.common.comingSoon}
                </span>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
