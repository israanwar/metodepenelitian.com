"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { sampleSizeCochran } from "@/lib/calculators";
import { fieldClass } from "./ToolShell";

export function SampleSizeCalculator({ dict }: { dict: Dictionary }) {
  const t = dict.tools;
  const [population, setPopulation] = useState("");
  const [confidence, setConfidence] = useState("95");
  const [margin, setMargin] = useState("5");
  const [proportion, setProportion] = useState("0.5");
  const [result, setResult] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);

  function calculate() {
    setTouched(true);
    const n = sampleSizeCochran({
      confidence,
      marginPct: Number(margin),
      proportion: Number(proportion),
      population: population ? Number(population) : undefined,
    });
    setResult(n);
  }

  function reset() {
    setPopulation("");
    setConfidence("95");
    setMargin("5");
    setProportion("0.5");
    setResult(null);
    setTouched(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{t.sampleSize.population}</label>
        <input type="number" min="1" value={population} onChange={(e) => setPopulation(e.target.value)} className={fieldClass()} placeholder="—" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{t.sampleSize.confidence}</label>
        <select value={confidence} onChange={(e) => setConfidence(e.target.value)} className={fieldClass()}>
          <option value="90">90% (Z = 1.645)</option>
          <option value="95">95% (Z = 1.96)</option>
          <option value="99">99% (Z = 2.576)</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t.sampleSize.margin}</label>
          <input type="number" min="0.1" step="0.1" value={margin} onChange={(e) => setMargin(e.target.value)} className={fieldClass()} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t.sampleSize.proportion}</label>
          <input type="number" min="0" max="1" step="0.01" value={proportion} onChange={(e) => setProportion(e.target.value)} className={fieldClass()} />
        </div>
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
          <p className="text-sm text-slate-600">{t.sampleSize.resultLabel}</p>
          <p className="mt-1 text-4xl font-bold text-brand-700">{result ?? "—"}</p>
        </div>
      )}
    </div>
  );
}
