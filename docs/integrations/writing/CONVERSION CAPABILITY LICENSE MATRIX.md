# Conversion Capability & License Matrix

**Status:** LOCKED P1 decision gate — evidence snapshot 2026-08-26, documented and not implemented

**Legal posture:** architecture and engineering evidence only; not legal advice and not production approval

## Purpose

This matrix separates architectural priority, candidate implementation order, capability evidence, conversion readiness, and license clearance for the Research File & Conversion Engine. A repository being public or using an open-source license does not by itself approve its binaries, containers, dependencies, fonts, codecs, templates, or modified distribution for MetodePenelitian.com.

## Locked architecture decision

Research File & Conversion Engine remains **P1**. Candidate order inside P1 is:

1. **LibreOffice WASM/ZetaJS** for private browser conversion.
2. **Gotenberg** for server-isolated Office/PDF conversion.
3. **Internal Engines** for reference, data, and research-specific conversion.
4. **Hushvert/libre-convert** as modular/browser references.
5. **Stirling PDF** as a PDF-specialist candidate after boundary and license audit.
6. **ConvertX** as a capability benchmark only.

This order is an investigation/implementation sequence, not a promotion of Conversion Engine to P0 and not an approval to install, copy, embed, deploy, or expose any candidate.

Pandoc remains a separately evaluated structured-document component behind the server conversion boundary; it does not replace the ordered lanes above.

## Status vocabulary

| Dimension | Values | Meaning |
|---|---|---|
| Architectural role | `PRIMARY`, `INTERNAL`, `REFERENCE`, `SPECIALIST`, `BENCHMARK`, `COMPONENT` | Intended place in the design; not readiness. |
| Capability evidence | `OFFICIAL-DOC VERIFIED`, `PARTIAL`, `UNKNOWN` | Whether the described capability is supported by current first-party material. |
| Conversion readiness | `PROPOSED`, `REQUIRES TESTING`, `VERIFIED` | Exact engine/version/format/action readiness under the internal registry. |
| License evidence | `TOP-LEVEL VERIFIED`, `PARTIAL`, `UNKNOWN` | Scope of license evidence collected; never implies the whole dependency stack is cleared. |
| Production decision | `BLOCKED`, `PILOT-ELIGIBLE`, `APPROVED` | Deployment decision after all gates. Every candidate is currently `BLOCKED`. |

## Executive decision matrix

