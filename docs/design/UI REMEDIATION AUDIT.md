# UI Remediation Audit

**Status:** `SOURCE_AUDITED / RUNTIME_NOT_VERIFIED / OPEN_REMEDIATION`

**Audit date:** 2026-08-27

**Scope:** UI source existing only; no UI, CSS, component, backend, architecture, or dependency change.

**Runtime limitation:** in-app Browser and Chrome were unavailable. Responsive, keyboard, screen-reader, contrast, reflow, and visual-composition findings are therefore source-level risks, not browser verification or WCAG conformance claims.

## 1. Source of truth and method

The audit uses these locked documents as binding design direction:

- [Master UI/UX Design Direction](MASTER%20UI%20UX%20DESIGN%20DIRECTION.md)
- [Design Principles](DESIGN%20PRINCIPLES.md)
- [Product UI Patterns](PRODUCT%20UI%20PATTERNS.md)
- [Research AI Interaction Patterns](RESEARCH%20AI%20INTERACTION%20PATTERNS.md)
- [UI Anti-Patterns](UI%20ANTI%20PATTERNS.md)

Consistency was checked against [Strategic Positioning](../strategy/STRATEGIC%20POSITIONING.md), [Research Operating System](../strategy/RESEARCH%20OPERATING%20SYSTEM.md), [Master Product Architecture](../MASTER%20PRODUCT%20ARCHITECTURE.md), the architecture set, and the ADR set. The review covered all current routes and shared components, including the active homepage composition, Header, Footer, Knowledge Base, Research Tools, `ComingSoon` routes, inactive homepage source, design tokens, responsive classes, and source-level accessibility patterns.

Priority meaning:

- **P0:** misleading capability/content, Research OS structural conflict, wrong provenance/verification state, or an accessibility/mobile blocker.
- **P1:** high-impact usability, hierarchy, consistency, Research AI, provenance, or responsive weakness.
- **P2:** non-blocking polish. Deferred until all P0 and P1 items are reviewed and locked.

## 2. Executive finding

The active homepage has a credible visual foundation: warm canvas, restrained blue, disciplined typography roles, continuous use of one research-project example, large bounded product surfaces rather than feature-card grids, contextual AI placement, and moderate section spacing. Those choices should be protected.

The current UI is not yet safe to present as a functioning Research OS. Static preview elements resemble controls, primary CTAs lead to unavailable routes, example papers and statistical results lack explicit illustrative/provenance states, and AI recommendations are not separated from canonical state with `PROPOSED` plus review anatomy. Research Tools also have programmatic-label, result-announcement, and data-validation risks.

**Issue count:** P0 = 9, P1 = 11, P2 = 4.

## 3. Category coverage

| Category | Source-level conclusion | Primary issue IDs |
|---|---|---|
| A. Visual identity | Foundation aligns; token language splits between homepage and shared chrome | UI-012, UI-020 |
| B. Information hierarchy | Repeated centred section composition weakens narrative progression | UI-011 |
| C. Research lifecycle continuity | Same project is reused, but object/dependency/provenance navigation is absent | UI-010 |
| D. Research object clarity | Project context exists; canonical identity/version/status remain incomplete | UI-006, UI-010 |
| E. Research AI treatment | Contextual placement is good; proposal/review contract is missing | UI-005 |
| F. Evidence/provenance visibility | Example evidence and results are not truthfully qualified or traceable | UI-003, UI-004 |
| G. Workspace density | Large bounded panels and rows are appropriate; protect them | PROTECT-02 |
| H. Typography | Roles are promising; very small uppercase metadata creates readability risk | UI-012, UI-013 |
| I. Color usage | Blue is restrained; semantic/status mapping and contrast need correction | UI-006, UI-013 |
| J. Surface/card usage | Homepage is restrained; secondary content still uses generic card conventions | UI-020 |
| K. Navigation | Capability availability and disclosure keyboard behaviour are incomplete | UI-001, UI-015, UI-019 |
| L. Forms/inputs | Labels are not programmatically associated; validation context is incomplete | UI-007, UI-017 |
| M. Responsive behaviour | Useful mobile adaptations exist; dense form grids and tablet navigation remain risks | UI-016 |
| N. Accessibility | Labels, announcements, focus consistency, contrast, and reduced motion require remediation | UI-007, UI-008, UI-013, UI-014, UI-015, UI-022 |
| O. Fake/demo ambiguity | Static affordances and example data are not explicitly previews/illustrations | UI-001, UI-002, UI-003, UI-004, UI-009 |
| P. Verification/status ambiguity | Workflow status, AI proposal, evidence truth, and canonical status are conflated | UI-003, UI-004, UI-005, UI-006 |
| Q. Interaction consistency | Buttons, selected states, confirmation, and unavailable routes are inconsistent | UI-001, UI-002, UI-014, UI-023 |

