# Quantitative Analysis Engine Spec — Phase 0 Audit

**Status:** COMPLETE — audit only. No source code, schema, route, or dependency was changed to produce this document.
**Scope:** Executes exactly `PHASE 0 — AUDIT` from [Quantitative Analysis Engine Master Spec V1](QUANTITATIVE%20ANALYSIS%20ENGINE%20MASTER%20SPEC%20V1.md), Section BP. Per that spec's own stop rule, this document performs the audit only and does not begin Phase 1.
**Method:** Read of the current repository (`src/`, `supabase/`, `package.json`) plus the existing locked planning corpus (`docs/adr/`, `docs/architecture/`, `docs/database/`, `docs/implementation/`, `docs/MASTER *.md`).

## Verdict

**Do not execute this spec's `PHASE 1` as written.** The spec's P0 scope, its `PHASE 0`–`PHASE 12` numbering, and its data model each conflict with architecture this repository has already marked `LOCKED`. The conflicts are reconcilable, but reconciliation is a scoping decision, not a coding task — see Section 3 and Section 10.

---

## 1. Current architecture

**Product/backend planning is extensive and already locked; backend code is not started.** The repository contains a large, internally consistent planning corpus that already covers this exact domain:

- **ADRs** (`docs/adr/`): 12 `LOCKED` decisions, including [ADR 007 Async Job Model](../adr/ADR%20007%20ASYNC%20JOB%20MODEL.md), [ADR 011 AI Is Not Source of Truth](../adr/ADR%20011%20AI%20IS%20NOT%20SOURCE%20OF%20TRUTH.md), and [ADR 012 Analysis Provenance Is Immutable](../adr/ADR%20012%20ANALYSIS%20PROVENANCE%20IS%20IMMUTABLE.md) — the last one governs this exact feature area.
- **Backend sequencing** (`docs/implementation/`): [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) defines a single, `LOCKED`, 14-phase build order (`Phase 0 — Foundation` … `Phase 13 — First End-to-End Vertical Slice`) with cumulative dependency gates, plus [P0 Implementation Gates](../implementation/P0%20IMPLEMENTATION%20GATES.md) (Gates A–I) and [P0 Definition of Done](../implementation/P0%20DEFINITION%20OF%20DONE.md).
- **Domain architecture** (`docs/architecture/`): 37 numbered module specs, including [16 ANALYSIS ADVISOR.md](16%20ANALYSIS%20ADVISOR.md), [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md), and [18 QUALITATIVE MIXED METHODS.md](18%20QUALITATIVE%20MIXED%20METHODS.md) — these are the direct architectural ancestors of everything this spec proposes.
- **Data models** (`docs/database/`): [ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md), [ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md), and [DATASET MODEL.md](../database/DATASET%20MODEL.md) are each stamped **`LOCKED P0 conceptual model`** and define entities, statuses, and invariants for exactly the Dataset → Analysis → Result chain this spec targets.
- Both `17 DATASET ANALYSIS.md` and `16 ANALYSIS ADVISOR.md` state explicitly: **"Documented, not implemented. No … exists in code yet."**

**Actual code is a marketing/content site, not a Research OS.** Stack: Next.js 14.2.15 (App Router), React 18, Tailwind, `@supabase/supabase-js` as the only backend dependency ([package.json](../../package.json)). `supabase/schema.sql` (176 lines) defines only: `profiles`, `categories`, `tags`, `articles`, `article_tags`, `article_feedback`, `tool_history`, `ai_requests`, `repository_items`. There is **no `ResearchProject`, `Dataset`, `AnalysisRun`, `AnalysisResult`, or any Research Digital Twin table** anywhere in the schema. `src/lib/supabase/{client,server}.ts` are thin Supabase client factories with no domain logic. There is no `supabase/migrations/` directory, no server-side API route folder (`src/app/api` does not exist in this repo — that path exists only in the unrelated sibling working directory `okka.ai`), and no statistical computation library (no `numpy`/`scipy`/`statsmodels`-equivalent — this is a pure JS/TS frontend with zero Python runtime).

