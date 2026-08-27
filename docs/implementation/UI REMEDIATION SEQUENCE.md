# UI Remediation Sequence

**Status:** `LOCK_CANDIDATE / IMPLEMENTATION_NOT_STARTED`

**Source:** [UI Remediation Audit](../design/UI%20REMEDIATION%20AUDIT.md)

**Rule:** P0 first → P1 second → P2 deferred. No redesign, feature expansion, backend change, or architecture change is authorized by this sequence.

## 1. Execution invariant

Every issue is an isolated micro-phase:

`one issue → implement → test → report → review → lock → next issue`

Do not batch unrelated issues. Do not start the next issue until the current issue is reviewed and marked `LOCKED`. Preserve unrelated dirty-worktree and concurrent-agent changes. A source-level PASS does not replace browser, keyboard, screen-reader, contrast, or responsive verification where required.

For every micro-phase:

1. Re-read the issue's **Minimal Fix**, **Do Not Change**, and **Verification Needed**.
2. Record pre-change route/component scope and existing unrelated changes.
3. Implement only the minimal correction.
4. Run targeted static/unit checks and `git diff --check`.
5. Run the issue-specific browser/accessibility checks when a browser is available; otherwise report `RUNTIME_UNAVAILABLE`, never PASS.
6. Report changed files, evidence, unresolved risk, and source-code diff.
7. Request review; lock only after evidence satisfies the issue.
8. Continue to the next ID.

## 2. P0 sequence

| Order | Issue | Gate to lock |
|---:|---|---|
| 1 | **UI-001 — Capability truth** | Search and all high-prominence CTAs disclose real availability before activation; no inert enabled action |
| 2 | **UI-002 — Preview affordance truth** | Every static homepage product surface is explicitly illustrative and inert elements no longer imitate controls |
| 3 | **UI-003 — Evidence truth** | No example paper, finding, count, relevance, citation, or saved state can be mistaken for source-backed canonical evidence |
| 4 | **UI-004 — Statistical provenance truth** | No preview number or interpretation can be mistaken for an AnalysisRun-derived result |
| 5 | **UI-005 — Research AI proposal boundary** | AI recommendations show `PROPOSED`, required review anatomy, provenance boundary, and canonical-state safety |
| 6 | **UI-006 — Status separation** | Workflow progress, verification, approval, availability, and execution states are scoped and distinguishable beyond color |
| 7 | **UI-007 — Programmatic form labels** | Every audited form/search control has a correct accessible name and associated help/error text |
| 8 | **UI-008 — Result/error announcements** | Calculation, validation, and copy outcomes are perceivable by assistive technology without duplicate/noisy announcements |
| 9 | **UI-009 — Cronbach input integrity** | Sample is explicitly demo/user-selected and malformed cells are rejected without silent deletion |

### P0 stop gate

Do not begin P1 until all nine P0 issues are `LOCKED`, source checks pass, required runtime checks are either PASS or explicitly blocked for review, and no architecture vocabulary was invented in the frontend.

## 3. P1 sequence

| Order | Issue | Gate to lock |
|---:|---|---|
| 10 | **UI-010 — Inspectable lifecycle continuity** | The same-project handoff exposes compact identity/version/relationship context without a giant graph |
| 11 | **UI-011 — Homepage hierarchy** | Rendered review confirms lifecycle continuity without a repeated slide-deck rhythm; no homepage redesign |
| 12 | **UI-012 — Semantic token mapping** | One documented implementation mapping exists and only touched components migrate without bulk churn |
| 13 | **UI-013 — Metadata readability/contrast** | Trust-critical metadata passes contrast, zoom, and reflow checks while preserving density |
| 14 | **UI-014 — Focus consistency** | Full keyboard walkthrough has a clearly visible focus state on every interactive element |
| 15 | **UI-015 — Navigation disclosure accessibility** | Trigger/panel relationships, Escape focus restoration, announcements, and tab order pass |
| 16 | **UI-016 — Responsive tool layouts** | 320–1280px plus 200% zoom has no page-level horizontal scroll or clipped primary actions/trust labels |
| 17 | **UI-017 — Research Tool decision context** | Assumptions, limits, validation, and result scope pass methodologist and boundary-value review |
| 18 | **UI-018 — ComingSoon route hygiene** | Unavailable destinations are contextual and truthful without implementing missing products |
| 19 | **UI-019 — Global IA availability hygiene** | Current lifecycle destinations lead; future inventory is grouped and unmistakably unavailable |
| 20 | **UI-020 — Secondary surface consistency** | Relevant content uses rows/dividers or bounded cards appropriately; no bulk redesign |

### P1 stop gate

P1 locks only when high-impact usability and consistency issues are resolved without changing architecture, feature scope, or protected stable areas. Keep all P2 work deferred.

## 4. P2 deferred backlog

These items are recorded but not authorized while any P0/P1 item remains open:

1. **UI-021 — Surface radius/shadow token consolidation**
2. **UI-022 — Reduced-motion completion**
3. **UI-023 — Localization and confirmation microcopy**
4. **UI-024 — Secondary selected/current semantics**

## 5. Mandatory per-issue report

Use this exact minimum report after each micro-phase:

```text
ISSUE:
STATUS: IMPLEMENTED | TESTED | PASS | BLOCKED | RUNTIME_UNAVAILABLE
FILES CHANGED:
MINIMAL FIX:
DO NOT CHANGE PRESERVED:
TARGETED TEST:
BROWSER/KEYBOARD/A11Y VERIFICATION:
ARCHITECTURE VOCABULARY CHECK:
BROKEN LINKS:
SOURCE CODE DIFF:
DEPENDENCIES CHANGED:
GIT DIFF CHECK:
REVIEW DECISION: OPEN | LOCKED
```

## 6. Sequence completion gate

The remediation sequence is complete only when:

- P0 and P1 issue counts are zero in `OPEN` state;
- each issue has an individual evidence-backed report and review lock;
- design source-of-truth and architecture remain unchanged;
- protected stable areas remain intact;
- internal documentation links report zero broken links;
- dependency changes are explicitly absent unless separately authorized;
- final source diff contains only approved remediation files;
- browser-dependent checks are not represented as PASS when unavailable.
