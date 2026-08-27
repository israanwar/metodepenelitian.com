# P0 Dependency Graph

**Status:** LOCKED — canonical P0 dependency-direction contract

**Scope:** Documentation only. This graph constrains implementation order and module references; it does not select physical technologies.

## Canonical directed acyclic graph

```text
Foundation
└── Identity / Tenancy
    └── ResearchProject
        └── Research Digital Twin
            ├── Project Context
            │   └── AI Gateway
            │       └── Agent Orchestrator
            └── Research Compiler

FileAsset / ResearchReference
└── Evidence
    └── Claim

ResearchProject + FileAsset
└── Dataset
    └── AnalysisPlan
        └── AnalysisRun
            └── AnalysisResult
                └── Interpretation
                    └── Claim
                        └── Document Section
                            └── Academic Document

ResearchReference
└── Citation / Bibliography
    └── Academic Document

Academic Document + Formatting Intent
└── Derived Artifact (P1 renderer)
    └── Publication Gateway (downstream; P1 breadth)
```

The arrows mean “depends on.” They do not transfer data ownership. Evidence may support an RDT claim, for example, while canonical entity ownership remains with its owning module.

## Phase dependency table

| Phase | Hard dependencies | May prepare in parallel | Cannot integrate before |
|---|---|---|---|
| 0 Foundation | None | ADR review, test fixtures | Gate A prerequisites |
| 1 Identity & Tenancy | 0 | authorization threat cases | Phase 0 lock |
| 2 Research Project Core | 1 | project fixtures | Phase 1 lock |
| 3 RDT Vertical Slice | 2 | compiler rule examples | Phase 2 lock |
| 4 Project Context | 3 | context fixtures/redaction policy | Phase 3 lock |
| 5 Research Compiler | 3, 4 | deterministic rule authoring | Phase 4 lock |
| 6 File / Reference Foundation | 0, 1, 2 | provider fixtures without live calls | Phase 2 lock |
| 7 Evidence Foundation | 5, 6 | evidence fixtures | Phases 5 and 6 lock |
| 8 AI Foundation | 4, 5, 7 | fake adapters/tool schemas | Phase 7 lock |
| 9 First Specialized Agents | 8 | agent evaluation fixtures | Phase 8 lock |
| 10 Data & Analysis Contract | 2, 6, 9 | non-sensitive dataset fixture, sandbox threat model | Phase 9 lock |
| 11 Analysis-to-Manuscript | 7, 10 | value-fidelity fixtures | Phases 7 and 10 lock |
| 12 Academic Document Foundation | 6, 11 | blueprint/citation fixtures | Phase 11 lock |
| 13 End-to-End Slice | 0–12, Gates A–H | runbook and golden-fixture review | all earlier phases locked |

Parallel preparation cannot create competing migrations, canonical models, provider claims or public availability.

## Allowed dependency rules

1. Application services depend inward on canonical domain contracts.
2. Provider adapters depend on Integration/AI Gateway interfaces; domain modules never import provider-specific shapes.
3. Agents depend on Project Context, AI/tool contracts and governed application commands.
4. Project Context depends on authorized pinned RDT projections, not chat history.
5. Compiler depends on immutable snapshots and versioned rules; RDT does not depend on compiler output to exist.
6. Documents reference accepted claims, evidence, results and citations; source results never depend on document prose.
7. Formatting consumes canonical document content and creates derived artifacts; canonical content never depends on a format policy or renderer.
8. Publication consumes a verified document/readiness state; upstream research truth never depends on a publication provider.

## Explicitly forbidden reverse edges

```text
AI Provider        -X→ Research Digital Twin ownership
Agent Memory       -X→ Canonical Project State
Frontend/UI        -X→ Provider or database direct access
Compiler Finding   -X→ Automatic research-state correction
Document Text      -X→ AnalysisResult source values
Renderer/Template  -X→ Canonical facts, citations or results
Publication Target -X→ Historical research truth mutation
Raw Provider Shape -X→ Research Core
Cache/Vector Store -X→ Source of truth
```

`-X→` means prohibited.

## Command and event direction

```text
Actor
→ authorized application command
→ aggregate expected-version check
→ canonical mutation + immutable change record
→ outbox/domain event
→ projection / compiler / job / notification
```

Events may trigger evaluation or propose work. An event cannot authorize a protected mutation by itself. Retries and redelivery must be idempotent.

## Data-to-document proof chain

```text
FileAsset(checksum)
→ Dataset RAW version
→ Derived Dataset version + transformations
→ approved AnalysisPlan
→ immutable AnalysisRun(engine/version/parameters/seed)
→ validated structured AnalysisResult
→ reviewed Interpretation
→ Claim + Evidence links
→ DocumentSectionVersion
→ AcademicDocumentVersion + provenance manifest
```

Every link carries project identity, stable IDs, versions and provenance. Absence or ambiguity produces `UNKNOWN`, `UNAVAILABLE` or `BLOCKED`, never a guessed link.

## Cycle audit rules

A proposed dependency is rejected when it:

- allows a downstream representation to own or rewrite upstream truth;
- creates two writable canonical stores for the same entity;
- makes core state depend on an optional provider, agent, cache, renderer or publication destination;
- requires Phase N to pass using an implementation that cannot exist until a later phase;
- crosses tenant/project ownership without an explicit governed reference contract.

Each architecture or implementation change must record its new edges and rerun the cycle audit before review.

## Current cycle result

The P0 phase graph above is acyclic. Phase 10 uses governed agents for advice, but deterministic analysis execution and results do not depend on AI output as truth. Phase 11 joins the independent Evidence and Analysis branches downstream; it does not create a return edge into source evidence or results.

## Related documents

- [P0 Backend Implementation Sequence](P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md)
- [P0 Implementation Gates](P0%20IMPLEMENTATION%20GATES.md)
- [P0 Definition of Done](P0%20DEFINITION%20OF%20DONE.md)
- [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md)
- [Master Data Governance](../MASTER%20DATA%20GOVERNANCE.md)

