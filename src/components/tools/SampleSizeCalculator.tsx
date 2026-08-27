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
  const [announcement, setAnnouncement] = useState({ id: 0, message: "" });

  const invalidMargin = touched && Number(margin) <= 0;
  const invalidProportion = touched && (Number(proportion) < 0 || Number(proportion) > 1);

  function announce(message: string) {
    setAnnouncement((current) => ({ id: current.id + 1, message }));
  }

  function calculate() {
    setTouched(true);
    const n = sampleSizeCochran({
      confidence,
      marginPct: Number(margin),
      proportion: Number(proportion),
      population: population ? Number(population) : undefined,
    });
    setResult(n);
    announce(n === null ? "" : `${t.sampleSize.resultLabel}: ${n}`);
  }

  function reset() {
    setPopulation("");
    setConfidence("95");
    setMargin("5");
    setProportion("0.5");
    setResult(null);
    setTouched(false);
    announce(t.resetComplete);
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="sample-size-population" className="mb-1 block text-sm font-medium text-slate-700">{t.sampleSize.population}</label>
        <input id="sample-size-population" type="number" min="1" value={population} onChange={(e) => setPopulation(e.target.value)} className={fieldClass()} placeholder="—" />
      </div>
      <div>
        <label htmlFor="sample-size-confidence" className="mb-1 block text-sm font-medium text-slate-700">{t.sampleSize.confidence}</label>
        <select id="sample-size-confidence" value={confidence} onChange={(e) => setConfidence(e.target.value)} className={fieldClass()}>
          <option value="90">90% (Z = 1.645)</option>
          <option value="95">95% (Z = 1.96)</option>
          <option value="99">99% (Z = 2.576)</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sample-size-margin" className="mb-1 block text-sm font-medium text-slate-700">{t.sampleSize.margin}</label>
          <input
            id="sample-size-margin"
            type="number"
            min="0.1"
            step="0.1"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            aria-describedby={invalidMargin ? "sample-size-error" : undefined}
            aria-invalid={invalidMargin || undefined}
            className={fieldClass()}
          />
        </div>
        <div>
          <label htmlFor="sample-size-proportion" className="mb-1 block text-sm font-medium text-slate-700">{t.sampleSize.proportion}</label>
          <input
            id="sample-size-proportion"
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={proportion}
            onChange={(e) => setProportion(e.target.value)}
            aria-describedby={invalidProportion ? "sample-size-error" : undefined}
            aria-invalid={invalidProportion || undefined}
            className={fieldClass()}
          />
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

      {touched && result === null ? (
        <p id="sample-size-error" role="alert" aria-atomic="true" className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {t.sampleSize.invalidInput}
        </p>
      ) : touched && (
        <div className="mt-2 rounded-lg bg-brand-50 p-4 text-center">
          <p className="text-sm text-slate-600">{t.sampleSize.resultLabel}</p>
          <p className="mt-1 text-4xl font-bold text-brand-700">{result}</p>
        </div>
      )}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        <span key={announcement.id}>{announcement.message}</span>
      </p>
    </div>
  );
}
