# P0 Backend Implementation Sequence

**Status:** LOCKED — canonical P0 implementation-order contract

**Scope:** Documentation and planning only. No source code, dependency, migration, route, provider or deployment is implemented by this document.

## Purpose

This is the canonical dependency-aware build order for the first executable MetodePenelitian.com Research Operating System vertical slice. Existing architecture remains authoritative for domain meaning; this document owns only implementation order, phase boundaries and handoff discipline.

Priority answers **what belongs in P0**. This sequence answers **what must exist first**. A later phase may be explored in isolation, but it cannot integrate, advance a gate or be represented as available before all dependencies pass.

## Locked invariants

1. `ResearchProject` is the aggregate root.
2. Research Digital Twin (RDT) is canonical research state inside the project.
3. Project Context is an authorized, version-pinned projection of canonical state.
4. AI and agents are subordinate execution workers; neither owns or directly mutates canonical state.
5. Evidence-to-Claim links remain source-traceable.
6. Dataset versions, AnalysisRuns, results and provenance are immutable.
7. Document content derives from accepted research state; generated content begins `PROPOSED`.
8. Formatting is separate from canonical research content.
9. Publication is downstream and user-controlled; Publication Gateway remains a router, not a publisher.
10. No phase may create a reverse dependency or a second source of truth.

## Delivery status vocabulary

| Status | Meaning |
|---|---|
| `PROPOSED` | Scoped but not authorized for implementation. |
| `IMPLEMENTING` | Work has started; no completion claim is allowed. |
| `IMPLEMENTED` | Code/migration exists, but required verification may remain. |
| `TESTED` | Declared tests ran with recorded results. |
| `VERIFIED` | Required acceptance evidence and independent checks pass. |
| `LOCKED` | Reviewed decision or verified phase baseline is frozen under change control. |
| `BLOCKED` | A named unmet dependency or failed gate prevents progress. |

Architecture documentation alone can produce `PROPOSED` or `LOCKED` decisions, never `IMPLEMENTED`, `TESTED` or `VERIFIED` software status.

## Priority boundary

- **P0:** minimum foundation required to prove one safe Research OS vertical slice.
- **P1:** important capability not required for that proof.
- **P2:** advanced breadth, scale or institutional depth.
- **P3:** explicitly deferred exploration.

A P1/P2 capability cannot enter P0 because its UI is attractive, a competitor has it, or an interface already exists. Promotion requires an explicit priority amendment, dependency analysis, updated gates and updated golden scenario.

## Critical path

```text
P0 Foundation
→ P1 Identity & Tenancy
→ P2 ResearchProject Core
→ P3 RDT Vertical Slice
→ P4 Project Context
→ P5 Research Compiler
→ P6 File / Reference Foundation
→ P7 Evidence Foundation
→ P8 AI Foundation
→ P9 First Specialized Agents
→ P10 Data & Analysis Contract
→ P11 Analysis-to-Manuscript
→ P12 Academic Document Foundation
→ P13 First End-to-End Vertical Slice
```

The phase numbers above are implementation phases, not product priority labels.

## Mandatory phase execution loop

```text
one phase
→ minimal implementation
→ focused tests
→ full relevant regression
→ evidence report
→ review
→ PASS / LOCK
→ next phase
```

Never implement multiple major phases simultaneously. Parallel preparation may create fixtures or review contracts, but only one phase may own canonical-model or migration changes at a time.

---

## Phase 0 — Foundation

**Objective:** establish a reproducible, observable and failure-safe backend runtime before domain data exists.

**Dependencies:** accepted technology/ADR decisions; otherwise none.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | Configuration schema, environment profile, migration record, normalized error envelope, health/readiness state; no research entity. |
| Services | Configuration loader/validator, database connection lifecycle, migration runner policy, structured logger, health/readiness checks, test harness. |
| APIs/contracts | Stable error envelope; liveness and readiness contracts; correlation/idempotency conventions. |
| Security | Secret separation, fail-closed environment validation, redaction, no production credential or real research data in tests. |
| Migrations | Naming/ownership convention, forward/rollback or roll-forward recovery policy, empty baseline migration rehearsal. |
| Tests | Clean-environment bootstrap, config negative tests, DB connect/failure, migration rehearsal, error contract, health/readiness, secret scan. |
| Observability | Correlation ID, structured non-sensitive logs, startup/config failure signal, DB readiness metric. |
| Failure modes | Missing/invalid config, unavailable database, partial migration, secret leakage, false-ready process. |