| Candidate | Role / execution | Capability evidence | License evidence | Principal unresolved exposure | Current decision |
|---|---|---|---|---|---|
| LibreOffice WASM through ZetaJS + `document-converter` | `PRIMARY` / `LOCAL_BROWSER` | `OFFICIAL-DOC VERIFIED`: browser-local LibreOffice conversion; wrapper documents Office/OpenDocument/text inputs and PDF/Office/text/image outputs. Each pair still needs a fixture test. | `TOP-LEVEL VERIFIED`: ZetaJS MIT; `document-converter` reports MIT. LibreOffice/ZetaOffice WASM artifacts and all transitive packages are not yet cleared. | Exact artifact/version, SBOM, redistribution/notices, same-origin hosting, network egress, COOP/COEP, browser memory and fidelity. | `BLOCKED — REQUIRES TESTING` |
| Gotenberg | `PRIMARY` / `SERVER_ISOLATED` or `ASYNC_WORKER` | `OFFICIAL-DOC VERIFIED`: Docker API combining Chromium, LibreOffice and PDF engines; documented Office/HTML/Markdown-to-PDF and PDF operations depend on selected modules/version. | `TOP-LEVEL VERIFIED`: repository MIT. Container contents, LibreOffice/Chromium/PDF engines, fonts and other transitive artifacts remain uncleared. | Pinned image/digest, complete SBOM, container hardening, no-egress enforcement, resource isolation, format/action fidelity and operational ownership. | `BLOCKED — REQUIRES TESTING` |
| Internal Engines | `INTERNAL` / local or isolated by capability | `PARTIAL`: architecture defines reference/data/research operations; implementation and format coverage are not asserted. | `UNKNOWN BY COMPONENT`: first-party code can be owned internally, but every parser, serializer and binary dependency requires its own record. | Exact component design, third-party dependency inventory, security tests, provenance-preserving normalization and format fixtures. | `BLOCKED — PROPOSED` |
| Hushvert Engine | `REFERENCE` / modular `LOCAL_BROWSER` | `OFFICIAL-DOC VERIFIED`: local image/data/PDF and limited document-preview capabilities; its own documentation excludes browser-local Office-to-PDF, PDF-to-Word and large-video operations. | `PARTIAL`: top-level MIT; documented optional modules include GPL-2.0-or-later FFmpeg core and LGPL-3.0 HEIC dependency. | Per-module build graph, whether copyleft modules are enabled/shipped, notices/source obligations, security/fidelity and product-fit boundary. | `BLOCKED — REFERENCE ONLY` |
| libre-convert | `REFERENCE` / `LOCAL_BROWSER` | `OFFICIAL-DOC VERIFIED`: browser LibreOffice WASM conversion from listed Word/Excel/PowerPoint/image formats to PDF; requires cross-origin isolation and HTTPS. | `UNKNOWN`: no root `LICENSE` was confirmed from the official repository snapshot reviewed. Absence of a confirmed license blocks copying or reuse. | License/provenance, exact WASM artifacts, dependency SBOM, COOP/COEP/service-worker behavior, privacy and fidelity. | `BLOCKED — REFERENCE ONLY` |
| Stirling PDF | `SPECIALIST` / isolated server candidate | `OFFICIAL-DOC VERIFIED`: self-hosted PDF application/API with conversion, OCR, merge/split, compression, redaction, signing and automation capabilities. | `PARTIAL`: root license applies MIT outside explicitly carved-out directories; those directories use their own licenses. It is an open-core tree, not a uniform MIT codebase. | Exact source/image contents, excluded-directory boundary, feature-to-license mapping, commercial terms, SBOM, security isolation and PDF-quality tests. | `BLOCKED — AUDIT AFTER PRIMARY LANES` |
| ConvertX | `BENCHMARK` / no product integration approved | `OFFICIAL-DOC VERIFIED`: self-hosted converter advertising 1,000+ formats through multiple engines. | `TOP-LEVEL VERIFIED`: AGPL-3.0. Bundled engines add their own obligations and must be inventoried separately. | Strong-copyleft/network-use obligations, combined-work analysis, container/dependency SBOM, undocumented/internal interface risk. | `BLOCKED — BENCHMARK ONLY; DO NOT COPY` |
| Pandoc | `COMPONENT` / `SERVER_ISOLATED` or `ASYNC_WORKER` | `OFFICIAL-DOC VERIFIED`: structured-document conversion across many markup and document formats; exact readers/writers and fidelity remain version/fixture dependent. | `PARTIAL`: Pandoc is GPL-2.0-or-later; its copyright file identifies separately licensed components/templates. | Distribution/embedding boundary, templates/filters, TeX toolchain, executable extension isolation, dependency SBOM and round-trip loss. | `BLOCKED — REQUIRES TESTING` |

`TOP-LEVEL VERIFIED` means only that the named repository's top-level license evidence was located. It is deliberately narrower than commercial approval, redistribution approval, SaaS approval, or dependency-stack clearance.

## Capability coverage matrix

Legend: `CANDIDATE` means documented upstream capability still requiring exact version/format tests; `NATIVE` means intended first-party domain ownership; `REFERENCE` means useful architectural evidence but not selected; `—` means outside the intended role.

| Capability group | LibreOffice WASM | Gotenberg | Internal Engines | Hushvert | libre-convert | Stirling PDF | ConvertX | Pandoc |
|---|---|---|---|---|---|---|---|---|
| Private browser Office conversion | `CANDIDATE` | — | — | Explicit upstream gap for Office→PDF | `REFERENCE` | — | — | — |
| Server Office→PDF | — | `CANDIDATE` | — | — | — | `REFERENCE` | `BENCHMARK` | Layout fidelity not primary role |
| HTML/Markdown→PDF | Limited/pair-specific | `CANDIDATE` | — | — | — | `REFERENCE` | `BENCHMARK` | `CANDIDATE` with toolchain |
| Semantic DOCX/Markdown/HTML/LaTeX interchange | Pair-specific | — | Research normalization `NATIVE` | DOCX preview only | — | — | `BENCHMARK` | `CANDIDATE` |
| PDF merge/split/rotate/flatten | — | `CANDIDATE` | Provenance wrapper `NATIVE` | `REFERENCE` subset | — | `CANDIDATE` | `BENCHMARK` | — |
| OCR/compress/redact/sign/automation | — | Module/action dependent | Provenance wrapper `NATIVE` | Limited/reference | — | `CANDIDATE` | `BENCHMARK` | — |
| RIS/BibTeX/CSL JSON/EndNote normalization | — | — | `NATIVE` | — | — | — | Format benchmark only | Citation pipeline component only |
| CSV/XLSX/TSV/JSON research normalization | Generic file conversion only | — | `NATIVE` | `REFERENCE` | XLS/XLSX/CSV→PDF only | — | `BENCHMARK` | Table interchange only |
| Academic references/tables/figures extraction | — | — | `NATIVE` | — | — | PDF extraction reference | — | Structured-document aid only |
| ResearchProject import and RDT linkage | — | — | `NATIVE` | — | — | — | — | — |

