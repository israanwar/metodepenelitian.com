# Submission Orchestration

## Purpose
Submission Orchestration is what happens after a researcher picks a destination: assembling the destination-specific submission package and tracking that submission's lifecycle from "prepared" through to "official destination has it." It exists so that the handoff Publication Gateway performs is followed by a coherent tracked process, rather than the researcher being dropped at an external link with no record of what happened next.

## Scope
Covers `PublicationSubmission` package preparation (formatting a manuscript and its supporting files to a chosen destination's requirements) and submission status tracking after handoff. Does not decide which destination to route to (Publication Gateway), does not score fit or readiness (Journal Matching Engine / Publication Intelligence), and never itself performs editorial review, acceptance, or publication of any kind.

## Responsibilities
- Assemble a `PublicationSubmission` package: formatted manuscript, cover letter, author guideline compliance checklist, required supplementary files, per the chosen destination's stated requirements.
- Kick off an API-backed submission through the [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md) where `api_available` is true for the destination (e.g. an OJS instance with a real API).
- Record and update `PublicationStatus` for guided-handoff destinations based on researcher-reported status updates, since the platform has no visibility into a destination's internal workflow without an API.
- Surface submission status back into the project timeline so the researcher has one place to see where each submission attempt stands.
- Queue package preparation as an async [Background Job](./29%20BACKGROUND%20JOBS.md) when formatting/conversion work is non-trivial (e.g. converting to a required template).

## Non-Responsibilities
- Does not select or rank destinations — that is Publication Gateway and Journal Matching Engine.
- Does not perform any editorial function — no review, no acceptance/rejection decision, no typesetting for actual publication (only for submission-package formatting).
- Does not guarantee real-time status sync with a destination unless that destination exposes a real status API through the Integration Gateway; guided-handoff destinations rely on researcher self-reporting.
- Does not call any submission platform (OJS, ScholarOne, Editorial Manager, a publisher portal) directly — every such call passes through the Integration Gateway.

## Core Components
- **Package Assembler** — builds the destination-specific submission package from the project's academic document and the destination's stated requirements.
- **Submission Dispatcher** — for API-backed destinations, initiates the actual submission call through the Integration Gateway; for guided-handoff destinations, prepares the package for manual upload/email and surfaces the destination's own submission URL.
- **Status Tracker** — maintains `PublicationStatus` (e.g. prepared, submitted, under-review-reported, revision-requested-reported, accepted-reported, rejected-reported, withdrawn), updated either by API callback or researcher self-report.
- **Submission Timeline** — the project-visible history of every submission attempt across destinations.

## Owned Data
| Entity | Notes |
|---|---|
| PublicationSubmission | one record per prepared/attempted submission to a specific destination |
| PublicationStatus | current lifecycle state of a submission, with source (api-reported vs. self-reported) |
| SubmissionPackageAsset | the formatted files that make up a submission package, stored via object storage |

## Inputs
- The selected destination and handoff mode from [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md).
- The academic document and its current version from Research Core's writing/citation module.
- Destination-specific requirements (templates, required sections, file formats) from the Publication Destination Registry.
- Researcher-entered status updates for guided-handoff destinations.
- API status callbacks/polling results for API-backed destinations, via the Integration Gateway.

## Outputs
- A formatted `PublicationSubmission` package ready for dispatch or manual handoff.
- Updated `PublicationStatus` records reflected in the project's submission timeline.
- Submission-lifecycle events (`submission.prepared`, `submission.dispatched`, `submission.status_changed`) consumed by notification and by the Project Context Engine for project-state awareness.

## Dependencies
- [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md) for the selected destination and handoff mode.
- [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md) for any API-backed dispatch or status sync.
- [Background Jobs](./29%20BACKGROUND%20JOBS.md) for package formatting/conversion work.
- [Event Bus & Workflows](./30%20EVENT%20BUS%20WORKFLOWS.md) for propagating submission-lifecycle events to other modules.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 16.

## Extension Points
- New destination-specific package templates are added as configuration against the destination registry, not as new Package Assembler code paths.
- A future direct-status-API integration for a given destination upgrades that destination's Status Tracker source from self-reported to API-reported without changing the researcher-facing status model.
- Multi-destination simultaneous submission tracking (where policy allows) can extend the Submission Timeline without changing the single-submission Package Assembler logic.

## Security & Privacy
- Submission packages contain full manuscript content; they are private by default (Core Contract #9) and only shared externally at the moment of actual dispatch/handoff the researcher explicitly initiates.
- Self-reported status updates are clearly labeled as researcher-reported, never presented with the same confidence as an API-confirmed status, to avoid misleading the researcher about the platform's actual visibility into a destination's process.
- Submission package assets in object storage are accessed exclusively via signed URLs, consistent with platform-wide storage security posture.

## Failure Modes
- **Package formatting failure** (e.g. malformed template conversion): the async job fails safely, status remains "preparation failed" with a specific error, never silently marked as submitted.
- **API-backed dispatch failure**: falls back to presenting the guided-handoff path (destination's own submission URL) so the researcher is never blocked, per Core Contract #11's degraded-but-functional principle.
- **Status desync** (destination's real status diverges from platform-recorded status for a guided-handoff destination): mitigated by clearly timestamping self-reported status and prompting researchers periodically to confirm/update it.

## Observability
- Package preparation success/failure rate, and average preparation job duration.
- API-backed dispatch success rate per destination/provider.
- Distribution of submissions by current `PublicationStatus`.
- Time-to-first-status-update after handoff (signal for researcher engagement with tracking).

## P0/P1/P2/P3
**P2.** Submission Orchestration is an advanced capability that depends on Publication Gateway and Publication Intelligence already functioning; formatted package assembly and tracked status add real value but are not required for the platform to deliver a usable (if more manual) publication-routing experience. API-backed dispatch for any specific destination is additionally gated by that destination actually offering a real API (**P2/P3** depending on the provider).

## Current Status
Documented, not implemented. No Package Assembler, Submission Dispatcher, or `PublicationSubmission` schema exists in code; this document defines the intended orchestration boundary ahead of implementation.

## Open Questions
- Whether guided-handoff submissions get any tracking at all in the first release, or whether tracking is deferred entirely to API-backed destinations initially.
- What triggers a prompt for the researcher to update self-reported status (time-based reminder vs. purely on-demand).
- How multi-destination submission is handled where a project is legitimately submitted to several destinations over time (e.g. after a rejection) — one timeline per project or per destination.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER PRODUCT ARCHITECTURE.md](../MASTER%20PRODUCT%20ARCHITECTURE.md)
- [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md)
- [Publication Intelligence](./22%20PUBLICATION%20INTELLIGENCE.md)
- [Journal Matching Engine](./23%20JOURNAL%20MATCHING%20ENGINE.md)
- [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md)
- [Background Jobs](./29%20BACKGROUND%20JOBS.md)
- [Event Bus & Workflows](./30%20EVENT%20BUS%20WORKFLOWS.md)
