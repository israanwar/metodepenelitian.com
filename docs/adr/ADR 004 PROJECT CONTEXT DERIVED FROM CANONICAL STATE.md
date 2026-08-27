# ADR 004 — Project Context Derived From Canonical State

**Status:** LOCKED

**Decision:** `ProjectContext` is a single, canonical, derived/materialized view assembled from Research Core (RDT) and related project data. It is not an independent source of truth — source of truth remains the Research Core entities it is built from — and no provider adapter, model, or orchestrator path may construct its own private context. There is exactly one context builder.

**Context:** Master Backend Architecture Section 7: *"A single, canonical context object per project that every AI model reads from. Not a chatbot memory — a structured, queryable snapshot of the project's current state."* Data ownership is explicit: *"`ProjectContext` (derived/materialized view; source of truth remains Research Core entities)."* The binding rule is stated directly: *"no provider adapter, no model, and no orchestrator path may construct its own private context. There is exactly one context builder."* Architectural Principle #2 restates the same guarantee: *"All AI providers share the same Project Context. No model gets a private view of the project."*

**Rationale:** If every model or agent assembled its own view of a project, answers would diverge and contradict each other across providers — the exact failure mode the platform exists to prevent (Section 7's "WHY"). Deriving context from one canonical builder, on demand, from RDT and related entities guarantees every consumer sees the same reality and that the derivation itself stays auditable and reproducible.

**Consequences:**
- Context is versioned/pinned to the RDT version it was built from, so a given AI request is reproducible and auditable (Section 7 "Context versioning").
- Context assembly must respect the same access control as the underlying project and must exclude fields the user has not consented to share before reaching an external provider (Section 7 "SECURITY CONSIDERATIONS").
- Context size management (summarization/windowing) is handled once inside the AI Gateway, not reimplemented per provider.

**Constraints:** This ADR fixes context as a derived projection, not a persistence decision — whether context snapshots are stored is an implementation detail deferred to the owning phase's ADR/ticket, and must never become a second research-state table that competes with the RDT.

**Source of Truth:** [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 3 (Principle #2), Section 7. [03 Project Context Engine](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md). [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) — Phase 4, Locked Invariant #3.

**Supersedes:** None.

**Superseded By:** None.
