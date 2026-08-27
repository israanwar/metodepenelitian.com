# AI Fallback Strategy

## Purpose
This document defines what happens when the model selected by [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md) cannot actually serve a request — the ordered fallback chain per task type, the circuit-breaker thresholds that mark a provider unhealthy, and the degraded-mode behavior each internal engine falls back to when no provider can serve the task at all. It is the mechanism that makes Core Contract #11 (engines keep working in a degraded-but-functional way) operationally real.

## Scope
Covers provider/model health detection, fallback ordering, circuit-breaker state transitions, and the contract between the Gateway and calling engines for degraded-mode responses. Does not cover initial model selection under normal health (see [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md)) and does not cover cost implications of fallback (see [AI COST QUOTA.md](AI%20COST%20QUOTA.md)).

## Responsibilities
- Define, per task type, an ordered fallback chain of alternate approved models to try when the primary selection fails or times out.
- Define circuit-breaker thresholds: how many consecutive failures or what error-rate window marks a provider/model as unhealthy, and how long it stays excluded before a health-check retry.
- Define the distinction between a *retryable* failure (timeout, rate limit, transient 5xx) and a *non-retryable* failure (invalid request, content-policy rejection), since only the former should trigger fallback rather than surfacing the error.
- Define the degraded-mode contract: when every model in a task type's fallback chain is unhealthy, the calling engine receives an explicit "no healthy model available" signal and must produce a clearly-labeled reduced-capability response (e.g. cached prior guidance, rule-based heuristic, or an honest "AI assistance temporarily unavailable" state) rather than erroring the user's workflow.
- Own the circuit-breaker state machine (closed / open / half-open) per provider and per model.

## Non-Responsibilities
- Does not decide the primary model selection — that is [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md); this document only activates after that selection fails.
- Does not implement each engine's specific degraded-mode logic (what a rule-based fallback for Methodology Advisor actually looks like) — that belongs to each internal engine's own documentation; this document only defines the signal contract, not the fallback content.
- Does not track cost impact of retries/fallback attempts — see [AI COST QUOTA.md](AI%20COST%20QUOTA.md), though a fallback attempt is still a metered call.
- Does not perform long-term provider approval decisions — repeated circuit-breaker trips are an input to [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) review, not a self-executing deapproval.

## Core Components
- **AIFallbackManager** — evaluates a failed primary call, consults the task type's fallback chain, and retries against the next eligible model.
- **Circuit Breaker** — per-provider and per-model state machine tracking recent failure rate and deciding whether that target is currently eligible for routing at all.
- **Degraded-Mode Signal** — the explicit response contract returned to a calling engine when the entire fallback chain is exhausted.
- **Health Check / Recovery Probe** — periodic low-cost probe used to test whether an `open` (excluded) circuit can move to `half-open` and be retried.

## Fallback Chain Pattern (illustrative)
For a given task type, the chain is an ordered list of (provider, model) pairs drawn from models eligible under [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md) for that task type — for example: primary model → same-provider alternate tier → different-provider model with equivalent capability profile → lowest-common-denominator broadly-capable model as a last resort before degraded mode. The exact chains per task type are configuration, not fixed in this document, and are expected to change as [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md) results accumulate.

## Circuit-Breaker State Transitions

| State | Meaning | Transition trigger |
|---|---|---|
| Closed | Provider/model treated as healthy, eligible for routing | Default state; returns here from half-open after a successful probe |
| Open | Provider/model excluded from routing entirely | Failure rate or consecutive-failure count exceeds threshold within a rolling window |
| Half-open | A single trial request is allowed through to test recovery | After a cooldown period elapses while in Open state |

Exact thresholds (failure count, window size, cooldown duration) are implementation configuration, not fixed numeric commitments in this document, since they should be tuned against real observed provider behavior rather than guessed in advance.

## Owned Data
- `AIFallbackChain` (task type, ordered model list, version).
- `AICircuitBreakerState` (provider/model, current state, failure count, last state-change timestamp).
- `AIDegradedModeEvent` — a log entry each time an engine receives the degraded-mode signal, for observability and for feeding provider-review conversations.

