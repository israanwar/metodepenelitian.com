# External Providers

## Purpose
External Providers is the architecture-level summary of every category of third-party system the Research OS integrates with, and the integration mode each category realistically supports. It exists to give architecture and security review a single page answering "what do we depend on out there, and how solid is each dependency" without needing to open all sixteen category folders under `docs/integrations/`.

## Scope
Covers the categorized provider map at summary level — category, representative providers, and integration mode (API, file interoperability, guided handoff, partnership-dependent). Does not document individual provider capabilities, endpoints, rate limits, or verification status in depth — that detail is owned by [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) and the per-category files under `docs/integrations/`, which this document defers to rather than duplicates.

## Responsibilities
- Summarize the provider category map: which categories exist, representative providers in each, and the realistic integration mode per category.
- State plainly, per category, whether integration is API-based, file-interoperability-based, guided-handoff-based, or partnership-dependent — so no reader mistakes a category's *presence* on this map for a *working, verified* integration.
- Point to the authoritative sources of per-provider detail: [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) for the category index and verification-status vocabulary, `docs/integrations/` for per-provider entries.
- Reinforce, at the architecture level, that every provider on this map is reached exclusively through the [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md) — this document is a map of destinations, never a map of direct connections.

## Non-Responsibilities
- Does not assign or track per-provider verification status (VERIFIED / REQUIRES ACCESS / REQUIRES PARTNERSHIP / etc.) — that vocabulary and its application live in `docs/integrations/` category files per [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md).
- Does not claim any partnership, direct-submission capability, or API access that has not been independently verified — where confidence is insufficient, this document says so explicitly rather than asserting it.
- Does not define the Provider Interface contracts or resilience behavior — that is the Integration Gateway's responsibility.
- Does not decide integration sequencing/roadmap priority beyond the general P0–P3 tiering below — detailed sequencing belongs to product planning.

## Core Components
- **Provider Category Map** — the summary table below, mirroring the sixteen categories defined in [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md).
- **Integration Mode Classifier** — the four-way classification (API / file interoperability / guided handoff / partnership-dependent) applied consistently across categories so risk posture is comparable at a glance.

**Provider category summary:**

| Category | Representative providers | Integration mode |
|---|---|---|
| AI | OpenAI, Anthropic, Google (Gemini), DeepSeek, Mistral, Perplexity, Groq | API, behind the Multi-Model AI Gateway and Integration Gateway's `AIProvider` interface |
| Scholarly data | Crossref, OpenAlex, DOAJ | API — public, no partnership required for basic metadata access |
| Indexes & journals | SINTA, GARUDA, Scopus/Elsevier | Mixed — SINTA/GARUDA are Indonesian national indices (REQUIRES VERIFICATION on current API access); Scopus indexing data is licensed/partnership-dependent, never assumed available |
| Identity | ORCID | API/OAuth for author disambiguation and profile linking |
| Reference managers | Zotero, Mendeley | API/OAuth for library import/export |
| Writing | Microsoft Word/365, Google Docs, LaTeX | File interoperability and editor add-ins, not a live data API relationship in most cases |
| Quantitative | SPSS, SmartPLS, AMOS, R, Python, Stata | File interoperability; R/Python additionally run in isolated background-job execution, never inline |
| Qualitative | NVivo, ATLAS.ti, MAXQDA | File interoperability (export/import of coded data) |
| Publication/repository | OJS, ScholarOne, Editorial Manager, Zenodo, OSF, arXiv, institutional repositories | API where the destination genuinely exposes one; guided handoff otherwise |

## Owned Data
This document owns no runtime data. It owns only the summary table above; the authoritative `IntegrationProvider` records themselves are owned by the [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md), and per-provider descriptive detail is owned by the `docs/integrations/` category files.

## Inputs
- The category and provider list maintained in [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md).
- Per-category provider entries under `docs/integrations/`, once populated.
- Publicly available provider documentation, used only where confidence is high enough to state a claim without hedging.

## Outputs
- A single-page risk-posture summary for architecture and security review.
- A pointer structure that routes any reader needing provider-level detail to the correct category file instead of this document accumulating that detail itself.

## Dependencies
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) — the authoritative category index and verification-status vocabulary this document summarizes from.
- [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md) — the enforcement layer that makes every entry on this map reachable only through Provider Adapters.
- `docs/integrations/` — per-category, per-provider detail.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 20.

## Extension Points
- A new provider is added to this summary only after it has an entry in its category's `docs/integrations/` file with a verification status — this document never introduces a provider that isn't tracked at the category level first.
- A new category requires a corresponding row in [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) before it appears here.
- Integration-mode reclassification (e.g. a category moving from guided-handoff to API-based) happens only when the underlying category file's verification status actually changes, not speculatively.

## Security & Privacy
- This document contains no credentials, endpoints, or tenant-specific connection detail — that is Integration Gateway runtime data, never documentation.
- Per Core Contract #4, every provider named here is reachable only via the Integration Gateway; this document must never be read as implying any application code has a direct relationship with any listed provider.
- Categories touching identifiable researcher data (identity, reference managers, writing) carry the same private-by-default posture (Core Contract #9) as the rest of the platform — data only leaves the system when the researcher initiates that specific integration action.

## Failure Modes
- **Overstated capability**: this document asserting a provider relationship (partnership, direct submission) that does not exist — mitigated by the hard rule inherited from [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md): never claim a partnership or direct-submission capability for Scopus, SINTA, or Google Scholar, and mark anything unconfirmed as REQUIRES VERIFICATION rather than asserted fact.
- **Staleness relative to category files**: this summary drifting from the more detailed and more frequently updated `docs/integrations/` files — mitigated by treating this document as a derived summary that must be re-checked whenever a category file's verification status changes materially.
- **Category conflation**: `research-ai` and `academic-ai` (or similar adjacent categories) being merged informally in this summary in a way that hides their distinct evaluation criteria — mitigated by keeping this table aligned one-to-one with [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)'s category list.

## Observability
Documentation-phase artifact only; no runtime telemetry applies to this document itself. Runtime observability for actual provider calls (volume, latency, error rate, circuit-breaker state) is owned by the Integration Gateway; see that document's Observability section.

## P0/P1/P2/P3
**P0.** An accurate, non-inflated summary of external dependencies is foundational to safe operation: architecture and security review rely on this page not overstating what is actually connected, and every downstream module's risk posture (AI Gateway, Publication Gateway, Literature & Evidence) is assessed against what this document honestly states is real versus aspirational.

## Current Status
Documented, not implemented. No `IntegrationProvider` records exist in any runtime system yet; every entry in the summary table above describes an intended or candidate integration, not a live connection. Where a provider's real API access has not been independently verified, this document marks it as REQUIRES VERIFICATION rather than assuming availability.

## Open Questions
- Current, verified API access status for SINTA and GARUDA (Indonesian national indices) — REQUIRES VERIFICATION; not assumed in this document.
- Whether Scopus/Elsevier data access is pursued via a licensed data partnership at all, given cost and institutional-relationship requirements, or deliberately left out of scope for the foreseeable roadmap.
- Whether the AI provider list (OpenAI, Anthropic, Gemini, DeepSeek, Mistral, Perplexity, Groq) should be trimmed or expanded before the Multi-Model AI Gateway's initial build, and how that decision feeds back into this summary.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md)
- [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md)
- `docs/integrations/` — per-category provider inventories