No upstream engine owns ResearchProject, RDT, canonical references, datasets, provenance, authorization, consent, or publication state. Those remain internal domain responsibilities regardless of conversion route.

## Mandatory dependency and license record

Before a candidate can move from `BLOCKED`, the owner must record:

| Required field | Acceptance rule |
|---|---|
| Exact artifact | Repository, package/image name, pinned version and immutable commit/image digest. |
| Integrity | Published origin plus checksum/signature verification strategy. |
| License scope | Root license and every directory/package/binary exception that enters the shipped or hosted path. |
| Complete dependency inventory | Generated SBOM covering direct/transitive code, WASM/data blobs, system packages, fonts, codecs, templates, filters and container layers. |
| Usage topology | Browser delivery, unmodified executable, modified executable, linked/embedded library, sidecar service, container and SaaS/network interaction recorded separately. |
| Obligations | Notices, attribution, source availability/disclosure, relinking/replacement, modification publication, trademark and commercial restrictions reviewed by counsel. |
| Feature mapping | Exact product capability mapped to exact files/modules so excluded/proprietary or copyleft modules cannot enter accidentally. |
| Security maintenance | Upstream release cadence, vulnerability reporting, patch owner, supported version window and rollback process. |
| Decision evidence | Reviewer, legal/security owner, date, evidence links, allowed deployment shapes, restrictions and expiry/re-review trigger. |

Architecture review cannot convert `UNKNOWN` into an assumed permission. If a usable license cannot be confirmed, the candidate remains reference-only and its code/artifacts are not copied.

## Required technical proof before exact-stack selection

### 1. Supported-format and fidelity benchmark

Use a versioned academic corpus containing at minimum: a long Indonesian thesis, multilingual manuscript, DOCX with heading/footnote/cross-reference styles, equations, citations and bibliography, wide/merged tables, vector/raster figures, tracked changes/comments, embedded fonts, XLSX with formulas/charts, PPTX with notes, malformed input and password-protected input.

For every source/action/output tuple record:

- exact engine/version/configuration and cold/warm run;
- success, explicit unsupported outcome, crash, timeout or partial output;
- page/section/style, citation, equation, table, figure, font and metadata differences;
- output MIME, checksum, page count, warnings and reproducible fixture ID;
- human reviewer decision for semantic correctness and visual fidelity.

A marketing-level list such as “supports Office” never becomes a wildcard capability. Only passing tuples enter the registry as `VERIFIED`.

### 2. Browser memory and compatibility benchmark

Measure cold-load bytes/time, peak heap/WASM memory, conversion time, output size, crash/recovery and repeated-job cleanup on the supported browser/device matrix. Test small, median and maximum accepted academic files; foreground/background behavior; mobile constraints; low-memory failure; cancellation; and concurrent tabs.

The pilot must prove required `SharedArrayBuffer`/worker behavior under the real application shell and deployment headers. It must also test the effect of COOP/COEP on authentication popups, embedded content, analytics, third-party scripts, previews and other same-origin resources.

### 3. Same-origin WASM hosting and privacy proof

The preferred pilot hosts pinned WASM, data blobs, JavaScript and worker assets on an approved same-origin origin. Record all browser requests during load and conversion with telemetry disabled. Test with network blocked after initial asset load and assert:

