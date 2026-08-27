# Platform Core

## Purpose
Platform Core is the non-research-domain foundation every other module of MetodePenelitian.com builds on: identity, tenancy, authorization, billing/entitlement, notification dispatch, and the modular-monolith module registry itself. It exists so that Research Core and the AI layer never have to re-implement "who is this user, what can they do, what plan are they on" logic themselves.

## Scope
Covers account/identity, organization/team membership, role and permission checks, subscription/entitlement state, cross-module event bus conventions, and the module boundary rules that keep the codebase a modular monolith. Does not cover anything about research content itself (that is [Research Core](./02%20RESEARCH%20CORE.md)) and does not cover AI behavior.

## Responsibilities
- Own user accounts, sessions, and authentication state.
- Own organizations/institutions and membership of users within them (a user may belong to a campus/lab workspace as well as work solo).
- Own role-based and resource-based authorization primitives used by every other module (e.g. "is this user an editor of this ResearchProject").
- Own subscription tier, quota, and entitlement state (e.g. AI call quota, storage quota, seat count) that other modules read but do not mutate.
- Define and enforce the internal module-boundary contract: modules talk to each other through defined interfaces/events, never by reaching into each other's tables directly.
- Own transactional notification dispatch plumbing (email/in-app), not the content decisions of what to notify about.

## Non-Responsibilities
- Does not decide research-domain business rules (project structure, methodology logic) — that lives in Research Core and the internal engines.
- Does not talk to AI providers or scholarly data providers directly.
- Does not own billing provider integration details (payment processor specifics live behind the Integration Gateway as an adapter; Platform Core owns only the resulting entitlement state).
- Does not enforce per-project data visibility rules beyond exposing the primitives — fine-grained research-data privacy rules are owned by Research Core (Core Contract #9).

## Core Components
- **Identity Service** — accounts, sessions, credential/OAuth state.
- **Org & Membership Service** — organizations, teams, membership rows, invitations.
- **Authorization Kernel** — role/permission evaluation used as a library by every module.
- **Entitlement Ledger** — current plan, quotas, usage counters (consumed, not owned, by AI Gateway and others).
- **Module Registry / Event Bus Contract** — internal pub/sub conventions so modules stay decoupled inside the monolith.
- **Notification Dispatcher** — generic send-email/send-in-app-notification worker, queued as a background job per Core Contract #8.

## Owned Data
| Entity | Notes |
|---|---|
| User | account/auth identity |
| Organization | institution/lab/team workspace |
| Membership | user-to-org role binding |
| PermissionGrant | resource-scoped role assignment |
| Subscription / EntitlementState | plan, quota counters |
| NotificationRecord | dispatch log, delivery status |

## Inputs
- Signup/login requests from the frontend.
- Role/permission checks called synchronously by every other module before a mutating action.
- Entitlement checks called by the [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md) before authorizing an AI call.
- Billing/plan change events from the payment adapter behind the Integration Gateway.

## Outputs
- Authorization decisions (allow/deny + reason) consumed synchronously by all modules.
- Entitlement/quota state consumed by AI Gateway and Research Core.
- Notification events (queued, async).
- Domain events (e.g. `user.joined_org`, `subscription.changed`) on the internal event bus for other modules to react to.

## Dependencies
- No dependency on Research Core or the AI layer — Platform Core sits below them.
- Depends on the Integration Gateway only for the payment-provider adapter's resulting webhook events, never calling any provider directly itself.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) for how Platform Core sits at the base of the module stack.

## Extension Points
- New role types and permission scopes can be added without changing the Authorization Kernel's evaluation engine.
- New entitlement dimensions (e.g. a future "AI compute credits" quota) can be added to the Entitlement Ledger as new counters.
- New notification channels (push, SMS) can be added to the Notification Dispatcher as new delivery adapters.

## Security & Privacy
- Credentials are never stored in plaintext; session tokens are the only bearer artifact passed to the frontend.
- Authorization checks are mandatory and centralized — no module is permitted to implement its own ad hoc permission logic (this is what keeps Core Contract #9, private-by-default research data, actually enforceable).
- Entitlement/quota state is treated as security-relevant (it gates AI spend and data access), not just billing metadata.

## Failure Modes
- Identity/session outage: entire platform becomes unusable; this is the single highest-blast-radius failure in the system.
- Authorization Kernel bug (false allow): treated as a P0 security incident, not a bug ticket.
- Entitlement Ledger drift (quota miscounted): degrades gracefully by defaulting to the more conservative (deny/limit) reading rather than allowing unmetered use.
- Notification Dispatcher outage: degrades silently — no user-facing action blocks on it, notifications queue and retry.

## Observability
- Auth success/failure rates, session churn.
- Permission-denied rates per module (a spike signals either an attack pattern or a UX bug).
- Entitlement quota consumption vs. limit, per organization.
- Notification delivery success/failure and latency.

## P0/P1/P2/P3
**P0.** Nothing else in the system — Research Core, AI Gateway, Integration Gateway — can safely operate without identity, authorization, and entitlement state. This is foundational infrastructure required for safe core operation.

## Current Status
Documented, not implemented. No Platform Core code, schema, or service exists yet; this document describes the intended module boundary for future implementation.

## Open Questions
- Single identity provider vs. pluggable auth (institutional SSO for campuses) — sequencing not yet decided.
- Whether organization-level and project-level roles are a single permission model or two layered models.
- Exact shape of the entitlement counters needed once AI usage-based billing is designed.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [Research Core](./02%20RESEARCH%20CORE.md)
- [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md)
