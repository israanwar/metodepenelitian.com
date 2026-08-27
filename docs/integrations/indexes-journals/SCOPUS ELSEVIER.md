# Scopus (Elsevier)

## Fields

| Field | Value |
|---|---|
| Provider | Scopus (Elsevier) |
| Category | Journal indexing / citation database (discovery + ranking signal) |
| Purpose | Supply citation counts, journal/document indexing status, author metrics (h-index, affiliations), and Scopus-indexed metadata (CiteScore, quartiles) into ResearchReference records and the Evidence Synthesis / Methodology Advisor engines for credibility and coverage signals. |
| Official API Available | Yes. Elsevier provides the Scopus APIs (Scopus Search API, Abstract Retrieval API, Author Retrieval API, Serial Title API, Citation Overview API) under the Elsevier Developer Portal (dev.elsevier.com). |
| Authentication | API key issued via Elsevier Developer Portal, combined with institutional-token (Inst Token) or IP-authenticated access for full-text/metadata entitlements. Some endpoints require institutional subscription authentication, not just an API key. |
| Read Capabilities | Search and retrieve document metadata, abstracts, citation counts, author profiles, affiliation data, journal/serial metadata (CiteScore, SJR proxy fields). No full-text retrieval beyond abstract under standard API terms. |
| Write Capabilities | None. Scopus is a read-only discovery/indexing data source. It is never a submission or publishing destination. |
| Webhooks/Event Support | UNKNOWN — requires verification against current official documentation. Elsevier APIs are historically pull/poll-based, not webhook-based; no confirmed push/event mechanism known. |
| Supported Objects | Documents (papers), authors, affiliations, serials/journals, citation overviews. |
| Rate Limits | UNKNOWN — requires verification against current official documentation. Elsevier enforces weekly/quota-based API limits tied to API key and subscription tier; exact figures vary by agreement and change over time. |
| Commercial Use Constraints | Significant. Elsevier's API terms restrict commercial redistribution, bulk data reuse, and text-and-data-mining (TDM) output beyond permitted internal research use. Building a commercial product that redistributes Scopus data at scale likely requires a separate data license/agreement with Elsevier. |
| Licensing/Data Restrictions | Scopus metadata and citation data are proprietary. Caching/storage of retrieved data is typically restricted to limited durations and internal-use-only under the API agreement, not indefinite redistribution. Exact retention/caching limits must be confirmed against the current Elsevier API Service Agreement before implementation. |
| Partnership Required | No partnership currently exists. Full-scale institutional access (beyond free-tier API key limits) plausibly requires an institutional subscription or a formal data license — this must be confirmed, not assumed, before any integration is scoped. |
| Internal Entity Mapping | Scopus Document → ResearchReference (via canonical normalization); Scopus Author → linked researcher identity signal (not a core entity, an enrichment field); Scopus Serial/Journal → journal metadata enrichment on ResearchReference.source. |
| Sync Direction | One-way, inbound only (Scopus → MetodePenelitian.com). No outbound writes. |
| Caching Strategy | Cache normalized citation/indexing metadata inside ResearchReference with a TTL (e.g. periodic refresh, not real-time), respecting Elsevier's data-retention terms. Raw Scopus API responses should not be persisted indefinitely without confirming license terms. |
| Failure/Fallback Strategy | If Scopus is unreachable or access is unavailable (no license), Evidence Synthesis and Methodology Advisor must degrade gracefully: fall back to other indexing signals already normalized (e.g. Dimensions, Lens, DOAJ, SciMago) or omit the citation/indexing signal rather than blocking the core workflow. Scopus is an enrichment signal, never a hard dependency. |
| Security Considerations | API key and institutional token must be stored server-side in the Integration Gateway only; never exposed to frontend. Requests must be proxied through the Integration Gateway per Core Contract #4/#5. |
| Privacy Considerations | Scopus data is about published scholarly works and public author profiles, not MetodePenelitian.com users, so end-user privacy exposure is low. Care is needed if author-affiliation data is cross-referenced with platform user identities. |
| Implementation Method | REQUIRES ACCESS. Not directly implementable without an Elsevier API key and confirmation of institutional/commercial licensing terms. |
| Priority | Medium — valuable as a credibility/discovery signal, but paid/licensed access makes it a later-phase integration, not a launch dependency. |
| Verification Status | REQUIRES ACCESS |
| Last Verified | Not yet verified against live source — architecture-phase estimate only. |
| Source/Documentation Required | dev.elsevier.com (Elsevier Developer Portal), Scopus API Service Agreement / Elsevier API terms of use — must be reviewed in full before implementation. |

## Internal Replacement Principle
Scopus has an official API, so the path starts there, but it is gated behind an API key plus institutional/commercial licensing (REQUIRES ACCESS), not open access. Until a license is secured: Official API (gated) → fall back to other normalized indexing signals already available through open providers (Dimensions, Lens, DOAJ, SciMago, Crossref) inside ResearchReference → internal capability replacement, where the Evidence Synthesis and Methodology Advisor engines treat "Scopus-indexed" as an optional enrichment flag rather than a required field, so the platform stays fully functional for users without Scopus access. No partnership currently exists and none should be assumed in any downstream document.

## Related Documents
- [00 MASTER INTEGRATION MAP](../00%20MASTER%20INTEGRATION%20MAP.md)
- [../../architecture/11 EVIDENCE SYNTHESIS ENGINE.md](../../architecture/11%20EVIDENCE%20SYNTHESIS%20ENGINE.md)
- [../../architecture/25 INTEGRATION GATEWAY.md](../../architecture/25%20INTEGRATION%20GATEWAY.md)
- [../../MASTER BACKEND ARCHITECTURE.md](../../MASTER%20BACKEND%20ARCHITECTURE.md)