**Acceptance criteria:** a clean checkout can provision an isolated test environment and exercise one empty migration without production secrets.

**Exit gate:** Gate A prerequisites pass: configuration, database lifecycle, migrations, errors, logging, health and test foundation are stable.

**Forbidden scope:** domain entities, authentication UI, queues/event bus breadth, external providers or feature implementation.

## Phase 1 — Identity & Tenancy

**Objective:** establish who may act, in which tenant/institution boundary, and under what ownership and permission.

**Dependencies:** Phase 0 `LOCKED`.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | `User`, session/auth identity, tenant/institution identity, membership, role, permission, ownership/audit actor. |
| Services | Authentication/session validation, authorization policy, tenant resolver, membership/role service, audit writer. |
| APIs/contracts | Auth/session contract; server-side authorization decision; tenant-scoped command/query context. |
| Security | Default deny, least privilege, private-by-default, cross-tenant non-inference, session protection, admin-access audit. |
| Migrations | Identity, membership and permission tables with tenant constraints and auditable timestamps. |
| Tests | Anonymous, expired session, wrong user/role/tenant, privilege escalation, object enumeration and audit coverage. |
| Observability | Auth failure categories, denied-access metrics and tenant-safe audit records without sensitive payloads. |
| Failure modes | Tenant ambiguity, stale membership, forged role, cross-tenant access, audit-write failure. |

**Acceptance criteria:** identity and permission decisions are server-side, deterministic and prove records cannot be read, written, listed or inferred across tenants.

**Exit gate:** identity/tenancy security suite passes and no domain service can bypass the authorization context.

**Forbidden scope:** institution workspace, supervisor dashboards, billing UI, social/community roles or broad enterprise administration.

## Phase 2 — Research Project Core

**Objective:** implement `ResearchProject` as the only aggregate root and authorization anchor for project-scoped research state.

**Dependencies:** Phase 1 `LOCKED`.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | `ResearchProject`, project membership, lifecycle/status history, owner, canonical ID, created/updated/audit timestamps. |
| Services | Project create/read/update/archive, membership authorization, lifecycle transition history, ownership checks. |
| APIs/contracts | Idempotent create; expected-version mutation; authorized project query; no unscoped project-child contract. |
| Security | Owner/member isolation, private default, tenant boundary, object-level authorization, protected archive/delete. |
| Migrations | Project, project membership and lifecycle history with tenant/project uniqueness and referential constraints. |
| Tests | CRUD authorization, concurrency, idempotency, archive/history, wrong-project and cross-tenant negatives. |
| Observability | Project command outcomes, conflicts and denied mutations keyed by safe IDs. |
| Failure modes | Duplicate command, stale version, orphan membership, cross-project child, unauthorized ownership transfer. |

**Acceptance criteria:** every project-scoped future record can reference exactly one authorized `ResearchProject`; project history is reconstructable.

**Exit gate:** Gate B — ResearchProject persistence, ownership, membership and lifecycle are verified.

**Forbidden scope:** RDT graph, AI context, evidence, datasets, documents or institution oversight.

## Phase 3 — Research Digital Twin Vertical Slice

**Objective:** implement the smallest canonical structured research state needed to validate research-design continuity.

**Dependencies:** Phase 2 `LOCKED`.

**Minimal slice:** `ResearchQuestion → Problem → ResearchObjective → Variable/Construct → Hypothesis → Methodology`.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | RDT identity/version, the six slice entities, typed relationships, provenance, validation state, immutable change record. |
| Services | Versioned command handler, relationship validator, snapshot/history projector, dependency impact/invalidation. |
| APIs/contracts | Expected-RDT-version commands; pinned snapshot query; proposed patch; stable entity/edge IDs. |
| Security | Project authorization on every command/query; no cross-project edge; protected research decisions require approval state. |
| Migrations | RDT version/change ledger and normalized slice entities/edges with project constraints. |
| Tests | Version reconstruction, optimistic conflict, edge typing, cross-project rejection, invalidation without history deletion. |
| Observability | RDT version/mutation/impact events, conflict and invalid-edge metrics. |
| Failure modes | Last-write-wins overwrite, missing provenance, dependency cycle, orphan node, partial mutation. |

**Acceptance criteria:** the minimal slice is stored as one versioned project graph, historical versions reproduce exactly, and upstream changes expose impact.

