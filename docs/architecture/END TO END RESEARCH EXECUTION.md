# End-to-End Research Execution

**Status:** P0 workflow architecture — documented, not implemented

## Purpose

This architecture defines how MetodePenelitian.com converts a minimal research input into an executable, auditable `ResearchProject`, from intake through publication record. It is the official orchestration contract, not a promise of autonomous research or autonomous submission.

## Inputs and normalization

Accepted inputs include a title, idea, table of candidate titles, initial proposal, methodology draft, papers, dataset, or any combination. Intake preserves the original material, records provenance and consent/access classification, creates project-scoped proposed entities, and never treats user-provided design or claims as verified.

The generic working example is “Branding dynamics within asymmetric digital music platforms in Indonesia,” optionally accompanied by proposed field, variables, intervening/moderating/grouping variables, outcome, method, analysis, population, ideal sample, gap, and contribution. Every item enters as `PROPOSED` and follows domain verification.

## Official lifecycle

The 27 stages are:

1. Research Intake
2. Problem Formulation
3. Evidence Discovery
4. Literature Screening
5. Research Gap Verification
6. Theory Selection
7. Construct & Variable Design
8. Hypothesis Development
9. Research Design
10. Sampling
11. Operationalization
12. Instrument Design
13. Data Collection
14. Data Preparation
15. Analysis Planning
16. Statistical / Qualitative Analysis
17. Result Interpretation
18. Discussion
19. Academic Writing
20. Research Compiler
21. Publication Intelligence
22. Journal Matching
23. Publication Readiness
24. Submission Preparation
25. Official Submission Handoff
26. Review & Revision
27. Publication Record

The detailed WHAT, inputs, outputs, agents, tools, integrations, RDT updates, validations, approvals, failure conditions, and next states for every stage are defined in [Idea to Publication Pipeline](../workflows/IDEA%20TO%20PUBLICATION%20PIPELINE.md).

## Orchestration rules

- Research Digital Twin is canonical; each stage reads a pinned version and proposes a versioned patch.
- Agent Orchestrator assigns agents; every model invocation passes through Multi-Model AI Gateway.
- External sources and tools pass through Integration Gateway with provenance, permissions, rate limits, and degraded-mode handling.
- Research Compiler runs incrementally after material changes and as the formal stage 20 gate.
- A workflow may revisit an earlier stage. State is a graph with controlled transitions, not a lossy linear wizard.
- Downstream artifacts invalidated by upstream changes remain in history and are marked stale; they are never silently overwritten.
- Frontend stage labels are projections of backend RDT and compiler state.
- Publication Gateway provides an official, user-controlled handoff. It cannot submit autonomously.

## Verification examples

```text
Proposed Research Gap
→ Literature Agent → Evidence Agent → Research Gap Agent → Research Critic
→ EVIDENCE VERIFIED | REJECTED | NEEDS REVISION

Proposed SEM-PLS
→ Methodology Agent → PLS-SEM Agent → Sample Size Agent → Statistical Critic
→ METHODOLOGICALLY VERIFIED | NEEDS REVISION
```

`REJECTED` and `NEEDS REVISION` are workflow decisions/recommendations recorded with reasons; canonical entity lifecycle continues to use the strict status vocabulary defined by the RDT contract.

## Candidate research topics

When input contains multiple titles, each becomes a `CandidateResearchTopic`. Agents evaluate all candidates against the same dimension definitions and evidence window. `CandidateEvaluation` stores rationale, evidence, confidence, assumptions, evaluator/rule versions, and risk. The comparison may recommend but cannot select or verify on the user's behalf.

## Human authority

Explicit approval is required for methodology changes, hypothesis replacement, population/sample changes, final-instrument modification, dataset overwrite, final-analysis/manuscript replacement, publication-target change, external submission, and research-data publication. The system presents proposed change, rationale, evidence, dependency impact, preview, and rollback/history information before approval.

## Completion definition

The pipeline reaches `Publication Record` only when the official submission handoff was user-approved, review/revision state is recorded, publication metadata has traceable provenance, and the Research Compiler reports the applicable publication claims consistently. “Publication ready” is not equivalent to “published.”

## Related documents

- [Idea to Publication Pipeline](../workflows/IDEA%20TO%20PUBLICATION%20PIPELINE.md)
- [Research Digital Twin](./RESEARCH%20DIGITAL%20TWIN.md)
- [Research Compiler](./RESEARCH%20COMPILER.md)
- [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md)
