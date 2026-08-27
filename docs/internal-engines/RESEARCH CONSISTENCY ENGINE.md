# Research Consistency Engine

**Status:** P0 internal-engine contract — conceptual only

## Purpose

The Research Consistency Engine is the execution core of the Research Compiler. It evaluates versioned rule packs against a pinned Research Digital Twin snapshot, stores explainable issues, and returns domain health/coverage. It validates consistency; it does not write academic content or decide that uncertain evidence is true.

## Rule-pack domains

- Structural: RQ/objective/hypothesis/variable/construct/indicator alignment.
- Methodological: research question, method, population/sample, instrument, collection, and analysis fit.
- Evidence: source admissibility, claim support, retraction/correction, and evidence strength.
- Statistical/qualitative: assumption, power/sample, analysis-plan, result, and interpretation compatibility.
- Citation: in-text citation/reference resolution and DOI/metadata integrity.
- Ethics: approval/consent/data-collection constraints.
- Publication: manuscript structure, target requirements, claim verification, and readiness.

Each rule has `rule_id`, version, domain, description, applicability predicate, required inputs, evaluation kind, severity mapping, output template, remediation, and policy owner. Historical runs retain the exact rule version.

## Evaluation sequence

1. Pin RDT and policy/rule-pack versions.
2. Resolve applicable rules and prerequisite coverage.
3. Run deterministic relationship and metadata checks.
4. Run calculation/tool-backed checks through permissioned tools.
5. Request evidence-aware agent evaluation only where judgment is necessary; all model work uses the AI Gateway and pinned Project Context.
6. Reconcile results without hiding disagreement.
7. Persist issues and domain summaries atomically.
8. Emit pass/fail event and propose next actions.

The same snapshot and rules produce the same deterministic results. Model-assisted results include model, context, prompt/policy, evidence, and confidence so they can be reviewed rather than treated as deterministic truth.

## Issue semantics

Outcomes are exactly `PASS`, `WARNING`, `ERROR`, `BLOCKED`, or `UNKNOWN`. Issues store the required fields `issue_id`, `severity`, `domain`, `message`, `affected_entities`, `evidence`, `recommended_action`, `verification_status`, and `resolved_at`, plus run/rule/project/version and audit metadata.

An issue is resolved only after a relevant state change and successful re-evaluation. Suppression/override, if policy permits it, is separate from resolution and requires actor, rationale, expiry/scope, and audit evidence.

## Research Health calculation

Domain and aggregate health are explainable projections over applicable checks. They must show rule coverage, warnings/errors, unknowns, blocked checks, stale status, formula/rule-pack version, and severity caps. Aggregate scoring is unavailable when minimum coverage is not met. No score overrides a blocking issue or human gate, and scores are not exposed as gamification.

## Incremental and full compilation

Dependency impact selects affected rules for fast incremental validation after changes. A full compiler run is required before publication readiness, after major upstream revisions, and whenever rule-pack changes invalidate previous coverage. Cached results are keyed by project, twin version, rule version, and evidence state.

## Human and system boundaries

- The engine may recommend but cannot change methodology or other protected research decisions.
- It cannot submit externally or publish data.
- It cannot mark publication claims verified without admissible evidence links and applicable domain validation.
- `UNKNOWN` remains visible; it cannot be converted to a pass to improve health.

## Failure modes and observability

Partial execution results in an incomplete, explicitly `BLOCKED` run; no aggregate pass is emitted. Stale evidence invalidates dependent checks. Rule defects are quarantined by version, with prior runs retained. Observe run duration, domain coverage, outcome distribution, stale results, issue age/reopen rate, overrides, disagreement, and publication-gate blocks.

## Related documents

- [Research Compiler](../architecture/RESEARCH%20COMPILER.md)
- [Research Consistency Model](../database/RESEARCH%20CONSISTENCY%20MODEL.md)
- [Evidence to Claim Graph](./EVIDENCE%20TO%20CLAIM%20GRAPH.md)