## 4. P0 findings

### UI-001 — Available-looking actions lead to unavailable or inert capability

- **ID:** UI-001
- **Priority:** P0
- **Location:** Header search and Copilot/login/register links; Hero primary/secondary CTA; Closing CTA; `/ai`, `/login`, and `/register` routes.
- **Observed State:** Search is an enabled button without an action. High-prominence CTAs navigate to generic `ComingSoon` pages. The source does not disclose unavailability at the decision point.
- **Expected State:** Every visible action truthfully communicates `AVAILABLE`, `UNAVAILABLE`, or equivalent capability state before activation. A marketing CTA must not imply working authentication or Copilot.
- **Why It Matters:** Misleading capability damages trust and violates the architecture rule that documentation or UI visibility is not proof of runtime availability.
- **Minimal Fix:** Disable/remove inert search until available; relabel unavailable CTAs as preview/waitlist/coming soon or route them to one truthful available destination.
- **Do Not Change:** Header structure, logo, lifecycle navigation taxonomy, backend/auth architecture.
- **Verification Needed:** Keyboard and pointer activation; route destination; mobile and desktop labels; capability-state copy review.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-002 — Homepage preview contains fake interactive affordances

- **ID:** UI-002
- **Priority:** P0
- **Location:** Hero prompt/actions; Research Workspace lifecycle navigation and AI action; Discover search, filters, and Save action.
- **Observed State:** Static `div`/`span` elements are styled as inputs, tabs, filters, and buttons; some have hover or cursor treatment. No visible label says the surfaces are non-interactive previews.
- **Expected State:** A product preview is visibly marked `ILLUSTRATIVE PREVIEW`, and non-actions do not imitate enabled controls; alternatively, real controls must use correct elements and behaviour.
- **Why It Matters:** Users cannot distinguish product demonstration from functionality, creating fake/demo ambiguity.
- **Minimal Fix:** Add one clear preview label per bounded product surface and remove interactive styling/cursors from inert elements. Do not implement the feature as part of this fix.
- **Do Not Change:** Existing panel composition, example project continuity, or contextual placement of AI.
- **Verification Needed:** Pointer, keyboard, screen-reader naming, and touch affordance review at all breakpoints.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-003 — Example papers and evidence claims appear source-backed without provenance

- **ID:** UI-003
- **Priority:** P0
- **Location:** Discover Evidence summary, paper rows, relevance, citation counts, key findings, and “saved” state.
- **Observed State:** Specific titles, authors, journals, samples, citations, relevance, findings, and aggregate evidence wording are presented without `ILLUSTRATIVE`, `DEMO`, `NOT VERIFIED`, source/provider, DOI, retrieval time, or canonical `ResearchReference` provenance.
- **Expected State:** Every displayed paper/result is either backed by a canonical source with inspectable provenance or explicitly labelled illustrative/not verified. “Saved” must not imply canonical persistence in a static preview.
- **Why It Matters:** Apparent academic evidence can be mistaken for real evidence and corrupt product credibility or research decisions.
- **Minimal Fix:** Label the whole dataset and each derived claim as illustrative; rename saved state to an illustrative preview state. Add real provenance only when backed by a real canonical record.
- **Do Not Change:** Evidence-first row structure, project connection, or future `ResearchReference` contract.
- **Verification Needed:** Content audit against actual source records; status wording; screen-reader reading order; mobile persistence of truth labels.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-004 — Example statistical results appear analysis-derived without an AnalysisRun

