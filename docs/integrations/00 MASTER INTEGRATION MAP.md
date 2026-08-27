# Integrations — Master Map

## Purpose
This is the working index for everything under `docs/integrations/`. It enumerates the sixteen provider category subfolders, states what each one covers and which internal Application Service consumes it, and points to the four standard-setting documents (this file plus 01-04) that every per-provider document in every category must follow. It exists so a contributor adding a new provider file knows exactly which folder it belongs in, which template fields are mandatory, and which architectural rules it cannot contradict, without re-deriving any of that from first principles.

## Scope
Covers the category structure of `docs/integrations/` and the relationship between the four standard documents in this folder (01 Provider Capability Matrix, 02 Auth/OAuth/Secret Management, 03 Integration Contract Standard, 04 Fallback/Interoperability Strategy). Does not restate the system-wide integration narrative, the Integration Gateway pattern's internal mechanics, or the verification-status vocabulary definition — those are owned by [../MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) at the docs root, which this file treats as its parent and does not duplicate.

## Responsibilities
- Enumerate all sixteen category subfolders with a one-line description of scope and the primary Application Service or engine each feeds.
- Identify which of the four standard documents (01-04) governs which aspect of any per-provider document, so a contributor writing a new provider file has a single checklist.
- Keep the category list synchronized with the actual folder structure on disk.

## Non-Responsibilities
- Does not redefine the verification-status vocabulary — that is owned once, at [../MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md), and reused verbatim everywhere, including here.
- Does not document individual providers (no provider names beyond illustrative examples) — that is the job of the files inside each category subfolder.
- Does not define the Integration Gateway's internal routing mechanics — that is [../architecture/25 INTEGRATION GATEWAY.md](../architecture/25%20INTEGRATION%20GATEWAY.md).
- Does not decide provider build sequencing — that is a roadmap decision recorded elsewhere.

## Core Components

**The sixteen category subfolders and what each covers:**

| Folder | Covers | Primary internal consumer |
|---|---|---|
| `scholarly-data` | Bibliographic/citation-graph sources (metadata, abstracts, citation counts, author disambiguation) normalized into `ResearchReference` | Literature & Evidence, Evidence Synthesis Engine |
| `indexes-journals` | Journal-level indexing, accreditation, and ranking signals (e.g. SINTA-style national indices, DOAJ-style directories) | Journal Matching Engine, Publication Intelligence |
| `identity` | Researcher/institutional persistent identifiers (e.g. ORCID-style identity systems) for author disambiguation | Platform Core identity layer, Research Graph |
| `reference-managers` | Citation/reference library interoperability (import/export) with tools researchers already use | Reference Managers module |
| `writing` | Word-processing/document-authoring interoperability for manuscript drafting | Writing & Citation |
| `quantitative` | Statistical analysis tool interoperability | Analysis Advisor |
| `qualitative` | Qualitative data analysis (QDA) tool interoperability | Qualitative & Mixed Methods |
| `surveys` | Survey/data-collection platform interoperability | Dataset Analysis, Qualitative & Mixed Methods |
| `systematic-review` | Screening and PRISMA-style workflow tool interoperability | Evidence Synthesis Engine |
| `research-ai` | General-purpose AI research-assistance tools evaluated for comparison/interoperability | Research AI Orchestrator (comparison context only) |
| `academic-ai` | Academic-specific AI writing/literature tools evaluated for comparison/interoperability | Writing & Citation, Research AI Orchestrator (comparison context only) |
| `repositories` | Institutional/subject repositories and preprint servers for deposit and retrieval | Publication Gateway, Submission Orchestration |
| `submission` | Manuscript submission system interoperability | Publication Gateway, Submission Orchestration |
| `integrity` | Plagiarism/similarity, AI-content detection, and related verification signals | Publication Intelligence |
| `storage` | Cloud storage/file-hosting interoperability for research data and documents | Research File Tools, Data Storage |
| `transcription` | Audio/video transcription tool interoperability | Qualitative & Mixed Methods |

**The four standard documents in this folder, and what each governs:**

