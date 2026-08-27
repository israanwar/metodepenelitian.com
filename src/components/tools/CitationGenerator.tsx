"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatCitation, type CitationStyle } from "@/lib/calculators";
import { fieldClass } from "./ToolShell";

export function CitationGenerator({ dict }: { dict: Dictionary }) {
  const t = dict.tools.citation;
  const [style, setStyle] = useState<CitationStyle>("apa");
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState({ id: 0, message: "", failed: false });

  const citation =
    title || source
      ? formatCitation(style, { authors, year, title, source, url })
      : "";

  async function copy() {
    if (!citation) return;
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setCopyFeedback((current) => ({ id: current.id + 1, message: t.copySuccess, failed: false }));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
      setCopyFeedback((current) => ({ id: current.id + 1, message: t.copyFailed, failed: true }));
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="citation-style" className="mb-1 block text-sm font-medium text-slate-700">{t.style}</label>
        <select id="citation-style" value={style} onChange={(e) => setStyle(e.target.value as CitationStyle)} className={fieldClass()}>
          <option value="apa">APA 7th</option>
          <option value="mla">MLA 9th</option>
          <option value="chicago">Chicago</option>
        </select>
      </div>
      <div>
        <label htmlFor="citation-authors" className="mb-1 block text-sm font-medium text-slate-700">{t.authors}</label>
        <input id="citation-authors" value={authors} onChange={(e) => setAuthors(e.target.value)} className={fieldClass()} placeholder="Sugiyono / Smith, J. & Doe, A." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="citation-year" className="mb-1 block text-sm font-medium text-slate-700">{t.year}</label>
          <input id="citation-year" value={year} onChange={(e) => setYear(e.target.value)} className={fieldClass()} placeholder="2024" />
        </div>
        <div>
          <label htmlFor="citation-title" className="mb-1 block text-sm font-medium text-slate-700">{t.articleTitle}</label>
          <input id="citation-title" value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass()} />
        </div>
      </div>
      <div>
        <label htmlFor="citation-source" className="mb-1 block text-sm font-medium text-slate-700">{t.source}</label>
        <input id="citation-source" value={source} onChange={(e) => setSource(e.target.value)} className={fieldClass()} />
      </div>
      <div>
        <label htmlFor="citation-url" className="mb-1 block text-sm font-medium text-slate-700">{t.url}</label>
        <input id="citation-url" value={url} onChange={(e) => setUrl(e.target.value)} className={fieldClass()} placeholder="https://doi.org/..." />
      </div>

      {citation && (
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-slate-500">{t.resultLabel}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-800" style={{ textIndent: "-1.5rem", paddingLeft: "1.5rem" }}>
            {citation}
          </p>
          <button onClick={copy} className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700">
            {copied ? t.copied : t.copy}
          </button>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={copyFeedback.failed ? "mt-2 text-xs text-red-600" : "sr-only"}
          >
            <span key={copyFeedback.id}>{copyFeedback.message}</span>
          </p>
        </div>
      )}
    </div>
  );
}
