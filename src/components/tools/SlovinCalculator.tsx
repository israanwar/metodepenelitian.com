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

  function calculate() {
    setTouched(true);
    setResult(sampleSizeSlovin(Number(population), Number(margin)));
  }

  function reset() {
    setPopulation("1000");
    setMargin("5");
    setResult(null);
    setTouched(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{t.slovin.population}</label>
        <input type="number" min="1" value={population} onChange={(e) => setPopulation(e.target.value)} className={fieldClass()} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{t.slovin.margin}</label>
        <input type="number" min="0.1" step="0.1" value={margin} onChange={(e) => setMargin(e.target.value)} className={fieldClass()} />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={calculate} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          {t.calculate}
        </button>
        <button onClick={reset} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {t.reset}
        </button>
      </div>

      {touched && (
        <div className="mt-2 rounded-lg bg-brand-50 p-4 text-center">
          <p className="text-sm text-slate-600">{t.slovin.resultLabel}</p>
          <p className="mt-1 text-4xl font-bold text-brand-700">{result ?? "—"}</p>
          <p className="mt-1 text-xs text-slate-400">n = N / (1 + N·e²)</p>
        </div>
      )}
    </div>
  );
}
