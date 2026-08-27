# Event Bus & Workflows

## Purpose
Event Bus & Workflows is the pub/sub mechanism that lets domain modules react to state changes in other modules without being directly coupled to them. It exists because the Research OS is a modular monolith (Core Contract #10) with many modules that legitimately need to know when something happened elsewhere — a project's stage changed, a methodology was selected, a submission's status changed — without each module reaching into another module's internals or the caller having to know every interested subscriber.

## Scope
Covers domain-event publication and subscription across modules, and the multi-step workflows that are coordinated through event sequences (e.g. a project reaching a "writing complete" stage triggering Publication Intelligence to run readiness checks). Does not cover job dispatch/execution mechanics (that is [Background Jobs](./29%20BACKGROUND%20JOBS.md), a distinct mechanism this document may emit into or consume from, but does not own) and does not define any individual module's own domain event schema in detail — each module states its own emitted events in its own document; this document owns the bus mechanism and cross-module workflow choreography, not each event's payload contract.

## Responsibilities
- Provide the publish/subscribe mechanism domain modules use to emit and receive domain events without direct module-to-module calls for cross-cutting reactions.
- Guarantee at-least-once delivery semantics to subscribers, with idempotent handling expected on the subscriber side (a subscriber must tolerate receiving the same event more than once).
- Coordinate multi-step cross-module workflows that are naturally expressed as event chains rather than a single service's method call — e.g. `project.stage_changed` → Project Context Engine refreshes its snapshot → internal engines re-evaluate advisory state.
- Maintain an event catalog (which events exist, which module emits them, which modules subscribe) so cross-module dependencies stay visible instead of implicit.
- Preserve module boundaries under Core Contract #10: modules communicate via events and defined interfaces, not by directly querying each other's internal tables, even while co-located in one deployable.

## Non-Responsibilities
- Does not execute the actual work a job requires — event-triggered work that is heavy or long-running is dispatched to Background Jobs, not run inline inside an event handler.
- Does not define or own the payload schema of any specific domain event beyond the catalog's cataloging role — the emitting module owns its own event's shape (e.g. Research Core owns what `project.stage_changed` actually contains).
- Does not provide strict ordering or exactly-once delivery guarantees — workflows built on this bus must be designed to be idempotent and order-tolerant, not to assume a strict sequence.
- Does not call any third-party provider — event handlers that need to reach outside the system do so through the Integration Gateway like any other application code.

## Core Components
- **Event Bus** — the publish/subscribe transport modules use to emit and receive domain events, backed by the platform's queue/cache infrastructure per [Data Storage](./27%20DATA%20STORAGE.md).
- **Event Catalog** — the registry of known event types, their emitting module, and their known subscribers, kept current as modules are built.
- **Workflow Choreographer (conceptual)** — the pattern by which a multi-step cross-module process is expressed as a chain of emitted-and-subscribed events rather than a single orchestrating service owning every step.
- **Delivery Tracker** — records delivery attempts and failures per subscriber, supporting retry and dead-lettering for events a subscriber repeatedly fails to process.

## Owned Data
| Entity | Notes |
|---|---|
| DomainEvent | the published event envelope: type, emitting module, payload, timestamp, correlation id |
| EventSubscription | a registered subscriber (module + handler) for a given event type |
| EventDeliveryRecord | per-subscriber delivery attempt state, used for retry/dead-letter handling |

## Inputs
- Domain events emitted by any module reaching a state change worth broadcasting: Research Core's project lifecycle events, Publication Gateway's routing events, Submission Orchestration's submission-lifecycle events, Background Jobs' completion events.
- Subscription registrations from modules declaring interest in specific event types.

## Outputs
- Delivered events to every subscribed module's handler, at-least-once.
- The Event Catalog, consulted by anyone adding a new module or a new cross-module workflow, to see what already exists rather than duplicating an event type.
- Delivery failure signals feeding dead-letter handling and operational alerting.

## Dependencies
- [Data Storage](./27%20DATA%20STORAGE.md) for the underlying transport/queue backing the bus.
- [Background Jobs](./29%20BACKGROUND%20JOBS.md) as the destination for any heavy work an event handler needs to trigger.
- Emitted into by [Research Core](./02%20RESEARCH%20CORE.md) (project lifecycle events), [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md) and [Submission Orchestration](./24%20SUBMISSION%20ORCHESTRATION.md) (publication/submission events), and [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md) (context-refresh events).
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Sections 5 and 22 for the module-communication pattern this bus implements.

## Extension Points
- A new event type is added by any module registering it in the Event Catalog with its payload contract documented in that module's own document — the Bus itself requires no code change to carry a new type.
- A new cross-module workflow is composed by wiring new subscriptions onto existing (or newly added) event types, never by having one module call another module's internal service methods directly.
- A future move from modular monolith to extracted services (Core Contract #10, only once measured scaling need proves it) is substantially eased by workflows already being expressed as events rather than direct in-process calls — this is a deliberate design benefit of using the bus even while co-located.

## Security & Privacy
- Event payloads carrying private `ResearchProject` content (Core Contract #9) are only delivered to subscribers within the trusted backend — the bus is an internal mechanism, never exposed to the frontend or any external client directly.
- Event payloads should carry references (ids) to project data rather than full sensitive content where practical, so subscribers fetch what they need through normal authorized access paths rather than the event itself becoming an uncontrolled copy of private data.
- Delivery/audit records for sensitive event types (e.g. publication submission events) are retained consistent with the platform's audit-logging posture.

## Failure Modes
- **Subscriber processing failure**: retried per the Delivery Tracker's policy; a subscriber that fails repeatedly is dead-lettered and surfaced as an operational alert rather than silently dropping the event.
- **Duplicate delivery**: expected under at-least-once semantics; subscribers that are not idempotent risk incorrect double-processing — this is treated as a subscriber-implementation defect, not a bus defect.
- **Event storm from a runaway emitter**: a module emitting an unbounded volume of events (e.g. a bug causing repeated re-emission) — mitigated by per-event-type rate observability and circuit-breaking at the emitting module's own logic, since the bus itself does not throttle business logic.
- **Workflow partial completion**: a multi-step event-chain workflow completing some steps but not others (e.g. a downstream subscriber down) — surfaced via Delivery Tracker state so the workflow's true completion status is always inspectable, never assumed complete just because the first event was published.

## Observability
- Event volume and delivery latency per event type.
- Delivery failure and dead-letter rate per subscriber.
- Event Catalog completeness (events emitted but never subscribed to, or subscriptions referencing undocumented event types) as a documentation-hygiene signal.
- Cross-module workflow completion tracking for chains that matter operationally (e.g. project-stage-change → context-refresh → engine-re-evaluation).

## P0/P1/P2/P3
**P0.** Decoupled cross-module communication is foundational to keeping the modular monolith honest (Core Contract #10) — without a working event mechanism, modules either become directly coupled (undermining the extraction option later) or cross-module reactions simply don't happen reliably, both of which are architecture-integrity failures, not feature gaps.

## Current Status
Documented, not implemented. No Event Bus, Event Catalog, or subscription mechanism exists in code; this document defines the intended cross-module communication boundary ahead of implementation.

## Open Questions
- Whether the Event Bus is a distinct component from the Job Queue's transport or shares infrastructure with it, given both currently point at the same candidate backing store (Redis) per Data Storage.
- How the Event Catalog is kept in sync with actual code once implementation begins — generated from code annotations versus manually maintained documentation.
- Whether any event types need strict ordering guarantees badly enough to justify a different delivery mechanism for that subset (e.g. submission-status transitions, where out-of-order delivery could show a submission regressing state).

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [Data Storage](./27%20DATA%20STORAGE.md)
- [Background Jobs](./29%20BACKGROUND%20JOBS.md)
- [Research Core](./02%20RESEARCH%20CORE.md)
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md)
- [Submission Orchestration](./24%20SUBMISSION%20ORCHESTRATION.md)
