# Research Execution Agent Contract

**Status:** P0 multi-agent governance contract — documented, not implemented

## Purpose

This contract defines how research agents collaborate across the End-to-End Research Execution Pipeline. An agent is a governed role/capability with tools and policies; it is not an AI model. OpenAI, Claude, Gemini, DeepSeek, Mistral, and future providers are interchangeable execution providers behind Multi-Model AI Gateway.

## Shared-state rule

Every agent reads an authorized, pinned Project Context projection of the same project-scoped Research Digital Twin and returns a proposed patch, evidence links, confidence/assumptions, dependency-impact expectation, and validation request. Agents cannot own silo databases, assemble private canonical project contexts, write across project boundaries, or call providers directly.

```text
Research Director / Agent Orchestrator
├── Intake and Problem Formulation Agents
├── Literature, Screening, Evidence, Research Gap, Theory Agents
├── Methodology, Sampling, Instrument, Data Steward Agents
├── Analysis and Statistical/Qualitative Critic Agents
├── Writing, Citation, and Research Critic Agents
└── Publication, Journal Matching, Review/Revision Agents
             ↓ proposed changes
      Research Digital Twin Engine
             ↓ validation
        Research Compiler
             ↓ protected change
         Human Approval
```

## Role responsibilities

- **Research Director:** decomposes workflow, selects capability roles, maintains correlation, and proposes next stages; cannot approve its own protected changes.
- **Literature/Screening/Evidence:** discover, screen, verify source identity, and propose claim-evidence links with search/coverage provenance.
- **Research Gap/Theory:** evaluate gap and theoretical fit, including contrary evidence and limitations.
- **Methodology/Sampling/Instrument:** propose method, population/sample, operationalization, instrument, and feasibility; domain critics validate independently.
- **Data Steward / Data Preparation Agent:** protects consent, lineage, immutable raw data/transcripts, dataset versioning, mappings, and access classification; proposals cannot silently clean/exclude/remap.
- **Analysis Advisor Agent:** uses RQ/objective/hypothesis/design/roles/types/scales/population/sampling/sample/data/assumption context to return explainable registry-backed recommendations, never keyword-only selection.
- **Quantitative Agent:** executes only approved capability plans through deterministic Statistical Execution; never uses model-generated numerical output.
- **Qualitative Agent:** proposes versioned codes/themes/findings tied to immutable source quotations and human review.
- **Mixed Methods Agent:** performs explicit triangulation, convergence/divergence, joint display, and provenance-bearing meta-inference rather than concatenating result summaries.
- **Statistical Critic / Interpretation Agent:** validates assumptions/results and produces separated, provenance-bound interpretation without changing values.
- **Discussion Agent / Writing/Citation:** connects findings to RQs/hypotheses/theory/evidence and renders verified project state; cannot invent values/sources or exceed verified scope.
- **Research Critic:** adversarially tests reasoning, disagreement, bias, and consistency; cannot silently replace user decisions.
- **Publication/Journal Matching:** verifies venue metadata and package readiness, then assists a user-controlled Publication Gateway handoff; never guarantees acceptance or submits autonomously.

## Invocation envelope

Every run records agent role/version, project/twin/context versions, task and expected output schema, permissions, approved tools/integrations, evidence inputs, model routing request/result, prompt/policy versions, start/end/status, output proposal, confidence/assumptions, and audit/correlation ids.

Tools run with least privilege through the AI Tool Calling and Integration Gateways. Retrieved documents are untrusted input. Provider output is never accepted as evidence solely because the provider/model is trusted or confident.

## Handoff and disagreement

Outputs are handed off through RDT entity/relationship references, not free-text memory. The Orchestrator verifies input version and required prerequisites before invoking the next role. Material disagreement is preserved as competing proposals with evidence and routed to Research Critic/human review; it is not averaged into a false consensus.

## Status and authority

Initial agent content is `PROPOSED`. Agents may recommend `SOURCE VERIFIED`, `EVIDENCE VERIFIED`, `METHODOLOGICALLY VERIFIED`, or `ANALYSIS VERIFIED` only through the defined verification process and evidence record. Research Compiler returns `PASS`, `WARNING`, `ERROR`, `BLOCKED`, or `UNKNOWN` for checks.

Explicit human approval is required before destructive cleaning, excluding observations, changing variable mapping/methodology/analysis method, executing expensive analysis, replacing verified interpretation/final document sections/final analysis/manuscript, changing population/sample/publication target, submitting externally, or publishing research data. Agents can propose, explain, preview, and identify impact only.

## Failure behavior

On stale context, permission denial, missing evidence, provider/integration outage, conflicting outputs, or unsafe requested mutation, the agent stops that proposal, records `BLOCKED`/`UNKNOWN` with recovery requirements, and preserves canonical state. Safe degraded output must be clearly labeled and cannot claim current verification.

## Related documents

- [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md)
- [Research Compiler](../architecture/RESEARCH%20COMPILER.md)
- [Idea-to-Publication Pipeline](../workflows/IDEA%20TO%20PUBLICATION%20PIPELINE.md)
- [Research AI Orchestrator](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md)
- [Multi-Model AI Gateway](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md)
- [Data → Analysis → Interpretation → Academic Document Pipeline](../architecture/DATA%20ANALYSIS%20INTERPRETATION%20DOCUMENT%20PIPELINE.md)
- [Data-to-Analysis Workflow](../workflows/DATA%20TO%20ANALYSIS%20WORKFLOW.md)
- [Analysis-to-Interpretation Workflow](../workflows/ANALYSIS%20TO%20INTERPRETATION%20WORKFLOW.md)
- [Interpretation-to-Document Workflow](../workflows/INTERPRETATION%20TO%20DOCUMENT%20WORKFLOW.md)
