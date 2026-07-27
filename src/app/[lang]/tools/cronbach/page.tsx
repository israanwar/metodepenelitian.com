import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ToolShell } from "@/components/tools/ToolShell";
import { CronbachCalculator } from "@/components/tools/CronbachCalculator";

export default function Page({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);
  return (
    <ToolShell lang={lang} dict={dict} title={dict.tools.cronbach.title} desc={dict.tools.cronbach.desc}>
      <CronbachCalculator dict={dict} lang={lang} />
    </ToolShell>
  );
}