- **ID:** UI-004
- **Priority:** P0
- **Location:** Methodology Analysis context, result statistics, interpretation, and software connection; related static sample-size values in workspace previews.
- **Observed State:** Numerical results and an interpretation are displayed without an illustrative label, dataset identity/version, analysis plan, immutable `AnalysisRun`, assumptions/diagnostics, result provenance, or execution status.
- **Expected State:** Numbers trace to a pinned dataset and AnalysisRun, or the complete surface is unmistakably `ILLUSTRATIVE / NOT PRODUCTION-DERIVED`.
- **Why It Matters:** Decorative statistics violate the immutable-analysis-provenance invariant and can be mistaken for verified research output.
- **Minimal Fix:** Mark the preview and every derived result/interpretation illustrative. Do not fabricate run metadata; add it only when runtime-backed.
- **Do Not Change:** Scientific-instrument layout, tabular-number typography, or separation of context, recommendation, flow, result, and interpretation.
- **Verification Needed:** Provenance trace test when backed by runtime; label visibility on mobile; content review for every numerical claim.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-005 — Research AI recommendations are not distinguished from canonical state

- **ID:** UI-005
- **Priority:** P0
- **Location:** Research Workspace AI recommendation and Methodology Analysis recommendation/AI text; Hero Research AI command preview.
- **Observed State:** Recommendations appear as confident product copy without `PROPOSED`, canonical-state safety, evidence, assumptions, alternatives, risks, provenance, or review/apply boundary.
- **Expected State:** Use the locked Research AI anatomy: `PROPOSED`, recommendation, Why, Evidence, Assumptions, Alternatives, Risks, expected impact, provenance, and governed review action. Canonical state remains visibly unchanged until approval.
- **Why It Matters:** AI is not a source of truth; styling suggestions as facts breaks a constitutional Research OS boundary.
- **Minimal Fix:** Add a compact proposed-state treatment and disclosure for the required review anatomy; for static previews, mark all content illustrative and actions inert.
- **Do Not Change:** Contextual AI placement; do not introduce a floating chatbot, agent theatre, or new AI capability.
- **Verification Needed:** State-transition contract test; reviewer/approval copy; provenance disclosure; keyboard access to collapsed details.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-006 — Workflow progress is visually ambiguous with canonical verification state

- **ID:** UI-006
- **Priority:** P0
- **Location:** Methodology Analysis `Complete`, `Ready`, `Next`, `Pending`; workspace project metadata and recommendation state.
- **Observed State:** English workflow labels are mapped mainly through text color and sit near analysis/recommendation content without scope, authority, verifier, or explicit distinction from `PROPOSED`, `VERIFIED`, `APPROVED`, `BLOCKED`, `UNKNOWN`, and `UNAVAILABLE`.
- **Expected State:** Lifecycle/execution progress and canonical verification/approval are separate labelled dimensions; no state is color-only.
- **Why It Matters:** A completed UI step can be misread as verified research truth or approval.
- **Minimal Fix:** Prefix/scope workflow states (for example, “Step status”) and add the applicable canonical state separately; keep canonical vocabulary owned by architecture.
- **Do Not Change:** Underlying workflow order or introduce new backend statuses.
- **Verification Needed:** Status vocabulary review against architecture; color-independent comprehension; screen-reader announcement.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-007 — Essential form controls lack programmatic labels

- **ID:** UI-007
- **Priority:** P0
- **Location:** Citation, Sample Size, Slovin, and Cronbach tools; Knowledge Base search.
- **Observed State:** Visible `<label>` elements have no `htmlFor`/matching control `id`; Knowledge Base search relies on placeholder text alone.
- **Expected State:** Every control has a unique programmatic name, visible label where appropriate, and help/error association through `aria-describedby`.
- **Why It Matters:** Screen-reader and voice-input users may be unable to identify or operate core inputs reliably.
- **Minimal Fix:** Associate current labels with existing controls; add a visually available or screen-reader-only label for search; connect help/error text.
- **Do Not Change:** Calculator logic, field order, or Knowledge Base filtering behaviour.
- **Verification Needed:** Accessible-name inspection, screen-reader smoke test, keyboard sequence, and error association.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-008 — Essential results and errors are not announced

