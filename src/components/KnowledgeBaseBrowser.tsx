"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  type Article,
  type ArticleCategory,
  categoryLabels,
  localize,
} from "@/data/articles";

const categories: (ArticleCategory | "all")[] = [
  "all",
  "methodology",
  "statistics",
  "academic-writing",
  "publication",
];

export function KnowledgeBaseBrowser({
  lang,
  dict,
  articles,
}: {
  lang: Locale;
  dict: Dictionary;
  articles: Article[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ArticleCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (q.length < 2) return true;
      const haystack = [
        localize(a.title, lang),
        localize(a.excerpt, lang),
        a.tags.join(" "),
        a.author,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [articles, query, category, lang]);

  return (
    <div className="mx-auto mt-10 max-w-5xl">
      {/* Search + filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.kb.searchPlaceholder}
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              category === c
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {c === "all" ? dict.kb.allCategories : localize(categoryLabels[c], lang)}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-slate-500">{dict.kb.noResults}</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {filtered.map((a) => (
            <Link
              key={a.slug}
              href={`/${lang}/knowledge-base/${a.slug}`}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                {localize(categoryLabels[a.category], lang)}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-brand-700">
                {localize(a.title, lang)}
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{localize(a.excerpt, lang)}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                <span>{a.author}</span>
                <span>•</span>
                <span>{a.readingMinutes} {dict.kb.readingTime}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
