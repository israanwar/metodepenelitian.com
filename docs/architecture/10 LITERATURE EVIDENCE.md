# Literature & Evidence

## Purpose
Literature & Evidence owns the canonical scholarly-reference model, `ResearchReference`, and is the sole module responsible for turning scholarly data from any external source into that one internal, normalized shape (Core Contract #6). It exists so that no other module — Research Core, Knowledge Search, Semantic Search/RAG, or an internal engine — ever has to know or care whether a given reference originated from one provider's metadata format versus another's; everything downstream sees the same `ResearchReference` shape regardless of origin.

## Scope
Covers ingestion, normalization, deduplication, provenance tracking, and per-project library organization of scholarly references. Does not cover the actual retrieval mechanics of keyword or semantic search over that content (those are [Knowledge Search](./08%20KNOWLEDGE%20SEARCH.md) and [Semantic Search / RAG](./09%20SEMANTIC%20SEARCH%20RAG.md), both of which consume this module's canonical output) and does not cover routing a finished manuscript to a publisher (that is the Publication Gateway, a distinct downstream module, and Core Contract #7 explicitly forbids that module from acting as a publisher itself).

## Responsibilities
- Define and own the canonical `ResearchReference` schema: the one internal shape every scholarly record is normalized into regardless of source.
- Ingest scholarly metadata from external providers exclusively through the Integration Gateway (Core Contract #4) — no direct-to-provider calls originate here or anywhere else.
- Normalize provider-specific metadata formats into `ResearchReference`, resolving field-mapping differences (e.g. differing author-name formats, differing venue/identifier conventions) inside this module so no such variance leaks outward (Core Contract #12 applied to scholarly data specifically).
- Deduplicate references that represent the same underlying work but arrived from different providers or were added independently by different users/projects.
- Track provenance per reference: which provider(s) supplied it, when, and under what confidence/completeness.
- Organize references into per-project libraries, attached to a `ResearchProject` via reference, with personal annotations/tags kept private to the annotating user unless explicitly shared.
- Track licensing/rights status per reference sufficient to inform downstream modules (notably Semantic Search/RAG) what content, if any, may be used beyond bibliographic metadata (e.g. abstract-only vs. full-text-eligible).

## Non-Responsibilities
- Does not implement search/retrieval itself — it produces the canonical data that Knowledge Search and Semantic Search/RAG index and query.
- Does not call any scholarly-data provider directly — every ingestion path goes through the Integration Gateway's adapters.
- Does not submit or publish anything to any journal/repository — that is explicitly out of scope and belongs to the Publication Gateway, which is a router only (Core Contract #7).
- Does not claim or imply direct-submission or partnership relationships with any specific scholarly index or database; this document makes no claim of such a relationship existing.

## Core Components
- **Ingestion Coordinator** — receives normalized-but-provider-shaped metadata from Integration Gateway adapters and hands it to the Normalizer.
- **Normalizer** — maps provider-specific fields into the canonical `ResearchReference` schema.
- **Deduplication Engine** — identifies and merges records representing the same work across providers/users, preserving provenance from each contributing source.
- **Provenance Tracker** — per-reference record of source provider(s), ingestion timestamp, and confidence.
- **Rights/License Tracker** — per-reference status of what content beyond bibliographic metadata is legitimately usable downstream.
- **Project Library Service** — attaches references to projects, manages personal annotations/tags/notes scoped privately per user.

## Owned Data
| Entity | Notes |
|---|---|
| ResearchReference | the canonical scholarly-record model; central output of this module |
| ReferenceProvenance | per-reference source-provider history |
| ReferenceRightsStatus | licensing/full-text-eligibility status |
| ProjectLibraryEntry | reference-to-project attachment |
| ReferenceAnnotation | private user notes/tags on a reference |

## Inputs
- Provider-shaped scholarly metadata delivered via the Integration Gateway's adapters (specific providers are an integration/partnership decision tracked in [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md); none should be assumed committed from this document).
- User-initiated manual reference entry/import (e.g. pasting a citation or uploading a file) from the frontend.
- Deduplication/merge decisions, where ambiguous, surfaced to a user for confirmation rather than auto-merged silently.

## Outputs
- The canonical `ResearchReference` record set, consumed by Knowledge Search, Semantic Search/RAG, Research Core (via project library attachment), and the AI Tool Calling Engine.
- Provenance and rights metadata consumed by Semantic Search/RAG to decide full-text embedding eligibility.
- Project library views consumed by the frontend.

## Dependencies
- Integration Gateway for all external scholarly-data ingestion (Core Contract #4); see [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md).
- [Research Core](./02%20RESEARCH%20CORE.md) as the aggregate that project libraries attach to.
- Consumed by [Knowledge Search](./08%20KNOWLEDGE%20SEARCH.md) and [Semantic Search / RAG](./09%20SEMANTIC%20SEARCH%20RAG.md), both of which depend on this module rather than the reverse.
- See [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) for canonical-model governance and [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) for how citation grounding downstream depends on this module's provenance quality.

## Extension Points
- New scholarly-data providers are added by building a new Integration Gateway adapter plus a corresponding Normalizer mapping — no change to the canonical schema's consumers is required.
- The canonical `ResearchReference` schema can be extended with new fields as new provider metadata types are encountered, following standard schema-evolution/versioning practice for the module.
- Deduplication heuristics can be improved independently of ingestion, since they operate purely on already-normalized canonical records.

## Security & Privacy
- Personal annotations/tags on a reference are private by default and scoped to the annotating user, distinct from the (typically public) bibliographic metadata of the reference itself (Core Contract #9 applied at the annotation layer, not the public-metadata layer).
- Rights/license tracking exists specifically to prevent downstream modules (especially Semantic Search/RAG's full-text embedding) from processing content the platform is not entitled to use — this module is the enforcement point for that boundary, and where a source's rights status is unclear it must be recorded and treated as not full-text-eligible rather than assumed permissive.
- Provenance data is retained for traceability/audit even after deduplication merges, so a reference's origin remains reconstructable.

## Failure Modes
- Integration Gateway adapter failure for a given provider: ingestion for that provider degrades or pauses; other providers and manual entry remain unaffected, and previously ingested references are unaffected (Core Contract #11's spirit applied to data ingestion).
- Deduplication false-positive (two distinct works merged): treated as a correctness bug requiring an un-merge path, since it would corrupt provenance and downstream citation accuracy.
- Normalization gap (a provider field with no canonical mapping yet): captured as an unmapped/raw field pending schema extension rather than silently dropped, so no data is lost even before a mapping exists.

## Observability
- Ingestion volume and failure rate per provider adapter.
- Deduplication merge rate and (where surfaced) user-reported merge-correction rate.
- Canonical schema coverage (percentage of ingested fields successfully mapped vs. held as unmapped raw data).
- Rights-status distribution (how much of the library is full-text-eligible vs. metadata-only).

## P0/P1/P2/P3
**P0.** The canonical `ResearchReference` model is a direct core contract (#6) and every literature-dependent capability — Knowledge Search, Semantic Search/RAG, Evidence Synthesis, citation grounding — depends on this module existing and being correct. Foundational and required for safe core operation of the literature/evidence layer.

## Current Status
Documented, not implemented. No canonical schema, ingestion pipeline, or deduplication logic exists yet; this document defines the intended module boundary ahead of implementation. No specific scholarly-data provider integration, partnership, or direct-submission capability should be assumed as committed from this document.

## Open Questions
- Which scholarly-data providers are integrated first, and in what priority order (UNKNOWN — an integration/partnership decision tracked separately, not decided here).
- Exact deduplication matching strategy (identifier-based vs. fuzzy title/author matching vs. both) is not yet designed.
- How rights/license status is determined per provider where the provider's own licensing terms are themselves ambiguous or require legal review (REQUIRES VERIFICATION on a per-provider basis, not resolved by this document).

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [Research Core](./02%20RESEARCH%20CORE.md)
- [Knowledge Search](./08%20KNOWLEDGE%20SEARCH.md)
- [Semantic Search / RAG](./09%20SEMANTIC%20SEARCH%20RAG.md)
