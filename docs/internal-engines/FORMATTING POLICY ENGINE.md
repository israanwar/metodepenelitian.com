# Formatting Policy Engine

**Status:** LOCKED P1 internal-engine contract — documented, not implemented

## Purpose

Formatting Policy Engine resolves versioned institutional or publication requirements into one deterministic `ResolvedFormattingProfile`, detects conflicts and supplies auditable compliance rules to Research Compiler and document renderers. It does not own canonical document content, publication destinations, organizations, files, or external submission.

## Inputs

- authorized `AcademicDocument`/`DocumentVersion` and its `DocumentBlueprint`;
- target context: institution/unit/program or exact `PublicationDestination`;
- document/article type, locale, cohort/effective date and requested output format;
- eligible `FormattingPolicyPack` versions and source/verification state;
- approved exception decisions;
- renderer/capability registry state.

## Deterministic resolution

1. Pin all input identifiers and versions.
2. Filter packs by target kind/id, scope, document/article type, locale, effective range, lifecycle status and tenant access.
3. Reject `REVOKED`; block required packs that are `STALE`, `CONFLICT`, or unavailable according to target policy.
4. Order institutional layers from base → institution → unit → program → document type → cohort/effective period. Journal resolution uses exact venue → article type → locale → guideline/template version.
5. Merge typed rules by stable `rule_key`. A more specific valid rule supersedes a less specific rule while retaining lineage.
6. If incompatible rules have equal precedence or non-overridable constraints disagree, emit `PolicyConflict` and block resolution.
7. Apply only authorized, in-scope exceptions and retain deviations in the result.
8. Produce a content-addressed immutable profile with the selected-pack manifest, effective rules, shadowed rules, conflicts, unknowns and manual-review requirements.

Institutional and journal hierarchies never resolve together for one artifact. Journal preparation first creates/uses a journal-article document derived from shared canonical research state, then resolves only the selected venue's policy.

## Conceptual interface

```text
resolve(targetContext, documentContext, asOf) → ResolvedFormattingProfile
validateProfile(profile) → validation result
evaluate(documentVersion, profile) → ComplianceRun
buildRenderProfile(profile, exportCapability) → RenderProfile
explain(ruleKey, profile) → source/precedence/override lineage
```

No call mutates `AcademicDocument`, RDT or policy history.

## Rule evaluation

Rules declare evaluation mode: `DETERMINISTIC`, `DOCUMENT_PARSE_REQUIRED`, `RENDER_REQUIRED`, or `MANUAL_REVIEW`. Deterministic checks run first. A missing evaluator returns `UNKNOWN/UNSUPPORTED`; a model inference cannot be silently substituted.

Findings map to Research Compiler outcomes:

- satisfied → `PASS`;
- material but non-blocking deviation → `WARNING`;
- known failed requirement → `ERROR`;
- policy conflict, missing required pack/permission or unusable renderer → `BLOCKED`;
- insufficient information/manual result pending → `UNKNOWN`.

## Remediation boundary

The engine may propose or automatically stage reversible presentation changes when the rule is deterministic and the user can preview the result. It cannot change claims, values, citations, reference identity, section meaning, table/figure data, authorship, approval/signature content, or canonical RDT state. Structural/content remediation is a proposal routed to Academic Document Engine and human review.

## Caching and invalidation

Resolution may be cached by the complete pack/version/context hash. New policy verification, supersession, revocation, target change, exception change, document type/locale change or capability change invalidates the cache and marks dependent compliance/export runs stale. Historical runs continue to reference their original immutable profile.

## Security and failure

- Enforce tenant/source-asset authorization before resolving private packs.
- Treat extracted text and rule expressions as data; allow only registered evaluator types and schemas.
- Bound rule counts/evaluation time and reject executable macros/scripts/templates.
- Return explicit conflict/source/evaluator/render failures; never choose an arbitrary rule or silently reduce compliance coverage.

## Related documents

- [Institutional & Publication Formatting Architecture](../architecture/INSTITUTIONAL%20PUBLICATION%20FORMATTING.md)
- [Formatting Policy Model](../database/FORMATTING%20POLICY%20MODEL.md)
- [Research Compiler](../architecture/RESEARCH%20COMPILER.md)
- [Academic Document Engine](./ACADEMIC%20DOCUMENT%20ENGINE.md)
