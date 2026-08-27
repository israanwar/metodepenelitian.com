# Statistical Execution Engine

**Status:** LOCKED P0 execution backbone — documented, no methods implemented

## Purpose

Statistical Execution Engine executes an approved, registry-backed quantitative plan against a pinned analysis-ready dataset in an isolated, reproducible runtime. The backbone is tool/provider agnostic; Python and R are eligible native runtime families. AI never performs or alters numerical computation.

## Execution contract

1. Verify authorization, approval, capability status, dataset/mapping/method versions, resource policy, and assumptions/prerequisites.
2. Materialize a read-only input in an isolated temporary workspace.
3. Execute pinned engine/runtime/package/container versions and deterministic parameters.
4. Capture raw output, logs, warnings/errors, environment manifest, seeds, diagnostics, and structured result schema.
5. Validate structure, numerical integrity, assumption outputs, expected bounds, and reproducibility metadata.
6. Atomically persist immutable `AnalysisRun`/result artifacts, clean temporary data, and emit events.

## AnalysisRun

Minimum fields: `analysis_run_id`, `project_id`, `dataset_version`, method/capability, engine, engine version/environment, parameters, variables, hypotheses/RQs, assumption results, execution timestamp, raw output reference, structured output, status, warnings, errors, provenance, approval, and checksums.

Status is exactly `PLANNED`, `APPROVED`, `RUNNING`, `COMPLETED`, `FAILED`, `VERIFIED`, or `SUPERSEDED`. `COMPLETED` is not `VERIFIED`. Runs are immutable; corrections or reruns produce new runs and supersession links.

## Capability and interoperability

Native capability is separately registered per Python/R engine and version. External software (SPSS, SmartPLS, AMOS, Stata, SAS, JASP, Jamovi, Mplus, LISREL) may be `IMPORT`, `EXPORT`, `FILE INTEROPERABILITY`, `API INTEGRATION`, `PARTNERSHIP REQUIRED`, or `NOT AVAILABLE`; none is a core execution dependency and no undocumented API is implied.

## Numerical integrity

Structured values are parsed deterministically from engine output and stored at original precision with explicit display/rounding policy. AI can explain only validated referenced values. It cannot invent, recalculate informally, replace, or silently correct results. Tables/figures bind to result ids, not copied free text.

## Security and failures

Execution is project/tenant isolated, network-denied by default, resource/time bounded, audited, and cleaned after completion. Failures preserve logs and prior state but cannot publish partial output as results. Expensive runs require approval. Observe queue/runtime, resource use, failure reasons, reproducibility checks, verification latency, and sandbox cleanup.

## Related documents

- [Analysis Model](../database/ANALYSIS%20MODEL.md)
- [Analysis Result Model](../database/ANALYSIS%20RESULT%20MODEL.md)
- [Analysis-to-Interpretation Workflow](../workflows/ANALYSIS%20TO%20INTERPRETATION%20WORKFLOW.md)
