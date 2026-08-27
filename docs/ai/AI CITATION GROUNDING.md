# AI Citation Grounding

## Purpose
This document defines how any citation appearing in AI-generated text is verified against a real, normalized `ResearchReference` record before it is shown to a researcher — the specific mechanism that prevents a model from fabricating a source, misattributing a claim to a real source, or citing a source outside the researcher's own project context without disclosure. It is the concrete enforcement layer that [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md)'s "grounded" tier depends on.

## Scope
Covers the citation-resolution pipeline for AI outputs across all engines that generate citing text: Evidence Synthesis Engine summaries, Research Gap Engine claims, Methodology Advisor recommendations that cite methodological sources, and Research AI Orchestrator chat. Does not cover general hallucination classification beyond citations (non-citation factual claims) — see [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md). Does not cover how external scholarly metadata is normalized into `ResearchReference` in the first place — that ingestion and normalization pipeline belongs to Core Contract #6 and the scholarly-data integration layer, referenced but not owned here.

## Responsibilities
- Require that any inline citation a model produces resolve to a specific `ResearchReference` id known to the current `ResearchProject`'s context, not to a free-text author/year string the model generated on its own.
- Reject or re-flag (never silently render) a citation the model produces that cannot be resolved to a known reference — the response is returned to the researcher with the unresolved citation marked, not dropped silently, so the gap is visible.
- Distinguish two grounding levels for a resolved citation: **in-project** (the reference is part of this project's own library/synthesis set) and **general** (the reference is a real, resolvable scholarly work but was not part of what the researcher supplied — the model introduced it from its own training knowledge).
- Pass the resolved reference id, not just display text, to the UI so a researcher can click through to the actual `ResearchReference` record and its normalized metadata.
- Prevent the AI Gateway from constructing citation-shaped text (author-year or numbered-reference patterns) in any response path that bypasses this resolution step.

## Non-Responsibilities
- Does not normalize raw scholarly metadata from external providers into `ResearchReference` — that ingestion/normalization responsibility sits with the scholarly-data integration layer under Core Contract #6, not here.
- Does not classify non-citation factual claims for hallucination risk — see [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md).
- Does not decide citation formatting/style (APA, IEEE, etc.) for researcher-facing export — that is a reference-manager/export concern, see [architecture/14 REFERENCE MANAGERS.md](../architecture/14%20REFERENCE%20MANAGERS.md).
- Does not evaluate a reference's academic quality or credibility — that judgment belongs to the Evidence Synthesis Engine's own quality signals, this document only confirms the reference is a real, resolvable record.
- Does not decide model/provider routing — see [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md).

## Core Components
- **Citation Resolver** — matches a model-produced citation fragment against the `ResearchReference` set visible to the current project context, returning a resolved reference id or an unresolved flag.
- **Context-Bounded Reference Set** — the scoped list of `ResearchReference` records the resolver is allowed to match against for a given request, assembled by the Project Context Engine so a citation can never resolve against another researcher's private library.
- **Unresolved Citation Flag** — the UI-facing marker shown when a model-produced citation could not be matched to any known reference, prompting the researcher to verify manually rather than trust it.
- **In-Project vs. General Grounding Tag** — the label distinguishing a citation drawn from the researcher's own supplied sources from one the model introduced from general knowledge.

## Owned Data
- `CitationResolution` — per AI-generated citation instance: raw model text, resolved `ResearchReference` id (nullable if unresolved), grounding tier (in-project / general / unresolved), engine and request id that produced it.

## Inputs
- Raw AI-generated text containing citation-shaped fragments, from the Multi-Model AI Gateway response stream.
- The project-scoped `ResearchReference` set from the [Project Context Engine](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md).
- The canonical normalized reference metadata (author, year, title, identifiers) that the resolver matches against, sourced from the internal `ResearchReference` model per Core Contract #6.

## Outputs
- Resolved citation objects (reference id + grounding tier) attached to AI response segments, consumed by [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md)'s provenance labeling.
- Unresolved-citation flags surfaced directly in the researcher-facing UI.
- A resolution-rate metric per engine, used to catch a regression in citation reliability after a model or prompt change.

## Dependencies
- [architecture/03 PROJECT CONTEXT ENGINE.md](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md) — supplies the bounded reference set a citation is checked against.
- [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md) — the broader hallucination-mitigation layer this resolver feeds.
- [architecture/11 EVIDENCE SYNTHESIS ENGINE.md](../architecture/11%20EVIDENCE%20SYNTHESIS%20ENGINE.md) — the highest-volume producer of citing text.
- [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md) — the layer this resolver sits behind in the response path.
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md) — governs the canonical `ResearchReference` model this resolver depends on.

