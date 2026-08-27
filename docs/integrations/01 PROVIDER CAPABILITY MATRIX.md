# Provider Capability Matrix — Standard Template

## Purpose
This document defines the exact 24-field template every per-provider document, in every category under `docs/integrations/`, must fill in — plus the verification-status vocabulary those fields draw on. It exists so that any provider's capability description (a scholarly-data source, a reference manager, a QDA tool, an AI writing assistant) is comparable field-by-field with every other provider's, regardless of which category or which contributor wrote it. Without this shared template, per-provider documents drift into inconsistent shapes and honest gaps ("we don't know yet") get silently dropped instead of stated.

## Scope
Covers the field list, the required order of fields, the meaning of each field, and the verification-status vocabulary those fields must use. Does not cover the call-pattern architecture a provider is accessed through (that is [Integration Gateway — Core Components](../architecture/25%20INTEGRATION%20GATEWAY.md#core-components)), the fallback chain a provider falls back to when unavailable (that is [Integration Gateway — Failure Modes](../architecture/25%20INTEGRATION%20GATEWAY.md#failure-modes)), or credential handling (that is [Integration Gateway — Security & Privacy](../architecture/25%20INTEGRATION%20GATEWAY.md#security--privacy)). Does not itself document any specific provider.

## Responsibilities
- Define all 24 fields, in required order, with what each one must answer.
- Define the verification-status vocabulary and the rule against inventing unverified capability.
- Require every per-provider document to also include an "Internal Replacement Principle" section and a "Related Documents" section after the 24 fields, per [Integration Gateway — Failure Modes](../architecture/25%20INTEGRATION%20GATEWAY.md#failure-modes) and [00 MASTER INTEGRATION MAP.md](./00%20MASTER%20INTEGRATION%20MAP.md) respectively.

## Non-Responsibilities
- Does not fill in the template for any real provider — that is the job of each category folder's own files.
- Does not define the Provider Interface/Adapter code contract — that is [Integration Gateway — Core Components](../architecture/25%20INTEGRATION%20GATEWAY.md#core-components).
- Does not decide which providers are P0 versus P2 — priority is stated per-provider inside the template itself (field 20), not decided here globally.

## Core Components

**The 24 required fields, in required order:**

| # | Field | Must answer |
|---|---|---|
| 1 | Provider | The provider's name, exactly as commonly known. |
| 2 | Category | Which `docs/integrations/` subfolder this provider belongs in. |
| 3 | Purpose | What problem this provider solves for a researcher inside a `ResearchProject`, in one or two sentences. |
| 4 | Official API Available | Yes / No / Partial / UNKNOWN, plus a one-line qualifier (e.g. "REST API, public, requires registration"). |
| 5 | Authentication | The auth scheme the provider uses (API key, OAuth2, none/public, institutional login) — mechanism only, no secrets. |
| 6 | Read Capabilities | What data can be retrieved from this provider, concretely (e.g. "search by DOI, fetch metadata, fetch citation counts"). |
| 7 | Write Capabilities | What data, if any, can be sent to this provider (e.g. "none — read-only source" or "deposit metadata + file"). |
| 8 | Webhooks/Event Support | Whether the provider can push events/changes to the Research OS, or whether all sync must be polled. |
| 9 | Supported Objects | The provider's own object types this integration touches (e.g. "article, author, journal, funder"). |
| 10 | Rate Limits | Known limits with source, or `UNKNOWN — requires verification against current official documentation`. |
| 11 | Commercial Use Constraints | Whether the provider's terms restrict commercial/for-profit use of its data or API. |
| 12 | Licensing/Data Restrictions | Data license (e.g. CC-BY, proprietary, no-redistribution) governing what the Research OS may store/display/re-export. |
| 13 | Partnership Required | Whether a formal partnership/licensing agreement is required for the intended usage — state plainly if none exists yet. |
| 14 | Internal Entity Mapping | Which internal canonical entity this provider's data normalizes into (e.g. `ResearchReference`, `ResearchProject` attachment). |
| 15 | Sync Direction | One of: inbound-only, outbound-only, bidirectional, or none (manual import/export only). |
| 16 | Caching Strategy | Whether/how responses are cached, and staleness tolerance appropriate to the data type. |
| 17 | Failure/Fallback Strategy | What happens when this provider is unavailable — link to the applicable step in [Integration Gateway — Failure Modes](../architecture/25%20INTEGRATION%20GATEWAY.md#failure-modes). |
| 18 | Security Considerations | Transport, credential storage, and abuse/injection risk specific to this provider's integration surface. |
| 19 | Privacy Considerations | What, if any, private `ResearchProject` content would leave the system to reach this provider, and under what consent. |
| 20 | Implementation Method | Which Provider Interface this provider's adapter would implement, per [Integration Gateway — Core Components](../architecture/25%20INTEGRATION%20GATEWAY.md#core-components). |
| 21 | Priority | P0/P1/P2/P3 for build sequencing, with a one-line justification. |
| 22 | Verification Status | Exactly one value from the vocabulary below. |
| 23 | Last Verified | A date, or the required placeholder text (see Security & Privacy below) if no live verification has occurred. |
| 24 | Source/Documentation Required | The official documentation URL/name this description was drawn from, or what access would be needed to verify. |

**Verification-status vocabulary (reused verbatim from [../MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)):**

| Status | Meaning |
|---|---|
| VERIFIED | Confirmed against current official documentation. |
| PARTIALLY VERIFIED | Some aspects confirmed; others (e.g. exact rate limits) are not. |
| REQUIRES ACCESS | Real capability confirmable only after obtaining a developer account/API key/sandbox. |
| REQUIRES PARTNERSHIP | Depends on a formal partnership/licensing relationship that does not exist yet. |
| INTEROPERABILITY ONLY | Export/format-compatible but no direct API relationship. |
| REFERENCE ONLY | Documented for context; not planned as a live integration. |
| UNKNOWN | Confidence insufficient to assign any of the above; must be stated explicitly. |

## Owned Data
This document owns no runtime data. It owns the field template and the verification-status vocabulary's practical application rules, both reference material.

## Inputs
- The verification-status vocabulary as authoritatively defined in [../MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md).
- The Internal Entity Mapping targets defined by Research Core's canonical models (e.g. `ResearchReference`), referenced but not redefined here.

## Outputs
- The exact field checklist every per-provider document under `docs/integrations/**` must satisfy.
- A shared vocabulary that lets any reader compare confidence level across two unrelated providers at a glance.

## Dependencies
- [00 MASTER INTEGRATION MAP.md](./00%20MASTER%20INTEGRATION%20MAP.md) — category index this template applies inside.
- [../MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md) — owns the vocabulary this document reuses.
- [Integration Gateway — Core Components](../architecture/25%20INTEGRATION%20GATEWAY.md#core-components) — field 20 (Implementation Method) points here.
- [Integration Gateway — Failure Modes](../architecture/25%20INTEGRATION%20GATEWAY.md#failure-modes) — field 17 (Failure/Fallback Strategy) points here.

## Extension Points
- A 25th field is added only by amending this document, never by one category inventing its own extra field locally — that would break comparability across categories.
- A field's meaning is clarified only here; per-provider documents fill in the field, they do not redefine what it means.

## Security & Privacy
- No field in this template may contain a live credential, token, or secret value — field 5 (Authentication) describes the *mechanism*, never an actual key. Actual credential handling is governed entirely by [Integration Gateway — Security & Privacy](../architecture/25%20INTEGRATION%20GATEWAY.md#security--privacy).
- Field 23 (Last Verified) must read exactly `Not yet verified against live source — architecture-phase estimate only` in every per-provider document until MetodePenelitian.com has an actual live integration with that provider, because none exist yet as of this writing.
- Field 19 (Privacy Considerations) is mandatory even for read-only providers — "no private data leaves the system for this provider" is itself the required answer where true, stated explicitly rather than omitted.

## Failure Modes
- **Fabricated capability**: a contributor states a specific rate limit, partnership, or write capability from memory without a source. Mitigated by the hard rule: if unsure, write `UNKNOWN — requires verification against current official documentation` rather than inventing a number.
- **Field skipped**: a per-provider document omits a field it finds inconvenient (e.g. Commercial Use Constraints). Mitigated by treating all 24 fields as mandatory — "not applicable" is an acceptable *answer*, an absent field is not.
- **Status inflation**: a provider is marked VERIFIED based on general familiarity rather than a checked source. Mitigated by requiring field 24 (Source/Documentation Required) alongside field 22 on every entry, so a VERIFIED claim always names what it was verified against.

## Observability
Documentation-phase artifact only; no runtime telemetry applies.

## P0/P1/P2/P3
**P0.** Every per-provider document across all sixteen categories depends on this template being stable and unambiguous; a change here after providers are documented forces a re-pass across the entire integrations tree.

## Current Status
Documented, not implemented. No per-provider document yet exists in any category folder; this template is the standard those future documents must follow from their first draft.

## Open Questions
- Whether Rate Limits (field 10) should eventually link to a machine-readable config once the Integration Gateway exists, rather than living only as prose in documentation.
- Whether Priority (field 21) should be cross-checked against a single roadmap document to prevent every category independently marking its own providers P0.

## Related Documents
- [00 MASTER INTEGRATION MAP.md](./00%20MASTER%20INTEGRATION%20MAP.md)
- [../MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [Integration Gateway — Security & Privacy](../architecture/25%20INTEGRATION%20GATEWAY.md#security--privacy)
- [Integration Gateway — Core Components](../architecture/25%20INTEGRATION%20GATEWAY.md#core-components)
- [Integration Gateway — Failure Modes](../architecture/25%20INTEGRATION%20GATEWAY.md#failure-modes)
- [../MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
</content>