| Document | Governs |
|---|---|
| [01 PROVIDER CAPABILITY MATRIX.md](./01%20PROVIDER%20CAPABILITY%20MATRIX.md) | The 24-field template every per-provider document must fill in, and the verification-status vocabulary in practice |
| [Integration Gateway — Security & Privacy](../architecture/25%20INTEGRATION%20GATEWAY.md#security--privacy) | How credentials for any provider (OAuth token, API key, BYOK secret) are stored, rotated, and never exposed |
| [Integration Gateway — Core Components](../architecture/25%20INTEGRATION%20GATEWAY.md#core-components) | The formal Application Service → Integration Gateway → Provider Interface → Provider Adapter call pattern every provider file must reference |
| [Integration Gateway — Failure Modes](../architecture/25%20INTEGRATION%20GATEWAY.md#failure-modes) | The Internal Replacement Principle chain every provider file's "Internal Replacement Principle" section must apply |

## Owned Data
This document owns no runtime data. It owns only the category-to-folder mapping and the pointer table to the four standard documents, both reference material.

## Inputs
- The actual folder structure under `docs/integrations/` (source of truth).
- The vocabulary and pattern definitions owned by [../MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md), [../architecture/25 INTEGRATION GATEWAY.md](../architecture/25%20INTEGRATION%20GATEWAY.md), and [../architecture/26 EXTERNAL PROVIDERS.md](../architecture/26%20EXTERNAL%20PROVIDERS.md).

## Outputs
- A single lookup point for "which folder does this provider belong in" and "which standard document defines field X."
- A checklist contributors use before writing any new per-provider document.

## Dependencies
- [../MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) — parent document; owns the system-wide category narrative and verification-status vocabulary this file reuses.
- [../architecture/25 INTEGRATION GATEWAY.md](../architecture/25%20INTEGRATION%20GATEWAY.md) — the gateway pattern formalized further in [Integration Gateway — Core Components](../architecture/25%20INTEGRATION%20GATEWAY.md#core-components).
- [../architecture/26 EXTERNAL PROVIDERS.md](../architecture/26%20EXTERNAL%20PROVIDERS.md) — provider inventory and risk posture.
- [../MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) — overall system context.

## Extension Points
- A new provider document is added inside the correct existing category folder; a genuinely new category is added only by first updating this file's table and, if the category is significant enough, the parent [../MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) as well.
- Changes to the 24-field template, the credential-handling standard, the gateway call pattern, or the fallback chain are made in 01/02/03/04 respectively, never inline in a per-provider file.

## Security & Privacy
- This file contains no credentials or endpoints. Credential handling rules live in [Integration Gateway — Security & Privacy](../architecture/25%20INTEGRATION%20GATEWAY.md#security--privacy) and apply to every category listed here without exception.
- Per baseline contract #4 and #5, no category listed here permits application code or the frontend to call a provider directly; every provider file must describe access strictly through the Integration Gateway's Provider Interface/Adapter layers per [Integration Gateway — Core Components](../architecture/25%20INTEGRATION%20GATEWAY.md#core-components).

## Failure Modes
- **New provider file skips the template**: a contributor writes a per-provider document without the 24 required fields or without an Internal Replacement Principle section. Mitigated by this file being the first stop before writing any provider document.
- **Category table drifts from disk**: a folder is added/renamed without updating the table above. Mitigated by treating this file as required reading in any PR touching `docs/integrations/` structure.
- **Standard document contradicted by a provider file**: a per-provider document claims a call pattern, credential handling, or fallback chain inconsistent with 02/03/04. Mitigated by review against this index before merge.

## Observability
Documentation-phase artifact only; no runtime telemetry applies.

## P0/P1/P2/P3
**P0.** Every category folder's per-provider documentation depends on this map and the four standard documents it points to being correct and stable first; inconsistency here propagates into every provider file written afterward.

## Current Status
Documented, not implemented. No category folder yet contains a live Integration Gateway adapter in code. Category subfolders exist on disk (`scholarly-data`, `indexes-journals`, `identity`, `reference-managers`, `writing`, `quantitative`, `qualitative`, `surveys`, `systematic-review`, `research-ai`, `academic-ai`, `repositories`, `submission`, `integrity`, `storage`, `transcription`) but are currently empty of per-provider files; this batch (00-04) establishes the standard those files will follow.

## Open Questions
- Whether `research-ai` and `academic-ai` should eventually merge given overlapping evaluation criteria — left to the parent map's Open Questions, not decided here.
- Whether each category needs its own local index file (a "00" inside e.g. `scholarly-data/`) once it holds more than a handful of provider documents, or whether this single map stays sufficient.

## Related Documents
- [../MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [../MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [01 PROVIDER CAPABILITY MATRIX.md](./01%20PROVIDER%20CAPABILITY%20MATRIX.md)
- [Integration Gateway — Security & Privacy](../architecture/25%20INTEGRATION%20GATEWAY.md#security--privacy)
- [Integration Gateway — Core Components](../architecture/25%20INTEGRATION%20GATEWAY.md#core-components)
- [Integration Gateway — Failure Modes](../architecture/25%20INTEGRATION%20GATEWAY.md#failure-modes)
- [../architecture/25 INTEGRATION GATEWAY.md](../architecture/25%20INTEGRATION%20GATEWAY.md)
- [../architecture/26 EXTERNAL PROVIDERS.md](../architecture/26%20EXTERNAL%20PROVIDERS.md)
</content>
