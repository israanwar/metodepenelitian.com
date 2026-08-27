# P0 Definition of Done

**Status:** LOCKED — phase, vertical-slice and P0 completion contract

**Scope:** Documentation only. “Done” is an evidence state, not a percentage, code-presence claim or architecture status.

## Phase Definition of Done

A phase is eligible for `VERIFIED` only when every applicable item is evidenced:

### Scope and architecture

- Objective and minimal scope are implemented; forbidden scope did not enter the phase.
- All hard dependencies are already `LOCKED`.
- No locked architecture invariant changed without an approved amendment.
- New module/data dependencies match [P0 Dependency Graph](P0%20DEPENDENCY%20GRAPH.md) and add no cycle or second source of truth.
- P1/P2/P3 work remains unavailable and explicitly deferred.

### Data and migrations

- Entity ownership, canonical IDs, tenant/project keys and referential constraints are explicit.
- Migration applies from a clean database and through the supported upgrade path.
- Recovery/rollback or approved roll-forward procedure is rehearsed.
- Seed/fixture data is non-sensitive, deterministic and versioned.
- Immutable/history/provenance requirements are enforced and tested, not conventional only.

### Contracts and security

- APIs/commands/events have versioned schemas and normalized errors/statuses.
- Authentication, authorization, ownership and tenant isolation are server-enforced.
- Negative tests cover anonymous, wrong role, wrong tenant/project and object enumeration where applicable.
- Secrets, private files, raw datasets, prompts and provider payloads are redacted and purpose-limited.
- Tool/provider execution uses governed gateways, timeouts, budgets and kill switches where applicable.

### Correctness and testing

- Focused unit/contract tests pass.
- Integration, migration and relevant full regression suites pass.
- Idempotency, concurrency, retry, timeout, cancellation and degraded mode are tested where applicable.
- Known failure modes fail safely and return truthful statuses.
- No test relies on a production credential, uncontrolled network call or fabricated external-success response.
- A green focused suite does not override a red broader suite.

### Observability and operations

- Logs, metrics and traces expose success/failure without sensitive content.
- Correlation reaches all asynchronous work owned by the phase.
- Health/readiness reflects actual dependencies.
- Alerts/runbook/kill-switch or recovery evidence exists in proportion to risk.
- Resource/cost limits are observable for AI, file and analysis execution.

### Documentation and review

- Implementation report records files, migrations, contracts, tests/counts, failures, limitations and exact status.
- Documentation and cross-links are current; `git diff --check` and internal-link validation pass.
- Reviewer confirms acceptance criteria and exit gate evidence.
- Phase is changed from `TESTED` to `VERIFIED`, then `LOCKED`; no implementation self-assigns verification.

## Entity-level truth Definition of Done

| Area | Required proof |
|---|---|
| ResearchProject | One aggregate/owner/tenant, authorized lifecycle history and no unscoped child. |
| RDT | Stable IDs, pinned versions, provenance, typed dependencies, conflict rejection and reconstructable history. |
| Project Context | Authorized deterministic projection from pinned RDT; explicit staleness and redaction. |
| Compiler | Versioned deterministic rule/findings; `UNKNOWN/BLOCKED` for insufficient evidence; no auto-correction. |
| Reference/Evidence/Claim | Exact source identity/locator, admissibility/verification and complete trace. |
| AI/Agent | Provider/prompt/context/tool provenance; proposed output; governed command only. |
| Dataset/Analysis | Immutable versions/runs, pinned environment/parameters/input and structured validated results. |
| Interpretation/Document | Human-reviewed state, result/evidence lineage, value fidelity and immutable section/document versions. |
| Formatting | Presentation metadata cannot mutate canonical research truth. |
| Publication | No external submission or published claim inside P0; downstream boundary stays guarded. |

## First vertical-slice Definition of Done

The P0 golden scenario is done only when:

1. a clean environment applies all P0 migrations and starts healthy;
2. an authorized private project completes the declared Phase 13 path;
3. one intentionally inconsistent design is blocked by the compiler before correction through an approved command;
4. one evidence-backed claim resolves to its canonical source;
5. one non-sensitive dataset produces a reproducible validated result;
6. the result reaches interpretation and Results/Discussion content without value drift;
7. every protected decision records human authority;
8. one full trace resolves command, RDT versions, context, compiler, evidence, run/result and document version;
9. wrong tenant, stale version, retry, provider outage and unsupported capability fail safely;
10. Gates A–I and all relevant regression suites remain `PASS` together.

## P0 completion Definition of Done

P0 may be reported `VERIFIED` and considered for `LOCKED` only when:

- every Phase 0–13 exit gate passes;
- Gate I is reproduced from a clean state by the recorded procedure;
- no unresolved P0 security, privacy, correctness, provenance, migration or academic-integrity defect exists;
- deferred capabilities are visibly unavailable rather than mocked or falsely advertised;
- source, dependencies, migrations, runtime and operational limitations are reported truthfully;
- independent review accepts the evidence.

`IMPLEMENTED` is not `VERIFIED`. `VERIFIED` is not automatically “production-ready.” Production readiness requires separate deployment, capacity, operational, compliance and release evidence beyond this document.

## Mandatory phase handoff report

```text
PHASE:
STATUS:
OBJECTIVE DELIVERED:
FILES CHANGED:
MIGRATIONS:
CONTRACTS:
SECURITY TESTS:
FOCUSED TESTS:
REGRESSION TESTS:
OBSERVABILITY:
FAILURE MODES VERIFIED:
ACCEPTANCE CRITERIA:
EXIT GATE:
DEFERRED/UNAVAILABLE:
OPEN RISKS:
ARCHITECTURE CONFLICTS:
DEPENDENCY CYCLES:
REVIEWER/DECISION:
```

## Stop rule

After a phase report, stop for review. Do not begin the next phase until the current exit gate is explicitly accepted and locked. A request to “continue” does not waive failed gates or expand P0.

## Related documents

- [P0 Backend Implementation Sequence](P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md)
- [P0 Dependency Graph](P0%20DEPENDENCY%20GRAPH.md)
- [P0 Implementation Gates](P0%20IMPLEMENTATION%20GATES.md)
- [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [Master Data Governance](../MASTER%20DATA%20GOVERNANCE.md)

