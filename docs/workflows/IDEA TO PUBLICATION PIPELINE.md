# Idea-to-Publication Pipeline

**Status:** P0 official workflow contract — documented, not implemented

## Operating contract

This workflow turns a title, idea, candidate-title table, proposal, methodology draft, paper collection, dataset, or combination into one executable `ResearchProject`. `ResearchProject` remains the aggregate root and Research Digital Twin (RDT) is canonical research state. All initial assertions are `PROPOSED`; verification requires evidence. Agents share one project context, models run only through Multi-Model AI Gateway, and external systems are accessed only through Integration Gateway.

Each stage reads a pinned RDT version, creates traceable proposed outputs, invokes targeted Research Compiler rules, and commits only authorized changes. Failure retains the last valid state. A transition may loop to an earlier stage without erasing history.

## Roles and tools

- Agents: Research Director, Intake, Literature, Evidence, Screening, Research Gap, Theory, Methodology, Sampling/Sample Size, Instrument, Data Steward, Analysis, Statistical/Qualitative Critic, Writing, Citation, Research Critic, Publication, Journal Matching, and Review/Revision Agents.
- Internal tools: RDT Engine, Research Compiler, Evidence-to-Claim Graph, calculators/statistical or qualitative tools, document/file tools, citation/reference tools, and Next Best Research Action Engine.
- Integrations: scholarly metadata/indexes, retraction/correction sources, reference managers, survey/data collection providers, analysis providers, journal/index metadata, and submission destinations. Availability is provider-dependent and never assumed.

## Stage specifications

### 1. Research Intake

- **WHAT:** Preserve originals, identify input types, establish project scope, provenance, access, language, and candidate topics.
- **INPUTS:** Title/idea/table/proposal/methodology draft/papers/dataset; owner consent and metadata.
- **OUTPUTS:** `ResearchProject`, intake record, proposed topic/problem metadata, candidate set, data/access classification.
- **REQUIRED AGENTS:** Intake Agent, Research Director. **TOOLS:** file/parser tools, RDT Engine. **INTEGRATIONS:** none required; reference/storage connectors optional.
- **RDT OBJECTS UPDATED:** Project, Topic, CandidateResearchTopic, Document, Reference, Dataset pointers.
- **VALIDATION:** file safety, provenance, project boundary, required identifiers; user content remains `PROPOSED`.
- **HUMAN APPROVAL:** confirm project creation, sensitive-data handling, and selected intake scope.
- **FAILURE CONDITIONS:** unreadable input, missing authority/consent, malware, cross-project leakage. **NEXT STATE:** Problem Formulation or Candidate Comparison.

### 2. Problem Formulation

- **WHAT:** Translate topic/phenomenon into bounded problem, questions, objectives, and proposed contribution.
- **INPUTS:** Intake state and user constraints. **OUTPUTS:** proposed Problem, Research Questions, Objectives, Contributions.
- **REQUIRED AGENTS:** Research Director, Research Critic. **TOOLS:** RDT Engine, dependency preview. **INTEGRATIONS:** none required.
- **RDT OBJECTS UPDATED:** Phenomenon, Problem, ResearchQuestion, Objective, Contribution.
- **VALIDATION:** RQ↔objective alignment, scope, answerability, provenance. **HUMAN APPROVAL:** accept problem framing before it guides evidence search.
- **FAILURE CONDITIONS:** ambiguous scope, contradictory objectives, disallowed subject/data. **NEXT STATE:** Evidence Discovery.

### 3. Evidence Discovery

- **WHAT:** Search for relevant, current, and foundational scholarly sources without inventing evidence.
- **INPUTS:** problem/RQs, search protocol, date/language/access constraints. **OUTPUTS:** candidate sources and search audit trail.
- **REQUIRED AGENTS:** Literature Agent, Evidence Agent. **TOOLS:** knowledge search, deduplication. **INTEGRATIONS:** scholarly indexes/metadata providers through Integration Gateway.
- **RDT OBJECTS UPDATED:** Literature search, Reference candidates, source provenance.
- **VALIDATION:** query trace, source identity, DOI/metadata, provider/time coverage. **HUMAN APPROVAL:** review paid/restricted access or scope expansion.
- **FAILURE CONDITIONS:** unavailable provider, insufficient search coverage, unverifiable sources. **NEXT STATE:** Literature Screening.

### 4. Literature Screening

