# Evidence Synthesis Engine

## Purpose
The Evidence Synthesis Engine turns a researcher's saved literature (a set of `ResearchReference` records attached to a `ResearchProject`) into structured, comparable evidence: extraction tables, contradiction flags, strength-of-evidence summaries, and draft synthesis narratives that a researcher edits rather than trusts blindly. It exists so that a researcher does not have to manually re-read every paper to see how findings agree or disagree.

## Scope
Covers cross-reference comparison and synthesis for a single `ResearchProject`: extracting comparable variables (population, method, outcome, effect direction) from a project's reference set, detecting agreement/disagreement across sources, and generating draft evidence tables and synthesis text. Does not cover discovering new literature (handled by the discovery/search layer), does not cover formal statistical meta-analysis math (handled by [16 ANALYSIS ADVISOR.md](16%20ANALYSIS%20ADVISOR.md) and [17 DATASET ANALYSIS.md](17%20DATASET%20ANALYSIS.md) if the researcher supplies extracted numeric data), and does not cover gap detection (that is [12 RESEARCH GAP ENGINE.md](12%20RESEARCH%20GAP%20ENGINE.md)).

## Responsibilities
- Extract structured claims/findings from each `ResearchReference`'s available text (abstract, and full text only where the researcher has legally provided it) into a consistent schema per project.
- Compare extracted claims across references and flag agreement, disagreement, and partial overlap.
- Produce an evidence table (rows = references, columns = researcher-defined or engine-suggested extraction fields) as an editable draft artifact.
- Produce a draft narrative synthesis paragraph set, explicitly labeled as a draft requiring researcher review.
- Track which references have been synthesized versus not yet processed, so re-runs are incremental.

## Non-Responsibilities
- Does not decide what counts as "true" or resolve contradictions on the researcher's behalf; it surfaces disagreement, it does not adjudicate it.
- Does not perform PRISMA screening/inclusion decisions; that is a researcher (or future dedicated screening workflow) responsibility.
- Does not run statistical meta-analysis (pooled effect sizes, heterogeneity tests) itself; it hands numeric extraction to the Analysis layer.
- Does not call any AI provider directly.
- Does not fetch or normalize scholarly metadata itself; it consumes `ResearchReference` records already normalized upstream.

## Core Components
- **Extraction Orchestrator**: for each reference in scope, builds an extraction prompt from the project's active extraction schema and the reference's available text, submitted through the Multi-Model AI Gateway.
- **Comparison Matrix Builder**: assembles per-project extraction results into a tabular structure and computes simple agreement/disagreement flags across rows for shared fields.
- **Synthesis Draft Generator**: given the comparison matrix, requests a narrative synthesis draft through the AI Gateway, with the matrix (not raw papers) as grounding context to keep prompts bounded.
- **Extraction Schema Registry**: per-project (or per-discipline-template) definition of which fields get extracted (e.g., sample size, method, outcome direction); researcher-editable.

## Owned Data
| Entity | Description |
|---|---|
| `EvidenceExtraction` | One extraction record per (reference, project, schema version): structured field values plus source snippet references. |
| `EvidenceExtractionSchema` | Project-scoped definition of extraction fields, field types, and prompts used to extract them. |
| `SynthesisDraft` | Generated narrative synthesis text, versioned, linked to the comparison matrix snapshot it was built from. |
| `SynthesisFlag` | Agreement/disagreement/uncertain flags between pairs or groups of extractions on a given field. |

## Inputs
- `ResearchReference` records (canonical model) and their associated abstract/full-text where available, scoped to one `ResearchProject`.
- Active `EvidenceExtractionSchema` for the project.
- Project context (research question, working hypotheses) from the [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md), used to focus extraction on relevant fields.

## Outputs
- `EvidenceExtraction` records, queryable per reference.
- A comparison matrix (materialized view over extractions) exposed to the frontend and to the writing layer.
- `SynthesisDraft` text, always rendered with a visible "AI-drafted, verify against sources" marker.
- Updates written back into the Project Context Engine so later engines (Writing, Gap detection) can see what has already been synthesized.

