# Research Compiler

**Status:** P0 architectural contract — documented, not implemented

## Purpose

The Research Compiler is the structural, methodological, evidence, statistical, citation, ethics, and publication-consistency validator for a Research Digital Twin snapshot. It is not a grammar checker, an opaque quality score, or an autonomous editor. It reads versioned project state, applies explicit rules, and produces reproducible findings without silently changing research decisions.

## Validation contract

The minimum relationship checks are:

| Domain | Required consistency |
|---|---|
| Structural | Research Question ↔ Objective; Objective ↔ Hypothesis; Hypothesis ↔ Variable; Variable ↔ Construct; Construct ↔ Indicator |
| Evidence | Indicator ↔ Source; Claim ↔ Evidence; evidence provenance and admissibility |
| Measurement | Variable ↔ Measurement; Instrument ↔ Variable; indicator coverage and instrument version |
| Methodology | Method ↔ Research Question; Method ↔ Data; Sample ↔ Analysis; Ethics ↔ Data Collection |
| Analysis | Method ↔ Analysis; Analysis ↔ Hypothesis; Result ↔ Hypothesis; Result ↔ Research Question |
| Interpretation | Discussion ↔ Result; Discussion ↔ Theory; Conclusion/publication claim ↔ verified results |
| Citation | Citation ↔ Reference; Reference ↔ DOI/metadata; retraction/correction state |
| Publication | Manuscript ↔ journal requirements; Publication Claim ↔ verified status |
| Formatting | Document/artifact ↔ resolved institutional or exact-journal policy; canonical content/provenance ↔ rendered output fidelity |

Rules are versioned and identify domain, applicability, required inputs, severity policy, deterministic/evidence-aware evaluation method, and remediation guidance. A rule that lacks required information returns `UNKNOWN` or `BLOCKED`; it never guesses.

## Outcomes and issue record

- `PASS`: all applicable required checks have sufficient support and pass.
- `WARNING`: work may continue, but a material risk or non-blocking inconsistency needs review.
- `ERROR`: a consistency rule fails and affected downstream work is invalid or unsafe.
- `BLOCKED`: a required gate, dependency, permission, or input prevents evaluation/transition.
- `UNKNOWN`: available information is insufficient to decide.

Every finding includes:

```text
issue_id, compiler_run_id, rule_id, rule_version, project_id, twin_version,
severity, domain, message, affected_entities, evidence,
recommended_action, verification_status, created_at, resolved_at
```

Resolution never deletes the issue. It records resolver, resolution evidence, resulting RDT version, and a re-run that proves the rule now passes.

## Research Health

`Research Health: 86/100` is a compact view over check outcomes, not a reward, rank, or claim of correctness. The calculation must be deterministic, versioned, explainable, and accompanied by coverage and unresolved `UNKNOWN/BLOCKED` counts. A high number cannot override an `ERROR` or approval gate.

Example projection:

```text
Structural Consistency       PASS
Methodological Consistency   WARNING
Evidence Grounding           PASS
Statistical Validity         WARNING
Citation Integrity           PASS
Publication Readiness        WARNING
```

Recommended model: compute each domain from weighted applicable rules, apply severity caps, and publish overall score only when minimum coverage is met. Otherwise show `UNAVAILABLE` with the missing prerequisites. The exact weights remain a policy decision and must be validated before implementation.

## Execution lifecycle

1. Pin project id, RDT version, rule-pack version, journal requirement version, resolved formatting-profile/policy versions where applicable, and authorized actor.
2. Resolve the dependency subgraph and required evidence.
3. Run deterministic checks before model-assisted checks.
4. Route any model-assisted evaluation through Agent Orchestrator and Multi-Model AI Gateway with the same RDT snapshot.
5. Store issues, domain summaries, coverage, and provenance.
6. Emit `research.compiler.failed` when blocking/error outcomes exist, otherwise `research.compiler.passed`; warnings and unknowns remain visible.
7. Feed unresolved findings to the Next Best Research Action Engine.

Compiler runs are idempotent for the same inputs. A later RDT version creates a new run and may make the prior result stale.

## Candidate-title evaluation

For multiple candidate titles, the compiler validates the shape and evidence of evaluations produced by Literature, Evidence, Novelty, Feasibility, Methodology, Data Feasibility, Publication, and Research Critic agents. Dimensions are Evidence Availability, Novelty, Research Gap Strength, Methodological Feasibility, Data Feasibility, Sample Feasibility, Analysis Fit, Academic Contribution, Publication Potential, and Execution Risk.

Every dimension requires rationale, evidence references, confidence, and assumptions. A missing basis is `UNKNOWN`, never a fabricated score. Comparisons remain advisory; user selection creates a proposed topic and does not make its gap or design verified.

## Protected transitions

Compiler results may block or recommend changes, but cannot approve protected mutations or external submission. Methodology, hypotheses, population/sample, final instrument, dataset replacement, final analysis/manuscript, publication target, external submission, and research-data publication require recorded human approval.

## Failure modes and observability

- Rule-pack mismatch or unavailable dependency: mark run `BLOCKED`.
- Evidence source unavailable: preserve prior provenance, mark current verification stale/unknown.
- Partial engine failure: report incomplete coverage and affected domains; do not publish a misleading aggregate score.
- Model disagreement: retain competing assessments and route to human/Research Critic review.

Observe rule outcome distribution, stale-run rate, issue age, reopen rate, domain coverage, false-positive/override review, execution latency, and frequency of blocked publication transitions. Metrics must not become user gamification.

## Related documents

- [Research Consistency Engine](../internal-engines/RESEARCH%20CONSISTENCY%20ENGINE.md)
- [Evidence to Claim Graph](../internal-engines/EVIDENCE%20TO%20CLAIM%20GRAPH.md)
- [Research Consistency Model](../database/RESEARCH%20CONSISTENCY%20MODEL.md)
- [Research Digital Twin](./RESEARCH%20DIGITAL%20TWIN.md)
- [Institutional & Publication Formatting Architecture](./INSTITUTIONAL%20PUBLICATION%20FORMATTING.md)