**Conclusion:** every phase from `Phase 0 — Foundation` through `Phase 9 — First Specialized Agents` in the locked P0 sequence is unstarted at the persistence layer. `ResearchProject` (Phase 2), RDT (Phase 3), Project Context (Phase 4), the Research Compiler (Phase 5), File/Reference Foundation (Phase 6), Evidence Foundation (Phase 7), AI Foundation (Phase 8), and First Specialized Agents (Phase 9) — all four hard dependencies `Phase 10 — Data & Analysis Contract` declares — do not exist in code.

## 2. Reusable components

Genuinely reusable, independent of this spec's scope conflicts:

- **Client-side statistical calculators** — [SampleSizeCalculator.tsx](../../src/components/tools/SampleSizeCalculator.tsx), [SlovinCalculator.tsx](../../src/components/tools/SlovinCalculator.tsx), [CronbachCalculator.tsx](../../src/components/tools/CronbachCalculator.tsx), [CitationGenerator.tsx](../../src/components/tools/CitationGenerator.tsx) inside [ToolShell.tsx](../../src/components/tools/ToolShell.tsx). These already implement Cronbach's Alpha, Slovin, and sample-size formulas client-side today. They are useful reference implementations and existing UI conventions, but they are stateless, unauthenticated, not project-scoped, and log only raw input/output JSON blobs to `tool_history` — none of the provenance/versioning this spec (or the locked `ANALYSIS MODEL.md`) requires. Per [UI Remediation Audit](../design/UI%20REMEDIATION%20AUDIT.md) UI-009, the Cronbach parser also has a known data-integrity risk (silently drops non-numeric cells) that should not be inherited into a governed engine.
- **i18n and routing scaffolding** — `src/i18n/`, `[lang]` App Router convention — reusable for any new researcher-facing routes.
- **Supabase client pattern** (browser anon-key client vs. server service-role client) — reusable connection pattern, though the P0 sequence's Phase 0/1 require a formal migration convention and RLS-enforced tenant isolation this pattern does not yet demonstrate.
- **Existing planning documents themselves** are the largest reusable asset: `16`, `17`, `18` and the three `database/` models already define entities, statuses, and boundaries a real implementation should target instead of the spec's parallel schema (Section 3).

## 3. Conflicts with this specification

Four conflicts are load-bearing; none are cosmetic.

**(a) P0 scope is far wider than the locked P0 boundary.** The spec marks Sections A through AE — Research Project Model, Dataset ingestion, Profiling, Data Quality, Variable/Scale Builder, Questionnaire Builder, Descriptive Statistics, Visualization, Validity, Reliability, Normality, Multicollinearity, Heteroscedasticity, Autocorrelation, Correlation, Simple/Multiple Regression, Group Comparison, Nonparametrics, Chi-Square, Method Selector, Pipeline Builder, Validation Engine, Diagnostics, Interpretation, Hypothesis Engine, Table Generator, Export, History, Audit Trail, and Empirical Data Mode — as **"P0 — WAJIB DIBANGUN."** The locked [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) places this entire surface inside one single, deliberately narrow phase, `Phase 10 — Data & Analysis Contract`, whose stated deliverable is **"one narrow validated analysis capability"** and whose **forbidden scope explicitly reads: "SPSS/SmartPLS replacement, method breadth, advanced SEM/PLS-SEM, qualitative suite or AI as numerical engine."** "Method breadth" is precisely what Sections G–T request. Line 421 of that same document places "additional verified analysis methods" in **P1**, not P0. This is a direct, named conflict, not an inference.

**(b) The spec's own phase numbering collides with the platform's locked phase numbering.** Section BM defines `PHASE 0` through `PHASE 12` scoped to the quantitative engine alone. The platform already has a single canonical `Phase 0 — Foundation` through `Phase 13 — First End-to-End Vertical Slice` sequence that this feature must slot into as `Phase 10` only. Running both numbering schemes side by side (as flagged already in the copy of the spec saved to this repo) will produce ambiguous status reporting — "Phase 5 LOCKED" would mean two different things depending on which document is being read.