## Dependencies
- [Multi-Model AI Gateway](05%20MULTI%20MODEL%20AI%20GATEWAY.md) for all extraction and narrative generation calls.
- [Project Context Engine](03%20PROJECT%20CONTEXT%20ENGINE.md) for shared project context and to publish synthesis state back.
- Canonical `ResearchReference` model, normalized by the scholarly data ingestion layer, described in [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).
- [Research Graph](13%20RESEARCH%20GRAPH.md) as an optional consumer of synthesis flags (agreement/disagreement can become graph edges).
- Async job infrastructure for batch extraction runs over large reference sets, per [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md).

## Extension Points
- Pluggable extraction schemas per discipline template (e.g., a clinical-trial schema versus a qualitative-study schema), registered without changing the orchestrator.
- Pluggable comparison strategies (exact-match on categorical fields today; a future semantic-similarity comparator for free-text fields behind the same interface).
- Output renderers (table, narrative, future PRISMA-style flow summary) can be added without touching extraction logic.

## Security & Privacy
All extraction and synthesis runs on data already scoped to one private `ResearchProject`; no reference or extraction is compared against another researcher's project. Prompts sent to the Multi-Model AI Gateway carry only the reference text and extraction schema needed for that call, never the researcher's full library or unrelated project data. Full-text extraction only runs against text the researcher has legally provided access to (open-access content or the researcher's own uploaded copy); the engine does not fetch paywalled full text on its own. `EvidenceExtraction` and `SynthesisDraft` records inherit the project's default-private access rules per [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md).

## Failure Modes
- **AI Gateway unavailable or degraded**: extraction runs pause and queue; previously computed extractions and matrices remain fully usable read-only, satisfying the degraded-but-functional requirement.
- **Reference has no usable text** (abstract-only, paywalled full text not supplied): extraction proceeds on abstract with a lower-confidence marker rather than failing the whole batch.
- **Schema changes mid-project**: prior extractions are retained and tagged with their schema version rather than silently recomputed, avoiding silent data loss.
- **Contradictory extractions on the same field from the same source across runs**: flagged for researcher review rather than auto-resolved.

## Observability
- Per-project extraction completion rate (references extracted / references in scope).
- Extraction latency and AI Gateway error rate specific to this engine's call type.
- Synthesis draft generation count and researcher edit-distance on generated drafts (proxy for draft usefulness).
- Flag volume (agreement vs. disagreement counts) as a project health signal surfaced to the researcher.

## P0/P1/P2/P3
**P1.** Evidence synthesis is a major differentiating product capability of the Research OS but the platform can function without it (manual literature review still works); it is not required for safe core operation the way the Context Engine or the AI/Integration Gateways are, so it sits below P0.

## Current Status
Documented, not implemented. No extraction orchestrator, schema registry, or synthesis generator exists in code yet.

## Open Questions
- What is the default extraction schema per major discipline, and who authors it (product team vs. researcher-community-contributed)?
- How is full-text access legally sourced per reference before extraction runs on it (open-access only vs. researcher-uploaded PDFs under their own license)?
- Should disagreement flags ever be strong enough to block a synthesis draft from generating, or should the draft always generate with flags attached?

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER AI GOVERNANCE.md](../MASTER%20AI%20GOVERNANCE.md)
- [MASTER DATA GOVERNANCE.md](../MASTER%20DATA%20GOVERNANCE.md)
- [12 RESEARCH GAP ENGINE.md](12%20RESEARCH%20GAP%20ENGINE.md)
- [13 RESEARCH GRAPH.md](13%20RESEARCH%20GRAPH.md)
- [16 ANALYSIS ADVISOR.md](16%20ANALYSIS%20ADVISOR.md)
- [19 WRITING CITATION.md](19%20WRITING%20CITATION.md)