- no document bytes, filenames, extracted content or outputs leave the device;
- no runtime dependency is fetched from an unapproved CDN;
- caching, service workers, IndexedDB, crash reporting and object URLs do not retain content beyond policy;
- server fallback is impossible without an explicit user-visible disclosure and consent path.

“Client-side” is a claim to be proven by an automated network-egress test, not inferred from UI location.

### 4. Gotenberg isolation and security proof

Run a pinned image behind the internal Conversion Gateway with no public endpoint, default-deny egress, non-root/read-only runtime where feasible, tenant/job-separated temporary directories, CPU/memory/process/time limits, bounded upload/output size, malware and MIME gates, explicit macro/external-resource policy, content-free logs, automatic cleanup, health/circuit controls and vulnerability/SBOM scanning.

Tests must demonstrate cross-job data isolation, denial of external URL fetches unless explicitly allowlisted, cleanup after success/failure/kill, decompression/resource-exhaustion resistance, safe handling of malformed/password-protected files, and no direct access to ResearchProject storage.

### 5. Internal research-conversion proof

Reference/data/document outputs must pass their owning domain validators and preserve source asset, source coordinates where available, transformation version, warnings and review state. Citation identifiers and numerical research values cannot be fabricated to make conversion succeed. Import remains previewable and authorized; conversion alone cannot mutate canonical research state.

## Selection gate

The first implementation stack may be selected only when all of the following exist:

- completed artifact/dependency/license records for the exact proposed versions;
- legal decision for the exact browser/server distribution topology;
- supported-format registry backed by the academic fixture corpus;
- browser memory/fidelity, COOP/COEP and same-origin hosting results for the local candidate;
- isolation, no-egress, cleanup, capacity and security results for the server candidate;
- documented failure/fallback UX with no silent upload or silent fidelity downgrade;
- named operational owner, update/rollback plan and evidence retention location.

Passing one candidate does not approve another candidate, another version, another format pair, or another deployment topology.

## Official evidence register

Evidence was reviewed on 2026-08-26. These links establish upstream claims only; they do not replace local tests or legal review.

| Candidate | First-party evidence used | What it supports |
|---|---|---|
| `document-converter` | [Official repository](https://github.com/erseco/document-converter) | ZetaJS/LibreOffice WASM browser architecture, documented formats, hosting approaches, COOP/COEP mechanics and reported MIT license. |
| ZetaJS | [Official repository](https://github.com/allotropia/zetajs), [MIT license](https://raw.githubusercontent.com/allotropia/zetajs/main/LICENSE) | LibreOffice browser bridge and ZetaJS top-level license. |
| Gotenberg | [Official repository](https://github.com/gotenberg/gotenberg), [configuration documentation](https://gotenberg.dev/docs/configuration) | Docker API architecture, top-level MIT license, modules and configurable PDF operations. |
| Hushvert | [Official repository](https://github.com/hushvert/engine) | Browser-local capability boundary, MIT root license and disclosed optional GPL/LGPL modules. |
| libre-convert | [Official repository](https://github.com/Rhgx/libre-convert) | Listed browser input formats, PDF output, SharedArrayBuffer/COOP/COEP and HTTPS requirements; no license clearance inferred. |
| Stirling PDF | [Official repository](https://github.com/Stirling-Tools/Stirling-PDF), [root license](https://github.com/Stirling-Tools/Stirling-PDF/blob/main/LICENSE) | PDF capabilities, open-core posture and directory-specific license carve-outs. |
| ConvertX | [Official repository](https://github.com/C4illin/ConvertX) | 1,000+ format benchmark claim, included converter families and AGPL-3.0 top-level license. |
| Pandoc | [Official repository](https://github.com/jgm/pandoc), [copyright/license inventory](https://github.com/jgm/pandoc/blob/main/COPYRIGHT) | Structured conversion scope, GPL-2.0-or-later core and separately licensed components/templates. |

## Related documents

- [Research File & Conversion Engine](../../architecture/RESEARCH%20FILE%20TOOLS.md)
- [File Conversion Engine](../../internal-engines/FILE%20CONVERSION%20ENGINE.md)
- [LibreOffice WASM candidate](./LIBREOFFICE%20WASM.md)
- [Gotenberg candidate](./GOTENBERG.md)
- [Pandoc candidate](./PANDOC.md)
- [Master Integration Map](../../MASTER%20INTEGRATION%20MAP.md)
