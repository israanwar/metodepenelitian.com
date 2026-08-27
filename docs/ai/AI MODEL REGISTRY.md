# AI Model Registry

## Purpose
This document lists the specific AI models MetodePenelitian.com is permitted to route requests to, scoped to providers already listed in [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md), and tracks each model's lifecycle state (candidate, approved, deprecated, retired). It is the record `AIModelRouter` consults to know which exact model identifiers exist to route to.

## Scope
Covers model-level identity and lifecycle: model name/version identifier, which provider owns it, its lifecycle state, and the date it entered or is scheduled to leave each state. Does not cover what a model can do (context window, tool-calling, multimodality — see [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md)) and does not cover when a model is chosen for a task (see [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md)).

## Responsibilities
- Maintain one record per model: provider, model identifier, lifecycle state, date added, and deprecation/retirement date if applicable.
- Track model versioning so a provider's silent model updates (e.g. a provider rotating what a stable alias points to) are noticed and reviewed rather than silently trusted.
- Own the deprecation process: a model moving to `deprecated` continues serving existing routing configuration but is flagged so `AI ROUTING POLICY.md` configurations get migrated off it before `retired`.
- Provide the exact identifier strings the Gateway's adapter layer uses when calling a provider — this document is the source of truth for "does this model identifier still exist and is it still allowed," not a place to guess current provider-side identifiers from memory.

## Non-Responsibilities
- Does not decide provider-level approval — that is [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md); a model cannot be `approved` here if its provider is not `approved` there.
- Does not describe capability metadata (context window, latency class, cost tier) — see [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md).
- Does not implement the adapter call itself — see the Multi-Model AI Gateway's adapter layer ([MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 9).
- Does not decide fallback ordering — see [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md).

## Core Components
- **Model Record** — provider, identifier, lifecycle state, dates.
- **Deprecation Tracker** — the set of models in `deprecated` state and which routing configurations still reference them, so nothing silently breaks on retirement.
- **Model-Family Grouping** — a loose grouping of a provider's models by generation/tier, used for human-readable reference in this document only (not a runtime construct).

## Model Registry (illustrative — exact current model identifiers are provider-published and change over time; treat any specific model name below as REQUIRES VERIFICATION at implementation time, not as a pinned production value)

| Provider | Model tier (illustrative) | General fit | Lifecycle state |
|---|---|---|---|
| Anthropic | Claude family, current-generation flagship and smaller/faster tier | Long-context reasoning, careful instruction-following, methodology/writing-review style tasks | Candidate |
| OpenAI | GPT family, current-generation flagship and smaller/faster tier | General reasoning, broad tool-calling ecosystem support | Candidate |
| Google | Gemini family, current-generation flagship and smaller/faster tier | Multimodal input (figures, scanned documents), large context | Candidate |
| DeepSeek | Current-generation general and reasoning-oriented tier | Cost-efficient reasoning tasks, non-sensitive content only pending provider review | Candidate, restricted per provider registry |
| Mistral | Current-generation general-purpose tier | Cost-tier alternative, latency-sensitive tasks | Candidate |
| Perplexity | Search-augmented answer models | Narrow use only, not the platform's citation-grounding mechanism | Candidate, narrow use case |
| Groq | Hosted open-weight models served on Groq's low-latency infrastructure | Latency-sensitive interactive tasks, not primary synthesis tasks | Candidate |

## Owned Data
- `AIModel` (provider reference, identifier, lifecycle state, added/deprecated/retired dates).
- `AIModelChangeLog` — a record of when a model's lifecycle state changed and why (new provider release, quality regression, provider-side retirement notice).

## Inputs
- Provider release/deprecation announcements (external, must be actively monitored — this registry is only as fresh as its last review).
- Evaluation results from [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md) that recommend adding, deprecating, or restricting a model.
- Provider approval changes from [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) that cascade to all of that provider's models.

## Outputs
- The concrete model identifier list `AIModelRouter` selects from when resolving a routing rule to an actual API call.
- Deprecation notices consumed by whoever maintains [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md) and [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md) configurations, so a routing rule is migrated before its target model is retired.
- Model-family metadata consumed by [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md) as the join key for capability data.

## Dependencies
- [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) — a model can only exist here under an approved-or-restricted provider.
- [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md) — the capability data joined to each model listed here.
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md) — the runtime component consuming this registry.
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) — the governing document this registry implements.

## Extension Points
- New models from an already-approved provider are added as `candidate` and promoted to `approved` after capability data is filled in and, where relevant, an evaluation run.
- A provider's new model generation is added alongside the prior generation rather than replacing it in place, so in-flight routing/evaluation configurations are not silently redirected.
- A model can be `restricted` to specific task types (mirroring the provider-level restriction pattern) without a full separate lifecycle state.

## Security & Privacy
- A model's lifecycle state does not override its provider's retention/privacy posture — a `candidate` or `approved` model under a provider still marked unverified for private content in [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) may not receive private project content regardless of its own listing here.
- Model identifiers and version pins are logged with every `AIRequest` so a later-discovered issue with a specific model version can be traced to exactly which requests used it.

## Failure Modes
- **Silent provider-side model rotation** — a provider changes what a stable-looking alias points to without an explicit version bump; mitigated only by pinning explicit versioned identifiers where a provider offers them, and by evaluation-run monitoring catching a quality shift.
- **Referencing a retired model in an active routing rule** — mitigated by the Deprecation Tracker surfacing which routing configurations still reference a soon-to-be-retired model before retirement date.
- **Registry drift from actual provider catalog** — this document going stale relative to what providers actually currently offer; mitigated only by an active review cadence (open question, see below).

## Observability
- Count of requests per model identifier, cross-referenced against lifecycle state to flag any request routed to a `deprecated` or `retired` model (should not happen and indicates a Gateway or configuration bug).
- Time-since-last-catalog-review per provider.
- Evaluation-run history per model (linking to [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md)) so a quality regression tied to a specific model version is visible.

## P0/P1/P2/P3
**P0.** The router cannot resolve any task-to-model decision without a concrete, current list of what models actually exist and are allowed. This is foundational plumbing beneath every AI-touching feature, not an advanced capability.

## Current Status
Documented, not implemented. No `AIModel` table or deprecation-tracking process exists yet. The illustrative table above intentionally avoids pinning specific current model version strings, since those are provider-published values that change frequently and would go stale immediately if hard-coded here.

## Open Questions
- Review cadence for re-syncing this registry against each provider's actual current model catalog — not yet decided.
- Whether to pin exact dated model versions (safer, requires more maintenance) or provider "latest stable" aliases (less maintenance, more silent-drift risk) — not yet decided, likely varies per task criticality.
- Who owns triggering the deprecation-migration process when a provider announces retirement of a model in active use — not yet assigned.

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md)
- [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md)
- [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md)
- [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md)
- [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md)
- [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md)
