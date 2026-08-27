# Publication Intelligence

## Purpose
Publication Intelligence is the reasoning layer that decides whether a project is actually ready to approach a publication destination, and if so, how well it fits one. It sits between a project's raw state and the [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md)'s routing decision, turning manuscript content and structure into advisory scores a researcher can act on. It exists so that "is this ready to submit" is answered by consistent, explainable rules rather than by the researcher guessing.

## Scope
Covers the Readiness Engine (checks whether a manuscript is structurally and substantively ready) and the coordination logic that combines readiness with match quality before a project is presented to Publication Gateway for routing. Does not cover the destination registry itself (that is Publication Gateway) and does not cover the specific title/abstract/keyword matching algorithm against destinations (that is [Journal Matching Engine](./23%20JOURNAL%20MATCHING%20ENGINE.md), which this module calls as a sub-service).

## Responsibilities
- Run the Readiness Engine over a project's academic document: scope alignment, title, abstract, keywords, structural completeness, methods reporting, citation completeness, reference formatting, tables/figures, ethics statement presence, author-guideline compliance, cover letter, submission checklist.
- Produce a `PublicationMatch` record per candidate destination combining readiness state with the Journal Matching Engine's fit score.
- Flag specific readiness gaps back to the researcher (e.g. "missing ethics statement", "abstract exceeds destination word limit") rather than a single opaque score.
- Decide the go/no-go signal that gates whether Publication Gateway offers routing at all for a given project.

## Non-Responsibilities
- Does not maintain the destination registry or perform the handoff to a destination — that is Publication Gateway's job.
- Does not compute the subject/scope/topic fit score itself — that specific algorithm is owned by the Journal Matching Engine; Publication Intelligence consumes its output.
- Does not guarantee acceptance by any journal or conference — every score produced here is advisory only, never a promise of editorial outcome.
- Does not call any AI model directly — readiness reasoning that requires AI assistance goes through the [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md), consistent with Core Contract #3.

## Core Components
- **Readiness Engine** — rule-based and AI-assisted checks across scope, structure, methods reporting, citations, references, tables/figures, ethics, guideline compliance, cover letter, and checklist completeness.
- **Match Composer** — merges Readiness Engine output with Journal Matching Engine scores into a single `PublicationMatch` record per candidate destination.
- **Gap Reporter** — translates failed readiness checks into specific, actionable feedback items surfaced to the researcher.

## Owned Data
| Entity | Notes |
|---|---|
| PublicationMatch | derived scoring record: destination, readiness state, match score, gap list |
| ReadinessCheckResult | per-check pass/fail/partial state and evidence pointer into the document |

## Inputs
- The project's academic document content and structure from [Research Core](./02%20RESEARCH%20CORE.md) and the writing/citation module.
- The current [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md) snapshot, for methodology and variable consistency checks.
- Candidate destination requirements (word limits, formatting rules, required sections) sourced from Publication Gateway's registry.
- AI-assisted readiness reasoning routed through the Multi-Model AI Gateway.

## Outputs
- `PublicationMatch` records consumed by [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md) to decide what to route and present.
- Gap/feedback lists surfaced directly to the researcher inside the project.
- A readiness gate signal that blocks premature routing until minimum structural checks pass.

## Dependencies
- [Journal Matching Engine](./23%20JOURNAL%20MATCHING%20ENGINE.md) for destination fit scoring.
- [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md), which consumes this module's output before routing.
- [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md) for any AI-assisted readiness reasoning (Core Contract #3).
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md) for the shared project state used in consistency checks.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 17.

## Extension Points
- New readiness checks (e.g. a future data-availability-statement check) are added to the Readiness Engine as independent check units without altering the Match Composer's aggregation logic.
- Destination-specific readiness rules (a given journal requiring a graphical abstract) attach as overrides sourced from the destination's registry entry, not as hardcoded exceptions in the engine.
- Future domain-specific readiness profiles (e.g. clinical trial reporting checklists) can be added as pluggable check sets selected by research field.

## Security & Privacy
- Readiness analysis operates on private project content by default (Core Contract #9); results are visible only to the project's owner and collaborators, never used to build cross-project benchmarks without explicit, separate consent.
- Any AI-assisted check that sends manuscript content to a model must respect the same provider data-sharing controls as the rest of the AI Gateway.
- Gap reports must not be persisted longer than needed for the researcher's active review cycle beyond normal project data retention.

## Failure Modes
- **AI-assisted check unavailable**: falls back to the rule-based subset of the Readiness Engine (structural/formatting checks that need no model call) rather than blocking readiness assessment entirely, per Core Contract #11's degraded-but-functional principle.
- **False-positive readiness**: a project scored ready that a human editor would reject — mitigated by framing every score as advisory and by the Gap Reporter always listing residual risk items, never a bare "ready" boolean.
- **Destination requirement drift**: matching against outdated destination requirements if Publication Gateway's registry is stale — mitigated by consuming the registry's `last_verified_at` and down-weighting matches against unverified entries.

## Observability
- Distribution of readiness scores across active projects nearing submission.
- Most frequently failed readiness checks (product signal for where researchers commonly get stuck).
- AI-assisted check availability rate and fallback-to-rule-based-only frequency.
- Correlation tracking (where available) between readiness score and eventual researcher-reported submission outcome.

## P0/P1/P2/P3
**P1.** Readiness scoring and the Journal Matcher core are a major product capability layered on top of the foundational publication routing path; the platform's core research support does not depend on this module existing, but it is central to the publication phase of the product. Advanced/domain-specific scope and methods scoring is **P2**.

## Current Status
Documented, not implemented. No Readiness Engine, Match Composer, or `PublicationMatch` schema exists in code; this document defines the intended reasoning boundary ahead of implementation.

## Open Questions
- Whether readiness checks should be fully deterministic/rule-based at first, with AI assistance added later, or whether AI-assisted checks are needed from the start for methods-reporting and ethics-statement detection.
- How destination-specific override rules are authored and kept in sync with the Publication Gateway registry without duplicating requirement data.
- Whether a numeric readiness score is shown to researchers at all, versus only the qualitative gap list, to avoid the score being misread as a guarantee.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER PRODUCT ARCHITECTURE.md](../MASTER%20PRODUCT%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md)
- [Journal Matching Engine](./23%20JOURNAL%20MATCHING%20ENGINE.md)
- [Submission Orchestration](./24%20SUBMISSION%20ORCHESTRATION.md)
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md)
