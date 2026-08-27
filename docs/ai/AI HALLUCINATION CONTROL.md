# AI Hallucination Control

## Purpose
This document defines how MetodePenelitian.com detects, constrains, and discloses the risk that an AI model produces a confident but false or unverifiable claim — a fabricated citation, a nonexistent method, a misattributed finding, or a statistic that does not trace back to any source in the researcher's project. Hallucination control is treated as a cross-cutting policy enforced at the Multi-Model AI Gateway and inside every internal engine that surfaces AI-generated text to a researcher, not as a feature of any single engine.

## Scope
Covers detection signals, mitigation techniques, output labeling, and escalation rules for AI-generated content across the platform: Methodology Advisor suggestions, Evidence Synthesis Engine summaries, Research Gap Engine claims, Research AI Orchestrator chat responses, and any AI-assisted drafting surface. Does not cover the citation-to-source verification mechanism itself, which is a distinct, more specific control — see [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md). Does not cover model selection or fallback behavior — see [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md).

## Responsibilities
- Classify every AI output surfaced to a researcher into a confidence/grounding tier: **grounded** (traceable to a specific `ResearchReference` or project artifact), **model-general-knowledge** (plausible but unverified against project data), or **flagged-uncertain** (the model itself expressed low confidence or the claim could not be checked).
- Require that any claim citing a source resolves against an actual `ResearchReference` record before it is rendered as a citation, delegating the resolution mechanism itself to [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md).
- Attach a visible provenance label to AI-generated text blocks so a researcher can distinguish "drawn from your uploaded sources" from "the model's general knowledge, verify independently."
- Define the escalation path when a hallucination is reported by a user: log the prompt/output pair, mark the affected model/prompt-version combination for review, and feed the pattern back into [AI PROMPT REGISTRY.md](AI%20PROMPT%20REGISTRY.md) revision.
- Set the baseline instruction embedded in every academic-context system prompt: the model must state uncertainty rather than invent a plausible-sounding source, method name, or statistic.

