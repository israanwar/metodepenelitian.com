# Analysis Advisor Engine

**Status:** LOCKED P0 advisory contract — documented, not implemented

## Purpose

Analysis Advisor proposes defensible analysis methods from complete research and dataset context. It is not a keyword-to-test lookup, execution engine, or substitute for methodological judgment.

## Required decision context

Research Question, Objective, Hypothesis where applicable, Research Design, Variable Roles, Variable Types, Measurement Scales, Population, Sampling, Sample Size, Dataset Characteristics, Distribution, Statistical Assumptions, missingness, grouping/repeated structure, and qualitative/mixed-method design.

Missing decision-critical context returns `INSUFFICIENT INFORMATION`; the engine asks for the missing facts rather than guessing.

## Recommendation output

Each candidate has outcome `RECOMMENDED`, `ALTERNATIVE`, `NOT RECOMMENDED`, or `INSUFFICIENT INFORMATION`, plus method/capability id, rationale, assumptions, required tests, limitations, alternatives, confidence, evidence/references where relevant, required inputs, execution engines, and decision-context snapshot.

Deterministic eligibility/assumption rules run before model-assisted explanation. Model calls use pinned Project Context through Agent Orchestrator/Multi-Model AI Gateway and cannot add methods absent from the Capability Registry.

## Analysis Capability Registry

Each extensible capability declares `capability_id`, method, supported engines, input requirements, assumptions, parameters, outputs, validation, interpretation schema, table schema, version, and status. Status distinguishes planned/available/limited/external-only/blocked/deprecated capability. Adding a method cannot change core pipeline semantics.

Canonical registry fields:

```text
capability_id
method
supported_engines
input_requirements
assumptions
parameters
outputs
validation
interpretation_schema
table_schema
status
```

Candidate quantitative families include descriptive statistics, correlation, t-test, ANOVA/ANCOVA/MANOVA, chi-square/nonparametric tests, linear/multiple/logistic regression, mediation/moderation, effect size/power, EFA/CFA/SEM/PLS-SEM/path/multi-group, time series, panel data, and cluster analysis. Listing is architectural capacity, not availability.

## Approval and handoff

User reviews why, assumptions, required tests, limitations, alternatives, cost/resource class, and data exposure before approving an `AnalysisExecutionPlan`. Changing method invalidates affected results/interpretations/documents and requires dependency impact plus approval.

## Failure and observability

Conflicting context, unverified mappings, unmet assumptions, unavailable engine, or insufficient sample blocks recommendation/approval as appropriate. Observe missing-context rate, recommendations by outcome, human overrides with reasons, assumption failures, and later result-validation failures; do not optimize acceptance rate as gamification.

## Related documents

- [Analysis Model](../database/ANALYSIS%20MODEL.md)
- [Statistical Execution Engine](./STATISTICAL%20EXECUTION%20ENGINE.md)
- [Qualitative Execution Engine](./QUALITATIVE%20EXECUTION%20ENGINE.md)
