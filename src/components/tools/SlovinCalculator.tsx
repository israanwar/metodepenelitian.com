"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { sampleSizeSlovin } from "@/lib/calculators";
import { fieldClass } from "./ToolShell";

export function SlovinCalculator({ dict }: { dict: Dictionary }) {
  const t = dict.tools;
  const [population, setPopulation] = useState("1000");
  const [margin, setMargin] = useState("5");
  const [result, setResult] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const [announcement, setAnnouncement] = useState({ id: 0, message: "" });

  const invalidPopulation = touched && Number(population) <= 0;
  const invalidMargin = touched && Number(margin) <= 0;

  function announce(message: string) {
    setAnnouncement((current) => ({ id: current.id + 1, message }));
  }

  function calculate() {
    setTouched(true);
    const n = sampleSizeSlovin(Number(population), Number(margin));
    setResult(n);
    announce(n === null ? "" : `${t.slovin.resultLabel}: ${n}`);
  }

  function reset() {
    setPopulation("1000");
    setMargin("5");
    setResult(null);
    setTouched(false);
    announce(t.resetComplete);
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="slovin-population" className="mb-1 block text-sm font-medium text-slate-700">{t.slovin.population}</label>
        <input
          id="slovin-population"
          type="number"
          min="1"
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
          aria-describedby={invalidPopulation ? "slovin-error" : undefined}
          aria-invalid={invalidPopulation || undefined}
          className={fieldClass()}
        />
      </div>
      <div>
        <label htmlFor="slovin-margin" className="mb-1 block text-sm font-medium text-slate-700">{t.slovin.margin}</label>
        <input
          id="slovin-margin"
          type="number"
          min="0.1"
          step="0.1"
          value={margin}
          onChange={(e) => setMargin(e.target.value)}
          aria-describedby={invalidMargin ? "slovin-error" : undefined}
          aria-invalid={invalidMargin || undefined}
          className={fieldClass()}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={calculate} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          {t.calculate}
        </button>
        <button onClick={reset} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {t.reset}
        </button>
      </div>

      {touched && result === null ? (
        <p id="slovin-error" role="alert" aria-atomic="true" className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {t.slovin.invalidInput}
        </p>
      ) : touched && (
        <div className="mt-2 rounded-lg bg-brand-50 p-4 text-center">
          <p className="text-sm text-slate-600">{t.slovin.resultLabel}</p>
          <p className="mt-1 text-4xl font-bold text-brand-700">{result}</p>
          <p className="mt-1 text-xs text-slate-400">n = N / (1 + N·e²)</p>
        </div>
      )}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        <span key={announcement.id}>{announcement.message}</span>
      </p>
    </div>
  );
}
