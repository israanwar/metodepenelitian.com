"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cronbachAlpha, parseMatrix, interpretAlpha, type CronbachResult } from "@/lib/calculators";
import { fieldClass } from "./ToolShell";

const SAMPLE = `4,3,5,4,5
3,3,4,4,4
5,4,5,5,5
2,3,2,3,2
4,4,4,3,4
5,5,4,5,5`;

export function CronbachCalculator({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const t = dict.tools;
  const [input, setInput] = useState(SAMPLE);
  const [result, setResult] = useState<CronbachResult | null>(null);
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);

  function calculate() {
    setTouched(true);
    const matrix = parseMatrix(input);
    const res = matrix ? cronbachAlpha(matrix) : null;
    setResult(res);
    setError(!res);
  }

  function reset() {
    setInput(SAMPLE);
    setResult(null);
    setError(false);
    setTouched(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{t.cronbach.input}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={7}
          className={`${fieldClass()} font-mono`}
        />
        <p className="mt-1 text-xs text-slate-400">{t.cronbach.inputHelp}</p>
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          {t.calculate}
        </button>
        <button onClick={reset} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {t.reset}
        </button>
      </div>

      {touched && (
        error || !result ? (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {lang === "id"
              ? "Data tidak valid. Pastikan minimal 2 responden, 2 item, dan jumlah item sama di tiap baris."
              : "Invalid data. Ensure at least 2 respondents, 2 items, and an equal number of items per row."}
          </p>
        ) : (
          <div className="rounded-lg bg-brand-50 p-4">
            <div className="text-center">
              <p className="text-sm text-slate-600">{t.cronbach.resultLabel}</p>
              <p className="mt-1 text-4xl font-bold text-brand-700">{result.alpha.toFixed(3)}</p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="text-slate-500">{t.cronbach.items}</p>
                <p className="font-semibold text-slate-800">{result.items}</p>
              </div>
              <div>
                <p className="text-slate-500">{t.cronbach.respondents}</p>
                <p className="font-semibold text-slate-800">{result.respondents}</p>
              </div>
              <div>
                <p className="text-slate-500">{t.cronbach.interpretation}</p>
                <p className="font-semibold text-slate-800">{interpretAlpha(result.alpha, lang)}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
