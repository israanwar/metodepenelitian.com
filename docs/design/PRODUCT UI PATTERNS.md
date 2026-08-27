# Product UI Patterns

**Status:** LOCKED — canonical product interaction-pattern catalogue

**Scope:** Documentation only. These are pattern contracts, not component specifications, final tokens or implementation claims.

## Pattern rules

Every pattern declares its research object, status, provenance, primary action, failure behaviour and responsive/accessibility needs. Product labels must use canonical architecture vocabulary; examples below do not create new backend statuses.

## 1. Project header

**Purpose:** orient the user inside one `ResearchProject`.

**Anatomy:** project title; project/document type; current lifecycle stage; canonical version or last update; verification/compiler summary; sharing/privacy state; primary next action; overflow actions.

**Rules:** avoid vanity metrics. Title and status remain visible when local navigation changes. Archive/delete is separated from routine actions.

**Responsive/accessibility:** preserve title, state and next action on mobile; move secondary metadata into an accessible disclosure; use one semantic page heading.

## 2. Research navigation

**Purpose:** move across the canonical lifecycle without turning utilities into primary domains.

**Default order:** Overview, Literature, Methodology, Instruments, Data, Analysis, Writing, References.

**Rules:** active section is textually and visually clear. Warnings/blockers may appear as counts with explanations, never color dots alone. Converter, plagiarism and file utilities remain secondary/contextual.

**Responsive/accessibility:** sidebar on wide screens; bounded tab strip or menu on smaller screens. Keyboard order follows lifecycle; horizontal strip exposes overflow affordance.

## 3. Research object row

**Purpose:** compare and select canonical objects such as variables, hypotheses, instruments or document sections.

**Anatomy:** object type/ID; primary label; relationship summary; verification/approval status; version/updated metadata; issue indicator; relevant action.

**Rules:** row, not card, is the default for comparable objects. Selection must not imply approval. Bulk actions must state scope and impact.

## 4. Evidence row

**Purpose:** show evidence as a project relationship, not merely a search result.

**Anatomy:** source identity; exact locator/excerpt where permitted; evidence type/direction; linked claim(s); admissibility/verification; limitations; project connection.

**Rules:** “saved,” “relevant,” “supports,” “contradicts” and “verified” are distinct. Missing full text or locator is explicit.

## 5. Source metadata

**Purpose:** make scholarly identity and provenance inspectable.

**Anatomy:** title, authors, year, journal/venue, DOI/identifier, source provider, fetched/verified time, access/full-text state, duplicate/metadata confidence.

**Rules:** DOI is an identifier, not proof of claim quality. Provider-native shape never replaces canonical `ResearchReference` presentation.

## 6. Research AI recommendation

**Purpose:** propose a context-specific action or decision.

**Anatomy:** status, recommendation, Why, Evidence, Assumptions, Alternatives, Risks, expected impact, provenance and review action.

**Rules:** use [Research AI Interaction Patterns](RESEARCH%20AI%20INTERACTION%20PATTERNS.md). AI confidence never equals verification; apply occurs through governed commands.

## 7. Verification state

**Purpose:** communicate evidence/method/analysis/compiler state without false certainty.

**Anatomy:** exact canonical label; scope/object; verifier/method; evidence; timestamp/version; stale/issue reason; revalidation action.

**Rules:** icon + text + optional color. Never compress multiple verification dimensions into one “Verified” badge. `LOCKED` architecture is not a verified research result.

## 8. Approval state

**Purpose:** make protected human authority visible and reviewable.

**Anatomy:** proposed change; before/after or impact preview; requester; approver role; rationale/evidence; affected objects; approve/reject/revise; immutable decision record.

**Rules:** approval and verification are separate. Destructive/downstream impact is shown before the decision. Unauthorized users see state and owner, not enabled approval controls.

## 9. Analysis result

**Purpose:** present scientific output as a traceable result, not a dashboard KPI.

**Anatomy:** analysis name; result status; key values/table/figure; assumptions/diagnostics; method/parameters; AnalysisRun ID; dataset version; engine/version; timestamp; limitations; interpretation link.

**Rules:** tabular numerals and comparison alignment. Every number resolves to structured output. Interpretation is visually separate from result. Decorative AI statistics and unexplained charts are prohibited.

**Responsive/accessibility:** summary precedes dense table; semantic table retains captions/headers; bounded horizontal scrolling is allowed with sticky identifiers where justified; offer accessible text/table alternative for charts.

