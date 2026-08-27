# MetodePenelitian.com Master Product Architecture

**Status:** Draft v1.0 — architecture reference, no implementation yet
**Owner:** Product Architecture
**Scope:** Whole-product domain structure only. No code, no migrations, no APIs implemented by this document.

This document is the product-facing counterpart to [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md). Where the backend master document describes system layers and services, this document describes the product the way a researcher and a product team both need to reason about it: **module → submodule → feature → relationship**, across the whole Research OS surface.

---

## Purpose

This document exists to:

- Give MetodePenelitian.com one canonical map of *what the product is made of*, independent of any single page, menu, or sprint.
- Reconcile the nine backend-facing domains (Research Core, Research AI, Knowledge & Search, Literature & Evidence, Dataset & Analysis, Writing & Citation, Publication Gateway, Academy, Institution) with the product's earlier lifecycle-module framing (Discover, Learn, Plan, Execute, Analyze, Write, Cite & Evidence, Metode AI, Academy, Integrations, My Research), so both vocabularies stay traceable to the same underlying structure instead of drifting apart.
- Establish that the product is organized around the **research lifecycle**, not around a flat list of features or a page inventory.
- Be the document sitemap, IA, and PRD work derive from — not the other way around. If a sitemap decision contradicts this document, this document wins until formally revised.
- Record the Research Knowledge Graph as the product's core differentiating concept: every entity (method, design, variable, instrument, sampling technique, statistical test, software, paper, author, dataset) is a node with real relationships, not an isolated article or record.

This document does not itself define database schema, API contracts, or AI routing mechanics — those live in [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) and its children.

---

## Scope

In scope: the full product surface of MetodePenelitian.com end-to-end — from a researcher's first unstructured question ("what's already known about this?") through idea formation, planning, literature and evidence work, data collection and analysis, writing, citation, AI assistance across every stage, structured learning (Academy), institutional use, and the eventual handoff to a real publication destination.

Out of scope for this document: internal service boundaries, database column design, provider adapter contracts, and infrastructure — all covered in [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md). This document also does not resolve navigation/IA specifics (menu labels, dropdown order) beyond noting where the product structure and the live navigation currently diverge; that belongs to sitemap/IA documents derived from this one.

---

## Responsibilities

- Define the nine product domains and the relationship between each domain and the legacy eleven-module lifecycle framing (Discover, Learn, Plan, Execute, Analyze, Write, Cite & Evidence, Metode AI, Academy, Integrations, My Research) used in earlier product exploration.
- For each domain: name its submodules, its representative features, and its explicit relationships to other domains — no domain is documented as a dead end.
- Define the Research Knowledge Graph as a cross-cutting product concept, not a feature of any single domain.
- State which product domains are content/workflow surfaces (Knowledge & Search, Literature & Evidence, Writing & Citation) versus which are orchestration/aggregate surfaces (Research Core, Research AI) versus which are conversion/exit surfaces (Publication Gateway) versus which are pedagogy/organizational surfaces (Academy, Institution).
- Flag where the current live navigation (six-item header) already matches this structure and where it still needs its submenus deepened.
- Carry forward, not re-litigate, every binding contract in the locked baseline (`ResearchProject` as central aggregate, Project Context Engine as shared context, AI Gateway and Integration Gateway as mandatory chokepoints, Publication Gateway as router-not-publisher, private-by-default projects).

---

## Non-Responsibilities

- Does not define the physical database schema — see the (planned) `database/` domain documents.
- Does not define AI routing/model-selection mechanics — see [MASTER AI GOVERNANCE.md](MASTER%20AI%20GOVERNANCE.md) and the (planned) `ai/` domain documents.
- Does not enumerate individual third-party integrations or their auth/rate-limit details — see [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md) and the `integrations/` tree.
- Does not define data retention, consent, or governance policy — see [MASTER DATA GOVERNANCE.md](MASTER%20DATA%20GOVERNANCE.md).
- Does not commit to final navigation labels, URL structure, or page inventory — that is sitemap/IA work that consumes this document as input.
- Does not specify pricing, plan tiers, or entitlement thresholds — that is a Billing & Entitlements concern (Section 27 of the backend master), only referenced here where a domain is plan-gated.

