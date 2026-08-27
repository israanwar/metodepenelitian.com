# LibreOffice WASM / Browser Conversion Candidate

**Conversion readiness:** `PROPOSED` / `REQUIRES TESTING` — not production-approved, not installed

**Integration-map verification status:** `PARTIALLY VERIFIED` — upstream capability and top-level MIT evidence found; exact artifact/dependency stack remains uncleared

## Purpose

Evaluate a LibreOffice-compatible WASM/browser engine as a privacy-first local conversion provider so eligible sensitive files can remain on the user's device. This document is an architectural candidate record, not confirmation that a suitable production artifact/API/license exists.

## Proposed capability scope

Candidate inputs include DOCX, XLSX, PPTX, ODT, ODS, ODP, RTF, and TXT, with PDF or verified office/text output pairs. Every pair is independently registered/tested for browser support, fidelity, memory/time limits, mobile compatibility, output validation, and status.

## Adapter boundary

`LibreOfficeWasmProvider` implements the conceptual `ConversionProvider` contract behind the local Format Router. Product UI requests an action from the internal capability layer; it does not bind to WASM-specific APIs. Local output becomes a new FileAsset only after checksum/format/fidelity validation and user save/download/import action.

## Privacy and security review

Confirm that file bytes and intermediate artifacts stay local; CSP/worker isolation, module integrity/signing, memory cleanup, embedded macro/object behavior, malicious-file handling, browser persistence/cache, crash telemetry, supply-chain provenance, and output download safety require verification. Local does not mean automatically safe.

## License gate

The evaluated `document-converter` wrapper reports MIT and ZetaJS has an MIT license. This is top-level evidence only; it does not clear the exact LibreOffice/ZetaOffice WASM artifacts, packages, fonts, data blobs or transitive dependencies. Before approval, record exact distribution/package/source, version, license, commercial-use rights, redistribution/bundling and source-disclosure obligations, notices, dependency licenses, modification policy, and legal decision. Status remains `REQUIRES TESTING` until license, security, performance, accessibility/browser, privacy/no-egress, COOP/COEP, same-origin hosting, and fidelity reviews pass.

## Failure/fallback

Unsupported browser/pair, memory/resource limit, crash, corrupt/password-protected input, or fidelity warning is explicit. Server fallback is offered only after user-visible privacy disclosure and to an approved equal-or-better capability; no automatic upload.

## Related documents

- [Research File Tools](../../architecture/RESEARCH%20FILE%20TOOLS.md)
- [File Conversion Engine](../../internal-engines/FILE%20CONVERSION%20ENGINE.md)
- [Conversion Capability & License Matrix](./CONVERSION%20CAPABILITY%20LICENSE%20MATRIX.md)
