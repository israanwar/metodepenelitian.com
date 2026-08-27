# Crossref

| Field | Value |
|---|---|
| **Provider** | Crossref (a DOI Registration Agency operated by the non-profit Crossref/PILA) |
| **Category** | Scholarly metadata discovery — P0 foundation provider |
| **Purpose** | Primary source of authoritative bibliographic metadata for published scholarly works (journal articles, books, conference papers, preprints registered with Crossref DOIs). Feeds the metadata-lookup and citation-verification path of `ResearchReference`. |
| **Official API Available** | Yes — the Crossref REST API (`api.crossref.org`) is a real, public, documented, free API. VERIFIED as existing and stable at architecture time from well-established general knowledge; exact current endpoint behavior must still be checked against live docs before implementation. |
| **Authentication** | None required for the public "polite pool." Requests should include a `mailto` parameter or a descriptive `User-Agent` with contact email to be routed into the faster, more reliable polite pool. No API key/OAuth for basic read access. Crossref also offers a paid "Metadata Plus" tier with a token for higher-volume/SLA use — REQUIRES ACCESS to confirm current terms. |
| **Read Capabilities** | Lookup by DOI; search works/journals/funders/members by query string, author, title, ISSN, ORCID, funder ID; list works filtered by date, type, publisher; retrieve reference lists (when deposited by publishers); retrieve funding and license metadata. |
| **Write Capabilities** | None for MetodePenelitian.com. Crossref write access (DOI deposit/registration) is only available to Crossref member publishers depositing their own content — this platform is a metadata consumer, never a depositor. |
| **Webhooks/Event Support** | UNKNOWN — requires verification against current official documentation. Crossref historically has not offered consumer-facing webhooks; polling/incremental sync via the `filter` and cursor parameters is the known pattern. |
| **Supported Objects** | Works (articles, books, chapters, proceedings, datasets, preprints, standards), Journals, Funders, Members (publishers), Prefixes, Types, licenses metadata. |
| **Rate Limits** | UNKNOWN exact current numeric limits — requires verification against current official documentation. Known qualitative behavior: an anonymous/"public" pool with lower priority, and a "polite pool" (via `mailto`) with better throughput and reliability; Metadata Plus subscribers get a distinct, higher-priority pool. Must not be treated as unlimited. |
| **Commercial Use Constraints** | Metadata itself is intended for open reuse; using Crossref at production commercial scale should still register a `mailto` contact and, if usage grows, evaluate Metadata Plus membership. No confirmed contractual restriction blocking commercial use of the public API is known, but current Crossref terms of service must be reviewed before scaling — REQUIRES ACCESS. |
| **Licensing/Data Restrictions** | Crossref metadata is generally released under CC0 (public domain dedication) for the bibliographic record itself, per long-standing Crossref policy. Underlying full text/abstracts, where present in the record, may carry their own publisher license — must not be assumed open. |
| **Partnership Required** | No partnership required for read-only metadata API use. No partnership exists today. |
| **Internal Entity Mapping** | Crossref `Work` → normalized into `ResearchReference` (canonical model). DOI is stored as the primary external identifier; Crossref `member`/publisher → `ResearchReference.publisher`; `funder` records → linked funding metadata on the reference. |
| **Sync Direction** | One-way inbound (Crossref → MetodePenelitian.com). No outbound writes. |
| **Caching Strategy** | Cache resolved DOI metadata aggressively (bibliographic metadata for a published DOI rarely changes) with a background revalidation job; cache negative lookups (DOI not found) for a short TTL only, since new DOIs are registered continuously. |
| **Failure/Fallback Strategy** | On Crossref outage or rate-limit rejection, the Multi-Model AI Gateway / Literature & Evidence path degrades to querying OpenAlex and/or Semantic Scholar as alternate metadata sources for the same DOI, and falls back to any previously cached record. No engine blocks or fails hard solely because Crossref is unavailable. |
| **Security Considerations** | Outbound-only, read-only integration; no credentials to protect beyond an optional Metadata Plus token, which — if adopted — is held server-side in the Integration Gateway, never exposed to the frontend. |
| **Privacy Considerations** | Queries may reflect a researcher's topic of interest; query logs sent to Crossref should avoid embedding personally identifying project data beyond what is needed (e.g., search terms, DOIs), consistent with "private by default" project data. |
| **Implementation Method** | Server-side adapter inside the Integration Gateway, called only through the scholarly-metadata normalization layer feeding `ResearchReference`. Never called directly from frontend or from other engines. |
| **Priority** | P0 — foundation provider per MASTER BACKEND ARCHITECTURE Section 11. |
| **Verification Status** | PARTIALLY VERIFIED — API existence, general shape, and CC0 metadata policy are well-established; exact current rate limits, Metadata Plus terms, and endpoint parameters require verification against live documentation. |
| **Last Verified** | Not yet verified against live source — architecture-phase estimate only. |
| **Source/Documentation Required** | `https://api.crossref.org` REST API reference and Crossref's current Terms of Use / metadata licensing page — required before implementation. |

## Internal Replacement Principle
Crossref has a real, stable, free, public Official API, so the chain stops at step 1 for read access: **Official API** is used directly through the Integration Gateway. No OAuth, plugin, or partnership is needed for metadata lookup. The only fallback concern is availability/rate-limiting, not capability — if Crossref is unreachable, the system falls back to sibling metadata providers (OpenAlex, Semantic Scholar) and cached records rather than to any internal replacement capability, since Crossref performs no function that Research Core could meaningfully replicate internally (DOI registration is not something MetodePenelitian.com performs).

## Related Documents
- [../00 MASTER INTEGRATION MAP.md](../00%20MASTER%20INTEGRATION%20MAP.md) *(if absent, see [../../MASTER INTEGRATION MAP.md](../../MASTER%20INTEGRATION%20MAP.md))*
- [../../architecture/10 LITERATURE EVIDENCE.md](../../architecture/10%20LITERATURE%20EVIDENCE.md)
- [../../architecture/25 INTEGRATION GATEWAY.md](../../architecture/25%20INTEGRATION%20GATEWAY.md)
- [../../MASTER BACKEND ARCHITECTURE.md](../../MASTER%20BACKEND%20ARCHITECTURE.md)