- **WHAT:** Deduplicate and screen sources against explicit inclusion/exclusion criteria.
- **INPUTS:** candidate sources and screening protocol. **OUTPUTS:** included/excluded records with reasons and screening decisions.
- **REQUIRED AGENTS:** Screening Agent, Literature Agent, Research Critic. **TOOLS:** screening/dedup/reference tools. **INTEGRATIONS:** reference/systematic-review tools optional.
- **RDT OBJECTS UPDATED:** Literature set, Evidence candidates, screening decisions.
- **VALIDATION:** criteria consistency, duplicate handling, reviewer disagreement, source status. **HUMAN APPROVAL:** resolve material screening conflicts.
- **FAILURE CONDITIONS:** no viable corpus, biased/incomplete criteria, unresolved conflicts. **NEXT STATE:** Research Gap Verification or return to Discovery.

### 5. Research Gap Verification

- **WHAT:** Test whether the proposed gap is supported by screened literature and remains current.
- **INPUTS:** proposed gap, included literature, evidence extractions. **OUTPUTS:** supported/rejected/revision-needed gap rationale with evidence and limitations.
- **REQUIRED AGENTS:** Literature, Evidence, Research Gap Agents, Research Critic. **TOOLS:** evidence synthesis, Evidence-to-Claim Graph, Compiler. **INTEGRATIONS:** scholarly/retraction metadata.
- **RDT OBJECTS UPDATED:** ResearchGap, EvidenceClaim, ClaimEvidenceLink.
- **VALIDATION:** claim↔evidence, contrary evidence, recency/coverage. **HUMAN APPROVAL:** approve the research gap framing.
- **FAILURE CONDITIONS:** unsupported/obsolete gap or unresolved contrary evidence. **NEXT STATE:** Theory Selection or revise Problem/Discovery.

### 6. Theory Selection

- **WHAT:** Compare theories for explanatory fit, scope, assumptions, and evidence support.
- **INPUTS:** verified gap, RQs, corpus. **OUTPUTS:** theory candidates and selected proposed framework with rationale.
- **REQUIRED AGENTS:** Theory Agent, Evidence Agent, Research Critic. **TOOLS:** comparison and graph tools. **INTEGRATIONS:** scholarly sources.
- **RDT OBJECTS UPDATED:** Theory, ConceptualFramework, support links.
- **VALIDATION:** theory↔problem/evidence fit and boundary conditions. **HUMAN APPROVAL:** select theory/framework.
- **FAILURE CONDITIONS:** no defensible fit, conflicting assumptions, weak evidence. **NEXT STATE:** Construct & Variable Design.

### 7. Construct & Variable Design

- **WHAT:** Define constructs, variables, roles, indicators, and conceptual relationships.
- **INPUTS:** framework, RQs, evidence. **OUTPUTS:** proposed construct/variable map and definitions.
- **REQUIRED AGENTS:** Methodology Agent, Domain/Theory Agent, Research Critic. **TOOLS:** RDT graph and Compiler. **INTEGRATIONS:** measurement literature sources.
- **RDT OBJECTS UPDATED:** Construct, Variable, Indicator, ConceptualFramework edges.
- **VALIDATION:** variable↔construct and construct↔indicator consistency; source links. **HUMAN APPROVAL:** accept conceptual model.
- **FAILURE CONDITIONS:** ambiguous definitions, unsupported indicator, non-identifiable design. **NEXT STATE:** Hypothesis Development or Research Design for non-hypothesis designs.

### 8. Hypothesis Development

- **WHAT:** Form testable, directional where justified, evidence-grounded hypotheses.
- **INPUTS:** RQs, theory, variables, evidence. **OUTPUTS:** proposed hypotheses and rationale.
- **REQUIRED AGENTS:** Theory, Methodology, Evidence Agents, Research Critic. **TOOLS:** Evidence-to-Claim Graph, Compiler. **INTEGRATIONS:** scholarly sources.
- **RDT OBJECTS UPDATED:** Hypothesis and links to objective/variable/theory/evidence.
- **VALIDATION:** objective↔hypothesis, hypothesis↔variable, support and testability. **HUMAN APPROVAL:** required before accepting/replacing hypotheses.
- **FAILURE CONDITIONS:** unsupported, untestable, redundant, or scope-incompatible hypotheses. **NEXT STATE:** Research Design.

### 9. Research Design

