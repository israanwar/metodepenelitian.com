# P0 Backend Implementation Sequence — moved

**Status:** SUPERSEDED. This document is a compatibility pointer only and carries no gating authority.

The binding P0 sequence, gates, dependency graph and Definition of Done now live in `docs/implementation/`:

- [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md)
- [P0 Implementation Gates](../implementation/P0%20IMPLEMENTATION%20GATES.md)
- [P0 Dependency Graph](../implementation/P0%20DEPENDENCY%20GRAPH.md)
- [P0 Definition of Done](../implementation/P0%20DEFINITION%20OF%20DONE.md)

## Why it moved

The wave-based sequence (W0–W4…) that previously lived in this file has been re-expressed as a 14-phase sequence with explicit gates A–I, a dependency DAG and a per-phase Definition of Done, kept together in `docs/implementation/` as the single source of truth for backend build order. Sequencing principles, priority reconciliation and P1/P2 boundaries carried over unchanged in substance; only the structure and location changed.

Any document still linking to this path should be updated to link directly to the files above. Do not add new content here.

## Related documents

- [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [Master Product Architecture](../MASTER%20PRODUCT%20ARCHITECTURE.md)