---

## Core Components

The product is nine domains. Each is described as **module → submodule → representative features → relationship to other domains**, with a note mapping it back to the legacy lifecycle-module name it was originally explored under.

### 1. Research Core (legacy: Plan, Execute, My Research)

The aggregate backbone. Every other domain's content ultimately attaches to a `ResearchProject`.

| Submodule | Representative features |
|---|---|
| Idea & Framing | Research idea, problem identification, gap finder (fed by Knowledge & Search results the user has saved), topic, title |
| Design Decisions | Research questions, objectives, hypotheses, variables, constructs, indicators, theoretical/conceptual framework, path diagram builder |
| Method Setup | Research design, population, sampling, sample size (linked to Dataset & Analysis calculators), instruments, data collection plan, analysis plan |
| Workspace | Projects, literature attached to project, datasets attached to project, progress tracking across lifecycle stages (not a flat checklist) |
| Research Protocol | A single generated protocol document, structured to become a proposal's opening chapters |

**Relationship:** each planning decision narrows the next — a chosen variable set constrains available designs, a chosen design constrains sampling options, sampling and instrument choices feed the Dataset & Analysis domain's recommended analysis plan. Research Core is also the home of `ProjectContext`, the shared state every AI capability in Research AI reads.

#### P0 executable-research fabric

Research Core is powered by three P0 product capabilities:

- **Research Digital Twin:** one living, versioned, evidence-aware project representation shared by all domains, agents, and AI models. It connects the full chain from idea/problem through evidence, theory, variables, method, instrument, data, analysis, writing, submission, review, and publication record.
- **Research Compiler:** an explainable consistency gate across structure, methodology, evidence, statistics/qualitative analysis, citations, ethics, and journal requirements. Its `PASS/WARNING/ERROR/BLOCKED/UNKNOWN` outcomes and Research Health summary expose risk; they do not gamify research or replace expert judgment.
- **End-to-End Research Execution Pipeline:** the official 27-stage workflow from Research Intake to Publication Record, with declared inputs, outputs, agents, tools, integrations, RDT updates, validation, approvals, failure conditions, and next state.

The **Evidence-to-Claim Graph** makes every major claim traceable to source paper, dataset, analysis result, methodology, and citation. The **Next Best Research Action Engine** recommends the safest useful next step from current state, missing dependencies, compiler issues, evidence, approvals, and risk. Both are advisory and auditable.

Multiple candidate titles are first-class product input. Each is compared on Evidence Availability, Novelty, Research Gap Strength, Methodological Feasibility, Data Feasibility, Sample Feasibility, Analysis Fit, Academic Contribution, Publication Potential, and Execution Risk; every dimension requires rationale, evidence, confidence, and assumptions.

Backend RDT/Compiler state is the source of truth for workspace labels such as `RESEARCH GAP — VERIFICATION REQUIRED`, `METHODOLOGY — REVIEW REQUIRED`, and `PUBLICATION — NOT READY`. Initial user input is `PROPOSED`, never automatically verified. Protected research decisions and all external submission/data-publication actions require explicit human approval.

See [Research Digital Twin](architecture/RESEARCH%20DIGITAL%20TWIN.md), [Research Compiler](architecture/RESEARCH%20COMPILER.md), and [Idea-to-Publication Pipeline](workflows/IDEA%20TO%20PUBLICATION%20PIPELINE.md).

### 2. Research AI (legacy: Metode AI)

One assistant with full project context, not a set of independent generators.

| Submodule | Representative features |
|---|---|
| Advisory capabilities | Ask Research, Find Research Gap, Generate Research Ideas, Review Literature, Compare Papers, Explain Methods, Recommend Method, Recommend Sampling, Recommend Analysis, Analyze Results, Explain Statistics, Review Writing, Research Critic, Publication Advisor |
| Traceable workflow | Question → Search → Screening → Extraction → Synthesis → Report, with every step's output traceable to a source |
| Conversation | Project-scoped AI conversations, tool-call log |

