import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Research AI direpresentasikan sebagai lapisan yang menghubungkan tiap
 * titik alur kerja ke satu simpul pusat — bukan kotak fitur berdiri
 * sendiri. Garis dari tiap node ke pusat digambar dengan SVG tipis,
 * sengaja monoline tanpa gradient/glow.
 */
export function AiLayer({ dict }: { dict: Dictionary }) {
  const a = dict.aiLayer;
  const n = a.nodes.length;

  return (
    <section className="bg-paper">
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-research-blue">{a.eyebrow}</p>
          <h2 className="mt-3 font-plex text-2xl font-bold tracking-tight text-research-ink md:text-3xl">
            {a.title}
          </h2>
          <p className="mt-3 text-graphite">{a.subtitle}</p>
        </div>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <svg
            viewBox="0 0 640 240"
            className="mx-auto h-auto w-full max-w-2xl"
            role="img"
            aria-label={`${a.nodes.join(", ")} → ${a.center}`}
          >
            {a.nodes.map((_, i) => {
              const x = 40 + (560 / (n - 1)) * i;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={34}
                  x2={320}
                  y2={190}
                  stroke="#DCE1E8"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  className="motion-safe:animate-dash"
                  style={{ animationDelay: `${i * 250}ms` }}
                />
              );
            })}
            {a.nodes.map((label, i) => {
              const x = 40 + (560 / (n - 1)) * i;
              const anchor = i === 0 ? "start" : i === n - 1 ? "end" : "middle";
              return (
                <g key={label}>
                  <circle cx={x} cy={34} r={4} fill="#FCFCFA" stroke="#3157E8" strokeWidth={1.5} />
                  <text x={x} y={16} textAnchor={anchor} className="font-mono" fontSize={11} fill="#4D5565">
                    {label}
                  </text>
                </g>
              );
            })}
            <circle cx={320} cy={190} r={26} fill="#101A33" stroke="#5268FF" strokeWidth={1.5} className="motion-safe:animate-pulse" />
            <text x={320} y={228} textAnchor="middle" className="font-plex" fontSize={12} fontWeight={600} fill="#0B1220">
              {a.center}
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
