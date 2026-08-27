# Evidence-to-Claim Graph

**Status:** P0 internal-engine/domain contract — conceptual only

## Purpose

The Evidence-to-Claim Graph makes every major academic and publication claim traceable to its source paper, dataset, analysis result, methodology, and citation. It reduces unsupported AI output and supports audit, reproducibility, reviewer readiness, and targeted invalidation when evidence changes.

## Graph path

```text
Research Question
→ Hypothesis
→ Claim
→ Evidence
→ Paper
→ Theory
→ Variable
→ Instrument
→ Dataset
→ Analysis
→ Finding
→ Discussion Claim
→ Conclusion
→ Publication
```

This is a traceability view, not a claim that every edge is causal or that every project uses hypotheses. Qualitative and mixed-method projects may connect research questions directly to codes/themes, findings, and claims while retaining the same provenance guarantees.

## Nodes and edges

Core nodes include `ResearchQuestion`, `Hypothesis`, `Claim`, `EvidenceClaim`, `Paper/Reference`, `Theory`, `Variable/Construct`, `Instrument`, `DatasetVersion`, `AnalysisPlan`, `AnalysisRun`, `Result/Finding`, `DiscussionClaim`, `Conclusion`, `Citation`, and `PublicationArtifact`.

Typed edges include `ADDRESSES`, `TESTS`, `SUPPORTED_BY`, `CONTRADICTED_BY`, `DERIVED_FROM`, `OPERATIONALIZED_BY`, `MEASURED_BY`, `ANALYZED_IN`, `REPORTS`, `INTERPRETS`, `CITES`, and `PUBLISHED_AS`. Every edge records direction, rationale, provenance, creator, verification status, applicable scope, RDT version, and validity interval.

## Claim contract

Every major claim records:

- exact claim text or immutable content reference;
- claim type and manuscript location;
- scope/population/conditions;
- origin (`USER PROVIDED`, `AI GENERATED`, or derived from analysis);
- links to source papers and/or dataset plus analysis result;
- applicable methodology and analysis-plan versions;
- citation/reference links;
- verification state, verifier, date, and confidence/limitations.

Agents and AI cannot create an evidence-dependent academic claim without a declared source state. Unsupported proposals remain `PROPOSED`; missing support returns `UNKNOWN/BLOCKED`, never an invented citation.

## Status progression

The graph preserves origin and uses evidence-specific decisions:

`USER PROVIDED / AI GENERATED → PROPOSED → SOURCE VERIFIED → EVIDENCE VERIFIED → METHODOLOGICALLY VERIFIED or ANALYSIS VERIFIED → APPROVED → PUBLISHED`

This is not an automatic linear promotion. A source being metadata-verified does not prove a claim. Methodological and analysis verification apply only when the relevant link exists. `APPROVED` records human authority; `PUBLISHED` records an external fact. Canonical RDT lifecycle labels remain governed by the strict status model.

## Evidence verification

Source verification checks identity/metadata, DOI or stable identifier, access/provenance, correction/retraction state, and that the cited passage/data exists. Evidence verification separately evaluates whether it actually supports, contradicts, or limits the scoped claim. Review stores quotation/location pointers where licensing permits, structured rationale, evaluator, evidence date, and limitations.

## Change impact

- Retracted/corrected paper: deprecate affected source version; invalidate its evidence links and dependent claims; recompile theory, discussion, and publication readiness.
- Dataset update: preserve old dataset version; stale dependent analysis runs/results/claims until rerun.
- Methodology or hypothesis change: identify claims/results outside the new scope; require review or block publication use.
- Citation metadata correction: update reference version while preserving the cited source identity and audit trail.

No event deletes prior support history or automatically rewrites final text. Protected final-manuscript changes need approval.

## Compiler checks

The Compiler checks that each major claim has admissible support, current source/retraction state, compatible method and analysis versions, resolved citations/references, honest uncertainty, and no publication claim exceeds verified findings. It reports claim coverage and unsupported/contradicted/stale links; a percentage cannot hide a critical unsupported claim.

## Agent use

Literature and Evidence Agents propose source/evidence nodes; Analysis Agent links runs to findings; Writing Agent may only render claims within verified scope; Research Critic challenges support; Publication Agent checks target/readiness. Every agent uses the same project graph and returns proposed links rather than maintaining a private evidence store.

## Related documents

- [Research Compiler](../architecture/RESEARCH%20COMPILER.md)
- [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md)
- [Research Consistency Model](../database/RESEARCH%20CONSISTENCY%20MODEL.md)
- [AI Citation Grounding](../ai/AI%20CITATION%20GROUNDING.md)
