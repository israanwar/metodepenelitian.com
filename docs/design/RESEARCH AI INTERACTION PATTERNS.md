# Research AI Interaction Patterns

**Status:** LOCKED — canonical Research AI interaction contract

**Scope:** Documentation only. Backend authority remains with [Master AI Governance](../MASTER%20AI%20GOVERNANCE.md); this document defines how governed AI work is presented and reviewed.

## Position

Research AI is contextual intelligence embedded in research work. It reads an authorized pinned Project Context, returns evidence-bearing proposals and can only change canonical state through governed commands and required human approval.

The default interaction is not a floating chatbot. Conversation may exist as a secondary surface for exploration, but accepted work returns to the relevant research object and workflow.

## Canonical recommendation anatomy

```text
Research AI suggests                         [PROPOSED]
Recommendation

Why
Evidence
Assumptions
Alternatives
Risks / limitations
Expected project impact

[Dismiss] [Compare alternatives] [Review recommendation]
```

Required provenance may be collapsed when space is constrained, but must remain available: context/RDT version, source links, model/provider, prompt/policy version, timestamp, tool use and confidence with its limits.

## State separation

| Presentation state | Meaning | Allowed action |
|---|---|---|
| `PROPOSED` | AI/user suggestion not accepted as canonical truth | Inspect, compare, edit, dismiss or send to review |
| `APPROVAL REQUIRED` | Protected change is complete enough for authorized review | Preview impact, approve/reject if authorized |
| Canonical verification status | Architecture-owned source/evidence/method/analysis status | Revalidate through owning workflow only |
| `APPROVED` | Authorized decision has been recorded | Show actor, time, version and resulting change |
| `BLOCKED` | Required evidence, permission, dependency or gate is missing | Explain blocker and safe resolution |
| `UNKNOWN` | Information is insufficient | Request evidence/context; never guess |
| `UNAVAILABLE` | Capability/provider is not available | Offer truthful alternative or retry path |

Visual treatment must prevent blue highlight, a model confidence value or confident prose from reading as verification.

## Review recommendation flow

1. **Orient:** identify research object, current canonical status and AI task.
2. **Inspect:** show recommendation and concise rationale.
3. **Interrogate:** expose evidence, assumptions, alternatives, risk and provenance.
4. **Preview impact:** show affected RDT entities and downstream invalidation/review.
5. **Decide:** dismiss, revise, compare or submit governed change.
6. **Approve when protected:** authorized user approves/rejects with recorded rationale.
7. **Confirm:** show new canonical version and compiler result; never imply success before persistence/validation.

## Contextual patterns

### Methodology recommendation

```text
Research AI suggests: Multiple Linear Regression       [PROPOSED]

Why: outcome is continuous and the approved model contains multiple predictors.
Evidence: Variables V1–V4 · Hypotheses H1–H3 · Methodology v7
Assumptions: linearity, independent errors, homoscedasticity, residual diagnostics
Alternatives: robust regression; generalized model if outcome assumptions fail
Risks: current sample-size evidence is incomplete

[Inspect affected objects] [Review recommendation]
```

The UI must not say “the correct method” unless the applicable methodology verification has actually passed.

### Literature/evidence recommendation

Show query/scope, inclusion logic, candidate sources, exact evidence locators, contradiction/limitation, and proposed claim relationship. “Relevant” is not “supports claim.” Saving a paper and verifying evidence are separate actions.

### Analysis recommendation

AI may propose an AnalysisPlan and explain requirements. It does not produce numerical results. The execution panel identifies deterministic engine/capability, dataset version, parameters, approval and future AnalysisRun.

### Interpretation recommendation

AI explanation cites structured result IDs and copies values through typed references. Separate statistical interpretation, substantive interpretation, limitations and unsupported inferences. Any value not resolvable to the run is blocked.

### Writing recommendation

Suggested prose appears as a diff or proposed block, linked to claims/evidence/results. Accepting it creates a new version with AI provenance; it does not silently overwrite a final section.

### Compiler remediation

AI may explain a compiler finding and propose options. It cannot dismiss the finding, turn `UNKNOWN` into `PASS`, or approve a protected mutation.

## Multi-agent presentation

The user should see one coherent Research AI experience, not a theatre of agent avatars. Reveal specialist agent identity only when it helps auditability or explains disagreement.

When agents disagree:

- preserve both proposals;
- compare evidence, assumptions and scope side by side;
- identify the decision owner;
- keep canonical state unchanged until governed resolution.

Do not animate agent “thinking,” fabricate internal reasoning traces or imply sentience.

## Placement rules

- Inline recommendation for a local field/object decision.
- Side inspector for multi-part evidence, impact or review.
- Dedicated review page for protected changes, conflicts or high-risk analysis/methodology decisions.
- Notification only to return the user to the owning object; never complete approval inside a detached toast.
- Conversation as secondary exploration, with an explicit “attach/propose to project” boundary.

## Error, loading and degraded states

- Loading identifies task, cancellability and whether canonical state is unchanged.
- Timeout/provider failure says no change was applied and preserves any safe draft.
- Malformed or ungrounded output is rejected with a retry/review path; it is not partially shown as accepted.
- Stale context blocks apply/approval until the recommendation is regenerated or reviewed against the current version.
- Quota/permission blocks do not disguise themselves as model failure.

## Accessibility

- Recommendation regions have headings and programmatic status labels.
- Expand/collapse controls expose state and keyboard operation.
- Evidence and alternatives follow a meaningful reading order.
- Differences and status are not color-only.
- Model-streaming updates avoid focus theft and use restrained live-region announcements.
- Reduced-motion preference disables nonessential transitions.

## Prohibited AI patterns

- floating chatbot as the primary product shell;
- sparkle/gradient/glow as AI identity;
- one-click apply without evidence/impact review;
- model confidence presented as research verification;
- “AI verified,” “100% accurate,” “humanized” or guaranteed-authorship claims;
- AI-generated data, statistics, DOI, citation or provenance;
- hidden model fallback or provider state;
- agent avatar proliferation;
- auto-approval or silent canonical overwrite.

## Related documents

- [Master UI/UX Design Direction](MASTER%20UI%20UX%20DESIGN%20DIRECTION.md)
- [Product UI Patterns](PRODUCT%20UI%20PATTERNS.md)
- [Master AI Governance](../MASTER%20AI%20GOVERNANCE.md)
- [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md)
- [Project Context Engine](../architecture/03%20PROJECT%20CONTEXT%20ENGINE.md)

