# Admin & Governance

## Purpose
This document defines the internal, platform-operator-facing tooling MetodePenelitian.com's own team uses to run the product safely: support access to a user's account when they ask for help, content moderation for anything user-generated and publicly visible (shared projects, public profiles), system-wide configuration, and the audit trail that makes every one of those actions accountable. It exists so that "the platform team can see everything" is never true by default — every admin action is scoped, logged, and justified.

## Scope
Covers the platform operator console, impersonation/support-access workflows, moderation queues, system configuration management, and the audit log that records admin actions. Does not cover institution admin capabilities (that is the much narrower [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md) admin boundary) and does not cover feature flag mechanics themselves (that is [37 FEATURE FLAGS EXPERIMENTATION.md](37%20FEATURE%20FLAGS%20EXPERIMENTATION.md), though flag *changes* are one of the actions this document's audit trail covers).

## Responsibilities
- Own the platform operator role hierarchy (e.g. support agent, engineer, compliance officer) distinct from any researcher- or institution-facing role.
- Own the support-access ("impersonation") workflow: a support agent viewing a user's account state to diagnose an issue, always time-boxed, always logged, always visible to the affected user after the fact.
- Own moderation of anything user-generated that becomes publicly visible outside the private-by-default boundary (e.g. a public project page, a shared research profile) — flagging, review queue, takedown.
- Own system-wide configuration that is not per-tenant (e.g. maintenance mode, global rate limits, default plan settings) as distinct from per-tenant [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md) settings.
- Own the immutable audit log of every admin action taken anywhere in the system.

## Non-Responsibilities
- Does not grant blanket read access to private `ResearchProject` content as a default operator privilege — Core Contract #9 applies to platform staff too; access requires the scoped, logged support-access workflow, not an ambient superuser role.
- Does not own institution-level admin capabilities (seat management, institution settings) — that is [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md).
- Does not own feature flag evaluation logic — only the governance record of who changed which flag when, per [37 FEATURE FLAGS EXPERIMENTATION.md](37%20FEATURE%20FLAGS%20EXPERIMENTATION.md).
- Does not perform automated content moderation via AI itself; if AI-assisted moderation is added later, the model call still routes through the [05 MULTI MODEL AI GATEWAY.md](05%20MULTI%20MODEL%20AI%20GATEWAY.md) like any other AI use, this document only owns the resulting queue and decision workflow.

## Core Components
- **Operator Console** — the internal application surface platform staff use; strictly separate codebase/route boundary from the researcher-facing product to reduce accidental privilege leakage.
- **Support-Access Workflow** — a request-justify-timebox-approve flow for any operator wanting to view a specific user's private data, distinct from and stricter than ordinary role-based authorization.
- **Moderation Queue** — holds flagged public-facing content (user reports, automated heuristic flags) pending operator review and action.
- **Audit Log** — append-only record of every admin action: who, what, on whose data, when, and the stated justification.
- **Global Configuration Store** — platform-wide settings not scoped to any single tenant.

## Owned Data
| Entity | Notes |
|---|---|
| `OperatorAccount` | Platform staff identity, distinct from researcher `User` accounts. |
| `OperatorRole` | Role assignment (support, engineering, compliance) with distinct permission scopes. |
| `SupportAccessGrant` | A time-boxed, justified grant of read access to one user's account, with expiry. |
| `ModerationFlag` | A flagged piece of public-facing content, its source (user report or heuristic), and resolution. |
| `AdminAuditEntry` | Immutable record of one admin action. |
| `GlobalConfig` | Platform-wide, non-tenant-scoped configuration values. |

## Inputs
- Support tickets or user reports requiring operator investigation.
- Content flags on public-facing user-generated content.
- Operator requests to change global configuration or take a moderation action.
- Every other module's admin-relevant actions, which must emit an event this document's Audit Log captures.

## Outputs
- `AdminAuditEntry` records, queryable for security review and, per contract with users, disclosed to an affected user when their data was accessed via `SupportAccessGrant`.
- Moderation decisions (content removed, restored, escalated) applied back to Research Core or the relevant module.
- Global configuration values consumed read-only by other modules.

## Dependencies
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md) for the Authorization Kernel that operator roles are evaluated against, distinct from researcher-facing roles.
- [32 SECURITY PRIVACY.md](32%20SECURITY%20PRIVACY.md) for the private-by-default principle this document's support-access workflow must not silently violate.
- [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md) to distinguish platform-operator scope from institution-admin scope.
- [37 FEATURE FLAGS EXPERIMENTATION.md](37%20FEATURE%20FLAGS%20EXPERIMENTATION.md) as one of the systems whose changes flow into the Audit Log.
- [36 OBSERVABILITY DEPLOYMENT.md](36%20OBSERVABILITY%20DEPLOYMENT.md) for how audit log volume and anomalies get surfaced operationally.

