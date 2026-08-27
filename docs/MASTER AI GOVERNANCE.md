# MASTER AI GOVERNANCE

## Purpose
This document governs how MetodePenelitian.com uses AI across the entire Research OS: which providers and models are permitted, how requests are routed and evaluated, how evidence is grounded and hallucination is controlled, how cost and quota are managed, and how academic-integrity safety is enforced. It is the single governing document for everything under `docs/ai/` and the parent reference for any component that calls an AI model anywhere in the platform.

## Scope
In scope: provider/model governance, routing policy, fallback behavior, cost and quota accounting, evaluation and quality assurance for AI outputs, citation grounding and hallucination control, prompt governance, tool-permission rules for AI agents, Compare Mode, BYOK (Bring Your Own Key) policy, and academic-integrity safety rules for AI-assisted work. Out of scope: the internal reasoning logic of individual advisor engines (Methodology Advisor, Analysis Advisor, Evidence Synthesis, etc. — see [Internal Engines](internal-engines/) docs), the mechanics of scholarly data ingestion (see Literature & Evidence in [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) Section 11), and non-AI integrations (see [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md)).

## Responsibilities
- Define the single point of control (Multi-Model AI Gateway) through which every AI model call in the platform must pass — no engine, workflow, or admin surface calls a provider directly.
- Own the governance rules that the 14 child documents under `docs/ai/` implement in detail: which providers/models are approved, how tasks are classified and routed, how failures are absorbed, how cost is metered and capped, how output quality is evaluated, how hallucination and ungrounded citation are detected and blocked, how prompts are versioned, how AI tool-calling is authorized, how Compare Mode and BYOK operate, and how academic-integrity rules are enforced.
- Guarantee that every AI-assisted output touching evidence claims is traceable back to a real `ResearchReference` or knowledge-base source, or is explicitly flagged as unverified.
- Require every research agent and model to consume an authorized, pinned projection of the same Research Digital Twin through the Project Context Engine; agent is not model, and neither may maintain a silo canonical database.
- Require agent/model changes to be returned as evidence-bearing proposals for dependency impact, Research Compiler validation, and human approval where protected; no AI output directly overwrites canonical research state.
- Guarantee graceful degradation: internal engines keep producing usable, clearly-labeled degraded output when a preferred provider is unavailable, rather than failing the user's workflow outright.
- Set the cost-governance principle: the platform absorbs and tracks provider cost variance internally; users see plan-level entitlements, never raw token/provider cost (except where a plan tier explicitly surfaces it).

## Non-Responsibilities
- Does not implement the actual HTTP/SDK calls to any AI provider — that is the Multi-Model AI Gateway's adapter layer (see [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) Section 9).
- Does not define non-AI third-party integrations (payment, storage, scholarly APIs) — those are governed by the Integration Gateway and [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md).
- Does not define the UX/product framing of AI features (button labels, screens) — that belongs to [MASTER PRODUCT ARCHITECTURE.md](MASTER%20PRODUCT%20ARCHITECTURE.md).
- Does not define general data-retention/classification policy beyond AI-specific provider data-sharing rules — general data governance lives in [MASTER DATA GOVERNANCE.md](MASTER%20DATA%20GOVERNANCE.md).
- Does not itself decide per-request routing at runtime — this document sets policy; the `AIModelRouter` component (owned by the AI Gateway) executes it.

## Core Components
This master document is implemented by 14 child documents under `docs/ai/`, each owning one governance concern in detail:

