# AI Cost & Quota

## Purpose
This document defines how `AICostTracker`, `AIUsageMeter`, and `AIQuotaManager` account for AI token/request cost internally and enforce plan-level entitlements, so that the platform absorbs and tracks real provider cost variance while users see only plan-level allowances, never raw provider pricing (per [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)'s cost-governance principle).

## Scope
Covers per-request cost calculation, usage metering, quota enforcement against Platform Core's Entitlement Ledger, cost-anomaly detection, and the accounting treatment of retries/fallback/Compare Mode requests. Does not cover the plan/pricing product decisions themselves (owned by Billing & Entitlements in Platform Core) and does not cover provider-side pricing publication accuracy beyond what this document can verify.

## Responsibilities
- Calculate an internal cost estimate for every `AIRequest` based on provider/model, token counts, and any provider-specific pricing metadata tracked for cost-accounting purposes (distinct from the relative cost-tier label in [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md), which is for routing trade-offs, not billing accuracy).
- Meter usage per user, per project, and per organization, rolling up to the unit that plan entitlements are defined against.
- Enforce quota at request time: before a request is dispatched, check remaining entitlement and block or degrade (per [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md)'s degraded-mode contract) rather than allowing unmetered overage by default.
- Detect cost anomalies — a user, project, or org whose usage deviates sharply from historical baseline — and raise alerts before it becomes a large unexpected cost exposure.
- Decide and document the accounting treatment for non-standard request patterns: a fallback retry, a Compare Mode fan-out (multiple models for one logical user request), and a degraded-mode response that still incurred a partial provider cost before failing.

## Non-Responsibilities
- Does not set plan tiers, pricing, or what a given plan's quota number is — that is a Billing & Entitlements / product decision in Platform Core, this document only implements the metering and enforcement mechanics against whatever numbers are set.
- Does not decide model routing — see [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md); this document is a downstream eligibility check and a cost-accounting sink, not a routing decision-maker.
- Does not process actual payment — payment provider integration is a Platform Core / Integration Gateway concern, entirely separate from AI usage metering.
- Does not surface raw provider cost to end users by default — per the cost-governance principle, users see entitlement consumption (e.g. "120 of 500 AI actions used this month"), not dollar-denominated provider cost, except where a plan tier explicitly exposes it.

## Core Components
- **AICostTracker** — computes and records the internal cost estimate for each `AIRequest`/`AIResponse` pair.
- **AIUsageMeter** — aggregates cost/request counts into rolling usage figures per user/project/org.
- **AIQuotaManager** — checks usage against entitlement before dispatch and returns an allow/deny/degrade decision to the Gateway.
- **Cost-Anomaly Detector** — a monitoring component comparing current usage velocity against historical baseline per account, flagging outliers.

## Owned Data
| Entity | Notes |
|---|---|
| `AIUsage` | per-request metered cost/token record, joined to `AIRequestAudit` |
| `AIUsageRollup` | aggregated usage per user/project/org per billing period |
| `AICostAnomalyEvent` | flagged deviation from historical baseline |
| `AIQuotaDecisionLog` | allow/deny/degrade decisions made at dispatch time, for audit |

Entitlement *limits* themselves (the plan's quota number) are owned by Platform Core's Entitlement Ledger, not by this document — this document owns consumption tracking and the enforcement decision, not the limit definition.

## Inputs
- Token counts and provider-reported usage metadata from each Gateway adapter call.
- Provider pricing metadata (rate per token/request), tracked separately from the capability-matrix cost tier and re-verified against provider billing documentation, since pricing changes independently of capability.
- Entitlement/quota limits from Platform Core's Entitlement Ledger.
- Historical usage baselines computed from `AIUsageRollup` history.

## Outputs
- The allow/deny/degrade decision consumed by the Gateway before dispatching a request.
- Usage figures surfaced to users as plan-entitlement consumption (not raw cost) in product UI.
- Cost-anomaly alerts to whoever owns AI Admin / platform operations.
- Aggregated internal cost data feeding platform-level margin/unit-economics review (business-facing, not user-facing).

## Dependencies
- Platform Core's Entitlement Ledger (see [architecture/01 PLATFORM CORE.md](../architecture/01%20PLATFORM%20CORE.md)) — the source of quota limits this document enforces against.
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md) — the component invoking the quota check before every dispatch.
- [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md) and [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md) — cost accounting must reflect retries and fallback attempts these produce.
- [AI COMPARE MODE.md](AI%20COMPARE%20MODE.md) — its fan-out pattern is the primary case requiring explicit multi-model cost-attribution rules.
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) — the cost-governance principle this document implements.

## Extension Points
- New plan tiers or entitlement dimensions are added on the Platform Core side; this document's metering/enforcement mechanics do not need to change to support them, only the limit values they check against.
- A future "AI compute credits" unit (distinct from a simple per-action count) can be layered in as a new usage-rollup dimension without changing the enforcement flow.
- Institution/Enterprise-tier custom quota policies (e.g. pooled org-level quota vs. per-seat quota) can be added as a new rollup grouping.

## Security & Privacy
- Usage and cost records are scoped to the same project-privacy boundary as the underlying research content (Core Contract #9) — usage metadata about a private project is still private, not exposed cross-organization even in aggregate dashboards without appropriate scoping.
- Cost-anomaly alerts must not leak project content in their alert payload — they carry usage volume/velocity signals only, not the AI request/response text itself.
- Provider pricing metadata is business-sensitive and is not exposed to end users in raw form, consistent with the cost-governance principle.

## Failure Modes
- **Quota check bypassed under load** (e.g. a race condition allowing a burst of requests past the limit) — must default to the conservative reading (deny/degrade) under any uncertainty, mirroring Platform Core's Entitlement Ledger drift-handling principle.
- **Cost-tracking gap during a fallback chain** — a request that fails on a primary model but still incurred partial provider cost before failing must still be recorded, or true cost is silently undercounted.
- **Compare Mode cost under-attribution** — if a Compare Mode fan-out to N models is metered as a single request instead of N, quota is effectively bypassed; this is a currently-open decision (see [AI COMPARE MODE.md](AI%20COMPARE%20MODE.md) and Open Questions below), and until resolved must default to metering conservatively (as N requests) rather than assuming the cheaper interpretation.
- **False-positive cost anomaly** — a legitimate large research project (e.g. a systematic review with heavy literature synthesis) triggers an anomaly alert; mitigated by baselining per-project-type patterns over time rather than a single global threshold, though this refinement is not yet designed.

## Observability
- Real-time usage-vs-quota dashboards per user/project/org.
- Cost-anomaly alert feed with drill-down to the triggering usage pattern.
- Quota-deny/degrade event rate, tracked as a product-friction metric (frequent denial on a reasonable-usage plan indicates a pricing/quota mismatch, not just enforcement working correctly).
- Aggregate provider cost vs. plan revenue, tracked at the business level as the platform's core AI unit-economics signal.

## P0/P1/P2/P3
**P0.** Unenforced or miscounted AI cost is a direct, unbounded financial exposure for the platform (Core Contract-adjacent risk called out explicitly in [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)'s failure modes as quota/cost runaway); metering and enforcement must exist before AI features can be safely exposed at any scale, making this foundational rather than a later refinement.

## Current Status
Documented, not implemented. No `AICostTracker`, `AIUsageMeter`, `AIQuotaManager`, or anomaly-detection code exists yet. No plan-tier quota numbers are defined in this document, since those are a Billing & Entitlements product decision, not an AI-architecture one.

## Open Questions
- How Compare Mode's per-model cost is attributed against a user's quota (as one request or as N requests) — explicitly flagged as unresolved in [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) and inherited here as this document's responsibility to resolve.
- Whether fallback retries count against quota the same as the original attempt, or are absorbed by the platform as a reliability cost rather than a user-facing one — not yet decided.
- Exact anomaly-detection thresholds and baselining method — requires real usage data to tune, not decidable from architecture alone.
- Whether any plan tier will ever expose raw provider cost to the user (e.g. an Enterprise cost-transparency feature) — depends on product/billing roadmap, not decided.

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md)
- [architecture/01 PLATFORM CORE.md](../architecture/01%20PLATFORM%20CORE.md)
- [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md)
- [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md)
- [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md)
- [AI COMPARE MODE.md](AI%20COMPARE%20MODE.md)