- **WHAT:** Compare and select a methodology/design that answers the RQs.
- **INPUTS:** RQs, hypotheses where applicable, constraints, ethics/data feasibility. **OUTPUTS:** proposed design, method, validity strategy, and alternatives.
- **REQUIRED AGENTS:** Methodology Agent, specialist agent, Research Critic. **TOOLS:** methodology rules/Compiler. **INTEGRATIONS:** standards/guidelines where available.
- **RDT OBJECTS UPDATED:** Methodology, DataCollection design, Ethics requirements.
- **VALIDATION:** method↔RQ/data/analysis fit and ethical feasibility. **HUMAN APPROVAL:** mandatory for selecting/changing methodology.
- **FAILURE CONDITIONS:** infeasible, unethical, or inconsistent design. **NEXT STATE:** Sampling.

### 10. Sampling

- **WHAT:** Define population, frame, technique, inclusion/exclusion, and justified sample target.
- **INPUTS:** methodology, population proposal, effect/precision assumptions, access constraints. **OUTPUTS:** sampling plan and sample-size rationale.
- **REQUIRED AGENTS:** Sampling/Sample Size Agent, Methodology Agent, Statistical Critic. **TOOLS:** power/sample calculators, Compiler. **INTEGRATIONS:** none required.
- **RDT OBJECTS UPDATED:** Population, Sampling, Sample and assumptions.
- **VALIDATION:** sample↔method/analysis, transparent assumptions, feasibility. **HUMAN APPROVAL:** mandatory for population/sample changes.
- **FAILURE CONDITIONS:** unsupported ideal sample, inaccessible frame, inadequate power/saturation plan. **NEXT STATE:** Operationalization.

### 11. Operationalization

- **WHAT:** Map constructs/variables to measurable definitions and indicators.
- **INPUTS:** variable map, methodology, measurement evidence. **OUTPUTS:** operational definitions, measurement scale/source, coding plan.
- **REQUIRED AGENTS:** Methodology and Instrument Agents, Evidence Agent. **TOOLS:** Compiler, reference tools. **INTEGRATIONS:** scholarly/measurement sources.
- **RDT OBJECTS UPDATED:** Measurement, Indicator, source relationships.
- **VALIDATION:** variable↔measurement and indicator↔source; cultural/language validity. **HUMAN APPROVAL:** approve adaptation choices.
- **FAILURE CONDITIONS:** missing source, invalid construct coverage, incompatible scale. **NEXT STATE:** Instrument Design.

### 12. Instrument Design

- **WHAT:** Create/adapt instrument, instructions, scoring, pilot, and validation plan.
- **INPUTS:** operationalization, population, collection mode. **OUTPUTS:** versioned draft/final instrument and pilot protocol.
- **REQUIRED AGENTS:** Instrument Agent, Methodology Agent, Ethics/Research Critic. **TOOLS:** document/form tools, Compiler. **INTEGRATIONS:** survey/form provider optional.
- **RDT OBJECTS UPDATED:** Instrument, items, variable links, versions.
- **VALIDATION:** instrument↔variable coverage, source/license, reliability/validity and ethics. **HUMAN APPROVAL:** mandatory before modifying a final instrument.
- **FAILURE CONDITIONS:** unlicensed items, missing consent, invalid coverage. **NEXT STATE:** Data Collection.

### 13. Data Collection

- **WHAT:** Execute approved protocol with consent, access, lineage, and incident tracking.
- **INPUTS:** approved instrument/protocol/sample/ethics state. **OUTPUTS:** collection records and immutable raw dataset version.
- **REQUIRED AGENTS:** Data Steward and Methodology Agent; humans execute governed collection. **TOOLS:** collection/import/audit tools. **INTEGRATIONS:** survey/storage/transcription providers as approved.
- **RDT OBJECTS UPDATED:** DataCollection, Sample realization, Dataset version, consent/lineage references.
- **VALIDATION:** protocol adherence, consent, completeness, security. **HUMAN APPROVAL:** launch collection and any deviation; dataset publication is separately gated.
- **FAILURE CONDITIONS:** missing approval/consent, security incident, protocol breach. **NEXT STATE:** Data Preparation or remediation.

### 14. Data Preparation

- **WHAT:** Profile, clean, transform, code, anonymize, and document data without overwriting raw input.
- **INPUTS:** immutable raw dataset and preparation plan. **OUTPUTS:** derived dataset version, data dictionary, transformation log, quality report.
- **REQUIRED AGENTS:** Data Steward, Analysis Agent. **TOOLS:** data-quality/transformation tools. **INTEGRATIONS:** approved analysis/storage provider optional.
- **RDT OBJECTS UPDATED:** Dataset versions, transformation lineage, quality validations.
- **VALIDATION:** reproducibility, missingness/outliers, privacy, schema/label integrity. **HUMAN APPROVAL:** mandatory before overwriting any dataset; preferred flow creates a new version.
- **FAILURE CONDITIONS:** lost lineage, re-identification risk, unexplained deletion/transformation. **NEXT STATE:** Analysis Planning.

