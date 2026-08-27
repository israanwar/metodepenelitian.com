import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Product showcase besar: satu tangkapan believable dari ruang kerja
 * penelitian sungguhan, bukan ilustrasi atau feature-card grid. Terang
 * (white/warm-white), biru cuma dipakai untuk state aktif/aksi. Research
 * AI muncul sebagai saran kontekstual di dalam panel Methodology, bukan
 * chatbot terpisah.
 */
export function ResearchWorkspace({ dict }: { dict: Dictionary }) {
  const w = dict.researchWorkspace;

  return (
    <section className="bg-canvas">
      <div className="container py-10 md:py-14">
        {/* Copy: sengaja ringkas, jauh lebih kecil dari product UI di bawahnya */}
        <div className="mx-auto max-w-xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-research-blue">
            {w.eyebrow}
          </p>
          <h2 className="mt-3 font-plex text-2xl font-bold leading-tight tracking-tight text-research-ink md:text-3xl">
            {w.headline}
          </h2>
          <p className="mx-auto mt-3 max-w-md font-plex text-sm text-graphite md:text-base">
            {w.description}
          </p>
        </div>

        {/* Product UI */}
        <div className="mx-auto mt-8 max-w-[1160px] overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-24px_rgba(15,23,42,0.18)]">
          {/* Title bar proyek */}
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-hairline px-5 py-3.5 sm:px-6">
            <div className="min-w-0">
              <p className="truncate font-plex text-sm font-semibold text-research-ink" title={w.projectName}>
                {w.projectName}
              </p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                {w.projectMeta}
              </p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-graphite/70">
              {dict.common.illustrativePreview}
            </p>
          </div>

          <div className="grid lg:grid-cols-[200px_minmax(0,1fr)]">
            {/* Nav: sidebar di desktop, tab horizontal-scroll di mobile */}
            <div
              aria-label={w.projectName}
              className="flex gap-1 overflow-x-auto border-b border-hairline px-3 py-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:border-b-0 lg:border-r lg:px-3 lg:py-4"
            >
              {w.nav.map((item) => {
                const active = item === w.activeSection;
                return (
                  <span
                    key={item}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 font-plex text-sm lg:px-2.5 ${
                      active
                        ? "bg-research-blue/[0.08] font-semibold text-research-blue"
                        : "text-graphite"
                    }`}
                  >
                    {item}
                  </span>
                );
              })}
            </div>

            {/* Panel Methodology */}
            <div className="px-5 py-5 sm:px-7 sm:py-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-graphite/70">
                {w.selectionLabel} · {w.activeSection}
              </p>

              {/* Stat row — teks label/nilai polos, bukan kartu KPI berwarna */}
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3.5 border-b border-hairline pb-5 sm:grid-cols-3">
                {w.stats.map((s) => (
                  <div key={s.label} className="min-w-0">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                      {s.label}
                    </dt>
                    <dd className="mt-0.5 truncate font-plex text-sm font-semibold text-research-ink" title={s.value}>
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Struktur metodologi — bukan sekadar angka */}
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-graphite/70">
                {w.structureLabel}
              </p>
              <ol className="mt-2.5">
                {w.structure.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 border-b border-hairline py-2 last:border-0"
                  >
                    <span className="font-mono text-xs text-graphite/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-plex text-sm text-research-ink">{item}</span>
                  </li>
                ))}
              </ol>

              {/* Research AI: saran kontekstual, bukan chatbot terpisah */}
              <div className="mt-5 flex flex-col gap-3 rounded-lg border border-hairline bg-canvas px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-research-blue">
                      {w.aiLabel}
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
                  <p className="mt-1 font-plex text-sm text-research-ink">{w.aiText}</p>
                  <dl className="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                    {w.aiDetails.map((item) => (
                      <div key={item.label}>
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                          {item.label}
                        </dt>
                        <dd className="mt-0.5 font-plex text-xs leading-relaxed text-graphite">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 font-plex text-xs font-medium text-research-ink">
                    {w.aiAuthority}
                  </p>
                </div>
                <span
                  aria-disabled="true"
                  className="shrink-0 font-plex text-xs text-graphite/70"
                >
                  {w.aiAction} · {dict.common.previewOnly}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
