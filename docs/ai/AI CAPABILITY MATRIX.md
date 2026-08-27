# AI Capability Matrix

## Purpose
This document defines the capability metadata schema used to describe every approved model in [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md) — context window, multimodality, structured-output support, tool-calling support, latency class, and relative cost tier — so `AIModelRouter` can match a task's requirements to a suitable model without hard-coding provider-specific knowledge into any engine.

## Scope
Covers the capability dimensions tracked per model and how they are represented for routing purposes. Does not cover which provider/model exists at all (see [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md)) and does not cover how a task type maps to a required capability profile (see [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md), which consumes this matrix).

## Responsibilities
- Define the fixed set of capability dimensions every model record must have a value for before it can move to `approved` in the Model Registry.
- Keep capability values honest and current: a claimed capability (e.g. "supports structured JSON output") must reflect actually-documented provider behavior, not an assumption.
- Represent latency and cost as *relative tiers* (e.g. fast/standard/slow, low/medium/high) rather than fabricated absolute benchmark numbers this document cannot verify.
- Give `AIModelRouter` a stable schema to query against ("give me approved models with tool-calling = yes and context window >= X") regardless of which provider ends up matching.

## Non-Responsibilities
- Does not run benchmarks or produce quality scores — quality measurement is [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md)'s responsibility, not this static capability metadata.
- Does not decide task-to-model routing rules — see [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md).
- Does not track pricing in absolute currency terms — see [AI COST QUOTA.md](AI%20COST%20QUOTA.md) for cost accounting; this document only carries a relative cost-tier label used for routing trade-offs.
- Does not track provider approval or data-retention posture — see [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md).

## Core Components
- **Capability Dimension Schema** — the fixed field list every model record carries (below).
- **Capability Value Source** — for each field, whether the value is "provider-documented" (confident) or "REQUIRES VERIFICATION" (not yet confirmed against current provider docs); no field may silently mix the two without marking which it is.

## Capability Dimension Schema

| Dimension | What it represents | How it is expressed |
|---|---|---|
| Context window | Maximum input+output token budget the model supports | Relative tier: small / standard / large / very large — exact token counts are provider-published and change over time, so this document tracks the tier, not a hard-coded number, to avoid going stale |
| Multimodality | Whether the model accepts image/document input beyond plain text | Boolean per modality: text, image, (other modalities as providers add them) |
| Structured-output support | Whether the model reliably supports constrained/structured output (e.g. JSON schema adherence) | Boolean + confidence note, since "supports" varies in strictness across providers |
| Tool-calling support | Whether the model supports native function/tool-calling | Boolean; relevant to [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md) enforcement upstream of any actual tool grant |
| Latency class | Typical response-time bracket for interactive use | Relative tier: fast / standard / slow — no absolute millisecond figures asserted here, since these vary by load and are not something this document can verify generally |
| Relative cost tier | Cost position versus other approved models for the same task class | Relative tier: low / medium / high — actual metered cost accounting is [AI COST QUOTA.md](AI%20COST%20QUOTA.md)'s responsibility |
| Reasoning/task fit notes | Free-text notes on where the model tends to be well- or poorly-suited (e.g. "strong at long-document synthesis," "weaker at numerical statistical reasoning") | Free text, sourced from evaluation results where available, otherwise marked as provider-reputation-based and not yet internally verified |

## Honest Capability Notes (general, non-benchmark)
- **Anthropic (Claude family)**: generally documented for strong long-context handling and careful instruction-following; specific context-window sizes and current tool-calling behavior are provider-published and should be pulled fresh at implementation time rather than assumed from this document.
- **OpenAI (GPT family)**: broad ecosystem support for tool-calling and structured output; specific context-window sizes and multimodal support vary by exact model tier and are REQUIRES VERIFICATION per model.
- **Google (Gemini family)**: documented strength in large-context and native multimodal (image/document) input; exact context-window figures and structured-output guarantees are REQUIRES VERIFICATION per model and API tier.
- **DeepSeek**: documented as competitive on reasoning-style tasks at lower relative cost; tool-calling maturity and structured-output guarantees are REQUIRES VERIFICATION.
- **Mistral**: general-purpose models with a documented low-latency profile in some tiers; exact context-window and structured-output support per current model are REQUIRES VERIFICATION.
- **Perplexity**: fits a search-augmented-answer capability profile rather than the general dimensions above; not directly comparable to the other rows on this matrix and should not be selected by the same routing logic as general synthesis tasks.
- **Groq**: not a model developer but an inference host; its capability profile is inherited from whichever open-weight model it is serving, plus a documented latency advantage from its inference hardware — the underlying model's own capability entry still applies for context window, multimodality, etc.

