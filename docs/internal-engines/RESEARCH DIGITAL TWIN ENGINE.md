# Research Digital Twin Engine

**Status:** P0 internal-engine contract — conceptual only

## Purpose

The Research Digital Twin Engine maintains the canonical, living research-state graph attached to a `ResearchProject`. It accepts authorized commands and domain events, validates provenance and concurrency, calculates dependency impact, and commits immutable versions. It does not call AI providers, decide academic truth, or bypass human approval.

## Responsibilities

- Normalize title, idea, proposal, candidate-title table, paper set, methodology draft, or dataset intake into `PROPOSED` research entities while preserving originals.
- Maintain versioned entities, typed relationships, dependencies, state, provenance, and change history.
- Produce authorized snapshots for Project Context Engine and deterministic projections for workspace status.
- Calculate transitive impact when upstream entities change.
- Invalidate stale validation state and request targeted Research Compiler runs.
- Publish idempotent domain events after a successful commit.
- Reject cross-project references, stale write versions, missing provenance, and unapproved protected mutations.

## Command flow

```text
Authorized command / accepted agent proposal
→ load ResearchProject policy + current RDT version
→ validate actor, provenance, expected version, status transition
→ build proposed graph patch
→ calculate dependency impact and approval requirements
→ preview to human when protected
→ atomically commit entity/edge/change/new version
→ emit event
→ invalidate affected validations
→ request incremental compilation
→ refresh Project Context projection
```

No graph mutation occurs from an event notification alone. Duplicate command/event ids are idempotently acknowledged.

## Dependency propagation algorithm

1. Identify changed nodes and relationship semantics.
2. Traverse only declared outbound dependencies for the event type.
3. Detect cycles and cap traversal to the project boundary.
4. Classify each affected node as `INVALIDATE`, `REVIEW`, `RECOMPUTE`, `BLOCK`, or `NOTIFY`.
5. Persist a `ResearchChange` impact set before dispatching follow-up work.
6. Mark prior validations stale; preserve their historical results.
7. Queue safe deterministic recomputation and propose agent/human work for judgmental changes.
8. Recompile affected domains and close impact items only with evidence.

Examples include sample-to-power/method/analysis propagation, hypothesis-to-analysis/conclusion propagation, and retracted-paper-to-publication-readiness propagation.

## State transition rules

- All imported/user/AI-created academic content begins `PROPOSED` unless it is a byte-preserved source record whose metadata verification is separately documented.
- Verification statuses require evidence and a named validator/run.
- `LOCKED` blocks replacement without the relevant approval workflow.
- `DEPRECATED` preserves history and makes dependent current validations stale.
- `BLOCKED` records the reason and required unblock condition.
- The engine never infers `SOURCE VERIFIED`, `EVIDENCE VERIFIED`, `METHODOLOGICALLY VERIFIED`, or `ANALYSIS VERIFIED` from author identity or confidence alone.

## Approval enforcement

The engine requires a valid, scoped, unexpired approval record before committing protected changes to methodology, hypotheses, population/sample, final instrument, existing dataset content, final analysis/manuscript, publication target, external submission state, or publication of research data. A material impact change after approval invalidates that approval and requests a new one.

## Interfaces (conceptual)

- Commands: create proposed entity, link entities, propose update, approve protected change, deprecate source, accept analysis result, record publication state.
- Queries: current snapshot, historical version, entity provenance, dependency impact, workspace projection, next required approvals.
- Events: consumes project/reference/dataset/analysis/publication changes; emits RDT version, impact, validation-request, and audit events.

Actual APIs, queues, storage technologies, and service boundaries are deliberately deferred.

## Failure and observability

Atomic commit failure leaves the prior version authoritative. Event-publish failure uses an outbox/retry concept and never invents a successful downstream state. Observe version conflicts, propagation latency, invalidation counts, cycle rejection, stale projection age, approval denials, and cross-project access denials without logging sensitive research content.

## Related documents

- [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md)
- [Research Digital Twin Model](../database/RESEARCH%20DIGITAL%20TWIN%20MODEL.md)
- [Research Consistency Engine](./RESEARCH%20CONSISTENCY%20ENGINE.md)

