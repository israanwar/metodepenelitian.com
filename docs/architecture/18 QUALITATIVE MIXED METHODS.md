# Qualitative & Mixed Methods

## Purpose
This component supports researchers doing qualitative or mixed-methods work: organizing qualitative source material (interview transcripts, field notes, open-ended survey responses), assisting with coding and theme development, and coordinating with the quantitative side of a project when a mixed-methods design requires both.

## Scope
Covers qualitative data organization, AI-assisted coding suggestions, theme/pattern identification across coded material, and mixed-methods coordination (aligning qualitative themes with quantitative findings within the same project). Does not cover quantitative statistical computation (that is [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md)), does not cover literature synthesis (that is [11 EVIDENCE SYNTHESIS ENGINE.md](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md)) even though both involve coding-like extraction, and does not perform transcription of audio/video itself as a first-class responsibility in this version (transcription is a stated extension point, not current scope).

## Responsibilities
- Ingest qualitative source material (text transcripts, field notes, open-ended responses) into a project-scoped store, kept separate from quantitative `Dataset` records.
- Support researcher-defined coding schemes (a set of codes/labels the researcher applies to segments of source text) and AI-assisted first-pass coding suggestions that the researcher accepts, edits, or rejects per segment.
- Identify recurring themes/patterns across coded segments and surface them as a draft thematic summary, never as a finished analysis.
- For mixed-methods projects, coordinate with [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md) results and this engine's qualitative themes to produce a joint summary showing where quantitative and qualitative findings align or diverge.

## Non-Responsibilities
- Does not auto-code without researcher review; every AI-suggested code is a suggestion attached to a segment, never applied as final without explicit researcher confirmation.
- Does not perform audio/video transcription itself; source material is expected as text (or already-transcribed) in this version.
- Does not run statistical computation; quantitative work in a mixed-methods project routes through the Analysis Advisor and Dataset Analysis as normal.
- Does not call any AI provider directly.

## Core Components
- **Qualitative Source Store**: project-scoped storage for text-based source material, distinct from the quantitative `Dataset` entity, with segment-level addressability so codes attach to specific spans of text.
- **Coding Scheme Manager**: researcher-defined codes/labels, either created from scratch or seeded from a discipline-template starting scheme.
- **AI Coding Assistant**: submits source segments plus the active coding scheme to the AI Gateway to propose codes per segment; proposals are stored as suggestions distinct from confirmed researcher-applied codes.
- **Theme Synthesizer**: aggregates confirmed coded segments and generates a draft thematic summary (recurring patterns, illustrative quotes) through the AI Gateway.
- **Mixed-Methods Coordinator**: aligns qualitative themes with quantitative `AnalysisResult` data from Dataset Analysis into a single joint summary view for mixed-methods projects.

## Owned Data
| Entity | Description |
|---|---|
| `QualitativeSource` | A project-scoped text source (transcript, field note, open-ended response set), segment-addressable. |
| `CodingScheme` | Researcher-defined set of codes/labels for a project. |
| `CodeApplication` | A code applied to a specific segment of a `QualitativeSource`, with a flag distinguishing AI-suggested from researcher-confirmed. |
| `ThemeSummary` | Generated draft thematic summary across confirmed `CodeApplication` records, with supporting segment references. |
| `MixedMethodsSummary` | Joint qualitative-quantitative summary linking `ThemeSummary` output to related `AnalysisResult` records from Dataset Analysis. |

## Inputs
- Researcher-uploaded or entered qualitative source text.
- Researcher-defined or template-seeded `CodingScheme`.
- Where applicable, `AnalysisResult` records from [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md) for mixed-methods coordination.

## Outputs
- `CodeApplication` records (researcher-confirmed subset used for downstream synthesis).
- `ThemeSummary` drafts, visibly marked as AI-assisted and requiring verification.
- `MixedMethodsSummary` for projects combining both data types, available to [19 WRITING CITATION.md](19%20WRITING%20CITATION.md) for a results/discussion section.

## Dependencies
- [Multi-Model AI Gateway](05%20MULTI%20MODEL%20AI%20GATEWAY.md) for coding suggestions and theme synthesis.
- [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md) for mixed-methods quantitative results to coordinate against.
- [15 METHODOLOGY ADVISOR.md](15%20METHODOLOGY%20ADVISOR.md), which may recommend a qualitative or mixed-methods design that leads into this engine.
- [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md) for shared project context.

## Extension Points
- Audio/video transcription as an upstream ingestion step, likely via a dedicated transcription provider adapter behind the Integration Gateway, is an explicit future extension, not current scope.
- Inter-rater reliability support (multiple researchers coding the same source, with agreement metrics) is a plausible extension once multi-collaborator project support exists.
- Additional qualitative analytical traditions (grounded theory memoing, narrative analysis structures) can be added as alternate Theme Synthesizer modes.

## Security & Privacy
Qualitative source material is often the most sensitive data in a project (verbatim interview transcripts can contain directly identifying information); it is private by default and strictly project-scoped per [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md). Segments sent to the AI Gateway for coding suggestions or theme synthesis carry only the text necessary for that call, and researchers should be able to redact or exclude specific segments from AI processing entirely (a stated requirement for the UI, not yet built). No qualitative source content is retained by an external AI provider beyond the bounds set by the AI Gateway's provider policies.

## Failure Modes
- **AI Gateway unavailable**: coding suggestions and theme synthesis pause; researchers can still manually apply codes from an existing `CodingScheme` and browse previously generated `ThemeSummary` output, keeping manual qualitative work fully functional in degraded mode.
- **Very large source volume** (e.g., dozens of long transcripts): theme synthesis runs as an async background job rather than inline, consistent with the platform-wide rule against long-running inline processing.
- **Coding scheme changes mid-project**: prior `CodeApplication` records are retained and tagged to the scheme version active when applied, rather than silently invalidated.

## Observability
- Coding suggestion acceptance/edit/rejection rate (signal for AI coding assistant quality).
- Theme synthesis generation count and latency.
- Source volume and segment count per project, to catch projects large enough to need pagination/performance attention.

## P0/P1/P2/P3
**P1.** Qualitative and mixed-methods support is a major product capability for a large share of Indonesian academic research (qualitative and mixed-methods designs are common in social science and education research), but the platform remains usable for purely quantitative projects without it, so it is P1, not P0.

## Current Status
Documented, not implemented. No source store, coding scheme manager, AI coding assistant, or theme synthesizer exists in code yet.

## Open Questions
- Should redaction of sensitive segments before AI processing be enforced by the platform (blocking submission of unredacted PII) or left to researcher discretion with strong warnings?
- What is the initial set of discipline-template coding schemes offered, and who curates them?
- How does inter-rater reliability get handled once multi-collaborator projects exist, and does that change the `CodeApplication` schema now to avoid a later migration?

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [15 METHODOLOGY ADVISOR.md](15%20METHODOLOGY%20ADVISOR.md)
- [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md)
- [19 WRITING CITATION.md](19%20WRITING%20CITATION.md)
