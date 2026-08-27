# AI Tool Calling Engine

## Purpose
The AI Tool Calling Engine is the component that lets an AI model, mid-conversation, invoke a defined internal capability (a literature search, a citation lookup, a data-normalization routine) and receive a structured result back, without the model ever being given direct access to a real integration or database. It exists so that "the model can search the literature" is implemented once, safely, and consistently, rather than each internal engine wiring its own ad hoc function-calling logic.

## Scope
Covers tool definition/registration, the request-model-executes-tool-returns-result loop, tool-result normalization, and authorization of which tools a given call context may use. Does not cover the underlying capability's implementation (e.g. the actual literature search logic lives in [Semantic Search / RAG](./09%20SEMANTIC%20SEARCH%20RAG.md) or [Knowledge Search](./08%20KNOWLEDGE%20SEARCH.md)) and does not cover model selection (that is the [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md), which carries tool-call turns through to whichever model is active).

## Responsibilities
- Maintain a registry of tools available to AI calls, each with a declared schema (name, parameters, description) in the normalized format the Gateway passes to whichever model is active.
- Receive a tool-call request emitted by a model mid-conversation (relayed through the Gateway), validate it against the tool's schema, and authorize it against the calling context (project, user, engine).
- Dispatch the validated call to the actual internal capability that implements the tool, wait for its result, and normalize that result back into the model-facing format.
- Enforce that every tool implementation reaches external data only via the [Integration Gateway](../MASTER%20INTEGRATION%20MAP.md) (Core Contract #4) or via Research Core/internal-engine logic — never by a tool handler calling a third-party provider directly.
- Guard against runaway or unsafe tool use: cap the number of tool round-trips per conversation turn, and reject tool calls outside a request's authorized scope.

## Non-Responsibilities
- Does not implement the substance of any tool (search ranking, citation normalization, etc.) — it only defines the calling contract and dispatches to the real implementation elsewhere.
- Does not select which AI model is in the conversation — it operates identically regardless of which provider/model the Gateway has routed to.
- Does not call external providers directly under any circumstances, even for a "simple" tool — everything crosses the Integration Gateway.
- Does not persist conversational memory — a tool result is returned for the current turn; anything that needs to be remembered across turns is [AI Memory & Context](./07%20AI%20MEMORY%20CONTEXT.md)'s responsibility.

## Core Components
- **Tool Registry** — declared schemas for every available tool, versioned, with the engine(s) permitted to use each.
- **Call Validator** — checks an incoming tool-call request against its declared schema before dispatch.
- **Authorization Guard** — checks the tool call against the requesting project/user's permissions (e.g. a tool that reads a user's private library must confirm the caller is authorized on that project).
- **Dispatcher** — routes the validated call to the real internal implementation (a Research Core query, a Literature & Evidence search, an Integration Gateway-backed lookup) and awaits the result.
- **Result Normalizer** — shapes the raw result into the structured, model-consumable format the Gateway relays back into the conversation.
- **Round-Trip Limiter** — caps sequential tool calls per turn to prevent runaway loops.

## Owned Data
| Entity | Notes |
|---|---|
| ToolDefinition | registered schema: name, parameters, description, permitted engines |
| ToolCallLog | per-call record: tool, requesting engine, project id, parameters, result status, latency |

## Inputs
- Tool-call requests emitted by a model during a conversation, relayed via the Multi-Model AI Gateway.
- Tool registration calls from internal engines declaring what capabilities they expose as tools.
- Authorization context (project id, user id, engine) attached to the originating request by the Research AI Orchestrator.

## Outputs
- Normalized tool results returned to the Gateway for inclusion in the ongoing model conversation.
- `ToolCallLog` entries for observability and abuse detection.

## Dependencies
- [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md) as the channel that carries tool-call requests and results between the model and this engine.
- [Research AI Orchestrator](./04%20RESEARCH%20AI%20ORCHESTRATOR.md) for the authorization context attached to each originating request.
- Tool implementations in [Literature & Evidence](./10%20LITERATURE%20EVIDENCE.md), [Knowledge Search](./08%20KNOWLEDGE%20SEARCH.md), and [Semantic Search / RAG](./09%20SEMANTIC%20SEARCH%20RAG.md), among others.
- The Integration Gateway (see [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)) for any tool that ultimately needs external data.

## Extension Points
- New tools register by declaring a schema and an implementation binding; the Registry, Validator, and Dispatcher require no tool-specific code changes.
- Per-tool authorization rules can be tightened or loosened independently (e.g. a tool restricted to paid-tier projects only) without touching the calling loop.
- Round-trip limits can be tuned per engine if some workflows legitimately need more tool turns than others.

## Security & Privacy
- The Authorization Guard is mandatory on every tool call — a model cannot use a tool to reach data the calling user/project is not itself authorized to see, preserving Core Contract #9 even inside an AI conversation.
- Tool implementations are contractually barred from direct external calls (Core Contract #4); this is treated as a hard boundary, enforced by code review and dependency policy, not just documentation.
- `ToolCallLog` parameters may contain project-sensitive content (e.g. a search query drawn from private research text) and inherit the same retention/visibility rules as the project itself.

## Failure Modes
- Tool implementation error/timeout: the Dispatcher returns a structured error result to the model rather than letting the conversation hang, allowing the model (and calling engine) to proceed in a degraded mode per Core Contract #11.
- Malformed tool-call request from a model: rejected by the Call Validator before dispatch, with the rejection reason returned to the model so it can retry correctly.
- Round-trip limit exceeded: the conversation turn is terminated gracefully with a clear reason, not a silent cutoff.

## Observability
- Tool-call volume and latency per tool.
- Tool-call failure/timeout rate per tool (surfaces flaky downstream implementations early).
- Authorization-denied tool-call rate (a spike may indicate a prompt-injection attempt against a tool boundary).
- Round-trip-limit-hit rate per engine (signals whether limits are tuned correctly for real workflows).

## P0/P1/P2/P3
**P0.** Structured, safe tool use is required for any AI engine that needs live project or literature data mid-reasoning (e.g. Evidence Synthesis); without it, engines would be forced into unsafe ad hoc integration patterns that violate Core Contracts #4 and #9.

## Current Status
Documented, not implemented. No tool registry, validator, or dispatcher exists yet; this document defines the intended calling contract ahead of implementation.

## Open Questions
- Exact tool-call schema format/versioning strategy as new AI providers with different native tool-calling conventions are added to the Gateway.
- Whether tool round-trip limits are global or configurable per engine/workflow.
- How tool results that are large (e.g. many search hits) are paginated or summarized before being returned into the model's context window.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER INTEGRATION MAP.md](../MASTER%20INTEGRATION%20MAP.md)
- [Multi-Model AI Gateway](./05%20MULTI%20MODEL%20AI%20GATEWAY.md)
- [Research AI Orchestrator](./04%20RESEARCH%20AI%20ORCHESTRATOR.md)
- [Knowledge Search](./08%20KNOWLEDGE%20SEARCH.md)
- [Semantic Search / RAG](./09%20SEMANTIC%20SEARCH%20RAG.md)
- [Literature & Evidence](./10%20LITERATURE%20EVIDENCE.md)