- **ID:** UI-008
- **Priority:** P0
- **Location:** Sample Size, Slovin, Cronbach, and Citation copy feedback.
- **Observed State:** Results, validation errors, and copied state are inserted visually without an appropriate live region, focus strategy, or explicit result/error relationship.
- **Expected State:** Essential calculation outcomes and errors are announced once, with focus moved only when appropriate; copy confirmation is non-disruptive but perceivable.
- **Why It Matters:** A screen-reader user can activate the primary task and receive no perceivable outcome.
- **Minimal Fix:** Add scoped `role="status"`/`aria-live` for results and copy feedback, `role="alert"` or associated error semantics for blocking validation, and preserve current focus unless an error summary is needed.
- **Do Not Change:** Calculation formulas or visual result layout.
- **Verification Needed:** NVDA/VoiceOver announcement order; repeat calculation; reset; invalid input; clipboard failure.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-009 — Cronbach sample and parser can produce misleading analysis input

- **ID:** UI-009
- **Priority:** P0
- **Location:** Cronbach calculator default textarea and `parseMatrix` input handling.
- **Observed State:** The textarea is prefilled with unlabeled sample scores. Parsing silently removes non-numeric cells; if malformed cells occur consistently, the remaining matrix can still produce an authoritative alpha without reporting discarded data.
- **Expected State:** Sample data is explicitly `DEMO`, must be deliberately loaded or clearly identified, and parsing rejects rather than silently mutates invalid rows/cells. Result provenance states whether input is demo or user-provided.
- **Why It Matters:** Silent data alteration can produce a wrong statistical result while appearing valid.
- **Minimal Fix:** Label/default-clear the sample and make parsing fail with row/cell-specific feedback whenever any non-empty cell is invalid.
- **Do Not Change:** Cronbach formula or interpretation thresholds in this UI remediation; those require a separate statistical validation gate.
- **Verification Needed:** Valid matrix; malformed same-column data; ragged rows; blank lines; decimal formats; demo/user-data status; independent formula test.
- **Status:** `OPEN / SOURCE_CONFIRMED`

## 5. P1 findings

### UI-010 — Lifecycle continuity is shown narratively but not inspectably

- **ID:** UI-010
- **Priority:** P1
- **Location:** Active homepage previews.
- **Observed State:** The same example project connects Hero, Workspace, Evidence, and Analysis, but users cannot inspect object identity, version, upstream/downstream dependency, evidence-to-claim link, or provenance trail.
- **Expected State:** Preview relationships use compact lineage/row/inspector language consistent with the Research Digital Twin, without a giant graph.
- **Why It Matters:** The current page can still be read as four product screenshots rather than one continuous operating system.
- **Minimal Fix:** Add one small persistent project/version marker and one explicit relationship line between each preview stage.
- **Do Not Change:** Section order, same-project narrative, or introduce a large node graph.
- **Verification Needed:** Comprehension test: users can name what moved between stages and where it came from.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-011 — Repeated centred section composition weakens hierarchy

- **ID:** UI-011
- **Priority:** P1
- **Location:** Research Workspace, Discover Evidence, and Methodology Analysis section introductions.
- **Observed State:** Consecutive sections repeat eyebrow → centred heading → centred description → large panel with nearly identical spacing and width.
- **Expected State:** The continuous lifecycle should have purposeful transitions and varied but consistent hierarchy, avoiding a PowerPoint-like stack.
- **Why It Matters:** Repetition makes integrated research stages feel like separate feature slides.
- **Minimal Fix:** Keep panels; vary only the transition/caption alignment or add a compact lifecycle handoff line. Do not redesign the homepage.
- **Do Not Change:** Core copy, product surfaces, or restrained whitespace.
- **Verification Needed:** Rendered desktop/mobile visual review and hierarchy comprehension test.
- **Status:** `OPEN / VISUAL_NOT_VERIFIED`

### UI-012 — Token and typography language is split between homepage and shared chrome

- **ID:** UI-012
- **Priority:** P1
- **Location:** Tailwind theme, global body, Header/Footer/secondary routes versus homepage components.
- **Observed State:** Homepage uses research/canvas/graphite/Plex/mono roles while shared chrome and secondary pages use brand/slate/Inter/Outfit. Comments explicitly preserve two systems.
- **Expected State:** One governed semantic token layer maps application roles across all surfaces; component implementation should not depend on page-specific color families.
- **Why It Matters:** Continued implementation will drift into two products and inconsistent state semantics.
- **Minimal Fix:** Define a future token mapping/audit before new UI work; migrate only when touching a component for a functional remediation.
- **Do Not Change:** Current font assets, logo colors, or stable homepage palette in a bulk rewrite.
- **Verification Needed:** Token inventory, component-state mapping, contrast test, and rendered regression.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-013 — Small metadata and low-opacity text create readability/contrast risk

