# Billing & Entitlements

## Purpose
This document owns the billing lifecycle — plan catalog, subscription state transitions, payment collection, invoicing, usage-based metering, and proration — that produces the entitlement state Platform Core's Entitlement Ledger merely stores and every other module reads. It exists so that "how a researcher pays and what that buys them" is a single, coherent process rather than logic scattered across whichever module happens to check a quota.

## Scope
Covers subscription plans and tiers, the payment provider adapter relationship (behind the Integration Gateway), usage metering for consumption-based limits (notably AI Gateway call volume), invoice generation, dunning/failed-payment handling, and the resulting write path into the Entitlement Ledger. Does not cover the Entitlement Ledger's read-side data model or how other modules consume entitlement state day to day — that ownership boundary stays with [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md); this document produces the state, Platform Core serves it.

## Responsibilities
- Own the plan/tier catalog (free, individual paid tiers, institutional/campus licenses) and what each tier entitles a user or organization to.
- Own subscription lifecycle state (trial, active, past-due, canceled, institutional-seat-assigned) and the transitions between them.
- Own usage metering aggregation: counting AI Gateway calls, storage consumed, and other consumption-based dimensions per billing period, per user or organization.
- Own invoice generation and payment collection orchestration, delegated to a payment provider adapter behind the Integration Gateway (Core Contract #4) — never calling a payment processor directly.
- Own dunning logic (retry schedule, grace period, downgrade-on-failure) for failed payments.
- Write the resulting plan/quota state into Platform Core's Entitlement Ledger as the single source of truth other modules read.

## Non-Responsibilities
- Does not evaluate entitlement checks at request time (e.g. "can this user make one more AI call right now") — that read-path check is the Entitlement Ledger inside [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md).
- Does not implement payment processor API calls itself; all provider-specific request/response handling stays behind the Integration Gateway adapter (Core Contract #4), and the specific processor(s) chosen are UNKNOWN at this stage — no partnership or integration should be claimed until decided.
- Does not decide institutional contract pricing or negotiate enterprise deals — this document models the resulting entitlement structure, not the sales process.
- Does not send billing notification emails itself — it emits events consumed by the [31 NOTIFICATION ENGINE.md](31%20NOTIFICATION%20ENGINE.md).

## Core Components
- **Plan Catalog** — versioned definition of each tier's price, quota dimensions, and feature gates.
- **Subscription State Machine** — governs valid transitions (trial → active, active → past-due, past-due → canceled or reinstated, individual → institutional-seat).
- **Usage Metering Aggregator** — a background job that rolls up raw consumption events (e.g. AI Gateway call logs) into per-period totals per billing entity.
- **Invoice & Payment Orchestrator** — sequences invoice creation and payment collection through the payment provider adapter, without embedding processor-specific logic in Research Core or the frontend (Core Contract #5).
- **Dunning Engine** — retry/grace-period policy for failed or declining payments, culminating in a downgrade event if unresolved.

## Owned Data
| Entity | Notes |
|---|---|
| `Plan` | Tier definition: price, quota dimensions, feature gates. |
| `Subscription` | Current plan, state, billing entity (user or organization), renewal date. |
| `UsageMeter` | Per-period aggregated consumption per dimension (AI calls, storage) per billing entity. |
| `Invoice` | Generated billing document, line items, payment status. |
| `PaymentAttempt` | Record of a collection attempt via the provider adapter, outcome, retry count. |

## Inputs
- Raw consumption events from the AI Gateway, storage layer, and other metered modules.
- Plan/tier selection and upgrade/downgrade requests from the frontend.
- Payment provider webhook events, received only through the Integration Gateway adapter (Core Contract #4) and never processed directly by application code outside that boundary.
- Institutional license terms (seat count, contract period) entered by an institution admin, scoped per [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md).

## Outputs
- Entitlement state writes consumed by Platform Core's Entitlement Ledger.
- `billing.subscription_changed`, `billing.payment_failed`, `entitlement.quota_near_limit` domain events for the [31 NOTIFICATION ENGINE.md](31%20NOTIFICATION%20ENGINE.md) to route.
- Invoices rendered to the researcher/institution for their records.

## Dependencies
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md) — the Entitlement Ledger this module writes into and the Authorization Kernel gating who can change a subscription.
- [25 INTEGRATION GATEWAY.md](25%20INTEGRATION%20GATEWAY.md) for the payment provider adapter boundary (Core Contract #4).
- [05 MULTI MODEL AI GATEWAY.md](05%20MULTI%20MODEL%20AI%20GATEWAY.md) as the primary source of metered usage events.
- [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md) for institutional seat-based billing structure.
- Async background job infrastructure for usage aggregation and dunning schedules, per Core Contract #8.

## Extension Points
- New metering dimensions (e.g. a future per-storage-GB or per-export limit) can be added to `UsageMeter` without changing the Subscription State Machine.
- New payment providers can be added as new Integration Gateway adapters without touching this module's plan/subscription model.
- Institutional pricing models (per-seat, per-department, unlimited-seat campus license) can be added as new `Plan` shapes.

## Security & Privacy
- Payment card data is never stored by MetodePenelitian.com directly; only the payment provider adapter, behind the Integration Gateway, ever touches raw payment instrument data (typically via a hosted-field or tokenization flow appropriate to the eventual provider).
- Invoice and subscription records are billing data under the classification scheme in [32 SECURITY PRIVACY.md](32%20SECURITY%20PRIVACY.md), scoped to the owning user or organization, never cross-visible.
- Usage metering data reveals behavioral signal (how much AI a researcher uses) and is treated with the same access restrictions as other account-scoped data, not treated as free-for-all product analytics.

## Failure Modes
- **Payment provider adapter unavailable**: subscription state remains at its last known value; the platform does not immediately revoke access on a transient failure — it waits out the dunning grace period before any downgrade.
- **Usage metering aggregation lag**: entitlement checks fall back to the Entitlement Ledger's conservative (deny-if-uncertain) default per Platform Core's stated failure behavior, rather than allowing unmetered use.
- **Webhook delivery failure from payment provider**: reconciliation job re-polls provider state on a schedule so a single missed webhook does not permanently desync subscription status.
- **Double-billing or duplicate invoice**: prevented by idempotency keys on invoice generation; any detected duplicate is void-and-refund, never silently ignored.

## Observability
- Monthly recurring revenue, churn rate, and plan-tier distribution (product/business metrics, not just engineering health).
- Usage metering aggregation lag and job success rate.
- Payment success/failure rate and dunning funnel (attempted → recovered → downgraded).
- Entitlement write latency from this module into the Platform Core ledger.

## P0/P1/P2/P3
**P0.** Accurate entitlement state is required for safe core operation — without it, the AI Gateway and other quota-gated modules cannot correctly enforce limits, risking either unmetered cost exposure or wrongly blocking paying users. It is grouped with Platform Core as foundational infrastructure even though the product-facing billing UI itself can lag feature completeness.

## Current Status
Documented, not implemented. No plan catalog, subscription state machine, or payment adapter exists in code yet. No payment provider has been selected; any specific processor name would be speculative and is intentionally omitted.

## Open Questions
- Which payment provider(s) support Indonesian payment methods (e.g. bank transfer, e-wallets, cards) at the needed reliability — UNKNOWN, requires evaluation before the Integration Gateway adapter is designed.
- Whether AI usage is metered and capped per plan tier, or offered as unlimited-with-fair-use — affects the Usage Metering Aggregator's design significantly.
- Institutional billing model (per-seat vs. flat campus license vs. usage-based) — not yet decided with product/business stakeholders.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md)
- [32 SECURITY PRIVACY.md](32%20SECURITY%20PRIVACY.md)
- [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md)
- [31 NOTIFICATION ENGINE.md](31%20NOTIFICATION%20ENGINE.md)