**Exit gate:** Gate C — RDT vertical slice, versioning and provenance are verified.

**Forbidden scope:** remaining 27-stage lifecycle entities, agent memory, document-shaped canonical state or automatic correction.

## Phase 4 — Project Context

**Objective:** produce one authorized, bounded and version-pinned context projection from canonical project/RDT state.

**Dependencies:** Phase 3 `LOCKED`.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | Context snapshot/version/reference, provenance summary, validation summary, approval summary; RDT remains owner of truth. |
| Services | Context assembler, authorization/redaction policy, size/token budgeter, snapshot resolver and stale detector. |
| APIs/contracts | `buildContext(projectId, rdtVersion, purpose, actor)`; immutable context snapshot; explicit unavailable/stale outcome. |
| Security | Purpose limitation, field-level redaction, least-context disclosure, no raw sensitive payload by default. |
| Migrations | Only snapshot metadata if persistence is required by the accepted ADR; never a parallel research-state table. |
| Tests | Determinism for same pinned version/purpose, authorization, redaction, stale snapshot, size bound and two-consumer equality. |
| Observability | Assembly latency/size, redaction decisions, source version and stale/unavailable counters. |
| Failure modes | Context drift, unauthorized field leakage, silent truncation, current/last-known-good confusion, chatbot-memory substitution. |

**Acceptance criteria:** two authorized consumers requesting the same purpose and RDT version receive equivalent context and provenance.

**Exit gate:** Project Context fidelity, authorization and staleness handling pass.

**Forbidden scope:** AI provider calls, agent-specific private context stores, semantic-memory breadth or direct canonical mutation.

## Phase 5 — Research Compiler

**Objective:** detect deterministic inconsistency in the Phase 3 slice without silently changing research decisions.

**Dependencies:** Phase 4 `LOCKED` and stable Phase 3 model.

**First rules:** Question ↔ Objective; Objective ↔ Hypothesis; Variable/Construct ↔ Hypothesis; Hypothesis ↔ Methodology.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | Compiler rule/version, run, finding, applicability, severity, evidence, affected entity and resolution history. |
| Services | Rule registry, deterministic evaluator, finding lifecycle, re-run/stale manager. |
| APIs/contracts | Compile pinned RDT version; return `PASS/WARNING/ERROR/BLOCKED/UNKNOWN`; no mutation command. |
| Security | Authorized project input/output, rule-version audit, findings cannot approve protected changes. |
| Migrations | Rule metadata, immutable compiler runs/findings and resolution references. |
| Tests | Intentional inconsistencies, missing-data `UNKNOWN/BLOCKED`, deterministic repeat, stale/re-run and no-auto-correct. |
| Observability | Rule coverage, outcome counts, duration, failures and stale-finding metrics. |
| Failure modes | Guessed pass, non-deterministic result, rule drift, hidden skipped rule, compiler mutating RDT. |

**Acceptance criteria:** seeded contradictions are found with entity-level rationale; identical pinned input/rules reproduce identical findings.

**Exit gate:** Gate D — Research Compiler catches intentional inconsistency and preserves human authority.

**Forbidden scope:** generalized research-health score, model-based correction, all-domain rule breadth or automatic approval.

## Phase 6 — File / Reference Foundation

**Objective:** provide the minimum secure file and canonical scholarly-reference boundary required by evidence work.

**Dependencies:** Phase 2 `LOCKED`; Phase 0 storage decision; integration with later phases still waits for Phase 5.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | `FileAsset`, immutable checksum/metadata, project attachment, `ResearchReference`, identifiers and source provenance. |
| Services | Private asset authorization, signed access, file validation, reference normalization/deduplication boundary. |
| APIs/contracts | Upload/register/download metadata; attach to project; normalize DOI/reference candidate; ambiguous duplicate result. |
| Security | MIME/signature/size checks, malware/password policy, private URLs, temporary cleanup, no automatic external egress. |
| Migrations | File metadata/derivation link and canonical reference/source-identity tables; original bytes remain immutable. |
| Tests | Wrong-project access, checksum, invalid file, ambiguous DOI/duplicate, provenance preservation and cleanup. |
| Observability | Upload/validation outcome, asset access denial, normalization source/latency and ambiguity counts. |
| Failure modes | Public file leak, extension spoof, silent merge, provider-shape leakage, orphan asset, source provenance loss. |

