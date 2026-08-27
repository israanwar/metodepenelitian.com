# Writing & Citation

## Purpose
This component supports drafting a manuscript inside a `ResearchProject` (structured section-by-section writing assistance) and inserting correctly formatted citations drawn from the project's canonical reference set, so a researcher writes inside a document that already knows their literature, evidence, methodology, and results.

## Scope
Covers section-aware writing assistance (draft generation and editing help scoped to a manuscript section: introduction, literature review, methodology, results, discussion), citation insertion and in-text formatting from the project's `ResearchReference` set, bibliography generation in researcher-selected citation styles, and pulling already-generated content (synthesis drafts, methodology justification, analysis results, thematic summaries) from upstream engines into the manuscript rather than regenerating it. Does not cover the underlying evidence/methodology/analysis generation itself (owned by [11](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md), [15](15%20METHODOLOGY%20ADVISOR.md), [16](16%20ANALYSIS%20ADVISOR.md)/[17](17%20DATASET%20ANALYSIS.md)), and does not cover file format conversion of the finished document (that is [20 RESEARCH FILE TOOLS.md](20%20RESEARCH%20FILE%20TOOLS.md)).

## Responsibilities
- Maintain a structured manuscript document per project, organized by section, editable by the researcher with AI-assisted drafting support per section.
- Pull already-produced content from upstream engines into the appropriate section on request (e.g., insert the literature review's synthesis draft from Evidence Synthesis, insert the methodology justification from Methodology Advisor, insert result tables from Dataset Analysis) rather than re-deriving that content independently.
- Resolve citation insertions against the project's canonical `ResearchReference` set: given a researcher's in-text citation request, insert a correctly keyed citation and add/update the corresponding bibliography entry.
- Render a full bibliography in a researcher-selected citation style (e.g., APA, and other styles as configured), kept consistent across the whole document.
- Track which sections are AI-drafted-and-unedited versus researcher-edited, so the researcher always knows what still needs review before submission.

## Non-Responsibilities
- Does not generate literature synthesis, methodology justification, or analysis interpretation itself; it assembles and formats content those engines already produced.
- Does not fetch or normalize new scholarly references; it only cites from the project's existing canonical `ResearchReference` set (adding a new reference goes through discovery/import, not this component).
- Does not check for plagiarism or academic integrity violations; that is explicitly out of scope for this component and, if offered, belongs to a separate integrity-checking capability.
- Does not export or convert the manuscript to external file formats; that is Research File Tools' responsibility.
- Does not call any AI provider or citation-style-formatting logic outside the Multi-Model AI Gateway and this component's own deterministic style-formatting rules.

## Core Components
- **Manuscript Document Store**: structured, section-organized document per project, versioned, distinguishing AI-drafted from researcher-edited content at the paragraph or block level.
- **Section Draft Assistant**: given a section and available project context (research question, relevant synthesis/methodology/analysis output), requests draft or continuation text through the AI Gateway, scoped tightly to the section's typical academic function.
- **Content Assembler**: pulls finished artifacts from upstream engines (`SynthesisDraft`, methodology justification, `AnalysisResult`, `ThemeSummary`) into the manuscript on researcher request, with a clear link back to the source artifact.
- **Citation Resolver**: matches a researcher's citation request to a specific `ResearchReference`, inserts a style-correct in-text citation, and updates the bibliography entry set.
- **Citation Style Formatter**: deterministic, non-AI formatting engine applying a selected citation style's rules to reference data; style rules are data/config, not hardcoded per document, so adding a style does not require touching the resolver.

## Owned Data
| Entity | Description |
|---|---|
| `Manuscript` | Project-scoped structured document: sections, blocks, and per-block AI-drafted/researcher-edited status. |
| `CitationInstance` | An in-text citation placed in the manuscript, keyed to a specific `ResearchReference`. |
| `Bibliography` | The rendered reference list for a manuscript, generated from its `CitationInstance` set and the selected citation style. |
| `CitationStyleConfig` | The researcher's selected citation style and any project-specific style overrides. |

## Inputs
- Project context (research question, scope) from the [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md).
- `SynthesisDraft` from [11 EVIDENCE SYNTHESIS ENGINE.md](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md), methodology justification from [15 METHODOLOGY ADVISOR.md](15%20METHODOLOGY%20ADVISOR.md), `AnalysisResult`/`InterpretationDraft` from [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md), and `ThemeSummary`/`MixedMethodsSummary` from [18 QUALITATIVE MIXED METHODS.md](18%20QUALITATIVE%20MIXED%20METHODS.md).
- The project's canonical `ResearchReference` set, including any references imported via [14 REFERENCE MANAGERS.md](14%20REFERENCE%20MANAGERS.md).

## Outputs
- `Manuscript` content, section by section, with clear AI-drafted-versus-edited status.
- `CitationInstance` and `Bibliography` records, ready for export via Research File Tools.
- Manuscript content available to the Reference Manager Gateway if a researcher wants cited references pushed back to their external library.

## Dependencies
- [Multi-Model AI Gateway](05%20MULTI%20MODEL%20AI%20GATEWAY.md) for all draft-generation calls.
- [Evidence Synthesis Engine](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md), [Methodology Advisor](15%20METHODOLOGY%20ADVISOR.md), [Dataset Analysis](17%20DATASET%20ANALYSIS.md), and [Qualitative & Mixed Methods](18%20QUALITATIVE%20MIXED%20METHODS.md) as content sources.
- [Reference Manager Gateway](14%20REFERENCE%20MANAGERS.md) and the canonical `ResearchReference` model for citation resolution.
- [20 RESEARCH FILE TOOLS.md](20%20RESEARCH%20FILE%20TOOLS.md) as the downstream consumer for exporting the finished manuscript.
- [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md) for shared context.

## Extension Points
- Additional citation styles are added as new `CitationStyleConfig` rule sets, not new code paths.
- Section types beyond the standard IMRaD structure (e.g., a qualitative-specific structure, or a thesis-chapter structure common in Indonesian institutions) can be added as alternate manuscript templates.
- Collaborative multi-author editing (comments, suggested edits, section ownership) is a stated future extension once multi-collaborator project support exists.

## Security & Privacy
Manuscript content is private by default and strictly project-scoped, per [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md). Draft generation prompts include only the researcher's own project content and already-produced upstream artifacts, never another researcher's data. A researcher explicitly controls when the manuscript (or an exported version of it) leaves the platform, e.g., through Research File Tools export or Reference Manager export.

## Failure Modes
- **AI Gateway unavailable**: section drafting assistance pauses; the researcher can still write manually in the Manuscript Document Store, and citation resolution/formatting (deterministic, non-AI) continues to work fully, satisfying degraded-but-functional operation for the parts of writing that do not require generation.
- **Citation resolver cannot uniquely match a researcher's citation request** (ambiguous author/year): resolver returns candidate matches for the researcher to pick from rather than guessing and inserting a wrong citation.
- **Referenced upstream artifact later changes** (e.g., a `SynthesisDraft` is regenerated after being inserted into the manuscript): inserted content in the manuscript is a snapshot, not a live pointer, so the manuscript never silently changes underneath the researcher; the UI flags that a newer version of the source artifact is available.

## Observability
- Section draft generation count, AI Gateway error rate, and researcher edit-distance on generated drafts (draft quality proxy).
- Citation resolution ambiguity rate (how often a researcher's citation request needs disambiguation).
- Manuscript AI-drafted-versus-edited ratio per project, surfaced to the researcher as a "how much of this is still draft" indicator.

## P0/P1/P2/P3
**P1.** Manuscript writing and citation support is a major, highly visible product capability and a core promise of the "Research OS," but the platform's other engines (synthesis, gap, methodology, analysis) produce standalone value even without this assembly layer, so it is P1 rather than foundational P0.

## Current Status
Documented, not implemented. No manuscript store, section assistant, content assembler, or citation resolver exists in code yet.

## Open Questions
- Which citation styles ship at launch, and are Indonesian-institution-specific style variants (some universities mandate locally modified APA/IEEE variants) required from day one?
- Should the manuscript editor be a rich-text/WYSIWYG surface or a structured-block editor, and how does that choice affect the Content Assembler's insertion model?
- How is a "snapshot became stale" notification (upstream artifact changed after insertion) surfaced without being noisy for a researcher mid-writing?

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [11 EVIDENCE SYNTHESIS ENGINE.md](11%20EVIDENCE%20SYNTHESIS%20ENGINE.md)
- [14 REFERENCE MANAGERS.md](14%20REFERENCE%20MANAGERS.md)
- [15 METHODOLOGY ADVISOR.md](15%20METHODOLOGY%20ADVISOR.md)
- [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md)
- [20 RESEARCH FILE TOOLS.md](20%20RESEARCH%20FILE%20TOOLS.md)
