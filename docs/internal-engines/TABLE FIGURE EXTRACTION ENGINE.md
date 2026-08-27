# Table & Figure Extraction Engine

**Status:** P1 capability contract — documented, not implemented

## Purpose

Table & Figure Extraction Engine detects and extracts academic tables, figures, captions, notes, and source coordinates from validated documents for review, reuse, or RDT/document linkage. It does not infer missing research values or claim OCR/extraction is universally accurate.

## Capability roadmap

- Structured-document table and embedded-image extraction.
- PDF table/figure region detection and page-coordinate preservation.
- Caption/number/note association and section/document context.
- Table normalization to cells/headers/spans with fidelity warnings.
- Figure extraction to immutable image assets with original resolution/color metadata.
- OCR fallback for scanned text/tables as an async, separately verified capability.
- Publication-ready resize/DPI/format export through verified figure capabilities.

## Provenance

Every extracted artifact records input asset/checksum, page/section/coordinate, extraction engine/version/mode, original and normalized asset ids, caption/note, confidence, fidelity/structural warnings, OCR use, checksum, reviewer decision, and downstream RDT/document link. Extracted numerical cells are source content, not validated AnalysisResults until explicitly reconciled.

## Review and safety

Users preview table structure, figure crop, captions, and warnings before import. Low confidence, lost merged cells, unreadable image, inconsistent caption, OCR uncertainty, or partial extraction cannot silently pass. Processing is sandboxed; embedded content remains inert; temporary assets expire unless saved.

## Related documents

- [Document Parsing Engine](./DOCUMENT%20PARSING%20ENGINE.md)
- [Academic Document Import Workflow](../workflows/ACADEMIC%20DOCUMENT%20IMPORT%20WORKFLOW.md)
- [Result Provenance Engine](./RESULT%20PROVENANCE%20ENGINE.md)

