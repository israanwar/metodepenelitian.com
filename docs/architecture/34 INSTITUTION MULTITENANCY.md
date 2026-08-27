# Institution Multitenancy

## Purpose
This document defines how MetodePenelitian.com isolates one institution's (campus, faculty, lab) data from another's while both run inside the same modular monolith and shared database. It exists so that a university buying an institutional license can trust that its members' `ResearchProject` data is never visible to, or queryable by, another institution — without requiring a separate deployment per institution.

## Scope
Covers tenant identification, row-level data scoping, institution admin visibility boundaries, and the conditions under which the platform would ever move a tenant to physically isolated infrastructure. Does not cover individual-project sharing/collaboration permissions within an institution (that is the Authorization Kernel in [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md)) and does not cover billing terms for institutional licenses (that is [33 BILLING ENTITLEMENTS.md](33%20BILLING%20ENTITLEMENTS.md)).

## Responsibilities
- Define `Organization` (used interchangeably with "institution" or "tenant" in this document) as the top-level tenant boundary, already owned as an entity by Platform Core's Org & Membership Service.
- Enforce that every tenant-scoped table carries an explicit `organization_id` (or is reachable only through a foreign key chain back to one) and that every query path is scoped by it — shared-schema, row-level isolation, consistent with Core Contract #10's modular-monolith baseline.
- Define the institution admin role's visibility boundary: an institution admin manages membership, seats, and institution-level settings, but does not get blanket read access to member research content by default (Core Contract #9 applies within a tenant, not just across tenants).
- Define the criteria under which a specific tenant would be migrated to dedicated infrastructure (dedicated database, or dedicated deployment) if it outgrows shared-schema isolation, per Core Contract #10.
- Own cross-tenant leakage prevention as an explicit, testable property, not an incidental side effect of other authorization logic.

## Non-Responsibilities
- Does not implement a separate database or schema per tenant today — that is explicitly deferred until a measured scaling or contractual need proves it necessary (Core Contract #10).
- Does not define individual project-level or document-level sharing rules — those are finer-grained than tenant isolation and belong to the Authorization Kernel.
- Does not own institution billing/contract terms — see [33 BILLING ENTITLEMENTS.md](33%20BILLING%20ENTITLEMENTS.md).
- Does not grant AI providers or the Integration Gateway any tenant-differentiated behavior beyond entitlement/quota scoping — provider adapters remain tenant-agnostic per Core Contract #12.

## Core Components
- **Tenant Scoping Middleware** — a request-path enforcement layer that resolves the acting user's `organization_id` context and requires every data access to pass through it; conceptually part of the Authorization Kernel, called out here because tenant isolation is the specific property it must guarantee.
- **Tenant Data Ownership Map** — the enumerated list of which tables/entities are tenant-scoped (institution-affiliated users' projects, memberships, institutional settings) versus tenant-independent (a solo researcher's personal `ResearchProject` has no `organization_id` at all).
- **Institution Admin Console boundary** — the specific, limited set of institution-admin-visible views (seats, membership, aggregate usage) distinct from the [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md) platform-operator console.
- **Tenant Migration Criteria** — documented (not automated) thresholds — data volume, contractual data-residency requirement, or measured noisy-neighbor performance impact — that would trigger evaluating dedicated infrastructure for one tenant.

## Owned Data
| Entity | Notes |
|---|---|
| `Organization` | The tenant record itself (owned structurally by Platform Core; isolation rules owned here). |
| `TenantScopeAudit` | Log of cross-tenant access attempts denied by the Tenant Scoping Middleware, retained for security review. |
| `InstitutionSetting` | Tenant-level configuration (SSO requirement, default seat role, branding) distinct from any individual user's settings. |

## Inputs
- Every data-access request carrying (directly or via session) the acting user's organization membership context.
- Institution admin actions (seat assignment, member removal, institution settings changes).
- Solo (non-institutional) researcher activity, which this document must also correctly model as "no tenant" rather than forcing a default tenant.

## Outputs
- An allow/deny scoping decision on every tenant-scoped query, enforced before data reaches application logic.
- `TenantScopeAudit` entries for any denied cross-tenant access attempt, surfaced to security review.
- Institution-level aggregate views (seat usage, member count) exposed to the institution admin console without exposing individual project content.

## Dependencies
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md) for the `Organization`/`Membership` entities and the Authorization Kernel this scoping layer extends.
- [32 SECURITY PRIVACY.md](32%20SECURITY%20PRIVACY.md) for the private-by-default principle this document applies at the tenant level.
- [33 BILLING ENTITLEMENTS.md](33%20BILLING%20ENTITLEMENTS.md) for how institutional seat counts map to entitlement state.
- [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md) for how this differs from platform-operator-level access.
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) for the canonical data model that tenant scoping applies over.

