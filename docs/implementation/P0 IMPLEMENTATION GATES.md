# P0 Implementation Gates

**Status:** LOCKED — P0 evidence and advancement contract

**Scope:** Documentation only. A gate is passed by implementation evidence, never by architecture text, interfaces, mocks alone or self-asserted status.

## Gate rules

1. Gates are cumulative. Passing a later focused test does not supersede an earlier failing gate or red regression suite.
2. Evidence records commit/build identifier, environment, migrations, commands, test counts/results, failures, reviewer and timestamp.
3. A gate result is `PASS` or `BLOCKED`; incomplete evidence is `BLOCKED`, not conditional pass.
4. Mocks may prove contracts, but a gate requiring persistence, isolation, execution or traceability must use the corresponding real local/test boundary.
5. Failures are fixed in the owning phase, re-tested and reported before advancement.
6. A phase cannot mark itself `VERIFIED`; review is required before `LOCKED`.

## Gate A — Platform foundation stable

**Unlocks:** Phase 1 completion and all persistent domain work.

**Required evidence:**

- clean-environment configuration validation;
- database connect/disconnect and unavailable-database behaviour;
- migration convention and baseline rehearsal;
- stable error/correlation contract;
- structured redacted logs;
- honest liveness/readiness;
- reproducible unit/contract/integration test harness;
- secret and dependency-security baseline.

**Blockers:** production credentials in tests, false readiness, unrecoverable migration procedure, unredacted secrets or non-reproducible setup.

## Gate B — ResearchProject persistence verified

**Unlocks:** RDT canonical state.

**Required evidence:**

- default-deny identity and project authorization;
- tenant and project membership isolation, including negative enumeration tests;
- idempotent create and expected-version mutation;
- lifecycle and ownership history reconstruction;
- every project-scoped fixture references one project and tenant;
- audit actor/timestamps present on mutations.

**Blockers:** cross-tenant inference, client-authoritative role, orphan project state, last-write-wins or mutable audit history.

## Gate C — RDT vertical slice verified

**Unlocks:** Project Context and downstream research validation.

**Required evidence:**

- canonical Question → Problem → Objectives → Variables/Constructs → Hypotheses → Methodology state;
- stable IDs, typed edges, immutable versions and provenance;
- exact reconstruction of historical snapshots;
- conflict rejection and no partial mutation;
- upstream change produces review/invalidation impact without deleting history;
- cross-project edges and dependency cycles are rejected.

**Blockers:** document/chat used as canonical state, missing provenance, agent/provider-specific fields or destructive overwrite.

## Gate D — Compiler catches intentional inconsistency

**Unlocks:** evidence/AI work that depends on explicit validity state.

**Required evidence:**

- seeded Question/Objective, Objective/Hypothesis, Variable/Hypothesis and Hypothesis/Methodology contradictions;
- deterministic findings from identical pinned inputs/rules;
- `UNKNOWN/BLOCKED` for insufficient input;
- finding rationale and affected entity IDs;
- stale/re-run lifecycle and resolution history;
- proof the compiler cannot mutate or approve RDT state.

**Blockers:** guessed pass, hidden skipped rule, non-versioned rule, auto-correction or nondeterministic result.

## Gate E — Evidence-to-Claim traceability verified

**Unlocks:** grounded AI and manuscript-claim work.

**Required evidence:**

- one canonical reference → exact evidence locator → claim chain;
- provenance, verification/admissibility and project authority on every link;
- cross-project and missing-source rejection;
- withdrawn/retracted/stale source impact propagation;
- full lineage returned through a stable resolver.

**Blockers:** fabricated reference, ambiguous source represented as verified, silent source replacement or broken locator.

## Gate F — AI governed by Project Context

**Unlocks:** specialized agents.

**Required evidence:**

- deterministic fake-adapter routing and structured-output validation;
- pinned authorized Project Context, RDT version and prompt/policy version on every invocation;
- provider/model/tool/cost provenance;
- output remains `PROPOSED` and writes only through governed commands;
- tool permission, cross-project, prompt-injection, quota, kill-switch and provider-failure negatives;
- no canonical mutation or fabricated success on provider failure.

**Blockers:** direct provider access from frontend/domain, hidden fallback, agent/provider-owned state, unbounded tool access or secret/context leakage.

## Gate G — Analysis provenance reproducible

**Unlocks:** analysis-to-manuscript flow.

**Required evidence:**

- immutable RAW and derived dataset versions with replayable transformations;
- approved AnalysisPlan and isolated AnalysisRun;
- engine/package/runtime, parameters, seed where relevant, input/checksum and timestamps pinned;
- structured result validation and complete Result Provenance;
- rerun result within declared reproducibility limits;
- unsupported capability and ambiguous mapping fail truthfully;
- proof AI cannot create or edit numerical result values.

**Blockers:** overwritten raw data, environment drift without disclosure, result without run/input, placeholder success or untraceable values.

## Gate H — Analysis result reaches document without fabricated values

**Unlocks:** canonical academic document completion and E2E proof.

**Required evidence:**

- verified result → reviewed interpretation → claim/evidence → section-content chain;
- exact numeric/table/figure fidelity to pinned structured result;
- source, assumption and limitation references;
- stale-result propagation into interpretation/document;
- generated/user-authored provenance distinction;
- no renderer or formatting policy can alter canonical values.

**Blockers:** value drift, invented statistics, unsupported causal claim, missing citation/evidence or stale state presented as current.

## Gate I — First end-to-end vertical slice PASS

**Unlocks:** P0 review/lock and planning for the next approved scope. It does not authorize P1 automatically.

**Required evidence:**

- complete golden path from clean environment;
- all migrations, authorization and full relevant regression suites green;
- one correlation/trace from project command through RDT, compiler, evidence, analysis, interpretation and document;
- idempotency/retry, stale-version, wrong-tenant, unsupported-capability and provider-outage failures are safe and truthful;
- backup/restore or accepted recovery rehearsal;
- no open P0 correctness, security, provenance or academic-integrity issue;
- unsupported P1/P2 capabilities visibly unavailable.

**Blockers:** red full suite, hidden bypass, incomplete trace, real sensitive fixture, unsupported availability claim or any earlier gate regression.

## Gate record template

```text
Gate:
Status: PASS | BLOCKED
Build/commit:
Environment:
Migration version:
Commands/tests and counts:
Negative paths exercised:
Observability evidence:
Open failures/risks:
Reviewer:
Timestamp:
Decision:
```

## Related documents

- [P0 Backend Implementation Sequence](P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md)
- [P0 Dependency Graph](P0%20DEPENDENCY%20GRAPH.md)
- [P0 Definition of Done](P0%20DEFINITION%20OF%20DONE.md)

