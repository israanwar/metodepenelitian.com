# MASTER DATA GOVERNANCE

## Purpose
This document is the single source of truth for who owns each piece of data inside MetodePenelitian.com's Research OS, how canonical data is kept separate from provider-specific data, how long data is kept, and what happens to a user's data when they ask to export or delete it. It exists so that every domain module (Research Core, AI Gateway, Integration Gateway, Publication Gateway, and all internal engines) makes the same decisions about data ownership and lifecycle instead of each inventing its own rules.

## Scope
Covers: entity ownership mapping across the domain model defined in [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) Section 24; the canonical-vs-provider-specific data boundary (Core Contracts #6 and #12); data classification and retention policy per storage system (Section 21); data export and erasure mechanics (Section 25); and how this document relates to the per-entity documents that will live under `database/`. Does not cover SQL schema, column types, indexes, or migration scripts — those are a follow-on design task for the `database/` documents, not this one.

## Responsibilities
- Declare, for every entity family in Section 24's domain model, which domain module is the system-of-record owner and which modules may only read.
- Define the canonical model boundary: `ResearchReference` and other canonical entities are the only form scholarly/external data takes once inside Research Core; raw provider payloads never substitute for it.
- Define data classification tiers (private research data, platform operational data, provider credentials, audit/governance data) and the retention rule for each.
- Define the mechanics and scope of user data export (portability) and account/project erasure, and which owned entities are included or excluded.
- Define what "private by default" (Core Contract #9) means at the data-record level: default visibility, sharing model, and where visibility flags live.
- Set expectations that every future `database/` document must declare an owning module and a retention tier consistent with this document.

## Non-Responsibilities
- Does not define SQL DDL, table names, column names, or index strategy — deferred to `database/` documents.
- Does not define per-provider API contracts or credential formats — that is [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md) and the Integration Gateway's own documents.
- Does not define AI model routing, prompt structure, or provider selection — that is [MASTER AI GOVERNANCE.md](MASTER%20AI%20GOVERNANCE.md) and the AI Gateway documents.
- Does not define billing/entitlement rules beyond noting that `UsageRecord`/`Invoice` are owned data with their own retention tier — depth lives in the Billing & Entitlements module.
- Does not grant itself authority to override the Section 24 entity list — this document maps ownership onto that list, it does not redefine the list.

## Core Components

**Ownership Map** — every entity family from Section 24 assigned to exactly one owning module:

| Entity family | Entities | Owning module |
|---|---|---|
| Platform Core | `User`, `UserProfile`, `Role`, `Permission`, `Organization`, `OrganizationMember` | Identity & Access (platform core) |
| Research Core | `ResearchProject`, `ProjectContext`, `ResearchStage`, `ResearchQuestion`, `ResearchObjective`, `Hypothesis`, `Variable`, `Construct`, `Indicator`, `Methodology`, `Population`, `Sample`, `Instrument` | Research Core / Project Context Engine |
| Literature & Evidence | `ResearchReference`, `Author`, `Journal`, `PaperCollection`, `PaperNote`, `PaperAttachment` | Literature & Evidence |
| Dataset & Analysis | `Dataset`, `DatasetVersion`, `DatasetVariable`, `DatasetProfile`, `DatasetVariableMapping`, `DataTransformation`, `TransformationRun`, `DatasetLineageLink`, `Analysis`, `AnalysisCapability`, `AnalysisRecommendation`, `AnalysisExecutionPlan`, `AnalysisRun`, `AnalysisResult`, `AnalysisResultSet`, `StructuredResult`, `QualitativeFinding`, `MixedMethodsFinding`, `ResultValidation`, `Interpretation`, `ResultProvenanceLink` | Dataset & Analysis |
| Writing & Citation | `AcademicDocument`, `DocumentBlueprint`, `FormattingPolicyPack`, `FormattingPolicyVersion`, `FormattingRule`, `RuleSourceEvidence`, `PolicyAsset`, `PolicyVerification`, `PolicyExceptionDecision`, `ResolvedFormattingProfile`, `PolicyConflict`, `GuidelineImportRun`, `CandidateFormattingRule`, `RuleReviewDecision`, `DocumentComplianceRun`, `ComplianceFinding`, `RenderProfile`, `DocumentRenderRun`, `SectionDefinition`, `DocumentCompositionPlan`, `DocumentSection`, `DocumentSectionVersion`, `DocumentVersion`, `DocumentQualityRun`, `DocumentExportRun`, `Citation`, `Bibliography` | Writing & Citation |
| AI | `AIProvider`, `AIModel`, `AIModelCapability`, `AIRequest`, `AIResponse`, `AIUsage`, `AIRoutingPolicy`, `AIConversation`, `AIMessage` | Multi-Model AI Gateway |
| Integrations | `IntegrationProvider`, `IntegrationConnection`, `IntegrationCredential`, `IntegrationSync`, `IntegrationHealth` | Integration Gateway |
| Publication | `PublicationDestination`, `PublicationIndexing`, `PublicationRequirement`, `PublicationMatch`, `PublicationSubmission`, `PublicationStatus`, `PublicationRecord` | Publication Gateway |
| Files | `FileAsset`, `FileAssetVersion`, `FileClassification`, `FileSecurityValidation`, `FileProvenanceLink`, `FileRetentionRecord`, `ConversionJob`, `ConversionCapability`, `ConversionRouteDecision`, `ConversionAttempt`, `ConversionFidelityReport`, `ConversionLicenseReview` | Research File Tools |
| Platform utility | `Notification`, `Subscription`, `Plan`, `Entitlement`, `UsageRecord`, `Invoice` | Billing & Entitlements / Platform utility |
| Governance | `AuditLog`, `FeatureFlag` | Admin Architecture / Governance |

**Canonical vs Provider-Specific Boundary** — `ResearchReference` is the only representation of a scholarly work that Research Core, internal engines, and the AI Gateway are permitted to read. Whatever a scholarly metadata provider (Crossref, OpenAlex, DOAJ, ORCID, SINTA, GARUDA, Scopus/Elsevier) returns is normalized into `ResearchReference` at the Integration Gateway boundary; the raw provider payload is retained only as provenance metadata attached to the canonical record (source provider, source ID, fetched-at timestamp, raw payload snapshot), never consumed directly by any downstream module. The same rule applies to `IntegrationSync` payloads generally: raw third-party shapes stay behind the Integration Gateway/adapter layer per Core Contract #12 and are never handed to Research Core, an internal engine, or the frontend.

**Provenance Model** — every canonical record that originated externally carries: owning provider, provider-native identifier (DOI, ORCID iD, SINTA ID, etc.), ingestion timestamp, and a confidence/verification flag (e.g. "unverified metadata" vs "DOI-resolved"). Provenance is metadata on the canonical record, not a substitute for it.

**Dataset/Result Provenance Lock** — original dataset/transcript bytes, raw `DatasetVersion`, and `AnalysisRun` are immutable. Preparation creates derived versions with operation/parameters/input/output/actor/reason/affected-variable lineage. Every written value/table/figure links machine-readably through `StructuredResult → AnalysisRun → DatasetVersion → RAW`; qualitative findings link through theme/code/quotation coordinates to immutable sources. AI output is never a numerical source.

**Sensitive Processing Boundary** — datasets and qualitative sources are private-by-default, tenant/project isolated, encrypted, transferred with signed authorization, malware-validated, processed in isolated temporary storage, audited, retained/deleted by policy, and classified for PII/consent purpose. Row-level/raw content is not placed in Project Context or sent automatically to an external AI provider. Any exceptional provider disclosure requires minimization, policy eligibility, provider disclosure, and explicit authorization.

**Research File Processing Lock** — original FileAsset bytes/checksum are immutable; conversions/extractions create derived assets with input/output/job/engine/version provenance. MIME/signature and extension mismatch, size, malware/password/embedded-content checks precede routing. Files/output are private-by-default with no public URLs; signed access, isolated processing, temporary retention and automatic cleanup apply. Local-browser processing is preferred when verified feasible. Academic files are never automatically sent to external AI or conversion providers, and normalized outputs enter canonical domains only through preview, authorization, and owning-domain validation.

**Formatting Policy Lock** — canonical research content is independent from institutional/journal presentation. Policy packs/rules are immutable, versioned, source-coordinate grounded, authority/verification/access statused and resolved deterministically. Applying a policy creates a derived document/output; it cannot change facts, results, citations, table/figure values, approvals or provenance. SINTA rank remains Publication Gateway metadata, not a template. Private/user-provided guideline assets follow tenant/project retention and cannot be redistributed without rights; stale/conflicting/unsupported rules cannot support a verified compliance claim.

**Data Classification Tiers**

| Tier | Examples | Default retention |
|---|---|---|
| Private research data | `ResearchProject`, `ProjectContext`, `Dataset`, `AnalysisResult`, `AcademicDocument`, `AIConversation` | Retained until user deletes project or account; included in export |
| Sensitive raw/derived research data | Raw/derived `DatasetVersion`, transcript/source versions, transformation artifacts, AnalysisRun raw output | Retained only within project/consent and configured research retention; deletion cascades to processing copies while audit evidence is minimized/de-identified as policy permits |
| Uploaded/derived research files | Original/derived `FileAsset`, extracted assets, conversion outputs | Project/private retention when saved; temporary/intermediate files expire and are automatically cleaned; included in export only if retained and authorized |
| Formatting policy evidence/assets | Public verified rule metadata, official source references, private/user-provided guideline/template assets | Verified public rules retained with source/version history; private assets follow tenant/project retention and source rights; temporary parsing/rendering copies expire automatically |
| Scholarly/canonical reference data | `ResearchReference`, `Author`, `Journal` | Retained indefinitely as shared platform knowledge once de-linked from a private project; project-linked copies follow the project's retention |
| Credentials & secrets | `IntegrationCredential`, platform/BYOK AI keys | Encrypted at rest, rotated per provider policy, purged immediately on disconnect — never exported in plaintext |
| Operational/billing data | `UsageRecord`, `Invoice`, `AIUsage` | Retained per tax/accounting requirement (minimum period UNKNOWN / REQUIRES VERIFICATION with legal counsel), excluded from project-level erasure |
| Governance/audit data | `AuditLog` | Retained for a fixed compliance window (period UNKNOWN / REQUIRES VERIFICATION), never user-erasable, excluded from user-facing export |

## Owned Data
This document owns no application entities itself. It owns the **governance artifacts**: the ownership map above, the data classification table, the retention policy, and the export/erasure procedure definitions. The canonical entity records themselves remain owned by their respective modules as mapped in Core Components.

## Inputs
- The entity list and module boundaries defined in [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) Sections 21, 24, 25, 26.
- Security baseline controls from Section 25 (encryption, retention, export, erasure, audit logging) that this document expands into concrete per-entity policy.
- Provider terms-of-service constraints on redistribution/caching of scholarly metadata (per-provider limits tracked in [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md)), which bound how long provider-sourced canonical data may be cached.
- User-initiated requests: export request, account deletion request, project deletion request.

## Outputs
- The authoritative ownership map consumed by every `database/` document when it declares its owning module.
- The retention tier assignment consumed by Storage Architecture and Background Jobs (a scheduled purge job reads this document's tiers to know what to delete and when).
- The export bundle definition consumed by whatever module implements the actual export job (a background job per Core Contract #8 — never generated inline on a request).
- The erasure scope definition consumed by the account/project deletion flow.

## Dependencies
- [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) — Sections 21 (Storage Architecture), 24 (Database Domain Model), 25 (Security Architecture), 26 (Academic Integrity & AI Safety) are the direct grounding for this document; it does not restate their content, only maps ownership and retention onto it.
- [MASTER PRODUCT ARCHITECTURE.md](MASTER%20PRODUCT%20ARCHITECTURE.md) — for the product-level meaning of "project," "organization," and sharing that this document's default-privacy rule must match.
- [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md) — for per-provider terms-of-service constraints on caching/redistributing scholarly metadata that bound canonical-record retention.
- [MASTER AI GOVERNANCE.md](MASTER%20AI%20GOVERNANCE.md) — for how `AIConversation`/`AIMessage`/`AIRequest` records are classified and how provider data-retention policies (Core Contract's academic-integrity controls) interact with this document's retention tiers.
- Background Jobs (Section 22 of the backend architecture) — the actual export/erasure/purge execution mechanism; this document defines policy, not the job implementation.

## Extension Points
- New entity families introduced by future modules must be added to the Ownership Map with an explicit owning module before they may be written to any store.
- New external providers add new provenance fields to canonical records (via the Integration Gateway adapter), never new bypass paths that let raw provider data reach Research Core directly.
- Retention tiers may be extended per-jurisdiction (e.g. an institution-specific retention override for `Institution` plan tenants) but any override must be expressed as a stricter or equal retention period, never looser than this document's default.
- Export format/scope may be extended per plan tier (e.g. richer export for Institution plans) without changing the underlying ownership map.

## Security & Privacy
- Default visibility for all Research Core entities is private to the owning user/organization (Core Contract #9); no record is discoverable by other users or organizations absent an explicit share action, and the share action itself must be logged to `AuditLog`.
- `IntegrationCredential` values are never included in export bundles and are never logged, per the Security Architecture baseline (Section 25).
- Canonical `ResearchReference` records that are shared platform knowledge (not project-private) carry no user-identifying data; only project-linked associations (`PaperCollection`, `PaperNote`) are private.
- AI provider data-sharing/training policies (Academic Integrity & AI Safety, Section 26) govern what may be sent to a provider in the first place; this document governs what is retained afterward — the two are complementary, not duplicative.
- Erasure requests must cascade correctly across owning modules: deleting a `ResearchProject` must also remove or de-identify project-scoped `AIConversation`, `Dataset`, `AnalysisResult`, and `AcademicDocument` records, while leaving billing/audit tier records intact per their own retention rule.
- Tenant isolation (organization/institution boundary) applies to every entity in the ownership map that carries an `OrganizationMember` association; this document does not redefine tenant isolation, it inherits Section 25's baseline.

## Failure Modes
- **Ambiguous ownership**: a new entity is added to a `database/` document without an entry in this document's ownership map, causing two modules to believe they are the system-of-record. Mitigated by requiring every `database/` document to link back here and declare ownership explicitly.
- **Canonical/raw leakage**: an adapter under the Integration Gateway passes a raw provider payload through to Research Core instead of a normalized `ResearchReference`, silently violating Core Contract #6. Mitigated by treating any non-canonical scholarly data structure appearing outside the Integration Gateway as an architecture violation, not a valid code path.
- **Incomplete erasure**: an account deletion removes `User`/`ResearchProject` rows but misses a project-scoped `AIConversation` or cached `FileAsset`, leaving orphaned private data. Mitigated by the erasure procedure enumerating every owning module's project-scoped tables rather than relying on cascade delete alone.
- **Over-retention of provider payloads**: a provider's terms of service require deletion of cached metadata after a fixed window, but the platform's default retention tier keeps it indefinitely. Mitigated by provider-specific retention overrides tracked in the Integration Map and enforced stricter than this document's default where required.
- **Export omitting AI history**: a user requests export expecting their full research trail, but `AIConversation`/`AIMessage` records are left out because they are misclassified as operational rather than private research data. Mitigated by this document's explicit classification of `AIConversation`/`AIMessage` as private research data, not operational data.

## Observability
- Ownership-map drift check: a periodic audit comparing the entity list actually present in the database against this document's ownership map, flagging any table with no declared owner.
- Export job success/failure rate and time-to-completion, tracked as part of the platform's general job-queue observability (Section 22/29).
- Erasure job completion audit: confirmation, per erasure request, that every owning module reported completion, logged to `AuditLog`.
- Retention purge job run history: what was purged, from which tier, on what schedule.
- Alerting when a canonical-data write path is bypassed (a raw provider shape detected in a Research Core table) — detection mechanism UNKNOWN / REQUIRES VERIFICATION at this architecture-only stage.

## P0/P1/P2/P3
**P0.** Data ownership, canonical/provider-specific boundaries, immutable raw dataset/transcript and AnalysisRun lineage, result-to-document provenance, default-private visibility, sensitive processing controls, and basic export/erasure are foundational. Without them the Research OS cannot safely or reproducibly carry raw data into academic claims. Method/format breadth is phased, but these governance contracts are not optional.

## Current Status
Documented, not implemented. No database schema, export job, or erasure job exists yet. This document defines the policy that the future `database/` documents and the Background Jobs implementation must conform to.

## Open Questions
- Exact minimum retention periods for `UsageRecord`/`Invoice` (tax/accounting) and `AuditLog` (compliance) — UNKNOWN / REQUIRES VERIFICATION with Indonesian legal/accounting requirements.
- Whether Indonesia's Personal Data Protection Law (UU PDP) imposes a specific erasure SLA (e.g. 30-day maximum) — UNKNOWN / REQUIRES VERIFICATION.
- Whether de-identified, project-linked `ResearchReference` associations should be retained after project deletion for platform-wide citation-graph value, or deleted entirely with the project — needs a product decision.
- Export format (machine-readable bundle vs. human-readable document set, or both) — not yet decided.
- Whether institution/Enterprise plan tenants require a stricter or admin-configurable retention override, and how that interacts with individual user erasure rights within an institutional account.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) — Sections 21, 24, 25, 26 are this document's direct grounding.
- [MASTER PRODUCT ARCHITECTURE.md](MASTER%20PRODUCT%20ARCHITECTURE.md) — product-level definitions of project, organization, and sharing.
- [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md) — per-provider terms and the Integration Gateway/adapter boundary that enforces canonical normalization.
- [MASTER AI GOVERNANCE.md](MASTER%20AI%20GOVERNANCE.md) — AI provider data-retention/training policy and how it interacts with this document's retention tiers for `AIConversation`/`AIRequest`/`AIResponse`.
- [Dataset Model](database/DATASET%20MODEL.md) — canonical dataset/version/mapping/transformation lineage.
- [Analysis Result Model](database/ANALYSIS%20RESULT%20MODEL.md) — structured result, interpretation, and machine-readable result provenance.
- [Document Generation Model](database/DOCUMENT%20GENERATION%20MODEL.md) — blueprint, section provenance, QA, and export records.
- [Formatting Policy Model](database/FORMATTING%20POLICY%20MODEL.md) — versioned institutional/journal rules, source evidence, resolution, compliance, and rendering provenance.
- [File Asset Model](database/FILE%20ASSET%20MODEL.md) — immutable file identity, security validation, provenance, and retention.
- [Conversion Job Model](database/CONVERSION%20JOB%20MODEL.md) — routing, attempts, fidelity, license review, status, and cleanup.
