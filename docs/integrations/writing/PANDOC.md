# Pandoc Academic Conversion Candidate

**Conversion readiness:** `PROPOSED` / `REQUIRES TESTING` — not production-approved, not installed

**Integration-map verification status:** `PARTIALLY VERIFIED` — official capability and GPL-2.0-or-later evidence found; exact version/toolchain/dependency topology remains uncleared

## Purpose

Evaluate Pandoc as a replaceable structured academic-document conversion provider behind Conversion Gateway, especially where semantic structure matters more than pixel-identical layout.

## Proposed capability scope

Candidate conversions among DOCX, Markdown, HTML, LaTeX, ODT, EPUB, and other explicitly verified structured formats. Potential uses include DOCX→Markdown/LaTeX, Markdown→DOCX, and LaTeX→DOCX/PDF where the approved toolchain and fixtures demonstrate acceptable fidelity. Listing does not assert support or production readiness.

## Architecture boundary

`PandocProvider` accepts normalized conversion requests and pinned templates/options from the gateway in `SERVER_ISOLATED` or `ASYNC_WORKER` mode. It cannot access ResearchProject directly, interpret research truth, or write canonical AcademicDocument/Reference records. Parsing/import flows preview normalized output before owning-domain approval.

## Fidelity/security review

Test citations/bibliographies, CSL behavior, equations, tables/figures, footnotes, cross-references, styles, metadata, multilingual content, embedded resources, raw blocks, filters/extensions, and round-trip loss. Disable or strictly allowlist executable filters/shell/network access; sandbox files, bound resources, validate output, and clean temporary workspaces.

## License gate

Before embed/server use, verify exact binary/package/source/version, license and dependency licenses, commercial use, distribution/bundling/source-disclosure/notices, template/filter licenses, server-side implications, security maintenance, and legal decision. Architecture does not approve embedding before review.

## Failure/fallback

Unsupported feature, lossy mapping, missing toolchain/font/template, parse error, or partial output produces explicit fidelity warnings/errors. Fallback cannot silently change requested semantic/layout expectations.

## Related documents

- [Academic Document Import Workflow](../../workflows/ACADEMIC%20DOCUMENT%20IMPORT%20WORKFLOW.md)
- [File Interoperability Engine](../../internal-engines/FILE%20INTEROPERABILITY%20ENGINE.md)
- [Conversion Capability & License Matrix](./CONVERSION%20CAPABILITY%20LICENSE%20MATRIX.md)
