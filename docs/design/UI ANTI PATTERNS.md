# UI Anti-Patterns

**Status:** LOCKED — explicit UI/UX blacklist

**Scope:** Documentation only. “No” means do not introduce the pattern without an approved amendment demonstrating a research-task and accessibility necessity.

## Visual blacklist

| NO | Why it fails | Use instead |
|---|---|---|
| NO excessive rounded cards | Fragments related research into decorative containers and reduces density. | Sections, rows, dividers, tables and bounded panels. |
| NO card grid for every section | Makes lifecycle stages look like unrelated features. | Continuous project/workflow composition. |
| NO purple/blue AI gradients | Signals generic AI SaaS and consumes semantic color. | Neutral surface with explicit AI label/status. |
| NO decorative AI sparkle, glow or neon | Substitutes magic for evidence and rigor. | Recommendation anatomy and provenance. |
| NO glassmorphism | Reduces clarity/contrast and resembles generic templates. | Opaque warm surfaces and thin borders. |
| NO decorative blobs/stock researcher photos | Adds no research meaning and weakens product authenticity. | Real product-state proof or disciplined whitespace. |
| NO excessive shadow | Creates false elevation and visual noise. | Border/contrast first; minimal shadow for true overlay/elevation. |
| NO excessive pills/icons | Compresses complex states into ambiguous decoration. | Textual status, structured metadata and icon only where clarifying. |
| NO PowerPoint-style sections | Turns the homepage into disconnected slides. | One project progressing through lifecycle proof. |
| NO giant empty hero | Hides product substance and wastes decision space. | Concise position plus credible workspace evidence. |

## Product-structure blacklist

| NO | Why it fails | Use instead |
|---|---|---|
| NO floating chatbot as primary UX | Makes AI the product and disconnects it from canonical research state. | Contextual recommendation/inspector attached to the object. |
| NO generic dashboard metrics | Counts do not necessarily guide research decisions. | Compiler issues, approvals, stale dependencies and next safe action. |
| NO utility-led information architecture | Converter/plagiarism/citation tools fragment the Research OS. | Lifecycle-first navigation; contextual secondary utilities. |
| NO Notion/Google Docs clone | Generic blocks/editor obscure evidence/result relationships. | Research-aware section, claim, evidence, citation and result inspector. |
| NO giant node graph by default | Overwhelms users and obscures exact relationships. | Lineage, dependency rows and relationship inspector; filtered graph on demand. |
| NO Research Academy expansion in core workspace | Blurs learning and project execution. | Contextual help linked to separate Academy architecture when approved. |
| NO Plagiarism bounded context | Overstates one future tool and distorts architecture. | Secondary feature behind integrity/privacy/reliability gates. |
| NO publisher-like submission UI | Misrepresents MetodePenelitian.com’s authority. | Official destination, readiness and explicit handoff boundary. |

## Trust and data blacklist

| NO | Why it fails | Use instead |
|---|---|---|
| NO fake functionality | Creates false product availability. | Working control or clearly labelled static preview. |
| NO fake statistics/charts | Violates analysis provenance and scientific trust. | Values from a verified AnalysisRun or explicit illustrative data label. |
| NO fake evidence/citations/DOI | Can corrupt academic work and product credibility. | Canonical source with provenance or `NOT VERIFIED/UNKNOWN`. |
| NO “100% Accurate/Original/Guaranteed” | Makes unprovable scientific/authorship claims. | Evidence, limitations, verification method and human authority. |
| NO AI recommendation styled as fact | Model confidence is not research verification. | `PROPOSED` treatment with review anatomy. |
| NO green check for every success | Collapses execution, approval and verification. | Exact canonical status and scope. |
| NO hidden stale/version state | Lets outdated outputs look current. | Version/timestamp and visible stale/impact state. |
| NO provider logos as integration proof | Implies connectivity without capability evidence. | Verified provider/capability status and degraded state. |
| NO silent auto-correction | Removes human authority and history. | Proposed change, impact preview and governed approval. |

## Interaction and responsive blacklist

| NO | Why it fails | Use instead |
|---|---|---|
| NO excessive animation | Distracts from dense reading and may harm accessibility. | State/navigation/loading micro-interactions with reduced-motion support. |
| NO AI “thinking” theatre | Fabricates process and delays clarity. | Honest bounded loading/progress state. |
| NO hover-only information/actions | Excludes keyboard, touch and assistive technology. | Persistent or focus/click accessible controls. |
| NO color-only status | Excludes users and creates ambiguity. | Text + icon/shape + color. |
| NO desktop squeezed onto mobile | Produces overflow and unusable dense controls. | Task-prioritized responsive composition. |
| NO page-level horizontal overflow | Breaks reading and navigation. | Reflow; bounded semantic table/tab scrolling only. |
| NO focus removal or hidden focus | Makes keyboard use unreliable. | Consistent visible focus. |
| NO meaningless skeleton/percentage | Implies progress the system does not know. | Named stage, indeterminate state or background job status. |
| NO destructive action beside primary action | Raises accidental-loss risk. | Separate overflow/danger zone and impact confirmation. |

## Consistency blacklist

- No different status vocabulary for each research stage.
- No different blue meaning between workspace, AI, analysis and publication.
- No separate card/component language for each module.
- No duplicate representation of the same canonical object.
- No mixing illustrative homepage state with authenticated/live state without a clear boundary.
- No stage-specific UI that loses project title, state, provenance or next action.

## Existing source findings to resolve in a future implementation task

These are `SOURCE_AUDITED / VISUAL_NOT_VERIFIED`, not implementation instructions for the current task:

1. [Hero](../../src/components/home/Hero.tsx) and [Discover Evidence](../../src/components/home/DiscoverEvidence.tsx) contain static span-like actions with hover/cursor treatment; future implementation must make them working controls or clearly non-interactive preview content.
2. Discover Evidence shows example papers/metadata and [Methodology Analysis](../../src/components/home/MethodologyAnalysis.tsx) shows numerical results without a visible illustrative/provenance label in source.
3. Research AI previews lack the full recommendation review anatomy and clear `PROPOSED` state.
4. Analysis flow’s `Complete/Ready/Next/Pending` labels need a documented separation from research verification/approval statuses.
5. Small metadata typography and homepage CTA focus behaviour require rendered, keyboard and contrast verification.
6. Responsive tab strips are semantically bounded, but overflow, focus and zoom/reflow were not browser-verified.

The task explicitly forbids changing the homepage, so these findings remain review inputs only.

## Review enforcement

A design review fails when any blacklist item appears without a documented, architecture-compatible exception. “Competitor parity,” “looks premium,” “AI aesthetic,” or “the framework makes it easy” are not valid exceptions.

## Related documents

- [Master UI/UX Design Direction](MASTER%20UI%20UX%20DESIGN%20DIRECTION.md)
- [Design Principles](DESIGN%20PRINCIPLES.md)
- [Product UI Patterns](PRODUCT%20UI%20PATTERNS.md)
- [Research AI Interaction Patterns](RESEARCH%20AI%20INTERACTION%20PATTERNS.md)
