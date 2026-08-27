# File Interoperability Engine

**Status:** LOCKED P1 interoperability contract — documented, not implemented

## Purpose

File Interoperability Engine maps canonical research objects and normalized file representations to/from external file standards without leaking provider-specific shapes into Research Core or promising unsupported fidelity.

## Domains

- References: RIS, BibTeX, CSL JSON, EndNote XML; DOI metadata export through verified source.
- Data: CSV/XLSX/TSV/JSON; future SAV/DTA/RDS/Parquet capabilities.
- Documents: DOCX/Markdown/HTML/LaTeX/ODT/EPUB and structured AcademicDocument where verified.
- Figures: PNG/JPG/WEBP/TIFF, size/DPI/publication profile.
- PDF actions: merge/split/compress/pages/text/metadata/references/tables/figures/OCR fallback.

## Capability record

Each source→target/action declares capability id/version, canonical owner, provider(s), execution modes, fidelity/round-trip expectations, field/feature mappings, limits, privacy and security class, license decision, validation fixtures/results/date, status `PROPOSED/VERIFIED/REQUIRES TESTING`, and fallback/export behavior.

## Normalization boundary

Inbound data becomes a typed candidate plus original raw representation and field-level provenance. Owning domain validates/approves creation: Literature owns `ResearchReference`, Dataset owns `DatasetVersion`, Writing owns `AcademicDocument`, File Tools owns `FileAsset`/job only. Outbound conversion reads a pinned canonical version and creates a new output asset; it never changes canonical content.

## Fidelity and failure

Unsupported fields/features are recorded, never silently dropped. Round-trip loss, style/layout variation, formula/macro/object omission, encoding issue, or converter disagreement produces fidelity warnings and preview. User can download clearly marked partial output only when policy permits; it cannot be auto-imported as authoritative.

## Provider independence

Provider-specific adapters sit behind Conversion Gateway and capability registry. LibreOffice WASM, Gotenberg, Pandoc, and internal converters may be replaced without product-layer change. Frontend does not call them directly.

## Related documents

- [Research File Tools](../architecture/RESEARCH%20FILE%20TOOLS.md)
- [Reference Extraction Engine](./REFERENCE%20EXTRACTION%20ENGINE.md)
- [File Asset Model](../database/FILE%20ASSET%20MODEL.md)