### 15. Analysis Planning

- **WHAT:** Predefine analysis for each RQ/hypothesis, assumptions, decisions, and robustness checks.
- **INPUTS:** verified method, sample, variables, prepared-data schema. **OUTPUTS:** versioned analysis plan and hypothesis/RQ mapping.
- **REQUIRED AGENTS:** Analysis Agent, statistical/qualitative specialist, Research Critic. **TOOLS:** Compiler, analysis planning tools. **INTEGRATIONS:** approved analysis provider optional.
- **RDT OBJECTS UPDATED:** AnalysisPlan and mappings.
- **VALIDATION:** method/data/sample/analysis fit and complete hypothesis/RQ coverage. **HUMAN APPROVAL:** accept final analysis plan.
- **FAILURE CONDITIONS:** unsupported method, unmet assumptions without remedy, outcome switching. **NEXT STATE:** Analysis.

### 16. Statistical / Qualitative Analysis

- **WHAT:** Execute pinned plan against pinned dataset using reproducible settings.
- **INPUTS:** analysis plan, dataset version, environment/tool versions. **OUTPUTS:** immutable AnalysisRun, diagnostics, estimates/themes/models, artifacts and logs.
- **REQUIRED AGENTS:** Analysis Agent and appropriate Statistical/Qualitative Critic. **TOOLS:** approved statistical/qualitative engines. **INTEGRATIONS:** analysis providers only through Integration Gateway.
- **RDT OBJECTS UPDATED:** AnalysisRun, Result candidates, lineage links.
- **VALIDATION:** assumptions, convergence/coding audit, reproducibility, plan deviations. **HUMAN APPROVAL:** approve deviations; mandatory before replacing final analysis.
- **FAILURE CONDITIONS:** tool failure, invalid assumptions, irreproducible run, data mismatch. **NEXT STATE:** Result Interpretation or revise plan/data.

### 17. Result Interpretation

- **WHAT:** Convert valid outputs into bounded findings without overstating causality or certainty.
- **INPUTS:** analysis runs, diagnostics, RQs/hypotheses. **OUTPUTS:** results, findings, uncertainty and limitations.
- **REQUIRED AGENTS:** Analysis Agent, Research Critic. **TOOLS:** Evidence-to-Claim Graph, Compiler. **INTEGRATIONS:** none required.
- **RDT OBJECTS UPDATED:** Result, Finding, ClaimAnalysisLink.
- **VALIDATION:** result↔hypothesis/RQ, numerical/qualitative fidelity, claim scope. **HUMAN APPROVAL:** approve interpreted findings.
- **FAILURE CONDITIONS:** unsupported causal claim, selective reporting, unresolved diagnostics. **NEXT STATE:** Discussion.

### 18. Discussion

- **WHAT:** Relate findings to questions, theory, prior evidence, contributions, limitations, and alternatives.
- **INPUTS:** verified findings, theory, literature/evidence. **OUTPUTS:** discussion claims and structured argument.
- **REQUIRED AGENTS:** Writing, Evidence, Theory Agents, Research Critic. **TOOLS:** Evidence-to-Claim Graph, Compiler. **INTEGRATIONS:** scholarly/retraction sources.
- **RDT OBJECTS UPDATED:** Discussion, EvidenceClaim, theory/result links.
- **VALIDATION:** discussion↔result/theory/evidence; contrary evidence and limitations. **HUMAN APPROVAL:** approve interpretive argument.
- **FAILURE CONDITIONS:** unsupported extrapolation, stale evidence, contradiction. **NEXT STATE:** Academic Writing.

### 19. Academic Writing

- **WHAT:** Render project state into a versioned manuscript using target-appropriate structure and citations.
- **INPUTS:** RDT entities, verified claim graph, document template. **OUTPUTS:** manuscript version, tables/figures, citations/references.
- **REQUIRED AGENTS:** Writing and Citation Agents, Research Critic. **TOOLS:** writing/file/citation tools. **INTEGRATIONS:** reference manager optional.
- **RDT OBJECTS UPDATED:** Document, Citation, Reference, claim-location links.
- **VALIDATION:** no unsupported major claims, citation integrity, section completeness, academic-integrity policy. **HUMAN APPROVAL:** mandatory before replacing final manuscript.
- **FAILURE CONDITIONS:** fabricated citation, missing provenance, plagiarism/integrity issue. **NEXT STATE:** Research Compiler.