- **ID:** UI-013
- **Priority:** P1
- **Location:** Homepage metadata/status text, paper metadata, Header/Footer disabled text, tool help text.
- **Observed State:** Frequent 10–11px uppercase mono text and low-opacity graphite/slate text carry status, evidence metadata, and help information.
- **Expected State:** Trust-critical metadata remains compact but readable; contrast and type size meet the locked baseline.
- **Why It Matters:** Provenance/status becomes technically present but practically invisible, especially on mobile or zoom.
- **Minimal Fix:** Raise only trust-critical metadata to a tested readable token and replace opacity-based semantic text with explicit accessible colors.
- **Do Not Change:** Overall density or mono role for data/provenance.
- **Verification Needed:** WCAG contrast measurement, 200% zoom, mobile reflow, and low-vision review.
- **Status:** `OPEN / RUNTIME_NOT_VERIFIED`

### UI-014 — Visible focus is not consistently implemented

- **ID:** UI-014
- **Priority:** P1
- **Location:** Homepage CTAs, logo, Footer links, Language Switcher, tools, Knowledge Base filters/cards, Article Feedback, ComingSoon CTA.
- **Observed State:** Header controls have a shared focus ring, while many other interactive elements rely on browser defaults or hover-only styling.
- **Expected State:** Every interactive element has a consistent, visible focus indicator that survives all backgrounds.
- **Why It Matters:** Keyboard location becomes inconsistent across primary flows.
- **Minimal Fix:** Reuse one existing focus-visible utility across current controls when each issue is touched.
- **Do Not Change:** Control hierarchy, action order, or hover styling unless contrast requires it.
- **Verification Needed:** Full keyboard walkthrough on light, blue, and navy surfaces.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-015 — Navigation disclosure behaviour is incomplete for keyboard users

- **ID:** UI-015
- **Priority:** P1
- **Location:** Desktop dropdowns and mobile accordions.
- **Observed State:** Desktop supports click, outside click, Escape, and `aria-expanded`, but Escape does not explicitly restore trigger focus; disclosure ownership lacks `aria-controls`; open-panel focus behaviour is unspecified. Mobile accordion similarly lacks an explicit control/panel relationship.
- **Expected State:** A consistent disclosure pattern with programmatic trigger-panel relationship, predictable focus, Escape restoration, and logical tab order.
- **Why It Matters:** Dense navigation can become disorienting without visible and programmatic state continuity.
- **Minimal Fix:** Add stable panel IDs/control relationships and restore focus to the trigger on Escape; retain native links rather than forcing menu semantics.
- **Do Not Change:** Navigation taxonomy or disabled “Segera” handling.
- **Verification Needed:** Keyboard-only desktop/mobile-emulation walkthrough and screen-reader state announcement.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-016 — Dense tool layouts have mobile squeeze/overflow risk

- **ID:** UI-016
- **Priority:** P1
- **Location:** Citation two-column year/title fields; Sample Size two-column numeric fields; Cronbach three-column result; tool action rows; Header breakpoint below `xl`.
- **Observed State:** Several fixed multi-column grids have no small-screen collapse, action rows do not wrap, and full navigation becomes an accordion through tablet/small-desktop widths.
- **Expected State:** Inputs/results become one column where needed; actions retain 44px-class targets and wrap safely; navigation breakpoint follows available space rather than hiding prematurely.
- **Why It Matters:** Narrow screens, localization, and text zoom may cause truncation or unusable controls.
- **Minimal Fix:** Add responsive grid collapse/wrap classes only where source inspection identifies fixed layouts; do not redesign tools.
- **Do Not Change:** Field order, formulas, or mobile accordion architecture.
- **Verification Needed:** 320/375/768/1024/1280px, 200% zoom, long Indonesian/English labels, no page-level horizontal scroll.
- **Status:** `OPEN / RUNTIME_NOT_VERIFIED`

### UI-017 — Research Tools omit decision context and input constraints

