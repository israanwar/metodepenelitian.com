import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function ToolShell({
  lang,
  dict,
  title,
  desc,
  children,
}: {
  lang: Locale;
  dict: Dictionary;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container max-w-2xl py-12">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href={`/${lang}/tools`} className="hover:text-brand-700">
          {dict.tools.title}
        </Link>
        <span>/</span>
        <span className="text-slate-700">{title}</span>
      </nav>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{desc}</p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}

export function fieldClass() {
  return "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
}
