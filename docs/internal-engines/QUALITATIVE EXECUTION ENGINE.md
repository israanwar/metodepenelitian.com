# Qualitative Execution Engine

**Status:** LOCKED P0 qualitative/mixed-method contract — documented, capabilities not implemented

## Purpose

Qualitative Execution Engine manages traceable, versioned qualitative analysis while preserving original source material and human interpretive authority. It supports architecture for transcription, coding/codebooks, initial/axial/selective coding, thematic/content/narrative analysis, memoing, theme development/validation, and quotation traceability. Availability is capability-registered.

## Immutable sources and lineage

Original audio/video/document/transcript versions are immutable. Corrections, redactions, translations, segmentation, and normalized transcripts create derived versions linked to source/time/page/line coordinates. Transcription may be native or external only when capability/integration status is verified; no provider API is assumed.

## Qualitative run

An approved run pins project/RDT/source versions, approach, codebook version, sampling/segment rules, agent/tool/version, parameters, approval, and reviewer assignments. Outputs include versioned codes, code applications, categories, themes, memos, findings, disagreement/review decisions, and quotation/source links. AI-generated codes/themes are `PROPOSED`, visibly attributable, and human-reviewable.

## Analysis paths

- Initial → axial → selective coding where the approved methodology uses that sequence.
- Thematic analysis with code/theme definition, supporting/contrary quotations, saturation/coverage notes, and validation.
- Content analysis with unit-of-analysis and counting/interpretive rules.
- Narrative analysis preserving sequence/context and participant boundaries.

Method steps are not interchangeable; Capability Registry declares requirements and validation per approach.

## Mixed-method integration

```text
QUANTITATIVE RESULTS + QUALITATIVE FINDINGS
→ TRIANGULATION → CONVERGENCE / DIVERGENCE
→ JOINT DISPLAY → META-INFERENCE
```

Mixed Methods Agent aligns comparable constructs/RQs, records design/timing/priority, traces each joint-display cell to quantitative result ids and qualitative finding/quotation ids, explains convergence/divergence, and produces bounded meta-inferences. Concatenating two result paragraphs is invalid.

## Human authority and safety

Humans approve codebook changes, material coding/theme decisions, exclusion/redaction, verified findings, and meta-inferences. Sensitive participant data is private by default; source segments cannot be sent to an AI provider automatically. Consent/purpose, minimization, redaction/exclusion, provider disclosure, tenant isolation, encryption, audit, and retention rules apply.

## Failure and observability

Missing source trace, stale codebook, orphaned quotation, cross-participant leakage, unresolved reviewer conflict, or unsupported meta-inference blocks verification. Observe source coverage, review disagreement, proposal acceptance/changes, orphaned references, version drift, and provider disclosure/consent failures without exposing participant content.

## Related documents

- [Analysis Model](../database/ANALYSIS%20MODEL.md)
- [Analysis Result Model](../database/ANALYSIS%20RESULT%20MODEL.md)
- [Analysis-to-Interpretation Workflow](../workflows/ANALYSIS%20TO%20INTERPRETATION%20WORKFLOW.md)