## Owned Data
- `AIModelCapability` (one row per model, joined to `AIModel` in [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md), carrying the schema above).

## Inputs
- Provider API documentation, re-pulled at model-approval time and on the review cadence.
- Evaluation-run findings from [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md) that refine the free-text task-fit notes over time based on observed platform-specific performance, not just provider claims.

## Outputs
- The queryable capability profile `AIModelRouter` filters candidate models against when resolving a task type's requirements per [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md).
- The tool-calling flag consumed as a precondition (not sole authorization) by [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md).

## Dependencies
- [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md) — the model records this capability data attaches to.
- [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md) — the primary consumer of this matrix.
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md) — the runtime component that queries this matrix.
- [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md) — the source of empirically-observed task-fit refinements.

## Extension Points
- New capability dimensions (e.g. a future "supports extended thinking / reasoning-trace output" flag) are added as new schema columns without breaking existing routing rules that don't reference them.
- New modalities (audio, video) are added as new boolean fields under Multimodality as providers introduce them.
- Task-fit notes are expected to be revised continuously as [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md) accumulates platform-specific evidence, distinct from initial provider-reputation-based notes.

## Security & Privacy
- This document carries no credentials or user data; it is purely model-capability metadata.
- Tool-calling capability being `true` is a necessary but not sufficient condition for a model to actually be granted tool access on a given request — the actual authorization decision belongs to [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md) and must also respect role/plan/project-access rules.

## Failure Modes
- **Stale capability claim** — a provider changes a model's actual context window or tool-calling behavior and this matrix is not updated, causing the router to make a bad match; mitigated by the review cadence and by evaluation-run monitoring catching downstream quality symptoms even if the root cause (stale metadata) isn't immediately obvious.
- **Fabricated precision** — recording an invented exact benchmark number instead of an honest relative tier; explicitly disallowed by this document's Responsibilities — any dimension without verified provider documentation must be marked REQUIRES VERIFICATION, never filled with a plausible-sounding invented figure.
- **Over-trusting free-text task-fit notes** — treating early provider-reputation-based notes as if they were evaluation-verified; mitigated by explicitly tagging note provenance (provider-reputation vs. internally evaluated).

## Observability
- Coverage metric: percentage of approved models with all capability dimensions filled from verified sources versus still marked REQUIRES VERIFICATION.
- Router match-failure rate: how often a task type's required capability profile matches zero approved models, which would indicate either an overly strict routing requirement or a capability-matrix gap.
- Drift alerts when an evaluation run's observed behavior (e.g. tool-calling actually failing) contradicts this matrix's recorded capability flag.

## P0/P1/P2/P3
**P0.** Routing cannot function correctly without capability metadata to match tasks to suitable models; an inaccurate matrix produces silently poor-quality routing rather than a visible error, making this foundational to safe, effective operation of the entire AI layer.

## Current Status
Documented, not implemented. No `AIModelCapability` table exists yet. The capability notes above are deliberately expressed as relative tiers and honesty-flagged free text rather than fabricated absolute numbers, consistent with this document's own rule against inventing benchmark figures.

## Open Questions
- Exact context-window tiers to standardize on (how many buckets, where the boundaries fall) — not yet decided.
- Whether structured-output "support" needs a stricter sub-classification (e.g. schema-enforced vs. best-effort) given how much this varies across providers — likely yes, not yet designed.
- How frequently evaluation-derived task-fit notes should be allowed to override provider-reputation-based initial notes — not yet decided.

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md)
- [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md)
- [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md)
- [AI EVALUATION FRAMEWORK.md](AI%20EVALUATION%20FRAMEWORK.md)
- [AI COST QUOTA.md](AI%20COST%20QUOTA.md)
