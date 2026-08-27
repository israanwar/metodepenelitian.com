# Analysis Advisor

## Purpose
The Analysis Advisor recommends appropriate statistical or analytical approaches once a researcher has a methodology and data characteristics defined, answering "given my design and my data, what analysis should I run and why?" It produces a recommendation and rationale; it does not itself run the analysis (that is [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md)).

## Scope
Covers analytical method recommendation for a single `ResearchProject`: given the chosen methodology, variable types, sample characteristics, and research question, suggesting appropriate statistical tests or analytical frameworks, with assumptions and caveats stated explicitly. Does not cover executing any analysis or touching actual dataset values (data never needs to leave the Dataset Analysis boundary to get an analysis recommendation; variable-level metadata is enough). Does not cover qualitative coding schemes (that is [18 QUALITATIVE MIXED METHODS.md](18%20QUALITATIVE%20MIXED%20METHODS.md)) except where a mixed-methods design requires coordinating both.

## Responsibilities
- Read the project's chosen methodology from the [Methodology Advisor](15%20METHODOLOGY%20ADVISOR.md) and variable/data-shape metadata (variable count, types: categorical/continuous/ordinal, sample size, design: between-subjects/within-subjects/longitudinal) supplied by the researcher or inferred from an uploaded dataset's schema.
- Recommend statistical tests or analytical frameworks appropriate to that combination (e.g., independent-samples t-test, chi-square, multiple regression, thematic framework), each with its underlying assumptions stated (normality, independence, sample size minimums).
- Flag when the researcher's described data characteristics violate a recommended test's assumptions, and suggest alternatives (e.g., non-parametric equivalents).
- Hand off a confirmed analytical approach to [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md) as the specification for the actual computation.

## Non-Responsibilities
- Does not perform the statistical computation itself; it recommends what to run, Dataset Analysis runs it.
- Does not access raw dataset values to make a recommendation; it works from variable-level metadata and researcher-described characteristics, keeping the recommendation step lightweight and not dependent on data upload having happened yet.
- Does not validate statistical results after the fact for correctness beyond assumption-checking at recommendation time; result interpretation support, if offered, is a downstream concern of Dataset Analysis and Writing.
- Does not replace a statistics consultant for high-stakes or unusual designs; recommendations are explicitly framed as a starting point.

## Core Components
- **Data Characteristic Intake**: structured form/inference step capturing variable types, design structure, and sample size, either researcher-entered directly or inferred from a dataset schema once uploaded.
- **Analytical Knowledge Base**: curated mapping from (design type, variable types, research question type) to candidate statistical tests/frameworks, with assumptions and typical pitfalls, analogous in structure to the Methodology Advisor's knowledge base.
- **Recommendation Orchestrator**: combines intake data with the knowledge base into a recommendation request through the Multi-Model AI Gateway, returning ranked candidates with rationale and assumption checks.
- **Assumption Checker**: a rules-based (non-AI) pass that flags obvious assumption violations (e.g., recommending a t-test with a stated sample size of 4) before or alongside the AI-generated rationale, so critical statistical guardrails do not depend solely on model output.

## Owned Data
| Entity | Description |
|---|---|
| `DataCharacteristics` | Project-scoped record of variable types, design structure, and sample size used as recommendation input. |
| `AnalysisRecommendation` | Ranked candidate analytical approaches with rationale and assumption notes, tied to the `DataCharacteristics` snapshot used. |
| `AnalyticalKnowledgeEntry` | One curated entry mapping a design/data pattern to appropriate tests and their assumptions. |
| `AnalysisDecision` | Researcher's confirmed analytical approach, handed to Dataset Analysis as its execution specification. |

## Inputs
- Chosen methodology from [15 METHODOLOGY ADVISOR.md](15%20METHODOLOGY%20ADVISOR.md).
- `DataCharacteristics` entered by the researcher or inferred from a dataset schema via [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md).
- Research question from the [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md).

## Outputs
- `AnalysisRecommendation` rendered as a reviewable ranked list with assumptions and caveats.
- `AnalysisDecision`, published to the Project Context Engine and handed to Dataset Analysis as an execution spec once confirmed.

## Dependencies
- [Methodology Advisor](15%20METHODOLOGY%20ADVISOR.md) for the design context a recommendation is built on.
- [Multi-Model AI Gateway](05%20MULTI%20MODEL%20AI%20GATEWAY.md) for recommendation generation.
- [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md) as the downstream execution engine for whatever this advisor recommends.
- [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md) for context read/write.

## Extension Points
- Additional analytical frameworks (Bayesian approaches, structural equation modeling) can be added to the knowledge base without changing the orchestrator.
- The Assumption Checker's rule set can grow independently of the AI-generated rationale, since it runs as a separate, deterministic pass.
- A future "explain this test in plain language" mode can reuse the same recommendation context.

## Security & Privacy
Recommendations run on variable-level metadata and design descriptions, not raw data values, which limits privacy exposure even before a dataset is uploaded. Where dataset schema is used to infer characteristics, only schema (column names/types), not row-level content, is passed into recommendation prompts. All recommendation data inherits the project's default-private access rules per [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).

## Failure Modes
- **AI Gateway unavailable**: recommendation generation pauses; the deterministic Assumption Checker and curated knowledge base can still surface relevant `AnalyticalKnowledgeEntry` matches directly, keeping the advisor degraded-but-functional rather than fully dark.
- **Data characteristics incomplete**: engine declines to produce a confident ranked recommendation and instead prompts for the missing characteristic (e.g., sample size) rather than guessing.
- **Recommended test conflicts with stated assumptions**: Assumption Checker flag takes precedence over AI rationale in the rendered output, so a confident-sounding but assumption-violating suggestion is never shown unqualified.

## Observability
- Recommendation generation count and AI Gateway error rate for this engine's call type.
- Assumption-violation flag rate (signal for how often researcher-entered data characteristics are edge cases).
- Rate at which `AnalysisDecision` matches the top-ranked recommendation.

## P0/P1/P2/P3
**P1.** Analysis recommendation is a major product capability core to the "Research OS" promise for quantitative and mixed-methods researchers, but the platform functions without it (a researcher can proceed straight to Dataset Analysis with a self-chosen test), so it is P1, not P0.

## Current Status
Documented, not implemented. No intake flow, knowledge base, orchestrator, or assumption checker exists in code yet.

## Open Questions
- How much statistical rigor should the Assumption Checker enforce as hard blocks versus soft warnings, given researchers at very different skill levels?
- Should the knowledge base distinguish frequentist versus Bayesian recommendation paths, or default to frequentist given typical academic norms in Indonesian institutions?
- How does this advisor coordinate with [18 QUALITATIVE MIXED METHODS.md](18%20QUALITATIVE%20MIXED%20METHODS.md) for a mixed-methods project needing both a statistical and a qualitative analytical plan?

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [15 METHODOLOGY ADVISOR.md](15%20METHODOLOGY%20ADVISOR.md)
- [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md)
- [18 QUALITATIVE MIXED METHODS.md](18%20QUALITATIVE%20MIXED%20METHODS.md)