| Child document | Governs |
|---|---|
| AI PROVIDER REGISTRY | The list of approved AI providers (OpenAI, Anthropic, Gemini, DeepSeek, Mistral, Perplexity, Groq, future candidates), their approval status, and provider-level metadata (data retention policy, region, contractual status). |
| AI MODEL REGISTRY | The list of approved models per provider, versioning, and deprecation lifecycle. |
| AI CAPABILITY MATRIX | Per-model capability metadata — context window, multimodality, structured-output support, tool-calling support, latency class, relative cost tier — used by the router to match task to model. |
| AI ROUTING POLICY | The rules `AIModelRouter` applies to select AUTO-mode models per task type (literature synthesis, statistical reasoning, writing review, etc.), and how explicit user model choice is honored. |
| AI FALLBACK STRATEGY | Ordered fallback chains per task type, circuit-breaker thresholds, and degraded-mode behavior when a provider is unhealthy. |
| AI COST QUOTA | How `AICostTracker`/`AIUsageMeter`/`AIQuotaManager` account for token/request cost internally and enforce plan entitlements. |
| AI EVALUATION FRAMEWORK | How AI output quality is measured on an ongoing basis (offline eval sets, sampling, human review loops, regression checks on prompt/model changes). |
| AI HALLUCINATION CONTROL | Detection heuristics and blocking rules for unverifiable or fabricated claims. |
| AI CITATION GROUNDING | How AI-cited facts are tied back to a resolvable `ResearchReference` or knowledge-base source. |
| AI PROMPT REGISTRY | Versioned system/task prompts, ownership, and change-review process. |
| AI TOOL PERMISSIONS | Which AI tool calls (search, code execution, file read, project-data read) are authorized for which role/plan/project-access combination. |
| AI COMPARE MODE | How one logical request is fanned out to multiple models and the results are structured for comparison, without merging into a single answer. |
| AI BYOK STRATEGY | Bring-your-own-key policy: encryption at rest, scope of use, and the guarantee that BYOK never reaches the frontend or logs. |
| AI SAFETY ACADEMIC INTEGRITY | The academic-integrity-specific safety rules (advisor-not-ghostwriter positioning, AI-content logging, prompt-injection isolation for uploaded documents). |

Each is a detailed child of this master document and must not contradict it. This document states the governing principles; the child documents state the operational detail.

### P0 Research Execution governance

The Research Digital Twin, Research Compiler, and End-to-End Research Execution Pipeline are P0 consumers of this governance. Their binding AI rules are:

- RDT is provider-agnostic canonical state; providers receive only authorized context projections and never own or directly mutate the Twin.
- Every agent invocation is coordinated by Agent Orchestrator and every model call passes through Multi-Model AI Gateway. Frontend-to-provider calls and provider-specific Research Core logic are forbidden.
- Initial user and AI content is `PROPOSED`. A model's confidence cannot produce `SOURCE VERIFIED`, `EVIDENCE VERIFIED`, `METHODOLOGICALLY VERIFIED`, or `ANALYSIS VERIFIED`.
- Evidence-dependent academic claims require declared source state and traceability through the Evidence-to-Claim Graph. When support is insufficient, the outcome is `UNKNOWN`/`BLOCKED`, not an invented source or silent pass.
- Research Compiler may use model-assisted judgment only with pinned RDT/context, rule/prompt/model versions, evidence, confidence, and disagreement preserved. Deterministic checks run first.
- Next Best Research Action is an explainable recommendation, not autonomous execution or gamification.
- AI/agents may propose, explain, and preview protected changes. Human approval is mandatory for methodology, hypotheses, population/sample, final instrument, dataset replacement, final analysis/manuscript, publication target, external submission, and research-data publication.

Detailed boundaries: [Research Digital Twin](architecture/RESEARCH%20DIGITAL%20TWIN.md), [Research Compiler](architecture/RESEARCH%20COMPILER.md), [Evidence-to-Claim Graph](internal-engines/EVIDENCE%20TO%20CLAIM%20GRAPH.md), [Research Execution Agent Contract](agents/RESEARCH%20EXECUTION%20AGENT%20CONTRACT.md), and [Idea-to-Publication Pipeline](workflows/IDEA%20TO%20PUBLICATION%20PIPELINE.md).

### P0 Data-to-Document AI governance

- Raw/row-level datasets and original qualitative sources are not sent automatically to AI providers. Project Context contains authorized metadata/aggregates by default; exceptional content disclosure requires consent-purpose compatibility, minimization, provider-policy eligibility, and explicit user authorization.
- AI may propose variable mappings/preparation, analysis recommendations, qualitative codes/themes, interpretations, discussion, and document prose. Ambiguous mapping, destructive cleaning/exclusion, method/execution, verified interpretation/final-section replacement, and submission retain human gates.
- Statistical computation is performed only by approved deterministic, versioned execution capabilities. AI cannot generate, replace, silently correct, inconsistently round, or fabricate numerical results.
- Every AI-written value/claim/table/figure description resolves through Result Provenance to a validated StructuredResult/QualitativeFinding and immutable AnalysisRun/dataset/source lineage. Missing support is blocked/unknown.
- Quantitative, Qualitative, Mixed Methods, Interpretation, Discussion, Writing, Citation, and Critic Agents use one pinned RDT/Project Context and have no dataset/result/document silo.
- External analysis software is used only through verified interoperability capability (`NATIVE EXECUTION`, `IMPORT`, `EXPORT`, `FILE INTEROPERABILITY`, `API INTEGRATION`, `PARTNERSHIP REQUIRED`, `NOT AVAILABLE`); no API is inferred from product existence.

