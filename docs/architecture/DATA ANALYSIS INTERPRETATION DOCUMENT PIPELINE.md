# Data → Analysis → Interpretation → Academic Document Pipeline

**Status:** LOCKED P0 architectural contract — documented, not implemented

## Purpose

This pipeline makes Dataset-to-Document execution a first-class part of the Research Operating System. It carries authorized project data from immutable raw input through preparation, approved analysis, validated results, bounded interpretation, evidence-based discussion, and provenance-bearing academic documents.

It extends rather than replaces the locked `ResearchProject`, Research Digital Twin (RDT), Project Context Engine, Research Compiler, Evidence-to-Claim Graph, Agent Orchestrator, Multi-Model AI Gateway, Integration Gateway, and Publication Gateway contracts.

## Canonical pipeline

```text
RESEARCH PROJECT
→ DATA INGESTION → DATASET PROFILING → VARIABLE MAPPING → DATA PREPARATION
→ METHODOLOGY CONSISTENCY CHECK → ANALYSIS ADVISOR → HUMAN REVIEW / APPROVAL
→ EXECUTION PLAN → ANALYSIS EXECUTION → RESULT VALIDATION → INTERPRETATION
→ EVIDENCE + THEORY CONNECTION → DISCUSSION → RESEARCH COMPILER
→ ACADEMIC DOCUMENT ENGINE → FINAL RESEARCH QA → DOCX / PDF / LATEX / OTHER OUTPUT
```

Canonical acceptance trace:

```text
RAW DATA → CLEAN DATA → VERIFIED METHOD → ANALYSIS → VERIFIED RESULT
→ INTERPRETATION → DISCUSSION → DOCUMENT → FINAL QA
```

Canonical state is stored as project-scoped RDT entities and immutable/versioned artifacts. Project Context Engine supplies an authorized projection to agents/models. AI may explain verified values but cannot execute numerical computation, fabricate values, alter a result, or silently mutate canonical state.

## P0 lock and phased breadth

P0 locks the orchestration, immutable dataset/analysis/result lineage, validation, approval, security, and document-provenance contracts. It does not claim every file format, statistical/qualitative method, export renderer, or external software integration is implemented. Those are registered capabilities with verified status.

## Dataset lifecycle

Supported-by-architecture input candidates are CSV, XLSX, TSV, JSON, SAV, DTA, RData/RDS, and Parquet. Actual support is declared by the Dataset Format Capability Registry. Original bytes and `DatasetVersion` v1 `RAW` are immutable. Every preparation produces a new version:

```text
Dataset v1 RAW → v2 CLEANED → v3 CODED → v4 ANALYSIS READY
```

Each version records checksum, format, schema/profile, parent version, operation log, actor, timestamp, reason, storage reference, privacy classification, consent boundaries, and lineage. Deleting according to policy is distinct from overwriting.

## Variable mapping

Dataset columns map to RDT Variables and Indicators using explicit `UNMAPPED`, `MAPPED`, `AMBIGUOUS`, `MISSING`, or `INVALID` decisions. Example: Construct/Variable `Platform Experience`, indicators `PE1–PE4`, columns `PE1–PE4`. Suggested mappings include evidence/rationale and confidence; ambiguous or consequential changes require user review. AI cannot silently guess.

## Analysis decision and execution

Analysis Advisor evaluates RQ, objective, hypotheses, design, variable roles/types/scales, population, sampling, sample size, dataset characteristics, distributions, and assumptions. It returns `RECOMMENDED`, `ALTERNATIVE`, `NOT RECOMMENDED`, or `INSUFFICIENT INFORMATION`, with method, rationale, assumptions/tests, limitations, alternatives, confidence, and references where relevant.

The approved execution plan is run by a provider/tool-agnostic Statistical or Qualitative Execution Engine. Native quantitative execution may use isolated, versioned Python or R runtimes. IBM SPSS, SmartPLS, AMOS, Stata, SAS, JASP, Jamovi, Mplus, LISREL, NVivo, ATLAS.ti, and MAXQDA remain interoperability capabilities; no API or availability is assumed.

Every execution creates an immutable `AnalysisRun` with `PLANNED`, `APPROVED`, `RUNNING`, `COMPLETED`, `FAILED`, `VERIFIED`, or `SUPERSEDED` status. It pins dataset version, method/capability, engine/version, parameters, variables, hypotheses, assumption results, raw and structured outputs, warnings/errors, timestamp, environment, and provenance.

## Quantitative, qualitative, and mixed-method paths

- Quantitative capabilities are registry entries (descriptive, correlation, tests, regression, mediation/moderation, factor/SEM paths, time/panel/cluster, etc.), not platform claims until status is verified.
- Qualitative execution preserves original transcripts, versions codebooks/coding/themes/memos, and traces every finding/theme to quotations. AI suggestions remain human-reviewable proposals.
- Mixed methods performs explicit triangulation: quantitative results + qualitative findings → convergence/divergence → joint display → meta-inference. It cannot concatenate two generated summaries and call that integration.

## Result provenance and interpretation

