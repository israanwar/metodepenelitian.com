# Research Operating System

**Status:** LOCKED — category and system contract

**Implementation status:** Architecture documented; runtime availability must be verified capability by capability.

## Definition

A Research Operating System is the governed execution environment for a research project. It preserves meaning across discovery, design, data, analysis, writing, compliance and publication. Models, agents, files and third-party tools are replaceable workers around one canonical project state; they are not the source of truth.

```text
Users and authorized institutions
              ↓
     Research Project aggregate
              ↓
     Research Digital Twin (RDT)
       ↙          ↓           ↘
Project Context  Compiler   Provenance/Audit
       ↘          ↓           ↙
    Agents, internal engines and workflows
              ↓
 AI Gateway · Integration Gateway · Publication Gateway
```

## Architecture-to-positioning map

| Strategic capability | Existing architecture owner | System role |
|---|---|---|
| Canonical research state | [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md) | Versioned entities, relationships, dependencies and validation state inside `ResearchProject`. |
| Persistent shared context | [Project Context Engine](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md) | Authorized, bounded projection of current RDT state for all assistants and agents. |
| Multi-agent workflow | [Research AI Orchestrator](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md) and [Agent Contract](../agents/RESEARCH%20EXECUTION%20AGENT%20CONTRACT.md) | Coordinates specialist proposals without allowing agent-owned canonical silos. |
| Multi-model execution | [Multi-Model AI Gateway](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md) | Keeps provider selection, fallback, cost and policy outside research truth. |
| Evidence quality | [Evidence Synthesis Engine](../architecture/11%20EVIDENCE%20SYNTHESIS%20ENGINE.md) | Screening, extraction and synthesis with source lineage. |
| Claim traceability | [Evidence-to-Claim Graph](../internal-engines/EVIDENCE%20TO%20CLAIM%20GRAPH.md) | Connects claims to papers, data, analyses, methods and citations. |
| Methodological fit | [Methodology Advisor](../architecture/15%20METHODOLOGY%20ADVISOR.md) | Explainable design advice subject to evidence and human review. |
| Executable analysis | [Dataset & Analysis](../architecture/17%20DATASET%20ANALYSIS.md) | Immutable runs, validated results and result provenance. |
| Research relationships | [Research Graph](../architecture/13%20RESEARCH%20GRAPH.md) | Typed relationships among research objects, not only paper similarity. |
| Citation continuity | [Writing & Citation](../architecture/19%20WRITING%20CITATION.md) | Keeps citations as live pointers to governed references. |
| Institution-aware output | [Formatting Policy Engine](../internal-engines/FORMATTING%20POLICY%20ENGINE.md) | Applies versioned policies without changing canonical research content. |
| Publication path | [Publication Gateway](../architecture/21%20PUBLICATION%20GATEWAY.md) | Readiness and user-controlled official handoff; never autonomous publishing. |
| External interoperability | [Integration Gateway](../architecture/25%20INTEGRATION%20GATEWAY.md) | Provenance, permissions, rate limits and degraded mode for external systems. |

## Lifecycle execution contract

| Lifecycle stage | Canonical state/output | Required system property |
|---|---|---|
| Question and project | Problem, question, objective, candidate decisions | User input starts `PROPOSED`; project identity and access exist first. |
| Evidence and gap | References, screened evidence, claims, gap | Source provenance and admissibility; a gap is not verified by generation alone. |
| Method and instrument | Design, sampling, variables, operationalization, instrument | Fit rationale, assumptions, alternatives and protected human approval. |
| Data and analysis | Immutable source data, preparation lineage, analysis plan/run/result | Reproducibility, result provenance, explicit uncertainty and no AI-created values. |
| Interpretation and writing | Findings, discussion, document sections | Every material assertion can resolve to evidence or analysis state. |
| Citation and compliance | References, citations, policy pack, compliance report, rendered artifact | Formatting cannot alter facts, results, citations, approvals or provenance. |
| Defense and publication | Defense artifacts, readiness, target, submission handoff | Claims stay reviewable; external actions require explicit approval and official destinations. |
| Impact | Publication record, reuse or impact signals | Imported evidence is dated and attributable; absence is `UNKNOWN`, not fabricated. |

The detailed executable sequence remains owned by [End-to-End Research Execution](../architecture/END%20TO%20END%20RESEARCH%20EXECUTION.md) and [Idea-to-Publication Pipeline](../workflows/IDEA%20TO%20PUBLICATION%20PIPELINE.md). This document defines the category, not a competing workflow source of truth.

## System invariants

1. `ResearchProject` is the aggregate root; the RDT is canonical research state.
2. Canonical research content is separate from presentation and formatting policy.
3. Formats, models, agents and providers cannot change facts, results, citations or provenance.
4. Originals and accepted history are immutable; derived outputs are versioned artifacts.
5. Every material AI output is a proposal until the applicable gate and approval pass.
6. External providers enter only through governed gateways and capability status.
7. Private-by-default access and least privilege apply across the lifecycle.
8. Publication Gateway routes and records handoff; it is not a journal or autonomous publisher.
9. Upstream changes expose downstream impact and staleness; they never silently rewrite history.
10. The system degrades explicitly to `UNKNOWN`, `UNAVAILABLE` or `BLOCKED` instead of inventing certainty.

## Operating-system success test

The category is earned only when a project can cross workflows without copy-paste loss of identity, context, evidence, decisions, provenance and approvals. Shipping many tools without this continuity remains a tool suite, not a Research Operating System.

Implementation must follow [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md). Strategic documentation does not advance any implementation gate.

## Related documents

- [Strategic Positioning](STRATEGIC%20POSITIONING.md)
- [Product Differentiation](PRODUCT%20DIFFERENTIATION.md)
- [Competitive Landscape](COMPETITIVE%20LANDSCAPE.md)
- [Master Data Governance](../MASTER%20DATA%20GOVERNANCE.md)
- [Master AI Governance](../MASTER%20AI%20GOVERNANCE.md)