**Acceptance criteria:** one private project asset and one canonical reference retain immutable source identity and project-scoped authorization.

**Exit gate:** File/reference foundation passes security, normalization and provenance tests.

**Forbidden scope:** conversion engines, broad parsing/extraction, OCR, external storage breadth, Zotero/Mendeley sync or live provider claims.

## Phase 7 — Evidence Foundation

**Objective:** prove a source-traceable chain from canonical reference to evidence to research claim.

**Dependencies:** Phases 5 and 6 `LOCKED`.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | Evidence item/excerpt/assertion, research claim, evidence-to-claim link, source locator, admissibility and verification state. |
| Services | Evidence capture, claim service, link validator, provenance/admissibility checker and stale-source propagation. |
| APIs/contracts | Create proposed evidence/claim; link with rationale; verify/reject under authority; resolve complete lineage. |
| Security | Project/reference authorization, source-rights metadata, sensitive excerpt controls and immutable source locator. |
| Migrations | Evidence, claim and typed link tables with project/reference constraints and version history. |
| Tests | Complete trace, cross-project rejection, missing locator, withdrawn/retracted source invalidation and history retention. |
| Observability | Trace coverage, unresolved/invalid links, stale evidence and verification outcome metrics. |
| Failure modes | Fabricated source, claim without support represented as verified, broken locator, silent source replacement. |

**Acceptance criteria:** at least one claim resolves through one evidence item to one canonical source and exact provenance; invalidation propagates.

**Exit gate:** Gate E — Evidence-to-Claim traceability is verified.

**Forbidden scope:** full systematic-review suite, automated certainty grading, mass literature ingestion or autonomous gap verification.

## Phase 8 — AI Foundation

**Objective:** add governed model execution only after canonical state, context, compiler and evidence exist.

**Dependencies:** Phases 4, 5 and 7 `LOCKED`.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | Provider/model registry record, prompt/policy version, invocation, usage/cost, structured output, tool-call audit. |
| Services | Provider abstraction, Model Registry, AI Gateway, routing/fallback, structured-output validator, tool-permission enforcement. |
| APIs/contracts | Normalized AI request/response; pinned Project Context injection; typed tool schema; proposed patch output. |
| Security | Server-held credentials, egress/retention policy, prompt-injection defense, tool allowlist/budget, tenant authorization, kill switch. |
| Migrations | Invocation/provenance/usage metadata only; no provider-specific research-state columns. |
| Tests | Deterministic fake adapter, routing/fallback, malformed output, unauthorized tool/project, quota/cost and provider failure. |
| Observability | Model/provider/prompt/context versions, latency, token/cost, failure taxonomy and tool decision audit. |
| Failure modes | AI as source of truth, hidden fallback, provider lock-in, malformed mutation, leaked context/secret, fabricated success. |

**Acceptance criteria:** fake-adapter execution returns a validated `PROPOSED` result tied to pinned Project Context and cannot mutate canonical state directly.

**Exit gate:** Gate F — AI operates only through governed Project Context, Gateway and commands.

**Forbidden scope:** dozens of providers, autonomous approval, direct database/tool access, unbounded memory or unsupported “zero hallucination” claims.

## Phase 9 — First Specialized Agents

**Objective:** prove small multi-agent coordination without agent-owned state or ungoverned writes.

**Dependencies:** Phase 8 `LOCKED`.

**Only P0 agents:** Research Planning Agent, Literature/Evidence Agent and Methodology Agent.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | Agent definition/version, task/run, input snapshot, proposed command/patch, tool evidence and approval requirement. |
| Services | Agent Orchestrator, task router, governed-command mediator and agent evaluation harness. |
| APIs/contracts | Assign task against pinned context; return structured proposal/evidence; submit through authorized application command. |
| Security | Per-agent tool permissions, budget/timeout, no direct canonical write, project isolation and human gate enforcement. |
| Migrations | Agent-run/audit metadata; no agent-specific canonical database. |
| Tests | Same-context consumption, conflicting proposals, denied direct write, timeout/retry, tool denial and protected-decision approval. |
| Observability | Agent/task status, context version, tools, cost, proposal acceptance/rejection and failure reason. |
| Failure modes | Agent silo, circular delegation, runaway tool loop, stale proposal, implicit approval or cross-project task. |

**Acceptance criteria:** all three agents read the same pinned context and can only propose evidence-bearing governed commands.