## 10. Provenance trail

**Purpose:** answer where an object or value came from and what changed it.

**Default representation:** compact lineage with current object centred and immediate upstream/downstream links.

**Anatomy:** stable IDs, versions, actor/origin, timestamp, transformation/action, evidence/run/source links and stale/invalid state.

**Rules:** progressively disclose long history. Do not replace exact lineage with “AI generated” or generic activity feed.

## 11. Empty state

**Purpose:** explain why no object exists and the safest useful way to create/import one.

**Anatomy:** object-specific explanation; prerequisite/status; one primary action; optional import/example; privacy/AI disclosure where relevant.

**Rules:** no decorative illustration required. Never fabricate sample research inside a real project without clear demo separation.

## 12. Error state

**Purpose:** preserve trust and recoverability when work fails.

**Anatomy:** plain-language failure; affected object/action; whether canonical state changed; preserved draft; correlation/reference; retry/resolve/contact action.

**Rules:** distinguish validation, permission, conflict, provider, network and execution errors. Do not use success-like partial states or expose sensitive internals.

## 13. Loading state

**Purpose:** communicate bounded work without implying completion.

**Anatomy:** named task/object; stage where knowable; expected effect; cancel/background option; canonical-state safety statement for long operations.

**Rules:** restrained skeleton/progress only when meaningful. No fake percentage, AI “thinking” theatre or focus theft.

## 14. Destructive confirmation

**Purpose:** prevent irreversible loss or unintended dependency impact.

**Anatomy:** exact object; consequences; downstream impact; retention/history behaviour; safer alternative; explicit destructive action.

**Rules:** use for delete, replace final/accepted state, revoke sharing or discard irreversible work—not for routine reversible actions. Require typed confirmation only when risk justifies friction.

## 15. Mobile navigation

**Purpose:** preserve research orientation and current task on small screens.

**Anatomy:** project identity; current lifecycle section; back/close semantics; task-local action; accessible section switcher; blocker/approval indicator.

**Rules:** do not shrink desktop sidebar. Keep reading/review context before secondary controls. Prevent page-level horizontal overflow.

## 16. Relationship inspector

**Purpose:** inspect an RDT object’s typed connections without defaulting to a giant graph.

**Anatomy:** selected object; incoming/outgoing relationship groups; rationale; provenance/version; validity/stale status; impact preview; jump-to-object action.

**Rules:** default to structured rows. Offer lineage or filtered graph only when branching/topology matters. Always provide an equivalent list representation.

## 17. Project next-action panel

**Purpose:** recommend the safest useful next step from canonical state and compiler issues.

**Anatomy:** action; rationale; prerequisites; expected state transition; evidence; risk; approval requirement; alternative actions.

**Rules:** advisory and explainable, never gamified. `BLOCKED` explains resolution. Completing the action cannot bypass gates.

## 18. Document intelligence inspector

**Purpose:** connect writing to governed research objects without cloning a generic document editor.

**Anatomy:** current section/version; claims; evidence/citations; analysis results; stale/quality findings; contextual AI proposal; provenance; review/apply action.

**Rules:** writing remains primary; intelligence is contextual. Proposed text uses diff/new-block review and creates a new immutable version when accepted.

## 19. Publication handoff

**Purpose:** move a verified artifact toward a real official destination.

**Anatomy:** destination identity; source/verification; readiness; guideline/policy version; artifact; unmet requirements; official submission URL/channel; user-controlled handoff; tracking status.

**Rules:** explicitly state when handoff leaves MetodePenelitian.com. Never use “Submit” for a link-out unless wording and confirmation make the boundary clear; never imply acceptance or publisher authority.

## Cross-pattern consistency

- One object has one identity and canonical status representation across stages.
- Provenance formatting and terminology remain consistent.
- Primary blue means action/selection or an explicitly valid semantic state, not decoration.
- Proposed, verified and approved states never share an indistinguishable treatment.
- Empty/error/loading states preserve the object and task context.
- All interactive affordances are real controls; previews are labelled and non-interactive.

## Related documents

- [Master UI/UX Design Direction](MASTER%20UI%20UX%20DESIGN%20DIRECTION.md)
- [Design Principles](DESIGN%20PRINCIPLES.md)
- [Research AI Interaction Patterns](RESEARCH%20AI%20INTERACTION%20PATTERNS.md)
- [UI Anti-Patterns](UI%20ANTI%20PATTERNS.md)

