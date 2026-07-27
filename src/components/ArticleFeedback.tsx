"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

export function ArticleFeedback({ dict }: { dict: Dictionary }) {
  const [voted, setVoted] = useState<"yes" | "no" | null>(null);

  return (
    <div className="mt-10 flex flex-col items-center gap-3 rounded-xl bg-slate-50 py-6">
      <p className="text-sm font-medium text-slate-700">{dict.kb.helpfulPrompt}</p>
      {voted ? (
        <p className="text-sm text-brand-700">🙏 {dict.kb.helpfulPrompt}</p>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => setVoted("yes")}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium hover:border-brand-400 hover:text-brand-700"
          >
            👍 {dict.kb.yes}
          </button>
          <button
            onClick={() => setVoted("no")}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium hover:border-brand-400 hover:text-brand-700"
          >
            👎 {dict.kb.no}
          </button>
        </div>
      )}
    </div>
  );
}