**Exit gate:** specialized-agent contract and negative paths pass; no extra agent enters P0.

**Forbidden scope:** autonomous research director, dozens of agents, agent-created truth, self-approval or open-ended tool execution.

## Phase 10 — Data & Analysis Contract

**Objective:** implement a reproducible canonical chain `Dataset → AnalysisPlan → AnalysisRun → AnalysisResult → Interpretation` with one narrow validated analysis capability.

**Dependencies:** Phases 6 and 9 `LOCKED`; analysis execution does not depend on AI truth.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | Dataset/raw and derived versions, mapping/transformation lineage, AnalysisPlan, immutable AnalysisRun, structured AnalysisResult, Result Provenance, proposed Interpretation. |
| Services | Secure ingestion, preparation lineage, capability registry, isolated runner, result validator and provenance resolver. |
| APIs/contracts | Create derived version/plan; approve/run asynchronously; return structured result; resolve run/environment/input lineage. |
| Security | Sensitive-data classification, file authorization, sandbox/resource limits, approved execution, no AI-created or edited values. |
| Migrations | Dataset/version/lineage, plan/run/result/provenance with immutable constraints and runtime/checksum fields. |
| Tests | Raw immutability, ambiguous mapping, pinned run, retry/idempotency, unsupported method, result schema and expected reproducibility limits. |
| Observability | Queue/run status, runtime/resources, engine/package versions, checksum, validation and failure taxonomy. |
| Failure modes | Raw overwrite, silent remapping, duplicate run, environment drift, fabricated statistic, placeholder success, result without lineage. |

**Acceptance criteria:** every output value resolves to a pinned AnalysisRun, parameters/environment and input dataset version; rerun behaviour is documented and tested.

**Exit gate:** Gate G — analysis provenance and expected reproducibility are verified.

**Forbidden scope:** SPSS/SmartPLS replacement, method breadth, advanced SEM/PLS-SEM, qualitative suite or AI as numerical engine.

## Phase 11 — Analysis-to-Manuscript

**Objective:** prove verified analysis state reaches interpretation, claim and document content without fabricated or mutated values.

**Dependencies:** Phases 7 and 10 `LOCKED`.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | Accepted Interpretation, result-backed Claim, table/figure specification, section-content proposal and complete provenance links. |
| Services | Interpretation review, result-to-claim binder, deterministic table/figure builder and value-fidelity validator. |
| APIs/contracts | Review/accept interpretation; bind result/claim/evidence; generate structured section input; resolve lineage to run/source. |
| Security | Protected acceptance, authorization, immutable source result and no hidden AI/value mutation. |
| Migrations | Interpretation/version and result/claim/document-link tables; accepted history immutable. |
| Tests | Numeric/value fidelity, stale result propagation, unsupported inference, source/evidence mismatch and unauthorized acceptance. |
| Observability | Provenance coverage, stale bindings, value mismatch and review outcome. |
| Failure modes | Invented number, p-value drift, unsupported causal language, stale result presented as current, missing evidence. |

**Acceptance criteria:** a verified result produces a reviewable interpretation and claim whose every numeric value and source is resolvable.

**Exit gate:** Gate H — an analysis result reaches document input with zero untraceable/fabricated values.

**Forbidden scope:** free-form full thesis generation, automated scientific conclusion, beautified-but-untraceable figures or publication formatting.

## Phase 12 — Academic Document Foundation

**Objective:** compose one canonical academic artifact while keeping research content separate from rendering policy.

**Dependencies:** Phase 11 `LOCKED` and Phase 6 canonical references.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | AcademicDocument, blueprint, section definition, composition plan, section/version, citation, bibliography and provenance/export manifest. |
| Services | Document composer, section versioning, citation/bibliography engine, quality/compiler adapter and artifact-manifest builder. |
| APIs/contracts | Compose from accepted state; create immutable section version; compile pinned document; request only verified export capability. |
| Security | Project/document authorization, authorship provenance, protected final replacement and private artifacts. |
| Migrations | Document/section/version/citation/bibliography/provenance records; formatting intent separate from content fields. |
| Tests | Citation identity, section provenance, value fidelity, stale dependency, immutable versions and format-mutation guards. |
| Observability | Composition/compile outcome, provenance coverage, citation/value mismatch and unavailable export capability. |
| Failure modes | Formatting changes content, missing citation, overwrite of final section, ungrounded generated prose, fake DOCX/PDF success. |

