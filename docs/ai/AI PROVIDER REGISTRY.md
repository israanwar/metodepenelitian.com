# AI Provider Registry

## Purpose
This document is the authoritative list of AI providers MetodePenelitian.com is permitted to call through the Multi-Model AI Gateway, along with provider-level metadata (approval status, data-retention posture, region, contractual status). No engine, workflow, or admin surface may call a provider that is not listed here as approved.

## Scope
Covers provider-level facts: who the provider is, what its API surface generally offers, its data-retention/training-use posture as publicly documented, its approval status for use on MetodePenelitian.com, and any contractual gap that blocks production use. Does not cover individual model capabilities (see [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md) and [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md)) and does not cover routing logic (see [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md)).

## Responsibilities
- Maintain one record per provider: legal entity, API base surface, approval status (`candidate` / `approved` / `restricted` / `disallowed`), and last-reviewed date.
- Record each provider's publicly documented data-retention and training-use policy for API traffic, distinct from that provider's separate consumer-product policy.
- Flag which providers are usable on private research-project content (Core Contract #9) versus usable only on non-sensitive/aggregate traffic.
- Track contractual state (data-processing agreement signed, in progress, not started) per provider as a launch-readiness gate, without asserting a status this document cannot verify.
- Serve as the single place any engine owner checks before assuming a provider may be called at all — model-level detail lives one layer down.

## Non-Responsibilities
- Does not implement the adapter code that calls any provider's API — that is the Multi-Model AI Gateway's adapter layer (see [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 9).
- Does not list individual models or their capabilities — see [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md).
- Does not decide which provider is chosen for a given task at runtime — see [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md) and [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md).
- Does not set pricing/cost policy — see [AI COST QUOTA.md](AI%20COST%20QUOTA.md).
- Does not cover non-AI third-party providers (scholarly APIs, storage, payments) — see [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md).

## Core Components
- **Provider Record** — the structured entry per provider described below.
- **Approval Workflow** — the (currently manual, undocumented-in-detail) process by which a provider moves from `candidate` to `approved`, owned jointly by engineering and whoever holds legal/procurement responsibility.
- **Data-Retention Flag** — a per-provider boolean/enum consumed by the Gateway to decide whether private project content may ever be sent to that provider at all.

## Provider Registry (current candidates)

| Provider | What it generally offers | Data retention / training-use posture | Approval status | Notes |
|---|---|---|---|---|
| OpenAI | General-purpose LLMs, some with native tool-calling and multimodal input | API traffic is publicly documented as not used for training by default for API customers, subject to standard retention for abuse monitoring; exact current terms are REQUIRES VERIFICATION at contract time | Candidate | No data-processing agreement confirmed for this project. |
| Anthropic | General-purpose LLMs (Claude family), strong long-context and instruction-following | API traffic is publicly documented as not used for training by default for commercial API customers; exact current terms are REQUIRES VERIFICATION at contract time | Candidate | No data-processing agreement confirmed for this project. |
| Google (Gemini) | General-purpose and multimodal LLMs, deep integration with Google's own tooling | Retention/training-use terms vary by API tier (consumer vs. paid enterprise tier); exact current terms are REQUIRES VERIFICATION at contract time | Candidate | Tier selection (consumer vs. enterprise) materially changes the privacy posture and must be pinned explicitly once contracted. |
| DeepSeek | Cost-efficient general-purpose and reasoning-oriented LLMs | Data residency and retention posture is REQUIRES VERIFICATION; this is a materially different jurisdiction/policy profile than the US-based providers above and needs explicit legal review before any private project content is routed to it | Candidate, restricted pending review | Treat as cost/throughput option for non-sensitive or already-public content until reviewed; never assume equivalence with OpenAI/Anthropic/Google on data handling. |
| Mistral | Open-weight-lineage and hosted general-purpose LLMs, competitive latency | Retention/training-use terms are REQUIRES VERIFICATION | Candidate | Considered primarily for cost-tier and EU-hosting-option scenarios; EU hosting claim itself is REQUIRES VERIFICATION per current offering. |
| Perplexity | Search-augmented answer generation with citations | Not a general-purpose LLM provider in the same sense as the above; relevant mainly as a retrieval/answer-with-citations pattern reference, not as MetodePenelitian.com's citation-grounding mechanism (see [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md)) | Candidate, narrow use case only | Any use must not be conflated with the platform's own scholarly-data ingestion, which is normalized into `ResearchReference` per Core Contract #6, not sourced from a search-answer provider directly. |
| Groq | Inference infrastructure offering very low-latency serving of open-weight models | Groq is an inference host, not itself a model developer; the underlying model's own provider terms may also apply and must be checked separately | Candidate | Primary interest is latency-sensitive interactive tasks (e.g. inline suggestions), not accuracy-critical synthesis tasks. |

## Owned Data
- `AIProvider` (approval status, region, retention flag, last-reviewed date, contractual state) — this is the canonical source for the table above; the table itself is a human-readable rendering of that record set.

## Inputs
- Provider public documentation and terms of service, re-checked on a defined review cadence (cadence itself is an open question below).
- Legal/procurement sign-off status per provider.
- Incident/behavior reports that could downgrade a provider's approval status (e.g. an observed retention-policy violation).

## Outputs
- The `approved` provider list consumed by `AIModelRouter` and `AIFallbackManager` as the outer boundary of what any model selection may consider.
- The retention-flag consumed by the Gateway to block private-project content from being sent to a provider not cleared for it.
- Launch-readiness input for [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)'s open question on which providers have a signed data-processing agreement before launch.

## Dependencies
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) — the governing document this registry implements.
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md) — the component that enforces this registry at runtime.
- [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md) — the next layer down (models within an approved provider).
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) — general data classification rules that inform the retention-flag policy.
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) — the Integration Gateway all outbound provider traffic (AI and non-AI) passes through.

