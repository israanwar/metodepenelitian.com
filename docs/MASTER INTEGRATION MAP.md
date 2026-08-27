# MASTER INTEGRATION MAP

## Purpose
This document is the single index of every external system MetodePenelitian.com's Research OS connects to, organized by category, with a pointer to where each category's detailed, per-provider documentation lives. It exists so that anyone touching integration work — architecture review, security review, or planning a new connector — can find the current connection status of the entire external ecosystem from one page instead of searching through sixteen category folders.

## Scope
Covers every category folder under `docs/integrations/`: scholarly-data, indexes-journals, identity, reference-managers, writing, quantitative, qualitative, surveys, systematic-review, research-ai, academic-ai, repositories, submission, integrity, storage, transcription. For each category it states what kind of external system the category covers and what problem it solves for a researcher inside a ResearchProject. It does not itself document individual providers — that detail belongs in each category's own files, standardized by [docs/integrations/00 MASTER INTEGRATION MAP.md](integrations/00%20MASTER%20INTEGRATION%20MAP.md).

## Responsibilities
- Enumerate all sixteen integration categories and give each a short, accurate description of its purpose inside the Research OS.
- Define the verification-status vocabulary that every child integration document must use when describing a provider's real connectivity.
- Describe the Integration Gateway pattern that all categories must implement through, so no category document has to re-explain the pattern.
- Point readers to the category-standard document and to the two architecture documents that govern how integrations are built and secured.

## Non-Responsibilities
- Does not list individual provider names, API endpoints, rate limits, or credentials — those live in each category's own files under `docs/integrations/<category>/`.
- Does not define the internal ResearchReference canonical model — that belongs to the scholarly-data normalization design, not this index.
- Does not decide which providers get built first — sequencing is a product/roadmap decision recorded elsewhere, not in this map.
- Does not describe the Multi-Model AI Gateway's model-routing logic — that is AI infrastructure, not third-party integration, and lives under `docs/ai/`.

## Core Components

**Integration Gateway pattern (applies to every category listed below).** Every external connection in the Research OS is required to pass through four layers, in this order:

1. **Application Service** — a Research Core service (e.g. Literature Service, Analysis Advisor) that needs external data or action. It never knows which provider it's talking to.
2. **Integration Gateway** — the single internal chokepoint all outbound third-party calls pass through. It handles routing to the correct provider adapter, credential management, rate limiting, retry/backoff, and normalization of responses into internal canonical shapes before returning them to the Application Service.
3. **Provider Interface** — a category-specific internal contract (e.g. "ScholarlyDataProvider", "IdentityProvider") that every adapter in that category must implement. This is what lets the Research OS swap or add providers without touching Research Core.
4. **Provider Adapter** — the only layer allowed to know a specific provider's API shape, auth scheme, quirks, and pagination. Provider-specific detail is fully contained here and never leaks upward, per baseline contract #12.

This pattern is defined authoritatively in [25 INTEGRATION GATEWAY.md](architecture/25%20INTEGRATION%20GATEWAY.md); provider inventory and per-provider risk posture is defined in [26 EXTERNAL PROVIDERS.md](architecture/26%20EXTERNAL%20PROVIDERS.md). Every category document under `docs/integrations/` must reference both.

**Verification-status vocabulary.** Every provider entry in every category document must be tagged with exactly one of the following statuses, and must not invent capabilities beyond what the status justifies:

| Status | Meaning |
|---|---|
| VERIFIED | Public API/documentation confirms the integration shape described; behavior has been checked against current provider documentation. |
| PARTIALLY VERIFIED | Some aspects (e.g. auth flow) are confirmed; other aspects (e.g. rate limits, specific field coverage) are not yet confirmed. |
| REQUIRES ACCESS | The provider's real capability can only be confirmed after obtaining a developer account, API key, or sandbox access; current description is best-effort from public documentation only. |
| REQUIRES PARTNERSHIP | The integration depends on a formal partnership, licensing agreement, or institutional relationship (e.g. Scopus, most indexing/abstracting databases) that does not exist yet and is not assumed to exist. |
| INTEROPERABILITY ONLY | The Research OS can export/format data compatible with the provider (e.g. a standard citation or metadata format) but has no direct API relationship with it. |
| REFERENCE ONLY | The provider is documented for context (e.g. a competitor tool, a format standard) but is not planned as a live integration. |
| UNKNOWN | Confidence is insufficient to assign any of the above; this must be stated explicitly rather than guessed. |

