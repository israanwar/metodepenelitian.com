# Interpretation Engine

**Status:** LOCKED P0 interpretation contract — documented, not implemented

## Purpose

Interpretation Engine converts verified structured quantitative results and/or qualitative findings into bounded, reviewable meaning. It explains results without changing them and connects them to the project's questions, hypotheses, methodology, theory, and literature evidence.

## Required inputs

Pinned Project Context/RDT version, Research Question, Hypothesis where applicable, Methodology, Analysis Method, verified Structured Analysis Result/Finding, assumptions/limitations, relevant Theory, and Literature Evidence. Missing critical input yields `INSUFFICIENT INFORMATION`/compiler `UNKNOWN`, not a generic interpretation.

## Separated outputs

1. **Statistical Interpretation** — faithfully states coefficient/effect/CI/p-value or other structured outputs with defined rounding.
2. **Substantive Interpretation** — explains magnitude/direction in the project context without overstating causality.
3. **Hypothesis Decision** — uses declared decision rule and links Hx → coefficient/result → CI/p/effect → decision.
4. **Theoretical Interpretation** — compares result with theory and boundary conditions.
5. **Practical Implication** — bounded, audience/context-specific implication.
6. **Limitations** — assumptions, design/data/generalizability uncertainty.

Qualitative interpretation similarly traces claim → theme/finding → quotations/source segments → method/codebook/run.

## Numerical and evidence guardrails

All numbers are typed references to validated structured-result fields. Deterministic renderers apply consistent display precision. AI may explain but must not invent, silently correct, replace, inconsistently round, or derive a new unvalidated value. Theory/evidence claims use Evidence-to-Claim Graph and preserve contradiction/limitations.

## Discussion connection

Discussion proposals follow Finding → RQ → Hypothesis (if applicable) → Theory → Previous Evidence → Convergence/Contradiction → Interpretation → Contribution → Implication. The engine returns linked components, not ungrounded prose. Discussion Agent/Writer renders them; Research Compiler verifies fidelity.

## Approval and invalidation

An interpretation is `PROPOSED` until human review and appropriate validation. Replacing a verified interpretation requires approval. Dataset, analysis run/result, hypothesis, methodology, theory, or source-evidence changes invalidate dependent interpretations and document sections through RDT propagation.

## Failure and observability

Block verification on stale/unverified results, missing provenance, numerical mismatch, unsupported causal language, absent quotation support, or contradictory evidence omitted without rationale. Observe mismatch detections, unsupported-claim rate, human correction categories, stale interpretations, and approval latency.

## Related documents

- [Result Provenance Engine](./RESULT%20PROVENANCE%20ENGINE.md)
- [Analysis Result Model](../database/ANALYSIS%20RESULT%20MODEL.md)
- [Analysis-to-Interpretation Workflow](../workflows/ANALYSIS%20TO%20INTERPRETATION%20WORKFLOW.md)

