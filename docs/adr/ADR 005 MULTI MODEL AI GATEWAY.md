# ADR 005 — Multi-Model AI Gateway

**Status:** LOCKED

**Decision:** All AI calls pass through one provider-agnostic Multi-Model AI Gateway that accepts a task, classifies it, routes it to the best available model, normalizes the response, and meters usage. No engine, workflow, admin surface, or frontend calls an AI provider directly; users are never required to hold their own provider API key.

**Context:** Master Backend Architecture Section 9 names this "the platform's central strategic architecture" and defines it exactly as above, with owned components `AIProviderRegistry`, `AIModelRegistry`, `AIModelCapabilities`, `AIProviderAdapter`, `AITaskClassifier`, `AIModelRouter`, `AIRequestManager`, `AIResponseNormalizer`, `AIUsageMeter`, `AICostTracker`, `AIQuotaManager`, `AIFallbackManager`, `AIProviderHealth`, `AIRequestAudit`. Architectural Principle #4: *"All AI calls pass through the AI Gateway."* Master AI Governance Section 1 restates the single point of control: *"Define the single point of control (Multi-Model AI Gateway) through which every AI model call in the platform must pass — no engine, workflow, or admin surface calls a provider directly."*

**Rationale:** Locking to one AI vendor is a business and technical risk, and different research tasks (long-context literature synthesis vs. statistical reasoning vs. writing review) genuinely need different models. Centralizing routing, normalization, and metering lets the platform swap or add providers without touching calling code, and gives one place to enforce fallback, cost tracking, and quota — properties that cannot be guaranteed if every module calls a provider SDK independently.

**Consequences:**
- Every AI-touching module depends on the Gateway's interfaces, never on a provider-specific request/response shape.
- Provider health, fallback, and quota are gateway-owned concerns; a provider outage must degrade through the Gateway's fallback path, not fail silently per caller.
- All AI requests are immutably audited (`AIRequestAudit`) for cost, debugging, and safety review.

**Constraints:** This ADR fixes the routing chokepoint, not the AI-authority boundary — the Gateway is where model calls are made, but the rule that AI output cannot become canonical truth is a separate decision (see [ADR 011](ADR%20011%20AI%20IS%20NOT%20SOURCE%20OF%20TRUTH.md)).

**Source of Truth:** [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 3 (Principle #4), Section 9. [Master AI Governance](../MASTER%20AI%20GOVERNANCE.md) — Section 1. [05 Multi Model AI Gateway](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md). [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) — Phase 8.

**Supersedes:** None.

**Superseded By:** None.
