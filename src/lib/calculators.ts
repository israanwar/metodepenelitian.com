// Pure calculation helpers for the Research Tools module.

const Z_SCORES: Record<string, number> = {
  "90": 1.645,
  "95": 1.96,
  "99": 2.576,
};

/** Cochran's sample size with optional finite population correction. */
export function sampleSizeCochran(opts: {
  confidence: string; // "90" | "95" | "99"
  marginPct: number; // e.g. 5
  proportion: number; // 0..1
  population?: number; // optional N
}): number | null {
  const z = Z_SCORES[opts.confidence];
  const e = opts.marginPct / 100;
  const p = opts.proportion;
  if (!z || e <= 0 || p < 0 || p > 1) return null;

  const n0 = (z * z * p * (1 - p)) / (e * e);
  if (opts.population && opts.population > 0) {
    const n = n0 / (1 + (n0 - 1) / opts.population);
    return Math.ceil(n);
  }
  return Math.ceil(n0);
}

/** Slovin's formula: n = N / (1 + N·e²). */
export function sampleSizeSlovin(population: number, marginPct: number): number | null {
  const e = marginPct / 100;
  if (population <= 0 || e <= 0) return null;
  return Math.ceil(population / (1 + population * e * e));
}

export interface CronbachResult {
  alpha: number;
  items: number;
  respondents: number;
}

/**
 * Cronbach's Alpha from a matrix of item scores.
 * rows = respondents, columns = items.
 */
export function cronbachAlpha(matrix: number[][]): CronbachResult | null {
  const respondents = matrix.length;
  if (respondents < 2) return null;
  const items = matrix[0].length;
  if (items < 2) return null;
  if (!matrix.every((row) => row.length === items)) return null;

  const variance = (values: number[]): number => {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    // sample variance (n - 1)
    return values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (n - 1);
  };

  // Variance of each item (column)
  let sumItemVar = 0;
  for (let c = 0; c < items; c++) {
    const col = matrix.map((row) => row[c]);
    sumItemVar += variance(col);
  }

  // Variance of total scores per respondent
  const totals = matrix.map((row) => row.reduce((a, b) => a + b, 0));
  const totalVar = variance(totals);
  if (totalVar === 0) return null;

  const k = items;
  const alpha = (k / (k - 1)) * (1 - sumItemVar / totalVar);
  return { alpha, items, respondents };
}

export function parseMatrix(input: string): number[][] | null {
  const rows = input
    .split("\n")
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
  if (rows.length === 0) return null;

  const matrix: number[][] = [];
  for (const row of rows) {
    const cells = row
      .split(/[,;\t]+/)
      .map((c) => Number(c.trim()))
      .filter((c) => !Number.isNaN(c));
    if (cells.length === 0) return null;
    matrix.push(cells);
  }
  return matrix;
}

export function interpretAlpha(alpha: number, lang: "id" | "en"): string {
  const scale: [number, string, string][] = [
    [0.9, "Sangat baik (excellent)", "Excellent"],
    [0.8, "Baik (good)", "Good"],
    [0.7, "Dapat diterima (acceptable)", "Acceptable"],
    [0.6, "Dipertanyakan (questionable)", "Questionable"],
    [0.5, "Buruk (poor)", "Poor"],
    [-Infinity, "Tidak dapat diterima", "Unacceptable"],
  ];
  for (const [threshold, idText, enText] of scale) {
    if (alpha >= threshold) return lang === "id" ? idText : enText;
  }
  return lang === "id" ? "Tidak dapat diterima" : "Unacceptable";
}

// ---- Citation generator ----

export type CitationStyle = "apa" | "mla" | "chicago";

export interface CitationInput {
  authors: string; // "Smith, J." or "Smith, J. & Doe, A."
  year: string;
  title: string;
  source: string;
  url?: string;
}

export function formatCitation(style: CitationStyle, c: CitationInput): string {
  const authors = c.authors.trim() || "Anonymous";
  const year = c.year.trim() || "n.d.";
  const title = c.title.trim();
  const source = c.source.trim();
  const url = c.url?.trim();

  switch (style) {
    case "apa":
      return `${authors} (${year}). ${title}. ${italic(source)}.${url ? ` ${url}` : ""}`;
    case "mla":
      return `${authors}. "${title}." ${italic(source)}, ${year}.${url ? ` ${url}.` : ""}`;
    case "chicago":
      return `${authors}. "${title}." ${italic(source)} (${year}).${url ? ` ${url}.` : ""}`;
  }
}

// Titles/journals are shown italicised in real bibliographies; we keep plain text
// but wrap with a marker the UI can render as <em> if desired.
function italic(text: string): string {
  return text;
}
