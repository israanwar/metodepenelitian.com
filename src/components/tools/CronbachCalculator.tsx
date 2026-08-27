"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cronbachAlpha, interpretAlpha, type CronbachResult } from "@/lib/calculators";
import { fieldClass } from "./ToolShell";

const SAMPLE = `4,3,5,4,5
3,3,4,4,4
5,4,5,5,5
2,3,2,3,2
4,4,4,3,4
5,5,4,5,5`;

type InputProvenance = "DEMO" | "USER_PROVIDED";

type CronbachParseError =
  | { code: "emptyData" }
  | { code: "emptyCell"; row: number; column: number }
  | { code: "invalidCell"; row: number; column: number; value: string }
  | { code: "raggedRow"; row: number; expected: number; actual: number }
  | { code: "minimumRows" }
  | { code: "minimumColumns" };

type CronbachParseResult =
  | { ok: true; matrix: number[][] }
  | { ok: false; error: CronbachParseError };

export function parseCronbachInput(input: string): CronbachParseResult {
  const rows = input
    .split("\n")
    .map((value, index) => ({ value: value.trim(), sourceRow: index + 1 }))
    .filter((row) => row.value.length > 0);

  if (rows.length === 0) return { ok: false, error: { code: "emptyData" } };

  const matrix: number[][] = [];
  let expectedColumns: number | null = null;

  for (const row of rows) {
    const rawCells = row.value.split(/[,;\t]/);
    const numericRow: number[] = [];

    for (let columnIndex = 0; columnIndex < rawCells.length; columnIndex += 1) {
      const rawValue = rawCells[columnIndex].trim();
      if (rawValue.length === 0) {
        return {
          ok: false,
          error: { code: "emptyCell", row: row.sourceRow, column: columnIndex + 1 },
        };
      }

      const value = Number(rawValue);
      if (!Number.isFinite(value)) {
        return {
          ok: false,
          error: {
            code: "invalidCell",
            row: row.sourceRow,
            column: columnIndex + 1,
            value: rawValue,
          },
        };
      }
      numericRow.push(value);
    }

    if (expectedColumns === null) {
      expectedColumns = numericRow.length;
    } else if (numericRow.length !== expectedColumns) {
      return {
        ok: false,
        error: {
          code: "raggedRow",
          row: row.sourceRow,
          expected: expectedColumns,
          actual: numericRow.length,
        },
      };
    }

    matrix.push(numericRow);
  }

  if (matrix.length < 2) return { ok: false, error: { code: "minimumRows" } };
  if ((expectedColumns ?? 0) < 2) return { ok: false, error: { code: "minimumColumns" } };

  return { ok: true, matrix };
}

function formatError(template: string, values: Record<string, string | number> = {}) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replace(`{${key}}`, String(value)),
    template,
  );
}

function parseErrorMessage(error: CronbachParseError, copy: Dictionary["tools"]["cronbach"]) {
  switch (error.code) {
    case "emptyCell":
      return formatError(copy.errors.emptyCell, error);
    case "invalidCell":
      return formatError(copy.errors.invalidCell, error);
    case "raggedRow":
      return formatError(copy.errors.raggedRow, error);
    default:
      return copy.errors[error.code];
  }
}

export function CronbachCalculator({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const t = dict.tools;
  const [input, setInput] = useState("");
  const [inputProvenance, setInputProvenance] = useState<InputProvenance>("USER_PROVIDED");
  const [result, setResult] = useState<CronbachResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [announcement, setAnnouncement] = useState({ id: 0, message: "" });

  function announce(message: string) {
    setAnnouncement((current) => ({ id: current.id + 1, message }));
  }

  function calculate() {
    setTouched(true);
    const parsed = parseCronbachInput(input);
    if (!parsed.ok) {
      setResult(null);
      setError(parseErrorMessage(parsed.error, t.cronbach));
      announce("");
      return;
    }

    const res = cronbachAlpha(parsed.matrix);
    if (!res) {
      setResult(null);
      setError(t.cronbach.errors.calculationFailed);
      announce("");
      return;
    }

    setResult(res);
    setError(null);
    announce(
      `${t.cronbach.resultLabel}: ${res.alpha.toFixed(3)}. ${t.cronbach.interpretation}: ${interpretAlpha(res.alpha, lang)}.`,
    );
  }

  function reset() {
    setInput("");
    setInputProvenance("USER_PROVIDED");
    setResult(null);
    setError(null);
    setTouched(false);
    announce(t.resetComplete);
  }

  function loadExample() {
    setInput(SAMPLE);
    setInputProvenance("DEMO");
    setResult(null);
    setError(null);
    setTouched(false);
    announce(t.cronbach.exampleLoaded);
  }

  function updateInput(value: string) {
    setInput(value);
    setInputProvenance("USER_PROVIDED");
    setResult(null);
    setError(null);
    setTouched(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="cronbach-item-scores" className="mb-1 block text-sm font-medium text-slate-700">{t.cronbach.input}</label>
        <textarea
          id="cronbach-item-scores"
          value={input}
          onChange={(e) => updateInput(e.target.value)}
          rows={7}
          aria-describedby={error ? "cronbach-input-help cronbach-input-error" : "cronbach-input-help"}
          aria-invalid={Boolean(error) || undefined}
          className={`${fieldClass()} font-mono`}
        />
        <p id="cronbach-input-help" className="mt-1 text-xs text-slate-400">{t.cronbach.inputHelp}</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
          {t.cronbach.inputSource} · {inputProvenance === "DEMO" ? t.cronbach.demo : t.cronbach.userProvided}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={loadExample} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {t.cronbach.loadExample}
        </button>
        <button onClick={calculate} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          {t.calculate}
        </button>
        <button onClick={reset} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {t.reset}
        </button>
      </div>

      {touched && (
        error || !result ? (
          <p id="cronbach-input-error" role="alert" aria-atomic="true" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
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
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        <span key={announcement.id}>{announcement.message}</span>
      </p>
    </div>
  );
}
