# ADR 008 — Publication Gateway Is a Router, Not a Publisher

**Status:** LOCKED

**Decision:** The Publication Gateway is the exit path that matches a finished project to real journals/conferences/repositories and hands off to the *official* submission destination. It is a router to real publishers and is never itself a publisher: it does not review, accept, reject, typeset, or issue publications, under any framing. Scopus, SINTA, and Google Scholar are indexing/discovery signals, not direct submission destinations.

**Context:** Architectural Principle #15: *"The Publication Gateway is a router to real publishers — it is never itself a publisher."* Principle #16: *"Scopus, SINTA, and Google Scholar are indexing/discovery signals, not direct submission destinations."* [21 Publication Gateway](../architecture/21%20PUBLICATION%20GATEWAY.md) restates the boundary directly: *"Does not review, accept, reject, typeset, or issue publications — MetodePenelitian.com is never itself a publisher (Core Contract #7), under any framing."* Section 2's product framing calls it *"the exit path... handing off to the official submission destination — never a fake in-house publisher."*

**Rationale:** A platform that appears to accept, review, or issue publications on its own authority would misrepresent academic legitimacy and create an unbounded scope and liability the architecture explicitly refuses. Keeping publication strictly downstream — matching, formatting-readiness, and handoff only — preserves the platform's role as infrastructure for a researcher's work, not as a competing or fake publishing authority.

**Consequences:**
- No P0 or later phase may implement in-house review, acceptance, rejection, typesetting-as-issuance, or any UI/copy that implies the platform itself publishes.
- Publication readiness checks and destination matching may exist, but external submission always hands off to the real, official destination.
- Discovery/indexing signals (Scopus, SINTA, Google Scholar) must not be presented as submission targets.

**Constraints:** This ADR fixes the router-not-publisher boundary; it does not authorize implementing the full Publication Gateway in P0 — per the P0 sequence, only the router interface and the guard against fake integration/submission claims are P0, while the destination registry, matcher, readiness, tracking, and API-backed submission remain P1.

**Source of Truth:** [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 2, Section 3 (Principles #15, #16). [21 Publication Gateway](../architecture/21%20PUBLICATION%20GATEWAY.md). [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) — Priority Reconciliation (Publication row).

**Supersedes:** None.

**Superseded By:** None.
