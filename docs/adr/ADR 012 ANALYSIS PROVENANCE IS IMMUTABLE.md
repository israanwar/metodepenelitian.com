# ADR 012 — Analysis Provenance Is Immutable

**Status:** LOCKED

**Decision:** Every `AnalysisRun` is an immutable execution: it pins an approved `AnalysisPlan` and immutable dataset/source versions, and its contents cannot be edited after the fact. A rerun or correction produces a new run and a supersession edge, never a mutation of the original. Analysis results separate immutable engine output, normalized structured results, validation, interpretation, and downstream provenance so every academic claim/value can be reconstructed to its source.

**Context:** [database/ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md): *"Immutable execution with minimum required fields... A run pins an approved plan and immutable dataset/source versions... Run contents are immutable; rerun/correction produces a new run and supersession edge. Qualitative AI proposals require human review and immutable quotation/source traceability."* [database/ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md): *"This model separates immutable engine output, normalized structured results, validation, interpretation, and downstream provenance so every academic claim/value can be reconstructed to its source."* Master Backend Architecture Section 31 names the immutable Dataset/AnalysisRun/Result Provenance backbone directly as a P0 component alongside RDT and the Research Compiler.

**Rationale:** A research platform's statistical output is only trustworthy if every number in a manuscript can be traced back to the exact engine, version, parameters, and input dataset that produced it. If a run's inputs, parameters, or outputs could be edited in place, that traceability collapses and "the analysis matches the paper" becomes unverifiable — precisely the fabrication risk Phase 10-11 of the P0 sequence exists to close. Immutability plus explicit supersession is the only model that keeps correction possible without destroying the historical record.

**Consequences:**
- No application code may update an `AnalysisRun`'s parameters, engine version, input reference, or result in place; correction always creates a new run.
- Every reported statistic in interpretation or manuscript content must resolve to a pinned `AnalysisRun` and its input dataset version — a value without that lineage is a defect, not an acceptable shortcut.
- Raw dataset versions are equally immutable; remapping or reclassification creates a new derived version rather than silently rewriting the raw one.

**Constraints:** This ADR fixes immutability and provenance of analysis execution; it does not fix which analysis methods or engines are implemented in P0 — the P0 sequence deliberately scopes Phase 10 to one narrow validated analysis capability, not a full SPSS/SmartPLS replacement.

**Source of Truth:** [database/ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md). [database/ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md). [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 31. [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) — Locked Invariant #6, Phase 10. [P0 Implementation Gates](../implementation/P0%20IMPLEMENTATION%20GATES.md) — Gate G.

**Supersedes:** None.

**Superseded By:** None.
