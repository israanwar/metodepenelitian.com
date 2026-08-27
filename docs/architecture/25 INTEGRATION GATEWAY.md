# Integration Gateway

## Purpose
Integration Gateway is the single mandatory chokepoint every outbound call to a third-party provider must pass through (Core Contract #4). It exists so that authentication, rate limiting, retry/backoff, response normalization, and provider-specific quirks are handled once, centrally, instead of being reimplemented — inconsistently — inside every module that happens to need external data. No controller, application service, or AI tool is permitted to call a provider API directly.

## Scope
Covers the gateway pattern itself: the routing layer, the Provider Interface contracts each category of provider must implement, and the cross-cutting resilience behavior (circuit breaker, timeout, backoff, fallback) that applies uniformly to every adapter. Does not cover which providers exist or their individual capabilities (that is [External Providers](./26%20EXTERNAL%20PROVIDERS.md) and the category files under `docs/integrations/`), and does not cover the internal canonical data model providers get normalized into (that is Research Core's `ResearchReference` model, defined in the literature/evidence documentation).

## Responsibilities
- Provide the only path from any Application Service to any third-party provider, enforced as an architectural rule (Core Contract #4), not merely a convention.
- Define Provider Interfaces per category — `ScholarlyProvider`, `ReferenceManagerProvider`, `AIProvider`, `PublicationProvider`, `RepositoryProvider`, `DocumentProvider`, `AnalysisProvider` — so Application Services depend on a stable internal contract, never on a specific vendor's API shape.
- Own cross-cutting resilience: circuit breaker, timeout enforcement, exponential backoff, and provider fallback where a functional equivalent adapter exists.
- Own credential handling for every outbound call: no adapter reads a secret directly from environment/config outside the Gateway's credential-resolution path.
- Report per-provider health status (`IntegrationHealth`) so dependent modules can react to degraded providers instead of discovering failure per-request.
- Normalize every provider's response shape into the Research OS's internal canonical shapes before returning to the calling Application Service, so provider-specific detail never leaks upward (Core Contract #12).

## Non-Responsibilities
- Does not decide business logic about what to do with provider data once returned — that belongs to the calling Application Service (e.g. how Literature & Evidence uses a Crossref-normalized record).
- Does not maintain the human-readable inventory of which providers exist and their verification status — that is External Providers and the `docs/integrations/` category files.
- Does not perform AI model routing/selection logic — that is the [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md), which itself is one caller of this Gateway's `AIProvider` interface for the actual outbound model call.
- Does not decide publication-routing logic — that is [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md); this Gateway only carries its API-backed calls.

## Core Components
- **Gateway Router** — receives calls from Application Services and dispatches to the correct Provider Adapter based on the Provider Interface requested.
- **Provider Interface Contracts** — the category-specific internal contracts (`ScholarlyProvider`, `ReferenceManagerProvider`, `AIProvider`, `PublicationProvider`, `RepositoryProvider`, `DocumentProvider`, `AnalysisProvider`) every adapter in that category implements.
- **Provider Adapters** — the only layer permitted to know a specific vendor's authentication scheme, request/response shape, pagination, and quirks (Core Contract #12). One adapter per concrete provider.
- **Resilience Middleware** — circuit breaker, timeout, exponential backoff, and fallback-to-equivalent-provider logic, applied uniformly across all adapters.
- **Credential Resolver** — resolves platform-owned and BYOK (bring-your-own-key) credentials per provider/tenant without exposing them to calling code.
- **Health Reporter** — tracks per-provider `IntegrationHealth` (up/degraded/down, recent error rate, last successful call).

## Owned Data
| Entity | Notes |
|---|---|
| IntegrationProvider | registered provider definition: category, Provider Interface implemented, adapter reference |
| IntegrationConnection | a tenant/user-level connection instance (e.g. one researcher's Zotero OAuth link) |
| IntegrationCredential | encrypted credential material for a connection, platform-owned or BYOK |
| IntegrationHealth | live health/availability state per provider |
| IntegrationSync | record of a sync operation's status (for providers involving data sync, e.g. reference managers) |

## Inputs
- Typed calls from Application Services against a Provider Interface (e.g. Literature Service calling `ScholarlyProvider.search(...)`), never a raw HTTP call.
- Credential material supplied at connection time (OAuth flow completion, API key entry) via Platform Core's secret vault.
- Provider-side responses, errors, and rate-limit signals from each concrete adapter's outbound calls.

## Outputs
- Normalized response objects in internal canonical shapes, returned to the calling Application Service.
- `IntegrationHealth` state consumed by dependent modules (e.g. Publication Gateway checking `api_available` before offering an API-backed handoff).
- Structured error/exception types (auth failure, rate-limited, provider-down, not-found) that calling code can handle without knowing provider specifics.

## Dependencies
- Consumed by [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md) for outbound AI model calls.
- Consumed by [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md) and [Submission Orchestration](./24%20SUBMISSION%20ORCHESTRATION.md) for API-backed publication destinations.
- Consumed by Literature & Evidence for scholarly-data provider calls (Crossref, OpenAlex, and similar).
- Relies on Platform Core's secret vault for credential storage.
- See [External Providers](./26%20EXTERNAL%20PROVIDERS.md) for the full provider inventory, and [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) for the category index.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 19.

## Extension Points
**Forbidden pattern** (never permitted anywhere in the codebase):
```
Application Service → Provider API directly     ✗
Controller → Crossref / OpenAlex / Mendeley / any provider directly   ✗
```
**Required pattern** (the only permitted shape):
```
Application Service → Integration Gateway → Provider Interface → Provider Adapter → Provider API
```
- A new provider is added by writing one adapter implementing the relevant Provider Interface and registering it as an `IntegrationProvider` — Application Service code and the Provider Interface contract never change.
- A new provider category (interface not yet defined) is added by defining a new Provider Interface here first, then building adapters against it — never by an Application Service reaching around the Gateway "just this once."
- Fallback chains (e.g. Crossref unavailable, OpenAlex serves as functional equivalent) are configured at the Resilience Middleware level, not hardcoded per calling service.

## Security & Privacy
- This is the sole chokepoint where credential handling, rate-limit compliance, and audit logging for every outbound call are enforced centrally — a security property that is lost the moment any code bypasses it.
- Credentials (platform-owned and BYOK alike) are never logged, never returned to calling Application Services in plaintext, and are stored only via Platform Core's secret vault.
- Per-tenant/per-user `IntegrationConnection` isolation ensures one researcher's BYOK credential is never usable for another researcher's calls.
- Outbound calls carrying private `ResearchProject` content (Core Contract #9) must be traceable via audit log to the specific project, user, and provider involved.

## Failure Modes
- **Direct-call bypass introduced by mistake**: architecturally forbidden; caught by code review discipline and, once implemented, by dependency/lint rules restricting provider SDK imports to the adapter layer only.
- **Provider outage**: circuit breaker trips, calls fail fast rather than hanging, `IntegrationHealth` reflects the outage, and fallback-to-equivalent-provider engages where one exists (Core Contract #11).
- **Credential expiry/revocation**: surfaced as a structured auth-failure error to the calling module and to the affected user, not a silent empty result.
- **Rate-limit exhaustion**: backoff and queuing at the Gateway level, never a raw provider 429 propagating unhandled to the Application Service.

## Observability
- Per-provider call volume, latency, error rate, and circuit-breaker state.
- Credential health (expiring soon, revoked, failing auth) surfaced per connection.
- Fallback-engagement frequency (how often a functional-equivalent provider is used due to primary provider failure).
- Rate-limit proximity per provider, to anticipate throttling before it causes failures.

## P0/P1/P2/P3
**P0.** This must exist before any real provider integration ships; it is the enforcement point for Core Contract #4 and #12, and every other module that touches the outside world — AI, literature, publication, reference managers — depends on it existing correctly before it can be trusted with real credentials or real user data.

## Current Status
Documented, not implemented. No Gateway Router, Provider Interfaces, or adapters exist in code; this document defines the mandatory boundary every future provider integration must be built against.

## Open Questions
- Whether Provider Interfaces are versioned independently as providers within a category evolve at different paces (e.g. one scholarly-data provider adding a capability others lack).
- How BYOK credential rotation/expiry is surfaced to end users versus handled silently where possible.
- Whether fallback-to-equivalent-provider is ever automatic and silent, or must always be flagged to the calling module so it can decide whether a degraded-fidelity result is acceptable for that use case.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [External Providers](./26%20EXTERNAL%20PROVIDERS.md)
- [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md)
- [Platform Core](./01%20PLATFORM%20CORE.md)
- `docs/integrations/` — per-category provider inventories built against this Gateway's pattern
