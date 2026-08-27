# Data Preparation Engine

**Status:** LOCKED P0 engine contract — documented, not implemented

## Purpose

Data Preparation Engine creates reproducible derived dataset versions without modifying raw data. It executes an approved, versioned transformation plan in an isolated deterministic environment and records full lineage.

## Capability scope

- missing-value inspection and declared handling;
- duplicate and invalid-response detection;
- coding/reverse coding and categorical encoding;
- data-type correction;
- outlier inspection (never automatic exclusion by default);
- normalization/standardization when method requires it;
- derived variables;
- filtering, grouping, and deterministic transformations.

Detection is separate from action. Findings become reviewable issues; a suggestion is not a committed transformation.

## Transformation contract

Every operation records operation id/type, ordered position, versioned implementation, parameters, input dataset version, output dataset version, timestamp, actor, reason, affected variables/rows summary, approval reference when required, validation results, warnings/errors, and reversible/replay information.

```text
immutable input version + approved plan
→ isolated execution → validation/checksum
→ new immutable output version + lineage event
```

The engine never overwrites v1 RAW. Failed or partial execution produces no authoritative output version. Reruns are new transformation executions; identical inputs/plans may be proven reproducible but do not erase history.

## Approval and validation

Destructive cleaning, row exclusion, recoding that changes meaning, sensitive-data de-identification choices, and material variable-mapping changes require a preview showing affected counts/variables and explicit approval. Validate schema, mapping continuity, row-count deltas, expected ranges, missingness changes, codebook alignment, and consent-purpose compliance before marking `ANALYSIS READY`.

## Agent and AI boundary

Data Preparation Agent may inspect metadata/profile and propose operations with rationale. Deterministic tools execute approved operations. Raw rows cannot be sent automatically to AI providers; AI cannot generate arbitrary transformation code and run it unsandboxed.

## Failure and observability

Fail closed on stale input version, expired approval, invalid operation order, lost lineage, privacy violation, or non-reproducible output. Observe preparation duration, issue/approval counts, row/column deltas, failed replay rate, lineage completeness, and temporary-data cleanup without exposing content.

## Related documents

- [Dataset Engine](./DATASET%20ENGINE.md)
- [Dataset Model](../database/DATASET%20MODEL.md)
- [Data-to-Analysis Workflow](../workflows/DATA%20TO%20ANALYSIS%20WORKFLOW.md)

