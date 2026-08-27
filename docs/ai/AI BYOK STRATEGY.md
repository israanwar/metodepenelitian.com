# AI BYOK Strategy

## Purpose
This document defines Bring-Your-Own-Key (BYOK) support: letting a researcher or institution supply their own API credentials for an approved AI provider instead of consuming the platform's pooled credentials, and the strict handling rules that govern any such credential end to end. BYOK exists to support institutions with existing provider contracts, cost-sensitive power users, and researchers who want direct control over which provider account their usage bills against — while keeping the credential itself out of every layer that does not strictly need it.

## Scope
Covers how a BYOK credential is submitted, stored, resolved at call time, rotated, and revoked, and the hard boundaries on where it may and may not appear (never plaintext at rest, never sent to the frontend, never logged). Does not cover the platform's own pooled/managed credentials for default (non-BYOK) usage — those follow the same storage rules but are owned operationally, not by a researcher. Does not cover provider approval itself — see [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md).

## Responsibilities
- Accept a researcher- or institution-supplied API key for a specific approved provider, scoped to that account/organization, never to an individual `ResearchProject`.
- Encrypt every BYOK credential at rest using envelope encryption with keys held in a secrets manager separate from the application database, so a database compromise alone does not expose usable credentials.
- Resolve a BYOK credential only at the moment of an outbound provider call inside the Multi-Model AI Gateway's adapter layer, never earlier in the request path and never anywhere in application/business logic.
- Guarantee that a BYOK credential is never transmitted to the frontend in any form — not in a response payload, not in a debug/inspector view, not even masked-and-then-reversible — the frontend may only ever see a non-reversible reference (e.g. "OpenAI key ending in ****1234," rendered from a stored last-four value, not derived by unmasking the real key).
- Guarantee that a BYOK credential is never written to application logs, error traces, or observability tooling at any layer, including provider-error responses that might otherwise echo request headers.
- Support rotation (replace an existing key without downtime) and revocation (immediately stop using a key, falling back to pooled credentials or blocking the provider per Core Contract #11's degraded-but-functional requirement).

## Non-Responsibilities
- Does not decide which providers are eligible for BYOK at all — only providers already `approved` in [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) can accept a BYOK credential.
- Does not implement the adapter call itself — that is the Multi-Model AI Gateway's responsibility; this document only governs how the credential reaches that call safely.
- Does not set billing/cost-attribution policy for BYOK usage (how institutional billing reconciles against provider invoices) — that is a separate billing concern outside this document.
- Does not manage non-AI third-party credentials (scholarly APIs, storage, payment providers) — see [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) for the general Integration Gateway credential model, which this document's storage rules are consistent with but do not own.
- Does not decide model/routing behavior when BYOK is active versus pooled credentials — see [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md).

## Core Components
- **Credential Vault** — the encrypted-at-rest store for BYOK credentials, envelope-encrypted with a secrets-manager-held key, logically separate from the primary application database.
- **Credential Resolver** — the adapter-layer component that fetches and decrypts a credential only at the point of an outbound provider call, holding the decrypted value in memory only for the duration of that call.
- **Masked Reference** — the non-reversible, display-safe representation (provider name, last-four characters, added-date, status) that is the only form of a BYOK credential ever returned to the frontend or included in any UI.
- **Rotation/Revocation Handler** — accepts a new key to replace an existing one, or a revoke action, and invalidates the prior credential immediately across any in-flight resolver caches.

## Owned Data
- `BYOKCredential` (account/organization id, provider id, envelope-encrypted key material, key-encryption-key reference, added-at, last-rotated-at, status: active/revoked).
- `BYOKUsageRecord` (which requests used a BYOK credential versus pooled credentials, provider id, timestamp) — for cost-attribution handoff, containing no key material.

## Inputs
- A researcher/institution-submitted API key via a dedicated credential-entry flow, transmitted over TLS directly to the Credential Vault's ingestion endpoint.
- Rotation and revocation actions initiated by the account/organization owner.
- The approved-provider list from [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md), gating which providers can even accept a submitted key.

## Outputs
- The decrypted credential, held only transiently in the Multi-Model AI Gateway adapter's process memory for the duration of a single outbound call, never persisted or returned.
- The Masked Reference, the only credential-derived data ever surfaced to the frontend or any API response.
- BYOK-vs-pooled usage signals for downstream cost-attribution and observability.

## Dependencies
- [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md) — gates which providers may receive a BYOK credential at all.
- [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md) — the caller that triggers credential resolution indirectly via the Gateway when a request is scoped to a BYOK account.
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) — the general secrets-handling posture for the Integration Gateway that this document's rules mirror for AI-specific credentials.
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) — governs encryption-at-rest and data-classification standards this vault must meet.
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) — the governing policy this strategy implements.

