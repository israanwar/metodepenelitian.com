# Publication Gateway

## Purpose
Publication Gateway is the exit path of the Research OS: it connects a finished `ResearchProject` to real, official publication destinations — international journals, Scopus-indexed journals, SINTA-indexed journals, conferences, preprint servers, institutional repositories. Its entire reason to exist is captured in Core Contract #7: it is a **router**, never a publisher. MetodePenelitian.com does not accept, review, typeset, or issue any publication itself; it only helps a researcher find and reach the correct official destination, then hands off.

## Scope
Covers the routing logic that takes a project believed ready for publication and connects it to a `PublicationDestination` record, plus the guided or API-backed handoff to that destination's real submission channel. Does not cover the matching/scoring algorithm itself (that is [Journal Matching Engine](./23%20JOURNAL%20MATCHING%20ENGINE.md)), does not cover readiness scoring (that is [Publication Intelligence](./22%20PUBLICATION%20INTELLIGENCE.md)), and does not cover the mechanics of preparing and tracking a specific submission package (that is [Submission Orchestration](./24%20SUBMISSION%20ORCHESTRATION.md)). Destination-type product framing and researcher-facing publication flow live in `docs/publication/`.

## Responsibilities
- Own the `PublicationDestination` registry: journals, conferences, preprint servers, and repositories, each with verification metadata (`verification_source`, `last_verified_at`).
- Own SINTA/indexing metadata as destination discovery/verification signals; these ranks never select a generic manuscript template.
- Reference, without owning, the exact destination/article-type guideline and Formatting Policy Pack used by Writing & Citation for compliance and package preparation.
- Route a project to one or more candidate destinations produced by the Journal Matching Engine.
- Determine, per destination, whether a real API/partnership exists (`api_available`) or whether the only honest option is a guided handoff to the destination's own submission URL.
- Enforce the hard rule that no destination is ever presented as accepting direct submission unless a genuine API or partnership backs that claim.
- Hand off to [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md) for any destination reachable through a real submission platform (OJS, ScholarOne, Editorial Manager, a publisher portal, a repository API).