**(c) Phase 10 has hard, unmet dependencies.** Per [P0 Dependency Graph](../implementation/P0%20DEPENDENCY%20GRAPH.md) and the Phase 10 entry itself, `Phase 10 — Data & Analysis Contract` requires **Phases 6 and 9 `LOCKED`** first (File/Reference Foundation, First Specialized Agents) — which themselves require Phases 0–5 and 8 locked before them. Section 1 above establishes none of Phases 0–9 exist in code. The spec's `PHASE 0 — AUDIT` (this document) is a legitimate first step; its `PHASE 1 — FOUNDATIONS` is not startable without first opening and locking the platform's own Phase 0–9, which this spec does not mention and is explicitly out of scope for "Codex" as briefed.

**(d) The proposed data model duplicates, rather than extends, three already-locked conceptual models.** The spec's `ResearchProject`, `ResearchVariable`, `Dataset`/`Column`, `AnalysisResult`, `AnalysisRun`, `ValidationRule`, `Hypothesis` (Sections A, B, W, Z, AC, AK) are simpler, differently-shaped reinventions of entities [ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md), [ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md), and [DATASET MODEL.md](../database/DATASET%20MODEL.md) already define and lock: `AnalysisCapability`, `AnalysisRecommendation`, `AnalysisDecision`/`AnalysisExecutionPlan`, `AnalysisRun` (with `engine_version`, `assumption_results`, checksums, and a `PLANNED/APPROVED/RUNNING/COMPLETED/FAILED/VERIFIED/SUPERSEDED` status vocabulary — critically, **"`COMPLETED` never implies `VERIFIED`"**), `AnalysisAssumptionResult`, `Dataset`/`DatasetVersion`/`DatasetVariable`/`DatasetProfile`/`DatasetVariableMapping`, and `AnalysisResultSet`/`StructuredResult`/`ResultValidation`/`Interpretation`/`ResultProvenanceLink`. Building the spec's simpler schema instead would create exactly the "second source of truth" [P0 Definition of Done](../implementation/P0%20DEFINITION%20OF%20DONE.md) forbids ("New module/data dependencies match P0 Dependency Graph and add no cycle or second source of truth"). The spec's pipeline-node status vocabulary (`NOT_STARTED/RUNNING/PASS/WARNING/FAIL/SKIPPED`, Section V) also conflates step-execution status with canonical verification status — the same class of ambiguity flagged as a P0 finding (UI-006) in the [UI Remediation Audit](../design/UI%20REMEDIATION%20AUDIT.md) for the frontend; repeating it in the backend model would be a second instance of the same defect.

**Not a conflict — genuinely aligned:** the spec's Empirical Data Mode rules (Section AE: never fabricate, never edit data to force significance) and its emphasis on deterministic, non-AI-generated numerical computation (Section AJ, AK) are fully consistent with, and effectively restate, [ADR 011](../adr/ADR%20011%20AI%20IS%20NOT%20SOURCE%20OF%20TRUTH.md) and [ADR 012](../adr/ADR%20012%20ANALYSIS%20PROVENANCE%20IS%20IMMUTABLE.md). The spec's instinct on this point is correct; it should cite and extend those ADRs rather than restate them independently.

**Undocumented new scope:** the **Simulation Lab / synthetic data generator** (Sections AF–AI) has no counterpart anywhere in the existing 37 architecture modules, the ADR set, or the database models. It is a legitimate and interesting idea but is net-new product scope that has never been through this repository's own architecture-decision process, and it is not something Phase 10's "one narrow validated analysis capability" can absorb.

## 4. Proposed module placement

If and when this work is authorized, it belongs entirely inside the platform's existing structure, not a parallel tree:

