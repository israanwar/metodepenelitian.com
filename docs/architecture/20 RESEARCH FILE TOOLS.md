# Research File Tools

> **Canonical P1 expansion:** this baseline capability document remains valid. The locked privacy-first router, provider abstraction, parsing/extraction, FileAsset/ConversionJob, async, and license-governance contract is defined in [RESEARCH FILE TOOLS.md](RESEARCH%20FILE%20TOOLS.md). Capability lists here do not imply verified implementation.

## Purpose
The Research File Conversion Service handles file formats specific to the research workflow (BibTeX/RIS/EndNote XML reference formats, LaTeX/Word manuscript export, dataset codebook formats, PRISMA-style diagram export) so the rest of the platform never has to know format-specific detail. It is deliberately not a general-purpose file converter: it exists to move research artifacts between the platform's canonical models and the formats researchers and journals actually require.

## Scope
Covers conversion for four research-specific artifact classes: (1) reference data in and out of the canonical `ResearchReference` model (BibTeX, RIS, EndNote XML, CSL-JSON), (2) manuscript export from the `Manuscript` model to submission-ready formats (Word `.docx`, LaTeX, PDF), (3) dataset codebook export describing a `Dataset`'s schema in a portable format, and (4) diagram export for structured research artifacts (e.g., a PRISMA flow diagram derived from project data) to image/vector formats. Does not cover general file storage/management, does not cover arbitrary document format conversion unrelated to a research artifact, and does not cover the underlying content generation for any of these artifacts (owned by their respective engines).

## Responsibilities
- Convert canonical `ResearchReference` records to and from standard bibliographic interchange formats (BibTeX, RIS, EndNote XML, CSL-JSON) for import/export, independent of and complementary to the [Reference Manager Gateway](14%20REFERENCE%20MANAGERS.md)'s live-sync path (this is file-based, not account-sync-based).
- Export a `Manuscript` (from [19 WRITING CITATION.md](19%20WRITING%20CITATION.md)) to `.docx`, LaTeX source, and PDF, preserving section structure, in-text citations, and a formatted bibliography.
- Export a `Dataset`'s schema (from [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md)) as a codebook document (variable names, types, value labels) in a portable format.
- Generate a PRISMA-style flow diagram (or equivalent structured research diagram) from project data where the underlying data exists (e.g., screening counts if a screening workflow supplies them), exported as image/vector output.
- Validate that a conversion target format is actually appropriate for the source artifact type, rejecting mismatched requests (e.g., refusing to "convert" a raw dataset file as if it were a reference list) rather than silently producing garbage output.

## Non-Responsibilities
- Does not act as a general-purpose file converter for arbitrary formats; there is no "convert any file to any file" capability, and this is a deliberate boundary, not a missing feature.
- Does not generate the content being converted; a manuscript export requires a `Manuscript` to already exist, a reference export requires `ResearchReference` records to already exist.
- Does not perform OCR or ingest arbitrary scanned documents as a first-class responsibility in this version.
- Does not call any AI provider; conversion is deterministic, format-mapping logic, not AI-generated transformation, which keeps output faithful and reproducible.