```text
DOCUMENT CLAIM → INTERPRETATION → STRUCTURED RESULT → ANALYSIS RUN
→ DATASET VERSION → RAW DATASET
```

Every written statistic (for example `R² = 0.684`) has a machine-readable source reference to a validated structured result. Interpretation outputs are separated into Statistical Interpretation, Substantive Interpretation, Hypothesis Decision, Theoretical Interpretation, Practical Implication, and Limitations. Values are copied through typed references and deterministic formatting rules; AI cannot invent, replace, inconsistently round, or silently correct them.

Discussion follows Finding → RQ → Hypothesis (when applicable) → Theory → Previous Evidence → Convergence/Contradiction → Interpretation → Contribution → Implication. Unsupported generic discussion is a compiler issue.

## Academic documents

Academic Document Engine composes RDT state through `DocumentBlueprint`, optional `InstitutionTemplate`/`JournalTemplate`, and `SectionDefinition`. It supports architecture for Skripsi, Tesis, Disertasi, Journal Article, and Research Report without hardcoding one institution.

Every generated section/table/figure stores provenance to RDT versions, claims/evidence, analysis runs/results, dataset versions, citations, generator/prompt/template versions, and human approvals. Numerical tables/figures are rendered only from structured results. DOCX, PDF, LaTeX, and other outputs are capability-gated deterministic exports, not automatically available promises.

## Compiler gates

Research Compiler validates Dataset↔Variables, Variables↔Method, Method↔Analysis, Analysis↔Hypothesis/RQ, Analysis Result↔Written Result, Result↔Discussion, Discussion↔Evidence, Conclusion↔Findings, Citation↔Reference, and Table/Figure↔AnalysisRun. A document value `p = 0.021` conflicting with AnalysisRun `p = 0.201` is an `ERROR` that blocks finalization, without blocking unrelated exploratory project work.

## Human approval

Approval is mandatory before destructive cleaning, observation exclusion, variable-mapping change, methodology/analysis-method change, expensive analysis execution, verified-interpretation replacement, final-section replacement, and external submission. Approval is tied to proposed change hash, pinned RDT/dataset version, impact preview, actor, and expiry/consumption.

## Security

Datasets are private by default with project/tenant isolation, encryption in transit/at rest, signed upload/download, malware validation, least-privilege access control, audit logging, isolated temporary processing, data retention/deletion enforcement, PII handling, and consent-purpose boundaries. Raw or row-level dataset content is never sent automatically to an external AI provider; any exceptional disclosure requires policy, minimization, provider disclosure, and explicit authorization.

## Events and next action

Canonical events include `dataset.uploaded`, `dataset.profiled`, `dataset.version.created`, `dataset.mapping.changed`, `dataset.analysis_ready`, `analysis.recommended`, `analysis.approved`, `analysis.started`, `analysis.completed`, `analysis.failed`, `analysis.verified`, `interpretation.generated`, `interpretation.approved`, `document.section.generated`, `document.section.approved`, `research.compiler.failed`, and `research.compiler.passed`.

Next Best Research Action may recommend mapping unmapped variables, reviewing verified analysis results, or connecting an approved interpretation to theory/evidence. Recommendations remain explainable and non-mutating.

## Locked invariants

- Original datasets/transcripts and AnalysisRuns are immutable.
- No agent owns a dataset or result silo.
- No frontend/provider-specific path bypasses gateways or canonical state.
- Statistical values originate only from validated structured results.
- AI suggestions remain proposals and cannot self-verify.
- New methods extend the Analysis Capability Registry without changing the pipeline.
- Publication Gateway remains a user-controlled handoff, never autonomous submission.

## Relationship to existing domain documents

The existing Analysis Advisor, Dataset Analysis, Qualitative & Mixed Methods, Writing & Citation, and Research File Tools documents remain valid capability/domain descriptions. This P0 contract connects them and strengthens immutable lineage, provenance, approvals, and QA. Their P1/P2 labels continue to describe breadth/availability of particular methods and integrations; they do not downgrade this pipeline's P0 backbone. Where older text says a feature is not implemented or is a future extension, that status remains authoritative until its capability registry evidence changes.

## Related documents

- [Research Digital Twin](./RESEARCH%20DIGITAL%20TWIN.md)
- [Research Compiler](./RESEARCH%20COMPILER.md)
- [Dataset Engine](../internal-engines/DATASET%20ENGINE.md)
- [Result Provenance Engine](../internal-engines/RESULT%20PROVENANCE%20ENGINE.md)
- [Academic Document Engine](../internal-engines/ACADEMIC%20DOCUMENT%20ENGINE.md)
- [Research Execution Agent Contract](../agents/RESEARCH%20EXECUTION%20AGENT%20CONTRACT.md)
- [Analysis Advisor](./16%20ANALYSIS%20ADVISOR.md)
- [Dataset Analysis](./17%20DATASET%20ANALYSIS.md)
- [Qualitative & Mixed Methods](./18%20QUALITATIVE%20MIXED%20METHODS.md)
- [Writing & Citation](./19%20WRITING%20CITATION.md)
- [Research File Tools](./20%20RESEARCH%20FILE%20TOOLS.md)
