# Dataset Engine

**Status:** LOCKED P0 engine contract — documented, not implemented

## Purpose and boundary

Dataset Engine owns safe ingestion, profiling, schema/variable metadata, version identity, provenance, and lineage for first-class project datasets. Research Digital Twin references its canonical objects. It does not clean data in place, recommend/run analysis, send rows to AI, or claim all formats are available.

## Format capability registry

Candidate formats: CSV, XLSX, TSV, JSON, SAV, DTA, RData/RDS, Parquet. Each entry declares format id, parser/version, detection method, size/feature limits, supported operations, security constraints, and status (`PLANNED`, `AVAILABLE`, `LIMITED`, `BLOCKED`, `DEPRECATED`). Only verified `AVAILABLE/LIMITED` entries may accept production ingestion.

## Ingestion and profiling

```text
Signed upload → malware/file validation → format detection → checksum
→ immutable raw storage → schema inference → profile → RDT registration
```

Profile includes columns/labels, inferred and declared data types, measurement metadata/scales, label/value mapping, missingness, duplicate candidates, range/category anomalies, outlier candidates, descriptive summaries, row/column counts, encoding/locale, and inference confidence. Inferences are proposals until confirmed where ambiguity affects analysis.

## Variable mapping

`DatasetVariableMapping` links a dataset column/version to an RDT Variable/Indicator version. Status is `UNMAPPED`, `MAPPED`, `AMBIGUOUS`, `MISSING`, or `INVALID`. Suggestions store rationale, matching signals, confidence, and assumptions. Ambiguous, invalid, or changed mappings require human review; no model may silently promote them to mapped.

## Versioning and lineage

Raw v1 and its checksum are immutable. Derived versions reference their parent, transformation run/log, actor, timestamp, reason, affected variables, and privacy/consent implications. A version state may be `RAW`, `CLEANED`, `CODED`, or `ANALYSIS READY`; state never substitutes for validation evidence.

## Inputs and outputs

Inputs are authorized project uploads/imports plus declared metadata and consent boundaries. Outputs are `Dataset`, `DatasetVersion`, `DatasetVariable`, schema/profile, mapping records, provenance, lineage, quality issues, and dataset events. Project Context receives only an authorized summary; row data is not context by default.

## Safety, approvals, and failure

Private-by-default project/tenant isolation, encryption, signed access, temporary-workspace cleanup, access/audit controls, retention/erasure, and PII classification are mandatory. Reject unsupported/encrypted/corrupt/malicious files safely. Partial parsing cannot become `ANALYSIS READY`. Deletion follows governance; overwrite is forbidden. Destructive cleaning/exclusion and material mapping change require approval.

## Related documents

- [Dataset Model](../database/DATASET%20MODEL.md)
- [Data Preparation Engine](./DATA%20PREPARATION%20ENGINE.md)
- [Data-to-Analysis Workflow](../workflows/DATA%20TO%20ANALYSIS%20WORKFLOW.md)

