# Feature Flags & Experimentation

## Purpose
This document defines how MetodePenelitian.com rolls out new capabilities gradually, kills a misbehaving feature instantly, and runs controlled product experiments — without any of that logic leaking into Research Core or the internal engines as scattered `if` statements. It exists so that shipping risk (a new internal engine, a new AI model route, a new provider adapter) can be decoupled from deployment, and so that Core Contract #11's degraded-mode behavior has an explicit, operator-controllable kill switch rather than relying only on automatic failure detection.

## Scope
Covers flag definition and evaluation, staged rollout (percentage, cohort, per-tenant), kill switches for AI-dependent and provider-dependent features, and lightweight product experimentation (A/B assignment and guardrail-metric tracking). Does not cover the deployment pipeline that ships the code a flag gates (that is [36 OBSERVABILITY DEPLOYMENT.md](36%20OBSERVABILITY%20DEPLOYMENT.md)) and does not cover the governance/audit trail of who changed a flag (that is [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md), which records the action; this document owns the flag system itself).

## Responsibilities
- Own flag definition: a named boolean or multivariate toggle, its default value, and its evaluation scope (global, per-organization, per-user, per-plan-tier).
- Own staged rollout mechanics: percentage-based rollout, cohort targeting (e.g. beta users), and per-institution rollout for [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md) tenants who opt into early access.
- Own kill switches specifically for AI- and provider-dependent features, so that a misbehaving new model route or a new Integration Gateway adapter can be disabled platform-wide in seconds without a deploy — the operational lever behind Core Contract #11's degraded-but-functional requirement.
- Own lightweight experiment assignment (which variant a user/session sees) and the guardrail metrics an experiment is checked against before it can roll out fully.
- Own flag lifecycle hygiene: every flag has an owner and an expected removal point once its rollout completes, so flags do not accumulate as permanent hidden branches.

## Non-Responsibilities
- Does not decide product strategy (what to build or test) — this is the mechanism, not the roadmap.
- Does not own statistical experiment design (sample size, significance testing methodology) beyond exposing assignment and guardrail-metric data for it — deeper analysis is a product-analytics concern outside this document tree.
- Does not audit or log who changed a flag — that record lives in [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md)'s Audit Log, which this system emits events into.
- Does not gate entitlement/plan access — a paid-tier-only feature is an entitlement check owned by [33 BILLING ENTITLEMENTS.md](33%20BILLING%20ENTITLEMENTS.md), even though a flag may be layered on top of it during rollout.

## Core Components
- **Flag Registry** — the definitive list of known flags, their type (boolean/multivariate), default, and owning team.
- **Evaluation Engine** — resolves a flag's value for a given context (user, organization, plan tier, session) at request time, fast enough to sit on the hot path without material latency cost.
- **Rollout Controller** — manages percentage/cohort/tenant targeting rules per flag over time (e.g. 5% → 25% → 100%).
- **Kill Switch Panel** — the fast, low-friction subset of the Rollout Controller reserved for emergency disable of AI/provider-dependent features, designed for speed over ceremony.
- **Experiment Assignment Service** — deterministic, sticky variant assignment per user/session for active experiments, plus guardrail-metric tracking hooks.

## Owned Data
| Entity | Notes |
|---|---|
| `Flag` | Definition: name, type, default, owner, target removal milestone. |
| `RolloutRule` | Targeting logic for a flag (percentage, cohort, tenant list, plan tier). |
| `FlagEvaluationLog` | Sampled record of evaluation outcomes, for debugging unexpected behavior, not a full audit trail. |
| `Experiment` | Definition of an active A/B test: flag it rides on, variants, guardrail metrics. |
| `ExperimentAssignment` | Sticky variant assignment per user/session for an active experiment. |

## Inputs
- Flag and experiment definitions authored by engineering/product.
- Evaluation-time context: acting user, organization, plan tier, session — sourced from Platform Core's Authorization Kernel and Entitlement Ledger.
- Kill switch activation requests, typically triggered from an incident in response to signals surfaced by [36 OBSERVABILITY DEPLOYMENT.md](36%20OBSERVABILITY%20DEPLOYMENT.md).

