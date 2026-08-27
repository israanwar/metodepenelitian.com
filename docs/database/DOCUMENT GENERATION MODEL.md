# Document Generation Model

**Status:** LOCKED P0 conceptual model — no SQL, renderer, template package, or migration

## Ownership

Writing & Citation owns canonical academic documents, sections, composition plans, template/blueprint application, tables/figures, and export jobs. RDT supplies canonical research state; Dataset & Analysis owns result truth; Result Provenance links them without copying ownership.

## Entities

### DocumentBlueprint

Versioned document-type structure (`SKRIPSI`, `TESIS`, `DISERTASI`, `JOURNAL ARTICLE`, `RESEARCH REPORT`): blueprint id/version, applicable locale/academic level, section graph/order, requirement rules, compatible templates, provenance, status, and validation date.

### FormattingPolicyPack / InstitutionTemplate / JournalTemplate

Versioned sourced overlay with institution/exact-journal target, applicability, formatting and required-section rules, assets/styles, verification date, license/access, status, hierarchy and supersession. `InstitutionTemplate` and `JournalTemplate` are specialized compatibility views of the canonical Formatting Policy Model, not independent truth stores. No university structure or SINTA-rank template is hardcoded.

### SectionDefinition

Stable section role, required/optional RDT inputs, allowed claims/result/table/figure types, dependency and validation rules, generator permissions, approval/finality, and output constraints.

### AcademicDocument / DocumentVersion

Logical document and immutable version: project/type/title/language, blueprint/template versions, target, composition status, current version, RDT/context/compiler versions, author/ownership, privacy, timestamps, checksums, and supersession.

### DocumentSection / DocumentSectionVersion

Stable section identity plus immutable content version, source/provenance manifest, user/AI contribution attribution, claim/citation/result links, table/figure slots, generator/agent/model/prompt versions, approval, compiler outcome, stale status, and supersession.

### DocumentCompositionPlan / DocumentGenerationRun

Pinned blueprint→section plan and one generation attempt: authorized sources, required gaps, dependency order, agent/tools/templates, start/end/status, input/output versions, warnings/errors, cost/approval where applicable, provenance manifest, and audit ids. Generated output is `PROPOSED`.

### TableArtifact / FigureArtifact

Document-owned placement/rendering record referencing Analysis Result Model artifacts/specifications and provenance links. Rendering/caption styling is owned here; numerical truth remains owned by Analysis Results.

### DocumentExportCapability / DocumentExportRun

Registry entry and deterministic export attempt for DOCX/PDF/LaTeX/other outputs: format, renderer/version, input requirements, validation, status/limits, output file/checksum, temporary processing, signed delivery, warnings/errors, timestamps, and provenance. Listing a format does not assert availability.

### DocumentQualityRun

Pins document/RDT/compiler/template versions and records section completeness, result fidelity, table/figure provenance, citations/references, discussion/conclusion grounding, integrity, approvals, output-format validation, issues, and finalization eligibility.

Formatting-policy versions, `ResolvedFormattingProfile`, compliance findings and render fidelity are defined authoritatively in the [Formatting Policy Model](./FORMATTING%20POLICY%20MODEL.md) and referenced by document quality/export runs.

## Invariants

- Sections/versions are never silently overwritten; final-section replacement requires approval.
- Every generated section has a provenance manifest.
- Numerical document content and tables/figures reference validated structured results.
- Template changes cannot modify canonical research state and may invalidate layout/requirements only.
- Institutional and journal policy packs are never merged for one artifact; target-specific output is a new document/export version.
- Equal-precedence policy conflict blocks compliance instead of choosing a last-written rule.
- Finalization/export is blocked by critical compiler/provenance mismatch or stale required source.
- Export does not publish or submit; Publication Gateway remains the external handoff.

## Related documents

- [Academic Document Engine](../internal-engines/ACADEMIC%20DOCUMENT%20ENGINE.md)
- [Interpretation-to-Document Workflow](../workflows/INTERPRETATION%20TO%20DOCUMENT%20WORKFLOW.md)
- [Analysis Result Model](./ANALYSIS%20RESULT%20MODEL.md)
- [Research Digital Twin Model](./RESEARCH%20DIGITAL%20TWIN%20MODEL.md)
- [Formatting Policy Model](./FORMATTING%20POLICY%20MODEL.md)
