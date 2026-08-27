# Research File & Conversion Engine

**Status:** LOCKED P1 architectural contract — documented, not implemented

## Purpose

Research File & Conversion Engine lets an authorized researcher upload, inspect, convert, extract, normalize, import, or download academic files without coupling the product to one conversion provider. It is research-scoped—not a generic media converter—and extends the locked ResearchProject, Research Digital Twin (RDT), Integration Gateway, background jobs, Data-to-Document pipeline, and Publication Gateway contracts.

## Canonical architecture

```text
USER FILE
→ FILE CLASSIFIER
→ SECURITY VALIDATION
→ FORMAT ROUTER
→ ┌──────────────────────────────┐
  │ LOCAL BROWSER PROCESSING     │
  │ SERVER PROCESSING            │
  │ RESEARCH-SPECIFIC PROCESSING │
  └──────────────────────────────┘
→ NORMALIZED OUTPUT
→ RESEARCH PROJECT / DOWNLOAD
```

Canonical acceptance trace: `FILE → VALIDATION → ROUTING → CONVERSION → NORMALIZATION → PROJECT/DOWNLOAD`.

## Format Router

Format Router selects an eligible, healthy capability/provider using source format, destination format/action, file size, privacy classification, browser capability, server requirement, conversion complexity/fidelity, async threshold, license approval, and capability status. It returns a route and rationale; it never silently downgrades privacy or fidelity.

Execution modes:

- `LOCAL_BROWSER`: preferred when an approved browser engine supports the pair and resource limits; sensitive bytes stay on-device.
- `SERVER_ISOLATED`: sandboxed, network-restricted server conversion for complex/unsupported browser operations.
- `ASYNC_WORKER`: queued isolated execution for OCR, large PDF/Office files, table/figure extraction, batch work, and long document parsing.

Examples: small privacy-sensitive DOCX→PDF routes locally when verified; complex DOCX→PDF routes server-isolated; large OCR/extraction routes async.

## Provider abstraction

`ConversionProvider` defines conceptual `supports()`, `validate()`, `convert()`, `getCapabilities()`, and `healthCheck()` operations. Candidate providers include `LibreOfficeWasmProvider`, `GotenbergProvider`, `PandocProvider`, `InternalReferenceProvider`, and `InternalDataProvider`. Product/domain layers depend only on the gateway/registry, so providers can be replaced without changing product behavior.

Provider/capability status is `PROPOSED`, `VERIFIED`, or `REQUIRES TESTING`. A provider is not production-approved until security, fidelity, operations, and license reviews pass.

## Processing lanes

### Local browser

Architecture may support DOCX, XLSX, PPTX, ODT, ODS, ODP, RTF, TXT, and PDF output through an approved browser/WASM engine. Each format pair must be tested; listing is not an availability claim. Local mode minimizes server disclosure but still validates inputs, checks resource limits, verifies output, and records auditable metadata without uploading content unnecessarily.

### Server and async

Gotenberg is a proposed candidate behind the internal Conversion Gateway for Office/HTML/Markdown→PDF, PDF merge/split/rotate/flatten, PDF/A if verified, and complex conversion. Pandoc is proposed for structured DOCX/Markdown/HTML/LaTeX/ODT/EPUB conversion. Frontend never calls either directly. Heavy work uses queue/worker, scoped temporary storage, time/resource limits, retry policy, cleanup, and job status.

### Research-specific processing

- References: RIS↔BibTeX, RIS↔CSL JSON, BibTeX↔CSL JSON, EndNote XML, DOI→RIS/BibTeX (through verified DOI metadata, not fabricated).
- Data: CSV↔XLSX/TSV/JSON, XLSX↔JSON; SAV/DTA/RDS/Parquet are future capability candidates.
- Documents: DOCX→structured research document/Markdown/LaTeX; Markdown→DOCX; LaTeX→DOCX/PDF when verified feasible.
- Figures: PNG/JPG/WEBP/TIFF, resize, DPI conversion, publication-ready export with no AI-created research values.
- PDF: merge, split, compress, extract pages/text/metadata/references/tables/figures, with OCR fallback as a heavy optional capability.

## Academic intelligence

