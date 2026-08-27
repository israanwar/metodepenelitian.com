# Master UI/UX Design Direction

**Status:** LOCKED — canonical product design direction

**Scope:** Documentation only. This document does not implement UI, finalize design tokens, replace the existing design system, or assert that the current product conforms visually.

## Design position

MetodePenelitian.com must feel like software in which research is genuinely performed:

> **Scientific Operating Environment + Research Workspace + Calm Intelligence**

The product category remains **Research Operating System**. Every surface should help a researcher inspect, decide, execute, verify or advance a real research object. The interface must not collapse into an academic marketing website, AI chatbot wrapper, thesis generator, LMS, fintech dashboard, admin template, Notion clone or presentation-style brochure.

### Locked characteristics

`CALM · INTELLIGENT · PRECISE · RIGOROUS · TRUSTWORTHY · INFORMATION-RICH · RESEARCH-CENTRIC`

“Calm” does not mean empty. “Information-rich” does not mean crowded. The target is controlled density: a clear hierarchy over meaningful research information with minimal decoration.

## Source-of-truth relationship

- Product/domain meaning remains owned by [Master Product Architecture](../MASTER%20PRODUCT%20ARCHITECTURE.md).
- Canonical state, provenance and human authority remain owned by [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md), [Project Context](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md), [Research Compiler](../architecture/RESEARCH%20COMPILER.md) and [Master AI Governance](../MASTER%20AI%20GOVERNANCE.md).
- This document owns design direction, hierarchy and UI governance only. It does not redefine statuses, entities, workflows or backend availability.
- Canonical reusable interaction structures live in [Product UI Patterns](PRODUCT%20UI%20PATTERNS.md) and [Research AI Interaction Patterns](RESEARCH%20AI%20INTERACTION%20PATTERNS.md).

## Existing implementation audit

**Audit status:** `SOURCE_AUDITED / VISUAL_NOT_VERIFIED` on 2026-08-27. The in-app browser was unavailable, so no screenshot, rendered responsive or interactive audit was completed. Source observations must not be treated as browser verification or accessibility compliance.

### Existing foundations to preserve pending visual verification

- [Tailwind configuration](../../tailwind.config.ts) already defines warm `canvas`/`paper`, research ink, graphite, hairline and restrained research blue tokens.
- [Typography setup](../../src/app/%5Blang%5D/layout.tsx) already uses Inter/Outfit for shared chrome and IBM Plex Sans, Source Serif 4 and IBM Plex Mono for homepage product/editorial/data roles.
- [Homepage composition](../../src/app/%5Blang%5D/page.tsx) follows Hero → Research Workspace → Discover Evidence → Methodology/Analysis → Closing CTA.
- [Research Workspace preview](../../src/components/home/ResearchWorkspace.tsx) uses one large bounded workspace, lifecycle navigation, structured methodology rows and contextual Research AI rather than a card grid.
- [Evidence preview](../../src/components/home/DiscoverEvidence.tsx) prioritizes paper metadata, relevance, findings and project connection.
- [Methodology/Analysis preview](../../src/components/home/MethodologyAnalysis.tsx) distinguishes context, recommendation, analysis flow, results and AI interpretation.
- The Indonesian homepage consistently uses the example project “Pengaruh Media Sosial terhadap Motivasi Belajar.”

### Existing risks requiring future UI implementation review

- Static preview controls use hover/cursor affordances without real actions in some places; previews must not imply functionality.
- Example papers, relevance, citations and statistical values are not visibly marked `ILLUSTRATIVE/DEMO/PROPOSED` with provenance in the current source.
- Research AI recommendations do not yet expose the complete Why, Evidence, Assumptions, Alternatives, Risks and Review structure.
- Homepage AI command treatment is prominent enough that visual testing must ensure the product does not read as a chatbot wrapper.
- Several 10px uppercase metadata labels require rendered readability and contrast verification.
- Homepage CTAs do not consistently expose the explicit focus treatment already used by the shared Header.
- `Complete/Ready/Next/Pending` task labels must remain visually distinct from canonical verification states.
- Mobile tab-strip scrolling exists by source; clipping, focus visibility, zoom/reflow and absence of page-level overflow remain unverified.