- **ID:** UI-017
- **Priority:** P1
- **Location:** Sample Size, Slovin, Cronbach, and Citation tools.
- **Observed State:** Formula names and short descriptions exist, but assumptions, applicability, limitations, input units/ranges, and citation-output verification responsibility are incomplete. Invalid numeric results render as an em dash without an explicit error.
- **Expected State:** Each tool explains what it calculates, assumptions, limits, source/version where applicable, and a clear validation state. Output is a calculated result, not automatically a verified research decision.
- **Why It Matters:** Correct arithmetic can still be methodologically inappropriate or misinterpreted.
- **Minimal Fix:** Add concise assumptions/limitations and explicit invalid-input messages; do not add methods or change formulas in this UI pass.
- **Do Not Change:** Existing calculators or Research Tools IA.
- **Verification Needed:** Methodologist review, boundary-value tests, citation-style conformance test, and localized error review.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-018 — Generic ComingSoon surfaces dominate many product routes

- **ID:** UI-018
- **Priority:** P1
- **Location:** About, AI, Blog, Community, Contact, FAQ, Learn, Login, Pricing, Privacy, Register, Repository, Research Hub, and Terms routes.
- **Observed State:** One large centred badge/heading/back-home composition is reused across many distinct destinations, including legal and account routes.
- **Expected State:** Unavailable capability is truthful and contextual; legal/contact routes should not masquerade as future product modules.
- **Why It Matters:** Repetition feels like generic SaaS scaffolding and weakens product credibility, but truthful unavailability should be preserved.
- **Minimal Fix:** Group/reduce links to unavailable routes and give only essential destinations a short contextual unavailable state. Legal requirements need separate content work, not visual invention.
- **Do Not Change:** Do not build the missing features or legal content under this remediation.
- **Verification Needed:** Route inventory, content-owner review, and navigation dead-end test.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-019 — Footer and global IA expose excessive unavailable inventory

- **ID:** UI-019
- **Priority:** P1
- **Location:** Footer columns and shared navigation data.
- **Observed State:** Disabled items are truthfully non-links, but the five-column inventory foregrounds many unavailable capabilities and can read as a feature catalogue rather than lifecycle navigation.
- **Expected State:** Global IA prioritizes currently available lifecycle destinations and clearly separates future inventory.
- **Why It Matters:** Availability noise competes with the Research OS path and magnifies the ComingSoon problem.
- **Minimal Fix:** Keep disabled semantics; reduce or group future items under one clearly labelled roadmap/coming-soon cluster.
- **Do Not Change:** Canonical product architecture or remove future domains from documentation.
- **Verification Needed:** Desktop/mobile navigation scan, link-availability audit, and first-click comprehension test.
- **Status:** `OPEN / SOURCE_CONFIRMED`

### UI-020 — Secondary surfaces use inconsistent card/elevation conventions

- **ID:** UI-020
- **Priority:** P1
- **Location:** Knowledge Base result cards, Research Tools index, ToolShell, Article Feedback, ComingSoon badge.
- **Observed State:** Rounded cards, pills, hover lift, and shadows are more prominent than the row/divider language used on the homepage.
- **Expected State:** Cards are reserved for genuinely bounded objects; comparable utilities/articles use the smallest adequate surface treatment.
- **Why It Matters:** Component language drifts and generic SaaS patterns reappear outside the homepage.
- **Minimal Fix:** During the relevant functional remediation, remove hover lift/heavy elevation and use rows/dividers where comparison is primary.
- **Do Not Change:** Knowledge content, tool access, article filtering, or all cards wholesale.
- **Verification Needed:** Rendered hierarchy and clickable-area review; confirm bounded objects remain distinguishable.
- **Status:** `OPEN / VISUAL_NOT_VERIFIED`

## 6. P2 findings — deferred

### UI-021 — Surface radius and shadow values are locally hardcoded

- **ID:** UI-021
- **Priority:** P2
- **Location:** Homepage panels, ToolShell, Knowledge Base cards, dropdowns, feedback, ComingSoon.
- **Observed State:** Multiple radius/shadow recipes are embedded directly in components.
- **Expected State:** Restrained semantic surface/elevation tokens.
- **Why It Matters:** Small visual drift will compound as UI grows.
- **Minimal Fix:** Consolidate only after P0/P1 component corrections reveal stable patterns.
- **Do Not Change:** Do not run a bulk visual rewrite.
- **Verification Needed:** Rendered regression across light/dark-adjacent surfaces.
- **Status:** `DEFERRED`

