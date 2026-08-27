# Analysis-to-Interpretation Workflow

**Status:** LOCKED P0 workflow contract — documented, not implemented

## Goal

Turn a completed quantitative/qualitative/mixed-method execution into verified results and human-approved, theory/evidence-aware interpretation without changing numbers, source quotations, or run history.

## Entry gate

Inputs are an immutable AnalysisRun, pinned dataset/source and plan versions, structured results/findings, diagnostics/assumptions, Research Question/Hypothesis, Methodology, Theory, Literature Evidence, and authorization. A merely `COMPLETED` run cannot enter final interpretation until Result Validation establishes eligible verified inputs.

## Workflow

1. **Validate execution fidelity** — confirm approved plan/capability, engine/environment, input checksums, status, diagnostics, warnings/errors, and structured/raw output alignment.
2. **Validate quantitative results** — type/bounds/precision, assumptions, RQ/hypothesis mappings, coefficient/CI/p/effect and relevant diagnostics. No AI edits.
3. **Validate qualitative findings** — method/codebook versions, supporting/contrary quotation coordinates, reviewer decisions, coverage/context, and source immutability.
4. **Integrate mixed methods where applicable** — align constructs/RQs, document convergence/divergence/complementarity, create provenance-bearing joint display, and validate meta-inference.
5. **Create interpretation proposal** — separated Statistical, Substantive, Hypothesis Decision, Theoretical, Practical Implication, and Limitations components, each linked to exact results/findings.
6. **Connect evidence and theory** — use Evidence-to-Claim Graph to record support/contradiction and boundary conditions; never generate generic discussion.
7. **Statistical/qualitative and Research Critic review** — challenge numerical fidelity, causal language, selective reporting, alternative explanations, and omitted contrary evidence.
8. **Human review/approval** — approve or revise interpretation. Replacing verified interpretation later requires approval.
9. **Compiler gate** — validate Result↔RQ/Hypothesis, Interpretation↔Result/Finding, theory/evidence links, and stale dependencies.
10. **Commit and propagate** — version approved interpretation in RDT, emit `interpretation.generated`/`interpretation.approved`, and mark document sections eligible for composition.

## Numerical/qualitative provenance

```text
Interpretation token/value → StructuredResult → AnalysisRun → DatasetVersion → RAW
Interpretation claim → Finding/Theme → QuotationLink → Transcript/SourceVersion
```

Original values are preserved at source precision; display precision is deterministic and explicit. AI cannot invent, replace, silently correct, or inconsistently round. Qualitative AI suggestions remain reviewable and cannot remove original context.

## Failure and next action

Numerical mismatch, unverified run, missing quotation, stale source, assumption failure without limitation, unsupported causal/substantive claim, or theory/evidence fabrication opens compiler issues and blocks approval/final document use. The next action names the exact missing/invalid dependency rather than regenerating prose blindly.

## Roles

Quantitative/Qualitative/Mixed Methods Agents produce structured proposals; Statistical Critic, Evidence Agent, Interpretation Agent, and Research Critic review; Orchestrator sequences them; human owns protected decisions. Models are routed only through Multi-Model AI Gateway and do not receive raw data automatically.

## Related documents

- [Interpretation Engine](../internal-engines/INTERPRETATION%20ENGINE.md)
- [Result Provenance Engine](../internal-engines/RESULT%20PROVENANCE%20ENGINE.md)
- [Analysis Result Model](../database/ANALYSIS%20RESULT%20MODEL.md)

