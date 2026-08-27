# Reference Managers

## Purpose
This document defines how MetodePenelitian.com connects to external reference managers (Zotero, Mendeley, and future equivalents) so a researcher can import an existing library, keep it in sync, and export back out, without any other part of the Research OS ever coding against a specific reference-manager API directly.

## Scope
Covers the Reference Manager Gateway abstraction: a single internal interface that all reference-manager interactions go through, and the adapters underneath it for each supported provider. Covers import (pulling a researcher's existing library into `ResearchReference` records), export (pushing project references back to a connected library), and sync state tracking. Does not cover the canonical `ResearchReference` data model itself (owned by the scholarly data normalization layer per [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)), and does not cover citation formatting/insertion into a manuscript, which is [19 WRITING CITATION.md](19%20WRITING%20CITATION.md).

## Responsibilities
- Expose one internal `ReferenceManagerGateway` interface with provider-agnostic operations: connect account, list libraries/collections, import items, export items, and report sync status.
- Own provider-specific adapters (Zotero adapter, Mendeley adapter) that translate each provider's API and data shape into the gateway's common operations, kept entirely behind the [Integration Gateway](25%20INTEGRATION%20GATEWAY.md).
- Map each provider's native item format into the platform's canonical `ResearchReference` model on import, and map canonical fields back to each provider's expected export format on export.
- Track per-project, per-provider connection and sync state (last synced, item counts, conflicts) so researchers can see what is and is not in sync.
- Surface sync conflicts (e.g., an item edited both in Zotero and inside a project) for researcher resolution rather than silently overwriting either side.

## Non-Responsibilities
- Does not make direct HTTP calls to Zotero or Mendeley from application code outside the adapter layer; every call goes through the Integration Gateway.
- Does not become the system of record for a researcher's library; the platform's own `ResearchReference` store is the system of record for anything used inside a project, and the external manager remains the researcher's own property.
- Does not perform citation style formatting; formatting is handled downstream by the writing/citation layer using canonical reference data, not provider-native data.
- Does not attempt real-time bidirectional sync as a hard guarantee; sync is scheduled/triggered, with explicit conflict surfacing rather than silent last-write-wins in ambiguous cases.

## Core Components
- **Reference Manager Gateway interface**: the single abstraction (`connect`, `listCollections`, `importItems`, `exportItems`, `getSyncStatus`) that Research Core and other engines call; it never exposes provider-specific types outward.
- **Zotero Adapter**: implements the gateway interface against Zotero's Web API (OAuth-based account connection, library/collection listing, item read/write). Exact endpoint and rate-limit details: REQUIRES VERIFICATION against Zotero's current API documentation at implementation time.
- **Mendeley Adapter**: implements the gateway interface against Mendeley's API (OAuth-based, catalog and library item access). Exact endpoint and rate-limit details: REQUIRES VERIFICATION against Elsevier/Mendeley's current API documentation at implementation time.
- **Import Mapper**: converts each provider's native item schema into canonical `ResearchReference` fields, flagging fields that do not map cleanly (e.g., provider-specific tags) as preserved-but-non-canonical metadata rather than dropped.
- **Export Mapper**: converts canonical `ResearchReference` fields back into each provider's expected write format.
- **Sync State Tracker**: per-connection record of last sync time, item counts, and unresolved conflicts.

## Owned Data
| Entity | Description |
|---|---|
| `ReferenceManagerConnection` | A researcher's OAuth-connected account to a specific provider (Zotero or Mendeley), including token references (never raw secrets outside the Integration Gateway's credential store). |
| `ReferenceManagerSyncState` | Per-connection, per-project sync status: last sync timestamp, imported/exported item counts, pending conflicts. |
| `ReferenceImportMapping` | Provenance record linking an imported `ResearchReference` back to its source provider item ID, so re-sync can detect updates versus new items. |

## Inputs
- Researcher-initiated OAuth connection to a provider account.
- Provider library/collection data pulled on import (titles, authors, DOIs, notes, attachments metadata) via the adapter.
- Canonical `ResearchReference` records selected by the researcher for export.

## Outputs
- Newly created or updated `ResearchReference` records (imported items), routed through the same normalization the canonical model requires per [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).
- Provider-side library updates (exported items), written through the adapter.
- Sync status and conflict reports surfaced to the researcher.

## Dependencies
- [Integration Gateway](25%20INTEGRATION%20GATEWAY.md), which every provider call passes through; adapters hold no direct network calls outside it.
- Canonical `ResearchReference` model and its normalization rules, per [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).
- Async job infrastructure for large-library imports/exports, per [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md), so a multi-thousand-item Zotero library sync never runs inline on a request.
- Provider-specific implementation details (auth flow quirks, field mappings, rate limits) documented further in `docs/integrations/reference-managers/` (see Related Documents).

## Extension Points
- New providers (e.g., EndNote, Paperpile, RefWorks) are added as new adapters implementing the same gateway interface; no other component needs to change.
- Field-mapping rules per provider are configuration/data, not hardcoded logic, so mapping refinements do not require touching the gateway interface.
- Conflict-resolution strategy (currently: surface for manual resolution) is an explicit extension point for a future smarter auto-merge, kept behind the same Sync State Tracker.

## Security & Privacy
Provider OAuth tokens are held by the Integration Gateway's credential store, never by this layer or by application code directly, consistent with the platform-wide rule that provider specifics stay behind the gateway. Imported reference data inherits the owning project's default-private access rules. A researcher disconnecting a provider account revokes the stored token and halts further sync without deleting already-imported `ResearchReference` records (they remain the project's own data).

## Failure Modes
- **Provider API unavailable or rate-limited**: sync operations queue/retry with backoff; already-imported references remain fully usable, satisfying degraded-but-functional operation for anything downstream of the reference data.
- **OAuth token expired or revoked externally**: connection marked disconnected, researcher prompted to reconnect; no silent data loss on either side.
- **Partial import failure** (some items fail mapping): successfully mapped items are still imported; failed items are reported individually rather than failing the whole batch.
- **Conflicting edits between provider and platform**: flagged as an unresolved conflict, never silently overwritten in either direction.

## Observability
- Per-provider connection count and sync success/failure rate.
- Import/export item throughput and mapping-failure rate (signal for schema drift on the provider side).
- Time since last successful sync per connection, to detect stale connections.
- Conflict volume per project, as a signal of how often researchers edit in both places.

## P0/P1/P2/P3
**P1.** Reference manager import/export is a major product capability that materially lowers adoption friction for researchers with an existing Zotero/Mendeley library, but the platform is usable without it (references can be added manually or via search), so it sits at P1 rather than P0.

## Current Status
Documented, not implemented. No gateway interface, adapters, or sync state tracking exist in code yet. Provider API specifics referenced above are drawn from general knowledge of Zotero's and Mendeley's public APIs and are marked for verification before implementation.

## Open Questions
- Which provider ships first: Zotero (broadly used in academia, well-documented public API) or Mendeley (Elsevier-owned, tighter ecosystem overlap with Scopus)?
- Should export be full-library push or project-scoped selective export only, given the platform's default-private stance on project data?
- What is the conflict-resolution UX when the same item changes on both sides between syncs?

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [25 INTEGRATION GATEWAY.md](25%20INTEGRATION%20GATEWAY.md)
- [19 WRITING CITATION.md](19%20WRITING%20CITATION.md)
- `docs/integrations/reference-managers/` (provider-specific adapter details)