- Backend capability → **`Phase 10 — Data & Analysis Contract`** of the locked P0 sequence, scoped down to its stated "one narrow validated analysis capability" (realistically: descriptive statistics + Cronbach reliability + Pearson correlation + simple/multiple linear regression with its four required diagnostics — the smallest set that produces one genuine, reproducible academic result end to end).
- Domain architecture doc → extend [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md) and [16 ANALYSIS ADVISOR.md](16%20ANALYSIS%20ADVISOR.md) in place; do not author a competing standalone architecture doc for "the quantitative engine."
- Data model → extend [ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md), [ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md), [DATASET MODEL.md](../database/DATASET%20MODEL.md) with any genuinely missing fields (e.g. a `Questionnaire`/`InstrumentItem` entity, which does not currently exist anywhere) rather than introducing `ResearchProject`/`Dataset`/`AnalysisRun` a second time.
- Simulation Lab → new ADR + new architecture module first (it changes what "empirical" vs. "synthetic" means at the data layer platform-wide); not silently folded into Phase 10.
- Frontend → new routes/components under `src/app/[lang]/` and `src/components/`, following the existing `ToolShell` convention, but wired to the Phase 10 backend contract instead of being another stateless client-side calculator like the current four tools.

## 5. Dependencies required

- **Platform dependencies, in order:** Phases 0–9 of the locked P0 sequence must reach at least `LOCKED` (Phase 6) and `LOCKED` (Phase 9) before Phase 10 can begin per its stated dependency. None are started today (Section 1). This is the single largest scope gap between "what this spec asks for" and "what can be built next."
- **Runtime/library:** no statistical computation runtime exists in this repository today. The spec's own recommendation (Section AJ: NumPy/SciPy/pandas/statsmodels) requires introducing a Python execution boundary — this is a new deployable/runtime, not an npm dependency, and needs its own isolation/sandbox decision (Phase 10's own security row already calls for "sandbox/resource limits").
- **Async job infrastructure:** [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md) and [ADR 007](../adr/ADR%20007%20ASYNC%20JOB%20MODEL.md) both make async execution mandatory, not optional ("does not perform statistical computation inline on a web request; all non-trivial computation runs as an async background job"). This is stricter than the spec's own Section AY, which frames async as conditional ("only if infrastructure supports jobs"). No job queue exists in the current codebase.
- **File ingestion boundary:** the spec's Dataset import (CSV/XLSX/SAV/JSON) depends on `Phase 6 — File / Reference Foundation`'s `FileAsset` service, which is unstarted.

## 6. Database implications

