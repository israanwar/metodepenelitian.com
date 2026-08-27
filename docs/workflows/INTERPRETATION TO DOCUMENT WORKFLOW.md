# Interpretation-to-Document Workflow

**Status:** LOCKED P0 workflow contract — documented, not implemented

## Goal

Compose approved results, interpretation, evidence, and discussion into a provenance-bearing Skripsi, Tesis, Disertasi, Journal Article, or Research Report and pass final QA before deterministic export.

## Workflow

| Stage | Inputs | Output | Gate / failure |
|---|---|---|---|
| 1. Select blueprint | project type/academic level/target | versioned DocumentBlueprint selection | no hardcoded institution; unavailable blueprint blocks composition |
| 2. Apply template | InstitutionTemplate/JournalTemplate with verified source/date | resolved requirements and conflicts | user resolves incompatible/unverified requirements |
| 3. Section planning | blueprint + pinned RDT/context | ordered DocumentCompositionPlan | missing required RDT inputs reported, not invented |
| 4. Results composition | verified results/interpretations | result section and hypothesis/finding tables | every number/claim has Result Provenance |
| 5. Discussion composition | findings, RQs/hypotheses, theory/evidence | evidence-connected discussion | generic/unsupported discussion is compiler issue |
| 6. Tables/figures | structured results/findings + registered schema | versioned tables/figures/joint displays | no AI-generated values; every cell/series traceable |
| 7. Citations/references | Evidence-to-Claim Graph and canonical references | citations/bibliography | Citation↔Reference and Claim↔Evidence validation |
| 8. Section review | generated section + source manifest/diff | approved/revised section version | final-section replacement requires approval |
| 9. Research Compiler | full pinned document/RDT/results/templates | issues and readiness | numeric mismatch/stale provenance blocks finalization |
| 10. Final research QA | approvals, integrity, structure, result/discussion/conclusion fidelity | eligible final DocumentVersion | `ERROR/BLOCKED/UNKNOWN` requirements remain visible |
| 11. Format/export | registered DOCX/PDF/LaTeX/other renderer | output, checksum, manifest, signed delivery | unsupported/failed rendering does not alter document |
| 12. Publication handoff | user-approved final package | Publication Gateway draft/handoff | external submission requires immediate human approval |

## Section provenance

Every generated section version records blueprint/template/definition, RDT/context, Research Question/Hypothesis, DatasetVersion/AnalysisRun/StructuredResult, Interpretation, theory/evidence claims, citations, tables/figures, agent/model/prompt/tool versions, user edits, approval, and compiler run. Example BAB IV 4.3 references AR-0091, H1–H6, and Dataset v4.

## Document integrity

Research Compiler checks Dataset↔Variables, Variables↔Method, Method↔Analysis, Analysis↔Hypothesis/RQ, Analysis Result↔Written Result, Result↔Discussion, Discussion↔Evidence, Conclusion↔Findings, Citation↔Reference, and Table/Figure↔AnalysisRun. If document `p=0.021` conflicts with run `p=0.201`, finalization is blocked.

## Human and AI boundary

Writing, Citation, Discussion, Evidence, Interpretation, Research Critic, and Publication Agents share pinned RDT context and return proposals. AI can structure/explain verified material but cannot invent values/sources, hide uncertainty, replace a final section, or submit. User authorship/revisions remain distinguishable from agent-generated drafts.

## Change and recovery

Upstream dataset/mapping/method/run/result/evidence/template changes create an impact set and mark affected sections/tables/figures/exports stale. Prior versions remain reconstructable. Regeneration is proposed, not automatic destructive replacement.

## Next Best Research Action

Examples: after interpretation approval with missing discussion, “Connect findings with theory and previous evidence”; after a compiler mismatch, review the exact document token/result link; after QA pass, review export/package and approval requirements.

## Related documents

- [Academic Document Engine](../internal-engines/ACADEMIC%20DOCUMENT%20ENGINE.md)
- [Document Generation Model](../database/DOCUMENT%20GENERATION%20MODEL.md)
- [Research Compiler](../architecture/RESEARCH%20COMPILER.md)
- [Publication Gateway](../architecture/21%20PUBLICATION%20GATEWAY.md)
