# AI Routing Policy

## Purpose
This document defines how `AIModelRouter`, inside the Multi-Model AI Gateway, selects a model in AUTO mode for a given AI task, and how an explicit user model choice (in Compare Mode or a manual override) is honored instead. It is the decision layer between "here is a task" and "here is which approved model handles it."

## Scope
Covers task-type classification, the AUTO-mode selection rule per task type, and the precedence between AUTO selection and explicit user choice. Does not cover what happens when the selected model or provider is unavailable (see [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md)) and does not cover cost enforcement at routing time beyond referencing quota state (see [AI COST QUOTA.md](AI%20COST%20QUOTA.md)).

## Responsibilities
- Define the task-type taxonomy used to classify an incoming AI request (e.g. literature synthesis, statistical reasoning support, writing review, methodology advisory, citation extraction, quick inline suggestion).
- Define, per task type, the required capability profile (from [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md)) and a preference ordering among approved models that satisfy it.
- Define how `AITaskClassifier` output feeds `AIModelRouter`'s selection, and what happens when classification is ambiguous (default to a conservative, broadly-capable model rather than guessing narrowly).
- Define the precedence rule: an explicit user-selected model (where the product allows model choice) overrides AUTO selection, subject to that model still being approved and the request still being within quota.
- Define how project-level or task-level context (e.g. a project already flagged as needing a specific data-handling posture) can constrain which models are even eligible before preference ordering is applied.

## Non-Responsibilities
- Does not decide which providers/models exist or their capability data — see [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md), [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md), [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md).
- Does not handle provider outage or degraded health — that is [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md), which activates after this policy's selection fails to execute.
- Does not enforce quota limits itself — it reads quota state from `AIQuotaManager` ([AI COST QUOTA.md](AI%20COST%20QUOTA.md)) as an eligibility filter but does not own quota accounting.
- Does not implement Compare Mode's fan-out mechanics — see [AI COMPARE MODE.md](AI%20COMPARE%20MODE.md), which is a distinct request pattern layered on top of routing, not a replacement for it.

## Core Components
- **AITaskClassifier** — classifies an incoming request into one of the defined task types, based on the calling engine's declared intent (an engine declares what kind of task it is requesting, it is not inferred purely from free text).
- **Task-Type → Capability Profile Map** — the table mapping each task type to required capability dimensions and preferred model ordering.
- **AIModelRouter** — the component that takes a classified task, applies the map, filters by provider/project eligibility, and returns a selected model to the Gateway's adapter layer.
- **Explicit-Choice Override Path** — the branch that bypasses AUTO selection when a user or admin has picked a specific model, still subject to approval/eligibility checks.

## Task-Type → Routing Intent (illustrative, not exhaustive)

| Task type | Routing intent |
|---|---|
| Literature synthesis / evidence summarization | Prefer large-context, strong-instruction-following models; grounding in [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md) is mandatory downstream regardless of model chosen. |
| Statistical/methodology reasoning support | Prefer models with better-evaluated reasoning task-fit per [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md); never the sole basis for a statistical conclusion presented as authoritative — advisory framing is enforced by the calling engine, not this policy. |
| Writing review / style feedback | Broadly capable models are typically sufficient; latency and cost tier weigh more heavily here than for synthesis tasks. |
| Citation extraction / structuring | Prefer models with strong structured-output support per the Capability Matrix, since output must parse cleanly into `ResearchReference` fields. |
| Quick inline suggestion (e.g. autocomplete-style assist) | Prefer fast-latency-tier models; quality bar is lower-stakes than synthesis or citation tasks. |
| Multimodal document/figure interpretation | Requires a model flagged multimodal=image in the Capability Matrix; non-multimodal models are ineligible regardless of other preference. |

## Owned Data
- `AIRoutingPolicy` (task type, required capability profile, preferred model ordering, effective date, version).
- `AIRoutingDecisionLog` — a lightweight record of which task type and which selected model applied to a given `AIRequest`, joined for evaluation and audit purposes (distinct from the full `AIRequestAudit` trail owned by the Gateway itself).