These are audit findings, not authorization to change the homepage in this task.

## Design references

References are principle benchmarks only. No proprietary UI, layout, copy, code or asset may be copied.

| Reference | Principle to study | Do not inherit |
|---|---|---|
| Linear | Precision, density, hierarchy, interaction quality | Dark SaaS aesthetic or interaction mimicry |
| IBM Carbon | Rigorous scientific/enterprise information design | Wholesale component styling or token system |
| Notion | Restrained content hierarchy | Block-editor identity or workspace clone |
| Stripe | Technical clarity and polished information presentation | Marketing composition or brand imitation |
| Elicit | Structured research information | Feature model or visual implementation |
| Consensus | Simple scholarly discovery | Search-only product framing |
| Scite | Evidence and citation intelligence | Proprietary citation presentation |
| ResearchRabbit/Litmaps | Relationship and discovery comprehension | Giant graph as default interface |

Competitive target: simpler than SciSpace, more connected than Elicit, more rigorous than local AI-thesis tools, more actionable than discovery-only products and more approachable than traditional statistical software—while retaining an original MetodePenelitian.com identity.

## Visual language

### Color

Dominant surfaces are warm white/paper, graphite/ink typography and neutral grayscale. Signature blue is scarce and semantic:

- active or selected state;
- verified relationship when the canonical status warrants it;
- important link;
- primary action;
- actionable Research AI state;
- selected progress/status where blue does not imply verification.

Do not use blue/purple AI gradients, neon, glow, glassmorphism, decorative blobs, colorful dashboard palettes or excessive shadow. Status must never depend on color alone.

Current source colors are evidence to audit, not final tokens. Token changes require a rendered contrast, brand and cross-surface audit; this document does not authorize them.

### Typography

Typography must support long academic reading and dense product UI. Existing fonts remain in place pending visual audit; no replacement is authorized.

| Role | Purpose | Direction |
|---|---|---|
| Display | Rare category or lifecycle statement | Restrained scale; never an oversized empty hero |
| H1 | Page identity and current task | Immediate, specific and singular |
| H2 | Major research section | Clear sectional boundary |
| H3 | Panel/group title | Close to the object it governs |
| Body | Explanations and academic content | Comfortable long-form line height and measure |
| Small | Secondary explanation | Readable, never a dumping ground |
| Metadata | DOI, source, timestamp, version, provenance | Compact but not cryptic |
| Label | Field or status label | Consistent casing and vocabulary |
| Data/Tabular | Values, coefficients, identifiers | Tabular numerals; aligned for comparison |
| Citation | Source reference and locator | Visually subordinate but fully legible/actionable |

Source Serif 4 may support editorial/academic passages; IBM Plex Mono may support data and provenance; sans-serif remains primary for application structure. Exact sizes and roles require a future audited token specification.

### Spacing and density

- Use controlled whitespace to separate meaning, not maximum whitespace as a premium signal.
- Dense data requires stronger alignment, grouping, labels and disclosure—not larger cards.
- Preserve a stable reading rhythm across project navigation, object list and inspector/detail regions.
- Progressive disclosure hides secondary complexity, never evidence, status or risk required for a decision.

### Surface hierarchy

```text
PAGE → SECTION → PANEL → GROUP → ROW → FIELD
```

A card is reserved for a genuinely bounded object with independent identity/action, such as a project, analysis run or policy pack. Default to sections, dividers, rows, definition lists, tables and inspectors. Radius is restrained; borders are thin; shadows are minimal and communicate elevation only.

## Homepage direction

Homepage remains:

```text
Hero
→ Research Workspace Preview
→ Discover Evidence
→ subsequent lifecycle proof
→ Closing CTA
```

Future sections must advance the same example project:

```text
QUESTION → EVIDENCE → METHODOLOGY → DATA → ANALYSIS → WRITING → PUBLICATION
```

They must not become independent feature demos. Product previews must clearly state whether content is illustrative and must not use fake interactivity, evidence or statistics. This task does not authorize homepage changes.

