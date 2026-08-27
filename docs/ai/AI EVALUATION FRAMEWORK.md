# AI Evaluation Framework

## Purpose
This document defines how AI output quality is measured on an ongoing basis across the platform: offline evaluation sets, live sampling, human review loops, and regression checks run before a model or prompt change is rolled out. It is the feedback mechanism that keeps [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md), [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md), and [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md) grounded in actual observed behavior rather than provider claims alone.

## Scope
Covers evaluation methodology, sampling strategy, human-review workflow, and pre-rollout regression checks for model/prompt changes. Does not cover real-time hallucination/citation blocking of individual outputs before display to a user (see [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md) and [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md), which are gating mechanisms, not the ongoing measurement program this document defines) and does not cover cost measurement (see [AI COST QUOTA.md](AI%20COST%20QUOTA.md)).

## Responsibilities
- Maintain offline evaluation sets per task type (literature synthesis, statistical reasoning support, writing review, citation extraction, etc.), each with representative inputs and a rubric for judging output quality specific to that task's academic-research context.
- Define the live-sampling strategy: what fraction of production requests per task type are pulled for human or automated-secondary-review, and how sampled items are selected to avoid bias (e.g. not only sampling flagged/complained-about outputs).
- Define the human-review loop: who reviews sampled outputs (subject-matter-competent reviewers for academic-research quality, not just general QA), what rubric they apply, and how findings feed back into [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md) preference ordering and [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md) lifecycle decisions.
- Define pre-rollout regression checks: before a routing rule, prompt version, or model swap goes to full production traffic, run it against the relevant offline evaluation set and require no material quality regression versus the current baseline.
- Track hallucination-flag rate and citation-grounding failure rate as first-class ongoing quality metrics, not just a real-time gating concern.

## Non-Responsibilities
- Does not perform real-time gating of individual outputs before they reach a user — that is [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md) and [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md); this document measures aggregate quality over time, it does not block any single response.
- Does not decide model/provider approval on its own authority — it produces evidence that feeds [AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) and [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md) decisions, which remain separate governance actions.
- Does not own prompt version control itself — see [AI PROMPT REGISTRY.md](AI%20PROMPT%20REGISTRY.md); this document evaluates the outputs of prompts, it does not manage prompt versioning as a system.
- Does not fabricate benchmark comparisons against public leaderboards — any claim about a model's evaluated quality on this platform must come from this framework's own evaluation sets, not from an assumed external benchmark score.

## Core Components
- **Offline Evaluation Sets** — per-task-type, curated input/rubric collections used for pre-rollout regression checks; built from realistic (anonymized/synthetic where needed) academic-research scenarios, not generic benchmark prompts.
- **Live Sampling Pipeline** — pulls a defined percentage of production requests per task type for review, stratified so under-represented task types or newer models still get adequate sample coverage.
- **Human Review Workflow** — the process and tooling by which a reviewer scores a sampled output against the rubric and records findings.
- **Regression Gate** — the pre-rollout check comparing a candidate model/prompt/routing change's evaluation-set performance against the current production baseline.
- **Quality Metrics Dashboard** — aggregated hallucination-flag rate, citation-grounding failure rate, and rubric scores over time, per task type and per model.

## Owned Data
| Entity | Notes |
|---|---|
| `AIEvaluationSet` | task type, curated inputs, rubric definition, version |
| `AIEvaluationRun` | a single execution of an evaluation set against a model/prompt version, with results |
| `AISampledOutput` | a production output pulled for review, with sampling metadata |
| `AIReviewFinding` | human reviewer's rubric scores and notes on a sampled output or evaluation-run item |
| `AIQualityMetricSnapshot` | periodic rollup of hallucination-flag rate, grounding-failure rate, and rubric scores |

## Inputs
- Production `AIRequest`/`AIResponse` traffic (sampled) from the Gateway.
- Task-type taxonomy from [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md).
- Hallucination-flag and citation-grounding-failure signals from [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md) and [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md).
- Candidate model/prompt/routing changes proposed by AI Admin before rollout.
- Human reviewer judgments against the defined rubrics.

## Outputs
- Regression-gate pass/fail decisions blocking or clearing a candidate change for rollout.
- Preference-ordering recommendations feeding [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md) revisions.
- Model lifecycle recommendations (promote to approved, restrict, deprecate) feeding [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md) decisions.
- Task-fit free-text notes feeding [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md), distinguishing evaluation-verified notes from provider-reputation-based ones.
- Quality trend dashboards for AI Admin oversight.

