# ADR 002 — ResearchProject as Core Aggregate

**Status:** LOCKED

**Decision:** `ResearchProject` is the central aggregate root of the platform. Every research artifact (literature, methodology, dataset, analysis, writing, references) hangs off exactly one `ResearchProject`, and every other locked component (Research Digital Twin, Project Context, Research Compiler, AI Gateway, Agent Orchestrator, Integration Gateway, Publication Gateway) is defined relative to it.

**Context:** Backend Architectural Principle #1: *"`ResearchProject` is the central aggregate — everything else hangs off it."* Section 2 frames the whole product as "four systems fused around one aggregate, the `ResearchProject`." Section 6's locked contract explicitly names `ResearchProject` first among the binding components. `02 RESEARCH CORE.md` records it directly as "central aggregate root." The P0 implementation sequence and dependency graph both encode this: Phase 2 exists specifically to implement `ResearchProject` as "the only aggregate root and authorization anchor for project-scoped research state," and no later phase is allowed to introduce a second one.

**Rationale:** A research platform that lets literature, methodology, datasets, and writing exist independently of a project loses the one property that differentiates a Research Operating System from a document editor bolted to a chatbot: every answer, suggestion, and artifact must be traceable to *this specific research project's* context. Anchoring authorization, ownership, and canonical state to one aggregate is what makes that traceability enforceable rather than aspirational.

**Consequences:**
- Every project-scoped entity created in any later phase must reference exactly one `ResearchProject` and inherit its tenant/ownership boundary; an unscoped or cross-project child record is a defect, not a variant.
- Authorization decisions for research content route through project membership/ownership, never through a parallel identity check.
- No module (RDT, evidence, datasets, documents, AI) may become a second aggregate root or bypass `ResearchProject` to reach its own storage.

**Constraints:** This ADR fixes the aggregate identity, not its internal schema — entity/column detail remains owned by [database/DOMAIN MODEL.md](../database/DOMAIN%20MODEL.md) and the P0 sequence's Phase 2 contract.

**Source of Truth:** [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 2, Section 3 (Principle #1), Section 6. [Master Product Architecture](../MASTER%20PRODUCT%20ARCHITECTURE.md). [02 Research Core](../architecture/02%20RESEARCH%20CORE.md). [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) — Phase 2, Locked Invariant #1.

**Supersedes:** None.

**Superseded By:** None.
