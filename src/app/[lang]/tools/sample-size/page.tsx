import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ToolShell } from "@/components/tools/ToolShell";
import { SampleSizeCalculator } from "@/components/tools/SampleSizeCalculator";

export default function Page({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);
  return (
    <ToolShell lang={lang} dict={dict} title={dict.tools.sampleSize.title} desc={dict.tools.sampleSize.desc}>
      <SampleSizeCalculator dict={dict} />
    </ToolShell>
  );
}
