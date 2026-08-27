# ADR 006 — Integration Gateway and Provider Abstraction

**Status:** LOCKED

**Decision:** Every external, non-AI provider call (scholarly databases, reference managers, publication destinations, repositories, document/analysis providers) passes through a single mandatory Integration Gateway via defined provider interfaces (`ScholarlyProvider`, `ReferenceManagerProvider`, `PublicationProvider`, `RepositoryProvider`, `DocumentProvider`, `AnalysisProvider`, plus `AIProvider` for the AI Gateway's own use). No controller, service, or AI tool calls a third-party API directly.

**Context:** Master Backend Architecture Section 19 states the forbidden and required patterns explicitly: *"The single mandatory layer every external provider call passes through. No controller, service, or AI tool is permitted to call a third-party API directly."* Required pattern: `Application Service → Integration Gateway → Provider Interface → Provider Adapter`. Architectural Principle #5: *"All third-party services pass through the Integration Gateway."* Principle #6: *"Any provider (AI, scholarly, reference manager, publication) can be replaced without touching Research Core."*

**Rationale:** A research platform depends on many third-party systems (Crossref, OpenAlex, Mendeley, journal/repository APIs) whose terms, rate limits, and availability the platform does not control. Routing every outbound call through one gateway is what makes credential handling, rate-limit compliance, and audit logging enforceable in one place, and what makes it possible to replace or add a provider without touching Research Core — a guarantee that direct per-caller integration cannot provide.

**Consequences:**
- Provider adapters own authentication, request construction, rate limiting, retry, response normalization, error mapping, health reporting, and logging once, centrally.
- Cross-cutting resilience (circuit breaker, timeout, backoff, fallback where a functional equivalent exists) is implemented once in the Gateway.
- Research Core and application services depend on provider *interfaces*, never on a specific vendor's request/response shape.

**Constraints:** This ADR fixes the mandatory-chokepoint pattern; it does not authorize any specific provider as production-ready — Architectural Principle #14 (*"No integration is described as production-ready unless its API/terms have been verified"*) governs which providers may be represented as live.

**Source of Truth:** [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 3 (Principles #5, #6, #14), Section 19. [Master Integration Map](../MASTER%20INTEGRATION%20MAP.md). [25 Integration Gateway](../architecture/25%20INTEGRATION%20GATEWAY.md).

**Supersedes:** None.

**Superseded By:** None.
