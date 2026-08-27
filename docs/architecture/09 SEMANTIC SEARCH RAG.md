# Semantic Search / RAG

## Purpose
Semantic Search / RAG provides meaning-based retrieval over the platform's canonical reference and document content — finding relevant material by conceptual similarity rather than exact keyword match — and packages retrieved passages for grounding AI-generated answers (retrieval-augmented generation). It exists so that internal engines like Evidence Synthesis can ask "find material relevant to this claim/question" and get back conceptually relevant results even when the wording differs from the source text, and so that AI-generated claims can be grounded in retrieved, citable passages rather than produced from the model's parametric knowledge alone.

## Scope
Covers embedding generation, vector index maintenance, similarity retrieval, and retrieval-augmented prompt construction over canonical internal content (`ResearchReference` records and their associated full-text/abstract content, where available). Does not cover keyword/structured search (that is [Knowledge Search](./08%20KNOWLEDGE%20SEARCH.md)) and does not cover normalizing raw scholarly data into the canonical model (that is [Literature & Evidence](./10%20LITERATURE%20EVIDENCE.md), which this module depends on as its content source).

## Responsibilities
- Generate and maintain vector embeddings for canonical reference content (abstracts, and full text where legally and technically available) via the Multi-Model AI Gateway's embedding-capable models — never by calling an embedding provider directly.
- Serve similarity-based retrieval queries: given a query (a research question, a draft claim, a topic), return the most conceptually relevant passages/records.
- Construct grounded retrieval context for RAG-style AI calls, i.e. package retrieved passages in a form the Research AI Orchestrator can attach to a model call so generated text can cite what it actually retrieved.
- Track provenance for every retrieved passage back to its source `ResearchReference`, so any AI output grounded in it can be traced and cited correctly.
- Expose retrieval as a callable tool via the AI Tool Calling Engine for use mid-conversation (e.g. Evidence Synthesis asking for supporting material for a specific claim).

## Non-Responsibilities
- Does not perform exact keyword/filter search — that is Knowledge Search's job, and the two are complementary retrieval strategies over the same underlying canonical content.
- Does not decide how retrieved evidence should be synthesized into an argument — that is the Evidence Synthesis engine's domain reasoning; this module only retrieves and grounds, it does not argue.
- Does not call any embedding or generation model directly — all model calls, including embedding generation, go through the Multi-Model AI Gateway (Core Contract #3).
- Does not fetch or normalize source content from external providers — it only operates on content already canonicalized by Literature & Evidence (Core Contract #6).

## Core Components
- **Embedding Pipeline** — async background job (Core Contract #8) that generates embeddings for new/updated canonical content via the AI Gateway and writes them to the vector index.
- **Vector Index** — the similarity-searchable store of embeddings, keyed back to source `ResearchReference` and passage identifiers.
- **Retrieval Service** — serves top-k similarity queries against the Vector Index.
- **RAG Context Builder** — assembles retrieved passages plus provenance metadata into the structured form the Research AI Orchestrator attaches to a grounded generation call.
- **Tool Binding** — registration exposing Retrieval Service as a callable tool via the AI Tool Calling Engine.

## Owned Data
| Entity | Notes |
|---|---|
| PassageEmbedding | vector representation of a chunked passage, linked to source ResearchReference |
| EmbeddingSyncCursor | tracks embedding pipeline progress against canonical content updates |
| RetrievalQueryLog | query, top-k results, and which downstream engine/call used them (for relevance tuning) |

## Inputs
- Canonical `ResearchReference` content (abstracts, available full text) and update events from Literature & Evidence.
- Similarity-search queries from internal engines (typically Evidence Synthesis) via the AI Tool Calling Engine.
- Embedding-capable model access via the Multi-Model AI Gateway.

## Outputs
- Ranked passage results with similarity scores, returned to the querying caller.
- RAG-ready grounded context bundles (passages + provenance) attached to generation calls by the Research AI Orchestrator.
- `RetrievalQueryLog` entries for relevance/quality observability.

## Dependencies
- [Literature & Evidence](./10%20LITERATURE%20EVIDENCE.md) as the sole content source (Core Contract #6).
- [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md) for all embedding and any generation model calls.
- [AI Tool Calling Engine](./06%20AI%20TOOL%20CALLING%20ENGINE.md) as the channel for mid-conversation retrieval calls.
- Async job infrastructure for the Embedding Pipeline (Core Contract #8).

## Extension Points
- New embedding models can be swapped in via the Gateway without changing the Retrieval Service's calling contract, though a model change requires a re-embedding pass across the Vector Index.
- Chunking strategy (how source content is split into passages before embedding) is pluggable and can be refined per content type (abstract vs. full text) independently of the retrieval interface.
- Retrieval can be extended to support hybrid scoring (blending semantic similarity with Knowledge Search's structured relevance) behind the same Retrieval Service interface.

## Security & Privacy
- Embeddings are generated only from canonical content the platform already holds; embedding a private project's personal annotations (as opposed to public bibliographic/abstract content) must respect the same private-by-default boundary as the source data (Core Contract #9) and not be pooled into a globally-queryable index.
- Full-text embedding is subject to the source material's licensing/copyright status — Literature & Evidence's provenance data determines what content is legally eligible for full-text indexing; this module must not embed content it is not entitled to process, and where that entitlement status is unclear, treat it as abstract-only (UNKNOWN full-text rights require conservative handling, not an assumption of permission).
- `RetrievalQueryLog` may contain sensitive project-derived query text and inherits the querying project's access rules.

## Failure Modes
- Embedding Pipeline backlog: newly added references are not yet semantically searchable; Retrieval Service returns results from the last successfully embedded set rather than failing the query, with staleness visible via `EmbeddingSyncCursor`.
- Vector Index unavailable: Evidence Synthesis and other callers fall back to Knowledge Search's keyword retrieval as a degraded mode (Core Contract #11) where that fallback is meaningful, rather than the engine failing outright.
- Gateway unavailable for embedding calls: Embedding Pipeline retries per standard async job policy; does not block reads against the already-built index.

## Observability
- Embedding Pipeline throughput, backlog size, and failure rate.
- Retrieval query latency and top-k relevance signal (e.g. click-through or downstream-use rate where measurable).
- Vector Index size and growth rate.
- Zero/low-similarity-result query rate (signals coverage gaps in embedded content).

## P0/P1/P2/P3
**P1.** Grounded, meaning-based retrieval is a major product capability that materially improves the trustworthiness of AI-generated evidence synthesis, but the platform's foundational AI features (context assembly, basic advisory engines) can operate without it initially via Knowledge Search's keyword retrieval as a narrower substitute.

## Current Status
Documented, not implemented. No embedding pipeline, vector index, or retrieval service exists yet; this document defines the intended scope ahead of implementation.

## Open Questions
- Vector index technology choice (UNKNOWN — not yet decided).
- Full-text embedding eligibility policy per source/license type, which depends on Literature & Evidence's provenance tracking maturity.
- Whether re-embedding on model upgrade is a full backfill or a gradual background migration.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [Literature & Evidence](./10%20LITERATURE%20EVIDENCE.md)
- [Knowledge Search](./08%20KNOWLEDGE%20SEARCH.md)
- [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md)
- [AI Tool Calling Engine](./06%20AI%20TOOL%20CALLING%20ENGINE.md)
