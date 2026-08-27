import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Menunjukkan Research Operating System sebagai ruang kerja nyata, bukan
 * janji abstrak. Sidebar proyek (tree) di kiri, panel Methodology aktif
 * di kanan dengan data yang saling berkaitan dengan proyek contoh yang
 * sama dipakai di Hero — supaya composition ini terasa satu kasus nyata,
 * bukan potongan konten acak.
 */
export function Workspace({ dict }: { dict: Dictionary }) {
  const w = dict.workspace;

  return (
    <section className="bg-research-navy">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-research-indigo">{w.eyebrow}</p>
          <h2 className="mt-3 font-plex text-2xl font-bold tracking-tight text-white md:text-3xl">
            {w.title}
          </h2>
          <p className="mt-3 text-white/60">{w.subtitle}</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-white/10 bg-research-ink shadow-[0_20px_60px_-25px_rgba(0,0,0,0.6)]">
          <div className="grid lg:grid-cols-[240px_minmax(0,1fr)]">
            {/* Sidebar: struktur proyek */}
            <aside className="border-b border-white/10 px-5 py-6 lg:border-b-0 lg:border-r">
              <p className="truncate font-plex text-sm font-semibold text-white" title={w.projectName}>
                {w.projectName}
              </p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-white/40">
                {w.projectMeta}
              </p>

              <nav className="mt-6">
                <ul className="space-y-0.5">
                  {w.tree.map((item) => {
                    const active = item === w.activeSection;
                    return (
                      <li key={item}>
                        <span
                          className={`block rounded-md px-2.5 py-1.5 font-plex text-sm ${
                            active
                              ? "bg-research-blue/15 font-medium text-white"
                              : "text-white/50"
                          }`}
                        >
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            {/* Panel aktif: Methodology */}
            <div className="px-5 py-6 sm:px-8 sm:py-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                {w.activeSection}
              </p>

              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">Method</dt>
                  <dd className="mt-1 font-plex text-sm font-medium text-white">{w.panel.method}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">Sampling</dt>
                  <dd className="mt-1 font-plex text-sm font-medium text-white">{w.panel.sampling}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">Sample</dt>
                  <dd className="mt-1 font-plex text-sm font-medium text-white">{w.panel.sampleSize}</dd>
                </div>
              </dl>

              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                {w.panel.variablesLabel}
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 pr-4 font-mono text-[10px] font-normal uppercase tracking-wider text-white/40">
                        Variable
                      </th>
                      <th className="py-2 pr-4 font-mono text-[10px] font-normal uppercase tracking-wider text-white/40">
                        Type
                      </th>
                      <th className="py-2 font-mono text-[10px] font-normal uppercase tracking-wider text-white/40">
                        Indicator
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {w.panel.variables.map((v) => (
                      <tr key={v.name} className="border-b border-white/5">
                        <td className="py-2.5 pr-4 font-plex text-sm text-white">{v.name}</td>
                        <td className="py-2.5 pr-4 font-mono text-xs text-research-indigo">{v.type}</td>
                        <td className="py-2.5 font-plex text-xs text-white/60">{v.indicator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-research-indigo/30 bg-research-indigo/10 px-4 py-3">
                <span aria-hidden="true" className="mt-1 font-mono text-xs text-research-indigo">
                  ›
                </span>
                <p className="font-plex text-xs text-white/80">{w.panel.aiNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
