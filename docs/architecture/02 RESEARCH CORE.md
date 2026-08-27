# Research Core

## Purpose
Research Core is the domain module that owns `ResearchProject`, the central aggregate of the entire Research OS (Core Contract #1). Every other domain module — the AI orchestrator, the internal engines, literature/evidence, publication routing, workflows — operates on data that ultimately hangs off a `ResearchProject`. Research Core exists to give that aggregate one authoritative owner instead of letting each feature module define its own notion of "a research project."

## Scope
Covers the `ResearchProject` aggregate and its direct sub-entities (research questions, methodology selection, chapters/sections, milestones, collaborators-on-a-project, project-level settings and visibility). Does not cover AI reasoning about the project (that is the [Research AI Orchestrator](./04%20RESEARCH%20AI%20ORCHESTRATOR.md) and the internal engines), and does not cover literature data itself (that is [Literature & Evidence](./10%20LITERATURE%20EVIDENCE.md)).

## Responsibilities
- Own the `ResearchProject` schema: identity, title, research domain/field, status/stage (e.g. planning, data collection, writing, review), owner, and collaborators.
- Own the project's structural sub-entities: research questions/hypotheses, chosen methodology reference, chapter/section outline, milestones/timeline.
- Enforce that every other module's project-scoped data (context snapshots, AI conversations, literature libraries, drafts) is attached to a `ResearchProject` id and inherits its access rules.
- Own project-level visibility and sharing rules (who besides the owner can view/edit), on top of Platform Core's generic authorization primitives.
- Emit project-lifecycle domain events (`project.created`, `project.stage_changed`, `project.methodology_selected`, etc.) that other modules subscribe to.

## Non-Responsibilities
- Does not perform AI reasoning, does not call AI models, does not decide methodology recommendations — it stores the *result* of those decisions, produced by the internal engines.
- Does not normalize or store literature/citation data itself — it references records owned by Literature & Evidence.
- Does not implement generic auth/roles — it consumes Platform Core's Authorization Kernel and adds project-specific policy on top.
- Does not manage publication submission — that is the Publication Gateway's domain, which only ever routes, never publishes (Core Contract #7).

## Core Components
- **ResearchProject Aggregate** — the root entity and its invariants (a project always has exactly one owner, a status, and a research domain).
- **Project Structure Service** — research questions, methodology reference, outline/chapters, milestones.
- **Project Membership & Visibility Service** — project-scoped collaborator roles layered on Platform Core's org roles; enforces private-by-default (Core Contract #9).
- **Project Lifecycle Event Emitter** — publishes state-change events for consumption by the Project Context Engine and internal engines.

## Owned Data
| Entity | Notes |
|---|---|
| ResearchProject | central aggregate root |
| ResearchQuestion / Hypothesis | project-scoped |
| MethodologySelection | reference to a chosen approach, not the advisory logic itself |
| ProjectOutline / Chapter / Section | structural skeleton of the research output |
| Milestone | timeline entries |
| ProjectCollaborator | project-scoped role binding |
| ProjectVisibilitySetting | private/shared/institution-visible state |

## Inputs
- Project creation and edit requests from the frontend, authenticated and authorized via Platform Core.
- Methodology/analysis decisions written back from the internal engines (e.g. Methodology Advisor selecting an approach).
- Literature attachment references from Literature & Evidence (project holds the reference, not the record).

## Outputs
- The canonical `ResearchProject` object and its sub-entities, read by nearly every other module.
- Project-lifecycle events consumed by the [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md) to keep the shared context current.
- Project-scoped authorization decisions consumed by AI, literature, and publication modules before they act on project data.

## Dependencies
- [Platform Core](./01%20PLATFORM%20CORE.md) for identity, org membership, and base authorization.
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md) reads Research Core's data to build the shared context object; Research Core does not depend on it.
- Internal engines (Methodology Advisor, Analysis Advisor) write structural decisions back into Research Core but are not documented in this batch.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) for the aggregate's place in the overall module map.

## Extension Points
- New project stages/statuses can be added to the lifecycle state machine without changing the aggregate's identity.
- New structural sub-entities (e.g. a future "data collection instrument" entity) attach to `ResearchProject` the same way existing sub-entities do.
- New project-level visibility tiers (e.g. institution-wide sharing) extend the Visibility Service without touching Platform Core's generic roles.

## Security & Privacy
- Private by default (Core Contract #9): a newly created `ResearchProject` is visible only to its owner until explicitly shared.
- Every read/write to project sub-entities is gated through project-scoped authorization, not just org-level roles — an org member is not automatically a project collaborator.
- Project deletion/archival must cascade correctly to dependent modules' data (context snapshots, AI conversation history) rather than leaving orphaned references — exact cascade/retention policy is an open question below.

## Failure Modes
- Aggregate write conflict (two collaborators editing structure concurrently): must fail safe with a conflict signal rather than silently overwriting.
- Lifecycle event emission failure: downstream context staleness in the Project Context Engine — treated as degraded-but-functional, not a hard outage, per Core Contract #11's spirit applied to internal consistency.
- Visibility misconfiguration: treated as a P0-severity bug class given Core Contract #9, regardless of how small the surface area seems.

## Observability
- Project creation/edit/archive rates.
- Distribution of projects by stage/status (product health signal).
- Authorization-denied rates on project-scoped resources.
- Lifecycle event publish latency and delivery success to subscribing modules.

## P0/P1/P2/P3
**P0.** `ResearchProject` is the central aggregate (Core Contract #1); no AI feature, literature feature, or publication feature can function without it. Foundational and required for safe core operation.

## Current Status
Documented, not implemented. No `ResearchProject` schema or service exists yet; this document defines the intended aggregate boundary ahead of implementation.

## Open Questions
- Exact cascade/retention policy when a project is archived or deleted (hard delete vs. soft delete vs. export-then-delete).
- Whether methodology/outline sub-entities are versioned (research plans change over the project lifecycle) and if so, how versioning is modeled.
- How multi-institution collaboration (two researchers from different organizations on one project) interacts with org-scoped Platform Core roles.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER PRODUCT ARCHITECTURE.md](../MASTER%20PRODUCT%20ARCHITECTURE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [Platform Core](./01%20PLATFORM%20CORE.md)
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md)
- [Literature & Evidence](./10%20LITERATURE%20EVIDENCE.md)
