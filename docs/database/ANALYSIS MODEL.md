# Analysis Model

**Status:** LOCKED P0 conceptual model — no SQL, migration, engine, or package implementation

## Ownership and purpose

Dataset & Analysis owns analysis capabilities, recommendations, decisions/plans, executions, and validation metadata. Research Digital Twin links them to RQs, hypotheses, variables, methodology, and dataset versions. Agent/model records are provenance, never canonical results.

## Entities

### AnalysisCapability

Extensible registry definition: `capability_id`, method/family, version, quantitative/qualitative/mixed type, supported engines, input requirements, assumptions, parameters/schema, outputs/schema, validation rules, interpretation schema, table/figure schema, cost/resource class, security limits, status, validation evidence/date, and deprecation/replacement.

Capability availability is explicit (`PLANNED`, `AVAILABLE`, `LIMITED`, `EXTERNAL INTEROP`, `BLOCKED`, `DEPRECATED`) and may differ by engine. A registry entry is not evidence of implementation until validated available.

### AnalysisRecommendation

Pinned decision-context snapshot and one candidate outcome: `RECOMMENDED`, `ALTERNATIVE`, `NOT RECOMMENDED`, or `INSUFFICIENT INFORMATION`; capability/method, rationale, assumptions/tests, limitations, alternatives, confidence, evidence/references, missing inputs, agent/rule/model/prompt versions, timestamps, and stale state.

### AnalysisDecision / AnalysisExecutionPlan

Human-reviewed selected capability with RQ/hypothesis/variable mappings, dataset version, method, engine, parameters, assumption-test plan, validation plan, cost/resource preview, privacy exposure, expected outputs, approval and version. A changed plan is new version and invalidates dependent runs.

### AnalysisRun

Immutable execution with minimum required fields:

```text
analysis_run_id, project_id, dataset_version, method, engine,
engine_version, parameters, variables, hypotheses, assumption_results,
execution_timestamp, raw_output, structured_output, status,
warnings, errors, provenance
```

Also records plan/capability/RDT versions, RQs, runtime/environment/packages, seed, input/output checksums, job/actor/approval ids, start/end, logs, resource use, validation id, and supersession. Status: `PLANNED`, `APPROVED`, `RUNNING`, `COMPLETED`, `FAILED`, `VERIFIED`, `SUPERSEDED`.

### QualitativeAnalysisRun

Specializes the run contract with source/transcript versions, approach, codebook version, unit/sampling rules, code/theme/memo outputs, reviewer decisions, quotation traceability, coverage/saturation notes, and human verification.

### MixedMethodsIntegrationRun

Pins quantitative result set and qualitative finding set, design/timing/priority, construct/RQ alignment, triangulation rules, convergence/divergence decisions, joint display, meta-inferences, provenance, validation, and approval.

### AnalysisAssumptionResult

Structured prerequisite/test result with assumption id, method, input version, statistic/value/reference, outcome, threshold/policy, limitation, and validation. Assumptions are not free-text model claims.

### AnalysisEngineCapability / SoftwareInteroperabilityCapability

Maps capability to native engine or external software and one of `NATIVE EXECUTION`, `IMPORT`, `EXPORT`, `FILE INTEROPERABILITY`, `API INTEGRATION`, `PARTNERSHIP REQUIRED`, `NOT AVAILABLE`, including format/API evidence, version, constraints, verification date, and status. No undocumented API is modeled as available.

## Invariants

- A run pins an approved plan and immutable dataset/source versions.
- `COMPLETED` never implies `VERIFIED`; failed/partial output cannot become result truth.
- Run contents are immutable; rerun/correction produces a new run and supersession edge.
- Numerical computation is deterministic/tool output, never AI-generated or AI-edited.
- Qualitative AI proposals require human review and immutable quotation/source traceability.
- Mixed-method meta-inference requires aligned, validated quantitative and qualitative inputs.

## Related documents

- [Analysis Advisor Engine](../internal-engines/ANALYSIS%20ADVISOR%20ENGINE.md)
- [Statistical Execution Engine](../internal-engines/STATISTICAL%20EXECUTION%20ENGINE.md)
- [Qualitative Execution Engine](../internal-engines/QUALITATIVE%20EXECUTION%20ENGINE.md)
- [Analysis Result Model](./ANALYSIS%20RESULT%20MODEL.md)

