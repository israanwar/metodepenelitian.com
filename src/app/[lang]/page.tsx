import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Hero } from "@/components/home/Hero";
import { ResearchWorkspace } from "@/components/home/ResearchWorkspace";
import { DiscoverEvidence } from "@/components/home/DiscoverEvidence";
import { MethodologyAnalysis } from "@/components/home/MethodologyAnalysis";
import { ClosingCta } from "@/components/home/ClosingCta";

export default function LandingPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);
  return (
    <>
      <Hero dict={dict} />
      <ResearchWorkspace dict={dict} />
      <DiscoverEvidence dict={dict} />
      <MethodologyAnalysis dict={dict} />
      <ClosingCta dict={dict} />
    </>
  );
}
