import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Hero sebagai satu komposisi rapat: headline, CTA, dan panel Research AI
 * saling terhubung secara visual, bukan headline lalu panel terpisah jauh
 * di bawahnya. Panel terang (bukan navy gelap) — aksen biru dipakai hemat,
 * hanya di elemen yang benar-benar penting.
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const h = dict.hero;

  return (
    <section className="bg-canvas">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[1160px]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-research-blue">
              {h.eyebrow}
            </p>
            <h1 className="mt-4 font-plex text-3xl font-bold leading-[1.15] tracking-tight text-research-ink sm:text-4xl md:text-[2.75rem]">
              {h.headlineLead}
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-plex text-base leading-relaxed text-graphite md:text-lg">
              {h.headlineAccent}
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <span
                aria-disabled="true"
                title={dict.common.comingSoon}
                className="w-full cursor-default rounded-md border border-hairline bg-paper px-5 py-2.5 text-center font-plex text-sm font-semibold text-graphite sm:w-auto"
              >
                {h.ctaPrimary} · {dict.common.comingSoon}
              </span>
              <span
                aria-disabled="true"
                title={dict.common.comingSoon}
                className="w-full cursor-default rounded-md border border-hairline px-5 py-2.5 text-center font-plex text-sm font-semibold text-graphite sm:w-auto"
              >
                {h.ctaSecondary} · {dict.common.comingSoon}
              </span>
            </div>
          </div>

          {/* Research AI panel — focal point terbesar setelah headline */}
          <div className="mx-auto mt-8 overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-24px_rgba(15,23,42,0.18)]">
            {/* Project Context */}
            <div className="border-b border-hairline px-5 py-4 sm:px-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-research-blue">
                  {h.contextLabel}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                  {dict.common.illustrativePreview}
                </p>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
                {h.context.map((c) => (
                  <div key={c.label} className="min-w-0">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                      {c.label}
                    </dt>
                    <dd
                      className="mt-0.5 truncate font-plex text-xs font-semibold text-research-ink"
                      title={c.value}
                    >
                      {c.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* AI command interface */}
            <div className="px-5 py-5 sm:px-7">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-research-blue">
                  {h.aiPanelLabel}
                </p>
                <dl className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                  {dict.common.previewAiStates.map((state) => (
                    <div key={state.label} className="flex gap-1">
                      <dt>{state.label}</dt>
                      <dd className="text-research-ink">· {state.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-hairline bg-canvas px-4 py-3">
                <span aria-hidden="true" className="font-mono text-sm text-research-blue">
                  ›
                </span>
                <span className="truncate font-plex text-sm text-graphite">
                  {h.aiPromptPlaceholder}
                </span>
                <span
                  aria-hidden="true"
                  className="ml-auto h-4 w-px shrink-0 bg-research-blue motion-safe:animate-pulse"
                />
              </div>

              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-graphite/70">
                Suggested actions
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {h.suggestedActions.map((action) => (
                  <li key={action}>
                    <span className="inline-block rounded-md border border-hairline px-3 py-1.5 font-plex text-xs text-graphite">
                      {action}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-plex text-xs leading-relaxed text-graphite">
                {h.aiAuthority}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
