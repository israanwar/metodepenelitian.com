# Document Compliance & Rendering Workflow

**Status:** LOCKED P1 workflow contract — documented, not implemented

## Goal

Apply a verified target-specific formatting profile to an authorized canonical academic document, expose compliance and fidelity truthfully, and create a new immutable DOCX/PDF/LaTeX artifact without changing research content.

## Workflow

```text
Canonical DocumentVersion + target
→ Resolve policy versions/profile
→ Pre-render compliance compile
→ Review conflicts/errors/unknown/manual checks
→ Stage approved presentation remediation
→ Preview and authorize
→ Select verified renderer/conversion route
→ Render new FileAsset
→ Content/provenance/fidelity comparison
→ Post-render compliance compile
→ Eligible download/package or explicit failure
```

1. Pin document, RDT, blueprint, target, document/article type, locale, as-of/effective date, actor and requested output format.
2. For an institutional artifact resolve only the institutional hierarchy. For a journal target use/create a separate journal-article document and resolve the exact `PublicationDestination` policy; never merge thesis and journal packs.
3. Formatting Policy Engine produces an immutable profile or blocks on missing authority, stale required policy, conflict or unsupported critical rule.
4. Research Compiler evaluates content/structure/presentation/package requirements and shows `PASS/WARNING/ERROR/BLOCKED/UNKNOWN`, coverage and manual checks with rule/source evidence.
5. Deterministic reversible presentation fixes may be staged. Content/semantic/approval/signature changes remain proposals requiring owning-domain validation and human authorization.
6. User reviews the effective policy, changes, unresolved warnings/unknowns, expected fidelity, execution/privacy mode and output capability.
7. Build `RenderProfile` and route through an approved `DocumentExportCapability`/Conversion Engine. Source document and prior exports remain immutable.
8. Create a new output FileAsset and compare canonical text/content manifests, citations, results, table/figure checksums, provenance links and required layout/package properties.
9. Re-run render-dependent compliance. A content/provenance mismatch, missing critical element or unsupported critical rule is `ERROR/BLOCKED`; partial output is not eligible.
10. Record export/render/compliance/fidelity versions, show preview, then allow authorized download/save/submission-package use. Export alone never submits or publishes.
11. Expire temporary workspaces and record cleanup proof.

## Journal preparation boundary

SINTA/Scopus/indexing metadata helps discover and evaluate a destination but does not select a generic format. The selected journal id, article type, guideline/template version and verification timestamp are pinned. A destination change creates a new resolution/render attempt.

## Failure and recovery

- Policy changes during a run → finish only against pinned version, mark result stale for new use and offer re-run.
- Renderer unavailable/fails → bounded retry or approved equivalent with disclosed fidelity/privacy differences.
- Output content differs from canonical manifest → quarantine output and `BLOCKED`.
- Manual requirement pending → output may be previewed but not marked fully compliant/final.
- User rejects staged changes → preserve all source versions; discard/expire temporary output.

## Related documents

- [Formatting Policy Engine](../internal-engines/FORMATTING%20POLICY%20ENGINE.md)
- [Research Compiler](../architecture/RESEARCH%20COMPILER.md)
- [Academic Document Engine](../internal-engines/ACADEMIC%20DOCUMENT%20ENGINE.md)
- [Document Conversion Workflow](./DOCUMENT%20CONVERSION%20WORKFLOW.md)
- [Publication Gateway](../architecture/21%20PUBLICATION%20GATEWAY.md)
