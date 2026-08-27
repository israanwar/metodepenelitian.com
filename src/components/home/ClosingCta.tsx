import type { Dictionary } from "@/i18n/dictionaries";

export function ClosingCta({ dict }: { dict: Dictionary }) {
  const c = dict.cta;

  return (
    <section className="bg-canvas">
      <div className="container py-16 md:py-24">
        <div className="rounded-xl bg-research-navy px-8 py-14 text-center sm:px-14">
          <h2 className="font-plex text-2xl font-bold text-white md:text-3xl">{c.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/60">{c.subtitle}</p>
          <span
            aria-disabled="true"
            title={dict.common.comingSoon}
            className="mt-8 inline-block cursor-default rounded-md border border-white/20 bg-white/10 px-6 py-3 font-plex text-sm font-semibold text-white/70"
          >
            {c.button} · {dict.common.comingSoon}
          </span>
        </div>
      </div>
    </section>
  );
}
