# Analysis Result Model

**Status:** LOCKED P0 conceptual model — no SQL, calculation, or renderer implementation

## Purpose

This model separates immutable engine output, normalized structured results, validation, interpretation, and downstream provenance so every academic claim/value can be reconstructed to its source.

## Entities

### AnalysisResultSet

Immutable result envelope for one AnalysisRun: result-set id, project/run/dataset/plan/capability versions, method, output-schema version, raw-output reference/checksum, structured-output checksum, status, warnings/limitations, created time, validation, and supersession.

### StructuredResult

Typed result item: stable result id/key/path, result type (coefficient, p-value, CI, effect, fit index, descriptive, assumption, theme/count, etc.), value and machine type, unit/scale, precision, labels/groups/timepoint, variable/RQ/hypothesis references, raw-output locator, method semantics, and validation state. Stored precision is distinct from display precision.

### QualitativeFinding / Theme / QuotationLink

Finding and theme definitions with codebook/run versions, supporting and contrary quotation links, immutable source coordinates, memo/rationale, context/participant boundary, coverage/validation, reviewer decisions, and status. Source text is referenced under authorization rather than copied into broad contexts.

### MixedMethodsFinding

Links quantitative result ids and qualitative finding ids to construct/RQ, convergence/divergence/complementarity decision, joint-display cells, integration rationale, limitation, meta-inference, validation, and approval.

### ResultValidation

Validation run over result schema, checksums, engine success, assumptions/diagnostics, expected bounds, plan fidelity, reproducibility metadata, reviewer/critic decision, issues, outcome, version, and timestamp. `VERIFIED` requires this record and cannot be asserted by AI confidence.

### Interpretation

Versioned interpretation tied to exact result/finding ids and RDT context: separated statistical, substantive, hypothesis decision, theoretical, practical implication, and limitation components; values rendered with declared format policy; evidence/theory links; agent/model/prompt provenance; reviewer/approval; compiler state; supersession/stale status.

### ResultProvenanceLink

Machine-readable consumer→source edge for claim/section/table/figure/cell/text token to interpretation/structured result/finding, AnalysisRun, dataset/source version, and raw origin. Carries raw/display values, format policy, validation, RDT version, timestamps, and supersession.

### TableArtifact / FigureArtifact / JointDisplay

Versioned visualization specification and rendered artifact reference. Every numeric cell/series or qualitative content unit references structured results/findings; captions/notes and render capability/version are recorded. AI-generated numerical content is invalid.

## Invariants

- Values cannot be changed after an AnalysisRun/result set is persisted; corrections create a new run/result.
- `p = 0.021` may only be rendered from a validated structured value that deterministically formats to it.
- Written result, table, figure, interpretation, discussion, and conclusion links become stale when any pinned source/version changes.
- Cross-project provenance and unverifiable copied values are rejected.
- Qualitative findings require source/quotation traceability; mixed meta-inference requires both paths.

## Compiler queries

Resolve every written value to run/data; compare raw vs display policy; list orphaned/stale claim/table/figure links; validate hypothesis/RQ coverage; trace discussion/conclusion to verified findings; identify all downstream consumers of a superseded run.

## Related documents

- [Result Provenance Engine](../internal-engines/RESULT%20PROVENANCE%20ENGINE.md)
- [Interpretation Engine](../internal-engines/INTERPRETATION%20ENGINE.md)
- [Analysis Model](./ANALYSIS%20MODEL.md)

