# Data Storage

## Purpose
Data Storage defines the deliberately separated storage systems the Research OS is built on, and which kind of data belongs in which store. It exists so that "where does this data live" has one clear answer per data shape — relational, binary file, cache/session, full-text-searchable, semantic/vector, or queued job — instead of modules improvising ad hoc storage choices that break the platform's operational and security guarantees.

## Scope
Covers the storage systems themselves (relational database, object storage, cache, search index, vector database, job queue) and the rule for which kind of data belongs in which. Does not cover the logical domain schema owned by each module (that is each module's own "Owned Data" section, e.g. Research Core owns `ResearchProject`'s shape, this document only says it lives in the relational database). Does not cover job execution semantics (that is [Background Jobs](./29%20BACKGROUND%20JOBS.md), which uses the Job Queue defined here).

## Responsibilities
- Define the six storage systems and the one job each is responsible for, so every module storing data picks the correct system by data shape, not by convenience.
- Own cross-cutting storage concerns: encryption at rest, signed-URL access to object storage, backup/restore applicability per store.
- Enforce that no module bypasses this separation — e.g. no binary file content stored as a blob column in the relational database, no durable source-of-truth data stored only in cache.
- Define which stores are authoritative (source of truth) versus derived/rebuildable (search index, cache, vector embeddings), so operational incidents involving a derived store are correctly triaged as lower severity than one involving an authoritative store.

## Non-Responsibilities
- Does not define per-module table/entity schemas — those are owned by each domain module (Research Core, Literature & Evidence, Publication Gateway, etc.) in their own "Owned Data" sections.
- Does not define job execution, retry, or worker isolation semantics — that is Background Jobs, which merely uses the Job Queue store defined here.
- Does not decide specific database vendor configuration, sizing, or infrastructure-as-code — that is an operations/deployment concern, not an architecture-documentation concern at this stage.
- Does not own credential/secret storage — that is Platform Core's secret vault, a distinct concern from general application data storage.

## Core Components
| System | Responsibility | Authoritative? |
|---|---|---|
| Relational Database (PostgreSQL) | Users, projects, references, and all core structured entities — the system of record | Yes — source of truth |
| Object Storage | PDFs, DOCX files, datasets, exports, converted files, submission-package assets | Yes — source of truth for binary content |
| Cache (Redis) | Response/session caching, session state, queue backing | No — derived/rebuildable, ephemeral |
| Search Index | Full-text search over the knowledge base, papers, and project content | No — derived from the relational database and object storage, rebuildable |
| Vector Database | Semantic search and RAG embeddings for the AI Gateway and internal engines | No — derived from source documents, rebuildable |
| Job Queue | Async task dispatch backing the Background Jobs layer | No — transient by design, not a durable record store |

## Owned Data
This document owns no domain entities itself. It owns the storage-system boundary definition (the table above) and the placement rule: every domain entity documented elsewhere states its home store implicitly by being of a given shape (structured record → relational DB; binary file → object storage; embedding → vector DB), and no module is permitted to relocate its data across this boundary without updating this document.

## Inputs
- Every domain module's data-shape decisions (what kind of entity it is creating) determine which store it targets.
- Backup/restore and encryption-at-rest policy requirements from platform-wide security posture.

## Outputs
- A clear placement rule every module consults when introducing a new entity: "is this structured, binary, cache, searchable text, embedding, or a queued task."
- Authoritative-vs-derived classification, consumed by incident response and observability tooling to correctly prioritize storage-layer failures.

## Dependencies
- Consumed by every domain module that persists data: [Platform Core](./01%20PLATFORM%20CORE.md), [Research Core](./02%20RESEARCH%20CORE.md), Publication Gateway, Submission Orchestration, and all others.
- [Background Jobs](./29%20BACKGROUND%20JOBS.md) depends on the Job Queue store defined here.
- Object Storage access is gated by Platform Core's authorization and signed-URL issuance.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 21.

## Extension Points
- A new storage shape (e.g. a future graph database for citation-network analysis) is added as a new row in the Core Components table with an explicit authoritative/derived classification before any module is allowed to depend on it.
- Derived stores (search index, vector database, cache) can be re-architected or swapped in implementation without touching the relational database's status as source of truth, as long as rebuild pipelines from the authoritative stores are kept correct.
- Multi-region or read-replica strategies for the relational database extend this document's operational detail without changing the module-facing placement rule.

## Security & Privacy
- Encryption at rest applies across all stores holding project or user data, consistent with platform-wide security baseline.
- Object Storage is accessed exclusively via signed URLs — no direct public bucket access, no permanent unauthenticated links to research files.
- Research project data is private by default (Core Contract #9) at the storage layer too: row-level and object-level access checks apply regardless of which store holds the data, not just at the API layer.
- Derived stores (search index, vector database) that index private project content must respect the same access boundaries as the source data — a search index must never make private content discoverable to a user who lacks access to the underlying project.

## Failure Modes
- **Authoritative store outage** (relational database or object storage down): treated as a P0 incident — direct user-facing outage, no workaround.
- **Derived store outage** (search index, vector database, or cache down): degraded functionality (search or semantic recall impaired) but core CRUD operations against authoritative stores continue — consistent with Core Contract #11's degraded-but-functional principle applied to internal infrastructure.
- **Store boundary violation** (a module storing binary content in the relational database, or durable state only in cache): treated as an architecture defect requiring correction, not a scaling decision to accommodate.

## Observability
- Per-store availability, latency, and error rate.
- Relational database connection pool saturation and slow-query rate.
- Object storage request volume and signed-URL issuance/expiry patterns.
- Search index and vector database freshness lag relative to the authoritative stores they're derived from.
- Cache hit/miss ratio and Job Queue depth/backlog.

## P0/P1/P2/P3
**P0.** Correct storage separation is foundational — every other module's data guarantees (privacy-by-default, source-of-truth integrity, backup/restore correctness) depend on data being placed in the right store from the start; retrofitting a boundary violation after real data exists is materially more costly than enforcing it from day one.

## Current Status
Documented, not implemented. No relational schema, object storage buckets, search index, vector database, or job queue exists yet; this document defines the intended storage boundary ahead of implementation.

## Open Questions
- Whether the vector database is a dedicated system or a PostgreSQL extension (e.g. pgvector) layered onto the existing relational database — an implementation decision deferred past this architecture phase.
- Backup/restore cadence and retention period per store, and whether derived stores are backed up at all given they are rebuildable from authoritative sources.
- Multi-tenant data residency requirements (e.g. institution-specific data locality needs) and whether they require store-level partitioning beyond row-level tenant isolation.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [Platform Core](./01%20PLATFORM%20CORE.md)
- [Background Jobs](./29%20BACKGROUND%20JOBS.md)
- [API Boundaries](./28%20API%20BOUNDARIES.md)
