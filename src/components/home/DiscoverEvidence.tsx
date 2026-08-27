import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Academic evidence engine — bukan search page generik, bukan listing
 * blog. Query contoh + filter ringan + satu ringkasan evidence di atas
 * hasil, lalu 3-4 paper dengan metadata lengkap. Satu paper sudah dalam
 * state "Saved to Literature" untuk menunjukkan sambungan nyata ke
 * proyek yang sama dipakai di Hero dan Research Workspace.
 */
export function DiscoverEvidence({ dict }: { dict: Dictionary }) {
  const d = dict.discoverEvidence;

  return (
    <section className="bg-canvas">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-research-blue">
            {d.eyebrow}
          </p>
          <h2 className="mt-3 font-plex text-2xl font-bold leading-tight tracking-tight text-research-ink md:text-3xl">
            {d.headline}
          </h2>
          <p className="mx-auto mt-3 max-w-md font-plex text-sm text-graphite md:text-base">
            {d.description}
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[1160px] overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-24px_rgba(15,23,42,0.18)]">
          {/* Search bar + filter ringan */}
          <div className="border-b border-hairline px-5 py-4 sm:px-7">
            <div className="mb-4 border-l-2 border-research-blue/30 bg-research-blue/[0.03] px-3 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-research-blue">
                {d.provenanceLabel}
              </p>
              <p className="mt-1 max-w-3xl font-plex text-xs leading-relaxed text-graphite">
                {d.provenanceText}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                {d.sourceStatus}
              </p>
              <dl className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-graphite/70">
                {d.stateSummary.map((state) => (
                  <div key={state.label} className="flex gap-1">
                    <dt>{state.label}</dt>
                    <dd className="text-research-ink">· {state.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-hairline bg-canvas px-4 py-3">
              <span aria-hidden="true" className="font-mono text-sm text-research-blue">
                ⌕
              </span>
              <span className="truncate font-plex text-sm text-research-ink">{d.query}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {d.filters.map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-graphite"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Evidence Summary */}
          <div className="border-b border-hairline bg-research-blue/[0.03] px-5 py-4 sm:px-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-research-blue">
              {d.evidenceLabel}
            </p>
            <p className="mt-1.5 max-w-3xl font-plex text-sm leading-relaxed text-research-ink">
              {d.evidenceText}
            </p>
            <p className="mt-1.5 font-mono text-[11px] text-graphite/70">{d.studiesCount}</p>
          </div>

          {/* Hasil pencarian */}
          <div className="px-5 py-2 sm:px-7">
            <p className="pt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-graphite/70">
              {d.resultsLabel}
            </p>
            <ul>
              {d.papers.map((p) => (
                <li key={p.title} className="border-b border-hairline py-4 last:border-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-plex text-sm font-semibold text-research-ink">{p.title}</p>
                      <p className="mt-1 font-mono text-[11px] text-graphite/70">
                        {p.author} · {p.year} · {p.journal}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider">
                        <span className="text-research-blue">{p.relevance}</span>
                        <span className="text-graphite/40" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-graphite/70">{p.studyType}</span>
                        <span className="text-graphite/40" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-graphite/70">{p.sample}</span>
                        <span className="text-graphite/40" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-graphite/70">{d.citationMetricLabel}</span>
                      </div>

                      <p className="mt-2 font-plex text-sm text-graphite">{p.keyFinding}</p>
                    </div>

                    <div className="shrink-0 sm:pl-4">
                      {p.saved ? (
                        <span className="inline-block whitespace-nowrap rounded-md border border-hairline px-3 py-1.5 font-plex text-xs font-medium text-graphite">
                          {d.savedLabel}
                        </span>
                      ) : (
                        <span
                          aria-disabled="true"
                          className="inline-block cursor-default whitespace-nowrap rounded-md border border-hairline bg-paper px-3 py-1.5 font-plex text-xs font-medium text-graphite"
                        >
                          {d.saveAction} · {dict.common.previewOnly}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sambungan ke proyek — menegaskan Discover terhubung ke Research Workspace */}
          <div className="border-t border-hairline px-5 py-3 sm:px-7">
            <p className="font-mono text-[10px] text-graphite/70">
              <span className="uppercase tracking-wider text-research-blue">{d.projectConnectionLabel}</span>
              {" · "}{d.projectConnectionText} → {d.projectName}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
