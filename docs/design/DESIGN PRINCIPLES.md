# Design Principles

**Status:** LOCKED — product design decision principles

**Scope:** Documentation only. These principles guide evaluation; they do not define final tokens or components.

## 1. Start from the research object

Every screen begins with the object and task: project, question, reference, evidence, methodology decision, dataset, run, result, claim, section or destination. Generic dashboard chrome must not obscure what is being inspected or changed.

**Test:** Can the user name the object, its state and the next action without reading marketing copy?

## 2. Preserve lifecycle continuity

Navigation and cross-links show how the current object connects upstream and downstream. A saved paper, accepted methodology, completed run or manuscript section must not become an isolated feature artifact.

**Test:** Can the user move to the relevant predecessor, dependent or provenance record without reconstructing context manually?

## 3. Make truth state explicit

Visually distinguish lifecycle, verification, approval, availability and execution status. `PROPOSED`, verification statuses, `APPROVED`, `BLOCKED`, `UNKNOWN` and `UNAVAILABLE` cannot be collapsed into a generic green check. Use the canonical vocabulary owned by architecture.

**Test:** Could a reasonable user mistake AI output, user input or illustrative content for verified research truth?

## 4. Show provenance at the decision point

Source, DOI, version, timestamp, actor, AnalysisRun, dataset version and policy source appear where they materially affect trust. Progressive disclosure may compress them but cannot hide them from approval or verification decisions.

**Test:** Can the user answer “where did this come from?” without leaving the workflow?

## 5. Embed AI, do not centre it

Research AI appears beside the object and decision it assists. It explains recommendation, evidence, assumptions, alternatives, risk and expected change. It does not become the default floating chatbot or independent source of truth.

**Test:** If the AI panel were removed, would the underlying research object and workflow remain coherent?

## 6. Prefer structured density over card proliferation

Use rows, definition lists, tables, sections and inspectors for comparable information. Use cards only for bounded objects. White space separates meaning; it is not decoration.

**Test:** Does each container communicate a real ownership or interaction boundary?

## 7. Use relationships only when they explain

Lineage, dependency and evidence trails are preferred over giant graphs. Visualization scale follows the question being answered, with a list/inspector alternative for accessibility and precision.

**Test:** Does the relationship view reduce cognitive work compared with a structured list?

## 8. Design analysis as an instrument

Separate data, plan, execution, result and interpretation. Align numbers for comparison, expose assumptions and diagnostics, and keep every value linked to provenance. Avoid decorative charts or AI-produced statistics.

**Test:** Can the user trace any displayed statistic to the exact run and dataset version?

## 9. Make the next safe action obvious

Primary action reflects current state, permissions, unresolved issues and approvals. A blocked action explains why and how to resolve it. “Next” cannot bypass methodology, provenance, security or human gates.

**Test:** Does the UI explain both what can happen and what must not happen yet?

## 10. Build trust through restraint

Use warm surfaces, disciplined typography, neutral color, thin dividers and minimal elevation. Signature blue carries meaning. Do not use AI sparkle, gradient, glow, false certainty or promotional badges.

**Test:** Is attention directed to research meaning rather than visual novelty?

## 11. Adapt tasks, not pixels

Mobile prioritizes reading, evidence, review, approvals and light edits. Desktop supports dense analysis and multi-region context. Responsive design may reorder or disclose content, but cannot erase state, provenance or critical actions.

**Test:** Is the mobile task genuinely usable without page-level horizontal scrolling or hidden trust information?

## 12. Accessibility is part of scientific rigor

Semantic structure, keyboard flow, visible focus, readable text, contrast, labels, reduced motion and accessible data tables are baseline. Status is always communicated beyond color.

**Test:** Can the workflow be understood and completed with keyboard and assistive technology after implementation verification?

## 13. Never simulate product truth

Static previews are labelled illustrative. Unavailable actions are not styled as working controls. No fake evidence, citations, statistics, progress, provider connection or submission state is allowed.

**Test:** Does every interactive affordance work, and is every displayed state backed by data or explicitly labelled as a preview?

## Review order

Review new UI in this order:

1. research task and object;
2. canonical state and authority;
3. provenance and relationship;
4. next action and failure behaviour;
5. responsive/accessibility behaviour;
6. visual polish.

Polish cannot compensate for a failed earlier layer.

## Related documents

- [Master UI/UX Design Direction](MASTER%20UI%20UX%20DESIGN%20DIRECTION.md)
- [Product UI Patterns](PRODUCT%20UI%20PATTERNS.md)
- [Research AI Interaction Patterns](RESEARCH%20AI%20INTERACTION%20PATTERNS.md)
- [UI Anti-Patterns](UI%20ANTI%20PATTERNS.md)

