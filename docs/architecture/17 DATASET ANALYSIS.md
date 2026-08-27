# Dataset Analysis

## Purpose
Dataset Analysis executes the statistical computation a researcher has confirmed (via the [Analysis Advisor](16%20ANALYSIS%20ADVISOR.md) or chosen independently) against a dataset they upload, and returns results (statistics, tables, charts) along with an AI-assisted plain-language interpretation the researcher must verify.

## Scope
Covers dataset ingestion (structured tabular data: CSV, XLSX, SPSS `.sav` where feasible), schema inference, running confirmed statistical computations, and generating result interpretation drafts. Does not cover choosing which analysis to run (that is the Analysis Advisor's job), does not cover qualitative dataset handling such as interview transcripts (that is [18 QUALITATIVE MIXED METHODS.md](18%20QUALITATIVE%20MIXED%20METHODS.md)), and does not perform statistical computation inline on a web request; all non-trivial computation runs as an async background job.

## Responsibilities
- Ingest a researcher-uploaded dataset file, validate its structure, and infer a column-level schema (variable names, inferred types) to hand to the Analysis Advisor's `DataCharacteristics` intake.
- Execute the confirmed `AnalysisDecision` (from the Analysis Advisor) against the actual dataset, producing statistical output (test statistics, p-values, effect sizes, descriptive tables, charts) as a background job.
- Store computation results scoped to the project and versioned against the dataset version and analysis specification used.
- Generate a plain-language draft interpretation of results through the AI Gateway, always visibly marked as AI-drafted and requiring researcher verification, never presented as a definitive scientific conclusion.
- Enforce dataset size and format limits appropriate to background-job processing, rejecting or queuing oversized files gracefully rather than failing silently.

## Non-Responsibilities
- Does not decide what analysis to run; it executes what the Analysis Advisor (or the researcher directly) specifies.
- Does not perform general-purpose data engineering (ETL pipelines, joins across arbitrary external data sources); scope is a single researcher-uploaded dataset per analysis run.
- Does not claim statistical significance implies practical or causal significance; interpretation drafts are required to state results neutrally, leaving substantive interpretation to the researcher.
- Does not call any AI provider directly for computation itself; only the interpretation-drafting step uses the AI Gateway. The actual statistical computation is deterministic code, not AI-generated.

## Core Components
- **Dataset Ingestion Service**: validates uploaded file format, parses into a normalized internal tabular representation, and infers column schema.
- **Computation Job Runner**: executes the specified statistical procedure against the ingested dataset as an async background job, using a fixed, versioned statistical computation library (not AI-generated code) for correctness and reproducibility.
- **Result Store**: persists computation output (statistics, tables, chart data) versioned by dataset version and analysis specification.
- **Interpretation Draft Generator**: submits computed results (not raw data) to the AI Gateway to produce a plain-language draft explanation, bounded to describing what the numbers show rather than what they mean substantively.

## Owned Data
| Entity | Description |
|---|---|
| `Dataset` | An uploaded tabular dataset: file reference, inferred schema, upload metadata, version. |
| `AnalysisRun` | One execution of a specified analysis against a dataset version: status (queued/running/complete/failed), timestamps, and specification used. |
| `AnalysisResult` | Computed statistical output for an `AnalysisRun`: statistics, tables, chart-ready data. |
| `InterpretationDraft` | AI-drafted plain-language explanation of an `AnalysisResult`, marked as requiring researcher verification. |

## Inputs
- Researcher-uploaded dataset file.
- Confirmed `AnalysisDecision` from the [Analysis Advisor](16%20ANALYSIS%20ADVISOR.md), or a researcher-specified analysis if bypassing the advisor.

## Outputs
- `Dataset` schema (used to feed back into Analysis Advisor's `DataCharacteristics` intake).
- `AnalysisResult` records rendered as statistics, tables, and charts.
- `InterpretationDraft` text, always rendered with a visible verification marker.
- Results made available to [19 WRITING CITATION.md](19%20WRITING%20CITATION.md) for inclusion in a manuscript's results section, on researcher request.

## Dependencies
- [Analysis Advisor](16%20ANALYSIS%20ADVISOR.md) as the typical source of the analysis specification this engine executes.
- Async background job infrastructure per [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md); baseline requirement that all non-trivial computation here runs off the request path.
- [Multi-Model AI Gateway](05%20MULTI%20MODEL%20AI%20GATEWAY.md) for interpretation drafting only.
- [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md) to publish that an analysis has run and its headline result, so other engines have visibility without re-querying raw results.

## Extension Points
- Additional file formats (SPSS `.sav`, Stata `.dta`) can be added to the Dataset Ingestion Service as separate parsers behind the same ingestion interface; exact library support for `.sav`/`.dta` parsing: REQUIRES VERIFICATION at implementation time.
- Additional statistical procedures are added to the Computation Job Runner as new, independently tested procedure modules, not by expanding a monolithic computation function.
- A future "compare two analysis runs" view can be built on the existing versioned `AnalysisResult` data without a schema change.

## Security & Privacy
Uploaded datasets frequently contain sensitive research data (survey responses, potentially identifiable information depending on the study); datasets are private by default and scoped strictly to the owning `ResearchProject`, consistent with [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md). Raw dataset rows are never sent to the AI Gateway; only computed, already-aggregated results are used for interpretation drafting, minimizing exposure of individual-level data to any AI provider. Dataset storage and deletion follow the platform's data retention rules; a researcher deleting a project's dataset removes the underlying file, not just the database reference.

## Failure Modes
- **AI Gateway unavailable**: interpretation drafting pauses; computed `AnalysisResult` data remains fully available and usable without the plain-language draft, satisfying degraded-but-functional operation, since the actual statistics do not depend on AI at all.
- **Malformed or corrupt dataset upload**: ingestion fails with a specific, actionable validation error (e.g., "column C has mixed types") rather than a generic failure.
- **Computation job crashes mid-run** (e.g., a test's assumptions are silently violated by real data despite advisor warnings): `AnalysisRun` marked failed with the specific error, dataset and prior results remain intact, no partial/corrupt result is surfaced as if complete.
- **Oversized dataset**: rejected at ingestion with a stated size limit rather than accepted and left to fail deep in a background job.

## Observability
- Analysis job queue depth, run duration, and failure rate by procedure type.
- Ingestion validation failure rate and most common failure reasons (signal for researcher-facing upload guidance).
- Interpretation draft generation success rate and AI Gateway error rate specific to this call type.

## P0/P1/P2/P3
**P1.** Executing confirmed analyses against real data is a major, concrete product capability, but it depends on P1 upstream context (methodology/analysis choice) and is not required for the platform's foundational operation, placing it at P1 rather than P0.

## Current Status
Documented, not implemented. No ingestion service, computation job runner, result store, or interpretation generator exists in code yet.

## Open Questions
- Which statistical computation library/runtime does the Computation Job Runner standardize on, and how is it versioned for reproducibility of past `AnalysisResult` records?
- What are the concrete dataset size/row limits at launch, and how are they communicated to researchers before upload?
- Should the platform support re-running a past `AnalysisRun` against an updated dataset version, and how are the two results distinguished in the UI?

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [16 ANALYSIS ADVISOR.md](16%20ANALYSIS%20ADVISOR.md)
- [18 QUALITATIVE MIXED METHODS.md](18%20QUALITATIVE%20MIXED%20METHODS.md)
- [19 WRITING CITATION.md](19%20WRITING%20CITATION.md)
- [20 RESEARCH FILE TOOLS.md](20%20RESEARCH%20FILE%20TOOLS.md)