## Inputs
- Task-type intent declared by the calling engine (Methodology Advisor, Analysis Advisor, Evidence Synthesis, etc.) when it invokes the Gateway.
- Current approved model list and capability data from [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md) and [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md).
- Quota/eligibility state from `AIQuotaManager`.
- Explicit user or admin model choice, where the product surface allows it.
- Evaluation-driven preference-ordering adjustments from [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md).

## Outputs
- A single selected model (provider + model identifier) handed to the Gateway's adapter layer for the actual API call.
- The routing decision record, feeding both audit and evaluation sampling.
- A "no eligible model" signal when no approved model satisfies a task's required capability profile under current constraints, which the calling engine must handle as a degraded-mode case per Core Contract #11, not a hard failure.

## Dependencies
- [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md), [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md), [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md) — the eligibility and capability inputs this policy filters against.
- [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md) — activates when this policy's selected model cannot actually be reached.
- [AI COST QUOTA.md](AI%20COST%20QUOTA.md) — quota eligibility check consumed before finalizing selection.
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md) — the component hosting `AIModelRouter`.
- [Project Context Engine](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md) — supplies project-level context that may constrain eligible models (e.g. a project flagged for a stricter data-handling posture).

## Extension Points
- New task types are added to the classification taxonomy and the routing map without changing the Gateway's external contract, per [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)'s extension-point guidance.
- Preference ordering per task type can be revised independently as evaluation evidence accumulates, without touching the classifier.
- A future institution/plan-tier routing override (e.g. Enterprise plan defaults to a higher-cost preferred model) can be layered as an eligibility filter ahead of the standard preference ordering.

## Security & Privacy
- Eligibility filtering must apply the provider retention-flag from [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) before preference ordering — a model cannot be selected for private project content if its provider is not cleared for that content, regardless of how well-suited it is otherwise.
- The routing decision log records which model handled a request but does not itself store the request/response content — content logging is the Gateway's `AIRequestAudit` responsibility, scoped per [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) Security & Privacy rules.

## Failure Modes
- **No eligible model for a task** (e.g. a multimodal task with all multimodal-capable providers currently restricted for that project's data-handling tier) — the calling engine must degrade per Core Contract #11 rather than the router forcing an unsuitable or non-compliant model.
- **Misclassification by AITaskClassifier** — routes a task to a model tuned for the wrong kind of work; produces a quality problem, not a hard error, and is the primary signal [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md) sampling is meant to catch.
- **Stale preference ordering** — a routing rule keeps preferring a model that evaluation has since shown underperforms for a task type; mitigated by a defined revision cadence tied to evaluation-run outputs (cadence itself an open question).
- **Explicit user choice conflicting with eligibility** — a user selects a model not actually eligible for their project's data posture; must be rejected or substituted with a clear reason shown to the user, never silently overridden without explanation.

## Observability
- Distribution of task types routed and which model each resolved to, over time.
- "No eligible model" event rate per task type, surfaced as a signal that either capability coverage or provider approval breadth needs attention.
- Divergence rate between AUTO selection and explicit user override, useful for understanding whether AUTO defaults match user preference.
- Routing-decision-to-evaluation-outcome linkage, so a routing rule change's quality impact is measurable.

## P0/P1/P2/P3
**P0.** Every AI-touching feature depends on routing resolving to *some* correctly-eligible model; incorrect eligibility filtering (e.g. sending private content to a non-cleared provider) is a privacy failure, and this is the layer that must get that gate right before any task-quality refinement matters.

## Current Status
Documented, not implemented. No `AITaskClassifier`, `AIModelRouter`, or routing-decision logging exists yet. The task-type table above is illustrative of the intended taxonomy, not a final specification.

## Open Questions
- Final task-type taxonomy granularity — the illustrative list above may be too coarse or too fine once real engine usage patterns are known.
- Whether AITaskClassifier is engine-declared (an engine states its own task type) or content-inferred (the classifier guesses from the request) — this document currently assumes engine-declared as the safer default, but this is not finalized.
- Revision cadence for preference-ordering updates driven by evaluation results — not yet decided.
- How project-level data-handling tiers (once defined) map precisely onto provider-eligibility filtering — depends on [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) decisions not yet finalized.

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md)
- [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md)
- [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md)
- [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md)
- [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md)
- [AI COST QUOTA.md](AI%20COST%20QUOTA.md)
- [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md)
