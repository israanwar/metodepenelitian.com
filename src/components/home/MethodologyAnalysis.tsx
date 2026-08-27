import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Analysis Advisor: satu interface padat, bukan kumpulan card. Konteks
 * proyek → rekomendasi metode → alur analisis (rows, bukan progress
 * gamification) → preview hasil + satu insight Research AI → software
 * yang kompatibel disebut sebagai teks, bukan logo palsu.
 */
export function MethodologyAnalysis({ dict }: { dict: Dictionary }) {
  const m = dict.methodologyAnalysis;

  const stateClass: Record<string, string> = {
    COMPLETE: "text-graphite",
    READY: "font-semibold text-research-blue",
    NOT_STARTED: "text-graphite/70",
  };

  return (
    <section className="bg-canvas">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-research-blue">
            {m.eyebrow}
          </p>
          <h2 className="mt-3 font-plex text-2xl font-bold leading-tight tracking-tight text-research-ink md:text-3xl">
            {m.headline}
          </h2>
          <p className="mx-auto mt-3 max-w-md font-plex text-sm text-graphite md:text-base">
            {m.description}
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[1160px] overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-24px_rgba(15,23,42,0.18)]">
          {/* Title bar proyek — konsisten dengan Research Workspace */}
          <div className="border-b border-hairline px-5 py-3.5 sm:px-7">
            <p className="truncate font-plex text-sm font-semibold text-research-ink" title={m.projectName}>
              {m.projectName}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-graphite/70">
              {m.contextLabel}
            </p>
          </div>

          {/* Satu boundary untuk seluruh metadata, workflow, hasil, dan interpretasi contoh. */}
          <div className="border-b border-hairline px-5 py-4 sm:px-7">
            <div className="border-l-2 border-research-blue/30 bg-research-blue/[0.03] px-3 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-research-blue">
                {m.provenanceLabel}
              </p>
              <p className="mt-1 max-w-3xl font-plex text-xs leading-relaxed text-graphite">
                {m.provenanceText}
              </p>
            </div>
          </div>

          {/* Context row */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3.5 border-b border-hairline px-5 py-4 sm:grid-cols-3 sm:px-7 lg:grid-cols-6">
            {m.context.map((c) => (
              <div key={c.label} className="min-w-0">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                  {c.label}
                </dt>
                <dd className="mt-0.5 truncate font-plex text-xs font-semibold text-research-ink" title={c.value}>
                  {c.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Recommended Analysis — puncak visual panel */}
          <div className="border-b border-hairline bg-research-blue/[0.03] px-5 py-5 sm:px-7">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-research-blue">
                {m.recommendedLabel}
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
            <p className="mt-1.5 font-plex text-xl font-bold text-research-ink md:text-2xl">
              {m.recommendedMethod}
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-graphite/70">
              {m.whyLabel}
            </p>
            <p className="mt-1.5 max-w-2xl font-plex text-sm leading-relaxed text-graphite">
              {m.recommendedReasoning}
            </p>
            <dl className="mt-4 grid max-w-4xl gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {m.proposalDetails.map((item) => (
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
            <p className="mt-4 font-plex text-xs font-medium text-research-ink">
              {m.proposalAuthority}
            </p>
          </div>

          {/* Analysis Flow — rows dengan status teks, bukan progress bar */}
          <div className="border-b border-hairline px-5 py-4 sm:px-7">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-graphite/70">
                {m.flowLabel}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                {m.flowStatusNote}
              </p>
            </div>
            <ol className="mt-3 flex flex-wrap">
              {m.flow.map((f, i) => (
                <li
                  key={f.step}
                  className={`flex-1 basis-1/3 border-hairline py-2 pr-4 sm:basis-1/6 ${
                    i > 0 ? "border-t sm:border-l sm:border-t-0 sm:pl-4" : ""
                  }`}
                >
                  <p className="font-plex text-xs font-medium text-research-ink">{f.step}</p>
                  <p className={`mt-0.5 font-mono text-[10px] uppercase tracking-wider ${stateClass[f.state]}`}>
                    {m.workflowStateLabel} · {f.state}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Result Preview + Research AI */}
          <div className="grid gap-0 border-b border-hairline sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="border-b border-hairline px-5 py-5 sm:border-b-0 sm:border-r sm:px-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-graphite/70">
                {m.resultLabel}
              </p>
              <dl className="mt-3 grid grid-cols-1 gap-x-5 gap-y-2 border-b border-hairline pb-3 lg:grid-cols-3">
                {m.resultProvenance.map((item) => (
                  <div key={item.label} className="min-w-0">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                      {item.label}
                    </dt>
                    <dd className="mt-0.5 font-plex text-xs font-medium text-research-ink">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
                {m.resultStats.map((s) => (
                  <div key={s.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                      {s.label}
                    </dt>
                    <dd className="mt-0.5 font-mono text-base font-semibold tabular-nums text-research-ink">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                  {m.interpretationLabel}
                </p>
                <p className="mt-1 font-plex text-sm text-graphite">{m.resultInterpretation}</p>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-research-blue">
                {m.aiLabel}
              </p>
              <dl className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                {dict.common.previewAiStates.map((state) => (
                  <div key={state.label} className="flex gap-1">
                    <dt>{state.label}</dt>
                    <dd className="text-research-ink">· {state.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-1.5 font-plex text-sm text-research-ink">{m.aiText}</p>
              <p className="mt-3 font-plex text-xs leading-relaxed text-graphite">
                {m.aiAuthority}
              </p>
            </div>
          </div>

          {/* Software connection — teks saja, tanpa logo */}
          <div className="px-5 py-3 sm:px-7">
            <p className="font-mono text-[10px] text-graphite/70">
              <span className="uppercase tracking-wider">{m.softwareLabel}</span>{" "}
              <span className="text-research-ink">{m.software.join(" · ")}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