- Zero schema overlap today: `supabase/schema.sql` has no research-domain tables at all (Section 1). Any Phase 10 work is new tables, not a migration of existing ones.
- Per [DATASET MODEL.md](../database/DATASET%20MODEL.md) and [ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md) invariants: raw dataset bytes and `AnalysisRun` records must be immutable/checksum-addressed from the first migration — retrofitting immutability after a mutable first version is materially harder than designing for it up front, so this cannot be treated as a later cleanup pass.
- No `supabase/migrations/` directory exists yet; `schema.sql` appears to be applied directly rather than through versioned migrations. [P0 Definition of Done](../implementation/P0%20DEFINITION%20OF%20DONE.md) requires "migration applies from a clean database and through the supported upgrade path" — the current single-file-schema pattern does not demonstrate that yet and would need to become a real migration chain before Phase 0/1 of the platform sequence, independent of this spec.
- Row-level security: `profiles`/`article_feedback`/etc. exist, but tenant/project isolation for a new `ResearchProject`-scoped domain (Gate B's requirement) has no precedent to extend in the current schema.

## 7. API implications

- No API route directory exists in this repository (`src/app/api` is absent; Next.js API routes have not been used here at all — the four existing tools compute entirely client-side). Introducing the spec's `POST /api/analysis/*` surface (Section BI) is greenfield, not an extension of an existing API layer.
- Per Phase 10's own contract row, the real interface shape is narrower than the spec's ~18-endpoint list: create derived dataset version/plan, approve/run asynchronously, return structured result, resolve run/environment/input lineage. Endpoints like `/api/analysis/regression`, `/api/analysis/t-test`, `/api/analysis/anova`, `/api/analysis/chi-square` as distinct routes presuppose the full method breadth already rejected in Section 3(a).
- Because computation must be async (Section 5), the real contract needs a job-status shape (`queued/running/completed/failed` plus polling or webhook) that the spec's flat `POST → GET :id` sketch in Section BI does not fully specify.

## 8. Security implications

- Uploaded datasets are explicitly flagged in [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md) as "frequently contain sensitive research data (survey responses, potentially identifiable information)" and must stay private-by-default, project-scoped, and never sent raw to any AI provider — only aggregated results may reach the AI Gateway for interpretation drafting. The spec's Section AE/AW context already respects this in spirit but does not name the constraint explicitly; it should inherit it from `17 DATASET ANALYSIS.md` rather than restate a weaker version.
- A Python (or other non-JS) statistical execution runtime introduces a second execution surface that needs the same sandbox/timeout/resource-limit treatment Phase 10's contract already calls for (formula/CSV injection, oversized-file abuse, arbitrary code execution — Section AX of the spec correctly identifies these risks but there is currently no isolated execution environment in this codebase to run untrusted user files through at all).
- No auth/RBAC exists yet for a research-project domain (Phase 1 — Identity & Tenancy is unstarted), so "private by default, project-scoped" cannot be enforced today regardless of what the analysis engine does — this is a hard blocker above the analysis layer, not inside it.

## 9. Test strategy

- The spec's own Sections AZ–BE (unit tests per method, golden datasets, cross-validation tolerance, three acceptance tests) are sound in isolation and compatible with [P0 Implementation Gates](../implementation/P0%20IMPLEMENTATION%20GATES.md) **Gate G** ("Analysis provenance reproducible") and **Gate H** ("Analysis result reaches document without fabricated values") — Phase 10/11's actual exit criteria.
- They should be scoped to whatever narrow method set is actually authorized for Phase 10 (Section 4), not the full 20+-method catalog; Gate G's required evidence (immutable versions, pinned engine/parameters/seed, replayable transformations, rerun-within-tolerance) is a strictly higher bar than the spec's Section BB tolerance note and should be adopted as-is rather than re-derived.
- No test harness for a Python/statistics runtime currently exists in this repository at all (only implicit `next lint`); a cross-language test/CI story is new infrastructure this spec assumes without addressing.

## 10. Implementation sequence

The only defensible next step is a **scoping and amendment decision**, not code:

1. Decide, explicitly, which single method (or minimal method set) satisfies Phase 10's "one narrow validated analysis capability" — recommendation: descriptive statistics + Cronbach reliability + Pearson correlation + simple/multiple linear regression with its four mandatory diagnostics (normality, multicollinearity, heteroscedasticity, outliers), since that set alone can prove the full `Dataset → AnalysisPlan → AnalysisRun → AnalysisResult → Interpretation` chain end to end.
2. Record that scoping decision as a short priority-amendment note against `Phase 10`, per the P0 sequence's own rule that promotion/rescoping "requires an explicit priority amendment, dependency analysis, updated gates and updated golden scenario" — not a silent redefinition.
3. Everything this spec calls Sections U (Method Selector breadth), AF–AI (Simulation Lab), AO–AR (SEM/PLS/mediation/power) gets explicitly filed as P1/P2 future scope against the existing architecture docs, not deferred implicitly.
4. Only after Phases 0–9 of the platform's own locked sequence reach `LOCKED` does Phase 10 implementation (this spec's real Sections A–D, G, I, J, P/Q, W, X, Y, plus the narrowed method set from step 1) become startable.
5. Within Phase 10 itself, follow this spec's own internal ordering (Sections BM's Phase 2→9 content, renumbered as Phase 10 sub-steps: data engine → instrument engine → assumption engine → regression engine → basic inferential → method selector → pipeline → interpretation) — that internal sequencing is sound and does not need to change, only its outer numbering and its P0/P1 boundary.

## 11. Files likely to be touched

Documentation only, at this stage:

