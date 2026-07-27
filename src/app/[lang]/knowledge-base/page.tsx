import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { articles } from "@/data/articles";
import { KnowledgeBaseBrowser } from "@/components/KnowledgeBaseBrowser";

export default function KnowledgeBasePage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);

  return (
    <section className="container py-12">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">{dict.kb.title}</h1>
        <p className="mt-3 text-slate-600">{dict.kb.subtitle}</p>
      </header>
      <KnowledgeBaseBrowser lang={lang} dict={dict} articles={articles} />
    </section>
  );
}
