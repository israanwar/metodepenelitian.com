"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type PersonaKey = keyof Dictionary["personas"]["items"];

/**
 * "Built for every level of research" sebagai komposisi tab interaktif,
 * bukan empat kartu identik. Memilih persona mengganti panel workflow di
 * kanan, menonjolkan perbedaan penekanan tiap jenjang pada sistem yang
 * sama.
 */
export function PersonaTabs({ dict }: { dict: Dictionary }) {
  const p = dict.personas;
  const keys = Object.keys(p.items) as PersonaKey[];
  const [active, setActive] = useState<PersonaKey>(keys[0]);
  const current = p.items[active];

  return (
    <section className="bg-paper">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-research-blue">{p.eyebrow}</p>
          <h2 className="mt-3 font-plex text-2xl font-bold tracking-tight text-research-ink md:text-3xl">
            {p.title}
          </h2>
          <p className="mt-3 text-graphite">{p.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
          <div
            role="tablist"
            aria-label={p.eyebrow}
            className="flex gap-2 overflow-x-auto border-b border-hairline pb-px lg:flex-col lg:gap-0.5 lg:overflow-visible lg:border-b-0 lg:border-l"
          >
            {keys.map((key) => {
              const isActive = key === active;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(key)}
                  className={`shrink-0 whitespace-nowrap px-3 py-2.5 text-left font-plex text-sm transition lg:-ml-px lg:border-l lg:px-4 ${
                    isActive
                      ? "border-b-2 border-research-blue font-semibold text-research-ink lg:border-b-0 lg:border-l-2"
                      : "border-b-2 border-transparent text-graphite hover:text-research-ink lg:border-l-2"
                  }`}
                >
                  {p.items[key].title}
                </button>
              );
            })}
          </div>

          <div key={active} className="motion-safe:animate-fadeIn">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-research-blue">
              {current.focus}
            </p>
            <h3 className="mt-2 font-plex text-xl font-bold text-research-ink">{current.title}</h3>
            <p className="mt-2 max-w-xl text-sm text-graphite">{current.desc}</p>

            <ul className="mt-6 space-y-3">
              {current.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 font-plex text-sm text-research-ink">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-research-blue" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
