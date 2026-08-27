# ENTITY RELATIONSHIPS

## Purpose
This document describes how the entities listed in `DOMAIN MODEL.md` relate to one another conceptually: which entity is the parent, which are children, what the cardinality is, and which relationships cross a module boundary (and therefore must go through the owning module's interface rather than a direct join). It exists so schema and API designers share one picture of the graph before any table is created.

## Scope
Covers: parent/child and cross-module relationships among the Section 24 entity families, expressed as cardinality statements and a small set of relationship diagrams. Does not cover field-level attributes of any entity (see the per-family schema documents) and does not cover foreign-key or join-table implementation — that is SQL design, explicitly out of scope for this folder.

## Responsibilities
- State the central-aggregate relationship: every project-scoped entity ultimately traces back to exactly one `ResearchProject` (Core Contract #1).
- State cardinality (one-to-one, one-to-many, many-to-many) for every meaningful relationship between entity families.
- Identify which relationships are "owned reference" (the referencing entity may read but not write the referenced entity, because it belongs to another module) versus "same-module" relationships.
- Distinguish project-private relationships (e.g. `PaperCollection` to `ResearchReference`) from shared-knowledge relationships (e.g. `ResearchReference` to `Author`, which is not project-scoped).

## Non-Responsibilities
- Does not enumerate individual fields on any entity.
- Does not define indexing, join strategy, or query performance considerations.
- Does not define API request/response shapes — those belong to each domain's own architecture document.
- Does not introduce a relationship that implies a direct dependency forbidden by the Core Contracts (e.g. no relationship here implies the frontend reading `IntegrationCredential` directly).

## Core Components

**Central Aggregate Relationships** — `ResearchProject` is the root. Direct children (one project has many of each): `ProjectContext` (conceptually one-to-one, though `ProjectContext` is itself an assembled view, see [03 PROJECT CONTEXT ENGINE.md](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md)), `ResearchStage`, `ResearchQuestion`, `ResearchObjective`, `Hypothesis`, `Methodology`, `Population`, `Sample`, `Instrument`, `Dataset`, `Analysis`, `AcademicDocument`, `AIConversation`, `PaperCollection`, `PublicationSubmission`. A `ResearchProject` belongs to exactly one `User` (owner) and optionally one `Organization` (for institutional projects), with sharing represented through a project-level membership/permission relationship, not a change of owner.

**Research Core Internal Relationships** — `ResearchQuestion` may relate to zero or more `Hypothesis` records. `Hypothesis` relates to one or more `Variable`. `Variable` may relate to one `Construct` and zero or more `Indicator`. `Methodology` relates to one `Population` and one `Sample` strategy, and to zero or more `Instrument` records. These are same-module relationships, all within Research Core.

**Literature & Evidence Relationships** — `ResearchReference` is not project-scoped; it is shared canonical knowledge (per Core Contract #6). A project links to a reference through `PaperCollection` (many-to-many join: one project has many collection entries, one reference can be collected by many projects). `PaperNote` and `PaperAttachment` are project-scoped children of a `PaperCollection` entry, not of `ResearchReference` directly — a note is "my note on this paper in this project," never a mutation of the shared canonical record. `ResearchReference` relates to many `Author` records (many-to-many, since a reference has multiple authors and an author has multiple works) and optionally one `Journal`.

**Dataset & Analysis Relationships** — `Dataset` belongs to one `ResearchProject` and has many `DatasetVariable` and many `DatasetVersion` (version history, see `DATA RETENTION VERSIONING.md`). `Analysis` belongs to one project and optionally references one `Dataset`. `Analysis` has many `AnalysisRun` (each run is one execution attempt), and each `AnalysisRun` produces one `AnalysisResult`.

**Writing & Citation Relationships** — `AcademicDocument` belongs to one project and has many `DocumentSection` and many `DocumentVersion`. A `FormattingPolicyPack` has immutable versions/rules/evidence and references an institution/unit/program or `PublicationDestination` without owning it. A `ResolvedFormattingProfile` pins applicable policy versions for one target context; compliance/render runs pin that profile and one document version, producing a derived output rather than modifying the source. `Citation` belongs to one `AcademicDocument` and references exactly one `ResearchReference` (owned-reference relationship, crossing into Literature & Evidence). `Bibliography` is derived from the set of `Citation` records in a document, not a separately populated entity.

**AI Relationships** — `AIConversation` belongs to one project (or, for non-project AI use such as onboarding help, may be project-less — see `AI DATA MODEL.md`). `AIConversation` has many `AIMessage`. Each `AIMessage` that triggers a model call has one `AIRequest` and one `AIResponse`. `AIRequest` references one `AIModel`, which belongs to one `AIProvider`. This is the one family where the relationship diagram matters most for cost tracing — see `AI DATA MODEL.md`.

**Integration Relationships** — `IntegrationConnection` belongs to one `User` or `Organization` and references one `IntegrationProvider`. `IntegrationCredential` belongs to exactly one `IntegrationConnection` (one-to-one). `IntegrationSync` belongs to one `IntegrationConnection` and has many sync-run records. `IntegrationHealth` is a one-to-one status record per `IntegrationProvider` (platform-wide, not per-connection) plus optionally a per-connection health rollup.

**Publication Relationships** — `PublicationSubmission` belongs to one project and references one `PublicationDestination`, plus zero or more `PublicationMatch` records that led to the submission being created. `PublicationStatus` is a status history entity with many-to-one to `PublicationSubmission`. `PublicationRecord` is the terminal record of an accepted/completed submission, one-to-one with `PublicationSubmission` where applicable. `PublicationRequirement` and `PublicationIndexing` belong to `PublicationDestination`, not to any project (shared reference data).

**Cross-Module Owned References** — the following relationships cross a module boundary and must be treated as read-only references from the non-owning side, never a join that lets one module write another's table: `Citation` to `ResearchReference`; `AnalysisRun` to `AIConversation` (when AI assisted an analysis); formatting policy target to Platform/Institution organization or Publication Gateway `PublicationDestination`; render/import source/output to Research File Tools `FileAsset`; `PublicationSubmission` to `AcademicDocument`; `Dataset`/`AcademicDocument`/`AIConversation`/`PaperCollection` all to `ResearchProject`.

## Owned Data
This document owns no entities. It is a conceptual relationship map layered over entities owned by the modules described in `DOMAIN MODEL.md` and [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).

## Inputs
- The entity list in `DOMAIN MODEL.md`.
- Each domain module's own architecture document, for the relationships that module's owners consider authoritative.

## Outputs
- A relationship reference used when designing any join, API response shape, or cascade-delete rule.
- The list of cross-module owned references used by `DATA RETENTION VERSIONING.md` to determine cascade-delete scope when a `ResearchProject` is deleted.

## Dependencies
- [DOMAIN MODEL.md](DOMAIN%20MODEL.md) — the entity list this document relates.
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) — the ownership map that determines which side of a cross-module relationship is authoritative.
- [03 PROJECT CONTEXT ENGINE.md](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md) — for how `ProjectContext` is assembled from other project entities rather than being a simple child row.

## Extension Points
- A new entity family must state its relationship to `ResearchProject` (direct child, indirect via another entity, or project-less shared knowledge) before it is added to this document.
- A new cross-module relationship must be added to the "Cross-Module Owned References" list explicitly; an undocumented cross-module join is treated as a governance gap, not a valid pattern.

## Security & Privacy
- Cross-module owned references must respect the owning module's access control; e.g. a `Citation`-to-`ResearchReference` read does not bypass whatever visibility rules apply to the citing project.
- Many-to-many relationships that touch shared knowledge (`ResearchReference` to `Author`/`Journal`, or to multiple projects via `PaperCollection`) must never leak one project's association to another project — the join table (`PaperCollection`) is project-scoped and private even though the referenced `ResearchReference` is shared.
- Relationships into `IntegrationCredential` are always one-to-one and never fanned out or cached elsewhere, consistent with the credential-handling rule in [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).

## Failure Modes
- **Accidental fan-out privacy leak**: treating `PaperCollection` as if it belonged to `ResearchReference` rather than to the project could let one project's notes/attachments become visible through another project's reference lookup. Mitigated by keeping `PaperNote`/`PaperAttachment` scoped to the `PaperCollection` entry, never to the shared `ResearchReference` directly.
- **Missing cascade on project deletion**: a direct-child relationship is omitted from this document, so the deletion procedure in `DATA RETENTION VERSIONING.md` misses it and leaves an orphaned record. Mitigated by treating this document as the checklist source for that procedure.
- **Cross-module write via join**: an implementation detail lets one module write directly into another module's table through a shared join, violating module boundaries (Core Contract #10's monolith-with-boundaries premise). Mitigated by this document's explicit "read-only from the non-owning side" rule.

## Observability
Not directly observable at runtime; this is a static design reference. Its consistency with the actual data access patterns would, once implementation begins, be checked by code review against module boundaries and by the ownership-map drift check described in [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).

## P0/P1/P2/P3
**P0.** The central-aggregate relationship (everything traces to `ResearchProject`) and the canonical-reference relationship (`Citation`/`PaperCollection` to `ResearchReference`) are foundational — they encode Core Contracts #1 and #6 directly, and every other module's schema design depends on getting this shape right before any table exists.

## Current Status
Documented, not implemented. No schema, foreign key, or join table exists. This document is the conceptual relationship map only.

## Open Questions
- Whether `ProjectContext` should be modeled as a genuine one-to-one child row or purely as a materialized/on-demand assembly with no dedicated storage of its own — flagged as ADR item 3 in [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 34, unresolved here too.
- Whether `AnalysisRun` should retain a hard reference to the `AIConversation` that assisted it, or only a soft provenance note — affects how AI-assisted analysis is traced for academic-integrity logging (Section 26).
- Whether `ResearchGraph` (Section 13) introduces new relationship types (e.g. citation-network edges between `ResearchReference` records) that belong in this document or in a dedicated future document.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 24 entity list and Section 13 (Research Graph) for graph-shaped relationships.
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) — ownership map that determines relationship authority.
- [DOMAIN MODEL.md](DOMAIN%20MODEL.md) — the entity list this document relates.
- [RESEARCH DIGITAL TWIN MODEL.md](RESEARCH%20DIGITAL%20TWIN%20MODEL.md), [10 LITERATURE EVIDENCE.md](../architecture/10%20LITERATURE%20EVIDENCE.md) — field-level detail for the two families with the richest relationship graph.
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) — how these relationships determine cascade-delete and versioning scope.
