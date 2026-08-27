# Strategic Positioning

**Status:** LOCKED — strategic positioning contract

**Evidence snapshot:** 2026-08-26

**Implementation status:** Documentation only; this document does not assert that the product capabilities are live.

## Canonical position

**MetodePenelitian.com is a Research Operating System:** a project-centred, evidence-aware system that preserves research state, context, provenance, validation and human authority from the first question through publication and research impact.

It is not positioned as an AI thesis generator, generic AI writer, literature-search wrapper, statistical-tool directory, template marketplace, or autonomous publisher. Individual tools may exist inside the product, but none defines the category.

## Category definition

| Question | Locked answer |
|---|---|
| For whom? | Students, researchers, supervisors, research groups and institutions, initially grounded in Indonesian academic practice but designed for international policy packs and providers. |
| What problem? | Research work is fragmented across documents, chats, search tools, reference managers, analysis software, institutional rules and publication portals; decisions and provenance are lost between them. |
| What alternative? | A collection of disconnected point tools whose outputs must be copied, reconciled and revalidated manually. |
| What value? | One continuous, auditable research project in which every workflow reads and updates governed canonical state. |
| What proof is required? | Versioned Research Digital Twin state, evidence-to-claim links, immutable analysis provenance, explicit approval gates, compiler outcomes and capability/provider status. Architecture alone is not proof of runtime availability. |

## Canonical research lifecycle

```text
Research Question
→ Research Project
→ Evidence
→ Research Gap
→ Methodology
→ Instrument / Data Collection
→ Dataset
→ Analysis
→ Interpretation
→ Scientific Writing
→ Citation / References
→ Institutional Compliance
→ Defense
→ Publication
→ Research Impact
```

The sequence expresses continuity, not a mandatory linear UI. Research may revisit earlier stages; upstream changes must propagate impact without destroying history.

## Feature, workflow and system

| Level | Definition | Example | Strategic test |
|---|---|---|---|
| **FEATURE** | One bounded capability. | Citation formatting or sample-size calculation. | Does it perform one job truthfully? |
| **WORKFLOW** | A governed sequence of features that produces a research outcome. | Evidence discovery → screening → extraction → synthesis. | Are inputs, outputs, gates and failures explicit? |
| **SYSTEM** | All workflows share project identity, state, context, provenance, permissions and validation. | A methodology change invalidates affected analysis, interpretation and manuscript claims. | Does continuity survive tool, model and format changes? |

MetodePenelitian.com competes at the **SYSTEM** level. A feature with no canonical-state relationship is not automatically a product advantage.

## Position by audience

- **Researcher/student:** a guided and auditable path, not outsourced authorship.
- **Supervisor/research group:** inspectable decisions, evidence, revisions and approvals, not opaque AI output.
- **Institution:** policy-aware compliance and oversight over explicitly shared projects, not automatic access to private work.
- **Publisher/repository destination:** validated, destination-aware artifacts and official handoff, not an invented direct-submission claim.

## Strategic admission rule

A new feature is accepted only if it materially strengthens at least one of:

1. the canonical research lifecycle;
2. interoperability between research stages or tools;
3. evidence quality and traceability;
4. research integrity, privacy or human authority; or
5. a defensible moat defined in [Product Differentiation](PRODUCT%20DIFFERENTIATION.md).

It must also:

- attach its inputs and outputs to a `ResearchProject` where applicable;
- declare provenance, validation and failure behaviour;
- use the AI Gateway or Integration Gateway at the applicable boundary;
- avoid duplicating canonical data or an existing engine;
- remain unavailable when its exact capability has not passed the relevant gate.

Failing these tests means **IGNORE**, defer, or expose only as an explicitly isolated utility.

## Claim discipline

- `LOCKED` means the strategic or architectural direction is approved; it does not mean implemented.
- `VERIFIED`, `PARTIAL` and `NOT VERIFIED` in competitive analysis describe public evidence, not product quality.
- Provider, journal, index, pricing and integration claims require dated evidence and may become stale.
- AI output remains proposed until the applicable evidence, methodology, analysis and human-approval gates pass.

## Related documents

- [Competitive Landscape](COMPETITIVE%20LANDSCAPE.md)
- [Product Differentiation](PRODUCT%20DIFFERENTIATION.md)
- [Research Operating System](RESEARCH%20OPERATING%20SYSTEM.md)
- [Master Product Architecture](../MASTER%20PRODUCT%20ARCHITECTURE.md)
- [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md)
