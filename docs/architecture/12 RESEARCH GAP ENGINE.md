# Research Gap Engine

## Purpose
The Research Gap Engine helps a researcher answer "has this already been studied, and if so, what is missing?" by analyzing the reference set and synthesis output already gathered inside a `ResearchProject` and surfacing candidate gaps: understudied populations, contexts, methods, or contradictions that have not been resolved. It is a research-planning aid, not a novelty guarantee.

## Scope
Operates within a single `ResearchProject`'s existing reference set and synthesis output. Covers gap candidate generation, gap categorization (population gap, method gap, geographic/context gap, contradiction gap), and presenting gaps with the supporting evidence that justifies each one. Does not cover literature discovery/search itself, does not cover formal novelty or plagiarism checking against the entire body of published literature, and does not guarantee a gap is genuinely unaddressed outside the researcher's own reference set.

## Responsibilities
- Read the project's `EvidenceExtraction` and `SynthesisFlag` data from the [Evidence Synthesis Engine](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md) and the reference set itself.
- Generate candidate gap statements, each tied to the specific references that support the gap claim (so a researcher can verify, not just trust).
- Categorize each candidate gap (population/context/method/theoretical/contradiction).
- Let the researcher accept, dismiss, or annotate a candidate gap, and persist that decision so it is not regenerated identically on the next run.
- Surface gaps that plausibly connect to the researcher's stated research question from the [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md).

## Non-Responsibilities
- Does not claim a gap is globally novel; it only reflects what is present or absent in the researcher's own curated reference set, which is explicitly stated in every gap output.
- Does not search external literature to confirm a gap is unaddressed elsewhere; that would require live discovery, which is out of scope here.
- Does not generate research questions or hypotheses outright; it surfaces gap evidence and lets the researcher (optionally assisted by the Methodology Advisor) form the question.
- Does not call any AI provider or third-party API directly.

## Core Components
- **Gap Candidate Generator**: submits the project's comparison matrix and synthesis flags to the AI Gateway with a gap-analysis prompt template, producing candidate gap statements with citation anchors.
- **Gap Categorizer**: classifies each candidate into a fixed taxonomy (population, method, context/geography, theory, contradiction) either from generator output labels or a lightweight follow-up classification pass.
- **Gap Review State Tracker**: stores researcher accept/dismiss/annotate decisions per gap candidate, keyed by a content hash so re-runs recognize previously-reviewed gaps.
- **Evidence Anchor Linker**: attaches each gap statement to the specific `EvidenceExtraction` rows and `ResearchReference` IDs that justify it.

## Owned Data
| Entity | Description |
|---|---|
| `GapCandidate` | A generated gap statement, its category, its supporting reference IDs, and a content hash for dedup across runs. |
| `GapReviewDecision` | Researcher's accept/dismiss/annotate decision on a `GapCandidate`, with optional note. |
| `GapRunLog` | Record of when gap generation last ran for a project and against which synthesis snapshot. |

## Inputs
- `EvidenceExtraction` and `SynthesisFlag` records from the [Evidence Synthesis Engine](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md).
- The project's `ResearchReference` set.
- Project research question and scope from the [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md).

## Outputs
- `GapCandidate` records rendered to the researcher as a reviewable list, each with supporting citations.
- Accepted gaps published back into the Project Context Engine so downstream engines (Methodology Advisor, Writing) can reference them as project context.

## Dependencies
- [Evidence Synthesis Engine](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md) as its primary data source; gap generation is not meaningful without synthesis having run first.
- [Multi-Model AI Gateway](05%20MULTI%20MODEL%20AI%20GATEWAY.md) for candidate generation.
- [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md) for research-question context and for publishing accepted gaps.
- [15 METHODOLOGY ADVISOR.md](15%20METHODOLOGY%20ADVISOR.md) as a downstream consumer that can turn an accepted gap into a methodology recommendation.

## Extension Points
- Additional gap categories can be added to the taxonomy without changing the generator's core interface.
- A future "cross-project gap scan" (comparing gaps across a researcher's own multiple projects) can be layered on the same `GapCandidate` schema.
- Confidence scoring on gap candidates can be added as an extra field without a schema break.

## Security & Privacy
Gap analysis operates entirely on data already scoped to one private `ResearchProject`; no cross-tenant comparison occurs. Gap candidates and researcher review decisions inherit the project's default-private access rules described in [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md). Prompts sent to the AI Gateway contain only the project's own extracted evidence, never other researchers' project data.

## Failure Modes
- **AI Gateway unavailable**: gap generation pauses; previously generated `GapCandidate` records and researcher decisions remain fully viewable, satisfying degraded-but-functional operation.
- **Synthesis data too sparse** (few references, no extraction run yet): engine returns an explicit "insufficient evidence to analyze gaps yet" state instead of fabricating gap candidates from nothing.
- **Duplicate gap regeneration**: content-hash dedup prevents the same gap from reappearing after a researcher has already dismissed it, unless the underlying evidence materially changed.

## Observability
- Gap candidates generated per run and acceptance/dismissal rate (signal for generator quality).
- Time-to-first-gap-review per project (product engagement signal).
- Category distribution of generated gaps (used to detect a generator skew, e.g. always producing "method gap" and nothing else).

## P0/P1/P2/P3
**P2.** This is an advanced, differentiating capability that depends entirely on the Evidence Synthesis Engine already being populated; it adds significant value once a project has literature depth but is not required for a project to be usable, and it is more speculative in output quality than P1 capabilities like synthesis itself.

## Current Status
Documented, not implemented. No generator, categorizer, or review-state tracking exists in code yet.

## Open Questions
- Should gap confidence be shown numerically to researchers, or only qualitatively, given the risk of over-trusting an AI-estimated confidence score?
- How should the engine behave for disciplines where "gap" is a less standard concept (e.g., purely qualitative or arts-based research)?
- Should dismissed gaps ever resurface if enough new evidence is added to the project, and after how much change?

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [11 EVIDENCE SYNTHESIS ENGINE.md](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md)
- [13 RESEARCH GRAPH.md](13%20RESEARCH%20GRAPH.md)
- [15 METHODOLOGY ADVISOR.md](15%20METHODOLOGY%20ADVISOR.md)