### 20. Research Compiler

- **WHAT:** Run full rule pack over a pinned RDT/manuscript/evidence snapshot.
- **INPUTS:** current RDT version, rule pack, journal requirements if selected. **OUTPUTS:** compiler run, issues, coverage, Research Health projection.
- **REQUIRED AGENTS:** Research Compiler, domain critics where judgment is required. **TOOLS:** Consistency Engine. **INTEGRATIONS:** metadata/retraction/journal sources as applicable.
- **RDT OBJECTS UPDATED:** ResearchValidation, ResearchIssue, ResearchHealth.
- **VALIDATION:** structural, methodological, evidence, statistical, citation, ethics, publication consistency. **HUMAN APPROVAL:** review warnings/unknowns and any override; compiler cannot self-approve research.
- **FAILURE CONDITIONS:** `ERROR`, `BLOCKED`, insufficient coverage, stale snapshot. **NEXT STATE:** remediation loop or Publication Intelligence.

### 21. Publication Intelligence

- **WHAT:** Translate project characteristics into publication constraints and target strategy.
- **INPUTS:** compiler output, scope, field, article type, access/cost/time constraints. **OUTPUTS:** publication profile and target criteria.
- **REQUIRED AGENTS:** Publication Agent, Research Critic. **TOOLS:** publication intelligence tools. **INTEGRATIONS:** journal/index metadata.
- **RDT OBJECTS UPDATED:** Publication profile and constraints.
- **VALIDATION:** metadata freshness, indexing/policy provenance, predatory-risk signals. **HUMAN APPROVAL:** confirm constraints.
- **FAILURE CONDITIONS:** stale/unverified venue data or incompatible requirements. **NEXT STATE:** Journal Matching.

### 22. Journal Matching

- **WHAT:** Compare venues using evidence-backed fit, requirements, risk, cost, and timing.
- **INPUTS:** publication profile, manuscript, journal metadata. **OUTPUTS:** ranked candidates with rationale, evidence, confidence, assumptions.
- **REQUIRED AGENTS:** Journal Matching and Publication Agents. **TOOLS:** comparison/Compiler. **INTEGRATIONS:** journal/index/policy providers.
- **RDT OBJECTS UPDATED:** PublicationTarget candidates, CandidateEvaluation.
- **VALIDATION:** source/date for each claim; no guaranteed acceptance. **HUMAN APPROVAL:** mandatory to select/change publication target.
- **FAILURE CONDITIONS:** unverifiable status/fees/indexing, scope mismatch. **NEXT STATE:** Publication Readiness.

### 23. Publication Readiness

- **WHAT:** Validate manuscript and package against selected target and current research state.
- **INPUTS:** target, manuscript, compiler run, disclosures/ethics/data policies. **OUTPUTS:** readiness result and remediation checklist.
- **REQUIRED AGENTS:** Publication, Citation, Integrity Agents, Research Compiler. **TOOLS:** requirement checker/Compiler. **INTEGRATIONS:** journal-policy metadata.
- **RDT OBJECTS UPDATED:** ResearchValidation, ResearchIssue, Publication readiness state.
- **VALIDATION:** target requirements, claim verification, files, ethics, authorship/disclosures. **HUMAN APPROVAL:** attest final readiness.
- **FAILURE CONDITIONS:** blocking issue, stale requirement, unresolved evidence/ethics. **NEXT STATE:** Submission Preparation or remediation.

### 24. Submission Preparation

- **WHAT:** Assemble files, metadata, cover material, checklists, and a transparent handoff preview.
- **INPUTS:** ready manuscript, target requirements, author-approved metadata. **OUTPUTS:** versioned submission package and manifest.
- **REQUIRED AGENTS:** Publication and Writing Agents. **TOOLS:** file conversion/manifest/checksum tools. **INTEGRATIONS:** none required until handoff.
- **RDT OBJECTS UPDATED:** Submission draft, Document versions, package manifest.
- **VALIDATION:** package completeness, checksum, target metadata, sensitive-data check. **HUMAN APPROVAL:** approve final package.
- **FAILURE CONDITIONS:** missing file/author consent, metadata conflict, outdated manuscript. **NEXT STATE:** Official Submission Handoff.