## Extension Points
- Additional tenant tiers (e.g. a department-level sub-tenant within a university) can be modeled as a nested organization hierarchy without changing the isolation mechanism itself, if product need arises.
- SSO/institutional identity federation (SAML/OIDC) can be added per-tenant as an authentication method behind Platform Core's Identity Service without changing tenant scoping.
- A tenant that needs dedicated infrastructure can be migrated by re-pointing its scoped queries at a dedicated store, provided the Tenant Data Ownership Map already correctly enumerates its data — the shared-schema design is deliberately kept migration-compatible.

## Security & Privacy
- Tenant isolation is enforced at the data-access layer (shared schema, `organization_id`-scoped queries), not merely at the UI layer — a query that omits tenant scoping is treated as a defect regardless of whether the UI would have hidden the result.
- Institution admins are explicitly not granted default read access to member research content; any such access must be an explicit, auditable, per-project grant like any other collaborator grant, consistent with Core Contract #9 applying inside a tenant as well as across tenants.
- Cross-tenant access attempts (successful or denied) are logged to `TenantScopeAudit` as a security-relevant event, not just an application error.

## Failure Modes
- **Missing tenant scope on a new table**: treated as a P0 defect — any new tenant-affiliated entity added without `organization_id` scoping is a cross-tenant leakage risk, not a minor oversight.
- **Institution admin console over-fetching**: if an admin view accidentally surfaces project content instead of aggregate counts, this is treated as a privacy incident per [32 SECURITY PRIVACY.md](32%20SECURITY%20PRIVACY.md), not a cosmetic bug.
- **Ambiguous solo-vs-institutional user state**: a user who leaves an institution retains their own `ResearchProject` data as personal (no longer tenant-scoped) rather than the data becoming orphaned or inaccessible.
- **Noisy-neighbor performance impact from one large tenant**: monitored against the Tenant Migration Criteria rather than silently tolerated indefinitely.

## Observability
- Tenant scoping middleware denial rate (should be near zero in normal operation; a rise signals either a bug or a probing attempt).
- Per-tenant data volume and query load, tracked against the documented migration criteria thresholds.
- Institution admin console access patterns, to detect any drift toward over-broad visibility.

## P0/P1/P2/P3
**P0.** Tenant isolation is a precondition for selling any institutional license safely — a single cross-tenant leak would be a severe trust and legal failure, so this is foundational and required before institutional accounts can be offered at all.

## Current Status
Documented, not implemented. No `organization_id` scoping, Tenant Scoping Middleware, or institution admin console exists in code yet.

## Open Questions
- Whether institutional SSO (SAML/OIDC) is required at launch for target Indonesian universities, or can follow individual-tenant onboarding — UNKNOWN, needs institutional sales input.
- Concrete numeric thresholds for the Tenant Migration Criteria (data volume, query load) — not yet defined, deferred until real usage data exists per Core Contract #10.
- Whether a nested department-level tenant hierarchy is needed at launch or is a later addition — leans toward later, not yet decided.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md)
- [32 SECURITY PRIVACY.md](32%20SECURITY%20PRIVACY.md)
- [33 BILLING ENTITLEMENTS.md](33%20BILLING%20ENTITLEMENTS.md)
- [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md)
