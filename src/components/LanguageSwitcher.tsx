"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  function pathFor(target: Locale): string {
    const segments = pathname.split("/");
    segments[1] = target; // replace locale segment
    return segments.join("/") || `/${target}`;
  }

  return (
    <div className="flex items-center rounded-md border border-slate-200 p-0.5 text-xs font-semibold">
      {locales.map((l) => (
        <Link
          key={l}
          href={pathFor(l)}
          className={`rounded px-2 py-1 uppercase transition ${
            l === lang ? "bg-brand-600 text-white" : "text-slate-500 hover:text-brand-700"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
