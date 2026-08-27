# Data-to-Analysis Workflow

**Status:** LOCKED P0 workflow contract — documented, not implemented

## Goal

Transform authorized raw research data into an approved, reproducible analysis execution and immutable result set without overwriting source data, guessing variable mappings, or sending rows to AI automatically.

## Workflow

| Stage | Inputs | Outputs / RDT updates | Validation and approval | Failure / next |
|---|---|---|---|---|
| 1. Data ingestion | Project, consent/access, signed upload | Dataset, immutable v1 RAW, provenance | auth, tenant, malware, format/checksum, privacy | reject/quarantine safely; next Profile |
| 2. Dataset profiling | RAW version, format capability | schema, types/scales/labels, missing/duplicate/outlier/descriptive profile | parser/profile coverage and confidence | unsupported/partial stays blocked; next Map |
| 3. Variable mapping | profile + RDT variables/indicators | mapping proposals/status | `UNMAPPED/MAPPED/AMBIGUOUS/MISSING/INVALID`; user reviews ambiguity/change | revise model/data; next Preparation |
| 4. Preparation planning | profile/mappings, methodology, privacy | ordered transformation plan and impact preview | deterministic capability, consent, lineage; destructive actions need approval | plan blocked/revised; next Execute prep |
| 5. Preparation execution | approved plan + pinned input | new CLEANED/CODED version and transformation log | checksums, schema/row deltas, mappings, reproducibility | no authoritative partial output; next Analysis Ready |
| 6. Analysis-ready gate | derived version, mapping/prep validations | Dataset version `ANALYSIS READY` | compiler Dataset↔Variables, privacy and lineage completeness | remediate; next Method check |
| 7. Methodology consistency | RQ/objective/hypothesis/design/sample/data | issues and method constraints | Research Compiler Method↔RQ/Data, Sample↔Analysis | `ERROR/BLOCKED/UNKNOWN`; next Advisor |
| 8. Analysis recommendation | full decision context + registry | recommended/alternative/not-recommended candidates | rationale, assumptions/tests, limitations, confidence, evidence; missing facts = insufficient | collect info/revise; next Human review |
| 9. Human review/approval | candidates and resource/privacy preview | versioned AnalysisDecision/ExecutionPlan | mandatory for method change/expensive execution | rejected/revise; next Execute |
| 10. Analysis execution | approved plan, pinned dataset/capability | immutable AnalysisRun and result set | sandbox, engine/version, raw+structured output, warnings/errors | failed run preserved; next Validate |
| 11. Result validation | completed run, plan, assumptions | ResultValidation, `VERIFIED` or issues | fidelity, bounds, diagnostics, provenance; completed ≠ verified | rerun/revise without editing old run; next Interpretation |

## Roles and boundaries

Research Director/Orchestrator sequences Data Preparation, Methodology, Analysis Advisor, Quantitative/Qualitative, Statistical Critic, and Research Critic agents. Agents read pinned authorized RDT context and return proposals. Dataset Engine owns ingestion/versioning, Preparation Engine transformations, execution engines runs, and Research Compiler consistency. No agent has a dataset silo.

## Events

`dataset.uploaded`, `dataset.profiled`, `dataset.version.created`, `dataset.mapping.changed`, `dataset.analysis_ready`, `analysis.recommended`, `analysis.approved`, `analysis.started`, `analysis.completed`, `analysis.failed`, `analysis.verified`, plus compiler pass/fail. Handlers are idempotent and project-scoped.

## Next Best Research Action

Examples: after upload with unmapped variables, “Map dataset columns to research variables”; after preparation issue, review the exact transformation/mapping; after unverified completion, “Review assumption and provenance checks.” Recommendations do not mutate data.

## Security and recovery

All stages inherit private-by-default, tenant/access, encryption, signed transfer, malware, audit, isolated temporary processing, retention/deletion, PII and consent constraints. Raw rows are excluded from AI context/provider calls by default. Failures preserve the last valid version and declare recovery prerequisites.

## Related documents

- [Dataset Engine](../internal-engines/DATASET%20ENGINE.md)
- [Analysis Advisor Engine](../internal-engines/ANALYSIS%20ADVISOR%20ENGINE.md)
- [Analysis Model](../database/ANALYSIS%20MODEL.md)