## Extension Points
- A new provider becomes BYOK-eligible by adding it to the Credential Vault's supported-provider list once it is `approved` in the provider registry — no change to the vault's storage or resolution mechanics is required.
- Institution-level (shared across many researcher accounts within one organization) versus individual-researcher BYOK can both be modeled as `BYOKCredential` rows scoped at different account/organization granularity without changing the core schema shape.
- A future per-project BYOK override (rather than account-level only) is a possible extension but is not part of the current design and would need explicit scoping-rule changes if pursued.

## Security & Privacy
- **Never stored plaintext**: every `BYOKCredential.key material` field is envelope-encrypted at rest; the encryption key itself is held in a secrets manager, not the application database, so no single storage compromise yields a usable credential.
- **Never sent to the frontend**: the frontend receives only the Masked Reference; there is no code path, including admin/debug tooling, that returns decrypted or reversibly-masked key material to any client.
- **Never logged**: request/response logging, error tracing, and observability instrumentation at every layer (application, Gateway adapter, provider HTTP client) must explicitly exclude credential fields from any captured payload or header dump — this is a mandatory redaction rule, not an incidental one.
- Decrypted credential material exists only transiently in adapter process memory for the duration of a single outbound call and is not cached beyond what is strictly needed for call latency, minimizing the exposure window.
- Revocation must take effect immediately, including invalidating any short-lived in-memory resolver cache, so a revoked key cannot continue to be used for calls already in flight beyond a bounded grace window.

## Failure Modes
- **Credential leak via error echo** — a provider's error response echoes back request headers including the key, and that error is logged upstream unredacted; mitigated by redacting known credential-bearing headers/fields at the adapter boundary before any logging occurs, not relying on the provider to avoid echoing it.
- **Stale cached credential after revocation** — a resolver cache continues using a revoked key briefly; mitigated by keeping any resolver-side cache TTL short and by invalidating it explicitly on revocation rather than relying on TTL expiry alone.
- **Invalid/expired BYOK key at call time** — the provider rejects the credential; per Core Contract #11, the engine falls back to pooled credentials or a degraded response rather than failing the request outright, with the researcher notified that their BYOK key needs attention.

## Observability
- Count of BYOK-credential-related call failures (expired, revoked, rate-limited) surfaced to the account owner without ever surfacing the key itself.
- Rotation/revocation event log (who, when, which provider) for audit, containing no key material.
- Confirmation, via periodic automated redaction audits of logging output, that no credential field has appeared in logs — a process control, not a one-time check.

## P0/P1/P2/P3
**P1.** BYOK is a major product capability for institutional and power-user adoption, but the platform is fully functional on pooled credentials alone; however, the storage/redaction rules in this document (never plaintext, never to frontend, never logged) are treated as P0-grade security requirements the moment any BYOK capability ships, not optional hardening.

## Current Status
Documented, not implemented. No Credential Vault, resolver, or credential-entry UI exists yet.

## Open Questions
- Which secrets-manager product will hold the envelope-encryption key — not yet selected (REQUIRES VERIFICATION at infrastructure-decision time).
- Whether BYOK will launch at account level, organization/institution level, or both simultaneously.
- Grace-window length for in-flight requests after a revocation — not yet defined.
- Whether BYOK usage should be visually distinguished in Compare Mode outputs (see [AI COMPARE MODE.md](AI%20COMPARE%20MODE.md)) when only some providers in a compare set have a BYOK credential configured.

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md)
- [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md)
- [AI COMPARE MODE.md](AI%20COMPARE%20MODE.md)
- [AI TOOL PERMISSIONS.md](AI%20TOOL%20PERMISSIONS.md)
