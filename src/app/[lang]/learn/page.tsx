import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);
  return <ComingSoon lang={lang} dict={dict} title={dict.nav.learn} />;
}