- [docs/architecture/17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md) — extended with the narrowed method set and Questionnaire/Instrument entity.
- [docs/architecture/16 ANALYSIS ADVISOR.md](16%20ANALYSIS%20ADVISOR.md) — extended if the Method Selector's deterministic rule layer is adopted here.
- [docs/database/ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md), [docs/database/ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md), [docs/database/DATASET MODEL.md](../database/DATASET%20MODEL.md) — extended, not replaced, if any entity is genuinely missing (e.g. `InstrumentItem`/`Questionnaire`).
- [docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) — Phase 10's table gets a scoping amendment recorded, per its own promotion rule.
- No `src/` or `supabase/` file should be touched until that amendment is recorded and reviewed.

## 12. Risks

- **Scope-creep risk (highest):** if Phase 1 of this spec is started as written, the first concrete deliverable becomes "20+ statistical engines" instead of Phase 10's "one narrow validated capability" — directly reproducing the exact anti-pattern [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) was written to prevent.
- **Sequencing risk:** building any analysis engine before `ResearchProject`, RDT, and Project Context exist (Phases 2–4) produces an analysis feature with nothing canonical to attach to — dataset/analysis records would float without a real project aggregate, contradicting Locked Invariant #1.
- **Second-source-of-truth risk:** implementing the spec's own `AnalysisResult`/`AnalysisRun`/`Dataset` shapes instead of the already-locked ones in `database/` creates two competing schemas for the same concept — expensive to unwind later and explicitly forbidden by [P0 Definition of Done](../implementation/P0%20DEFINITION%20OF%20DONE.md).
- **Runtime risk:** introducing a Python statistical runtime alongside a pure Next.js/TypeScript codebase is a real infrastructure decision (deployment, sandboxing, cost) that has not been made anywhere in the existing architecture; it should not be assumed as a side effect of implementing this spec.
- **Academic-integrity risk if rushed:** several of the spec's own guardrails (Empirical Data Mode, immutable audit trail, no-fabrication rules) are exactly right, but are only as strong as the underlying data model enforcing them — building them against a weaker, spec-local schema instead of the already-locked provenance model (`ANALYSIS RESULT MODEL.md`'s `ResultValidation`, `ResultProvenanceLink`) would produce a system that *looks* rigorous in the UI while being weaker underneath, which is the same failure class the [UI Remediation Audit](../design/UI%20REMEDIATION%20AUDIT.md) already found on the frontend (fake/demo ambiguity, provenance not truthfully qualified).

---

**Per this spec's own `PHASE 0` stop rule: this document stops here.** No `PHASE 1` work should begin until the scoping/amendment decision in Section 10 is made explicitly by the project owner and, per the P0 sequence's own rule, reviewed rather than self-assigned.

## Related documents

- [Quantitative Analysis Engine Master Spec V1](QUANTITATIVE%20ANALYSIS%20ENGINE%20MASTER%20SPEC%20V1.md) — the audited document.
- [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md), [P0 Implementation Gates](../implementation/P0%20IMPLEMENTATION%20GATES.md), [P0 Definition of Done](../implementation/P0%20DEFINITION%20OF%20DONE.md), [P0 Dependency Graph](../implementation/P0%20DEPENDENCY%20GRAPH.md).
- [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md), [16 ANALYSIS ADVISOR.md](16%20ANALYSIS%20ADVISOR.md), [18 QUALITATIVE MIXED METHODS.md](18%20QUALITATIVE%20MIXED%20METHODS.md).
- [database/ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md), [database/ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md), [database/DATASET MODEL.md](../database/DATASET%20MODEL.md).
- [ADR 007 Async Job Model](../adr/ADR%20007%20ASYNC%20JOB%20MODEL.md), [ADR 011 AI Is Not Source of Truth](../adr/ADR%20011%20AI%20IS%20NOT%20SOURCE%20OF%20TRUTH.md), [ADR 012 Analysis Provenance Is Immutable](../adr/ADR%20012%20ANALYSIS%20PROVENANCE%20IS%20IMMUTABLE.md).
- [UI Remediation Audit](../design/UI%20REMEDIATION%20AUDIT.md) — same class of provenance/status-ambiguity findings, frontend side.