## Core Components
- **Reference Format Converter**: bidirectional mapping between canonical `ResearchReference` fields and BibTeX/RIS/EndNote XML/CSL-JSON, using established open format specifications as the mapping target (exact field-level edge cases across formats: REQUIRES VERIFICATION against each format's spec at implementation time).
- **Manuscript Export Renderer**: converts the structured `Manuscript` document (sections, citations, bibliography) into `.docx`, LaTeX, and PDF, preserving citation style formatting already applied by the Writing & Citation component. Underlying rendering approach (e.g., a document-generation library and a LaTeX toolchain) is an implementation detail to be selected at build time, not specified here.
- **Codebook Exporter**: renders a `Dataset` schema into a structured codebook document (variable-by-variable table with type and label information).
- **Diagram Exporter**: renders structured project data (e.g., PRISMA screening counts, if supplied by a screening workflow) into a flow diagram, exported as SVG/PNG/PDF.
- **Format Validator**: a gate in front of every conversion request checking that the requested source/target pairing is a supported, meaningful combination before any conversion runs.

## Owned Data
| Entity | Description |
|---|---|
| `ConversionJob` | A single conversion request: source artifact reference, source type, target format, status, and resulting file reference. |
| `ConversionTemplate` | Format-specific rendering configuration (e.g., a LaTeX template, a codebook layout) that a conversion run uses, versioned so past exports remain reproducible. |

## Inputs
- Canonical `ResearchReference` records (for reference format export) or an uploaded BibTeX/RIS/EndNote file (for reference format import, feeding into the same normalization pipeline referenced in [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)).
- `Manuscript` content from [19 WRITING CITATION.md](19%20WRITING%20CITATION.md).
- `Dataset` schema from [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md).
- Structured project data feeding diagram generation (e.g., screening/gap counts), where such data exists.

## Outputs
- Converted files (`.bib`, `.ris`, `.xml`, `.json`, `.docx`, `.tex`, `.pdf`, codebook documents, diagram images) delivered to the requesting researcher.
- Imported `ResearchReference` records when converting inbound reference files, routed through the same canonical normalization as any other reference source.

## Dependencies
- [19 WRITING CITATION.md](19%20WRITING%20CITATION.md) as the source of manuscript content for export.
- [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md) as the source of dataset schema for codebook export.
- [14 REFERENCE MANAGERS.md](14%20REFERENCE%20MANAGERS.md) and the canonical `ResearchReference` model for reference format conversion.
- Async background job infrastructure per [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) for larger exports (e.g., PDF rendering of a long manuscript), so conversion never blocks a request inline.

## Extension Points
- Additional bibliographic formats (e.g., MODS, Refer/BibIX) can be added to the Reference Format Converter as new mapping modules.
- Additional manuscript export targets (e.g., a specific journal's submission template) can be added as new `ConversionTemplate` entries without touching the renderer's core logic.
- Additional diagram types beyond PRISMA (e.g., a theoretical framework diagram) are an explicit future extension once the underlying structured data exists elsewhere in the platform.

## Security & Privacy
Conversion operates on data already scoped to one private `ResearchProject`; exported files inherit the same access control as their source artifact and are not made public by the act of conversion. Since conversion is deterministic and does not call any AI provider, no project content is exposed to a third-party model during this step. Generated files are stored under the same retention and deletion rules as other project artifacts per [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).

## Failure Modes
- **Format Validator rejects an unsupported source/target pairing**: request fails immediately with a specific, actionable error rather than attempting a nonsensical conversion.
- **Source artifact incomplete** (e.g., manuscript missing a required section for a target template): export fails with a specific missing-field error rather than producing a silently broken document.
- **Large manuscript/dataset causing slow rendering**: runs as an async background job with job status polling, never inline on the request, consistent with the platform-wide async-for-heavy-work rule.
- **Format spec edge case not handled** (e.g., an unusual BibTeX entry type): conversion flags the specific unmapped field/entry for researcher review rather than silently dropping data.

## Observability
- Conversion job volume and success/failure rate by source/target format pair.
- Conversion job duration, especially for manuscript PDF/LaTeX rendering, to catch performance regressions before they affect the async job queue broadly.
- Most common Format Validator rejections (signal for where researchers expect a conversion path that does not yet exist).

## P0/P1/P2/P3
**P1.** Getting a manuscript or reference list out of the platform in a submission-ready or interchange format is a major, concrete product capability required for the platform to be genuinely useful at the end of a research workflow, but the platform's core engines function and produce value before any export happens, so this is P1, not P0.

## Current Status
Documented, not implemented. No converters, renderers, or format validator exist in code yet. Specific library/toolchain choices for `.docx`/LaTeX/PDF rendering are implementation decisions deferred to build time and are not specified in this document.

## Open Questions
- Which manuscript export format ships first: `.docx` (broadest researcher familiarity) or LaTeX (more common in STEM disciplines with heavier equation/citation needs)?
- Should PRISMA diagram export require a dedicated screening workflow to exist first, or can it work from partial/manually entered counts?
- How are format-spec edge cases (e.g., BibTeX entry types with no clean canonical-model equivalent) surfaced to researchers in a way that is useful rather than confusing?

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [14 REFERENCE MANAGERS.md](14%20REFERENCE%20MANAGERS.md)
- [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md)
- [19 WRITING CITATION.md](19%20WRITING%20CITATION.md)
- [RESEARCH FILE TOOLS.md](RESEARCH%20FILE%20TOOLS.md)