## Dependencies
- [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md), [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md), [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md) — the documents this framework's findings feed back into.
- [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md), [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md) — the real-time gating signals this framework tracks in aggregate.
- [AI PROMPT REGISTRY.md](AI%20PROMPT%20REGISTRY.md) — evaluation runs are tied to a specific prompt version under test.
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md) — the source of the production traffic this framework samples from.
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) — the governing document establishing this framework's mandate.

## Extension Points
- New task types get new offline evaluation sets without changing the sampling/review mechanism itself.
- New quality dimensions (e.g. an Indonesian-academic-writing-style fit metric) can be added to the rubric as the platform learns which failure modes matter most, per [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)'s extension guidance.
- Automated secondary-model review (using a model to pre-screen sampled outputs before human review) can be layered in as a triage step without replacing human review for the cases that matter most.

## Security & Privacy
- Sampled production outputs used for review must respect project-level privacy (Core Contract #9) — review access is scoped and audited, not an open pool of arbitrary user research content available to any reviewer.
- Evaluation sets built from real project content must be anonymized or drawn from consented/synthetic scenarios rather than raw private research data, unless a specific project has explicitly consented to contribute to evaluation data.
- Reviewer access to sampled content is itself logged, consistent with the Gateway's `AIRequestAudit` posture.

## Failure Modes
- **Sampling bias** — only reviewing flagged or complained-about outputs gives a falsely rosy or falsely alarming picture; mitigated by stratified random sampling across all task types, not complaint-driven sampling alone.
- **Rubric drift** — reviewers apply inconsistent standards over time or across reviewers; mitigated by a versioned, written rubric per task type and periodic reviewer-calibration checks (calibration process itself is an open question below).
- **Regression gate bypassed under release pressure** — a change ships without clearing the regression gate; must be treated as a governance violation given the academic-integrity stakes described in [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md), not a normal engineering trade-off.
- **Evaluation set staleness** — offline sets built early stop reflecting real production task distribution as the product evolves; mitigated only by periodic refresh tied to observed production task-type distribution (refresh cadence is an open question).

## Observability
- Evaluation-run pass/fail history per model/prompt version, queryable for regression investigation.
- Hallucination-flag rate and citation-grounding failure rate trend, per task type and per model, tracked as the platform's core AI-quality metrics per [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) Observability guidance.
- Sampling coverage rate per task type (are newer/lower-traffic task types getting enough review volume to be statistically meaningful).
- Reviewer throughput and inter-reviewer consistency, once a calibration process exists.

## P0/P1/P2/P3
**P1.** The governance framework and its P0 real-time controls (citation grounding, hallucination blocking, provider/model registries, routing, fallback) must exist first; this framework is the major product-quality capability that keeps those controls accurate and improving over time, making it a close second-priority rather than foundational plumbing itself. Automated regression-gate tooling and reviewer-calibration processes are reasonably deferred refinements (P2) once the core measurement loop is operating.

## Current Status
Documented, not implemented. No offline evaluation sets, sampling pipeline, review tooling, or regression-gate automation exists yet. This document describes the intended measurement program for an architecture-only phase.

## Open Questions
- Sampling percentage per task type and how it should vary with production traffic volume — not yet decided, needs real traffic data to calibrate sensibly.
- Reviewer sourcing: internal team, contracted academic-domain reviewers, or a hybrid — not yet decided, and material to how credible the human-review loop is for academic-quality judgments.
- Reviewer-calibration process to keep rubric application consistent across reviewers and over time — not yet designed.
- Acceptable hallucination-flag false-positive rate before it degrades user trust — explicitly flagged as an open question in [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) and requires empirical evaluation once this framework is operational.
- Offline evaluation set refresh cadence — not yet decided.

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [architecture/05 MULTI MODEL AI GATEWAY.md](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md)
- [AI ROUTING POLICY.md](AI%20ROUTING%20POLICY.md)
- [AI MODEL REGISTRY.md](AI%20MODEL%20REGISTRY.md)
- [AI CAPABILITY MATRIX.md](AI%20CAPABILITY%20MATRIX.md)
- [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md)
- [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md)
- [AI PROMPT REGISTRY.md](AI%20PROMPT%20REGISTRY.md)