### UI-022 — Motion preference is only partially respected

- **ID:** UI-022
- **Priority:** P2
- **Location:** Global smooth scrolling, hover transitions, dropdown rotation, inactive animated components; Hero cursor already uses `motion-safe`.
- **Observed State:** `scroll-behavior: smooth` is unconditional and not all transitions/animations show an explicit reduced-motion alternative.
- **Expected State:** All non-essential motion respects `prefers-reduced-motion`.
- **Why It Matters:** Motion sensitivity and accessibility baseline.
- **Minimal Fix:** Add a global reduced-motion override after functional priorities are resolved.
- **Do Not Change:** Meaningful state feedback.
- **Verification Needed:** Reduced-motion OS setting and keyboard navigation.
- **Status:** `DEFERRED`

### UI-023 — Localized and confirmation microcopy is inconsistent

- **ID:** UI-023
- **Priority:** P2
- **Location:** Hardcoded “Copilot”, “Menu”, “Suggested actions”, English workflow statuses, “Segera”, and Article Feedback confirmation.
- **Observed State:** Shared UI mixes localized dictionary content with hardcoded Indonesian/English; feedback confirmation repeats the original question.
- **Expected State:** Consistent localized terminology and a distinct confirmation message.
- **Why It Matters:** Small comprehension and quality cost across languages.
- **Minimal Fix:** Move existing strings into dictionaries and add truthful confirmation copy; do not rename canonical architecture terms.
- **Do Not Change:** Supported locale set or product vocabulary ownership.
- **Verification Needed:** Indonesian/English copy review and long-string reflow.
- **Status:** `DEFERRED`

### UI-024 — Secondary selected/current states need semantic refinement

- **ID:** UI-024
- **Priority:** P2
- **Location:** Knowledge Base category filters, breadcrumbs, and Article Feedback.
- **Observed State:** Selected category is visually styled without `aria-pressed`; breadcrumb current page and decorative separators are not explicitly conveyed/hidden; feedback is local-only with no persistence disclosure.
- **Expected State:** Selected/current semantics are programmatic and local-only feedback is truthfully scoped.
- **Why It Matters:** Improves consistency and assistive-technology clarity without blocking the primary task.
- **Minimal Fix:** Add `aria-pressed`, `aria-current`, hide decorative separators, and clarify local acknowledgement.
- **Do Not Change:** Filtering, routing, or add feedback persistence/backend.
- **Verification Needed:** Accessibility-tree inspection and keyboard activation.
- **Status:** `DEFERRED`

## 7. Homepage findings

- **Hero:** compact spacing and light product panel align with the source of truth. P0 risk comes from unavailable CTAs and an inert prompt/actions surface that looks interactive. It should be labelled as a preview, not rebuilt as a chatbot.
- **Research Workspace Preview:** strongest current section. It uses lifecycle navigation, structured rows, restrained blue, and contextual AI. It still lacks preview truth, canonical version/status, provenance, and `PROPOSED` AI treatment.
- **Discover Evidence:** evidence-first row structure is directionally correct. Its content is unsafe until papers, findings, relevance, counts, and save state are explicitly illustrative or genuinely source-backed.
- **Methodology Analysis:** scientific-instrument composition is promising. Static analysis numbers, interpretation, workflow status, and AI recommendation currently conflict with locked provenance/state contracts.
- **Closing CTA:** one large navy block is not by itself a violation, but its destination is unavailable and its visual weight needs rendered review. Keep the section; correct capability truth first.
- **Header:** clear logo, bounded height, explicit disabled navigation children, focus ring on main controls, and mobile overflow containment are strengths. Search/auth/Copilot availability and disclosure focus need remediation.
- **Footer:** real email and disabled non-links are truthful. The volume of future inventory weakens current-product clarity and focus treatment is inconsistent.
- **Generic SaaS/PowerPoint risk:** no excessive homepage card grid or source-level excessive whitespace was found. The main risk is repeated centred section framing, ComingSoon proliferation, and generic card/elevation language on secondary pages.

## 8. Workspace, Research AI, evidence, mobile, and accessibility

