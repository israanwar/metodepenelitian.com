# Observability & Deployment

## Purpose
This document defines how MetodePenelitian.com is deployed as a modular monolith with separated async workers, and how the platform team sees what is happening inside it — logs, metrics, traces, and alerts — well enough to operate it responsibly, including detecting when an internal engine has silently fallen into degraded mode (Core Contract #11). It exists so that every module's own Observability section can point here for the shared instrumentation model instead of inventing one per module.

## Scope
Covers deployment topology (single deployable monolith plus separate background job workers, per Core Contract #10's modular-monolith baseline), environment strategy, the logging/metrics/tracing conventions every module follows, alerting principles, and the boundary at which a module would ever be extracted into its own service. Does not cover feature-flag-gated rollout mechanics (that is [37 FEATURE FLAGS EXPERIMENTATION.md](37%20FEATURE%20FLAGS%20EXPERIMENTATION.md)) and does not cover the admin console used to act on what observability surfaces (that is [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md)).

## Responsibilities
- Define the deployment unit: one modular-monolith application process (or horizontally scaled replicas of it) for request handling, plus separately deployed and scaled background job workers for anything async (Core Contract #8), sharing the same codebase and module boundaries.
- Define environment strategy (local, staging, production) and what parity between them is required before a change ships.
- Define the shared logging, metrics, and tracing conventions every module must emit (structured logs, per-module metric namespacing, request/job trace propagation) so cross-module debugging is possible without bespoke tooling per module.
- Define alerting principles: what counts as page-worthy (P0 outage, security-relevant anomaly) versus dashboard-worthy (degraded-but-functional state, quota pressure).
- Define the explicit, evidence-based criteria for extracting any module out of the monolith into its own service, per Core Contract #10 — this is the operational half of that contract, complementing the architectural half stated in [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md) and [02 RESEARCH CORE.md](02%20RESEARCH%20CORE.md).

## Non-Responsibilities
- Does not own any module's business logic or what it chooses to log — only the shared conventions and infrastructure for logging/metrics/tracing.
- Does not own feature flag rollout percentages or experiment assignment — that is [37 FEATURE FLAGS EXPERIMENTATION.md](37%20FEATURE%20FLAGS%20EXPERIMENTATION.md), though flag-driven deploys use this document's environment strategy.
- Does not own the specific cloud provider, hosting platform, or infrastructure-as-code tooling — those choices are UNKNOWN at this architecture-only stage and must not be asserted here.
- Does not own admin action auditing — that is [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md), even though both consume similar underlying telemetry.

## Core Components
- **Deployment Topology** — the request-serving monolith and the async job worker pool as the two deployable units, scaled independently of each other since job workers carry the heavy/long-running load per Core Contract #8.
- **Structured Logging Convention** — a shared log schema (module name, request/job id, tenant id where applicable, severity) every module emits through.
- **Metrics Pipeline** — per-module counters/histograms (latency, error rate, queue depth) aggregated under a consistent namespace, so each module's own Observability section maps directly onto real dashboards.
- **Distributed Tracing** — request and background-job trace propagation across module boundaries, including across the AI Gateway and Integration Gateway calls, so a slow request can be attributed to the right hop.
- **Alerting Policy** — the page-vs-dashboard classification and the on-call routing it implies.
- **Service Extraction Criteria** — documented thresholds (sustained load, independent scaling need, team ownership boundary) that would justify pulling a module out of the monolith, per Core Contract #10.

## Owned Data
| Entity | Notes |
|---|---|
| `LogEvent` | Structured log record, not treated as long-term source of truth — operational/telemetry data, retained on a rolling window. |
| `MetricSeries` | Time-series operational metric per module/namespace. |
| `TraceSpan` | Per-hop trace data for a request or background job. |
| `AlertRule` | Definition of a page-worthy or dashboard-worthy condition and its routing. |
| `DeploymentRecord` | What version of the monolith and worker pool is running in each environment. |

## Inputs
- Every module's own emitted logs, metrics, and trace spans, following the shared conventions this document defines.
- Deployment events (a new version shipped to an environment).
- Alert rule definitions authored by engineering, informed by each module's stated Failure Modes sections.

## Outputs
- Dashboards and alerts consumed by the platform team.
- Trace data usable for cross-module incident debugging, including tracing a request through Research Core, the Project Context Engine, the AI Gateway, and back.
- Deployment status feeding [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md)'s operator console for visibility into what is currently running.

## Dependencies
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) for the modular-monolith baseline and module boundary contract this deployment model implements.
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md) for the module registry/event bus this observability layer must be able to trace across.
- [05 MULTI MODEL AI GATEWAY.md](05%20MULTI%20MODEL%20AI%20GATEWAY.md) and [25 INTEGRATION GATEWAY.md](25%20INTEGRATION%20GATEWAY.md) as the two boundaries whose degraded-mode behavior (Core Contract #11) this document must make observable.
- Every internal engine, each of which is expected to emit metrics following this document's conventions rather than inventing its own.

## Extension Points
- New modules automatically fit the logging/metrics/tracing conventions by following the shared schema — no per-module observability infrastructure needs to be built.
- New alert rules can be added per module as its own Failure Modes are better understood in production, without changing the alerting pipeline itself.
- The Service Extraction Criteria can be evaluated per module independently; extracting one module does not require re-architecting the rest.

## Security & Privacy
- Logs and traces must not contain raw research content or PII by default — structured logging conventions require redaction/reference-by-id (e.g. log a `ResearchProject` id, not its title or content) rather than embedding sensitive payloads in telemetry, consistent with [32 SECURITY PRIVACY.md](32%20SECURITY%20PRIVACY.md).
- Access to production logs/traces/metrics is itself an operator privilege governed by [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md)'s role model, not open to every engineer by default.
- Alert payloads follow the same no-sensitive-content rule as logs, since alerts often route to third-party paging tools.

## Failure Modes
- **Observability pipeline itself degraded (metrics/logging outage)**: the platform continues serving requests — observability is explicitly not a hard dependency of the request path — but the team operates blind until it recovers, which is itself treated as an incident.
- **Missing trace propagation across a module boundary**: treated as a documentation/instrumentation defect in that module, since it breaks the cross-module debugging this document promises.
- **Alert fatigue from over-broad page-worthy classification**: addressed by periodically re-triaging `AlertRule` severity against actual on-call outcomes, not by ignoring alerts.
- **Job worker pool falling behind queue depth**: surfaced as a dashboard-worthy signal first; escalates to page-worthy only past a sustained backlog threshold, since transient backlog is expected under Core Contract #8's async design.

## Observability
This document is itself the definition of the platform's observability model; recursively, its own health is tracked via: pipeline ingestion success rate, dashboard/query latency, and alert delivery success rate to on-call tooling.

## P0/P1/P2/P3
**P0.** Operating any production system safely requires knowing when it is broken or degraded; without this, Core Contract #11's degraded-but-functional requirement cannot even be verified, let alone guaranteed.

## Current Status
Documented, not implemented. No logging pipeline, metrics system, tracing infrastructure, or deployment automation exists yet. No hosting/cloud provider has been selected.

## Open Questions
- Hosting/cloud provider and infrastructure-as-code approach — UNKNOWN, not yet decided.
- Specific logging/metrics/tracing vendor or self-hosted stack — UNKNOWN, not yet evaluated.
- Log/metric retention windows, balancing debugging usefulness against storage cost and the no-sensitive-content redaction rule.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [01 PLATFORM CORE.md](01%20PLATFORM%20CORE.md)
- [32 SECURITY PRIVACY.md](32%20SECURITY%20PRIVACY.md)
- [35 ADMIN GOVERNANCE.md](35%20ADMIN%20GOVERNANCE.md)
- [37 FEATURE FLAGS EXPERIMENTATION.md](37%20FEATURE%20FLAGS%20EXPERIMENTATION.md)
