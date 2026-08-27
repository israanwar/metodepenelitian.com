# Project Context Engine

## Purpose
The Project Context Engine is the shared context layer for the entire Research OS (Core Contract #2): it assembles a single, consistent context object per `ResearchProject` that every AI model — regardless of which engine or provider is invoked — reads from. It exists so that the Methodology Advisor, Analysis Advisor, Evidence Synthesis engine, and any future AI capability never disagree about what the project currently is, because they are never fed independently-assembled context.

## Scope
Covers assembly, versioning, and serving of the per-project context object: what goes into it, how it is kept current as the project changes, and the contract by which the [Research AI Orchestrator](./04%20RESEARCH%20AI%20ORCHESTRATOR.md) and internal engines request it. Does not cover the AI call itself (that is the [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md)) and does not cover long-term conversational memory (that is [AI Memory & Context](./07%20AI%20MEMORY%20CONTEXT.md), which is project-context's sibling for cross-session recall rather than current-state).

## Responsibilities
- Assemble a canonical context object from Research Core's current project state (structure, stage, methodology, outline) plus relevant summarized signal from Literature & Evidence and prior AI interactions.
- Keep the context object current by subscribing to `ResearchProject` lifecycle events and re-deriving affected sections rather than requiring every caller to re-fetch raw data itself.
- Version the context object so that a given AI call can be traced back to exactly the context snapshot it saw (needed for debugging and for reproducibility of AI outputs).
- Serve the context object through one uniform interface used identically by every internal engine and by the AI Tool Calling Engine, so context assembly logic exists in exactly one place.
- Apply context-size management (summarization/truncation policy) so the object stays within what downstream models can consume, without silently dropping information callers depend on.

## Non-Responsibilities
- Does not call any AI model itself — it is a data-assembly layer, not a reasoning layer.
- Does not decide methodology or analysis recommendations — engines consume the context to make those decisions, the engine does not live inside the Context Engine.
- Does not own the underlying project data — it reads Research Core, Literature & Evidence, and AI Memory & Context; it does not duplicate their source-of-truth role.
- Does not perform long-horizon conversational memory retrieval across sessions — that is AI Memory & Context's job; Project Context Engine's object represents current project state, not full interaction history.

## Core Components
- **Context Assembler** — builds the context object from Research Core + literature summary + memory summary on demand or on invalidation.
- **Context Versioning Store** — immutable snapshots keyed by project id + version, so a given AI call's input is reconstructable later.
- **Invalidation Subscriber** — listens to `ResearchProject` and Literature & Evidence lifecycle events and marks affected context sections stale.
- **Context Serving Interface** — the single API every AI-facing module calls to get "the current context for project X"; no module is permitted to assemble its own competing view.
- **Size/Summarization Policy** — deterministic rules for what gets included in full, what gets summarized, and what gets dropped when the object would otherwise exceed downstream model limits.

## Owned Data
| Entity | Notes |
|---|---|
| ProjectContextSnapshot | versioned, immutable, keyed by project + version |
| ContextInvalidationLog | which snapshot got superseded by which project event |
| ContextAssemblyPolicy | summarization/truncation rules (config, not per-project data) |

## Inputs
- `ResearchProject` lifecycle events and current structural state from Research Core.
- Summarized literature/evidence signal from Literature & Evidence.
- Summarized prior-interaction signal from AI Memory & Context.
- Explicit "get context for project X" requests from the Research AI Orchestrator and internal engines.

## Outputs
- The versioned `ProjectContextSnapshot` object, returned to every requesting engine identically.
- Context-version identifiers attached to every downstream AI call, enabling traceability back to the exact context an output was produced from.

## Dependencies
- [Research Core](./02%20RESEARCH%20CORE.md) as the primary source of project structural state.
- [Literature & Evidence](./10%20LITERATURE%20EVIDENCE.md) and [AI Memory & Context](./07%20AI%20MEMORY%20CONTEXT.md) as secondary summarized inputs.
- Consumed by [Research AI Orchestrator](./04%20RESEARCH%20AI%20ORCHESTRATOR.md), which passes the resulting snapshot into every AI call routed through the [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md).
- See [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md) for why a single shared context object is a governance requirement, not just an engineering convenience.

## Extension Points
- New summarized input sources (e.g. a future collaborator-feedback signal) can be added to the Assembler as additional context sections without changing the serving interface.
- Summarization policy is pluggable per model-class if different downstream models need different context shaping, as long as the underlying snapshot stays the single source of truth.
- Per-section invalidation can be extended as new lifecycle event types are introduced in Research Core.

## Security & Privacy
- Context snapshots inherit the private-by-default access rules of the underlying `ResearchProject` (Core Contract #9) — a context object is never assembled for, or served to, a caller not authorized on that project.
- Snapshots are project-scoped and never merged across projects, even for the same user, to avoid cross-project data leakage into an AI call.
- Because snapshots are immutable history, retention/deletion policy must be coordinated with Research Core's project deletion cascade so that deleting a project actually removes its context history.

## Failure Modes
- Assembly failure (a required upstream source is unavailable): engine calls proceed with the last known-good snapshot rather than blocking, consistent with Core Contract #11's degraded-but-functional principle.
- Stale snapshot served past its invalidation (bug in the Invalidation Subscriber): treated as a correctness bug, since every engine's output quality depends on freshness.
- Oversized context breaching a downstream model's limit: caught by the Size/Summarization Policy before dispatch, never truncated silently mid-call by the Gateway.

## Observability
- Snapshot assembly latency and failure rate.
- Snapshot staleness (time since last invalidation vs. time since last successful re-assembly).
- Context object size distribution (tracks summarization policy effectiveness over time).
- Which engines/callers request context most frequently, per project.

## P0/P1/P2/P3
**P0.** Every AI model reading the same context (Core Contract #2) is a foundational correctness requirement — without it, engines can silently diverge on what the project even is. Required for safe core operation of any AI feature.

## Current Status
Documented, not implemented. No context assembly service, snapshot store, or serving interface exists yet; this document defines the intended contract ahead of implementation.

## Open Questions
- Exact summarization algorithm/model for compressing literature and memory signal into the snapshot.
- Snapshot retention window — how long old versions are kept for traceability before pruning.
- Whether context assembly should be synchronous-on-request or continuously maintained in the background as project state changes.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [Research Core](./02%20RESEARCH%20CORE.md)
- [Research AI Orchestrator](./04%20RESEARCH%20AI%20ORCHESTRATOR.md)
- [AI Memory & Context](./07%20AI%20MEMORY%20CONTEXT.md)
