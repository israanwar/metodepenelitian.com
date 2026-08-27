# Research AI Orchestrator

## Purpose
The Research AI Orchestrator is the coordination layer that turns a research-facing request (e.g. "help me choose a methodology," "synthesize this evidence") into the correct sequence of context retrieval, tool calls, and model invocation, then routes the result back to the requesting internal engine or frontend feature. It exists so that no individual internal engine has to independently implement "fetch context, decide which tools are needed, call the model, handle the response" — that orchestration logic lives once.

## Scope
Covers request routing from research-facing features into the AI stack, sequencing of context-fetch → tool-selection → model-call → response-handling, and coordination across multiple internal engines when a single user action needs more than one (e.g. a request that touches both the Methodology Advisor and Evidence Synthesis). Does not cover model selection/provider routing itself (that is the [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md)) and does not cover the internal engines' domain reasoning (Methodology Advisor, Analysis Advisor, etc. are separate documents in the internal-engines tree).

## Responsibilities
- Receive a research-facing AI request, identify which internal engine(s) it belongs to, and dispatch accordingly.
- Fetch the current [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md) snapshot for the relevant project and attach it to every downstream call so Core Contract #2 holds in practice, not just in principle.
- Decide, per request, whether tool calls (via the [AI Tool Calling Engine](./06%20AI%20TOOL%20CALLING%20ENGINE.md)) are needed before or during model reasoning (e.g. a literature search mid-conversation).
- Hand the assembled request (context + tool results + user input) to the [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md) for actual model dispatch.
- Sequence multi-engine workflows (e.g. "draft my methodology section" may require Methodology Advisor output before Evidence Synthesis can run) and hand back a single coherent response.
- Write significant AI-produced decisions back into Research Core (e.g. a selected methodology) so they become part of the project's structural state, not just conversational history.

## Non-Responsibilities
- Does not select which underlying AI model/provider handles a call — that is entirely the Gateway's job.
- Does not implement domain-specific reasoning itself (it does not know *how* to recommend a methodology) — it only knows *which* engine to invoke and *when*.
- Does not talk to any AI provider or external tool provider directly — all such calls pass through the Gateway or the Tool Calling Engine, never bypassed by the Orchestrator.
- Does not manage long-running background jobs itself — long/heavy work is handed off to the async job system (Core Contract #8), with the Orchestrator only initiating and later reading the result.

## Core Components
- **Request Router** — maps an incoming research-facing request to the responsible internal engine(s).
- **Context Attachment Step** — fetches the Project Context Engine snapshot and attaches it uniformly to every downstream call.
- **Tool-Need Detector** — determines whether a request requires a tool call before model reasoning can proceed (delegates the actual call to the Tool Calling Engine).
- **Multi-Engine Sequencer** — orders and chains calls across more than one internal engine for compound requests.
- **Result Writeback Handler** — persists AI-produced structural decisions back into Research Core.

## Owned Data
| Entity | Notes |
|---|---|
| OrchestrationRequestLog | which engine(s) handled a given request, in what order |
| MultiEngineWorkflowState | in-progress state for compound, multi-step requests |

The Orchestrator deliberately owns little persistent data of its own — it is a coordination layer, not a system of record.

## Inputs
- Research-facing AI requests from the frontend (via API) or from internal engines needing to chain into another engine.
- Context snapshots from the Project Context Engine.
- Tool results from the AI Tool Calling Engine.

## Outputs
- Fully assembled model requests handed to the Multi-Model AI Gateway.
- Coordinated, single-response replies back to the calling feature/frontend.
- Writeback events into Research Core for AI-produced structural decisions.

## Dependencies
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md) for context.
- [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md) for actual model dispatch.
- [AI Tool Calling Engine](./06%20AI%20TOOL%20CALLING%20ENGINE.md) for tool invocation during reasoning.
- [Research Core](./02%20RESEARCH%20CORE.md) as the target of structural writebacks.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) for the Orchestrator's position between research-facing features and the AI infrastructure layer.

## Extension Points
- New internal engines register with the Request Router without the Router needing engine-specific logic beyond the mapping rule.
- New multi-engine workflow patterns can be added to the Sequencer as new orchestration recipes.
- The Tool-Need Detector's rules are pluggable per engine, since different engines have different tool needs (Methodology Advisor rarely needs literature search; Evidence Synthesis almost always does).

## Security & Privacy
- Every dispatched request carries the requesting user's authorization context; the Orchestrator never elevates privilege on a user's behalf when chaining across engines.
- Multi-engine workflow state is project-scoped and inherits private-by-default rules (Core Contract #9) exactly as Research Core data does.
- The Orchestrator never persists raw provider responses beyond what's needed for the writeback and audit trail — that retention is scoped by [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).

## Failure Modes
- Downstream Gateway failure: Orchestrator surfaces a degraded response (e.g. cached/last-good engine output) rather than a hard error where an internal engine's degraded mode (Core Contract #11) allows it.
- Multi-engine sequencing failure mid-chain: partial results are not silently discarded — the Orchestrator either completes the remaining steps on retry or reports precisely which step failed.
- Context Engine unavailable: Orchestrator falls back to the last known-good context version rather than blocking the request entirely.

## Observability
- Per-engine request volume and latency, broken down by single-engine vs. multi-engine requests.
- Tool-call trigger rate per engine (signals whether the Tool-Need Detector's rules match real usage).
- Writeback success/failure rate into Research Core.
- End-to-end request latency from frontend request to final response.

## P0/P1/P2/P3
**P0.** Without the Orchestrator, no research-facing feature can safely reach the AI Gateway with correctly attached shared context — this is required for Core Contract #2 to hold operationally, not just structurally.

## Current Status
Documented, not implemented. No routing, sequencing, or writeback code exists yet; this document defines the intended coordination contract ahead of implementation.

## Open Questions
- Exact multi-engine chaining syntax/recipe format — declarative workflow definitions vs. hardcoded sequences per compound feature.
- How partial-failure recovery is surfaced to the frontend for multi-step compound requests.
- Whether the Orchestrator or the Gateway is responsible for request-level retry policy.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md)
- [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md)
- [AI Tool Calling Engine](./06%20AI%20TOOL%20CALLING%20ENGINE.md)
- [Research Core](./02%20RESEARCH%20CORE.md)
