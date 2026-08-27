# Research Digital Twin

**Status:** P0 architectural contract — documented, not implemented
**Scope:** conceptual architecture only; no schema, migration, API, or service is defined here.

## Purpose

The Research Digital Twin (RDT) is the versioned, living, project-scoped representation of an executable research project. It is not a document, chat transcript, vector-store dump, or model memory. `ResearchProject` remains the aggregate root; the RDT is its canonical research-state graph and is shared through the Project Context Engine by every agent and AI model.

The RDT turns an initial title, idea, candidate-title table, proposal, methodology draft, paper collection, dataset, or combination of these into traceable state spanning:

`IDEA → PROBLEM → EVIDENCE → THEORY → VARIABLES → HYPOTHESES → METHODOLOGY → INSTRUMENT → DATA → ANALYSIS → RESULTS → DISCUSSION → WRITING → PUBLICATION READINESS → SUBMISSION → REVIEW → PUBLICATION RECORD`

## Locked boundary

- `ResearchProject` owns identity, access, and aggregate lifecycle.
- The RDT owns canonical research entities, relationships, dependency state, validation state, and version history inside that project.
- Project Context Engine projects an authorized, size-bounded snapshot from the RDT for agents and models; it does not replace the RDT.
- Research Compiler validates RDT snapshots and records issues; it does not silently rewrite them.
- AI Gateway remains the only model boundary. Agent is not model, and provider-specific logic cannot enter Research Core or the RDT.
- Agent Orchestrator coordinates agents. Agents cannot own silo databases or private copies of canonical project state.
- Integration Gateway remains the external-data boundary. Publication Gateway remains a router and handoff layer, not an autonomous publisher.

## Canonical graph

```text
ResearchProject
├── Topic, Phenomenon, Problem
├── ResearchQuestion, Objective, Contribution
├── Literature, Evidence, ResearchGap
├── Theory, Construct, Variable, Indicator
├── Hypothesis, ConceptualFramework
├── Methodology, Population, Sampling, Sample
├── Instrument, DataCollection, Dataset
├── AnalysisPlan, AnalysisRun
├── Result, Finding, Discussion
├── Document, Citation, Reference
├── PublicationTarget, Submission
└── PublicationRecord
```

Every node has a stable identifier, project identifier, entity type, lifecycle status, current version, provenance, creator, timestamps, and access classification. Every edge has a typed relationship, source and target identifiers, rationale, provenance, validity interval, and version. Derived projections may be rebuilt; canonical history may not be silently overwritten.

## State and provenance

Permitted lifecycle/validation labels are explicit and non-interchangeable:

- `PROPOSED`, `IN PROGRESS`, `SOURCE VERIFIED`, `EVIDENCE VERIFIED`, `METHODOLOGICALLY VERIFIED`, `ANALYSIS VERIFIED`, `PASS`, `LOCKED`, `BLOCKED`, `DEPRECATED`.
- Provenance may additionally record `USER PROVIDED`, `AI GENERATED`, `APPROVED`, or `PUBLISHED` as origin/decision facts, not substitutes for verification.
- Initial user input is `PROPOSED`. It cannot self-assert any verified status.
- `UNKNOWN` is a compiler outcome for insufficient knowledge, not permission to fabricate a value.
- Verification requires the verifier, method, evidence references, timestamp, and snapshot version.

## Versioning and audit

Each accepted mutation creates an immutable `ResearchChange` and a new RDT version. A change records actor, source, before/after references, rationale, approvals, event id, affected entities, and compiler result. Optimistic concurrency prevents two writers from silently overwriting the same version. Historical snapshots remain reconstructable according to retention policy.

Model and agent outputs are proposals until an authorized workflow accepts them. Each AI-assisted proposal records model/provider routing metadata through the AI Gateway, prompt/policy versions, context-snapshot id, tool evidence, and confidence. Canonical meaning never depends on that provider remaining available.

## Dependency graph and change impact

Relationship types include `DEFINES`, `ADDRESSES`, `OPERATIONALIZES`, `MEASURES`, `TESTS`, `SUPPORTED_BY`, `DERIVED_FROM`, `USES`, `PRODUCES`, `CITES`, `TARGETS`, and `DEPENDS_ON`. A dependency carries propagation policy:

- `INVALIDATE`: downstream verification becomes stale and must be rerun.
- `REVIEW`: downstream state remains available but is flagged for human/agent review.
- `RECOMPUTE`: a deterministic derived artifact may be queued for regeneration.
- `BLOCK`: downstream transition is prevented until the issue is resolved.
- `NOTIFY`: responsible users receive an impact summary.