**Relationship:** every capability listed above reads the same `ProjectContext` (Research Core) rather than opening a private session; every citation-bearing answer resolves back to a `ResearchReference` (Literature & Evidence); every routing decision (which model answers) is delegated to the Multi-Model AI Gateway described in [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md).

### 3. Knowledge & Search (legacy: Discover, Learn)

The product's reference layer: the platform's own methodology knowledge base, plus literature discovery.

| Submodule | Representative features |
|---|---|
| Research Search | Natural-language query, Boolean/filters (year, open access, citation count, study type), literature-grounded answers rather than free generation |
| Entity pages | Papers, topics, authors, journals — each with credibility signals (citation count, journal rank, year) |
| Knowledge base | Research Fundamentals, Research Process, Research Design, Quantitative, Qualitative, Mixed Methods, Sampling, Measurement, Instruments, Statistics, Analysis, Academic Writing, Research Ethics, Research Dictionary |
| Methods Map | A network of broad ↔ specific ↔ related methods, not an A–Z list |
| Method entry template | Definition, When to Use, Requirements, Sample Size, Variables, Assumptions, Related Methods, Statistical Tests, Software, Step-by-Step Guide, Example Dataset/Research, Related Papers, Templates, Calculator, Ask Research AI |

**Relationship:** this is the domain the Research Knowledge Graph (below) is most visible in — no method, statistic, or paper page is a dead end; every entry links out to related methods, the software that runs it, the papers that used it, and the AI capability that explains it.

### 4. Literature & Evidence (legacy: Discover, Execute's literature submodule, Cite & Evidence)

Discovery, ingestion, and the user's own library on top of it.

| Submodule | Representative features |
|---|---|
| Discovery | Search results resolve to `ResearchReference` records; saved searches attach to a project |
| Personal library | Papers, collections, notes, tags, attachments — one paper can belong to many collections |
| PDF workflow | Upload → auto-extract citation metadata → highlight/annotate → feed into Writing & Citation drafts |
| Citation layer | Citation generator/manager, DOI lookup, CSL styles (APA, Harvard, Vancouver, Chicago, IEEE), RIS/BibTeX export, Zotero/Mendeley sync |

**Relationship:** an uploaded PDF is never an inert file — extracted citations flow into the reference library, and highlighted passages become literature-review draft material in Writing & Citation. Every citation stays a live pointer back to its source paper, not static text.

### 5. Dataset & Analysis (legacy: Analyze)

The product's technical depth: dataset handling plus the advisor that removes the need to already know a test's name.

| Submodule | Representative features |
|---|---|
| Analysis Advisor | Question-and-answer wizard (research goal, variable count/type, categorical vs. numeric, independent vs. paired, mediator present) resolving to a recommended test |
| Quantitative | Descriptive, normality, validity, reliability, correlation, regression, t-test, ANOVA, Chi-Square, mediation, moderation, SEM, PLS-SEM |
| Qualitative | Coding, thematic analysis, content analysis, grounded theory, narrative analysis |
| Mixed methods | Integration layer joining quantitative and qualitative findings |
| Calculators | One calculator per test, not one generic calculator for everything |
| Software guides | SPSS, SmartPLS, AMOS, R, Python, Stata, NVivo, ATLAS.ti, MAXQDA |

**Relationship:** the Analysis Advisor's recommendation is the connective tissue — a project's variables/design/sampling choices (Research Core) drive the recommendation, and the recommendation in turn links out to Learn (method explanation), Calculate (calculator), the software guide, an example dataset, and Ask Research AI.

#### P0 Data-to-Document product contract

The locked product flow is `Upload Dataset → Inspect → Map Variables → Prepare Data → Analysis Ready → Recommended Analysis/Why/Assumptions → Review/Approve → Run → Validate Results → Interpret → Add to Document → Compile → Export`. Dataset and analysis screens are projections of backend RDT, dataset lineage, AnalysisRun, Result Provenance, approvals, and Compiler state.

