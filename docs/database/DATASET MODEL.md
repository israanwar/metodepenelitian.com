# Dataset Model

**Status:** LOCKED P0 conceptual model — no SQL, migration, parser, or storage implementation

## Ownership

Dataset & Analysis owns canonical project-scoped dataset metadata and lineage. `ResearchProject` is aggregate/authorization root; Research Digital Twin references current and historical dataset entities. Object Storage owns bytes, while Dataset records own their identity, classification, checksums, and relationships.

## Entities

### Dataset

Logical dataset identity: dataset id, project id, name/purpose, source/origin, owner, current version, privacy/PII/consent classification, access policy, lifecycle status, timestamps, and retention/deletion references.

### DatasetVersion

Immutable version: version id/number/state (`RAW`, `CLEANED`, `CODED`, `ANALYSIS READY`), parent version, storage/file reference, checksum, format capability/version, schema/profile versions, row/column counts, encoding/locale, transformation run, provenance, actor/time, validation status, and supersession/deletion metadata. Version 1 raw bytes cannot be overwritten.

### DatasetVariable

Column identity within a version lineage: variable id, stable lineage key, source name/label, canonical name, inferred/declared type, role, measurement scale, value labels, missing-value codes, units, allowed range/categories, sensitivity, derivation, profile statistics, inference confidence, and version validity.

### DatasetProfile

Pinned profiling run/result containing parser/profile engine versions, schema, missingness, duplicate candidates, outlier/anomaly candidates, descriptive summaries, warnings/errors, coverage, generated timestamp, and validation state. Detection does not authorize transformation/exclusion.

### DatasetVariableMapping

Link from DatasetVariable/version to RDT Variable/Indicator/version: status `UNMAPPED`, `MAPPED`, `AMBIGUOUS`, `MISSING`, or `INVALID`; mapping kind, rationale/signals, confidence/assumptions, proposer, reviewer/approval, validity interval, and supersession.

### DataTransformation and TransformationRun

Versioned operation/plan and its execution: operation, parameters, ordered position, input/output dataset versions, implementation/environment version, timestamp, actor, reason, affected variables/row-count summary, approval, warnings/errors, checksums, and replay/reproducibility result.

### DatasetLineageLink

Typed parent/derivation/reference relationship among dataset/source versions, transformations, mappings, and analysis runs, with project boundary, rationale, provenance, validity, and audit metadata.

### DatasetFormatCapability

Registry entry for CSV/XLSX/TSV/JSON/SAV/DTA/RData/RDS/Parquet or future formats: format id, extensions/signatures, parser/version, limits, supported operations, security rules, validation evidence/date, and status `PLANNED`, `AVAILABLE`, `LIMITED`, `BLOCKED`, or `DEPRECATED`.

## Invariants

- All records are project/tenant scoped; cross-project mapping/lineage is rejected.
- Original file and raw DatasetVersion are immutable and checksum-addressed.
- A transformation always creates a new version; failed/partial runs cannot become current.
- `ANALYSIS READY` requires mapping, preparation, privacy, and schema validation evidence.
- Ambiguous mapping cannot become `MAPPED` without review when it changes analysis meaning.
- Dataset deletion/retention follows consent and governance, with audit proof; it is not implemented as overwrite.
- Raw rows are not included in Project Context or sent to AI by default.

## Conceptual access patterns

Load authorized current/historical version; trace raw→derived lineage; inspect profile/mapping issues; reproduce a preparation run; find analyses/documents invalidated by a new version; export/delete according to policy.

## Related documents

- [Dataset Engine](../internal-engines/DATASET%20ENGINE.md)
- [Data Preparation Engine](../internal-engines/DATA%20PREPARATION%20ENGINE.md)
- [Research Digital Twin Model](./RESEARCH%20DIGITAL%20TWIN%20MODEL.md)

