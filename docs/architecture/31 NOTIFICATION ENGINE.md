# Notification Engine

## Purpose
The Notification Engine decides *what* a researcher, lab, or institution should be told and *when* — a new co-author joined a `ResearchProject`, an AI engine finished a long-running synthesis job, a submission deadline from the Publication Gateway is approaching, a quota is near its limit. It is the decision layer that sits above Platform Core's generic dispatch plumbing, translating domain events into user-facing notification content, priority, and channel routing.

## Scope
Covers notification triggering rules, per-user channel and frequency preferences, digesting/batching logic, templated content per notification type, and read/unread state. Does not cover the low-level send mechanics of email or push delivery (that is the Notification Dispatcher inside [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md)) and does not cover marketing/lifecycle email campaigns, which are a separate growth-marketing concern outside the Research OS boundary.

## Responsibilities
- Subscribe to internal domain events from every module (Research Core, internal engines, Publication Gateway, Billing & Entitlements) and decide which events are notification-worthy.
- Own per-notification-type rules: default channel (in-app, email, both), default priority, and whether it is batchable into a digest.
- Own each user's notification preferences (per type, per channel, quiet hours) and honor them before handing anything to the Dispatcher.
- Own digest assembly (e.g. a daily "what happened in your projects" email) so the Dispatcher only ever sends one already-composed message.
- Own read/unread and dismissal state for in-app notifications.
- Deduplicate near-identical events (e.g. five reference-import completions in one minute become one notification) before they reach a user.

## Non-Responsibilities
- Does not perform the actual send (SMTP, push provider call) — that is delegated to the Notification Dispatcher in Platform Core, which in turn uses provider adapters behind the Integration Gateway.
- Does not decide authorization (whether a user is even allowed to see the event that triggered a notification) — it trusts the event's own scoping, which is enforced upstream by the Authorization Kernel.
- Does not generate AI-written notification content; templates are engineer/product-authored, not model-generated, to keep delivery deterministic and fast.
- Does not own billing dunning emails' business logic (amounts, retry schedule) — those originate from [33 BILLING ENTITLEMENTS.md](33%20BILLING%20ENTITLEMENTS.md) as pre-decided events this engine only routes.

## Core Components
- **Event Subscriber** — internal event-bus listener registered for a whitelisted set of domain event types per Platform Core's Module Registry contract.
- **Rule Evaluator** — maps an incoming event plus the recipient's preferences to a delivery decision (send now, batch into digest, suppress).
- **Template Renderer** — fills a versioned template (per notification type, per locale — Bahasa Indonesia and English at minimum) with event data.
- **Digest Compiler** — a scheduled background job that assembles pending batchable notifications into one digest per user per cadence.
- **Preference Store** — per-user, per-notification-type channel and frequency settings.

## Owned Data
| Entity | Notes |
|---|---|
| `NotificationType` | Registry of known notification kinds, default channel/priority/batchability. |
| `NotificationPreference` | Per-user override of channel/frequency per type. |
| `NotificationInstance` | A generated notification: recipient, type, payload, read state, channel(s) chosen. |
| `DigestBatch` | Pending notifications grouped for the next digest send. |

## Inputs
- Domain events from every other module on the internal event bus (e.g. `project.member_added`, `engine.job_completed`, `publication.deadline_approaching`, `entitlement.quota_near_limit`).
- User notification preference changes from the frontend.
- Scheduled ticks (digest cadence) from the background job scheduler.

## Outputs
- `NotificationInstance` records, queried by the frontend for the in-app notification center.
- Send requests (already rendered content, resolved channel, resolved recipient) handed to Platform Core's Notification Dispatcher.
- Digest content assembled and handed to the Dispatcher on schedule.

## Dependencies
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md) for the Notification Dispatcher and the internal event bus contract this engine subscribes to.
- [02 RESEARCH CORE.md](02%20RESEARCH%20CORE.md) and internal engines as event producers.
- [33 BILLING ENTITLEMENTS.md](33%20BILLING%20ENTITLEMENTS.md) as an event producer for quota and billing-state notifications.
- Async background job infrastructure for digest compilation, per [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) (Core Contract #8: nothing here runs inline on a request).

## Extension Points
- New `NotificationType` entries can be registered by any module without changing the Rule Evaluator's core logic.
- New channels (push, WhatsApp, SMS) are added as new Dispatcher-side adapters; this engine only needs a new preference/channel enum value.
- Digest cadence is configurable per notification type (daily, weekly) without new code.

## Security & Privacy
- Notification payloads never carry more research content than the minimum needed to identify the event (e.g. project name, not full document text), limiting blast radius if a delivery channel is compromised.
- Preference and instance data is scoped to the owning user; no cross-user notification content is ever queryable. See [Security & Privacy documents](../security/) for the platform-wide model this engine inherits.
- Institution-wide broadcast notifications (e.g. an admin announcement) are authorized through the same Authorization Kernel role checks as any other institution-scoped action, per [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md).

## Failure Modes
- **Event bus backlog**: notifications are delayed, not lost — this engine treats itself as eventually consistent and never blocks the event producer.
- **Dispatcher unavailable**: notification instances are still created and visible in-app; only outbound email/push is deferred and retried, satisfying Core Contract #11's degraded-but-functional expectation even though this is not an AI-facing engine.
- **Preference store unreadable**: engine falls back to the conservative default (send via the type's default channel) rather than silently dropping a notification.
- **Digest job failure**: partially compiled digests are retried on the next scheduled tick rather than sent incomplete.

## Observability
- Event-to-notification latency, per notification type.
- Per-channel send success/failure rate (surfaced from the Dispatcher).
- Digest compile duration and batch size distribution.
- Notification volume per user (a spike signals either a noisy producer module or a preference-store bug).

## P0/P1/P2/P3
**P1.** Notifications are a major usability capability — researchers rely on them to know when long AI jobs finish or deadlines approach — but the platform is safely usable without them (all state remains visible in-app on refresh), so this sits below the P0 identity/authorization/gateway layer.

## Current Status
Documented, not implemented. No event subscriber, rule evaluator, or preference store exists in code yet.

## Open Questions
- Whether institution admins can force-enable certain notification types (e.g. compliance deadlines) past a user's own preference.
- Exact digest cadence defaults per notification type — not yet decided with product.
- Whether WhatsApp is a near-term channel given its prevalence among Indonesian academic users — UNKNOWN, requires product decision before an adapter is designed.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md)
- [33 BILLING ENTITLEMENTS.md](33%20BILLING%20ENTITLEMENTS.md)
- [34 INSTITUTION MULTITENANCY.md](34%20INSTITUTION%20MULTITENANCY.md)
- [36 OBSERVABILITY DEPLOYMENT.md](36%20OBSERVABILITY%20DEPLOYMENT.md)
