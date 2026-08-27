# Multi-Model AI Gateway

## Purpose
The Multi-Model AI Gateway is the single, provider-agnostic chokepoint through which every AI model call in the Research OS is made (Core Contract #3). No module — not an internal engine, not the Research AI Orchestrator, not the frontend — calls an AI provider directly. The Gateway exists so that MetodePenelitian.com can support multiple underlying AI providers/models, let users or engines choose between them, compare their outputs, and swap or add providers over time, without any of that variability ever leaking into Research Core or the internal engines' domain logic.

## Scope
Covers model selection (AUTO routing and explicit selection), the compare-mode contract, bring-your-own-key (BYOK) handling, request/response normalization across providers, quota/entitlement enforcement, and provider failover. Does not cover *what* an engine asks the model to do (that's the internal engine's domain logic) and does not cover tool execution (that is the [AI Tool Calling Engine](./06%20AI%20TOOL%20CALLING%20ENGINE.md), which the Gateway invokes as a distinct step, not something it does itself).

## Responsibilities
- Expose one uniform internal API for "make an AI call" that every caller (Orchestrator, internal engines) uses identically regardless of which model ultimately serves it.
- Implement **AUTO model selection**: given a request's type, size, and engine-declared quality/cost/latency preference, choose a suitable underlying model without the caller having to know provider specifics.
- Implement **explicit model selection**: allow a caller (ultimately a user, via a feature surface) to pin a specific provider/model for a given request when AUTO is not desired.
- Implement **compare mode**: dispatch the same request to two or more models in parallel and return normalized, side-by-side results, without the calling engine needing separate integration logic per model.
- Implement **BYOK (bring your own key)**: allow an organization or user to supply their own provider API key so their usage bills against their own account rather than the platform's, while still passing through the same Gateway contract (routing, normalization, logging) as platform-key calls.
- Normalize every provider's request/response shape into one internal representation so that Research Core and internal engines never see provider-specific formats.
- Enforce entitlement/quota checks (via Platform Core) before dispatching a call, and enforce per-provider rate limits.
- Implement failover: if a selected/AUTO-routed provider is unavailable or errors, retry against an alternate provider where the request is provider-agnostic, consistent with the degraded-but-functional principle (Core Contract #11).
- Log every AI call (provider, model, tokens, cost, latency, requesting engine, project id, context version) for cost accounting, debugging, and governance.

## Non-Responsibilities
- Does not decide *why* a call is being made or interpret the domain meaning of the response — that is the calling engine's job.
- Does not talk to non-AI third-party services (scholarly databases, publishers) — those go through the Integration Gateway, a distinct component from this one.
- Does not execute tools/functions itself — tool execution is delegated to the AI Tool Calling Engine; the Gateway only carries tool-call requests/results through to the model as part of the normalized protocol.
- Does not own long-term conversational memory — it dispatches single calls; memory assembly belongs to [AI Memory & Context](./07%20AI%20MEMORY%20CONTEXT.md) and the [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md), which are inputs to a call, not the Gateway's own state.
- Does not let provider-specific implementation details leak upward (Core Contract #12) — any provider quirk (prompt formatting, token limits, tool-call schema differences) is absorbed inside the Gateway's adapter layer and never exposed to Research Core.

## Core Components
- **Provider Adapter Layer** — one adapter per supported AI provider, each translating the internal normalized request/response into that provider's actual API shape. This is the only place provider-specific code is allowed to exist (Core Contract #12).
- **AUTO Router** — selection logic mapping request characteristics (task type, declared quality/cost/latency preference from the calling engine, context size) to a concrete model, without the caller specifying one.
- **Explicit Selection Handler** — validates and honors a caller-specified model/provider, subject to entitlement checks.
- **Compare Orchestrator** — fans a single logical request out to N models in parallel, normalizes each response, and returns them as a labeled set.
- **BYOK Key Vault Interface** — resolves which credential (platform key vs. organization-supplied key) to use for a given call; the actual secret storage/encryption lives behind Platform Core's credential handling, not duplicated here.
- **Quota/Entitlement Gate** — pre-dispatch check against Platform Core's Entitlement Ledger; blocks or downgrades calls that would exceed a plan's allowance.
- **Failover Controller** — detects provider errors/unavailability and retries against a configured alternate, where the request is not pinned to a provider-specific capability.
- **Call Ledger** — structured log of every call's metadata (not full content by default) for cost, performance, and governance reporting.

## Owned Data
| Entity | Notes |
|---|---|
| AICallLog | per-call metadata: provider, model, engine, project id, context version, tokens, cost, latency, status |
| ModelRoutingPolicy | AUTO-selection rules, versioned |
| ProviderHealthState | rolling availability/error-rate per provider, used by AUTO Router and Failover Controller |
| BYOKCredentialReference | pointer to a securely stored org/user-supplied key; the Gateway does not itself define secret storage |

## Inputs
- Normalized requests from the [Research AI Orchestrator](./04%20RESEARCH%20AI%20ORCHESTRATOR.md), each carrying a Project Context Engine snapshot, the calling engine's identity, and either an AUTO/explicit/compare selection mode.
- Tool-call results relayed from the [AI Tool Calling Engine](./06%20AI%20TOOL%20CALLING%20ENGINE.md) mid-conversation, where the model's turn requires a tool round-trip.
- Entitlement/quota state from Platform Core.
- BYOK credential references, where applicable, from Platform Core's credential handling.

## Outputs
- Normalized model responses (single, for AUTO/explicit; a labeled set, for compare mode) returned to the Orchestrator.
- `AICallLog` entries for observability and cost accounting.
- Provider health signals consumed by the AUTO Router and Failover Controller.

## Dependencies
- [Platform Core](./01%20PLATFORM%20CORE.md) for entitlement checks and BYOK credential resolution.
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md) indirectly, via context snapshots attached to every request by the Orchestrator.
- [AI Tool Calling Engine](./06%20AI%20TOOL%20CALLING%20ENGINE.md) for tool round-trips within a model conversation.
- Underlying AI providers via the Provider Adapter Layer — the specific providers integrated are an implementation/partnership decision tracked in [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md), not enumerated here; no specific provider commitment should be assumed from this document.
- See [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) for the governance rules this Gateway is built to enforce (Core Contract #3).

## Extension Points
- New providers are added as a new Provider Adapter without changing the AUTO Router's decision surface beyond registering the new model's characteristics.
- New AUTO-routing signals (e.g. a future per-organization cost-preference setting) extend `ModelRoutingPolicy` without changing the adapter contract.
- Compare mode can be extended to more than two models, or to compare across BYOK vs. platform-key results for the same model, without new integration work per provider.
- New entitlement dimensions (e.g. model-tier gating on a subscription plan) hook into the existing Quota/Entitlement Gate.

## Security & Privacy
- All provider credentials (platform and BYOK) are resolved and injected inside the Gateway/Adapter boundary — never passed to or stored by Research Core, internal engines, or the frontend (Core Contract #5, applied one layer down: the frontend never even sees which provider served a call).
- BYOK credentials are logically isolated per organization; a BYOK key is used only for calls belonging to that organization's projects and never pooled with platform-key traffic.
- `AICallLog` stores call metadata for cost/governance purposes; whether and how full prompt/response content is retained is a data-retention decision owned by [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md), not decided unilaterally by this document.
- Every call inherits the requesting project's private-by-default access rules (Core Contract #9) — the Gateway itself performs no additional visibility logic but must never be a path that bypasses Research Core's authorization.

## Failure Modes
- Selected/AUTO-routed provider unavailable: Failover Controller retries against a configured alternate model; if none is viable, the calling engine is told to run in its degraded-but-functional mode (Core Contract #11) rather than the Orchestrator returning a hard failure to the user where avoidable.
- BYOK credential invalid/expired: the call fails explicitly and is not silently rerouted to the platform key, since that would mis-attribute cost/billing.
- Compare mode partial failure (one of N models errors): the Gateway returns the successful results with the failed one clearly marked, rather than failing the entire compare request.
- Quota exceeded: the call is blocked pre-dispatch with a clear entitlement-denied reason, never partially executed then billed.

## Observability
- Per-provider call volume, latency, error rate, and cost, broken out by AUTO vs. explicit vs. compare mode.
- AUTO Router selection distribution (which models AUTO actually picks in practice, to validate routing policy over time).
- BYOK vs. platform-key call volume per organization.
- Failover trigger rate per provider (an early signal of a provider degrading before it fully fails).
- Quota-denied rate per organization/plan tier.

## P0/P1/P2/P3
**P0** for the routing/dispatch/normalization core (AUTO and explicit single-model calls) — this is Core Contract #3's enforcement point and every AI feature in the product depends on it existing and being provider-agnostic.
**P1** for compare mode — a major product capability (letting users/engines see multiple models' takes) but not required for the platform's core AI features to function.
**P1** for BYOK — a major capability for institutional/power-user adoption and cost control, not required for the Gateway's baseline operation.

## Current Status
Documented, not implemented. No provider adapters, routing policy, or call ledger exist yet; this document defines the intended contract — including AUTO/explicit/compare/BYOK behavior — ahead of implementation. No specific AI provider integration should be assumed as committed based on this document.

## Open Questions
- Which AI providers are integrated first, and in what order — an implementation/partnership decision, not an architectural one, and UNKNOWN as of this document.
- Exact AUTO-routing scoring function (how quality/cost/latency preferences are weighted) is not yet designed.
- Whether compare mode is a user-facing feature from day one or an internal-only capability used for provider evaluation initially.
- BYOK key storage/encryption implementation details — owned jointly with Platform Core's credential handling, not finalized here.
- Cost-attribution model for compare mode (does comparing 3 models bill 3x, and how that interacts with entitlement quotas).

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [Platform Core](./01%20PLATFORM%20CORE.md)
- [Research AI Orchestrator](./04%20RESEARCH%20AI%20ORCHESTRATOR.md)
- [AI Tool Calling Engine](./06%20AI%20TOOL%20CALLING%20ENGINE.md)
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md)
