# Journal Matching Engine

## Purpose
The Journal Matching Engine answers one narrow question well: given a finished or near-finished research project, which real publication destinations actually fit it? It exists as its own component, separate from the broader readiness reasoning in [Publication Intelligence](./22%20PUBLICATION%20INTELLIGENCE.md), because scope/subject/indexing fit is a distinct problem from "is this manuscript well-formed" — a project can be a perfect subject match for a journal while still being structurally unready, or vice versa.

## Scope
Covers the algorithm and data pipeline that takes project attributes (title, abstract, keywords, field, method, references, language, preferences) and scores them against candidate entries in the Publication Destination Registry. Does not own the registry itself (Publication Gateway does) and does not decide readiness or gate submission (Publication Intelligence does). Produces a score, not a decision.

## Responsibilities
- Accept a project's matching-relevant attributes: title, abstract, keywords, research field, methodology, reference list, language, country preference, open-access preference, APC budget ceiling, desired indexing (Scopus/SINTA/other).
- Score each candidate destination in the registry against those attributes on: scope/subject match, indexing status, publisher reputation signal, open-access status, APC fit, language fit.
- Return a ranked list of candidate destinations with a match score and a short explanation of what drove the score (subject overlap, indexing match, budget fit, etc.).
- Refresh scores when a project's matching-relevant attributes change materially (e.g. keywords edited, methodology changed).

## Non-Responsibilities
- Does not decide whether the project is ready to be shown any destination at all — that go/no-go gate belongs to Publication Intelligence's Readiness Engine.
- Does not maintain destination data or verification status — it reads the registry owned by Publication Gateway, it does not write to it.
- Does not perform the handoff or submission — matching stops at producing a ranked, scored list.
- Does not claim or imply guaranteed acceptance; a high match score describes topical/format fit only, never editorial likelihood.

## Core Components
- **Attribute Extractor** — pulls matching-relevant fields from the project's academic document and Project Context Engine snapshot (title, abstract, keywords, field, method, references, language).
- **Scope Matcher** — compares project subject/keywords against each destination's declared fields/topics; the core subject-fit signal.
- **Constraint Filter** — hard-filters destinations against non-negotiable preferences (e.g. language, APC budget ceiling, required open-access status) before scoring the remainder.
- **Score Composer** — combines scope match, indexing match, publisher signal, OA status, and APC fit into a single explainable match score per destination.

## Owned Data
| Entity | Notes |
|---|---|
| JournalMatchScore | per-project, per-destination score with sub-scores and explanation, feeds into Publication Intelligence's `PublicationMatch` |
| MatchAttributeSnapshot | the extracted project attributes a given scoring run was based on, kept for explainability and re-scoring triggers |

## Inputs
- Project title, abstract, keywords, field, methodology, and reference list from [Research Core](./02%20RESEARCH%20CORE.md) and the writing/citation module.
- Researcher-stated preferences: language, country, open-access preference, APC budget, desired indexing.
- The Publication Destination Registry maintained by [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md) (read-only).

## Outputs
- Ranked `JournalMatchScore` records per project, consumed by [Publication Intelligence](./22%20PUBLICATION%20INTELLIGENCE.md) to compose the final `PublicationMatch`.
- Score explanations surfaced directly to the researcher alongside each candidate destination.

## Dependencies
- [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md) for the destination registry this engine scores against.
- [Publication Intelligence](./22%20PUBLICATION%20INTELLIGENCE.md), which composes this engine's output with readiness state.
- [Research Core](./02%20RESEARCH%20CORE.md) for the project attributes being matched.
- [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md) where scope/subject matching benefits from semantic (embedding-based) comparison rather than keyword overlap alone.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 17.

## Extension Points
- New scoring dimensions (e.g. a future "typical review turnaround" signal, where data exists) can be added to the Score Composer as additional weighted sub-scores.
- Semantic scope matching can be swapped from keyword-overlap to embedding-similarity-based matching without changing the Constraint Filter or Score Composer's external contract.
- Field-specific matching profiles (e.g. different weighting for STEM vs. social-science destinations) can be added as configuration rather than new code paths.

## Security & Privacy
- Matching operates on private project content (Core Contract #9); match runs and their explanations are visible only to the project's owner and collaborators.
- If semantic matching sends abstract/keyword text to an AI model via the Multi-Model AI Gateway, this is subject to the same provider data-sharing controls as any other AI call — never sent directly to a provider from this engine.
- Match results must not be used to build any cross-project or cross-researcher analytics without separate, explicit consent, since doing so would repurpose private project content.

## Failure Modes
- **Sparse or malformed project attributes** (e.g. no abstract yet): engine returns a low-confidence result set with an explicit "insufficient data" flag rather than a misleadingly confident ranking.
- **Semantic matching provider unavailable**: falls back to keyword/subject-overlap matching (a functioning but less precise mode) rather than failing the whole match request, per Core Contract #11's degraded-but-functional principle.
- **Registry drift**: matching against a destination whose field/scope metadata is outdated — mitigated by weighting or down-ranking destinations whose registry entry is past its verification freshness window.

## Observability
- Match-run volume and average candidate-set size per project.
- Distribution of top match scores (product signal for whether the registry has adequate coverage for common fields).
- Fallback-to-keyword-matching frequency when semantic matching is unavailable.
- Researcher engagement with match explanations (which sub-scores researchers actually click into).

## P0/P1/P2/P3
**P1.** The Journal Matcher is explicitly named as core Publication Intelligence functionality and is a major product capability directly tied to the platform's publication-phase value proposition; it is not required for the platform's earlier-lifecycle features to function, so it sits below P0 infrastructure. Advanced/semantic scope-matching refinement is **P2**.

## Current Status
Documented, not implemented. No Attribute Extractor, Scope Matcher, or scoring pipeline exists in code; this document defines the intended matching boundary ahead of implementation.

## Open Questions
- Whether initial matching launches with keyword/rule-based scope matching only, deferring semantic/embedding-based matching to a later iteration.
- How the Constraint Filter's hard filters versus soft-weighted preferences are distinguished (e.g. is language always a hard filter, or can it be relaxed with a lower score).
- How re-scoring is triggered — on every project edit, on a debounce, or only on researcher request — to balance freshness against unnecessary compute.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER PRODUCT ARCHITECTURE.md](../MASTER%20PRODUCT%20ARCHITECTURE.md)
- [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md)
- [Publication Intelligence](./22%20PUBLICATION%20INTELLIGENCE.md)
- [Submission Orchestration](./24%20SUBMISSION%20ORCHESTRATION.md)
- [Research Core](./02%20RESEARCH%20CORE.md)