Propagation is directional, cycle-checked, idempotent, scoped to one project, and never performs a destructive replacement. The impact analyzer calculates the transitive affected set, records it, marks affected validations stale, opens compiler issues, and proposes actions. Approval gates remain authoritative.

`BLOCK` prevents an affected artifact from being accepted as current/valid or crossing a protected/publication gate. It does not prevent exploratory work elsewhere in the project or impose a mandatory linear UI sequence.

Examples:

```text
Sample → Statistical Power → Methodology → Analysis → Results → Discussion → Manuscript
Hypothesis → Variables → Analysis Plan → Results → Discussion → Conclusion
Retracted Paper → Evidence → Claim → Theory Support → Discussion → Publication Readiness
```

If a source paper is retracted, the paper is `DEPRECATED`; dependent evidence and claims lose current verification, but prior history is retained. Publication readiness is blocked when a major publication claim no longer has admissible support.

## Events

The RDT consumes or emits, at minimum:

`research.project.created`, `research.title.changed`, `research.question.changed`, `research.hypothesis.changed`, `research.sample.changed`, `research.methodology.changed`, `research.reference.added`, `research.reference.retracted`, `research.dataset.updated`, `research.analysis.completed`, `research.claim.created`, `research.compiler.failed`, `research.compiler.passed`, `publication.target.changed`, and `publication.status.changed`.

Events carry event id, project id, aggregate/RDT version, actor, occurred-at, correlation/causation ids, affected entities, provenance, and access classification. They drive propagation, validation, agent triggers, notification, and audit. Delivery is idempotent; an event never authorizes destructive work by itself.

## Shared agent and model context

```text
Research Director
  → Literature Agent → Evidence Agent → Research Gap Agent
  → Methodology Agent → Analysis Agent → Writing Agent
  → Publication Agent → Research Compiler
                         ↕
                Research Digital Twin
                         ↕
               Project Context Engine
                         ↕
               Multi-Model AI Gateway
```

All agents read an authorized RDT snapshot and return proposed patches with evidence and expected impact. The Orchestrator resolves sequencing; the Compiler validates; the user approves protected decisions. OpenAI, Claude, Gemini, DeepSeek, Mistral, and future providers are interchangeable execution providers behind the gateway, never owners of canonical state.

## Human approval gates

Explicit approval is required before changing methodology, replacing hypotheses, changing population/sample, modifying a final instrument, overwriting a dataset, replacing final analysis or manuscript, changing publication target, submitting externally, or publishing research data. AI/agents may only propose, explain, preview, and identify impact until approval is recorded.

## Workspace projection and next action

Backend state is the source of truth for workspace projections such as `LITERATURE — 32 PAPERS`, `RESEARCH GAP — VERIFICATION REQUIRED`, `METHODOLOGY — REVIEW REQUIRED`, `WRITING — 12%`, and `PUBLICATION — NOT READY`. UI labels are computed from RDT objects and current validations, never maintained as independent frontend truth.

The Next Best Research Action Engine ranks safe, explainable actions from current stage, unresolved compiler issues, missing dependencies, evidence state, approval needs, and research risk. Example: “Verify the proposed research gap using current literature.” Each recommendation includes rationale, prerequisites, expected state transition, evidence, risk, and whether approval is required. It is not a gamification system and cannot bypass gates.

## Failure conditions

- Conflicting concurrent version: reject with conflict metadata; never last-write-wins.
- Missing provenance or cross-project edge: `BLOCKED`.
- Stale verification after upstream change: invalidate and recompile.
- Dependency cycle: reject the relationship and open an architecture/data issue.
- Context projection unavailable: use an explicitly identified last-known-good snapshot only when safe; never present it as current.
- Provider/integration unavailable: preserve canonical state and expose degraded status.

## Related documents

- [Research Digital Twin Engine](../internal-engines/RESEARCH%20DIGITAL%20TWIN%20ENGINE.md)
- [Research Compiler](./RESEARCH%20COMPILER.md)
- [Research Digital Twin Model](../database/RESEARCH%20DIGITAL%20TWIN%20MODEL.md)
- [Idea to Publication Pipeline](../workflows/IDEA%20TO%20PUBLICATION%20PIPELINE.md)
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md)
- [Research Execution Agent Contract](../agents/RESEARCH%20EXECUTION%20AGENT%20CONTRACT.md)