Original data/transcripts and AnalysisRuns are immutable. Mapping uses explicit `UNMAPPED/MAPPED/AMBIGUOUS/MISSING/INVALID` states; ambiguous changes require review. Advice uses complete research/data context and explains rationale, assumptions, tests, limitations, alternatives, confidence, and evidence. AI can explain referenced results but cannot create or change values.

Quantitative, qualitative, and mixed-method paths converge through verified results/findings: mixed methods requires triangulation, convergence/divergence, joint display, and meta-inference. Writing supports blueprint-driven Skripsi, Tesis, Disertasi, Journal Article, and Research Report; no institution is hardcoded. Every generated section/table/figure remains traceable to RDT entities and validated result/evidence sources.

P0 is the coherent backbone/security/provenance/approval contract. Individual formats, methods, software interoperability modes, templates, and export renderers remain capability-status driven and may ship in P1/P2 without weakening P0 invariants. See [Data → Analysis → Interpretation → Academic Document Pipeline](architecture/DATA%20ANALYSIS%20INTERPRETATION%20DOCUMENT%20PIPELINE.md).

### 6. Writing & Citation (legacy: Write, Cite & Evidence)

Structured authoring tied to project context, with the citation engine underneath it.

| Submodule | Representative features |
|---|---|
| Document types | Proposal, Thesis, Dissertation, Journal Article, Research Report — templates locked to academic level (S1/S2/S3 require different mandatory structure) |
| Sections | Introduction, Literature Review, Methodology, Results, Discussion, Conclusion |
| Language assistance | Paraphrasing, academic language, grammar, translation |
| Citation | Shared with Literature & Evidence's citation layer — one engine, not a duplicate |

**Relationship:** the Methodology section is never started from a blank page — it drafts from Research Core's planning decisions and Literature & Evidence's saved sources, with the AI-assisted draft clearly distinguished from user-authored edits (Academic Integrity & AI Safety, backend master Section 26).

#### P0/P1 Institutional & publication formatting contract

One canonical research document can produce separate Skripsi/Tesis/Disertasi, journal-manuscript, repository and archival artifacts through versioned policy packs. P0 forbids formatting from changing research facts, results, citations, table/figure values, approvals or provenance. P1 provides target selection, policy source/version/trust display, guideline import with human verification, hierarchical resolution, compliance report, preview and immutable export. SINTA rank is journal metadata, never a generic template selector. P2 adds governed institution/journal maintenance and stale-source monitoring. See [Institutional & Publication Formatting Architecture](architecture/INSTITUTIONAL%20PUBLICATION%20FORMATTING.md).

#### P1 Research File & Conversion product contract

Research File Tools is a cross-domain service surfaced at the point of need in Literature, Data, Writing, and Publication rather than a new top-level domain. The UX contract is `Upload → Detect → Choose Action → Convert / Extract / Import → Preview → Save to Project / Download`.

Format Router selects privacy-first `LOCAL_BROWSER`, sandboxed `SERVER_ISOLATED`, or queued `ASYNC_WORKER` execution from source/target, size, privacy, browser support, server need, complexity, fidelity, license, and capability status. The action list for an academic document may include conversion, title/abstract/chapter/reference/table/figure extraction, project import, reference export, or journal-manuscript preparation—but only actions verified for that exact file are shown as available.

Original files stay immutable/private and derived outputs are new assets. Local processing is preferred where tested feasible; server disclosure is explicit. Parsing/extraction produces reviewable candidates with source provenance and never silently overwrites Research Digital Twin, references, datasets, analyses, or final document sections. See [Research File & Conversion Engine](architecture/RESEARCH%20FILE%20TOOLS.md).

### 7. Publication Gateway

The exit path after a document is submission-ready. Product-facing behavior only; routing mechanics live in the backend master.

