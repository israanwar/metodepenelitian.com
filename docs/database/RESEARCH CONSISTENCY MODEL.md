# Research Consistency Model

**Status:** P0 conceptual domain model — no SQL, migration, physical schema, or scoring weights

## Purpose

This model stores reproducible Research Compiler rules, runs, issues, validations, health projections, approvals, and next-action recommendations for a pinned Research Digital Twin version. It separates evidence-backed validation from user/model assertions and preserves history.

## Core entities

### ResearchValidation

One rule evaluation against a specific subject/version: `validation_id`, project/twin version, compiler run, rule/version, domain, subject/affected entities, outcome (`PASS`, `WARNING`, `ERROR`, `BLOCKED`, `UNKNOWN`), message, evidence references, evaluator/method, confidence/limitations where judgmental, timestamps, stale/superseded references.

### ResearchHealth

Immutable summary for a compiler run: health id, project/twin and rule-pack versions, overall score or `UNAVAILABLE`, domain outcomes/scores, applicable/executed/unknown/blocked counts, coverage, severity caps, calculation-policy version, unresolved critical issues, generated timestamp. It is a diagnostic projection, not canonical academic truth or gamification.

### ResearchIssue

Required fields:

```text
issue_id
severity
domain
message
affected_entities
evidence
recommended_action
verification_status
resolved_at
```

Also stores project/twin/compiler/rule references, lifecycle (`OPEN`, `RESOLVED`, `SUPPRESSED`, `REOPENED` as issue-management state only), creator/evaluator, resolution/suppression rationale and evidence, responsible role, due/expiry metadata where applicable, and timestamps. Resolution is append-audited and requires a proving re-evaluation.

### ConsistencyRule and RulePack

Versioned definition of a check: rule id/version, domain, applicability predicate, required inputs/relationships, evaluation kind, severity mapping, message/remediation template, policy owner, effective/deprecated times. `RulePack` pins an ordered compatible set and calculation policy. Historical compiler runs never float to a newer rule version.

### CompilerRun

Execution envelope: run id, project/twin version, rule-pack/journal-requirement version, trigger and correlation ids, requested domains, applicable/executed counts, status, start/end times, agent/model/tool context references, output health id, and failure/coverage metadata. Identical deterministic inputs may be cached but retain traceable run identity.

### HumanApproval

Scoped approval for a protected proposal: approval id, project id, proposed change/content hash, expected twin version, gate type, approver identity/authority, preview/impact references, decision, rationale, granted/expiry/revoked/consumed timestamps. A changed proposal or version mismatch invalidates approval.

### NextBestResearchAction (Next Best Research Action)

Advisory record: recommendation id, project/twin/compiler versions, action type/text, target objects, rationale, prerequisites, unresolved issue/dependency references, evidence, research risk, confidence/assumptions, approval need, expected next state, rank policy/version, generated/accepted/dismissed/completed timestamps. Acceptance starts an authorized workflow; it does not directly mutate state.

## Relationship validation map

| Domain | Rule relationships |
|---|---|
| Structural | RQ↔Objective; Objective↔Hypothesis; Hypothesis↔Variable; Variable↔Construct; Construct↔Indicator |
| Measurement | Indicator↔Source; Variable↔Measurement; Instrument↔Variable |
| Methodology | Method↔RQ; Method↔Data; Method↔Analysis; Sample↔Analysis; Ethics↔Data Collection |
| Analysis | Analysis↔Hypothesis; Result↔Hypothesis; Result↔RQ |
| Interpretation | Discussion↔Result; Discussion↔Theory; publication claim↔verified finding |
| Evidence/citation | Claim↔Evidence; Citation↔Reference; Reference↔DOI/Metadata |
| Publication | Manuscript↔Journal Requirements; Publication Claim↔Verified Status |

## Outcome and state semantics

Compiler outcomes are exactly `PASS`, `WARNING`, `ERROR`, `BLOCKED`, and `UNKNOWN`. RDT lifecycle/validation states remain `PROPOSED`, `IN PROGRESS`, `SOURCE VERIFIED`, `EVIDENCE VERIFIED`, `METHODOLOGICALLY VERIFIED`, `ANALYSIS VERIFIED`, `PASS`, `LOCKED`, `BLOCKED`, and `DEPRECATED`. Issue workflow states are administrative and cannot be used to claim academic verification.

## Research Health rules

- Compute only from applicable, versioned rules and show coverage.
- A blocking/error rule applies a documented cap regardless of other passes.
- Unknown or missing prerequisites reduce coverage; they are not scored as pass.
- Domain components and weights/formula are inspectable and versioned.
- If minimum coverage is absent, overall score is `UNAVAILABLE`.
- A score never permits publication, overrides an issue, or replaces human judgment.

## Invalidation and resolution

A relevant upstream `ResearchChange` marks affected validations, health summaries, and next-action records stale through declared dependencies. The prior records remain immutable. A new compiler run creates new validations/issues or links to proven resolution. Source retraction, dataset version change, analysis replacement, methodology/hypothesis/sample change, or publication-target requirement change triggers targeted invalidation and, before publication readiness, a full run.

## Human approval gates

Gate types cover methodology changes, hypothesis replacement, population/sample changes, final-instrument changes, dataset overwrite, final-analysis/manuscript replacement, publication-target change, external submission, and research-data publication. Compiler issues may demand a gate but cannot generate the approval themselves.

## Privacy and audit invariants

- Every record is project-scoped and inherits ResearchProject authorization.
- Evidence pointers expose only the minimum permitted content; logs avoid raw sensitive research data.
- Rule/model/tool decisions retain provenance and pinned context.
- Suppression/override is visible, scoped, expiring where appropriate, and never presented as resolution.
- No agent/model can set verified state without an allowed verification process and supporting references.

## Conceptual queries

- Current compiler result and coverage for a project/twin version.
- Open critical issues grouped by domain and dependency impact.
- Why a domain/overall health value was produced.
- Which upstream change invalidated a previously passing check.
- Approvals required before a proposed patch or submission.
- Safest next research action with evidence and prerequisites.

## Related documents

- [Research Compiler](../architecture/RESEARCH%20COMPILER.md)
- [Research Consistency Engine](../internal-engines/RESEARCH%20CONSISTENCY%20ENGINE.md)
- [Research Digital Twin Model](./RESEARCH%20DIGITAL%20TWIN%20MODEL.md)
- [Idea-to-Publication Pipeline](../workflows/IDEA%20TO%20PUBLICATION%20PIPELINE.md)
