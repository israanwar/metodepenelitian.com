# ADR 011 — AI Is Not Source of Truth

**Status:** LOCKED

**Decision:** AI and agent output is always a subordinate, evidence-bearing proposal, never canonical truth. No AI output directly overwrites canonical research state; initial user and AI content is always `PROPOSED`, and a model's confidence cannot itself produce a verified status. Human approval is mandatory for protected changes (methodology, hypotheses, population/sample, final instrument, dataset replacement, final analysis/manuscript, publication target, external submission, research-data publication).

**Context:** Master AI Governance: *"Require agent/model changes to be returned as evidence-bearing proposals for dependency impact, Research Compiler validation, and human approval where protected; no AI output directly overwrites canonical research state."* *"Initial user and AI content is `PROPOSED`. A model's confidence cannot produce `SOURCE VERIFIED`, `EVIDENCE VERIFIED`, `METHODOLOGICALLY VERIFIED`, or `ANALYSIS VERIFIED`."* *"AI/agents may propose, explain, and preview protected changes. Human approval is mandatory for methodology, hypotheses, population/sample, final instrument, dataset replacement, final analysis/manuscript, publication target, external submission, and research-data publication."* This is named a P0 governance contract alongside RDT shared context, Research Compiler validation, Evidence-to-Claim traceability, and agent proposal boundaries.

**Rationale:** Academic-integrity risk — hallucinated citations, fabricated statistics, unearned authority attached to a model's fluent output — is unacceptable at any product stage for a platform whose entire value proposition is trustworthy research infrastructure. The only way to make that risk structurally bounded, rather than dependent on prompt quality, is to make canonical state mutation impossible for AI to perform directly: AI proposes, the Research Compiler and human review gate, and only an authorized application command mutates state.

**Consequences:**
- Every AI/agent-originated change enters the system as a `PROPOSED` record with evidence, not as a direct write to RDT, evidence, analysis, or document tables.
- Protected decisions require recorded human approval regardless of how confident the model's output appears.
- The Research Compiler may flag inconsistency but may not auto-correct it — correction still requires an approved command (see [ADR 003](ADR%20003%20RESEARCH%20DIGITAL%20TWIN%20AS%20CANONICAL%20STATE.md)).

**Constraints:** This ADR fixes the authority boundary between AI and canonical state; it does not fix which specific agents exist in P0 — the P0 sequence limits Phase 9 to exactly three agents (Research Planning, Literature/Evidence, Methodology) and forbids additional agents from entering P0.

**Source of Truth:** [Master AI Governance](../MASTER%20AI%20GOVERNANCE.md) — Sections on agent proposals, status vocabulary, and protected-change approval (P0 governance contracts). [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) — Locked Invariant #4, Phase 8, Phase 9. [P0 Implementation Gates](../implementation/P0%20IMPLEMENTATION%20GATES.md) — Gate F.

**Supersedes:** None.

**Superseded By:** None.