### Workspace

No authenticated workspace route or runtime-authenticated state exists in the audited source. `Header.isAuthenticated` defaults to false and no current caller supplies an authenticated session. Therefore authenticated workspace findings are `NOT IMPLEMENTED / NOT AUDITABLE`, not PASS or FAIL. Inactive homepage components are not part of the active route; before reuse they must pass the same provenance, status, mobile table, and accessibility gates.

### Research AI

AI is correctly placed next to project/methodology context, not as a floating chatbot. The missing `PROPOSED` state, review anatomy, provenance, and governed apply boundary are P0. “Copilot” as a global high-prominence CTA also implies availability that does not exist.

### Evidence and provenance

The active UI has no trustworthy boundary between illustrative content and runtime/canonical records. Paper metadata and statistical results require immediate illustrative labelling. Later runtime implementation must expose canonical source/run identity rather than inventing metadata for the preview.

### Mobile risks

Source contains good bounded adaptations: homepage project navigation uses local horizontal overflow; Header mobile navigation uses a vertically bounded accordion; result rows commonly stack. Remaining risks are fixed two-/three-column tool grids, non-wrapping button rows, tiny metadata, long localized labels, and full desktop navigation hidden below `xl`. Runtime reflow is `UNAVAILABLE`.

### Accessibility risks

Highest risk: unassociated form labels, placeholder-only Knowledge Base search, and unannounced essential result/error changes. Additional risks: inconsistent focus visibility, disclosure focus restoration, low-contrast/tiny metadata, selected-state semantics, and incomplete reduced-motion handling. Semantic homepage headings appear orderly in source, but only a browser/accessibility-tree audit can verify the rendered hierarchy.

## 9. Architecture conflicts

| Conflict | Architecture expectation | UI evidence | Priority |
|---|---|---|---|
| AI suggestion presented without governed state | AI is not source of truth; output is proposed until reviewed | Workspace and methodology AI copy lacks `PROPOSED`/review/provenance | P0 |
| Analysis values without immutable provenance | Dataset → plan → AnalysisRun → result → interpretation must remain traceable | Static result statistics and interpretation lack run/dataset/version | P0 |
| Evidence without canonical identity/provenance | Scholarly records normalize to `ResearchReference` with source provenance | Example papers/finding/counts have no truth label or source identity | P0 |
| Workflow progress conflated with truth status | Lifecycle, execution, verification, approval, and availability are separate | `Complete/Ready/Next/Pending` sits beside canonical-looking result/recommendation | P0 |
| Product visibility ahead of capability | Documentation/UI cannot assert implementation; availability is registry/runtime truth | Search, auth, and Copilot actions appear enabled but are inert/ComingSoon | P0 |
| Screenshots instead of a continuous system | Research OS is project-centred and lifecycle-continuous | Same project helps, but relationships/version/provenance are not inspectable | P1 |

No conflict was found in the page's decision to use one project, restrained surfaces, rows over KPI cards, contextual AI placement, or evidence-first content structure. Those areas are protected.

## 10. Protected stable areas

- **PROTECT-01:** active homepage order and same-project continuity.
- **PROTECT-02:** large bounded workspace/evidence/analysis panels, row/divider density, and moderate `py-10/md:py-14` spacing.
- **PROTECT-03:** warm canvas/paper direction, graphite/ink text, and scarce semantic blue.
- **PROTECT-04:** contextual Research AI placement; never replace with a floating generic chatbot.
- **PROTECT-05:** Header bounded height, real-link versus disabled-text distinction, and mobile vertical overflow containment.
- **PROTECT-06:** Research Workspace local horizontal lifecycle strip; improve overflow affordance only if runtime testing proves necessary.
- **PROTECT-07:** no giant Research Digital Twin graph; use compact lineage/relationship rows and inspector patterns.

## 11. Audit boundaries

- No UI, CSS, component, backend, architecture, design source-of-truth, or dependency was changed.
- No runtime/browser, screenshot, keyboard, screen-reader, contrast, or responsive PASS is claimed.
- No new product, Academy, plagiarism, converter, authentication, or Research AI feature is proposed.
- Exact execution order is defined only in [UI Remediation Sequence](../implementation/UI%20REMEDIATION%20SEQUENCE.md).