| Submodule | Representative features |
|---|---|
| Publication Advisor | Reads a finished project's readiness signals and suggests destination types (international journal, Scopus-indexed journal, SINTA journal, conference, preprint, institutional repository) |
| Destination matching | Journal/venue match scoring against title, abstract, keywords, field, method, OA preference, APC budget |
| Readiness check | Scope, structure, methods reporting, citations, author-guideline compliance |
| Handoff | Guided handoff to the destination's real, official submission URL |

**Relationship:** this domain is deliberately a **router**, never a publisher. It consumes Writing & Citation's finished document and Research Core's project data; it never issues its own DOI, never claims to be a journal, and never claims direct-submission capability unless a specific destination's official API/partnership has been verified (see [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md)). This domain was not present in the earlier eleven-module product exploration (which stopped at a submission-ready draft) and is carried in from the backend master's binding contract — the product surface must account for it even though it postdates the original HTML draft.

### 8. Academy

Structured, sequential, paid learning — deliberately distinct from Knowledge & Search's free reference material.

| Submodule | Representative features |
|---|---|
| Curriculum | Courses, learning paths, tutorials, workshops |
| Practice | Practice datasets, assessments, certificates |

**Relationship:** the boundary with Knowledge & Search is explicit and load-bearing — Learn/Knowledge & Search is a free reference read in any order; Academy is a paid course followed start-to-finish to a certificate. A knowledge-base method entry may link to a related Academy course, but the two are never merged into one browsing experience.

### 9. Institution

Organizational use of the platform — supervisors, departments, and institution administrators overseeing many `ResearchProject` records at once.

| Submodule | Representative features |
|---|---|
| Institution workspace | Institution-scoped visibility into member projects, cohort/programme grouping |
| Oversight | Supervisor review access, institution-level progress and readiness reporting |
| Institution admin | Member/role management, institution-level entitlements |

**Relationship:** this domain sits above Research Core rather than beside the individual-researcher domains — it is a lens over the same `ResearchProject` aggregate, gated by the same private-by-default access control (nothing becomes institution-visible except through explicit sharing or an institution-scoped role), and consumes the same Admin Architecture surfaces described in the backend master. This domain was not part of the original eleven-module consumer-facing exploration; it is carried in here specifically because the locked baseline names it as one of the nine Research OS product surfaces.

---

## Owned Data

This document does not define schema. Each domain's representative data, at the concept level, is:

| Domain | Representative concepts (see backend master §24 for the entity list) |
|---|---|
| Research Core | Project, research question, objective, hypothesis, variable, methodology, sample, instrument |
| Research AI | Conversation, message, tool-call record |
| Knowledge & Search | Knowledge article, taxonomy node, method entry, search index |
| Literature & Evidence | Reference, author, journal, collection, note, attachment |
| Dataset & Analysis | Dataset, dataset version, analysis, analysis result |
| Writing & Citation | Document, section, document version, citation, bibliography |
| Publication Gateway | Publication destination, match record, submission record |
| Academy | Course, learning path, enrollment, certificate |
| Institution | Institution, membership, cohort, institution-level entitlement |

Authoritative field-level ownership belongs to [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) §24 and the (planned) `database/` documents — this table exists only to keep the product and backend vocabularies aligned.

---

## Inputs

- Prior product exploration synthesized from eight reference product classes (SAGE Research Methods, Scribbr, Elicit, Consensus, ResearchRabbit, Connected Papers, Zotero, Mendeley) — each contributed one structural pattern, not a feature to copy wholesale.
- The locked backend baseline (`ResearchProject` as aggregate, Project Context Engine, AI Gateway, Integration Gateway, Publication Gateway as router) as binding constraints this document must not contradict.
- Live product state: the six-item header navigation (Discover, Learn, Research, Analyze, Write, Academy, plus the Metode AI CTA and Masuk/My Research) already implemented in the frontend.
- User research and persona work (informing which lifecycle stage a given feature belongs to) — see the Business Requirements Document, User Persona Document, and UX Research Document HTML sources retained in this `docs/` directory as historical reference material, pending formal markdown conversion.

## Outputs

