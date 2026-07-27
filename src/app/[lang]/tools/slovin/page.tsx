import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ToolShell } from "@/components/tools/ToolShell";
import { SlovinCalculator } from "@/components/tools/SlovinCalculator";

export default function Page({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);
  return (
    <ToolShell lang={lang} dict={dict} title={dict.tools.slovin.title} desc={dict.tools.slovin.desc}>
      <SlovinCalculator dict={dict} />
    </ToolShell>
  );
}