## Non-Responsibilities
- Does not review, accept, reject, typeset, or issue publications — MetodePenelitian.com is never itself a publisher (Core Contract #7), under any framing.
- Does not compute match scores or readiness scores — it consumes them from Publication Intelligence and the Journal Matching Engine.
- Does not track submission status over time or assemble destination-specific manuscript packages — that is Submission Orchestration.
- Does not call any publisher, repository, or submission platform API directly — every such call passes through the Integration Gateway, never a direct-to-provider call from Publication Gateway code.
- Does not claim direct-submission capability for Scopus, SINTA, or Google Scholar — none of these are submission destinations; Scopus and SINTA are indexing/ranking signals surfaced by Publication Intelligence, and Google Scholar has no submission concept at all.

## Core Components
- **Publication Destination Registry** — the canonical, verified list of `PublicationDestination` records with type, publisher, indexing, and submission-channel metadata.
- **Destination Router** — selects, from the Journal Matching Engine's candidates, which destinations are presentable to the researcher and in what order.
- **Handoff Resolver** — decides, per destination, between an API-backed handoff (via Integration Gateway) and a guided handoff (deep link to the destination's own author-guidelines/submission page).
- **Destination Verification Tracker** — flags registry entries whose `last_verified_at` has aged past an acceptable freshness window.
- **Requirement Source Link** — connects the exact destination/article type to current author-guideline/template evidence and its independently versioned formatting policy; a changed source triggers re-verification rather than silent policy mutation.

## Owned Data
| Entity | Notes |
|---|---|
| PublicationDestination | id, name, type, publisher, institution, country, issn/eissn, fields/topics, languages, open_access, apc, indexing, scopus_status, sinta_rank |
| PublicationDestinationVerification | verification_source, last_verified_at, verification method |
| PublicationHandoffMode | per-destination flag: api_available vs. guided-handoff-only |

Formatting rules, imported templates and compliance runs remain Writing & Citation-owned; `PublicationRequirement` links the destination to those verified requirements without duplicating them.

## Inputs
- Candidate destinations and match scores from [Journal Matching Engine](./23%20JOURNAL%20MATCHING%20ENGINE.md).
- Readiness state from [Publication Intelligence](./22%20PUBLICATION%20INTELLIGENCE.md), gating whether routing is even offered yet.
- The `ResearchProject` reference from [Research Core](./02%20RESEARCH%20CORE.md).
- Provider health/availability signals from the Integration Gateway for API-backed destinations.

## Outputs
- A presented, ranked set of candidate `PublicationDestination` records for a project.
- A handoff action per selected destination: either an Integration-Gateway-mediated API submission kickoff, or a guided link to the official external submission channel.
- Routing events consumed by [Submission Orchestration](./24%20SUBMISSION%20ORCHESTRATION.md) to begin package preparation and tracking.

## Dependencies
- [Journal Matching Engine](./23%20JOURNAL%20MATCHING%20ENGINE.md) for candidate destinations and match scores.
- [Publication Intelligence](./22%20PUBLICATION%20INTELLIGENCE.md) for readiness gating.
- [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md) for any destination with a genuine API or partnership.
- [Research Core](./02%20RESEARCH%20CORE.md) for the `ResearchProject` being routed.
- Researcher-facing publication flow and destination-type product framing in `docs/publication/`.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 16 for this module's place in the overall backend.

## Extension Points
- New destination types (e.g. a future dataset-repository category) extend the registry schema without changing the router's decision logic.
- New handoff modes (e.g. a formal publisher partnership graduating a destination from guided to API-backed) are added by updating that destination's `api_available` flag and wiring a new Provider Adapter behind the Integration Gateway — never by special-casing the destination inside Publication Gateway.
- A future direct-deposit capability for repositories (Zenodo, OSF, institutional repositories) attaches here as a new handoff mode, gated by the same "verified API only" rule.

## Security & Privacy
- Research project data is private by default (Core Contract #9); presenting a project to a destination — even for a guided handoff — must not leak project content externally until the researcher explicitly initiates that handoff.
- Registry entries lacking a current `verification_source`/`last_verified_at` must not be presented as live options; stale entries are suppressed or flagged, never silently shown as current.
- Any API-backed handoff carries only the data the researcher has explicitly consented to submit — the Gateway never forwards full project context by default.

## Failure Modes
- **Stale registry entry presented as current**: mitigated by the Destination Verification Tracker suppressing entries past their freshness window rather than defaulting to "assume still valid."
- **API-backed destination unavailable**: falls back to guided handoff to the destination's public submission URL rather than blocking the researcher entirely — consistent with the degraded-but-functional principle applied to an external dependency.
- **Destination misclassified as API-backed when it is not**: treated as a P0-severity defect class, since it directly violates the "never claim direct-submission capability" requirement.

## Observability
- Count and distribution of projects routed by destination type (journal/conference/preprint/repository).
- Ratio of API-backed handoffs to guided handoffs, tracked per destination category.
- Registry freshness: percentage of destinations verified within the acceptable window.
- Handoff-initiated vs. handoff-completed rate (researcher follow-through signal).

## P0/P1/P2/P3
**P1.** Publication Gateway is a major product capability — it is the payoff moment of the entire research lifecycle — but the platform can exist and provide value (methodology, literature, analysis support) before publication routing ships, so it is not foundational infrastructure like Research Core or the Integration Gateway. Deeper API-backed submission per destination is **P2**, gated by real partnerships/APIs actually existing.

## Current Status
Documented, not implemented. No `PublicationDestination` registry, router, or handoff resolver exists in code; this document defines the intended router boundary ahead of implementation.

## Open Questions
- How the registry is initially populated and kept verified at scale (manual curation vs. periodic re-verification jobs vs. researcher-reported corrections).
- Whether guided-handoff destinations should still receive a lightweight `PublicationSubmission` tracking record, or whether tracking only applies to API-backed handoffs.
- How destination duplicates/aliases (a journal appearing under slightly different names across sources) are deduplicated in the registry.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER PRODUCT ARCHITECTURE.md](../MASTER%20PRODUCT%20ARCHITECTURE.md)
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [Publication Intelligence](./22%20PUBLICATION%20INTELLIGENCE.md)
- [Journal Matching Engine](./23%20JOURNAL%20MATCHING%20ENGINE.md)
- [Submission Orchestration](./24%20SUBMISSION%20ORCHESTRATION.md)
- [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md)
- [Research Core](./02%20RESEARCH%20CORE.md)
- [Institutional & Publication Formatting Architecture](./INSTITUTIONAL%20PUBLICATION%20FORMATTING.md)
- `docs/publication/` — researcher-facing publication flow documentation
