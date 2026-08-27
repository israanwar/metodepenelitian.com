import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Research Lifecycle sebagai baris editorial besar (nomor + nama + daftar
 * kapabilitas), dipisah garis hairline — bukan grid enam kotak identik.
 * "Tanya Research AI" selalu jadi butir terakhir tiap tahap supaya AI
 * terasa mengalir di semua tahap, bukan fitur terpisah.
 */
export function Lifecycle({ dict }: { dict: Dictionary }) {
  const l = dict.lifecycle;

  return (
    <section className="bg-canvas">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-research-blue">{l.eyebrow}</p>
          <h2 className="mt-3 font-plex text-2xl font-bold tracking-tight text-research-ink md:text-3xl">
            {l.title}
          </h2>
          <p className="mt-3 text-graphite">{l.subtitle}</p>
        </div>

        <div className="mt-12 border-t border-hairline">
          {l.stages.map((stage) => (
            <div
              key={stage.number}
              className="grid gap-6 border-b border-hairline py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10 lg:py-10"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-2xl text-hairline md:text-3xl">{stage.number}</span>
                <div>
                  <h3 className="font-plex text-xl font-bold text-research-ink md:text-2xl">{stage.name}</h3>
                  <p className="mt-1 max-w-sm text-sm text-graphite">{stage.description}</p>
                </div>
              </div>

              <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {stage.items.map((item) => {
                  const isAi = item === "Tanya Research AI" || item === "Ask Research AI";
                  return (
                    <li
                      key={item}
                      className={`flex items-start gap-2 font-plex text-sm ${
                        isAi ? "font-medium text-research-blue" : "text-graphite"
                      }`}
                    >
                      <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
