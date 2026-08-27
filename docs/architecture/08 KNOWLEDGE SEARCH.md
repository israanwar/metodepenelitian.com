# Knowledge Search

## Purpose
Knowledge Search is the keyword/structured search layer over the platform's own internal knowledge: canonicalized `ResearchReference` records, methodology reference material, and other platform-owned reference content. It exists to answer precise, filterable lookups (author, year, keyword, methodology type) quickly and deterministically, as distinct from the meaning-based retrieval that [Semantic Search / RAG](./09%20SEMANTIC%20SEARCH%20RAG.md) provides.

## Scope
Covers indexing and query-serving for structured/keyword search over internally-held reference data. Does not cover fetching or normalizing scholarly records from external providers (that is [Literature & Evidence](./10%20LITERATURE%20EVIDENCE.md), which produces the canonical `ResearchReference` records this module indexes) and does not cover embedding-based semantic retrieval (that is Semantic Search/RAG). Knowledge Search only ever operates over data already inside the platform's canonical model — it never queries an external provider itself.

## Responsibilities
- Maintain a keyword/structured search index over `ResearchReference` records and other internal reference content (methodology definitions, platform help content used by AI tools).
- Serve fast, filterable queries (by author, year, publication type, field, keyword) to both the frontend (library search UI) and to the AI Tool Calling Engine (as a callable tool for precise lookups during an AI conversation).
- Keep the index synchronized with the canonical data as `ResearchReference` records are added/updated by Literature & Evidence.
- Rank/sort results by structured relevance signals (recency, citation count where available, exact-match strength) distinct from semantic similarity ranking.

## Non-Responsibilities
- Does not perform meaning-based/embedding search — a query for "studies about student motivation" without those exact keywords is Semantic Search/RAG's job, not this module's.
- Does not fetch anything from an external scholarly database directly — it only indexes what Literature & Evidence has already normalized into the canonical model (Core Contract #6).
- Does not decide relevance for AI reasoning purposes (e.g. which sources best support a claim) — that judgment belongs to the Evidence Synthesis engine, which may call this module as one input among several.
- Does not own the source-of-truth reference data — it owns only the derived search index.

## Core Components
- **Index Builder** — builds and maintains the keyword/structured index from canonical reference data, triggered by Literature & Evidence's write events.
- **Query Service** — serves filterable, ranked keyword queries against the index.
- **Reindex Job** — async background job (Core Contract #8) that rebuilds or repairs the index when drift is detected or schema changes.
- **Tool Binding** — the registration that exposes Query Service as a callable tool via the AI Tool Calling Engine.

## Owned Data
| Entity | Notes |
|---|---|
| KnowledgeSearchIndex | derived keyword/structured index, not source-of-truth |
| IndexSyncCursor | tracks how current the index is relative to canonical reference data |

## Inputs
- `ResearchReference` create/update/delete events from Literature & Evidence.
- Keyword/filter queries from the frontend library search UI.
- Tool-call queries from the AI Tool Calling Engine on behalf of an internal engine.

## Outputs
- Ranked, filtered result sets returned to the querying caller (frontend or tool caller).
- Index health/sync-lag signals for observability.

## Dependencies
- [Literature & Evidence](./10%20LITERATURE%20EVIDENCE.md) as the sole source of the canonical data this module indexes (Core Contract #6).
- [AI Tool Calling Engine](./06%20AI%20TOOL%20CALLING%20ENGINE.md) as the channel through which AI conversations reach this module.
- Async job infrastructure for reindexing (Core Contract #8).
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) for this module's place alongside Semantic Search/RAG as the two retrieval layers over reference data.

## Extension Points
- New filterable fields (e.g. a future "study design" facet) can be added to the index without changing the Query Service's calling contract.
- New content types beyond `ResearchReference` (e.g. indexing methodology glossary entries) can be added as additional index partitions.
- Ranking signals can be tuned or extended (e.g. adding a project-relevance boost) without changing the underlying index structure.

## Security & Privacy
- The index only ever contains data already normalized into the canonical model; it does not introduce a new privacy surface beyond what Literature & Evidence already governs.
- Where a `ResearchReference` is attached to a private project's personal annotations, those private annotations are not put in the shared/global index — only public bibliographic metadata is indexed globally, consistent with private-by-default (Core Contract #9).
- Query access is authorized the same way any project- or user-scoped read is, via Platform Core's Authorization Kernel.

## Failure Modes
- Index lag behind canonical data: queries may miss very recently added references; acceptable bounded staleness, not a hard failure, surfaced via the IndexSyncCursor.
- Index corruption/rebuild needed: Query Service degrades to reduced functionality (e.g. exact-match only) rather than being fully unavailable, if the degraded mode is technically feasible — otherwise fails explicitly rather than returning wrong results.
- Reindex job failure: retried per the async job system's standard retry policy; does not block writes to the canonical reference data.

## Observability
- Query latency and volume, split by frontend vs. tool-call origin.
- Index sync lag (time between a canonical write and its reflection in the index).
- Reindex job success/failure rate and duration.
- Zero-result query rate (signals index gaps or query-formulation issues on the calling side).

## P0/P1/P2/P3
**P1.** Fast structured lookup over the platform's own reference library is a major product capability (library browsing, precise AI tool lookups) but the platform can launch with a more limited search experience before this is fully built out — not required for the AI/context core to function.

## Current Status
Documented, not implemented. No index, query service, or reindex job exists yet; this document defines the intended scope ahead of implementation.

## Open Questions
- Underlying search index technology choice (UNKNOWN — not yet decided; this document intentionally does not assume a specific search engine product).
- Whether Knowledge Search and Semantic Search/RAG share a single query entrypoint with a routing layer above them, or remain two distinct tools the AI/frontend call separately.
- How ranking should weight platform-specific relevance signals once usage data exists.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [Literature & Evidence](./10%20LITERATURE%20EVIDENCE.md)
- [Semantic Search / RAG](./09%20SEMANTIC%20SEARCH%20RAG.md)
- [AI Tool Calling Engine](./06%20AI%20TOOL%20CALLING%20ENGINE.md)
