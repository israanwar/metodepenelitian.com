# Phase 10 Scoping Amendment — Multiple Linear Regression Analysis Pipeline

**Status:** `PROPOSED` — a documentation amendment awaiting owner/reviewer sign-off. No source code, schema, or locked document was changed to produce this amendment.
**Amends:** `Phase 10 — Data & Analysis Contract` in the `LOCKED` [P0 Backend Implementation Sequence](P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md), and the P0/P1 priority line for the Quantitative Engine in `Section 13.3` of [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md).
**Does not amend:** the entities, statuses, or invariants in [ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md), [ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md), or [DATASET MODEL.md](../database/DATASET%20MODEL.md) — this amendment reuses those as-is. Does not amend Phase 6 or Phase 9 scope.
**Relationship to the capability catalog:** [Quantitative Analysis Engine Master Spec V1](../architecture/QUANTITATIVE%20ANALYSIS%20ENGINE%20MASTER%20SPEC%20V1.md) Sections P (Simple Regression) and Q (Multiple Regression) describe the product-behavior target this amendment scopes down into one Phase 10-sized slice.

---

## AMENDMENT STATUS

`PROPOSED`. This document is a scoping amendment only, produced in response to the owner's explicit instruction to amend documentation, not to write code. It cannot become effective until an independent reviewer accepts it, per the P0 sequence's own rule that a phase "cannot mark itself `VERIFIED`; review is required before `LOCKED`" and the promotion rule that a capability entering P0 scope "requires an explicit priority amendment, dependency analysis, updated gates and updated golden scenario." Nothing in this document authorizes starting implementation.

## AUTHORITY DOCUMENTS USED

- [P0 Backend Implementation Sequence](P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) — Phase 10 table, Locked Invariants, priority boundary, Section on Phase 6/Phase 9.
- [P0 Implementation Gates](P0%20IMPLEMENTATION%20GATES.md) — Gate G, Gate H.
- [P0 Definition of Done](P0%20DEFINITION%20OF%20DONE.md) — Dataset/Analysis entity-level truth row, first vertical-slice criteria.
- [P0 Dependency Graph](P0%20DEPENDENCY%20GRAPH.md) — Dataset → AnalysisPlan → AnalysisRun → AnalysisResult chain, Phase 10/11 dependency rows.
- [database/ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md), [database/ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md), [database/DATASET MODEL.md](../database/DATASET%20MODEL.md) — `LOCKED P0 conceptual model`, entity source.
- [ADR 007 Async Job Model](../adr/ADR%20007%20ASYNC%20JOB%20MODEL.md), [ADR 011 AI Is Not Source of Truth](../adr/ADR%20011%20AI%20IS%20NOT%20SOURCE%20OF%20TRUTH.md), [ADR 012 Analysis Provenance Is Immutable](../adr/ADR%20012%20ANALYSIS%20PROVENANCE%20IS%20IMMUTABLE.md).
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 13 (Dataset & Analysis, including 13.3 Quantitative Engine), Section 22 (Background Jobs), Section 31 (P0–P3 Implementation Priority).
- [architecture/16 ANALYSIS ADVISOR.md](../architecture/16%20ANALYSIS%20ADVISOR.md), [architecture/17 DATASET ANALYSIS.md](../architecture/17%20DATASET%20ANALYSIS.md).
- [Quantitative Analysis Engine Spec — Phase 0 Audit](../architecture/QUANTITATIVE%20ANALYSIS%20ENGINE%20SPEC%20-%20PHASE%200%20AUDIT.md) — the audit this amendment answers.

## PROPOSED PHASE 10 CAPABILITY

**Multiple Linear Regression Analysis Pipeline** — one narrow, end-to-end vertical slice, not a general regression feature:

```
Dataset (ANALYSIS READY version)
  → select dependent variable (Y) + ≥2 predictors (X1…Xn)
  → validate eligible numeric inputs
  → descriptive summary (required pipeline step, not a separate capability)
  → assumption diagnostics:
      residual normality (Kolmogorov-Smirnov/Lilliefors and/or Shapiro-Wilk)
      multicollinearity (Tolerance / VIF)
      heteroscedasticity (Glejser and/or Breusch-Pagan)
      autocorrelation (Durbin-Watson, only when methodologically applicable)
  → OLS multiple linear regression execution
  → Model Summary
  → ANOVA / F test
  → Coefficients / t test
  → R² / Adjusted R²
  → structured findings (direction, significance, effect, assumption status, model status)
  → hypothesis decision (SUPPORTED / NOT_SUPPORTED / PARTIALLY_SUPPORTED / NOT_TESTABLE)
  → ResultValidation → VERIFIED (or FAILED, truthfully)
```

Explicitly **excluded** from this capability (per owner instruction, and consistent with `13.3`'s own priority split): Cronbach's Alpha, item validity/Pearson item-validity, any instrument/measurement-quality analysis, SmartPLS/PLS-SEM, CB-SEM, Simulation Lab/synthetic data, and the broad Method Selector. These remain catalog entries in the Master Spec, not part of this amendment.

## WHY THIS REMAINS NARROW

- **One method, one engine path, one result shape.** No method-selection logic, no alternative-test branching, no cross-method comparison. The researcher (or a direct API caller) supplies Y and X1…Xn; the pipeline does not choose the method for them — that is the Analysis Advisor's job (`16 ANALYSIS ADVISOR.md`), explicitly not required here since "a researcher can proceed straight to Dataset Analysis with a self-chosen test."
- **Descriptive statistics is folded in as a pipeline precondition, not a second capability.** This satisfies `Section 13.3`'s P0 line ("upload, cleaning, descriptive stats architecture") as a byproduct of one pipeline, rather than opening a second, independently-scoped descriptive-statistics capability.
- **The four diagnostics are fixed, not a diagnostics catalog.** They are the specific, named prerequisites OLS regression already requires to be a valid model (`P` and `Q` in the Master Spec list the same four); this is not "assumption engine breadth," it is the one method's own precondition set.
- **No instrument/measurement layer.** Deliberately deferred, per owner's separation of "Measurement Quality" (Cronbach, item validity) from "Structural/Statistical Analysis" (regression) into two different future capabilities, so Phase 10 does not open two domains at once.
- **No AI-driven computation.** Numerical execution is deterministic engine output only (`ADR 012`); AI, if present at all in this slice, may only draft the plain-language interpretation of an already-`VERIFIED` result, per `17 DATASET ANALYSIS.md`'s Interpretation Draft Generator boundary — and even that is separable from the capability's core proof and can be deferred without weakening it.

## DEPENDENCIES

- **Phase 6 — File / Reference Foundation, `LOCKED`.** Required for the private `FileAsset` boundary a dataset upload attaches to. Not started (see audit, Section 1).
- **Phase 9 — First Specialized Agents, `LOCKED`.** Required per the Phase 10 table as written. Phase 10's own dependency line also states "analysis execution does not depend on AI truth," and none of the three P0 agents (Research Planning, Literature/Evidence, Methodology) is a statistical agent — this amendment does not resolve why Phase 9 gates Phase 10 (that question is inherited, unresolved, from `17 DATASET ANALYSIS.md`'s own Open Questions) and does not propose loosening the dependency; it is recorded here as-is, not weakened.
- **Phases 2–5, transitively.** `ResearchProject` (Phase 2), RDT (Phase 3), Project Context (Phase 4), and the Research Compiler (Phase 5) must exist for an `AnalysisRun` to have a real project to attach to, consistent with Locked Invariant #1 (`ResearchProject` is the aggregate root).
- **Phase 0 — Foundation, and Section 22 Background Jobs.** Statistical execution is mandatory async, sandboxed, per-job-isolated work (`ADR 007`) — there is no code path in which this pipeline runs inline on a request. No queue/worker infrastructure exists yet.
- **A statistical execution runtime.** `Section 13.3` and `13.5` specify "isolated Python/R workers." No such runtime exists in this repository today (confirmed pure Next.js/TypeScript, no Python dependency — see audit, Section 1). Selecting and sandboxing that runtime is a Phase 0/10 infrastructure decision this amendment does not make.

