# AI Memory & Context

## Purpose
AI Memory & Context owns cross-session, cross-conversation recall: what has this user/project told the AI before, what has the AI already recommended or been corrected on, and what stable preferences should be carried forward. It exists so that AI interactions feel continuous over the life of a research project instead of every conversation starting from zero, while keeping that recall as a distinct, explicitly-scoped layer rather than letting it silently balloon the [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md)'s current-state snapshot.

## Scope
Covers capture, summarization, and retrieval of interaction history and durable preferences at the project and user level. Does not cover current project structural state (that is Research Core, surfaced via the Project Context Engine) and does not cover document/literature retrieval (that is [Semantic Search / RAG](./09%20SEMANTIC%20SEARCH%20RAG.md)). Memory is about *what happened before*; context is about *what is true now* — the two are related but distinct inputs to an AI call.

## Responsibilities
- Capture salient outcomes from AI conversations (decisions made, corrections the user gave the AI, preferences expressed) rather than storing full raw transcripts as the primary retrieval unit.
- Summarize and compress interaction history over time so that recall stays useful and bounded rather than growing unboundedly with project age.
- Serve a relevant memory summary to the Project Context Engine (or directly to the Research AI Orchestrator, per the open question below) as one of the inputs to context assembly.
- Distinguish project-scoped memory (specific to one `ResearchProject`) from user-scoped memory (a researcher's general preferences that might apply across their projects), and keep the two from leaking into each other's scope.
- Provide a mechanism for a user to view and delete their stored memory, since it is derived from their own conversational content.

## Non-Responsibilities
- Does not assemble the full per-project context object — it supplies a memory summary as one input; the Project Context Engine remains the single assembler (Core Contract #2 stays owned there).
- Does not perform semantic document retrieval over literature — that is Semantic Search/RAG's domain even though both systems involve embeddings and retrieval.
- Does not call AI models directly to decide what to remember inline during a live request — memory extraction/summarization runs as an async background job (Core Contract #8), not inline on the request path.
- Does not act as the system of record for structural project decisions — a methodology selection is recorded by Research Core; memory may separately recall *how* that decision was arrived at conversationally.

## Core Components
- **Interaction Capture Hook** — records salient events from completed AI conversations (via the Research AI Orchestrator) rather than tapping raw model traffic directly.
- **Memory Summarizer** — an async background job that condenses captured interactions into durable memory entries, run periodically or after conversation milestones.
- **Memory Store** — project-scoped and user-scoped memory entries, retrievable by relevance to a current request.
- **Retrieval Interface** — the API the Project Context Engine (or Orchestrator) calls to fetch a relevant memory summary for a given project/user and current request.
- **User-Facing Memory Control** — the view/delete mechanism exposed to the end user over their own stored memory.

## Owned Data
| Entity | Notes |
|---|---|
| ProjectMemoryEntry | project-scoped durable memory, derived from interaction history |
| UserMemoryEntry | user-scoped durable preference/memory, cross-project |
| InteractionCaptureLog | raw captured events awaiting summarization |

## Inputs
- Completed AI conversation outcomes from the Research AI Orchestrator.
- Explicit user corrections/feedback surfaced during a conversation (e.g. "no, I prefer qualitative methods").
- User-initiated view/delete requests on their own memory.

## Outputs
- Memory summaries served to the Project Context Engine as one context input.
- Memory summaries served directly to internal engines where a direct read is more appropriate than round-tripping through the full context object (exact split is an open question below).
- User-facing memory listing for transparency/control.

## Dependencies
- [Research AI Orchestrator](./04%20RESEARCH%20AI%20ORCHESTRATOR.md) as the source of captured interaction events.
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md) as the primary consumer of memory summaries.
- Async background job infrastructure for the Memory Summarizer (Core Contract #8).
- See [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) for retention rules applicable to derived personal/behavioral data.

## Extension Points
- New memory categories (e.g. a future "writing style preference" memory type) can be added to the Memory Store's schema without changing the capture/retrieval contract.
- Summarization strategy is pluggable — the initial approach can be replaced with a more sophisticated one without changing how downstream consumers retrieve memory.
- User-scoped memory could later feed personalization features outside the AI conversation flow (e.g. dashboard recommendations), consuming the same store.

## Security & Privacy
- Memory is derived from private project/user conversational content and inherits private-by-default access (Core Contract #9) — never shared across users or organizations.
- User-scoped memory that could carry across projects is treated with extra caution: it must never leak project-specific confidential detail into a different project's context merely because the same user owns both.
- The view/delete control exists specifically because memory is inferred data about a person's research process, which carries higher sensitivity expectations than raw project content the user directly authored.
- Deletion requests must propagate to both the Memory Store and any not-yet-summarized `InteractionCaptureLog` entries, not just the summarized output.

## Failure Modes
- Summarizer job failure/backlog: recall degrades to older memory or no memory for recent interactions, rather than blocking the AI call that needs it — consistent with Core Contract #11 applied to this engine's own degraded mode.
- Cross-project memory leakage bug: treated as a P0 privacy incident given Core Contract #9, not a routine bug.
- Stale memory (contradicted by a later correction not yet summarized): acceptable short-term degradation, bounded by summarization job frequency.

## Observability
- Summarizer job latency, backlog size, and failure rate.
- Memory retrieval hit rate (how often a served memory summary is actually non-empty/relevant for a request).
- User-initiated memory deletion volume.
- Memory Store growth rate per project/user, to catch unbounded growth before it affects context size.

## P0/P1/P2/P3
**P1.** Cross-session continuity is a major product capability that meaningfully improves AI usefulness over a multi-month research project, but the platform's core AI features can function in a first version without it (each conversation would simply lack prior-session recall) — not required for safe core operation the way the Context Engine itself is.

## Current Status
Documented, not implemented. No capture hook, summarizer job, or memory store exists yet; this document defines the intended scope and boundary ahead of implementation.

## Open Questions
- Whether memory summaries are always routed through the Project Context Engine or sometimes read directly by an internal engine for efficiency.
- Exact summarization cadence (per-conversation vs. batched periodically).
- How long project memory persists after a project is archived, and whether user-scoped memory persists independently of any single project's lifecycle.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md)
- [Research AI Orchestrator](./04%20RESEARCH%20AI%20ORCHESTRATOR.md)
- [Semantic Search / RAG](./09%20SEMANTIC%20SEARCH%20RAG.md)
