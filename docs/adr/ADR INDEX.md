# Architecture Decision Records — Index

**Status:** LOCKED — index of formalized decisions already locked in existing architecture

**Scope:** This directory formalizes decisions that already exist as locked contracts in `/docs`. An ADR records a decision and points to its canonical architecture; it never restates or duplicates the full contract. Detail lives in the source-of-truth documents linked from each ADR — if an ADR and its source ever appear to disagree, the source-of-truth document governs and the ADR must be corrected, not the other way around.

## Index

| ADR | Title | Status | Primary source of truth |
|---|---|---|---|
| [001](ADR%20001%20MODULAR%20MONOLITH.md) | Modular Monolith | LOCKED | [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) §3, §5, §22 |
| [002](ADR%20002%20RESEARCH%20PROJECT%20AS%20CORE%20AGGREGATE.md) | ResearchProject as Core Aggregate | LOCKED | [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) §2, §3, §6; [02 Research Core](../architecture/02%20RESEARCH%20CORE.md) |
| [003](ADR%20003%20RESEARCH%20DIGITAL%20TWIN%20AS%20CANONICAL%20STATE.md) | Research Digital Twin as Canonical State | LOCKED | [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) §6; [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md); [database/RESEARCH DIGITAL TWIN MODEL.md](../database/RESEARCH%20DIGITAL%20TWIN%20MODEL.md) |
| [004](ADR%20004%20PROJECT%20CONTEXT%20DERIVED%20FROM%20CANONICAL%20STATE.md) | Project Context Derived From Canonical State | LOCKED | [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) §3, §7; [03 Project Context Engine](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md) |
| [005](ADR%20005%20MULTI%20MODEL%20AI%20GATEWAY.md) | Multi-Model AI Gateway | LOCKED | [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) §9; [Master AI Governance](../MASTER%20AI%20GOVERNANCE.md) §1; [05 Multi Model AI Gateway](../architecture/05%20MULTI%20MODEL%20AI%20GATEWAY.md) |
| [006](ADR%20006%20INTEGRATION%20GATEWAY%20AND%20PROVIDER%20ABSTRACTION.md) | Integration Gateway and Provider Abstraction | LOCKED | [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) §19; [Master Integration Map](../MASTER%20INTEGRATION%20MAP.md); [25 Integration Gateway](../architecture/25%20INTEGRATION%20GATEWAY.md) |
| [007](ADR%20007%20ASYNC%20JOB%20MODEL.md) | Async Job Model | LOCKED | [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) §3, §22; [29 Background Jobs](../architecture/29%20BACKGROUND%20JOBS.md) |
| [008](ADR%20008%20PUBLICATION%20GATEWAY%20NOT%20PUBLISHER.md) | Publication Gateway Is a Router, Not a Publisher | LOCKED | [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) §2, §3; [21 Publication Gateway](../architecture/21%20PUBLICATION%20GATEWAY.md) |
| [009](ADR%20009%20PRIVATE%20BY%20DEFAULT.md) | Private by Default | LOCKED | [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) §3, §21; [Master Data Governance](../MASTER%20DATA%20GOVERNANCE.md); [32 Security Privacy](../architecture/32%20SECURITY%20PRIVACY.md) |
| [010](ADR%20010%20CANONICAL%20CONTENT%20SEPARATED%20FROM%20FORMATTING.md) | Canonical Content Separated From Formatting | LOCKED | [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md); [database/FORMATTING POLICY MODEL.md](../database/FORMATTING%20POLICY%20MODEL.md); [internal-engines/FORMATTING POLICY ENGINE.md](../internal-engines/FORMATTING%20POLICY%20ENGINE.md) |
| [011](ADR%20011%20AI%20IS%20NOT%20SOURCE%20OF%20TRUTH.md) | AI Is Not Source of Truth | LOCKED | [Master AI Governance](../MASTER%20AI%20GOVERNANCE.md) |
| [012](ADR%20012%20ANALYSIS%20PROVENANCE%20IS%20IMMUTABLE.md) | Analysis Provenance Is Immutable | LOCKED | [database/ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md); [database/ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md); [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) §31 |

## Relationship to the P0 implementation contract

Every ADR above corresponds to one or more Locked Invariants in [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) and constrains the [P0 Dependency Graph](../implementation/P0%20DEPENDENCY%20GRAPH.md)'s forbidden reverse edges. An ADR does not change phase order, gates, or Definition of Done — those remain owned by `docs/implementation/`.

| Locked Invariant (P0 sequence) | Formalized by |
|---|---|
| `ResearchProject` is the aggregate root | ADR 002 |
| Research Digital Twin is canonical research state | ADR 003 |
| Project Context is a version-pinned projection of canonical state | ADR 004 |
| AI/agents are subordinate execution workers | ADR 005, ADR 011 |
| Dataset/AnalysisRun/result/provenance are immutable | ADR 012 |
| Formatting is separate from canonical research content | ADR 010 |
| Publication Gateway remains a router, not a publisher | ADR 008 |
| No phase creates a second source of truth | ADR 001, ADR 006, ADR 007, ADR 009 (deployment/execution/access boundaries that keep a second canonical store from forming) |

## Rules for adding or changing an ADR

- An ADR may only be added for a decision that already has a locked source-of-truth elsewhere in `/docs`. It cannot introduce a new architectural decision.
- An ADR never contains the full contract (schema, API shape, security control) — that stays in the linked source document. The ADR states the decision, its rationale, and its consequence for later implementation.
- Changing a locked decision requires updating the source-of-truth document first, through the same review process that locked it, then updating the ADR's `Status`, `Supersedes`, and `Superseded By` fields to match.
- An ADR is never written for a P1/P2/P3 capability (Research Academy, Plagiarism Checker, full institutional formatting breadth, etc.) — those remain governed by the P0 sequence's "Deferred, not rejected" table, not by a standing decision record.

## Related documents

- [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md)
- [P0 Dependency Graph](../implementation/P0%20DEPENDENCY%20GRAPH.md)
- [P0 Implementation Gates](../implementation/P0%20IMPLEMENTATION%20GATES.md)
- [P0 Definition of Done](../implementation/P0%20DEFINITION%20OF%20DONE.md)
- [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [Master AI Governance](../MASTER%20AI%20GOVERNANCE.md)
- [Master Data Governance](../MASTER%20DATA%20GOVERNANCE.md)