None of these dependencies is satisfied today. This amendment does not change that; it only defines what Phase 10 should build once they are.

## EXISTING MODELS REUSED

No new entity is introduced. Every element of the pipeline maps onto fields the locked models already define:

| Pipeline step | Locked entity / field |
|---|---|
| Dataset upload, versioning | `Dataset`, `DatasetVersion` (state `RAW` → `ANALYSIS READY`) — [DATASET MODEL.md](../database/DATASET%20MODEL.md) |
| Column typing, Y/X role assignment | `DatasetVariable` (`role`, `measurement scale`, `inferred/declared type`) — [DATASET MODEL.md](../database/DATASET%20MODEL.md) |
| Profiling / missingness / outlier candidates | `DatasetProfile` — [DATASET MODEL.md](../database/DATASET%20MODEL.md) |
| Method registration | `AnalysisCapability` entry for "Multiple Linear Regression (OLS)," status `PLANNED` until implemented — [ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md) |
| Y/X selection, engine, parameters | `AnalysisDecision` / `AnalysisExecutionPlan` — [ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md) |
| Pipeline execution | `AnalysisRun` (immutable; `engine`, `engine_version`, `parameters`, `variables`, `hypotheses`, `assumption_results`, `status`) — [ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md) |
| Each diagnostic (normality, VIF, Glejser/BP, Durbin-Watson) | `AnalysisAssumptionResult` — one record per diagnostic, with `threshold/policy` making decision rules configurable without a new entity — [ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md) |
| Model Summary, ANOVA, Coefficients tables | `AnalysisResultSet` + typed `StructuredResult` items (`coefficient`, `p-value`, `CI`, `effect`, `fit index`, `descriptive`, `assumption`) — [ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md) |
| PASS/WARNING/FAIL/`VERIFIED` decision | `ResultValidation` — [ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md) |
| Direction/significance/hypothesis-decision narrative | `Interpretation` (already has a named "hypothesis decision" component) — [ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md) |
| Every reported number's trace back to its run | `ResultProvenanceLink` — [ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md) |
| SPSS/R/Python/Stata compatibility notes | `AnalysisEngineCapability` / `SoftwareInteroperabilityCapability` (`NATIVE EXECUTION` for the chosen runtime, others `NOT AVAILABLE` until verified) — [ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md) |

## MINIMAL IMPLEMENTATION SURFACE

- **One `AnalysisCapability` registry entry**: "Multiple Linear Regression (OLS)."
- **One statistical execution module**, isolated/sandboxed per `ADR 007`, computing: descriptives, the four assumption diagnostics, and OLS regression (Model Summary, ANOVA, Coefficients).
- **One assumption-checker pass** applying configurable thresholds (defaults: Tolerance > .10 / VIF < 10 with a VIF > 5 warning band, K-S/Shapiro-Wilk at α = .05, Glejser/Breusch-Pagan at α = .05, Durbin-Watson applicability rule) through the existing `AnalysisAssumptionResult.threshold/policy` field — not a new rule-engine entity.
- **One result mapper** normalizing raw engine output into `StructuredResult` items and a `ResultValidation` record.
- **One interpretation draft step** (optional for the first proof; can ship after the deterministic path is `VERIFIED`), reusing the existing Interpretation Draft Generator pattern from `17 DATASET ANALYSIS.md`, bounded to describing — not judging — the numbers.
- **No new API surface beyond Phase 10's own contract row**: create derived dataset version/plan → approve/run asynchronously → return structured result → resolve run/environment/input lineage. Method-specific endpoints (e.g., a dedicated `/api/analysis/regression` route) are an implementation detail of that contract, not a requirement to stand up the full ~18-endpoint catalog the Master Spec sketches.

## STATISTICAL CONTRACT

Minimum required output, mapped to `StructuredResult` items:

