# Institutional & Publication Formatting Architecture

**Status:** LOCKED P0 invariants and P1 architecture direction — documented, not implemented

## Purpose

Institutional & Publication Formatting Architecture lets one canonical academic document produce requirements-compliant Skripsi, Tesis, Disertasi, journal manuscript, repository copy, or archival export without rewriting or corrupting research truth. It models campus and venue variation as versioned, sourced policy data rather than hardcoded conditional code or a collection of unverifiable Word templates.

## Locked constitutional boundary

```text
CANONICAL RESEARCH CONTENT
facts, claims, results, citations, tables, figures, provenance
                    │
                    ▼
FORMATTING POLICY + DOCUMENT BLUEPRINT
structure, ordering, typography, layout, numbering, submission constraints
                    │
                    ▼
COMPLIANCE COMPILER → DETERMINISTIC RENDERER → DERIVED FILE ASSET
```

The following are P0 invariants even though the policy registry and renderers are P1 capabilities:

- Canonical research content is separate from presentation and target-specific packaging.
- Formatting cannot create, delete, alter, round, reinterpret, or silently relocate a research fact, result, citation, table/figure value, approval, or provenance link.
- Applying another policy creates a new derived `DocumentVersion`/output artifact; it never overwrites the canonical document or prior export.
- An institutional thesis and a journal manuscript are different document artifacts derived from authorized common research state. Their policy packs are not merged into one contradictory document.
- Unknown, stale, unsupported, or conflicting requirements remain visible and cannot be reported as compliant.

## SINTA and destination boundary

SINTA 1–6 is accreditation/ranking metadata on a journal, not a universal manuscript format. `sinta_rank` belongs to `PublicationDestination`. Formatting resolves against the exact selected journal, author-guideline source, template version, article type, language, and effective period. No `SINTA_1_TEMPLATE` or `SINTA_2_TEMPLATE` exists in the canonical model.

