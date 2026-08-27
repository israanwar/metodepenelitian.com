# ADR 001 — Modular Monolith

**Status:** LOCKED

**Decision:** The backend deploys as one modular monolith — a single deployable service internally organized into modules with hard boundaries enforced at the code-module level. No microservices split until a measured scaling need justifies extraction.

**Context:** Backend Architectural Principle #10 and #11 lock this before any implementation: *"No microservices until there is a real scaling reason to split"* and *"Start as a modular monolith with clean internal boundaries."* Section 5 states the system deploys as one deployable backend with module boundaries enforced by convention (lint/codeowners) or hard package separation, with the async layer (Section 22) and outbound gateway (Section 19) as the seams most likely to later warrant extraction.

**Rationale:** A single research project touches many domains (identity, research state, evidence, analysis, documents) that must share one transaction/authorization boundary and one canonical data model. Splitting into services before real load exists would multiply operational cost and create premature network boundaries around a domain model that is still stabilizing, contradicting the "prevent premature complexity" purpose stated in Section 1.

**Consequences:**
- Module boundaries must be enforced in code (ownership, linting, or package separation), not left implicit.
- Async/job execution (Section 22) and the outbound Integration/AI Gateways (Section 19, Section 9) are the pre-identified seams for any future extraction.
- Extraction is deferred, not forbidden; Section 970-971 area lists it as an open technology decision to resolve at build time, not a re-litigation of the decision to start monolithic.

**Constraints:** Applies to backend deployment topology only. Does not license tight coupling between modules — cross-module access still goes through the same contracts (gateways, application services) that a service boundary would require.

**Source of Truth:** [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 3 (Architectural Principles #10, #11), Section 5, Section 22, Section 31 (Section 913, Section 971). [Master Product Architecture](../MASTER%20PRODUCT%20ARCHITECTURE.md) (modular monolith baseline reference). [01 Platform Core](../architecture/01%20PLATFORM%20CORE.md).

**Supersedes:** None.

**Superseded By:** None.
