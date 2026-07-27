import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function ComingSoon({
  lang,
  dict,
  title,
}: {
  lang: Locale;
  dict: Dictionary;
  title: string;
}) {
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
        {dict.common.comingSoon}
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 max-w-md text-slate-600">{dict.common.comingSoonDesc}</p>
      <Link
        href={`/${lang}`}
        className="mt-8 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
      >
        {dict.common.backHome}
      </Link>
    </section>
  );
}