## Inputs
- Real-time success/failure/latency signal from every Gateway adapter call.
- The approved fallback-eligible model set from [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md) and [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md).
- Manual override (an admin forcing a provider into Open state ahead of an announced provider incident).

## Outputs
- A successful response from a fallback model, transparently returned to the calling engine (the engine may be told which model actually served the request, for audit purposes, without this changing its handling of the response).
- The degraded-mode signal when the entire chain is exhausted, consumed by each internal engine's own degraded-mode logic per Core Contract #11.
- Circuit-breaker state changes, feeding both live AI Admin health dashboards and longer-term provider-reliability input to [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md).

## Dependencies
- [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md) — supplies the primary selection this document reacts to failures of.
- [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md), [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md) — used to build capability-equivalent fallback chains.
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md) — the component hosting `AIFallbackManager`.
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 11 — the degraded-mode principle this document operationalizes for AI specifically.
- Every internal engine under `internal-engines/` — each is a consumer of the degraded-mode signal and owns its own fallback content logic.

## Extension Points
- New task types get a new fallback chain configuration without changing the circuit-breaker mechanism itself.
- Threshold tuning (failure counts, cooldown windows) can be adjusted per provider independently as real reliability data accumulates.
- A future "prefer cheaper fallback under sustained high load" policy can be layered onto chain ordering without changing the state machine.

## Security & Privacy
- A fallback model must still pass the same provider-eligibility (retention-flag) filtering as the primary selection — fallback never bypasses the private-data provider-eligibility rule from [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) to "just get something working."
- Degraded-mode responses must be clearly labeled as degraded to the user, never presented with the same confidence framing as a normal AI response — this is a user-trust requirement, not just a technical one.

## Failure Modes
- **Cascading failure** — a fallback chain concentrates too much traffic onto the next provider when the primary fails, potentially tripping that provider's own circuit breaker too; mitigated by chain design that spreads across genuinely independent providers, not near-duplicates of the same infrastructure.
- **Flapping circuit breaker** — a provider hovering right at the failure threshold repeatedly opens and closes; mitigated by requiring a minimum stable period in half-open before fully closing, not just one successful probe.
- **Silent degraded mode** — an engine receives the degraded-mode signal but fails to clearly label its reduced-capability output to the user, creating a false impression of full AI capability; this is treated as a product defect, not an acceptable fallback outcome.
- **Fallback masking a real quality problem** — a model consistently needs fallback not because it's unhealthy but because it's a poor task fit; mitigated by feeding circuit-breaker trip patterns into [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md) review rather than only treating it as an infrastructure signal.

## Observability
- Circuit-breaker state per provider/model, live, on the AI Admin health view.
- Fallback-chain depth reached per request (did it succeed on primary, first fallback, last resort, or hit degraded mode) — a rising average depth is an early warning sign even before full outages.
- Degraded-mode event rate per task type and per engine, tracked as a first-class reliability metric distinct from uptime.
- Time-to-recovery per circuit-breaker open event.

## P0/P1/P2/P3
**P0.** Core Contract #11 (engines keep working in a degraded-but-functional way) is a foundational reliability guarantee for an academic platform where a full AI outage cannot be allowed to block a user's research workflow; the fallback mechanism that makes this real must exist before any AI feature ships to production.

## Current Status
Documented, not implemented. No `AIFallbackManager`, circuit-breaker implementation, or degraded-mode signaling exists yet. Threshold values and specific fallback chains are intentionally left as future configuration rather than fixed here.

## Open Questions
- Exact circuit-breaker thresholds (failure count, window, cooldown) — require tuning against real provider behavior, not decidable in advance.
- Whether fallback attempts count against a user's quota the same as a primary attempt, or are absorbed by the platform — needs a decision recorded in [AI COST QUOTA.md](AI%20COST%20QUOTA.md).
- Whether degraded-mode content should ever be cached/reused across requests (for cost/latency) versus always generated fresh from rule-based logic — depends on each engine's own design, not decided here.
- How aggressively a repeatedly-tripping provider should influence its [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) approval status automatically versus requiring manual review — not yet decided.

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md)
- [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md)
- [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md)
- [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md)
- [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md)
- [AI COST QUOTA.md](AI%20COST%20QUOTA.md)
- [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md)
