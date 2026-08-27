import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Signature visual: Method Graph. 11 titik metodologis dikelompokkan
 * jadi 4 fase (Foundation/Design/Execution/Outcome) sebagai kolom yang
 * saling terhubung — bukan flowchart kotak-panah biasa. Tiap node
 * adalah penanda titik pada garis vertikal tipis, dengan metadata
 * mono di sampingnya, mengikuti gaya catatan riset presisi.
 */
export function MethodGraph({ dict }: { dict: Dictionary }) {
  const g = dict.graph;

  return (
    <section className="bg-paper">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-research-blue">{g.eyebrow}</p>
          <h2 className="mt-3 font-plex text-2xl font-bold tracking-tight text-research-ink md:text-3xl">
            {g.title}
          </h2>
          <p className="mt-3 text-graphite">{g.subtitle}</p>
        </div>

        <div className="relative mt-14">
          {/* rail penghubung antar-fase, hanya terlihat di layar lebar */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-3 hidden h-px bg-hairline lg:block"
          />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {g.phases.map((phase, phaseIndex) => (
              <div key={phase.name} className="relative">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="relative z-10 h-1.5 w-1.5 shrink-0 rounded-full bg-research-blue motion-safe:animate-pulse"
                    style={{ animationDelay: `${phaseIndex * 300}ms` }}
                  />
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">
                    Phase {String(phaseIndex + 1).padStart(2, "0")} — {phase.name}
                  </p>
                </div>

                <ol className="relative mt-4 space-y-4 border-l border-hairline pl-5">
                  {phase.nodes.map((node) => (
                    <li key={node.label} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-research-blue bg-paper"
                      />
                      <p className="font-plex text-sm font-semibold text-research-ink">{node.label}</p>
                      <p className="font-mono text-[11px] text-graphite">{node.meta}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