See [Data → Analysis → Interpretation → Academic Document Pipeline](architecture/DATA%20ANALYSIS%20INTERPRETATION%20DOCUMENT%20PIPELINE.md), [Result Provenance Engine](internal-engines/RESULT%20PROVENANCE%20ENGINE.md), and [Academic Document Engine](internal-engines/ACADEMIC%20DOCUMENT%20ENGINE.md).

## Owned Data
This master document owns no database tables directly. It defines the governance rules that constrain the data owned by the Multi-Model AI Gateway (see [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) Section 9): `AIProvider`, `AIModel`, `AIModelCapability`, `AIRequest`, `AIResponse`, `AIUsage`, `AIRoutingPolicy`. Any new record type introduced by a child document (e.g. an evaluation-run log, a prompt-version table) is owned by that child document, not by this one.

## Inputs
- Product and research requirements for what AI-assisted capabilities the platform must support (from Research AI Architecture and the internal engines).
- Provider capability disclosures and pricing (from each provider's public documentation — see AI PROVIDER REGISTRY for verified specifics).
- Academic-integrity and citation-grounding requirements originating from Section 26 of [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md).
- Plan/entitlement definitions from Billing (Section 27 of the same document) that constrain quota policy.
- Observed provider health/incident data feeding fallback and routing policy revisions.

## Outputs
- The governance rules consumed by `AITaskClassifier`, `AIModelRouter`, `AIFallbackManager`, `AIQuotaManager`, and `AIRequestAudit` at runtime.
- The approval boundary that determines which providers/models any engine is allowed to call.
- The citation-grounding and hallucination-control rules consumed by every AI-assisted advisor engine before output is shown to a user.
- The evaluation criteria used by AI Admin (Section 28) to assess model/prompt changes before rollout.
- The cost/quota policy consumed by Billing & Entitlements.

## Dependencies
- [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) Section 9 (Multi-Model AI Gateway) — the component this document governs.
- [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md) Section 26 (Academic Integrity & AI Safety) — the safety baseline this document extends.
- [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md) — the Integration Gateway that all outbound provider calls, including AI provider calls, must pass through.
- [MASTER DATA GOVERNANCE.md](MASTER%20DATA%20GOVERNANCE.md) — general data classification and privacy rules that AI request/response logging must respect.
- Project Context Engine (see [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md)) — the shared context every AI model reads from and must not bypass.
- Research Digital Twin and Research Compiler — canonical research state and validation consumers; AI governance constrains their model-assisted operations but does not transfer their domain ownership to an AI provider.

## Extension Points
- New providers/models are added by extending AI PROVIDER REGISTRY and AI MODEL REGISTRY — never by adding a direct call from application code.
- New task types are added to AI ROUTING POLICY's classification scheme without changing the Gateway's external contract.
- New evaluation metrics are added to AI EVALUATION FRAMEWORK as the platform learns which failure modes matter most for Indonesian academic research contexts.
- Institution-specific or plan-specific model access tiers are layered onto AI CAPABILITY MATRIX and AI COST QUOTA without changing routing logic itself.
- Future partnership-based providers (e.g. a national research infrastructure AI service) are onboarded through the same registry/adapter mechanism as commercial providers — no special-cased core logic.

## Security & Privacy
- Every AI provider call, including BYOK calls, is proxied through the Multi-Model AI Gateway and, beneath it, the Integration Gateway — no calling code holds a provider credential directly.
- Platform-held and BYOK provider credentials are stored in a secrets vault, encrypted at rest, never logged, and never sent to the frontend.
- Each provider's data-retention/training-use policy is tracked in AI PROVIDER REGISTRY and must be surfaced to the user where it affects their data (e.g. a provider that may retain prompts for training is flagged before being used on private project content, subject to Research project data being private by default).
- Uploaded document content and third-party literature text are treated as untrusted input and processed in an isolated context before being merged into any system-level prompt, per AI SAFETY ACADEMIC INTEGRITY.
- Every AI request is written to an immutable `AIRequestAudit` trail for debugging and compliance review, scoped so that audit access itself respects project-level privacy.

## Failure Modes
- **Provider outage or degraded latency** — absorbed by `AIFallbackManager` rerouting to a healthy alternate per AI FALLBACK STRATEGY; if all providers for a task type are unhealthy, the calling engine must degrade to a reduced-capability mode (e.g. rule-based or cached guidance) rather than error the user's workflow, per Section 11 of [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md).
- **Routing misclassification** — a task routed to a poorly-suited model produces low-quality output without necessarily erroring; caught over time by AI EVALUATION FRAMEWORK sampling, not by real-time detection alone.
- **Hallucinated or ungrounded citation surfaced to a user** — the single most severe failure mode for an academic platform; mitigated by AI HALLUCINATION CONTROL and AI CITATION GROUNDING gating output before display, never relying on the underlying model's own confidence signal alone.
- **Quota/cost runaway** — a routing bug or abusive usage pattern driving provider cost far above plan revenue; mitigated by `AIQuotaManager` enforcement and cost-anomaly alerting defined in AI COST QUOTA.
- **BYOK credential leakage** — mitigated by vault storage and the hard rule that BYOK keys never traverse to frontend code or logs; any leak is treated as a security incident, not a routine bug.
- **Prompt-injection via uploaded documents or fetched literature** — mitigated by the sandboxed-ingestion rule in AI SAFETY ACADEMIC INTEGRITY; failure here could let untrusted content alter system-level AI behavior.

## Observability
- AI latency and AI cost dashboards per provider and per task type (Section 29 of [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md)).
- Provider health/circuit-breaker state surfaced live to AI Admin.
- `AIRequestAudit` queryable by request, project, user, provider, and model for incident investigation.
- Hallucination-flag rate and citation-grounding failure rate tracked as first-class quality metrics, not just uptime metrics.
- Quota/cost-anomaly alerting when a user, project, or org's usage deviates sharply from historical baseline.
- Evaluation-run results (from AI EVALUATION FRAMEWORK) tracked over time so a model or prompt change that regresses quality is visible before wide rollout.

## P0/P1/P2/P3
P0. The Multi-Model AI Gateway and the governance this document sets are foundational — every AI-touching feature in the Research OS depends on the routing, grounding, and safety rules defined here, and academic-integrity risk (hallucinated citations, unearned authority) is unacceptable at any product stage. Research Digital Twin shared context, Research Compiler evidence-aware validation, Evidence-to-Claim traceability, agent proposal boundaries, and human approval gates are P0 governance contracts. The deeper refinements in several child documents (Compare Mode, BYOK, advanced evaluation automation) are P1/P2 individually, but the governance framework itself, and its P0 controls (citation grounding, prompt-injection protection, tool authorization, provider/model registries, routing, fallback), must exist before any AI feature ships.

## Current Status
Documented, not implemented. This document and its 14 child documents under `docs/ai/` describe the intended governance model for an architecture-only phase; no provider integration, routing code, evaluation pipeline, or admin tooling exists yet.

## Open Questions
- Which providers will have a signed data-processing agreement suitable for private Indonesian academic research data before launch — UNKNOWN, requires legal/procurement verification per provider.
- What is the acceptable hallucination-flag false-positive rate before it degrades user trust in Research AI's advisory value — requires empirical evaluation once AI EVALUATION FRAMEWORK is operational.
- Will BYOK be offered at launch or deferred to a later plan tier — depends on Billing & Entitlements roadmap.
- How will Compare Mode's per-model cost be attributed against a user's quota (as one request or as N requests) — requires a decision recorded in AI COST QUOTA.
- What is the institution-tier model access policy for Institution/Enterprise plans (dedicated model allowlists, higher-cost model access) — requires product decision.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER PRODUCT ARCHITECTURE.md](MASTER%20PRODUCT%20ARCHITECTURE.md)
- [MASTER INTEGRATION MAP.md](MASTER%20INTEGRATION%20MAP.md)
- [MASTER DATA GOVERNANCE.md](MASTER%20DATA%20GOVERNANCE.md)
- [Research Digital Twin](architecture/RESEARCH%20DIGITAL%20TWIN.md)
- [Research Compiler](architecture/RESEARCH%20COMPILER.md)
- [Idea-to-Publication Pipeline](workflows/IDEA%20TO%20PUBLICATION%20PIPELINE.md)
- ai/AI PROVIDER REGISTRY.md
- ai/AI MODEL REGISTRY.md
- ai/AI CAPABILITY MATRIX.md
- ai/AI ROUTING POLICY.md
- ai/AI FALLBACK STRATEGY.md
- ai/AI COST QUOTA.md
- ai/AI EVALUATION FRAMEWORK.md
- ai/AI HALLUCINATION CONTROL.md
- ai/AI CITATION GROUNDING.md
- ai/AI PROMPT REGISTRY.md
- ai/AI TOOL PERMISSIONS.md
- ai/AI COMPARE MODE.md
- ai/AI BYOK STRATEGY.md
- ai/AI SAFETY ACADEMIC INTEGRITY.md
</content>
