# Research Graph

## Purpose
The Research Graph is the internal graph representation that connects a researcher's project entities (references, extracted concepts, gaps, authors, methods) as nodes and edges, so relationships that are implicit in a stack of PDFs (this paper cites that one, these two contradict each other, these three share a method) become explicit and queryable/visualizable.

## Scope
Covers graph construction, storage, and query access for entities that already exist inside a `ResearchProject`: `ResearchReference`, extracted concepts/keywords, `SynthesisFlag` relationships, `GapCandidate` links, and author/co-authorship edges derivable from reference metadata. Does not cover discovering new external references, does not cover the AI reasoning that produces synthesis or gap content (it only stores and traverses the resulting relationships), and does not build a graph across different researchers' private projects.

## Responsibilities
- Maintain a node/edge graph scoped to one project (with an explicit future extension point for a researcher's own cross-project graph, never a cross-tenant one).
- Derive edges automatically from existing structured data: citation links between references (where citation data is present in canonical metadata), co-authorship, shared-concept edges from extraction output, agreement/disagreement edges from `SynthesisFlag`, and gap-to-evidence edges from `GapCandidate`.
- Serve graph queries (neighbors of a node, shortest path between two references, cluster/community detection) to the frontend for visualization and to other engines for context.
- Keep the graph incrementally updated as new references, extractions, or gaps are added, rather than requiring a full rebuild.

## Non-Responsibilities
- Does not perform citation-network resolution against the wider global scholarly graph (e.g., it does not act as an OpenAlex/Semantic Scholar-scale citation index); it only graphs what is already inside the project's own reference set plus metadata already attached to each `ResearchReference`.
- Does not run the AI extraction or synthesis logic that produces edge-worthy relationships; it consumes their output.
- Does not decide what is scholarly "important" (e.g., no independent authority/impact scoring); any centrality metrics it computes are descriptive graph statistics, not a claim about a paper's real-world influence.
- Does not expose a public or cross-user graph API.

## Core Components
- **Graph Store**: persistent node/edge storage scoped by project, modeled to support incremental upsert rather than full recomputation on every change.
- **Edge Derivation Pipeline**: a set of derivation rules (citation edges, co-authorship edges, concept-similarity edges, synthesis-flag edges, gap-evidence edges) that run as references/extractions/gaps are created or updated.
- **Query Layer**: neighbor lookup, path queries, and simple clustering exposed as an internal API for the frontend visualization and for other engines.
- **Graph Snapshot/Versioning**: lightweight versioning so a graph view can be reproduced as of a given synthesis run, matching the evidence it was built from.

## Owned Data
| Entity | Description |
|---|---|
| `GraphNode` | A project-scoped node: reference, concept, author, or gap, with a type discriminator and reference back to its source entity. |
| `GraphEdge` | A typed, directed or undirected edge between two `GraphNode`s (cites, co-authored-with, shares-concept, agrees-with, contradicts, evidences-gap), with provenance pointing to the source record that generated it. |
| `GraphSnapshot` | Optional point-in-time marker tying a graph state to a specific synthesis/gap run, for reproducible visualization. |

## Inputs
- `ResearchReference` records and their canonical metadata (authors, citation links where available).
- `EvidenceExtraction` output (for concept nodes) from the [Evidence Synthesis Engine](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md).
- `SynthesisFlag` records (for agreement/contradiction edges).
- `GapCandidate` records (for gap-evidence edges) from the [Research Gap Engine](12%20RESEARCH%20GAP%20ENGINE.md).

## Outputs
- Graph query results served to the frontend for visualization (network diagrams, cluster views).
- Graph-derived context (e.g., "these three references form a tight cluster") available for other engines to pull from the [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md) as enriched context rather than raw graph internals.

## Dependencies
- [Evidence Synthesis Engine](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md) and [Research Gap Engine](12%20RESEARCH%20GAP%20ENGINE.md) as upstream data producers.
- Canonical `ResearchReference` model per [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).
- [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md) for publishing graph-derived summaries back into shared project context.

## Extension Points
- Additional edge-derivation rules (e.g., methodological-similarity edges once the Methodology Advisor produces structured method tags) can be added to the derivation pipeline independently.
- A future cross-project graph for a single researcher's own body of work is an explicit extension point, gated behind its own access-control review; it is not built now.
- Alternative graph query/clustering algorithms can be swapped behind the Query Layer interface.

## Security & Privacy
The graph is strictly project-scoped and inherits the project's default-private access model; no node or edge crosses project or tenant boundaries. Graph export (e.g., to an image or data file) is subject to the same access checks as the underlying project.

## Failure Modes
- **Upstream extraction/synthesis unavailable**: graph continues to serve existing nodes/edges read-only; new edge types simply stop being derived until upstream data resumes, consistent with degraded-but-functional operation.
- **Missing citation metadata on a reference**: reference node is still created; citation edges to/from it are simply absent rather than the whole graph failing to build.
- **Large reference sets causing dense, unreadable graphs**: query layer supports filtering/clustering so the frontend can render a legible subgraph rather than forcing a full-graph dump.

## Observability
- Node/edge count per project over time (growth signal).
- Edge derivation latency and failure rate per derivation rule.
- Query response time for common operations (neighbor lookup, path query) to catch graphs that have grown beyond comfortable interactive query performance.

## P0/P1/P2/P3
**P2.** The graph is a valuable visualization and reasoning aid layered entirely on top of data that already exists from P1 engines; a project remains fully usable without it, and its value compounds only once a project has enough references and synthesis depth to make a graph meaningful.

## Current Status
Documented, not implemented. No graph store, derivation pipeline, or query layer exists in code yet.

## Open Questions
- What graph storage approach fits a modular monolith at current scale: a relational adjacency-list table, or a dedicated graph-capable store introduced only if query patterns demand it (per the modular-monolith-until-proven baseline)?
- Which edge types are worth the derivation cost at MVP versus deferred (e.g., is co-authorship worth computing before concept-similarity edges)?
- Should graph visualizations be exportable, and if so what privacy/watermarking controls apply given the project is private by default?

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [11 EVIDENCE SYNTHESIS ENGINE.md](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md)
- [12 RESEARCH GAP ENGINE.md](12%20RESEARCH%20GAP%20ENGINE.md)
- [03 PROJECT CONTEXT ENGINE.md](03%20PROJECT%20CONTEXT%20ENGINE.md)