## Extension Points
- A new engine that generates citing text integrates by calling the shared Citation Resolver rather than implementing its own matching logic.
- The matching strategy (exact identifier match today; fuzzy author-year-title matching as a fallback) can be extended without changing the resolved-object contract engines consume.
- A future "cite from outside my project" researcher-initiated flow (explicitly asking the AI to suggest additional literature) reuses the "general" grounding tier already defined here, rather than requiring a new tier.

## Security & Privacy
- The Context-Bounded Reference Set is the enforcement point for privacy: a resolver call scoped to Project A must never be able to match against or leak the existence of a reference from Project B, consistent with Core Contract #9.
- Resolved reference ids are safe to log for observability; the surrounding AI-generated prose may contain private project framing and follows the same access rules as the source project.
- An unresolved citation must never be silently upgraded to "resolved" by a lenient fallback match — a wrong resolution is worse than a visible gap, since it would misrepresent a fabricated claim as verified.

## Failure Modes
- **Over-lenient fuzzy matching** — a citation resolves to the wrong real reference because author/year happens to collide, presenting a false grounding signal; mitigated by preferring strict identifier-based matching and treating fuzzy matches as a lower-confidence sub-tier, not equivalent to an exact match.
- **Context set omission** — the Project Context Engine fails to supply a reference that does exist in the project, causing a valid citation to be wrongly flagged unresolved; mitigated by treating unresolved as "needs verification," not "confirmed fabricated," in UI copy.
- **Cross-project leakage** — a bug in context scoping lets a resolver match against another project's reference set; treated as a privacy incident per [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md), not merely a quality bug.

## Observability
- Resolution rate (resolved vs. unresolved citations) per engine and per model/provider.
- In-project vs. general grounding tier distribution, to monitor how often the AI is introducing outside sources versus citing the researcher's own material.
- Unresolved-citation volume trend after any prompt or model change, as a regression signal.

## P0/P1/P2/P3
**P0.** Citing a fabricated or misattributed source is the single most damaging failure mode for an academic platform's credibility; citation grounding must exist before any engine is allowed to render AI-generated citations to a researcher.

## Current Status
Documented, not implemented. No Citation Resolver, `CitationResolution` schema, or UI flagging exists yet.

## Open Questions
- Whether unresolved citations should block response rendering entirely or render with a visible warning inline — leans toward visible warning, not yet decided as policy.
- What fuzzy-match threshold, if any, is acceptable for the "general" grounding tier versus requiring exact identifier matches only.
- Whether researchers should be able to manually confirm/reject an unresolved citation, feeding that signal back into prompt tuning.
- How this mechanism interacts with citations generated during Research Gap Engine output, where the "gap" itself may reference the absence of a source rather than its presence — needs a defined edge case.

## Related Documents
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [AI HALLUCINATION CONTROL.md](AI%20HALLUCINATION%20CONTROL.md)
- [architecture/03 PROJECT CONTEXT ENGINE.md](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md)
- [architecture/11 EVIDENCE SYNTHESIS ENGINE.md](../architecture/11%20EVIDENCE%20SYNTHESIS%20ENGINE.md)
- [architecture/14 REFERENCE MANAGERS.md](../architecture/14%20REFERENCE%20MANAGERS.md)
- [architecture/04 RESEARCH AI ORCHESTRATOR.md](../architecture/04%20RESEARCH%20AI%20ORCHESTRATOR.md)
- [ai/AI PROVIDER REGISTRY.md](AI%20PROVIDER%20REGISTRY.md)
