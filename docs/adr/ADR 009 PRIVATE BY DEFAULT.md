# ADR 009 — Private by Default

**Status:** LOCKED

**Decision:** Research projects are private by default. Nothing is discoverable by other users or organizations unless explicitly shared. Authorization is centralized in one kernel, and no provider (AI or integration) ever sees more than the Integration/AI Gateways deliberately expose to it.

**Context:** Architectural Principle #7: *"Research projects are private by default."* Master Backend Architecture Section 21 (area 821 in the document): *"Default posture — research projects are private by default; nothing is discoverable by other users or organizations unless explicitly shared."* [32 Security Privacy](../architecture/32%20SECURITY%20PRIVACY.md) names this the load-bearing statement of the entire security posture: *"research project data is private by default, authorization is centralized in one Kernel, and no provider ever sees more than the Integration/AI Gateways deliberately expose to it."* Master Data Governance Section (Core Contract #9) is scoped explicitly to define what "private by default" means at the data-record level.

**Rationale:** Unpublished research (questions, hypotheses, unpublished data, draft manuscripts) is sensitive by nature — premature disclosure can cause academic harm (scooping, plagiarism exposure, privacy violations for human-subject data). Defaulting to private and requiring explicit, intentional sharing is the only posture consistent with treating a `ResearchProject` as the researcher's own work-in-progress rather than platform-owned content.

**Consequences:**
- Every new entity type introduced in any phase inherits private-by-default visibility from its owning `ResearchProject`; no feature may default a research record to discoverable.
- Sharing/visibility flags are explicit, auditable state changes, not incidental side effects of another action.
- External providers (AI or integration) receive only what the Gateways deliberately expose — direct provider access to raw project data is a security defect, not a shortcut.

**Constraints:** This ADR fixes the default visibility posture, not the full sharing/collaboration feature set — collaboration UI, org-level visibility, and institution oversight depth remain governed by their own P1/P2 scope.

**Source of Truth:** [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 3 (Principle #7), Section 21. [Master Data Governance](../MASTER%20DATA%20GOVERNANCE.md). [32 Security Privacy](../architecture/32%20SECURITY%20PRIVACY.md).

**Supersedes:** None.

**Superseded By:** None.
