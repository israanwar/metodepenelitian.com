# ADR 003 — Research Digital Twin as Canonical Research State

**Status:** LOCKED

**Decision:** The Research Digital Twin (RDT) is the versioned, auditable, project-scoped graph of research entities, relationships, dependencies, provenance, validations, and changes for exactly one `ResearchProject`. It is the canonical living research state — not a document, chat transcript, vector-store dump, or model memory — and no agent, AI provider, integration, or frontend may own a parallel canonical copy.

**Context:** Master Backend Architecture Section 6: *"Research Digital Twin — the versioned, auditable, project-scoped graph of research entities, relationships, dependencies, provenance, validations, and changes. `ResearchProject` remains the aggregate root; the Twin is its canonical living research state, not a competing project or chatbot memory."* [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md) and [database/RESEARCH DIGITAL TWIN MODEL.md](../database/RESEARCH%20DIGITAL%20TWIN%20MODEL.md) both restate: *"`ResearchProject` remains the aggregate root and authorization boundary. `ResearchDigitalTwin` is the canonical versioned research-state graph for exactly one project. No agent, AI provider, integration, or frontend owns a parallel canonical copy."*

**Rationale:** Research design (questions, objectives, variables, hypotheses, methodology) has typed relationships and must support reproducible historical reconstruction, impact analysis when an upstream decision changes, and deterministic consistency checking. A document or chat log cannot provide typed edges, versioning, or provenance; a model's context window cannot survive between sessions or providers. A dedicated versioned graph, owned once, is required to make those properties true instead of assumed.

**Consequences:**
- All AI providers and agents read the RDT (via Project Context) rather than maintaining their own memory of project state.
- Every RDT mutation must be versioned and auditable; historical snapshots must reconstruct exactly.
- The Research Compiler validates RDT consistency without owning or rewriting it (see [ADR 011](ADR%20011%20AI%20IS%20NOT%20SOURCE%20OF%20TRUTH.md) for the adjacent AI-authority boundary).

**Constraints:** This ADR fixes RDT's role as canonical state, not its full 27-stage entity catalog. The P0 vertical slice deliberately implements only `ResearchQuestion → Problem → ResearchObjective → Variable/Construct → Hypothesis → Methodology`; the remaining lifecycle stages stay documented but unimplemented until a later phase, per the P0 sequence's Phase 3 forbidden scope.

**Source of Truth:** [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 6. [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md). [database/RESEARCH DIGITAL TWIN MODEL.md](../database/RESEARCH%20DIGITAL%20TWIN%20MODEL.md). [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) — Phase 3, Locked Invariant #2.

**Supersedes:** None.

**Superseded By:** None.
