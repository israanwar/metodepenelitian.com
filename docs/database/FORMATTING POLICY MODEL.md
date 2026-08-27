# Formatting Policy Model

**Status:** LOCKED P0/P1 conceptual model — no SQL, parser, policy catalog or renderer

## Ownership and boundaries

Writing & Citation owns formatting policy interpretation, versions, resolved profiles, compliance records and render profiles. Platform/Institution owns organization identity and authorization. Publication Gateway owns `PublicationDestination`, indexing and SINTA rank. Research File Tools owns source/output `FileAsset` and conversion execution. This model references those records without duplicating their ownership.

`InstitutionTemplate` and `JournalTemplate` in the earlier Document Generation Model are compatibility views/specializations of `FormattingPolicyPack`, not independent sources of truth.

## Core entities

### FormattingPolicyPack

Logical policy identity: `policy_pack_id`, target kind (`BASE`, `INSTITUTION`, `ORGANIZATIONAL_UNIT`, `PROGRAM`, `PUBLICATION_DESTINATION`), target reference, name, scope, owner/maintainer authority, visibility, lifecycle status and current version.

### FormattingPolicyVersion

Immutable version: pack/version, document/article types, locales, academic level, cohort/effective-from/to, parent/extends references, source manifest, verification status/date/reviewer, license/access restrictions, content hash, created/published timestamps, supersedes/superseded-by and revocation reason.

### FormattingRule

Stable `rule_id/rule_key` plus immutable version: category (`CONTENT`, `STRUCTURE`, `PRESENTATION`, `PACKAGE`, `MANUAL_REVIEW`), subject/path, operator/evaluator, typed expected value/schema, units, severity/blocking policy, override policy, applicability predicate, remediation mode, renderer mapping, source-evidence references and status.

### RuleSourceEvidence

Source organization/venue, source type, official URL or authorized FileAsset, title/version/date, page/section/coordinates, permitted excerpt/hash, retrieval time, parser/import run, reviewer, confidence and verification decision. Evidence provenance does not grant redistribution rights.

### PolicyAsset

Reference to an authorized logo, form, DOCX/style template, font or other FileAsset with asset role, version, checksum, access/redistribution terms, tenant scope and renderer eligibility. Unlicensed/private assets cannot be published to a shared catalog.

### PolicyVerification

Immutable review decision covering target authority, source authenticity, extraction correctness, applicability/effective period, rule completeness/limitations, license/access review, reviewer identity, evidence, decision/status, date, expiry/re-review trigger and supersession.

### PolicyExceptionDecision

Scoped exception request/decision: target document, affected rule/version, authority, rationale/evidence, allowed action, risk, approval/rejection, validity/expiry and audit references. An exception remains a visible deviation unless the governing policy authorizes it as compliant.

### ResolvedFormattingProfile

Content-addressed immutable result: target/document context, as-of time, selected pack/version manifest, resolved effective rules, shadowed-rule lineage, exceptions, conflicts, unknown/unsupported/manual checks, resolution engine/version, hash, eligibility and timestamps.

### PolicyConflict

Two or more incompatible rule/version references, precedence/scope evidence, affected subject, reason code, detection time, blocking status and explicit resolution/supersession reference. It is never resolved by last-write-wins.

### GuidelineImportRun / CandidateFormattingRule / RuleReviewDecision

Import provenance: source FileAsset/checksum, parser/extractor/model/prompt versions where used, security state, target hints, candidate rules with source coordinates/confidence, ambiguity/omission flags, reviewer decisions and proposed/published pack version. Candidate rules are `PARSED_UNVERIFIED` and cannot enter production resolution directly.

### DocumentComplianceRun / ComplianceFinding

Pins document/RDT/blueprint/profile/compiler versions and records coverage, outcomes, eligibility and timestamps. Each finding records rule/source, document location, observed/expected values, `PASS/WARNING/ERROR/BLOCKED/UNKNOWN`, reason code, evidence, remediation, automatic/manual state, reviewer decision and resolution/re-run linkage.

### RenderProfile / DocumentRenderRun

`RenderProfile` maps a resolved profile to a verified `DocumentExportCapability`, renderer/version, styles/assets, output format and unsupported/manual constraints. `DocumentRenderRun` extends/links `DocumentExportRun` with immutable inputs, output FileAsset/checksum, content/provenance manifest comparison, fidelity report, compliance recheck, status, warnings/errors, temporary cleanup and audit references.

## Status invariants

- Policy trust: `OFFICIAL_VERIFIED`, `INSTITUTION_VERIFIED`, `USER_CONFIRMED`, `PARSED_UNVERIFIED`, `STALE`, `CONFLICT`, `UNSUPPORTED`, `REVOKED`.
- Candidate/import states cannot be confused with an active verified policy.
- Publication rank/indexing changes do not mutate a policy version; they update Publication Gateway data and may trigger re-verification of destination context.
- A new source/template creates a new immutable policy version and marks dependent current projections stale; historical compliance/export remains reproducible.
- Rule/evidence deletion follows access/legal policy but cannot leave a retained compliance claim without sufficient proof; such claims become unverifiable/stale.

## Security and retention

Public verified rule metadata may be retained as catalog knowledge; private/user-provided guidelines, templates and derived excerpts follow tenant/project retention and source rights. Manuscript/compliance/render artifacts remain private research data. Temporary parser/renderer workspaces expire automatically. Audit records minimize private content while retaining decision and integrity evidence.

## Query requirements

- Resolve eligible packs for a target/document/as-of context.
- Explain why one rule won and which source/version supports it.
- Find conflicts, stale packs and dependent documents/exports.
- Reproduce a historical compliance/render decision.
- Compare two target profiles without merging their artifact semantics.
- Identify unsupported/manual requirements before the user requests export.

## Related documents

- [Institutional & Publication Formatting Architecture](../architecture/INSTITUTIONAL%20PUBLICATION%20FORMATTING.md)
- [Document Generation Model](./DOCUMENT%20GENERATION%20MODEL.md)
- [Formatting Policy Engine](../internal-engines/FORMATTING%20POLICY%20ENGINE.md)
- [Conversion Job Model](./CONVERSION%20JOB%20MODEL.md)
- [Publication Gateway](../architecture/21%20PUBLICATION%20GATEWAY.md)
