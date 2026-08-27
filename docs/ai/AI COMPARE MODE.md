# AI Compare Mode

## Purpose
This document defines Compare Mode: a researcher-facing capability that runs the same request against more than one AI model through the Multi-Model AI Gateway and presents the outputs side by side, so the researcher can judge which response better serves their task rather than being locked into a single model's framing. It exists because academic judgment calls (a suggested methodology, a synthesis framing, a gap interpretation) benefit from visible disagreement between models more than from a single authoritative-sounding answer.

## Scope
Covers when Compare Mode is available, how a multi-model request is fanned out and reassembled, how differing outputs are labeled and presented, and how a researcher's selection (or non-selection) feeds back into the platform. Does not cover the routing logic that picks a single default model for non-compare requests — see [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md). Does not cover hallucination/citation checking of each individual output, which applies identically to every model's response in Compare Mode — see [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md) and [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md).

## Responsibilities
- Fan a single researcher request out to two or more approved models/providers (per [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md)) using the same underlying prompt template and project context, so the comparison isolates model behavior rather than prompt differences.
- Apply the full hallucination-control and citation-grounding pipeline independently to each model's output before any of them are shown, so Compare Mode never becomes a bypass around those safeguards.
- Present outputs labeled by which model produced them, without implying a ranking or endorsement — the platform does not tell the researcher which output is "correct."
- Capture the researcher's selection (if any) as a preference signal, distinct from a factual correctness judgment, usable for future routing-quality analysis.
- Degrade to a single-model response with a clear notice if fewer than two models are available for the request (per Core Contract #11), rather than failing the request outright.

## Non-Responsibilities
- Does not decide which models are eligible for Compare Mode on a given task — that eligibility is set by routing policy owned in [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md), this document only defines how the comparison itself is run once models are selected.
- Does not perform its own hallucination or citation checking logic — it invokes the existing pipelines per output.
- Does not merge or synthesize the compared outputs into a single answer automatically — the researcher makes that judgment.
- Does not affect cost/quota policy beyond the fact that a compare request consumes calls to multiple models — cost accounting itself belongs to a separate cost-governance concern under [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md).
- Does not apply to tool-calling actions with side effects — a `mutating-external` tool call (per [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md)) is never fanned out to multiple models to avoid duplicate real-world actions.

## Core Components
- **Fan-Out Dispatcher** — sends the identical composed prompt (template + project context + user input) to each selected model in parallel through the Multi-Model AI Gateway.
- **Per-Output Safeguard Pass** — runs hallucination classification and citation grounding independently on each returned output before assembly.
- **Comparison Assembler** — pairs each safeguarded output with its model label and any provenance/grounding metadata, producing the side-by-side response object the UI renders.
- **Preference Capture** — records which output (if any) the researcher selected, kept, or discarded, without asserting that selection means the chosen output was factually superior.

## Owned Data
- `CompareRequest` (originating request id, models included, prompt template/version used, project id).
- `CompareOutput` (per model: raw output, grounding/provenance metadata, timestamp, error status if that model failed).
- `ComparePreference` (which output the researcher selected or acted on, if any, timestamp).

## Inputs
- A researcher-initiated compare request, or a task explicitly configured to always run in compare mode for high-stakes decisions (e.g. methodology selection).
- The set of eligible models for the task, from [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md) routing policy filtered against [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) approval status.
- The shared prompt template from [AI PROMPT REGISTRY.md](AI%20PROMPT%20REGISTRY.md), identical across all fanned-out calls.

## Outputs
- The assembled side-by-side comparison object rendered to the researcher.
- `ComparePreference` records, feeding future analysis of model quality per task type (an input to routing-policy review, not an automated routing change by itself).
- Per-model latency and failure data from the fan-out, feeding the same observability surface as single-model requests.

## Dependencies
- [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md) — supplies the eligible-model set and the request assembly this mode fans out from.
- [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) — the approval boundary; Compare Mode can only include approved providers.
- [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md) and [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md) — applied per output before assembly.
- [AI PROMPT REGISTRY.md](AI%20PROMPT%20REGISTRY.md) — supplies the single shared template used across all fanned-out calls.
- [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md) — the boundary that excludes `mutating-external` tool calls from fan-out.
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) — the governing policy this feature operates under.

## Extension Points
- Additional models can be added to a compare set up to a defined maximum (not yet set) without changing the Comparison Assembler's contract.
- A future "explain the difference" meta-analysis (an additional AI call summarizing how the compared outputs differ) can be layered on top of `CompareOutput` records without changing the fan-out mechanism.
- Preference data can later inform routing-policy tuning as an input signal, without Compare Mode itself becoming an automated router.

## Security & Privacy
- Fan-out sends the same project context to multiple providers simultaneously, so every provider included in a compare set must independently satisfy the retention/approval posture required for that project's data sensitivity, per [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) — Compare Mode never relaxes that check to include a convenient but unapproved provider.
- `CompareOutput` and `ComparePreference` records are scoped to the originating `ResearchProject` and follow the same private-by-default access rules as any other project data, per Core Contract #9.
- A failed or degraded provider within a compare set is surfaced as a labeled failure in the comparison, never silently dropped in a way that misleads the researcher about how many models actually responded.

## Failure Modes
- **Partial fan-out failure** — one provider in the compare set errors or times out while others succeed; handled by returning the successful outputs with the failed one clearly labeled, not by failing the whole request, consistent with Core Contract #11's degraded-but-functional requirement.
- **Prompt drift between calls** — a bug causes slightly different prompts to be sent to different models, invalidating the comparison; mitigated by sourcing all fanned-out calls from one shared, version-locked template.
- **Researcher over-trusts consensus** — when multiple models happen to agree, a researcher may treat that as stronger proof than it is, since correlated training data can produce correlated errors; mitigated by UI copy that frames agreement as "multiple models responded similarly," not as independent verification.

## Observability
- Per-model latency and error rate within compare requests, to catch a provider degrading specifically under fan-out load.
- Preference distribution across models per task type, as a longer-term routing-quality signal.
- Compare-mode usage rate relative to single-model requests, to gauge researcher demand for the feature.

## P0/P1/P2/P3
**P1.** Compare Mode is a major differentiating product capability for researcher trust and judgment support, but the platform can function on single-model routing without it; it depends on the P0 safeguards (hallucination control, citation grounding, provider approval) already being in place.

## Current Status
Documented, not implemented. No Fan-Out Dispatcher, `CompareRequest`/`CompareOutput` schema, or comparison UI exists yet.

## Open Questions
- Maximum number of models allowed in a single compare set — a cost and UI-complexity tradeoff not yet decided.
- Which tasks default to Compare Mode automatically (e.g. methodology selection) versus which are researcher-opt-in only.
- Whether Compare Mode is gated behind a subscription tier or available at all account levels — a product/pricing decision outside this document's scope.
- How Compare Mode interacts with BYOK accounts where the researcher has only configured credentials for one provider — see [AI BYOK STRATEGY.md](AI%20BYOK%20STRATEGY.md).

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER PRODUCT ARCHITECTURE.md](../MASTER%20PRODUCT%20ARCHITECTURE.md)
- [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md)
- [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md)
- [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md)
- [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md)
- [AI PROMPT REGISTRY.md](AI%20PROMPT%20REGISTRY.md)
- [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md)
- [AI BYOK STRATEGY.md](AI%20BYOK%20STRATEGY.md)
