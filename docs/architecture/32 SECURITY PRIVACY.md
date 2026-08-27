# Security & Privacy

## Purpose
This document is the architecture-level summary of how MetodePenelitian.com protects researcher identity, research content, and institutional data. It states the security posture every module must satisfy; it does not re-derive the detail. The authoritative, implementation-level breakdown (threat model, encryption specifics, incident response runbooks, compliance mapping) lives in [docs/security/](../security/) and this document must never be treated as a substitute for reading those files once they exist.

## Scope
Covers the cross-cutting security and privacy principles that apply to every module: private-by-default research data (Core Contract #9), authentication/authorization ownership, data classification, encryption posture, and how MetodePenelitian.com relates to Indonesian data protection law. Does not cover module-specific security details (e.g. how the AI Gateway prevents prompt injection, or how the Publication Gateway avoids leaking a manuscript to the wrong destination) — those live in each module's own Security & Privacy section and, where depth is needed, under [docs/security/](../security/).

## Responsibilities
- State the platform-wide default: every `ResearchProject` and its contents are private to the owning researcher and explicitly-granted collaborators unless the researcher deliberately shares or publishes it (Core Contract #9).
- Require that authentication and authorization are owned exclusively by Platform Core's Authorization Kernel ([01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md)) — no module may implement its own ad hoc access check.
- Require that no provider-specific credential, token, or implementation detail ever appears outside the Integration Gateway / AI Gateway adapter layer (Core Contracts #3, #4, #12).
- Define the platform's data classification tiers (identity data, research content, billing data, derived/AI-generated content) at a level every module's data model must map onto.
- Point every module toward [docs/security/](../security/) for depth rather than letting each module invent its own security narrative.

## Non-Responsibilities
- Does not implement encryption, key management, or access-control code — this is architecture documentation only.
- Does not define per-provider data processing agreements or legal review outcomes — that is compliance/legal work tracked outside this document tree.
- Does not duplicate the detailed threat model, incident response runbook, or compliance control mapping — those belong in [docs/security/](../security/) and must not be re-authored here at length.
- Does not own the entitlement/quota data itself (that is [33 BILLING ENTITLEMENTS.md](33%20BILLING%20ENTITLEMENTS.md)), only the classification of it as security-relevant.

## Core Components
- **Platform-wide privacy default** — private-by-default enforcement point is the Authorization Kernel, invoked by every module before any read or write.
- **Data classification scheme** — a small, stable set of tiers (identity, research content, AI-derived content, billing/financial, operational/telemetry) that every new table or object must be tagged against.
- **Cross-module security review gate** — conceptually, no new provider integration or new data flow is considered architecturally sound until it is checked against Core Contracts #3, #4, #5, #6, #12.

## Owned Data
This document owns no data itself; it defines the classification labels other modules apply to their own owned data. The authoritative registry of which entity belongs to which classification tier belongs in [docs/security/](../security/) once written, not duplicated here.

## Inputs
- Core Contracts #9 and #12 as the non-negotiable baseline this document elaborates.
- Every module's own data model, which must be classifiable under this document's tiers.
- Applicable Indonesian legal context — notably Law No. 27/2022 on Personal Data Protection (UU PDP) — as the regulatory floor for how personal and research-subject data is handled. Specific control-level compliance mapping is UNKNOWN at this stage and belongs in [docs/security/](../security/), not invented here.

## Outputs
- A shared vocabulary (classification tiers, privacy default, contract references) that every architecture, engine, and integration document cites in its own Security & Privacy section instead of re-deriving.
- A pointer surface: this document is often the first hop a reader takes before going to [docs/security/](../security/) for depth.

## Dependencies
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md) for the Authorization Kernel that enforces everything stated here.
- [25 INTEGRATION GATEWAY.md](25%20INTEGRATION%20GATEWAY.md) and [26 EXTERNAL PROVIDERS.md](26%20EXTERNAL%20PROVIDERS.md) for how Core Contracts #3/#4/#12 are enforced at the provider boundary.
- [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md) for how privacy-by-default interacts with institutional/tenant admin visibility.
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) for the canonical data model this classification scheme applies to.

## Extension Points
- New classification tiers can be added if a genuinely new category of data emerges (e.g. survey respondent PII once [12 RESEARCH GAP ENGINE.md](12%20RESEARCH%20GAP%20ENGINE.md)-adjacent survey tooling ships), but existing tiers should not be redefined casually since every module cites them.
- Regional compliance extensions (e.g. a future EU-facing GDPR posture) can be layered on top of the UU PDP baseline without changing the core private-by-default model.

## Security & Privacy
This entire document is a Security & Privacy document by nature; its content above is not repeated here. The single load-bearing statement is: **research project data is private by default, authorization is centralized in one Kernel, and no provider ever sees more than the Integration/AI Gateways deliberately expose to it.** Depth lives in [docs/security/](../security/).

## Failure Modes
- **A module implements its own access check instead of using the Authorization Kernel**: treated as a P0 architectural violation, not a style issue, because it is exactly the failure mode that breaks Core Contract #9.
- **A new integration bypasses the Integration/AI Gateway**: treated as a P0 violation of Core Contracts #3/#4/#12 and must be corrected before ship, regardless of short-term convenience.
- **Classification tier ambiguity for a new entity**: resolved conservatively — treat unclassified data as research content (the most restrictive default) until explicitly classified otherwise.

## Observability
- Cross-module audit of any direct provider call bypassing the Integration/AI Gateway (a static/architecture-review concern at this stage, not yet a runtime metric).
- Authorization-denial rate per module, owned operationally by Platform Core but relevant here as a privacy-default health signal.
- Tracking of which modules have an explicit, filled-in Security & Privacy section versus a placeholder — a documentation-completeness signal during this architecture phase.

## P0/P1/P2/P3
**P0.** Private-by-default data handling and centralized authorization are required for the platform to be safe to operate at all; no feature ships ahead of this baseline being sound.

## Current Status
Documented, not implemented. `docs/security/` is currently an empty directory reserved for the detailed breakdown; this summary is written ahead of that depth being authored. No code enforces any of this yet.

## Open Questions
- Exact UU PDP compliance control mapping — requires legal/compliance input, not yet started.
- Whether institutional (campus) admins get any elevated visibility into member research data by default, or only by explicit per-project grant — leans toward the latter per Core Contract #9 but not yet finalized; see [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md).
- Data residency requirements (whether research data must stay on Indonesia-based infrastructure) — UNKNOWN, requires legal and infrastructure decisions.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md)
- [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md)
- [docs/security/](../security/) — detailed, implementation-level security documentation (not yet written)