**Conversion-engine readiness (separate dimension).** Research File Tools additionally uses `PROPOSED`, `VERIFIED`, and `REQUIRES TESTING` for a specific engine/version/format/action's internal readiness. This does not replace the integration verification vocabulary above. A candidate may therefore be integration status `UNKNOWN` while conversion readiness is `PROPOSED/REQUIRES TESTING`. Production use requires both an eligible integration status and `VERIFIED` conversion readiness, including security, fidelity, operations, and license review.

Writing conversion candidates are documented in [LibreOffice WASM](integrations/writing/LIBREOFFICE%20WASM.md), [Gotenberg](integrations/writing/GOTENBERG.md), and [Pandoc](integrations/writing/PANDOC.md). Their locked role/order, capability evidence, license scope, blocks, and exact-stack selection gates are centralized in the [Conversion Capability & License Matrix](integrations/writing/CONVERSION%20CAPABILITY%20LICENSE%20MATRIX.md). They remain adapters behind the internal Conversion Gateway, never direct frontend integrations; no installation, API capability, whole-stack license approval, or production availability is implied.

**The sixteen integration categories:**

| Category folder | Covers |
|---|---|
| `scholarly-data` | Bibliographic and citation-graph data sources (article metadata, abstracts, citation counts, author disambiguation) used to populate ResearchReference records. |
| `indexes-journals` | Journal-level and index-level metadata: journal indexing status, accreditation/ranking signals (e.g. SINTA-style national indices), journal scope and quality indicators. |
| `identity` | Researcher and institutional identity systems (e.g. ORCID-style persistent identifiers) used for author disambiguation and profile linking. |
| `reference-managers` | Interoperability with citation/reference management tools researchers already use, for import/export of reference libraries. |
| `writing` | Word-processing and document-authoring tool interoperability for manuscript drafting and formatting. |
| `quantitative` | Statistical analysis tool interoperability supporting the Analysis Advisor engine's quantitative workflows. |
| `qualitative` | Qualitative data analysis (QDA) tool interoperability supporting coding, thematic analysis, and qualitative workflows. |
| `surveys` | Survey and data-collection platform interoperability for instrument design and response data ingestion. |
| `systematic-review` | Systematic review and evidence-synthesis tool interoperability (screening, PRISMA-style workflows) supporting the Evidence Synthesis engine. |
| `research-ai` | General-purpose AI research-assistance tools evaluated for interoperability or comparison, distinct from the Research OS's own Multi-Model AI Gateway. |
| `academic-ai` | Academic-specific AI tools (writing assistance, literature assistance) evaluated for interoperability or comparison. |
| `repositories` | Institutional and subject repositories, preprint servers, and archival systems for deposit and retrieval of research outputs. |
| `submission` | Manuscript submission system interoperability, feeding the Publication Gateway's routing to real journals/publishers. |
| `integrity` | Research integrity tooling: plagiarism/similarity checking, AI-content detection, image integrity, and related verification signals. |
| `storage` | Cloud storage and file-hosting interoperability for research data and document storage, distinct from the Research OS's own primary data store. |
| `transcription` | Audio/video transcription tool interoperability supporting qualitative data collection (e.g. interview transcripts). |

Each category folder's own documents (standardized by [00 MASTER INTEGRATION MAP.md](integrations/00%20MASTER%20INTEGRATION%20MAP.md)) list the actual providers considered in that category, each tagged with a verification status from the table above.

## Owned Data
This document owns no runtime data. It owns only the index structure itself (the category list and its descriptions) and the verification-status vocabulary definition, both of which are reference material, not application state.

## Inputs
- The current folder structure under `docs/integrations/` (source of truth for which categories exist).
- Category-standard conventions defined in [00 MASTER INTEGRATION MAP.md](integrations/00%20MASTER%20INTEGRATION%20MAP.md).
- Architectural constraints from [25 INTEGRATION GATEWAY.md](architecture/25%20INTEGRATION%20GATEWAY.md) and [26 EXTERNAL PROVIDERS.md](architecture/26%20EXTERNAL%20PROVIDERS.md).

## Outputs
- A navigable index that every other document referencing "integrations" can link back to.
- The canonical verification-status vocabulary that all sixteen category documents and both integration architecture documents must reuse verbatim, so status claims are comparable across categories.