## Authenticated workspace

The default login destination is the user’s current or most relevant research work, not a generic analytics dashboard.

Primary lifecycle navigation:

`Overview · Literature · Methodology · Instruments · Data · Analysis · Writing · References`

Additional utilities may appear contextually but cannot outrank the lifecycle. Metrics belong only when they change the user’s next decision. “Good morning / 12 projects / 84 papers / 47 citations / 7 chats” is not a valid default without actionable research meaning.

## Research Digital Twin visual language

RDT comprehension is relationship-first, not graph-first. The default pattern is the smallest view that explains the current dependency:

- lineage for upstream/downstream trace;
- dependency rows for impact;
- connected-state summary for lifecycle coherence;
- evidence trail for claim support;
- structured relationship inspector for dense entity/edge detail.

A giant node graph is never the default. A graph is used only when overview, branching or network topology materially improves comprehension, with filtering, list alternative, keyboard path and accessible text representation.

## Domain direction

### Literature and evidence

Prioritize paper identity, metadata, source, relevance, evidence, claim relationship, citation and project connection. A saved paper becomes a visible `ResearchReference` and may yield reviewable evidence; it is not merely a bookmarked card.

### Methodology

Show Research Design, Population, Sample, Variables/Constructs, Hypotheses and Analysis Plan as connected research objects. Relationship and inconsistency matter more than dashboard totals.

### Data and analysis

Analysis must feel like a scientific instrument. Visually distinguish Dataset, Analysis Plan, Analysis Run, Analysis Result and Interpretation. Results expose assumptions, diagnostics, tables, versions and provenance. Every shown value must trace to a run; AI cannot provide decorative statistics.

### Writing

Do not clone Google Docs. Writing connects `Document Section ↔ Claim ↔ Evidence ↔ Citation ↔ Analysis Result`. Contextual intelligence may sit beside a document, but canonical text, proposed text and verified sources remain visually distinct.

### Publication

Publication is downstream:

`Destination → Readiness → Guideline Compliance → Artifact → Submission Handoff → Tracking`.

The interface must identify the official destination and never suggest that MetodePenelitian.com reviews, accepts or publishes research.

### Utilities

Plagiarism checking, conversion, citation and file tools are secondary utilities. Plagiarism Checker remains a future feature, not a bounded context or primary navigation pillar.

## Responsive direction

- **Desktop:** information-rich workspace with persistent lifecycle and local object context.
- **Tablet:** preserve hierarchy and primary context; secondary inspectors may collapse or move below.
- **Mobile:** prioritize reading, review, approvals, evidence, light editing and AI recommendations. Complex statistical manipulation uses staged disclosure rather than a shrunken desktop.
- No page-level horizontal overflow. Horizontal scrolling is allowed only for semantic tables or bounded tab strips with clear affordance and keyboard access.

## Motion

Motion explains navigation, state transition, relationship, loading, completion or validation. Use restrained micro-interactions, honor reduced motion and never animate merely to make AI appear magical.

## Trust and accessibility baseline

Trust is communicated with source, DOI, provenance, timestamps, version, approval, verification, AnalysisRun and evidence relationships—not “100% Accurate,” “AI Powered” or “Guaranteed” badges.

All future UI must provide keyboard navigation, visible focus, semantic hierarchy, sufficient contrast, readable sizes, programmatic labels, reduced motion, accessible tables/forms and text/icon support for color states. Screenshot or source review alone cannot establish WCAG conformance; keyboard, screen-reader, contrast and reflow testing are required.

## Design governance gate

Every new UI must answer:

- A. What research task is completed?
- B. What research object is viewed or changed?
- C. Is canonical/proposed/verified state unambiguous?
- D. Is provenance visible when relevant?
- E. Is AI contextual and subordinate?
- F. Does the user know the next safe action?
- G. Is every visible item necessary?
- H. Does this remain part of the same Research OS?

If any answer is missing, do not implement. Apply [Design Principles](DESIGN%20PRINCIPLES.md), canonical patterns and [UI Anti-Patterns](UI%20ANTI%20PATTERNS.md) during review.
