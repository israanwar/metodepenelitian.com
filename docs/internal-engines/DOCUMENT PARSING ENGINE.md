# Document Parsing Engine

**Status:** P1 capability contract — documented, not implemented

## Purpose

Document Parsing Engine converts a validated academic document into a normalized, provenance-bearing structural representation for preview and optional ResearchProject import. It parses; it does not verify academic truth, overwrite a document, or act as a generic OCR service.

## Capability roadmap

Detect academic-document type; extract title/abstract/headings/chapters/sections; detect paragraphs/lists/footnotes; preserve page/paragraph/run coordinates; identify tables/figures/captions; identify citation markers and bibliography blocks; emit style/language/format metadata; prepare import mapping to RDT/document blueprint.

DOCX→structured research document/Markdown/LaTeX and supported PDF/ODT/HTML inputs are capability-registry entries, not availability claims. OCR fallback is separately statused and async.

## Normalized output

`ParsedDocument` pins input asset/checksum, parser/version, capability, execution mode/job, structural tree, text spans with source coordinates, detected academic role/confidence, extraction warnings, unparsed/unsupported regions, and provenance. Low-confidence classifications remain review-required.

## Import boundary

User previews extracted title/abstract/chapters and proposed RDT/AcademicDocument mapping. Import creates new versioned project objects through owning domain services only after approval. Parser never silently replaces canonical sections/citations/results.

## Safety/failure

Untrusted embedded objects/macros/links remain inert; parsing is sandboxed and resource-limited. Password protection, corrupt structure, unsupported feature, partial parsing, coordinate loss, or low fidelity is explicit. Academic content is not sent automatically to AI.

## Related documents

- [Academic Document Import Workflow](../workflows/ACADEMIC%20DOCUMENT%20IMPORT%20WORKFLOW.md)
- [Reference Extraction Engine](./REFERENCE%20EXTRACTION%20ENGINE.md)
- [Table Figure Extraction Engine](./TABLE%20FIGURE%20EXTRACTION%20ENGINE.md)
