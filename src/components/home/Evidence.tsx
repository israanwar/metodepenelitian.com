import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Menunjukkan jejak dari pertanyaan ke jawaban: sumber akademik (paper
 * cards dengan metadata sitasi) → evidence → method → analysis → answer.
 * Tidak ada testimonial atau metrik palsu — semua contoh eksplisit
 * berupa satu kasus riset ilustratif yang sama dipakai di Hero/Workspace.
 */
export function Evidence({ dict }: { dict: Dictionary }) {
  const e = dict.evidence;

  const chain: { label: string; text: string }[] = [
    { label: e.evidenceLabel, text: e.evidenceText },
    { label: e.methodLabel, text: e.methodText },
    { label: e.analysisLabel, text: e.analysisText },
    { label: e.answerLabel, text: e.answerText },
  ];

  return (
    <section className="bg-canvas">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-research-blue">{e.eyebrow}</p>
          <h2 className="mt-3 font-plex text-2xl font-bold tracking-tight text-research-ink md:text-3xl">
            {e.title}
          </h2>
          <p className="mt-3 text-graphite">{e.subtitle}</p>
        </div>

        <div className="mt-12 rounded-xl border border-hairline bg-paper p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-graphite">Question</p>
          <p className="mt-2 font-editorial text-lg italic text-research-ink md:text-xl">
            &ldquo;{e.question}&rdquo;
          </p>
        </div>

        <div className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-graphite">{e.sourcesLabel}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {e.sources.map((s) => (
              <div key={s.title} className="rounded-lg border border-hairline bg-paper p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-research-blue">{s.tag}</p>
                <p className="mt-2 font-plex text-sm font-semibold leading-snug text-research-ink">{s.title}</p>
                <p className="mt-2 font-mono text-[11px] text-graphite">
                  {s.author} · {s.year}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-8 border-l border-hairline pl-6">
          {chain.map((step) => (
            <div key={step.label} className="relative pb-6 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -left-[27px] top-1 h-2 w-2 rounded-full border border-research-blue bg-canvas"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-research-blue">
                {step.label}
              </p>
              <p className="mt-1 font-plex text-sm text-research-ink">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
