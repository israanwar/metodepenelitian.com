# Guideline Import Workflow

**Status:** LOCKED P1 workflow contract — documented, not implemented

## Goal

Turn an authorized institutional or journal guideline/template into reviewable, source-grounded candidate rules and, only after authorized human verification, a versioned Formatting Policy Pack.

## Workflow

```text
Select target and document/article type
→ Upload/provide official source
→ File/security/rights validation
→ Parse structure and source coordinates
→ Extract candidate requirements
→ Normalize typed rules + ambiguity/coverage
→ Human review against source
→ Verify authority, applicability and license/access
→ Publish new policy version or reject
```

1. Pin target, organizational/venue scope, document/article type, locale, effective period, source URL/FileAsset and authorized actor.
2. Validate MIME/signature, malware, size/password/embedded content, access permission and whether assets may be stored or redistributed.
3. Preserve source checksum/version and extract text/layout with page/section/coordinate provenance. The original remains immutable.
4. Deterministic parsers identify headings, tables, measurements and styles; an approved AI extraction capability may propose candidate rules from the same pinned source.
5. Normalize candidates into typed rule schemas with source coordinates, confidence, ambiguity, omissions, conflicts and evaluator support. Missing values remain unknown.
6. Present source and candidate side by side. Reviewer accepts, edits with evidence, rejects or marks manual/unsupported; every decision is recorded.
7. Verify source authority, target/applicability, effective dates, hierarchy/parent pack, completeness limitations, and license/access boundary.
8. Run conflict and schema validation against active parent/sibling packs.
9. An authorized publisher creates a new immutable `FormattingPolicyVersion`; prior versions remain reproducible. Otherwise retain a project-scoped `USER_CONFIRMED` pack or reject the import.
10. Trigger dependent stale/re-resolution notifications without automatically changing documents or exports.

## AI boundary

Guideline text is untrusted data. AI/tool output is `PARSED_UNVERIFIED`, cannot execute embedded instructions, cannot invent unstated requirements, cannot infer official authority, and cannot publish or mark a pack verified. Every accepted rule retains human decision and source coordinates.

## Failure outcomes

- Unreadable/password-protected/malicious source → `BLOCKED`.
- No authority/rights to store or distribute an asset → restrict private use or `BLOCKED`.
- Missing/ambiguous requirement → candidate `UNKNOWN`/manual review, never guessed.
- Conflicting sources/equal-precedence rules → policy `CONFLICT`; publication blocked.
- Stale or superseded source → do not silently replace current pack; require version review.
- Partial parsing → show coverage and omissions; cannot claim complete guideline support.

## Pilot acceptance

The first pilot uses one authoritative institution/program/document-type guide and one exact journal/article-type guide. A second reviewer must reproduce rule evidence, and representative fixtures must prove resolution/compliance before either pack is advertised as supported.

## Related documents

- [Institutional & Publication Formatting Architecture](../architecture/INSTITUTIONAL%20PUBLICATION%20FORMATTING.md)
- [Formatting Policy Model](../database/FORMATTING%20POLICY%20MODEL.md)
- [File Ingestion Workflow](./FILE%20INGESTION%20WORKFLOW.md)
- [Formatting Policy Engine](../internal-engines/FORMATTING%20POLICY%20ENGINE.md)