## Extension Points
- A new provider is added as a new `AIProvider` row with `candidate` status; it gains no runtime traffic until moved to `approved`.
- A provider can be moved to `restricted` (usable for a narrow task class only) without a full re-approval cycle, e.g. non-sensitive content only.
- A future partnership provider (e.g. a national research infrastructure AI service) is onboarded through this same record shape, per Core Contract #10's modular-monolith baseline and the no-special-casing rule in [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md).

## Security & Privacy
- The retention-flag is the mechanism that operationalizes "research project data is private by default" (Core Contract #9) at the provider-selection level: a provider without a cleared retention posture must never receive private project content, regardless of how well it would perform the task.
- Provider credentials themselves are never stored in this document or its underlying table — they live in the secrets vault behind the Integration Gateway.
- Any provider whose jurisdiction or retention terms are unverified (marked REQUIRES VERIFICATION above) must be treated as unapproved for private content until verification closes, not as approved-by-default.

## Failure Modes
- **Stale approval status** — a provider's terms change after review and the registry is not updated; mitigated only by the review cadence defined below (currently an open question), which is a real gap until resolved.
- **Provider marked approved without an actual signed agreement** — a process failure, not a technical one; mitigated by treating `approved` status and `contractual state = signed` as two distinct fields, so a reviewer cannot conflate "seems fine publicly" with "we have a signed agreement."
- **Over-broad approval** — approving a provider for all task types when it should be restricted (e.g. non-sensitive-only) — mitigated by the `restricted` status tier rather than a binary approved/disallowed choice.

## Observability
- Count of AI requests per provider, cross-checked against this registry's approval status to catch any request that reached a non-approved provider (would indicate a Gateway enforcement bug).
- Age-since-last-review per provider record, surfaced so a stale entry is visible before it becomes a compliance gap.
- Approval-status change log (who changed it, when, why) for audit purposes.

## P0/P1/P2/P3
**P0.** No AI call anywhere in the platform is safe to make without a settled answer to "is this provider even allowed to receive this content." This registry is the outermost gate before any model-level or task-level decision, making it foundational and required before any AI feature ships.

## Current Status
Documented, not implemented. No `AIProvider` table, approval workflow, or enforcement code exists yet. The provider list above reflects publicly known providers under consideration, not contracted or verified relationships.

## Open Questions
- Review cadence for re-checking each provider's public terms (quarterly, on-terms-change-notice, or ad hoc) — not yet decided.
- Who holds sign-off authority to move a provider from `candidate` to `approved` — not yet assigned.
- Whether DeepSeek's data-residency posture is compatible with private Indonesian academic research data at all — REQUIRES VERIFICATION and a legal decision before it can be used beyond non-sensitive tasks.
- Whether Google Gemini will be contracted at the consumer or enterprise API tier — materially changes its retention posture and is undecided.
- Whether a local/regional Indonesian AI provider should be added as a future candidate for data-residency or policy reasons — not yet evaluated.

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md)
- [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md)
- [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md)
- [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md)
- [AI FALLBACK STRATEGY.md](AI%20FALLBACK%20STRATEGY.md)
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
