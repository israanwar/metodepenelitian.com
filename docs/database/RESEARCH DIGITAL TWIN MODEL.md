# Research Digital Twin Model

**Status:** P0 conceptual domain model — no SQL, migration, physical schema, or storage choice

## Aggregate boundary

`ResearchProject` remains the aggregate root and authorization boundary. `ResearchDigitalTwin` is the canonical versioned research-state graph for exactly one project. No agent, AI provider, integration, or frontend owns a parallel canonical copy.

```text
ResearchProject 1 ── 1 ResearchDigitalTwin
ResearchDigitalTwin 1 ── * ResearchEntity
ResearchDigitalTwin 1 ── * ResearchRelationship
ResearchDigitalTwin 1 ── * ResearchDependency
ResearchDigitalTwin 1 ── * ResearchState
ResearchDigitalTwin 1 ── * ResearchChange
ResearchDigitalTwin 1 ── * ResearchExecutionRun
```

## Core entities

### ResearchDigitalTwin

Identity and head state for one project's living graph: `twin_id`, `project_id`, `current_version`, `status`, policy/schema version, created/updated timestamps, and last compiler/context projection references. Project id is unique and immutable.

### ResearchEntity

Versioned envelope for Topic, Phenomenon, Problem, ResearchQuestion, Objective, Contribution, Literature, Evidence, ResearchGap, Theory, Construct, Variable, Indicator, Hypothesis, ConceptualFramework, Methodology, Population, Sampling, Sample, Instrument, DataCollection, Dataset, AnalysisPlan, AnalysisRun, Result, Finding, Discussion, Document, Citation, Reference, PublicationTarget, Submission, and PublicationRecord.

Conceptual fields: `entity_id`, `project_id`, `entity_type`, immutable version/content reference, lifecycle status, origin/provenance, parent/scope reference, valid-from/to twin versions, creator, timestamps, sensitivity/access classification, and verification summary. Type-specific content may be modeled separately later; it must retain this common identity/provenance contract.

### ResearchRelationship

Typed semantic edge: `relationship_id`, project id, source/target entity ids and versions, type (`DEFINES`, `ADDRESSES`, `OPERATIONALIZES`, `MEASURES`, `TESTS`, `SUPPORTED_BY`, `CONTRADICTED_BY`, `DERIVED_FROM`, `USES`, `PRODUCES`, `CITES`, `TARGETS`), rationale, provenance, status, validity interval, creator, timestamps.

### ResearchDependency

Operational change-impact edge distinct from a semantic relationship: source/target, triggering change/event classes, propagation action (`INVALIDATE`, `REVIEW`, `RECOMPUTE`, `BLOCK`, `NOTIFY`), criticality, rule/policy version, condition, and lifecycle metadata.

### ResearchState

Time-bounded state assertion for an entity, relationship, stage, or workspace projection: subject reference, state type/value, reason, evidence/validation references, effective twin version, superseding-state reference, actor, timestamps. State history is append-only.

### ResearchChange

Immutable mutation ledger: change id, command/event/correlation ids, expected and resulting twin versions, actor/origin, rationale, before/after content references, affected entities, dependency-impact summary, approval references, compiler request/result references, timestamps.

## Provenance and status

Origin facts include `USER PROVIDED` and `AI GENERATED`; authority facts include `APPROVED` and `PUBLISHED`. Lifecycle/validation values include `PROPOSED`, `IN PROGRESS`, `SOURCE VERIFIED`, `EVIDENCE VERIFIED`, `METHODOLOGICALLY VERIFIED`, `ANALYSIS VERIFIED`, `PASS`, `LOCKED`, `BLOCKED`, and `DEPRECATED`. Verification is never inferred from user origin, model confidence, or a generic `verified` boolean.

A verification state references verifier type/id, evidence, method/rule/run, timestamp, and twin/entity version. Initial user content is `PROPOSED`.

## Evidence/claim entities

### EvidenceClaim

Represents a scoped major claim independently from mutable manuscript prose: claim id/type, immutable content reference, scope/conditions, origin, current status, RDT version, author/agent provenance, uncertainty/limitations, timestamps.

### ClaimEvidenceLink

Links a claim to paper/evidence with support direction (`SUPPORTED_BY`, `CONTRADICTED_BY`, `LIMITED_BY`), source location, rationale, evidence strength/quality, verification record, source state, and validity interval.

### ClaimAnalysisLink

Links a claim to a dataset version, analysis-plan version, analysis run, result/finding, derivation description, applicable population/scope, and analysis verification.

### ClaimCitationLink

Links a claim/manuscript location to citation/reference versions and DOI/metadata verification. Citation presence alone does not equal evidentiary support.

## Execution entities

### ResearchExecutionStep

Definition/instance of one of the 27 official steps: step key/order, purpose, input/output contracts, required capabilities, validation/gate policy, current RDT objects, and next-state rules. Definitions are versioned; project instances reference the definition version.

### ResearchExecutionRun

One attempt of a step against a pinned twin version: run id, step, project/twin version, initiator/orchestrator, input/output references, agent/tool/integration executions, started/completed timestamps, status, failure/recovery information, approval and compiler references.

### ResearchExecutionStatus

Append-only transition record such as `PROPOSED`, `IN PROGRESS`, `PASS`, `BLOCKED`, or `DEPRECATED`, with reason, actor, effective time, previous state, prerequisites, and next-state eligibility. Frontend status is derived from these records plus current RDT/Compiler state.

## Candidate entities

### CandidateResearchTopic

Project-scoped candidate preserving original title/input, normalized proposal, origin, assumptions, current lifecycle status, and selection decision. Selection does not verify its gap/method.

### CandidateEvaluation

Per candidate, dimension, evaluator and evaluation-version record for Evidence Availability, Novelty, Research Gap Strength, Methodological Feasibility, Data Feasibility, Sample Feasibility, Analysis Fit, Academic Contribution, Publication Potential, and Execution Risk. Stores score/value only with rationale, evidence references, confidence, assumptions, coverage, timestamp, and status. Unsupported dimensions are `UNKNOWN`.

## Invariants

- All nodes/edges/runs are project-scoped and may reference only authorized objects from that project, except immutable external-source identifiers represented through approved references.
- `current_version` advances atomically with its `ResearchChange`; expected-version mismatch fails.
- Historical versions and provenance cannot be overwritten by an update.
- A relationship/dependency cannot point to a nonexistent or future version.
- Dependency cycles are rejected or explicitly modeled as review-only groups; propagation cannot recurse indefinitely.
- A protected change requires a valid approval tied to the proposed patch and expected version.
- Dataset, analysis, instrument, manuscript, and publication records are version-referenced; “final” is state, not a mutable blob.
- Deleting/retaining project data follows ResearchProject and data-governance policy, including dependent snapshots and audit evidence.

## Conceptual access patterns

- Load current authorized project graph or a historical snapshot.
- Trace entity provenance and every change from initial proposal to publication.
- Traverse downstream impact of one entity/version change.
- Trace a major claim to evidence, dataset, analysis, method, citation, and manuscript location.
- Derive workspace stage/status and unresolved approval requirements.
- Reconstruct inputs seen by an agent/model/compiler run.

Physical indexes, graph/relational storage choice, partitions, and retention implementation are deferred to ADRs.

## Related documents

- [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md)
- [Research Digital Twin Engine](../internal-engines/RESEARCH%20DIGITAL%20TWIN%20ENGINE.md)
- [Research Consistency Model](./RESEARCH%20CONSISTENCY%20MODEL.md)
- [Domain Model](./DOMAIN%20MODEL.md)