## Extension Points
- New operator roles (e.g. a future dedicated compliance-officer role for UU PDP requests) can be added to `OperatorRole` without restructuring the console.
- Automated moderation heuristics (e.g. spam detection on public profiles) can feed the Moderation Queue as an additional flag source without changing the review workflow.
- The Support-Access Workflow's approval requirement (self-serve with logging vs. requiring a second approver) is a policy knob that can tighten as the platform scales, without changing its underlying data model.

## Security & Privacy
- Every `SupportAccessGrant` is time-boxed, requires a stated reason, and is itself an `AdminAuditEntry` — there is no standing operator access to private research content.
- Operators authenticate through a separate credential/session path from researcher accounts to reduce the blast radius of any single credential compromise.
- The Audit Log is append-only and not editable by the operators it records, including platform engineers, to keep it trustworthy as a governance record.
- Affected users are notified when a `SupportAccessGrant` was used on their account, consistent with the transparency expectation behind private-by-default (Core Contract #9).

## Failure Modes
- **Support-access granted without justification or expiry**: treated as a P0 governance failure requiring immediate audit review, not a process gap to fix later.
- **Audit Log write failure**: the triggering admin action is blocked rather than allowed to proceed unlogged — an unaudited privileged action is treated as worse than a delayed one.
- **Moderation queue backlog**: degrades to slower takedown times, not silent content exposure; flagged content's public visibility can be automatically suspended pending review if backlog exceeds a threshold.
- **Global configuration misapplied platform-wide**: guarded by requiring staged rollout (per [37 FEATURE FLAGS EXPERIMENTATION.md](37%20FEATURE%20FLAGS%20EXPERIMENTATION.md)) rather than instant global config pushes for anything risk-bearing.

## Observability
- `SupportAccessGrant` issuance rate, duration, and justification text completeness.
- Moderation queue depth and time-to-resolution.
- Admin audit log volume and any gap/anomaly in expected event coverage (a module whose actions never appear in the audit log is itself a finding).
- Operator role distribution and permission-scope changes over time.

## P0/P1/P2/P3
**P0.** Governed, auditable admin access is a precondition for operating the platform responsibly at all — without it, "private by default" (Core Contract #9) is only a policy statement with no enforcement against the platform's own staff.

## Current Status
Documented, not implemented. No operator console, support-access workflow, or audit log exists in code yet.

## Open Questions
- Whether support-access grants require a second-approver step at launch scale, or self-serve-with-logging is sufficient initially.
- Exact moderation policy for public-facing content (what is flaggable, takedown SLA) — not yet defined with product/trust-and-safety stakeholders.
- Whether UU PDP data-subject-request handling (a user requesting their data or deletion) is built as part of this admin console or as a separate compliance tool — UNKNOWN, needs legal input.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md)
- [32 SECURITY PRIVACY.md](32%20SECURITY%20PRIVACY.md)
- [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md)
- [36 OBSERVABILITY DEPLOYMENT.md](36%20OBSERVABILITY%20DEPLOYMENT.md)
- [37 FEATURE FLAGS EXPERIMENTATION.md](37%20FEATURE%20FLAGS%20EXPERIMENTATION.md)
