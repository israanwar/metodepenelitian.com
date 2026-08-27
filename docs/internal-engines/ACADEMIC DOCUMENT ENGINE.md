# Academic Document Engine

**Status:** LOCKED P0 composition/provenance contract — documented, renderers not implemented

## Purpose

Academic Document Engine composes reviewed Research Digital Twin state into traceable academic documents and export-ready artifacts. It is not a generic ghostwriter, does not hardcode one institution, and cannot create statistical values.

## Blueprint model

- `DocumentBlueprint`: versioned logical structure for Skripsi, Tesis, Disertasi, Journal Article, or Research Report.
- `FormattingPolicyPack`: versioned, sourced institutional or exact-journal requirements layered over a compatible blueprint through deterministic policy resolution. Earlier `InstitutionTemplate`/`JournalTemplate` names are specialized compatibility views, not separate truth stores.
- `SectionDefinition`: section purpose, required/optional inputs, ordering, validation, allowed generators, table/figure slots, approval policy.

Templates/policies are data/configuration capabilities, not provider-specific Research Core logic. Institutional and journal policies apply to separate target artifacts; conflicts are surfaced and institution/journal requirements do not silently overwrite canonical research content.

## Composition flow

```text
Research Digital Twin → Document Blueprint → Section Planning
→ Writing Agents → Tables/Figures → Citation Engine
→ Result Provenance → Research Compiler → Formatting → Export
```

Each `DocumentSectionVersion` records blueprint/template/section versions, pinned RDT/context, source entity/result/claim/citation ids, AnalysisRun/dataset references, generator/agent/model/prompt versions, user edits, approvals, and compiler status. For example BAB IV 4.3 may reference AnalysisRun `AR-0091`, H1–H6, and Dataset v4.

## Tables and figures

Capability includes descriptive/respondent/validity/reliability/regression/SEM-PLS/hypothesis tables, qualitative theme tables, mixed-method joint displays, and publication figures. Every numeric cell/series is rendered from structured results with Result Provenance links. AI may propose captions/explanations but not values. Unsupported table/figure types remain capability-gated.

## Generation and review

Writing Agents receive only authorized pinned context and must cite claim/result provenance. Generated content is `PROPOSED` and distinguishable from user-authored text. Users review/approve sections; replacing a final section or verified interpretation requires approval. Dependency changes mark affected sections stale rather than overwriting them.

## Final QA and export

Research Compiler checks structure/resolved-policy requirements, result fidelity, tables/figures, evidence/citations, discussion/conclusions, integrity, approvals, and stale dependencies. Formatting Policy Engine resolves exact policy versions before compliance; policy conflicts map to compiler `BLOCKED`, and render-dependent checks run again after output. DOCX, PDF, LaTeX, and other formats are handled through registered deterministic renderer/export capabilities with status, version, validation, checksum, and output provenance; architecture does not claim availability.

## Security and failure

Documents inherit project privacy, tenant/access, retention/deletion, and sensitive-data controls. Export uses authorized signed delivery and temporary cleanup. Missing blueprint inputs, stale RDT/result, unverified template, fabricated citation/value, render failure, or incomplete provenance fails explicitly and preserves the prior document version.

## Related documents

- [Document Generation Model](../database/DOCUMENT%20GENERATION%20MODEL.md)
- [Interpretation-to-Document Workflow](../workflows/INTERPRETATION%20TO%20DOCUMENT%20WORKFLOW.md)
- [Result Provenance Engine](./RESULT%20PROVENANCE%20ENGINE.md)
- [Research Compiler](../architecture/RESEARCH%20COMPILER.md)
- [Institutional & Publication Formatting Architecture](../architecture/INSTITUTIONAL%20PUBLICATION%20FORMATTING.md)
- [Formatting Policy Engine](./FORMATTING%20POLICY%20ENGINE.md)