For `thesis.docx`, capability roadmap includes academic-document detection, title/abstract/chapter extraction, table/figure detection, citation/bibliography extraction, project import, reference export to RIS/BibTeX, and journal-manuscript preparation. Document Parsing and extraction engines produce reviewable normalized artifacts with source coordinates/provenance; they do not claim every action implemented.

Canonical academic actions are: `Detect academic document`, `Extract title`, `Extract abstract`, `Detect chapters`, `Extract References`, `Extract Tables`, `Extract Figures`, `Import to Research Project`, `Convert references to RIS/BibTeX`, and `Prepare journal manuscript`. Availability remains capability-status driven.

## Security and privacy

Mandatory controls: MIME validation, extension mismatch detection, file-size limits, malware scanning, sandboxed processing, signed URLs, temporary storage, automatic cleanup, encryption at rest/in transit, private-by-default project/tenant access, no public file URLs, audit logs, checksums, and consent/retention enforcement. Academic files are not sent automatically to external AI providers.

Privacy-first routing defaults to local processing when reasonable. Server use requires format/browser/size/advanced-processing need and explicit route disclosure. Outputs inherit source privacy and never become public by conversion.

## Async/failure strategy

Heavy operations run through queued `ConversionJob`s with idempotency, progress, cancellation policy, timeouts, bounded retries, provider health/circuit breaking, approved fallback, and automatic expiry/cleanup. Timeout, unsupported/corrupt/password-protected input, partial conversion, and fidelity warning are explicit outcomes; no silent failure or silent partial success.

## License governance

Every engine/provider record carries license identity/version, commercial-use status, distribution/source-disclosure obligations, server/browser implications, audit owner/date/evidence, decision, and restrictions. LibreOffice WASM, Gotenberg, and Pandoc remain `PROPOSED`/`REQUIRES TESTING` and not production-approved before legal/security/license review. No third-party repository/code is copied by this architecture.

The locked P1 candidate order is LibreOffice WASM/ZetaJS → Gotenberg → Internal Engines → Hushvert/libre-convert references → Stirling PDF after boundary/license audit → ConvertX as benchmark only. This is an implementation-investigation sequence inside P1, not an architectural-priority promotion and not a production approval. The [Conversion Capability & License Matrix](../integrations/writing/CONVERSION%20CAPABILITY%20LICENSE%20MATRIX.md) is the authoritative decision gate for exact artifacts, capabilities, license evidence, required benchmarks, and current blocks.

## UX contract

```text
Upload → Detect → Choose Action → Convert / Extract / Import
→ Preview → Save to Project / Download
```

Available actions are registry-backed for the exact file/action and status. A detected thesis may show only verified actions among Convert PDF/LaTeX, Extract References/Tables/Figures, Import Project, or Prepare Journal Manuscript.

## Locked invariants

- Original `FileAsset` bytes/checksum are immutable; outputs are new assets.
- Conversion never mutates canonical research state without preview and authorized import.
- Normalized references/datasets/documents pass their owning domain validators before RDT linkage.
- Frontend does not call providers directly; providers do not own canonical assets/models.
- Capability/support/license status is truthful and inspectable.
- Conversion/download does not equal publication or external submission.

Institutional/journal formatting is resolved and compiled by Writing & Citation before an approved export capability is requested. Conversion Engine renders or converts the pinned render profile; it does not interpret guidelines, choose SINTA-based templates, resolve policy conflicts, or mutate canonical content.

## Related documents

- [Legacy Research File Tools capability baseline](./20%20RESEARCH%20FILE%20TOOLS.md)
- [File Conversion Engine](../internal-engines/FILE%20CONVERSION%20ENGINE.md)
- [File Asset Model](../database/FILE%20ASSET%20MODEL.md)
- [Conversion Job Model](../database/CONVERSION%20JOB%20MODEL.md)
- [Data-to-Document Pipeline](./DATA%20ANALYSIS%20INTERPRETATION%20DOCUMENT%20PIPELINE.md)
- [Conversion Capability & License Matrix](../integrations/writing/CONVERSION%20CAPABILITY%20LICENSE%20MATRIX.md)
- [Institutional & Publication Formatting Architecture](./INSTITUTIONAL%20PUBLICATION%20FORMATTING.md)