### 25. Official Submission Handoff

- **WHAT:** Hand control to the official destination through a guided link/export or authorized API-supported action.
- **INPUTS:** approved package, target, authenticated user. **OUTPUTS:** handoff receipt/status and immutable audit event.
- **REQUIRED AGENTS:** Publication Agent (assistive only). **TOOLS:** Publication Gateway. **INTEGRATIONS:** official destination through Integration Gateway when supported.
- **RDT OBJECTS UPDATED:** Submission, handoff status/receipt.
- **VALIDATION:** target identity, current approval, payload preview, authorization. **HUMAN APPROVAL:** mandatory immediately before external submission.
- **FAILURE CONDITIONS:** expired approval, auth/provider failure, payload drift. **NEXT STATE:** Review & Revision; on failure preserve package and offer official guided handoff.

### 26. Review & Revision

- **WHAT:** Record editorial/reviewer decisions, map comments to evidence/state, revise with impact analysis, and recompile.
- **INPUTS:** review decision/comments, submitted version. **OUTPUTS:** response matrix, revised RDT/manuscript/package, compiler result.
- **REQUIRED AGENTS:** Review/Revision, Writing, domain Agents, Research Critic. **TOOLS:** RDT impact, document diff, Compiler. **INTEGRATIONS:** official destination/reference sources as needed.
- **RDT OBJECTS UPDATED:** Review, ResearchChange, Document, affected research entities, Submission version.
- **VALIDATION:** each response traceable; upstream changes propagated; new claims supported. **HUMAN APPROVAL:** protected changes, final revision, and resubmission.
- **FAILURE CONDITIONS:** unaddressed comment, invalidated results, unapproved methodology/data change. **NEXT STATE:** recompile/resubmit or Publication Record.

### 27. Publication Record

- **WHAT:** Record verified external outcome and preserve the research/publication lineage.
- **INPUTS:** official publication/rejection/withdrawal metadata and receipts. **OUTPUTS:** PublicationRecord, identifiers, final artifact links, status history.
- **REQUIRED AGENTS:** Publication Agent for metadata assistance; human confirms ambiguous records. **TOOLS:** metadata verification/audit. **INTEGRATIONS:** DOI/journal/repository metadata.
- **RDT OBJECTS UPDATED:** PublicationRecord, Publication status, final links.
- **VALIDATION:** official-source identity, DOI/metadata, version and license. **HUMAN APPROVAL:** approve public metadata/data release.
- **FAILURE CONDITIONS:** unverifiable outcome, metadata mismatch, unauthorized public data. **NEXT STATE:** maintenance/correction/retraction monitoring.

## Candidate-title comparison subflow

For 2+ titles, Intake creates one `CandidateResearchTopic` per title and triggers Literature, Evidence, Novelty, Feasibility, Methodology, Data Feasibility, Publication Agents, and Research Critic. `CandidateEvaluation` covers Evidence Availability, Novelty, Research Gap Strength, Methodological Feasibility, Data Feasibility, Sample Feasibility, Analysis Fit, Academic Contribution, Publication Potential, and Execution Risk. Every dimension stores rationale, evidence, confidence, and assumptions; missing support is `UNKNOWN`, not a score. Human selection creates the proposed primary Topic and returns to Problem Formulation.

## Next Best Research Action

After every commit/compiler run, the Next Best Research Action Engine may propose the safest high-value next action using current stage, unresolved issues, missing dependencies, evidence state, approvals, and research risk. It returns reason, prerequisites, target objects, expected next state, evidence, confidence, and approval need. It cannot mutate state, submit externally, or create a gamified progress loop.

## Events and recovery

The workflow consumes the official research/publication event set documented by the RDT. All handlers are project-scoped, idempotent, and auditable. Failed external integrations degrade to export/guided handoff where safe. Failed internal steps preserve the last valid RDT version, record `BLOCKED` and recovery conditions, and never hide partial execution behind a success state.

## Related documents

- [End-to-End Research Execution](../architecture/END%20TO%20END%20RESEARCH%20EXECUTION.md)
- [Research Digital Twin](../architecture/RESEARCH%20DIGITAL%20TWIN.md)
- [Research Compiler](../architecture/RESEARCH%20COMPILER.md)
- [Evidence-to-Claim Graph](../internal-engines/EVIDENCE%20TO%20CLAIM%20GRAPH.md)
