# AI Prompt Registry

## Purpose
This document defines the authoritative store of system prompts and prompt templates used by every internal engine that calls the Multi-Model AI Gateway, and the versioning discipline around them. Prompts are treated as reviewable, versioned artifacts, not inline strings scattered across engine code, because a silent prompt change can alter hallucination rates, citation behavior, and academic-integrity posture without any code review catching it.

## Scope
Covers where prompts live conceptually, how they are versioned, what mandatory clauses every academic-facing prompt must include (per [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md) and [AI SAFETY ACADEMIC INTEGRITY.md](AI%20SAFETY%20ACADEMIC%20INTEGRITY.md)), and how a prompt change is reviewed and rolled out. Does not cover the model/provider a prompt is sent to — see [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md). Does not cover tool/function definitions available to a model mid-conversation — see [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md) and [architecture/06 AI TOOL CALLING ENGINE.md](../architecture/06%20AI%20TOOL%20CALLING%20ENGINE.md).

## Responsibilities
- Maintain one canonical, versioned template per distinct AI task (e.g. "Methodology Advisor: suggest research design," "Evidence Synthesis: summarize a source set," "Research Gap Engine: identify unaddressed questions"), keyed by engine and task name.
- Enforce that every academic-facing prompt template includes the mandatory shared clauses: the uncertainty instruction from [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md), the citation-grounding instruction from [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md), and the advisor-not-ghostwriter framing from [AI SAFETY ACADEMIC INTEGRITY.md](AI%20SAFETY%20ACADEMIC%20INTEGRITY.md).
- Version every prompt template; record which version produced any given AI output so a hallucination report or quality regression can be traced to a specific prompt revision.
- Provide a defined review step before a prompt-template change reaches production traffic — a prompt change is a behavior change for the whole platform's AI surface, not a copy edit.
- Track which prompt version is active per engine/task, supporting rollback to a prior version if a regression is detected.

## Non-Responsibilities
- Does not implement the model call itself or provider-specific formatting differences (e.g. system-role vs. instruction-prefix conventions) — those live behind the Multi-Model AI Gateway's adapter layer.
- Does not decide routing between models/providers — see [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md).
- Does not define tool schemas or what functions a model may call — see [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md).
- Does not perform the hallucination or citation checks themselves — this registry supplies the instruction text those mechanisms depend on, but the checking logic lives in [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md) and [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md).
- Does not store per-request user input or conversation history — only the reusable template and its version metadata.

## Core Components
- **Prompt Template** — the versioned, parameterized text for a specific engine/task pair, with named insertion points for project context, retrieved references, and user input.
- **Shared Clause Library** — the small set of mandatory instruction fragments (uncertainty, citation-grounding, advisor-not-ghostwriter, tool-permission boundaries) that every academic-facing template composes from, so a policy update propagates by editing one clause rather than every template.
- **Version Record** — an immutable snapshot of a template at a point in time, referenced by id from every AI output for traceability.
- **Active Version Pointer** — the per-engine/task mapping of which version currently receives production traffic, distinct from the full version history.

## Owned Data
- `PromptTemplate` (engine, task name, current active version id).
- `PromptVersion` (immutable content snapshot, version id, created-at, author/reviewer, changelog note, shared clauses composed in).
- `PromptUsageRecord` — link from an AI output/request id to the exact prompt version used, for traceability into hallucination and quality reports.

## Inputs
- Engine-specific task requirements (what the Methodology Advisor, Evidence Synthesis Engine, etc. need a prompt to accomplish).
- Shared clause updates originating from [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md), [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md), and [AI SAFETY ACADEMIC INTEGRITY.md](AI%20SAFETY%20ACADEMIC%20INTEGRITY.md) policy revisions.
- Hallucination reports and quality regressions that motivate a prompt revision (fed from [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md)'s report log).

## Outputs
- The composed, version-stamped prompt text sent to the Multi-Model AI Gateway for a given request.
- Version metadata attached to every AI output for traceability and observability.
- Changelog history available for audit of what instruction was active at any past point in time.

## Dependencies
- [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md) — the caller that assembles a request using a prompt template plus live project context.
- [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md) — source of the mandatory uncertainty clause.
- [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md) — source of the mandatory citation-instruction clause.
- [AI SAFETY ACADEMIC INTEGRITY.md](AI%20SAFETY%20ACADEMIC%20INTEGRITY.md) — source of the mandatory advisor-not-ghostwriter clause.
- [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md) — coordinates with this registry where a template needs to state which tools the model may invoke for that task.
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) — the governing policy this registry implements operationally.

## Extension Points
- A new engine or task adds a new `PromptTemplate` composed from the existing Shared Clause Library rather than writing mandatory instructions from scratch.
- A new mandatory shared clause (e.g. a future locale-specific academic-norm clause for Indonesian institutional requirements) is added to the library and propagates to all templates that compose it on their next version bump.
- A/B or staged rollout of a new prompt version (serving a subset of traffic before full cutover) can be layered on the Active Version Pointer without changing the template/version data model.

## Security & Privacy
- Prompt templates themselves contain no researcher data — user and project content are inserted at request time via named parameters, keeping the versioned template content free of private data.
- `PromptUsageRecord` links to a request id, not to raw private content, so traceability does not require storing sensitive project text alongside prompt metadata.
- Review access to edit shared clauses (especially the academic-integrity and hallucination clauses) is restricted, since a compromised or careless edit here changes behavior across the entire AI surface at once.

## Failure Modes
- **Untracked prompt drift** — an engine owner edits a template inline without going through versioning, breaking traceability for any resulting hallucination report; mitigated by requiring all engines to source prompts only from this registry, never from inline strings.
- **Shared clause omission** — a new template is created without composing the mandatory clauses, shipping an academic-facing AI surface without the uncertainty or integrity framing; mitigated by a required-clause checklist as part of the review step before activation.
- **Version rollback losing traceability** — rolling back to a prior version without recording why, making the incident history hard to reconstruct; mitigated by requiring a changelog note on every version, including rollbacks.

## Observability
- Active version per engine/task, visible at a glance to correlate against quality metrics.
- Count of AI outputs per prompt version, to gauge exposure before a rollback decision.
- Time between a hallucination-report spike and the corresponding prompt-version rollback or fix, as a responsiveness metric.

## P0/P1/P2/P3
**P0.** Every academic-facing AI call depends on a prompt carrying the mandatory safety and integrity clauses; without a governed registry, those clauses cannot be reliably guaranteed present across engines, making this foundational to safe operation of any AI feature.

## Current Status
Documented, not implemented. No `PromptTemplate`/`PromptVersion` schema, shared clause library, or review workflow exists yet.

## Open Questions
- Who holds review/approval authority for a shared-clause change versus a single-template change — likely different bars, not yet defined.
- Whether prompt versions require a formal staged rollout mechanism at launch or a simpler immediate-cutover model is acceptable initially.
- How prompt templates should be authored for multilingual behavior (Indonesian and English researcher-facing responses) — one template with a language parameter, or separate templates per language — not yet decided.
- Retention period for old `PromptVersion` records — indefinite for audit purposes versus a pruning policy.

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md)
- [AI CITATION GROUNDING.md](AI%20CITATION%20GROUNDING.md)
- [AI SAFETY ACADEMIC INTEGRITY.md](AI%20SAFETY%20ACADEMIC%20INTEGRITY.md)
- [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md)
- [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md)
- [architecture/06 AI TOOL CALLING ENGINE.md](../architecture/06%20AI%20TOOL%20CALLING%20ENGINE.md)
- [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md)
