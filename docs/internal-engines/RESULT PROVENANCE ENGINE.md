# Result Provenance Engine

**Status:** LOCKED P0 provenance contract — documented, not implemented

## Purpose

Result Provenance Engine guarantees machine-readable traceability from every written numerical result, qualitative finding, table, figure, interpretation, and conclusion back to the exact validated analysis/finding and source data lineage.

```text
DOCUMENT CLAIM
→ INTERPRETATION
→ STRUCTURED RESULT / QUALITATIVE FINDING
→ ANALYSIS RUN
→ DATASET / SOURCE VERSION
→ RAW DATASET / ORIGINAL SOURCE
```

## Provenance link

A `ResultProvenanceLink` records link id/type, project id, source and consumer artifact/entity ids plus versions, structured field/path or quotation coordinates, raw and display values, units/scale, rounding/format policy, method/capability, AnalysisRun, dataset/source version, validation status/id, RDT version, generator/actor, timestamps, and supersession/stale state.

For `R² = 0.684`, the document token references the precise structured output path from one verified AnalysisRun. Copied text without this link cannot be a verified major result.

## Integrity rules

- Numeric equality is checked against structured value under the declared deterministic formatting policy.
- Tables/figures enumerate every result series/cell provenance or a dataset/query/result-set reference capable of reproducing it.
- Qualitative claims link to finding/theme plus supporting/contrary quotations and immutable source coordinates.
- An AnalysisRun/result is immutable. Corrections create a new run/version and mark dependents stale.
- AI output cannot be a numeric source and cannot self-validate a provenance link.

## Compiler integration

Compiler resolves Dataset↔Variable, Method↔Analysis, Analysis↔RQ/Hypothesis, Result↔Written Result, Table/Figure↔AnalysisRun, Discussion↔Evidence, and Conclusion↔Findings. Example: document `p = 0.021` versus run `p = 0.201` creates a critical `ERROR` and blocks document finalization.

## Change propagation

Dataset version, mapping, execution plan, engine version, run verification, interpretation, or document change triggers targeted revalidation. Prior provenance remains historical; stale links are visible and cannot be exported as final.

## Access and failure

Provenance inherits the strictest access/retention classification among linked artifacts. It exposes references, not unauthorized raw values. Missing/stale/cross-project/ambiguous links, precision drift, deleted source under policy, or unverifiable external result creates `BLOCKED`/`UNKNOWN` with remediation.

## Related documents

- [Analysis Result Model](../database/ANALYSIS%20RESULT%20MODEL.md)
- [Interpretation Engine](./INTERPRETATION%20ENGINE.md)
- [Academic Document Engine](./ACADEMIC%20DOCUMENT%20ENGINE.md)
- [Evidence-to-Claim Graph](./EVIDENCE%20TO%20CLAIM%20GRAPH.md)