Official grounding: the [SINTA FAQ](https://sinta.kemdiktisaintek.go.id/home/faq) defines SINTA 1–6 as accreditation ranks; institutional evidence such as [UI's 2025 final-project guidance](https://pascakomunikasi.fisip.ui.ac.id/pedoman-teknis-penulisan-tugas-akhir-mahasiswa/) demonstrates that university guidance may be supplemented below university level. These links are evidence examples, not imported policy packs or current compliance guarantees.

## Architecture

```text
Official/User-provided guideline or template
→ File security validation
→ Guideline Import
→ Candidate requirements + source coordinates
→ Human review and verification
→ Versioned FormattingPolicyPack
                          │
Canonical AcademicDocument + DocumentBlueprint + target context
                          │
                          ▼
Policy Resolver → ResolvedFormattingProfile → Research Compiler
→ PASS/WARNING/ERROR/BLOCKED/UNKNOWN
→ Preview/approval → Document Export → Fidelity validation
→ immutable DOCX/PDF/LaTeX FileAsset
```

## Policy hierarchy and applicability

An institutional target may resolve through:

```text
BASE ACADEMIC POLICY
→ INSTITUTION
→ FACULTY / GRADUATE SCHOOL
→ PROGRAM
→ DOCUMENT TYPE
→ COHORT / EFFECTIVE PERIOD
→ AUTHORIZED EXCEPTION
```

A journal target resolves independently through:

```text
JOURNAL / PUBLICATION DESTINATION
→ ARTICLE TYPE
→ LANGUAGE
→ GUIDELINE/TEMPLATE VERSION
→ EFFECTIVE PERIOD
```

Every layer must match target, document type, locale, organizational scope, effective dates, and verification state. A more specific applicable rule may override a less specific rule only when its authority and source are valid. Two active rules at equal precedence with incompatible values create `PolicyConflict`; resolution is `BLOCKED` with reason code `POLICY_CONFLICT`, not an arbitrary winner.

An advisor or project exception requires recorded authority, scope, rationale, evidence, expiry, and affected rules. It cannot convert a known deviation into `PASS` unless the governing policy explicitly permits that authority to waive the requirement.

## Rule taxonomy

Policy packs may declare typed rules for:

- document structure and mandatory/optional sections;
- front matter, declarations, approval/signature pages and appendices;
- paper size, margins, columns, pagination, headers and footers;
- typography, spacing, indentation, heading hierarchy and numbering;
- title, abstract, keywords and language constraints;
- citation/bibliography style and reference-order requirements;
- table, figure, equation, caption and cross-reference presentation;
- word/page/count constraints and section-specific limits;
- file format, filename, PDF profile, embedded-font and repository packaging rules;
- required metadata, forms, supplementary files and submission package composition.

Rules distinguish `CONTENT_REQUIREMENT`, `STRUCTURE_REQUIREMENT`, `PRESENTATION_REQUIREMENT`, `PACKAGE_REQUIREMENT`, and `MANUAL_REVIEW_REQUIREMENT`. A renderer may implement presentation; it cannot invent content to satisfy a content requirement.

## Components and ownership

- **Formatting Policy Registry** — Writing & Citation-owned, versioned policy packs, rules, source evidence, assets, verification and supersession.
- **Policy Resolver** — deterministically selects applicable versions, applies precedence, emits a resolved profile and conflicts.
- **Guideline Import** — P1 ingestion workflow that proposes traceable candidate rules from PDF/DOCX/HTML; it does not publish rules autonomously.
- **Compliance Compiler Adapter** — supplies formatting/requirement rules to Research Compiler while preserving the compiler's locked outcomes.
- **Render Profile Builder** — maps resolved presentation rules to an approved deterministic export capability.
- **Institution Portal** — P2 governed surface for authorized institutional maintainers; it never bypasses verification/versioning.
- **Template Freshness Monitor** — P2 evidence monitor that proposes `STALE`/re-verification; it does not silently update active rules.

`Organization`/organizational units remain Platform/Institution identity records. `PublicationDestination` remains Publication Gateway-owned. Formatting stores references to them and owns only their document-policy interpretation.

## Trust and lifecycle statuses

Policy evidence uses:

- `OFFICIAL_VERIFIED`: verified against an authoritative published source.
- `INSTITUTION_VERIFIED`: approved by an authorized institution/venue maintainer.
- `USER_CONFIRMED`: accepted for a scoped project by the user, not represented as official.
- `PARSED_UNVERIFIED`: machine-extracted candidate awaiting human review.
- `STALE`: source/version freshness cannot support a current compliance claim.
- `CONFLICT`: active applicable evidence/rules disagree.
- `UNSUPPORTED`: cannot be represented or validated by current capability.
- `REVOKED`: withdrawn and unavailable for new resolutions; history remains auditable.

`CONFLICT` is a policy lifecycle state, not a new Research Compiler outcome. Compiler reports the affected check as `BLOCKED`.

## Guideline and asset governance

Every rule records source organization/venue, source URL or authorized FileAsset, document title/version/date, page/section/source coordinates, excerpt/hash as permitted, parser and reviewer provenance, verification date, effective range and supersession. AI may propose extraction but cannot invent missing rules or mark them official.

Copyright/licensing is separate from rule accuracy. Storing derived facts necessary for compliance does not authorize redistributing an uploaded template, logo, form, font or full guideline. Policy assets require explicit access/distribution rights and tenant scope. Unapproved assets remain private and cannot enter a public template library.

## Compliance and rendering

Compliance runs pin canonical `DocumentVersion`, RDT/compiler state, blueprint, policy-pack versions, resolved profile, renderer capability/version, and target. Findings include rule/source coordinates, document location, observed/expected values, outcome, remediation, automatable/manual state and evidence.

Automatic remediation is allowed only for reversible presentation changes such as margins or approved styles. Content, citations, results, section meaning, authorship, approval/signature material, or ambiguous structural moves require preview and human authorization. After rendering, output fidelity verifies text/content manifests, citations, result/table/figure checksums, page/layout constraints and provenance before the file can be marked eligible.

## UX contract

```text
Choose institution/journal target
→ Choose document/article type and effective period
→ Show policy source, version and trust status
→ Resolve requirements and conflicts
→ Run compliance check
→ Fix/review/authorize
→ Preview output and fidelity differences
→ Export new DOCX/PDF/LaTeX artifact
```

If no verified pack exists, the user may upload a guideline and create a project-scoped `PARSED_UNVERIFIED` pack. The UI must say that official compliance is not verified.

## Security, privacy and failure

- Guideline and manuscript assets inherit tenant/project access, malware validation, signed access and retention controls.
- No private manuscript is sent to an external AI or conversion provider without policy eligibility, disclosure and authorization.
- Prompt/content embedded in guideline files is untrusted data, never executable instruction.
- Missing source, stale policy, unsupported rule, ambiguous extraction, conflict, renderer loss, fidelity mismatch or required manual check remains explicit.
- A failed compliance/render attempt cannot damage the canonical document or last valid export.

## Observability

Track policy coverage by institution/program/document/venue, verification and stale ratios, conflict rate, manual-review rate, rule false-positive/override decisions, compliance outcomes, render/fidelity failures, update latency, and pack usage. Coverage metrics cannot be marketed as universal institution support.

## Priority

- **P0 invariant:** content/format separation and truth/provenance preservation.
- **P1:** policy registry, deterministic resolver, guideline import/review, compliance report, render-profile integration and initial verified pilots.
- **P2:** authorized institution/journal portal, source monitoring, stale detection and broader verified catalog.
- **Not approved:** bulk scraping, mass AI-generated packs, universal SINTA templates, or claiming official institutional support without authority/evidence.

## Related documents

- [Formatting Policy Engine](../internal-engines/FORMATTING%20POLICY%20ENGINE.md)
- [Formatting Policy Model](../database/FORMATTING%20POLICY%20MODEL.md)
- [Guideline Import Workflow](../workflows/GUIDELINE%20IMPORT%20WORKFLOW.md)
- [Document Compliance & Rendering Workflow](../workflows/DOCUMENT%20COMPLIANCE%20RENDERING%20WORKFLOW.md)
- [Academic Document Engine](../internal-engines/ACADEMIC%20DOCUMENT%20ENGINE.md)
- [Research Compiler](./RESEARCH%20COMPILER.md)
- [Research File & Conversion Engine](./RESEARCH%20FILE%20TOOLS.md)
- [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md)