- The canonical module → submodule → feature → relationship map that sitemap and PRD documents are derived from.
- The domain vocabulary (Research Core, Research AI, Knowledge & Search, Literature & Evidence, Dataset & Analysis, Writing & Citation, Publication Gateway, Academy, Institution) used consistently across every other architecture document in this tree.
- The navigation-reconciliation record below, consumed by IA/sitemap work.
- The Research Knowledge Graph concept, consumed by database domain-modeling work before any Learn/Analyze schema is finalized.

---

## Dependencies

- [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) — binding system-level contracts this document's domains must remain consistent with (Research Core as aggregate, Project Context Engine, AI Gateway, Integration Gateway, Publication Gateway as router, modular monolith baseline).
- [MASTER AI GOVERNANCE.md](MASTER%20AI%20GOVERNANCE.md) — governs how the Research AI domain's capabilities are allowed to behave (grounding, hallucination handling, authorship boundaries).
- [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md) — governs which third-party systems each domain (Literature & Evidence, Dataset & Analysis's software guides, Writing & Citation's Word/Docs support, Publication Gateway's destinations) is actually allowed to claim as integrated, and how.
- [MASTER DATA GOVERNANCE.md](MASTER%20DATA%20GOVERNANCE.md) — governs private-by-default project data, institution-visibility rules, and retention across every domain that owns user-authored or dataset content.

## Strategic references

Product category, competitive evidence and differentiation are governed by [Strategic Positioning](strategy/STRATEGIC%20POSITIONING.md), [Competitive Landscape](strategy/COMPETITIVE%20LANDSCAPE.md), [Product Differentiation](strategy/PRODUCT%20DIFFERENTIATION.md), and [Research Operating System](strategy/RESEARCH%20OPERATING%20SYSTEM.md). These documents consume this architecture; they do not replace its domain or implementation contracts.

## Design reference

Product experience direction is governed by [Master UI/UX Design Direction](design/MASTER%20UI%20UX%20DESIGN%20DIRECTION.md). It translates this product architecture into visual and interaction principles without redefining domain ownership, canonical state, status vocabulary or capability availability.

---

## Extension Points

- **New domain:** a genuinely new product surface (e.g., a future Peer Review or Grant-Writing domain) is added as a tenth domain with its own module → submodule → feature → relationship entry here; it must not be folded into an existing domain's submodule list if its relationships and owned data are materially different.
- **New submodule within an existing domain:** the common case — e.g., a new Dataset & Analysis statistical method, a new Knowledge & Search taxonomy branch, a new Writing & Citation document type. Added without touching this document's domain boundaries.
- **New reference product pattern:** if a future competitive/reference analysis surfaces a structural pattern worth adopting (the way SAGE, Scribbr, Elicit, Consensus, ResearchRabbit, Connected Papers, Zotero, and Mendeley did originally), it lands in the relevant domain's submodule table, not as a new top-level domain, unless it genuinely introduces a new relationship class.
- **Research Knowledge Graph growth:** new entity types (beyond the current ten: method, design, variable, instrument, sampling technique, statistical test, software, paper, author, dataset) are additive and must be evaluated for real queryable relationships, not added as free-text tags.

---

## Security & Privacy

- Every domain inherits private-by-default project visibility from Research Core; no domain (including Institution) may expose project content beyond what explicit sharing or an institution-scoped role grants.
- Knowledge & Search's knowledge-base content is the one deliberately public-readable surface in the product; every other domain's user-generated content (literature notes, datasets, documents, AI conversations) defaults to private.
- Research AI's advisory capabilities must not surface one project's context while answering inside another — this is enforced by Project Context Engine access control (backend master §7), not by this document, but every Research AI capability listed here is bound by it.
- Publication Gateway must never present a destination-match score as an acceptance guarantee, and must carry verification metadata for every destination record (backend master §16) so product copy cannot overstate what is a routing suggestion as a partnership.
- Institution oversight access is a role-gated lens, not a separate copy of project data — an institution admin sees the same `ResearchProject` records a member owns, scoped by role, never a duplicated or exported view that could drift out of the access-control boundary.

---

## Failure Modes

| Failure | Product-level consequence | Mitigation |
|---|---|---|
| A domain's features get documented without a relationship to any other domain | The product regresses into a flat feature list — the exact failure mode this document exists to prevent | Every domain entry above states at least one concrete cross-domain relationship; no domain may be added to this document without one |
| Knowledge & Search entries are built as standalone articles | Loses the Methods Map differentiator, becomes indistinguishable from a generic content site | Method entry template (Related Methods, Statistical Tests, Software, Papers, Templates, Calculator, Ask Research AI) is mandatory, not optional, per entry |
| Publication Gateway copy implies direct submission or guaranteed acceptance | Academic-integrity and trust risk, and a factual misrepresentation of what the product does | Hard rule carried from backend master §16: guided handoff only, unless a specific destination's API/partnership is verified |
| Academy and Knowledge & Search blur together in navigation or content | Users can't tell free reference material from a paid structured course, undermining both | Explicit boundary stated in this document's Academy relationship entry; must be reflected in IA/sitemap |
| Institution domain built as a bolt-on export/report feature instead of a scoped lens over Research Core | Creates a second, driftable copy of project data and a privacy gap | Institution's Owned Data and Security & Privacy sections above require it to remain a role-gated view, not a copy |

---

## Observability

Product-architecture documents are not instrumented systems, so observability here means **structural traceability**, not telemetry:

- Every domain's submodule/feature list must remain traceable to a legacy module name (noted per domain heading) so historical product decisions aren't silently orphaned.
- The navigation-reconciliation table below must be re-checked whenever the live header navigation changes, so this document never silently drifts out of sync with the shipped IA.
- Runtime observability (AI latency, provider health, queue depth, etc.) for the systems behind these domains is defined in [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) §29 and the (planned) `operations/` documents, not here.

---

## P0/P1/P2/P3

**P0 core IP:** Research Digital Twin, Research Compiler / Consistency Engine, End-to-End Research Execution Pipeline, **Data → Analysis → Interpretation → Academic Document Pipeline**, immutable Dataset/AnalysisRun/Result Provenance backbone, Evidence-to-Claim Graph, and Next Best Research Action Engine. These extend the locked ResearchProject/Project Context/AI Gateway/Agent Orchestrator/Integration Gateway/Publication Gateway architecture; they do not replace it.

Backend implementation follows the gated [P0 Backend Implementation Sequence](implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md); product visibility cannot pull a dependent backend capability ahead of its security, ownership, provenance and runtime prerequisites.

Priority here is about which **domain** must exist in a usable form first, consistent with backend master §31:

- **P0 — Research Core, Knowledge & Search (core), Literature & Evidence (Crossref/OpenAlex-backed core), Research AI (core capability set), Writing & Citation (document structure + citation engine), and the Dataset-to-Document backbone (immutable/versioned data, mapping/preparation, capability registry, AnalysisRun, result provenance, interpretation/document QA and approvals).** These form the minimum lifecycle from idea and evidence through verified result and traceable writing.
- **P1 — Initial available Dataset & Analysis formats/methods/renderers within the locked P0 backbone, institutional/publication Formatting Policy Registry + guideline import/compliance, Research File & Conversion Engine (privacy-first routing, research converters, parsing/extraction/import), Publication Gateway (registry + guided handoff), Institution (foundation).** Capability availability is narrower than architectural support and must be verified before product claims.
- **P2 — Academy, Dataset & Analysis depth (SEM/PLS-SEM, qualitative/mixed methods), governed institution/journal policy portal and stale-source monitoring, Publication Gateway depth (deeper OJS/API-backed submission), Institution depth.** These deepen the product for committed users and paying institutions but are not required for an individual researcher's first complete project.
- **P3 — Research Knowledge Graph as a fully queryable entity-relationship system (rather than curated cross-links), community/marketplace features on top of any domain.** Explicitly deferred: this is the single most differentiating concept in the product, but it demands its own ERD decision (see Open Questions) and should not be attempted before the P0 domains are stable.

---

## Current Status

Documented, not implemented. This document reflects a synthesized product architecture derived from an earlier HTML draft (`MetodePenelitian.com - Master Product Architecture v1.0.html`, retained in this directory as historical source material) and reconciled with the locked backend baseline. No frontend information architecture, page inventory, or navigation change has been finalized from it yet; no domain's data model has been implemented. The live product currently exposes a six-item header (Discover, Learn, Research, Analyze, Write, Academy) plus a Metode AI call-to-action and a Masuk/My Research entry point — see the navigation-reconciliation table below for how that maps onto the nine domains above.

### Navigation reconciliation (live nav vs. this document's domains)

| Live nav item | Domain(s) here | Status |
|---|---|---|
| Discover | Knowledge & Search (discovery half), Literature & Evidence | Matches directly |
| Learn | Knowledge & Search (reference half) | Matches; submenu structure needs deepening to the Methods Map pattern |
| Research | Research Core (Plan + Execute), Writing & Citation's citation layer | One label currently covers three legacy modules (Plan, Execute, Cite & Evidence) — submenu order not yet decided |
| Analyze | Dataset & Analysis | Matches; submenu (including Analysis Advisor) needs deepening |
| Write | Writing & Citation | Matches; submenu needs deepening |
| Academy | Academy | Matches directly |
| Metode AI (CTA) | Research AI | Matches directly; CTA placement already correct |
| Masuk / My Research | Research Core (workspace) | Blocked on real authentication — not yet implemented in code |
| *(no current slot)* | Institution | Not yet represented in navigation |
| *(currently footer-only)* | Third-party integrations, which now belong inside each domain at point of need (Zotero in Literature & Evidence, SmartPLS in Dataset & Analysis, Word in Writing & Citation) rather than a standalone "Integrations" page | Open — see Open Questions |
| *(no current slot)* | Publication Gateway | Not yet represented in navigation; postdates the original draft |

---

## Open Questions

1. **Submenu order under "Research."** Should Plan → Execute → Cite & Evidence display in lifecycle order, or should Execute (the daily workspace) surface first since it is used most frequently once a project exists?
2. **Does a standalone Integrations surface remain, or does every third-party connector live only inside the domain that needs it?** This document leans toward "distributed at point of need," consistent with [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md), but the navigation/IA decision has not been formally made.
3. **What phase does the global Research Knowledge Graph ship in?** It is distinct from the P0 project-scoped Research Digital Twin: the global graph supports cross-project/public knowledge discovery, while the Twin is one authorized project's canonical execution state. The global graph requires its ten entity types to be real, queryable relations rather than curated cross-links; its phase and privacy-safe relationship to opted-in/public Twin data remain an ERD and data-governance decision.
4. **Where does Publication Gateway surface in navigation and in the researcher's mental model?** It postdates the original eleven-module product exploration; this document places it as domain 7, but no sitemap decision has placed it in the live IA yet.
5. **How does Institution surface without becoming a second product?** Whether Institution gets its own top-level navigation entry, or remains a role-scoped lens reachable only from within My Research/Research Core, is undecided.
6. **Analysis Advisor's underlying decision logic** (rule engine vs. decision tree vs. AI-only reasoning) is a distinct technical-architecture question from this document's product-level description of it as a submodule — flagged here so it is not lost, resolved in Dataset & Analysis's own domain documents when written.

---

## Related Documents

- [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) — binding system architecture this document's domains map onto.
- [MASTER AI GOVERNANCE.md](MASTER%20AI%20GOVERNANCE.md) — governs the Research AI domain's behavior and safety constraints.
- [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md) — governs third-party integration claims referenced throughout the Core Components section.
- [MASTER DATA GOVERNANCE.md](MASTER%20DATA%20GOVERNANCE.md) — governs privacy and data-ownership rules referenced in Security & Privacy.

*This document supersedes the standalone HTML product-architecture draft as the canonical product-domain reference. The HTML file is retained in this directory as historical source material only.*
