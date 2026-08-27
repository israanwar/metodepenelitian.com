# Methodology Advisor

## Purpose
The Methodology Advisor helps a researcher choose and justify a research methodology (design, sampling approach, data collection method) appropriate to their research question, project context, and any identified gaps, and produces a draft methodology justification the researcher edits rather than treats as final.

## Scope
Covers methodology recommendation and justification drafting for a single `ResearchProject`: reading the project's research question, discipline, and (where present) accepted gaps and synthesis output, and producing ranked methodology suggestions with rationale and known trade-offs. Does not cover actually executing a chosen methodology (data collection tooling, survey instruments), does not cover statistical or analytical method choice once data exists (that is [16 ANALYSIS ADVISOR.md](16%20ANALYSIS%20ADVISOR.md)), and does not cover qualitative coding execution (that is [18 QUALITATIVE MIXED METHODS.md](18%20QUALITATIVE%20MIXED%20METHODS.md)).

## Responsibilities
- Read project context (research question, discipline, scope) from the [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md) and, where present, accepted gaps from the [Research Gap Engine](12%20RESEARCH%20GAP%20ENGINE.md).
- Generate ranked methodology candidates (e.g., cross-sectional survey, case study, experimental design, grounded theory) with an explicit rationale tying each candidate back to the research question and any gap it addresses.
- Surface known trade-offs and limitations for each candidate (sample access difficulty, time cost, generalizability limits) rather than presenting a single confident answer.
- Maintain a lightweight, curated methodology knowledge base (design types, typical use cases, common pitfalls) used to ground recommendations, kept separate from raw AI generation so recommendations are not purely model-invented.
- Persist the researcher's chosen methodology and rationale back into project context for downstream engines (Writing, Analysis Advisor) to use.

## Non-Responsibilities
- Does not select the final methodology on the researcher's behalf; it recommends and explains, the researcher decides.
- Does not validate IRB/ethics compliance for a chosen methodology; that remains the researcher's and their institution's responsibility.
- Does not generate data collection instruments (surveys, interview protocols) as a first-class output in this version; that is a stated extension point, not a current responsibility.
- Does not call any AI provider directly, and does not hold its own model-specific logic outside the Multi-Model AI Gateway.

## Core Components
- **Methodology Knowledge Base**: a curated, versioned reference set of methodology types, typical applications, and known trade-offs, used as grounding context in recommendation prompts to reduce ungrounded generation.
- **Recommendation Orchestrator**: builds a recommendation request from project context plus the knowledge base and submits it through the Multi-Model AI Gateway, returning ranked candidates with rationale.
- **Justification Draft Generator**: given a researcher-selected methodology, drafts a methodology-section justification paragraph set, explicitly marked as a draft.
- **Decision Recorder**: stores the researcher's final methodology choice, distinguishing it from the (possibly different) top-ranked AI suggestion, for later reference and for measuring recommendation usefulness.

## Owned Data
| Entity | Description |
|---|---|
| `MethodologyRecommendation` | A generated ranked list of methodology candidates for a project, with rationale and trade-offs, tied to the project context snapshot it was generated from. |
| `MethodologyKnowledgeEntry` | One curated entry in the knowledge base: a methodology type, its typical use cases, and known pitfalls. |
| `MethodologyDecision` | The researcher's recorded final choice and justification, linked to (but not required to match) the top AI recommendation. |

## Inputs
- Project research question, discipline, and scope from the [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md).
- Accepted `GapCandidate` records from the [Research Gap Engine](12%20RESEARCH%20GAP%20ENGINE.md), where present.
- The `MethodologyKnowledgeEntry` base.

## Outputs
- `MethodologyRecommendation` records rendered as a reviewable, ranked list with rationale.
- `MethodologyDecision` once the researcher confirms a choice, published back into the Project Context Engine.
- Draft justification text for use in the methodology section of a manuscript, handed to [19 WRITING CITATION.md](19%20WRITING%20CITATION.md) on request.

## Dependencies
- [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md) for reading and writing shared project context.
- [Multi-Model AI Gateway](05%20MULTI%20MODEL%20AI%20GATEWAY.md) for all generation calls.
- [Research Gap Engine](12%20RESEARCH%20GAP%20ENGINE.md) as an optional but valuable upstream input.
- [16 ANALYSIS ADVISOR.md](16%20ANALYSIS%20ADVISOR.md) as a downstream engine that picks up once a methodology (and its implied data type) is chosen.

## Extension Points
- Data collection instrument drafting (survey items, interview protocols) as a future output type from the same recommendation context.
- Discipline-specific knowledge base packs (e.g., a public-health-specific versus an education-specific methodology knowledge set) loaded per project's declared discipline.
- A future "compare two methodologies side by side" mode built on the same ranked-candidate data.

## Security & Privacy
All recommendation generation runs on data already scoped to one private `ResearchProject`; no cross-project or cross-tenant comparison occurs. The knowledge base is shared, non-personal reference content and carries no project-specific data. Recommendations and decisions inherit the project's default-private access rules per [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).

## Failure Modes
- **AI Gateway unavailable**: recommendation generation pauses; the engine falls back to a degraded mode that surfaces relevant `MethodologyKnowledgeEntry` items directly (curated, non-AI-generated) so the researcher still gets useful, non-personalized guidance rather than a hard failure.
- **Insufficient project context** (no research question set yet): engine declines to generate a ranked recommendation and instead prompts the researcher to complete project context first, rather than guessing.
- **Researcher overrides top recommendation repeatedly across projects**: not treated as an error, but logged as a quality signal for knowledge base or prompt tuning.

## Observability
- Recommendation generation count and AI Gateway error rate specific to this engine's call type.
- Rate at which the researcher's final `MethodologyDecision` matches the top-ranked AI suggestion (recommendation quality proxy).
- Knowledge base coverage gaps (recommendation requests where no closely matching knowledge entry exists).

## P0/P1/P2/P3
**P1.** Methodology recommendation is a major product capability directly tied to the platform's "Research OS" value proposition, but a researcher can proceed with manually chosen methodology without it, so it is not foundational (P0) in the way the Context Engine or gateways are.

## Current Status
Documented, not implemented. No knowledge base, recommendation orchestrator, or decision recorder exists in code yet.

## Open Questions
- Who authors and maintains the initial `MethodologyKnowledgeEntry` set, and how is it kept current across disciplines?
- Should recommendations differ for undergraduate thesis work versus graduate/professional research, given very different constraints (time, resources, supervision)?
- How explicitly should the UI warn that a recommendation is not a substitute for supervisor/advisor approval?

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [03 PROJECT CONTEXT ENGINE.md](03%20PROJECT%20CONTEXT%20ENGINE.md)
- [12 RESEARCH GAP ENGINE.md](12%20RESEARCH%20GAP%20ENGINE.md)
- [16 ANALYSIS ADVISOR.md](16%20ANALYSIS%20ADVISOR.md)
- [18 QUALITATIVE MIXED METHODS.md](18%20QUALITATIVE%20MIXED%20METHODS.md)