## Dependencies
- [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) — overall system context this map sits inside.
- [25 INTEGRATION GATEWAY.md](architecture/25%20INTEGRATION%20GATEWAY.md) — defines the gateway pattern this document summarizes.
- [26 EXTERNAL PROVIDERS.md](architecture/26%20EXTERNAL%20PROVIDERS.md) — defines provider inventory and risk posture referenced here.
- [Research File & Conversion Engine](architecture/RESEARCH%20FILE%20TOOLS.md) — P1 format routing, provider abstraction, privacy-first execution, and research normalization contract.
- [Conversion Capability & License Matrix](integrations/writing/CONVERSION%20CAPABILITY%20LICENSE%20MATRIX.md) — P1 candidate order, evidence scope, license/dependency gates, benchmark plan, and exact-stack selection criteria.
- [00 MASTER INTEGRATION MAP.md](integrations/00%20MASTER%20INTEGRATION%20MAP.md) — the category-standard template every category folder's documents must follow.

## Extension Points
- A new integration category is added by creating a new folder under `docs/integrations/`, documenting it against the category-standard template, and adding one row to the category table above — this document is never a place to add individual providers directly.
- The verification-status vocabulary is extended only by amending this document (not silently redefined per-category), so status meaning stays consistent system-wide.
- New categories must state, on creation, which Application Services in Research Core will consume them and which Provider Interface they will implement, consistent with the Integration Gateway pattern.

## Security & Privacy
- This document contains no credentials, endpoints, or access tokens — those belong to configuration/secrets management, never to documentation.
- Per baseline contract #4, no category listed here permits application code to call a provider directly; every category's providers are reachable only via their category's Provider Adapters behind the Integration Gateway.
- Per baseline contract #9, any category whose data ingestion could expose private ResearchProject content externally (e.g. `writing`, `storage`, `submission`) must document, in its own category files, exactly what data leaves the system and under what user consent — this index only flags that the requirement exists.

## Failure Modes
- **Category folder drifts from this index**: a folder is added or renamed under `docs/integrations/` without updating this document, leaving the map stale. Mitigated by treating this file as required reading in any PR that touches `docs/integrations/` structure.
- **Verification status inflated**: a category document claims VERIFIED or REQUIRES PARTNERSHIP capability (e.g. direct Scopus or SINTA submission) that does not exist. Mitigated by the explicit status vocabulary and the hard rule against claiming unverified partnerships or direct-submission capability.
- **Provider detail leaking into this index**: contributors add provider-specific detail directly into this document instead of the category folder, causing duplication and drift. Mitigated by the Non-Responsibilities section and periodic review against Related Documents.

## Observability
Documentation-phase artifact only; no runtime telemetry applies. Once the Integration Gateway is implemented, per-category dashboards (call volume, error rate, and verification-status-to-production-behavior drift per provider) will be specified in `docs/operations/`, not here.

## P0/P1/P2/P3
**P0.** A correct, current index of the external ecosystem and a shared verification-status vocabulary are foundational: without them, every downstream integration document risks inconsistent or inflated claims about provider capability, which directly threatens the "never claim direct-submission capability" and "never claim a partnership exists" requirements that protect the platform's credibility with researchers and institutions.

## Current Status
Documented, not implemented. No category under `docs/integrations/` yet has a live Integration Gateway, Provider Interface, or Provider Adapter in code; this document and its children are architecture-phase reference material only.

## Open Questions
- Should categories with significant overlap in consumer (e.g. `research-ai` and `academic-ai`) eventually be merged, or do they stay separate because their evaluation criteria differ?
- Which categories are P0 for MVP launch versus P2/P3 partnership-dependent — this document intentionally does not sequence that; it should be resolved in a roadmap document and then reflected back into each category's own P0/P1/P2/P3 section.
- Does `storage` overlap with the Research OS's primary data store in a way that needs an explicit boundary statement, or is it strictly external file-hosting interoperability?

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md)
- [00 MASTER INTEGRATION MAP.md](integrations/00%20MASTER%20INTEGRATION%20MAP.md)
- [25 INTEGRATION GATEWAY.md](architecture/25%20INTEGRATION%20GATEWAY.md)
- [26 EXTERNAL PROVIDERS.md](architecture/26%20EXTERNAL%20PROVIDERS.md)
- [Conversion Capability & License Matrix](integrations/writing/CONVERSION%20CAPABILITY%20LICENSE%20MATRIX.md)