```
N
Model Summary:      R, R Square, Adjusted R Square, Std. Error of Estimate
ANOVA / F:           Regression SS, Residual SS, Total SS, df, MS, F, p
Constant:            B, Std Error, t, p, 95% CI
Predictors (each):   B, Std Error, Standardized Beta, t, p, Tolerance, VIF, 95% CI
Assumptions (each):  test name, statistic, df/N, p-value, decision
```

Structured findings, per predictor, expressed as `Interpretation` content: direction, significance, effect magnitude, assumption status, overall model status, and — where an `H1…Hn`-style hypothesis is attached via RDT — a hypothesis decision. Decision thresholds (α, VIF cutoff, warning bands) are read from `AnalysisAssumptionResult.threshold/policy`, not hard-coded, so a "Conservative" or "University Template" rule profile can be applied later without a schema change.

**Input validation and applicability rules:**
- Y and every X must resolve to a numeric/interval-or-ratio `DatasetVariable`; a nominal/ordinal column assigned as X or Y is rejected with a specific error (`unsupported analysis`, not a silent coercion).
- Minimum observations relative to predictor count is enforced before execution (exact ratio: `REQUIRES VERIFICATION at implementation time`, following this repository's own convention for citing an open numeric parameter rather than inventing one).
- A constant (zero-variance) predictor or a perfectly collinear predictor pair is rejected before the model is fit, not discovered only via a post-hoc VIF explosion.
- Durbin-Watson is computed and reported only when the dataset/plan is marked as having a meaningful observation order (e.g., time-series or panel structure); otherwise it is omitted with a stated reason, per the Master Spec's own instruction not to apply it "membabi buta."

**Failure states:** empty dataset, non-numeric Y/X, too few observations, zero variance, singular design matrix, perfect multicollinearity, unsupported grouping — each returns a specific user-facing message (what failed, why, how to fix) and a developer-facing technical log, per the Master Spec's own Section AL, applied here rather than invented fresh.

## VERIFICATION CONTRACT

This capability's Definition of Done is Gate G and Gate H's required evidence, applied literally, not restated:

- **Gate G** — immutable `RAW` and derived `DatasetVersion`s with replayable transformations; an approved `AnalysisPlan` and an isolated `AnalysisRun`; engine/package/runtime, parameters, seed (where relevant), input checksum, and timestamps pinned; structured result validation and complete Result Provenance; rerun within declared reproducibility limits; unsupported capability and ambiguous mapping fail truthfully; proof AI cannot create or edit the numerical result values.
- **Gate H** — the verified result reaches a reviewed `Interpretation` and downstream claim/section content with exact numeric/table fidelity to the pinned `StructuredResult`; stale-result propagation is honored if the source dataset version changes; generated vs. user-authored content stays distinguishable; no renderer/formatting layer can alter a canonical value.
- `COMPLETED` on an `AnalysisRun` never implies `VERIFIED` — a completed-but-unreviewed regression run is a distinct, visibly different state from one that has passed `ResultValidation`, per `ANALYSIS RESULT MODEL.md`'s own invariant.

## GOLDEN FIXTURES

Eight fixed test datasets, each with a pinned expected output and an explicit pass/fail expectation, per the owner's instruction:

1. **Valid multiple regression** — clean data, all assumptions hold; expect `VERIFIED` end to end.
2. **Multicollinearity failure** — near-collinear predictors; expect VIF `FAIL`/`WARNING` per configured threshold, model still computed and reported, not suppressed.
3. **Heteroscedasticity warning/failure** — funnel-shaped residuals; expect Glejser/Breusch-Pagan flag.
4. **Nonnormal residual** — skewed/heavy-tailed residuals; expect K-S/Shapiro-Wilk flag, with the flag correctly scoped to the residual, not to each raw predictor (per the Master Spec's own `PENTING` note in Section K).
5. **Singular design matrix** — a duplicated/derived predictor; expect a specific, safe failure (`unsupported analysis`/`singular matrix`), not a crash or a silently dropped column.
6. **Missing predictor** — Y or an X absent/unmapped in the dataset; expect a validation-time rejection before execution starts.
7. **Constant predictor** — zero-variance column selected as X; expect rejection before model fit, per the applicability rule above.
8. **Insufficient observations** — N below the enforced minimum ratio; expect rejection with the stated minimum in the error message.

Each fixture's numeric output (coefficients, SEs, t, p, F, R², VIF, Durbin-Watson where applicable) must match a trusted reference implementation (R or Python `statsmodels`) within a stated tolerance — proposed default `1e-6` absolute tolerance for coefficient-level values, `REQUIRES VERIFICATION at implementation time` for iterative/optimization-derived statistics if any enter later. Where a manually-verified SPSS output fixture exists, cross-check against it as an additional, not replacing, reference. These are the numerical golden fixtures; they are additional to — not a replacement for — Phase 10's own infrastructure tests (raw immutability, ambiguous mapping, pinned run, retry/idempotency, unsupported method, result schema, reproducibility limits) already required by its own table.

## FILES THAT WOULD LATER CHANGE

Only if and when this amendment is accepted and Phases 6/9 are `LOCKED`; none of these should be touched now:

- [P0 Backend Implementation Sequence](P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) — Phase 10 table narrowed/annotated with this capability as its first delivery.
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 13.3 — an explicit note that "Multiple Linear Regression" is the specific method proving the otherwise-P1 "core inferential tests" bucket inside the P0 Phase 10 contract (see Conflicts, below).
- [database/ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md) / [ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md) / [DATASET MODEL.md](../database/DATASET%20MODEL.md) — only if implementation surfaces a genuinely missing field; expectation per Section "Existing Models Reused" above is zero schema changes.
- New: an `AnalysisCapability` seed/fixture record and a statistical execution module, once a runtime/sandbox decision is made — no such module exists yet.

## CONFLICTS

- **Priority-line tension (needs explicit sign-off, not silently resolved here).** `Section 13.3` of Master Backend Architecture places "descriptive stats architecture" at P0 but "core inferential tests" — which plainly includes regression, t-test, ANOVA, and Chi-Square — at **P1**. Phase 10 of the implementation sequence is nonetheless a P0-lane phase whose whole purpose is to prove "one narrow validated analysis capability" end-to-end. Choosing Multiple Linear Regression as that one capability means a P1-priority *method* is being implemented inside a P0-priority *phase*. That is defensible — Phase 10 is proving an infrastructure contract (immutable provenance chain), not promoting regression's product priority — but it is a second location, beyond the Phase 10 table itself, where this amendment needs the same explicit sign-off the P0 sequence requires for any priority reclassification. This amendment flags it; it does not resolve it unilaterally.
- **Everything else the owner's decision already settled cleanly, with no residual conflict:** deferring Cronbach/validity to a separate future "Instrument Reliability & Item Analysis" capability is consistent with `13.3` (validity/reliability sit in the same undifferentiated P1 "core inferential tests" bucket, not called out as P0); deferring Simulation Lab to P2/future is consistent with it having no counterpart anywhere in the existing 37 architecture modules today (per the Phase 0 audit); deferring broad Method Selector, PLS-SEM/CB-SEM, and mediation/moderation to P1/P2 matches `Section 31`'s own placement of "Advanced statistical analysis (SEM/PLS-SEM)" at P2.

## BLOCKERS

- Phase 6 and Phase 9 are not `LOCKED` — confirmed unstarted at the persistence layer (no `FileAsset`, `ResearchProject`, RDT, or agent-orchestrator table exists in `supabase/schema.sql` today).
- Phases 0, 2, 3, 4, 5 are transitively unstarted; there is no `ResearchProject` for an `AnalysisRun` to attach to yet regardless of this capability's own readiness.
- No async job/worker infrastructure (Section 22) exists in the current codebase.
- No isolated Python/R statistical execution runtime exists in the current codebase (confirmed pure Next.js/TypeScript stack).
- The priority-line tension above is unresolved pending owner sign-off; implementation should not start assuming it is implicitly resolved by this document alone.

## DEFINITION OF DONE

Per [P0 Definition of Done](P0%20DEFINITION%20OF%20DONE.md)'s Dataset/Analysis row: **"Immutable versions/runs, pinned environment/parameters/input and structured validated results."** Concretely, for this capability:

1. A clean environment applies the relevant migrations and starts healthy.
2. One authorized private project holds a raw dataset version that is immutable and checksum-addressed.
3. An approved `AnalysisExecutionPlan` selecting Y and X1…Xn produces exactly one `AnalysisRun`, pinned to engine/version/parameters/input checksum.
4. All four assumption diagnostics execute and record `AnalysisAssumptionResult`s with a truthful decision, independent of whether the overall run should proceed.
5. The regression's `StructuredResult` set matches a trusted reference implementation within the stated tolerance, across all eight golden fixtures.
6. `ResultValidation` correctly distinguishes `COMPLETED` from `VERIFIED`; a `FAIL`-diagnostic run is never silently reported as passing.
7. At least one `Interpretation` with a hypothesis decision resolves to its exact `StructuredResult` and `AnalysisRun` via `ResultProvenanceLink`.
8. Rerun of the same plan against the same dataset version reproduces the result within tolerance; rerun after a dataset-version change produces a new run and a supersession edge, never a mutation.
9. Every stated failure mode (Section "Statistical Contract") fails safely with the specific, actionable message, not a generic error.
10. Gate G and Gate H evidence is recorded per the [P0 Implementation Gates](P0%20IMPLEMENTATION%20GATES.md) gate-record template, reviewed, and accepted — not self-assigned.

## RECOMMENDED NEXT ACTION

1. Owner/reviewer accepts or revises this amendment, explicitly including the priority-line tension in "Conflicts."
2. On acceptance, record the amendment's status as `PROPOSED → LOCKED` against the Phase 10 table and the `Section 13.3` priority line in the two authority documents — as a tracked documentation change, not as part of this file.
3. Do **not** begin Phase 10 implementation. The actually-startable next step today is the platform's own **`Phase 0 — Foundation`** (configuration, DB lifecycle, migrations, error/logging/health baseline) — every dependency chain in this amendment (Section "Dependencies," "Blockers") traces back to phases that have not started yet, independent of whether this specific capability is approved.
4. Re-open this amendment for a dependency check once Phase 6 and Phase 9 report `LOCKED`, before any code is written against it.

---

## STOP

This document is the complete Phase 10 scoping amendment. No implementation was performed. No source file, schema, or locked document was modified. Per the owner's stop instruction: **do not begin Phase 10 if Phase 6 and Phase 9 are not `LOCKED`** — they are not, so no further action follows from this document until that changes and it is reviewed.

## Related documents

- [Quantitative Analysis Engine Master Spec V1](../architecture/QUANTITATIVE%20ANALYSIS%20ENGINE%20MASTER%20SPEC%20V1.md)
- [Quantitative Analysis Engine Spec — Phase 0 Audit](../architecture/QUANTITATIVE%20ANALYSIS%20ENGINE%20SPEC%20-%20PHASE%200%20AUDIT.md)
- [P0 Backend Implementation Sequence](P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md), [P0 Implementation Gates](P0%20IMPLEMENTATION%20GATES.md), [P0 Definition of Done](P0%20DEFINITION%20OF%20DONE.md), [P0 Dependency Graph](P0%20DEPENDENCY%20GRAPH.md)
- [database/ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md), [database/ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md), [database/DATASET MODEL.md](../database/DATASET%20MODEL.md)
- [ADR 007 Async Job Model](../adr/ADR%20007%20ASYNC%20JOB%20MODEL.md), [ADR 011 AI Is Not Source of Truth](../adr/ADR%20011%20AI%20IS%20NOT%20SOURCE%20OF%20TRUTH.md), [ADR 012 Analysis Provenance Is Immutable](../adr/ADR%20012%20ANALYSIS%20PROVENANCE%20IS%20IMMUTABLE.md)
- [architecture/16 ANALYSIS ADVISOR.md](../architecture/16%20ANALYSIS%20ADVISOR.md), [architecture/17 DATASET ANALYSIS.md](../architecture/17%20DATASET%20ANALYSIS.md)
