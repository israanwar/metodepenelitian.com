# DOMAIN MODEL

## Purpose
This document is the entry point to the `database/` tree. It restates the full entity list from [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 24 as a single conceptual map, grouped by domain family, and points to the document in this folder that elaborates each family. It exists so a reader can find "which document describes entity X" without re-deriving the domain boundaries each time.

## Scope
Covers: the complete entity family list, the domain module that owns each family, and cross-references into the more detailed documents in this folder (`ENTITY RELATIONSHIPS.md`, `RESEARCH PROJECT SCHEMA.md`, `RESEARCH REFERENCE SCHEMA.md`, `AI DATA MODEL.md`, `PUBLICATION DATA MODEL.md`, `INTEGRATION DATA MODEL.md`, `EVENT DATA MODEL.md`, `SEARCH INDEX MODEL.md`, `VECTOR DATA MODEL.md`, `DATA RETENTION VERSIONING.md`). Does not restate field-level detail — that lives in the per-family documents. Does not define SQL DDL, column types, or migrations.

## Responsibilities
- Enumerate every entity family from Section 24 in one place, unmodified from the source list.
- Assign each family to its owning domain module, consistent with [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)'s ownership map.
- Point each family to the `database/` document (if any) that elaborates it further.
- Flag which entities are the central aggregate (`ResearchProject`, Core Contract #1) versus supporting entities that hang off it.

## Non-Responsibilities
- Does not define relationships/cardinality between entities — that is `ENTITY RELATIONSHIPS.md`.
- Does not define field-level detail for `ResearchProject` or its direct children — that is `RESEARCH PROJECT SCHEMA.md`.
- Does not define the canonical scholarly model — that is `RESEARCH REFERENCE SCHEMA.md`.
- Does not define retention or versioning policy — that is `DATA RETENTION VERSIONING.md`.
- Does not introduce any entity not already present in Section 24's list.

## Core Components

**Platform Core** — `User`, `UserProfile`, `Role`, `Permission`, `Organization`, `OrganizationMember`. Owned by Identity & Access ([01 PLATFORM CORE.md](../architecture/01%20PLATFORM%20CORE.md)).

**Research Core** — `ResearchProject` (central aggregate, Core Contract #1), `ProjectContext`, `ResearchStage`, `ResearchQuestion`, `ResearchObjective`, `Hypothesis`, `Variable`, `Construct`, `Indicator`, `Methodology`, `Population`, `Sample`, `Instrument`. Owned by Research Core / Project Context Engine ([02 RESEARCH CORE.md](../architecture/02%20RESEARCH%20CORE.md), [03 PROJECT CONTEXT ENGINE.md](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md)). Elaborated in `RESEARCH PROJECT SCHEMA.md`.

**Literature & Evidence** — `ResearchReference`, `Author`, `Journal`, `PaperCollection`, `PaperNote`, `PaperAttachment`. Owned by Literature & Evidence ([10 LITERATURE EVIDENCE.md](../architecture/10%20LITERATURE%20EVIDENCE.md)). Elaborated in `RESEARCH REFERENCE SCHEMA.md`.

**Dataset & Analysis** — `Dataset`, `DatasetVariable`, `DatasetVersion`, `Analysis`, `AnalysisRun`, `AnalysisResult`. Owned by Dataset & Analysis ([17 DATASET ANALYSIS.md](../architecture/17%20DATASET%20ANALYSIS.md)). Project-scoped; not separately elaborated in this batch beyond `RESEARCH PROJECT SCHEMA.md`'s relationship notes.

**Writing & Citation** — `AcademicDocument`, document/section versions, formatting policy/rule/evidence/resolution/compliance/render records, `Citation`, and `Bibliography`. Owned by Writing & Citation ([19 WRITING CITATION.md](../architecture/19%20WRITING%20CITATION.md)); formatting detail is elaborated in [FORMATTING POLICY MODEL.md](FORMATTING%20POLICY%20MODEL.md).

**AI** — `AIProvider`, `AIModel`, `AIModelCapability`, `AIRequest`, `AIResponse`, `AIUsage`, `AIRoutingPolicy`, `AIConversation`, `AIMessage`. Owned by Multi-Model AI Gateway ([05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md)). Elaborated in `AI DATA MODEL.md`.

**Integrations** — `IntegrationProvider`, `IntegrationConnection`, `IntegrationCredential`, `IntegrationSync`, `IntegrationHealth`. Owned by Integration Gateway ([25 INTEGRATION GATEWAY.md](../architecture/25%20INTEGRATION%20GATEWAY.md)). Elaborated in `INTEGRATION DATA MODEL.md`.

**Publication** — `PublicationDestination`, `PublicationIndexing`, `PublicationRequirement`, `PublicationMatch`, `PublicationSubmission`, `PublicationStatus`, `PublicationRecord`. Owned by Publication Gateway ([21 PUBLICATION GATEWAY.md](../architecture/21%20PUBLICATION%20GATEWAY.md)). Elaborated in `PUBLICATION DATA MODEL.md`.

**Files** — `FileAsset`, `ConversionJob`. Owned by Research File Tools ([20 RESEARCH FILE TOOLS.md](../architecture/20%20RESEARCH%20FILE%20TOOLS.md)).

**Platform Utility** — `Notification`, `Subscription`, `Plan`, `Entitlement`, `UsageRecord`, `Invoice`. Owned by Billing & Entitlements ([33 BILLING ENTITLEMENTS.md](../architecture/33%20BILLING%20ENTITLEMENTS.md)) and Notification Engine ([31 NOTIFICATION ENGINE.md](../architecture/31%20NOTIFICATION%20ENGINE.md)).

**Governance** — `AuditLog`, `FeatureFlag`. Owned by Admin Governance ([35 ADMIN GOVERNANCE.md](../architecture/35%20ADMIN%20GOVERNANCE.md)).

**Derived stores not in Section 24's list but required by this folder** — search index documents (`SEARCH INDEX MODEL.md`) and vector embeddings (`VECTOR DATA MODEL.md`) are derived projections of the entities above, not new system-of-record entities; they are covered separately because they live in different storage technology, not because they add new ownership.

## Owned Data
This document owns no entities itself. It is a navigational map over entities owned by the modules listed above, consistent with [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)'s ownership table.

## Inputs
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 24, the authoritative entity list this document restates.
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)'s ownership map, which this document must stay consistent with.

## Outputs
- A single navigation surface used by engineers and by the other `database/` documents to confirm they have not invented an entity outside Section 24's list.
- The grouping used as the table of contents for the rest of this folder.

## Dependencies
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 24 — source of truth for the entity list.
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) — source of truth for ownership assignment.
- Every `architecture/` document named above — each owns the behavior around the entities it is credited with here.

## Extension Points
- A new entity family may only be added here after it is first added to Section 24's list in the master document; this document never introduces an entity ahead of that source of truth.
- New derived stores (e.g. a future graph database projection for `ResearchGraph`) are added as a new subsection here plus a new sibling document in this folder, following the same pattern as `SEARCH INDEX MODEL.md` and `VECTOR DATA MODEL.md`.

## Security & Privacy
- This document carries no field-level detail, so it introduces no direct privacy surface; privacy classification is defined per entity in [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) and in the per-family documents.
- The grouping itself must not be used to infer sensitivity — e.g. "Platform Utility" contains `Invoice`, which is sensitive billing data despite the generic-sounding family name; see `DATA RETENTION VERSIONING.md` for the actual classification.

## Failure Modes
- **Drift from Section 24**: a `database/` document elaborates an entity that has since been renamed or removed from Section 24, and this map is not updated to match. Mitigated by treating this document as the first thing to check/update whenever Section 24 changes.
- **Orphaned entity**: an entity appears in Section 24 but no `database/` document elaborates it and no owning module is listed here. Mitigated by requiring every future entity addition to update both this document and [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) in the same change.

## Observability
Not directly observable at runtime — this is a static reference document, not a running component. Its accuracy is checked by periodic manual review against Section 24, not by an automated metric, at this architecture-only stage.

## P0/P1/P2/P3
**P0.** Every P0 domain module (Research Core, AI Gateway, Integration Gateway, Literature & Evidence, Files) depends on entities enumerated here; an accurate domain map is a prerequisite for any schema work at any priority tier, so this document itself is foundational even though many of the entities it lists (e.g. Publication, P2 statistical depth) are lower priority individually.

## Current Status
Documented, not implemented. No database schema exists. This document is a conceptual map only, restating Section 24 with cross-references added.

## Open Questions
- Whether `ResearchGraph` (Section 13 of the backend architecture) needs its own entity family in Section 24 and a corresponding elaboration document once graph storage is designed — not yet decided.
- Whether `Dataset & Analysis` warrants its own dedicated schema document in a future batch, given its statistical-computing complexity — deferred; currently covered only at the level of `RESEARCH PROJECT SCHEMA.md`'s relationship notes.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 24 is this document's source list.
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) — ownership map this document must stay consistent with.
- [ENTITY RELATIONSHIPS.md](ENTITY%20RELATIONSHIPS.md) — relationships and cardinality between the entities listed here.
- [RESEARCH DIGITAL TWIN MODEL.md](RESEARCH%20DIGITAL%20TWIN%20MODEL.md) — field-level detail for the Research Core family.
- [10 LITERATURE EVIDENCE.md](../architecture/10%20LITERATURE%20EVIDENCE.md) — field-level detail for the Literature & Evidence family.
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md), [21 PUBLICATION GATEWAY.md](../architecture/21%20PUBLICATION%20GATEWAY.md), [25 INTEGRATION GATEWAY.md](../architecture/25%20INTEGRATION%20GATEWAY.md) — field-level detail for their respective families.
