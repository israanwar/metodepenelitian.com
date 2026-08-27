# ADR 010 — Canonical Content Separated From Formatting

**Status:** LOCKED

**Decision:** Research truth (facts, results, citations, tables/figures, approvals, provenance) is separated from presentation/formatting. Formatting cannot change facts, results, citations, tables/figures, approvals, or provenance — it may only propose or stage reversible presentation changes when the rule is deterministic and previewable to the user.

**Context:** Master Backend Architecture (area 475): *"P0 locks separation of research truth from presentation: formatting cannot change facts, results, citations, tables/figures, approvals, or provenance."* [internal-engines/FORMATTING POLICY ENGINE.md](../internal-engines/FORMATTING%20POLICY%20ENGINE.md) states the boundary precisely: *"The engine may propose or automatically stage reversible presentation changes when the rule is deterministic and the user can preview the result. It cannot change claims, values, citations, reference identity, section meaning, table/figure data, authorship, approval/signature content, or canonical RDT state."* Institutional and journal formatting policies "generate separate artifacts; conflicts block rather than silently override" rather than being merged into canonical content.

**Rationale:** Journal and institutional formatting requirements are numerous, sometimes conflicting, and change independently of the underlying research. If formatting logic could touch canonical values, a rendering bug or a journal-template update could silently alter a result, a citation, or an approved claim — the exact fabrication risk the platform's provenance guarantees exist to prevent. Keeping formatting as a downstream, content-preserving transform is what makes "the document says what the research state says" a provable property instead of a hope.

**Consequences:**
- Any formatting/rendering engine (institutional formatting, journal templates, export renderers) reads canonical document content but cannot write back to it.
- Formatting conflicts between institutional and journal rules must block generation and surface to the user, not silently pick a winner.
- Structural or content remediation that a formatting rule surfaces is routed to the Academic Document Engine and human review, never auto-applied to canonical content.

**Constraints:** This ADR fixes the separation boundary; it does not authorize implementing the full Formatting Policy Registry, guideline import, or institution/journal portal in P0 — those remain P1/P2 per the P0 sequence's priority reconciliation.

**Source of Truth:** [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) (Section on Formatting, area 475-477). [database/FORMATTING POLICY MODEL.md](../database/FORMATTING%20POLICY%20MODEL.md). [internal-engines/FORMATTING POLICY ENGINE.md](../internal-engines/FORMATTING%20POLICY%20ENGINE.md). [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) — Locked Invariant #8, Phase 12.

**Supersedes:** None.

**Superseded By:** None.
