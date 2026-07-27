import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, defaultLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  articles,
  getArticle,
  relatedArticles,
  categoryLabels,
  localize,
} from "@/data/articles";
import { ArticleFeedback } from "@/components/ArticleFeedback";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    articles.map((a) => ({ lang, slug: a.slug }))
  );
}

export default function ArticlePage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);
  const article = getArticle(params.slug);
  if (!article) notFound();

  const related = relatedArticles(article);
  const dateFmt = new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(article.updatedAt));

  return (
    <article className="container max-w-3xl py-12">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href={`/${lang}`} className="hover:text-brand-700">
          {dict.nav.home}
        </Link>
        <span>/</span>
        <Link href={`/${lang}/knowledge-base`} className="hover:text-brand-700">
          {dict.kb.title}
        </Link>
        <span>/</span>
        <span className="text-slate-700">{localize(categoryLabels[article.category], lang)}</span>
      </nav>

      <header className="mt-6">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {localize(categoryLabels[article.category], lang)}
        </span>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
          {localize(article.title, lang)}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{article.author}</span>
          <span>•</span>
          <span>{dateFmt}</span>
          <span>•</span>
          <span>{article.readingMinutes} {dict.kb.readingTime}</span>
        </div>
      </header>

      <div
        className="prose-academic mt-8"
        dangerouslySetInnerHTML={{ __html: localize(article.body, lang) }}
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {article.tags.map((t) => (
          <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            #{t}
          </span>
        ))}
      </div>

      <ArticleFeedback dict={dict} />

      {related.length > 0 && (
        <section className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold text-slate-900">{dict.kb.relatedArticles}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/${lang}/knowledge-base/${r.slug}`}
                className="rounded-lg border border-slate-200 p-4 transition hover:border-brand-300 hover:shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">{localize(r.title, lang)}</p>
                <p className="mt-1 text-xs text-slate-500">{r.readingMinutes} {dict.kb.readingTime}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link href={`/${lang}/knowledge-base`} className="text-sm font-medium text-brand-700 hover:underline">
          ← {dict.kb.backToList}
        </Link>
      </div>
    </article>
  );
}