## Non-Responsibilities
- Does not implement the reference-resolution or citation-matching logic itself — see [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md).
- Does not decide which model or provider handles a given request — see [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md) and the Multi-Model AI Gateway routing layer it depends on.
- Does not define academic-integrity/authorship policy (whether AI output may be submitted as a researcher's own work) — see [AI SAFETY ACADEMIC INTEGRITY.md](AI%20SAFETY%20ACADEMIC%20INTEGRITY.md).
- Does not define which tools a model may invoke — see [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md).
- Does not perform plagiarism or AI-text detection on researcher-authored content — that is a distinct integrity-tooling concern tracked under [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md), not this document.

## Core Components
- **Grounding Classifier** — a post-generation pass that checks whether each factual/citation claim in a model response can be resolved against project-scoped data (the Project Context Engine's held references, uploaded documents, prior AI outputs) before the response is released to the UI.
- **Provenance Label** — the UI-facing tag (grounded / general-knowledge / uncertain) attached per response segment, not per whole response, since a single answer can mix grounded and ungrounded content.
- **Uncertainty Instruction Block** — a mandatory clause injected into every academic-facing system prompt via [AI PROMPT REGISTRY.md](AI%20PROMPT%20REGISTRY.md), directing the model to explicitly flag claims it cannot verify rather than presenting them with false confidence.
- **Hallucination Report Log** — the record of user-flagged incidents, keyed to the prompt version and model/provider that produced them, feeding prompt and routing revisions.

## Owned Data
- `AIOutputProvenance` — per-response-segment grounding tier, linked `ResearchReference` id(s) where applicable, and the model/prompt-version that generated it.
- `HallucinationReport` — user-reported incident: flagged output, project context at time of generation, model/provider, prompt version, resolution status.

## Inputs
- Raw model output from the Multi-Model AI Gateway, before it is released to any engine's response surface.
- The set of `ResearchReference` records and project artifacts held in the [Project Context Engine](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md), used as the ground-truth set a claim can be checked against.
- User-submitted hallucination reports (a "this looks wrong" action on any AI output).

## Outputs
- The provenance-labeled response rendered to the researcher, with grounded and ungrounded segments visually distinguished.
- Hallucination incident records consumed by prompt-review and model-routing decisions.
- A per-engine grounding-rate metric (share of claims resolved as grounded vs. general-knowledge vs. uncertain) for observability.

## Dependencies
- [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md) — the orchestration layer this classifier sits behind before any response reaches an engine.
- [architecture/03 PROJECT CONTEXT ENGINE.md](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md) — the source of ground-truth project data the classifier checks claims against.
- [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md) — the specific citation-resolution mechanism this document depends on for the "grounded" tier.
- [AI PROMPT REGISTRY.md](AI%20PROMPT%20REGISTRY.md) — where the uncertainty-instruction clause and its versioning live.
- [architecture/11 EVIDENCE SYNTHESIS ENGINE.md](../architecture/11%20EVIDENCE%20SYNTHESIS%20ENGINE.md) — a primary consumer, since synthesis claims carry the highest hallucination risk in the platform.
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) — the governing policy this document implements.

## Extension Points
- A new engine that surfaces AI text adopts the Grounding Classifier and Provenance Label by calling the shared response-labeling step in the orchestration path — it does not implement its own grounding logic.
- The classifier's checking strategy (structured citation matching today; potentially embedding-similarity matching against project text later) can be swapped behind the same interface without changing how engines consume provenance labels.
- Additional provenance tiers (e.g. "grounded but source is low-quality per Evidence Synthesis Engine's own quality signals") can be added without breaking existing consumers, since the tier is an enum attached per segment.

## Security & Privacy
- Grounding checks run against project-scoped data only; the classifier never uses one researcher's private project content to verify or enrich another researcher's output, consistent with Core Contract #9.
- Hallucination reports may contain excerpts of private project content and are subject to the same access controls as the underlying `ResearchProject`.
- Provenance labels are informational, not a legal or academic guarantee — the UI copy must not overstate what "grounded" verifies (it verifies traceability to a source record, not that the source itself is correct or high-quality).

## Failure Modes
- **False "grounded" label** — the classifier matches a claim to a `ResearchReference` that does not actually support it (a citation-adjacency error rather than fabrication); mitigated by keeping the match criteria strict (explicit reference id, not fuzzy topical similarity) and by Evidence Synthesis Engine's own quality signals layered on top.
- **Over-flagging suppresses useful output** — an overly strict classifier marks correct, well-known domain knowledge as "uncertain," eroding researcher trust in the labels; mitigated by scoping "general-knowledge" as a neutral, not negative, label rather than a warning.
- **Silent degradation under provider fallback** — a fallback model (per Core Contract #11's degraded-but-functional requirement) has a materially different hallucination rate than the primary model without the researcher being told; mitigated by carrying the model identity into the provenance record so a rate change is at least observable.

## Observability
- Grounded / general-knowledge / uncertain segment ratio, tracked per engine and per model, to catch a regression after a model or prompt change.
- Hallucination report volume per engine, per model/provider, per prompt version — the primary signal for prioritizing prompt or routing fixes.
- Time-to-resolution for open hallucination reports.

## P0/P1/P2/P3
**P0.** An academic platform that surfaces AI claims without any hallucination-mitigation layer is unsafe for its stated purpose; provenance labeling and the uncertainty instruction must exist before any AI-generated text reaches a researcher.

## Current Status
Documented, not implemented. No classifier, provenance schema, or report log exists yet. This document defines the required behavior for when the Multi-Model AI Gateway and internal engines are built.

## Open Questions
- Whether provenance classification runs synchronously in the request path or as an async pass with a brief "verifying" UI state — affects latency budget.
- What match strictness the Grounding Classifier uses for "grounded" (exact reference id only, vs. some allowance for close paraphrase) — not yet decided.
- Whether hallucination reports should trigger automatic prompt-version rollback above a report-volume threshold, or remain a manual review trigger.
- Whether grounding-rate metrics should be visible to researchers (aggregate, e.g. "82% of this summary is grounded in your sources") or remain internal-only observability.

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md)
- [AI PROMPT REGISTRY.md](AI%20PROMPT%20REGISTRY.md)
- [AI SAFETY ACADEMIC INTEGRITY.md](AI%20SAFETY%20ACADEMIC%20INTEGRITY.md)
- [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md)
- [architecture/03 PROJECT CONTEXT ENGINE.md](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md)
- [architecture/11 EVIDENCE SYNTHESIS ENGINE.md](../architecture/11%20EVIDENCE%20SYNTHESIS%20ENGINE.md)
- [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md)