**Acceptance criteria:** one canonical document version contains traceable Results/Discussion content and citations without binding canonical truth to a renderer.

**Exit gate:** Academic document foundation passes content/provenance/citation and format-separation tests.

**Forbidden scope:** full Formatting Policy Engine, guideline import, institution/journal portals, converter ecosystem or unverified renderer claims.

## Phase 13 — First End-to-End Vertical Slice

**Objective:** prove the minimum Research Operating System works as one coherent, safe backend path from project creation to a canonical Results/Discussion artifact.

**Dependencies:** Phases 0–12 `LOCKED`; Gates A–H `PASS`.

**Golden path:** `Create Project → Research Question → Objectives → Variables/Constructs → Hypotheses → Methodology → References/Evidence → Dataset → Analysis → Interpretation → Results/Discussion artifact`.

| Required area | Minimal P0 delivery |
|---|---|
| Entities | No new domain entity; use the already verified canonical records and one fixed non-sensitive golden fixture. |
| Services | End-to-end orchestration through existing application services; no bypass adapter. |
| APIs/contracts | Public/internal contracts needed by the golden path plus trace-resolution and safe-failure responses. |
| Security | Full authorization/tenant regression, private assets, human approvals, tool/provider kill switches and no external submission. |
| Migrations | Fresh-environment application and upgrade rehearsal for all P0 migrations; restore/rollback evidence. |
| Tests | Backend E2E, contract/integration/regression, retry/idempotency, stale version, wrong tenant, unsupported capability, provider outage and value trace. |
| Observability | Complete correlation from command → RDT → compiler → evidence → run/result → interpretation → document; alerts and runbook evidence. |
| Failure modes | Any bypass, partial-success lie, broken trace, red full suite, data leak, silent provider fallback or unsupported feature shown available. |

**Acceptance criteria:** the golden scenario passes from a clean environment and fails safely at every protected boundary; all outputs are traceable and truthfully statused.

**Exit gate:** Gate I — first end-to-end research vertical slice `VERIFIED`, reviewed and `LOCKED`.

**Forbidden scope:** adding breadth to make the demo impressive, real personal data, publication submission, unverified integrations, format promises or work from deferred tiers.

## Deferred, not rejected

| Tier | Deferred capability |
|---|---|
| P1 | Research Academy; full Publication Gateway; full institutional formatting; broader evidence/systematic-review workflow; converter ecosystem; plagiarism checker as a bounded future tool; additional verified analysis methods; selected advanced integrations. |
| P2 | Institution/journal policy portals and monitoring; broad qualitative/mixed-method suite; advanced publication automation; collaboration/oversight depth; larger integration catalog. |
| P3 | Creator marketplace, social/community features, speculative autonomous research and non-strategic tool proliferation. |

Plagiarism checking is not a new bounded context, integrity architecture or P0 dependency. It remains a future capability subject to license, privacy, reliability and claim-language gates.

## Change control

- A phase may split into smaller tickets without changing dependency order, invariants or exit gate.
- A physical technology choice belongs in an ADR and cannot silently alter the domain contract.
- A blocked phase stops advancement; later phases cannot be used to conceal its failure.
- Every phase handoff uses the checklist in [P0 Definition of Done](P0%20DEFINITION%20OF%20DONE.md).
- Gate ownership and evidence are defined in [P0 Implementation Gates](P0%20IMPLEMENTATION%20GATES.md).
- Allowed dependencies are defined in [P0 Dependency Graph](P0%20DEPENDENCY%20GRAPH.md).

## Related architecture

- [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [Master Product Architecture](../MASTER%20PRODUCT%20ARCHITECTURE.md)
- [Master Data Governance](../MASTER%20DATA%20GOVERNANCE.md)
- [Master AI Governance](../MASTER%20AI%20GOVERNANCE.md)
- [Master Integration Map](../MASTER%20INTEGRATION%20MAP.md)
- [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md)
- [Research Compiler](../architecture/RESEARCH%20COMPILER.md)
- [End-to-End Research Execution](../architecture/END%20TO%20END%20RESEARCH%20EXECUTION.md)
- [Data-to-Document Pipeline](../architecture/DATA%20ANALYSIS%20INTERPRETATION%20DOCUMENT%20PIPELINE.md)
- [Research Execution Agent Contract](../agents/RESEARCH%20EXECUTION%20AGENT%20CONTRACT.md)