## Outputs
- Flag evaluation results consumed synchronously by any module gating behavior on a flag.
- Experiment variant assignments consumed by the frontend and by any module whose behavior varies by experiment.
- `governance.flag_changed` events consumed by [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md)'s Audit Log.

## Dependencies
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md) for the user/organization/plan-tier context flag evaluation reads.
- [36 OBSERVABILITY DEPLOYMENT.md](36%20OBSERVABILITY%20DEPLOYMENT.md) for the deployment pipeline this system layers rollout control on top of, and for the signals that typically trigger a kill switch.
- [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md) for the audit trail of flag changes.
- [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md) for per-tenant rollout targeting.
- Any internal engine or gateway ([05 MULTI MODEL AI GATEWAY.md](05%20MULTI%20MODEL%20AI%20GATEWAY.md), [25 INTEGRATION GATEWAY.md](25%20INTEGRATION%20GATEWAY.md)) whose new routes or adapters are expected to ship behind a kill-switch-capable flag per Core Contract #11.

## Extension Points
- New targeting dimensions (e.g. discipline/field of study, once that is a first-class attribute) can be added to `RolloutRule` without changing the Evaluation Engine's core interface.
- New experiment types (multi-variant, sequential) can be added to the Experiment Assignment Service without changing how existing boolean flags evaluate.
- The Kill Switch Panel can be wired to automatic triggers later (e.g. auto-disable on a sustained AI Gateway error-rate spike) as an extension, while remaining manually operable from day one.

## Security & Privacy
- Flag evaluation context is limited to what is needed for targeting (user id, organization id, plan tier) — it does not pull research content into the evaluation path.
- Kill switch activation is a privileged action gated by the same operator role model as other governance actions in [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md), not open to any engineer to flip in production without it being attributable.
- Experiment assignment must not become a de facto access-control mechanism — it decides what UI/behavior a user sees, never whether they are authorized to see their own data (that remains the Authorization Kernel's job exclusively).

## Failure Modes
- **Evaluation Engine unavailable**: every flag falls back to its documented default value rather than blocking the request — flag evaluation must never become a single point of failure for the whole platform.
- **Kill switch activated but downstream module doesn't check it**: treated as a defect in that module's integration, since every AI/provider-dependent feature is expected to honor its kill switch per Core Contract #11.
- **Sticky experiment assignment lost (e.g. cache eviction)**: a user may be reassigned; acceptable for low-stakes UI experiments, explicitly disallowed for any experiment touching pricing or entitlement-sensitive behavior.
- **Flag left permanently in a partial rollout state**: treated as tech debt flagged for cleanup via the Flag Registry's ownership/removal-milestone field, not an acceptable steady state.

## Observability
- Flag evaluation latency and cache hit rate (evaluation sits on the hot path and must stay fast).
- Rollout progression per flag (percentage over time) and any kill switch activation event, alerted immediately per [36 OBSERVABILITY DEPLOYMENT.md](36%20OBSERVABILITY%20DEPLOYMENT.md)'s page-worthy classification.
- Experiment guardrail-metric dashboards, to catch a regression before an experiment reaches 100% rollout.
- Count of flags past their target removal milestone, as a hygiene signal.

## P0/P1/P2/P3
**P0.** The kill-switch capability specifically is required for Core Contract #11 to be operationally real rather than aspirational — without a fast way to disable a misbehaving AI/provider-dependent feature, "degraded-but-functional" depends entirely on a full deploy cycle. The broader experimentation tooling built on the same system is a lower-priority convenience layered on top of this same P0 mechanism.

## Current Status
Documented, not implemented. No Flag Registry, Evaluation Engine, or Experiment Assignment Service exists in code yet.

## Open Questions
- Build vs. adopt an existing feature-flag/experimentation platform versus a minimal in-house implementation — not yet decided; any specific vendor would be speculative at this stage.
- Whether experiment assignment needs cross-device consistency (same user, web vs. future mobile) at launch or can start web-only.
- Exact set of guardrail metrics required before any AI-related experiment is allowed to roll out past a small percentage — not yet defined with product.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md)
- [36 OBSERVABILITY DEPLOYMENT.md](36%20OBSERVABILITY%20DEPLOYMENT.md)
- [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md)
- [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md)
