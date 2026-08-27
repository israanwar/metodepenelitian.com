# Academic Document Import Workflow

**Status:** LOCKED P1 workflow contract — documented, not implemented

## Goal

Transform a validated thesis/dissertation/article/report file into reviewable normalized academic artifacts and selectively import them into one ResearchProject without overwriting canonical RDT/document/reference state.

## UX flow

```text
Thesis.docx → Detected: Academic Document
→ Extract/Convert action selection
→ Parse title/abstract/chapters/tables/figures/citations/bibliography
→ Preview provenance/fidelity/confidence
→ Map to Project objects
→ Approve selected import
→ Research Compiler / owning-domain validation
```

Candidate actions: Convert PDF/LaTeX, extract references/tables/figures, import into Research Project, convert references to RIS/BibTeX, and prepare journal-manuscript draft. UI shows only exact capability status and does not imply all actions are implemented.

## Workflow

1. Start from security-validated immutable FileAsset and detected academic-document capability.
2. Route document parsing locally/server/async based on privacy, support, size, complexity and license-approved provider.
3. Produce `ParsedDocument` with title/abstract/section tree and source coordinates plus warnings/unparsed regions.
4. Run reference and table/figure extraction only through eligible capabilities, preserving entry/page/paragraph/cell/crop provenance.
5. Propose mappings to RDT Topic/Problem/Methodology/etc., AcademicDocument blueprint/sections, canonical Reference candidates, and file/table/figure assets.
6. User reviews confidence, field-level provenance, conflicts with current project state, and dependency impact; selects what to import.
7. Owning domains validate and create new versioned entities. Protected/final replacements require existing human gates. Research Compiler reports conflicts/unknowns.
8. Optional reference/document export runs through Document Conversion Workflow; optional journal preparation creates a proposed document version, never submission.

## Integrity and safety

Extracted user file content begins `USER PROVIDED/PROPOSED`; parsing confidence is not evidence verification. Citations are not canonical until normalized/reviewed; extracted values are not AnalysisResults. No AI provider automatically receives the file. Import cannot silently replace RDT methodology, hypotheses, results, final document sections, or references.

## Failure/recovery

Partial parsing, unsupported embedded content, coordinate loss, ambiguous chapter/reference, table/figure fidelity warning, or project conflict remains visible. User may import safe subsets with explicit omissions when policy allows; original and all decisions remain auditable.

## Related documents

- [Document Parsing Engine](../internal-engines/DOCUMENT%20PARSING%20ENGINE.md)
- [Reference Extraction Engine](../internal-engines/REFERENCE%20EXTRACTION%20ENGINE.md)
- [Table Figure Extraction Engine](../internal-engines/TABLE%20FIGURE%20EXTRACTION%20ENGINE.md)
- [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md)
