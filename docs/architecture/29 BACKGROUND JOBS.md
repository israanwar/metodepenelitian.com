# Background Jobs

## Purpose
Background Jobs is the async execution layer for anything too slow or too heavy to run inline on a request (Core Contract #8). It exists so that a researcher's request never blocks on document parsing, dataset processing, AI-heavy reasoning, or file conversion — the request returns quickly with an accepted/queued acknowledgment, and the actual work happens on a worker, reporting back via an event or notification when done.

## Scope
Covers the job queue, worker execution model, and the categories of work routed through it. Does not cover the specific business logic of any individual job type (e.g. how dataset processing actually analyzes data — that belongs to Dataset & Analysis; how document parsing extracts text — that belongs to Research File Tools) and does not cover the domain-event propagation that jobs may trigger on completion (that is [Event Bus & Workflows](./30%20EVENT%20BUS%20WORKFLOWS.md), which is a distinct mechanism from job dispatch).

## Responsibilities
- Provide the Job Queue and worker pool that every long-running or heavy task in the Research OS dispatches to, rather than running inline in the request/response cycle.
- Route specific job categories through this layer: AI long-running tasks, document parsing, PDF extraction, dataset processing, file conversion, embedding generation, metadata synchronization, citation refresh, publication verification, transactional email, and exports.
- Enforce per-job isolation: no shared filesystem state between different tenants' jobs, and enforced timeouts so one runaway job cannot starve the worker pool.
- Report job outcome (success, failure, partial result) back to the originating module via an event or direct callback, never leaving the request that triggered the job without an eventual resolution signal.
- Support retry with backoff for jobs that fail due to a transient dependency (e.g. a provider call inside a job hitting a rate limit via the Integration Gateway).

## Non-Responsibilities
- Does not decide what a job actually does — job logic belongs to the owning domain module (Dataset & Analysis owns statistical execution logic, Research File Tools owns parsing/conversion logic); this layer only provides the dispatch, isolation, and lifecycle machinery.
- Does not perform domain-event pub/sub for module-to-module state propagation unrelated to job completion — that is Event Bus & Workflows, a separate mechanism this layer may emit into but does not own.
- Does not call third-party providers directly from job code without going through the Integration Gateway — a job is still application code and is bound by Core Contract #4 like any other caller.
- Does not provide long-term durable storage for job results — a job's output is written to the appropriate authoritative store (relational database or object storage, per [Data Storage](./27%20DATA%20STORAGE.md)); the Job Queue itself is transient.

## Core Components
- **Job Queue** — the durable dispatch mechanism (backed by the queue store defined in Data Storage) holding pending and in-flight job records.
- **Worker Pool** — the execution environment(s) that pull jobs off the queue and run them, isolated per job (and, for statistical execution, per Dataset & Analysis's isolated Python/R execution requirement).
- **Job Lifecycle Tracker** — tracks each job's state (queued, running, succeeded, failed, retrying) and exposes it back to the module that enqueued it.
- **Retry/Backoff Controller** — applies exponential backoff and a bounded retry count for jobs failing on transient conditions, distinguishing those from jobs that fail deterministically (which are not retried blindly).

## Owned Data
| Entity | Notes |
|---|---|
| Job | queued unit of work: type, payload reference, owning module, tenant/project scope |
| JobRun | one execution attempt of a Job, with state, timing, and outcome |
| JobResult | pointer to where the job's actual output was persisted (relational record id or object storage asset id) — not the output itself |

## Inputs
- Enqueue requests from any Application Service that needs heavy or long-running work performed (Dataset & Analysis, Research File Tools, Submission Orchestration's package formatting, the AI Gateway's long-running reasoning tasks).
- Job payloads referencing the data to operate on (e.g. a dataset id, a document id), not embedding large content directly in the queue.

## Outputs
- Job state transitions consumed by the originating module (e.g. Submission Orchestration polling or subscribing to a package-formatting job's completion).
- Job-completion events, which may be published onto the [Event Bus](./30%20EVENT%20BUS%20WORKFLOWS.md) for modules other than the direct caller to react to (e.g. a completed embedding-generation job the Project Context Engine cares about).
- Persisted results in the appropriate authoritative store, referenced by `JobResult`.

## Dependencies
- [Data Storage](./27%20DATA%20STORAGE.md) for the Job Queue's backing store and for where job results are ultimately persisted.
- [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md) for any job that needs to call a third-party provider.
- [Event Bus & Workflows](./30%20EVENT%20BUS%20WORKFLOWS.md) as an optional downstream propagation path for job-completion events.
- Consumed by [Submission Orchestration](./24%20SUBMISSION%20ORCHESTRATION.md) for package formatting, and by any module with heavy processing needs.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 22.

## Extension Points
- A new job type is added by defining its payload shape and registering a worker handler — the Job Queue, Worker Pool, and Lifecycle Tracker require no changes for a new job category to be introduced.
- Job priority tiers (e.g. interactive-adjacent jobs needing faster turnaround than batch-style metadata sync) can be layered onto the existing queue without changing the dispatch contract.
- A future dedicated message broker (replacing a Redis-backed queue) can be swapped in behind the same Job Queue interface without changing any calling module's enqueue contract.

## Security & Privacy
- Workers are sandboxed per job with no shared filesystem state between tenants' jobs — a job processing one researcher's dataset must never have residual access to another's data.
- Enforced timeouts prevent a single job from monopolizing worker capacity, which is both a reliability and a fairness/privacy-adjacent control (no tenant's heavy job should degrade another tenant's turnaround).
- Job payloads referencing private project content are subject to the same private-by-default access rules (Core Contract #9) as the data itself — a job record is not a backdoor around project-scoped authorization.
- Statistical execution jobs (R/Python) run in isolated execution environments specifically because they execute researcher-influenced code/scripts against data, and must not have network or filesystem access beyond what that specific job legitimately needs.

## Failure Modes
- **Job failure (deterministic)**: surfaced immediately to the originating module with a specific error, not silently retried, since retrying a deterministic failure wastes resources without changing the outcome.
- **Job failure (transient)**: retried with exponential backoff up to a bounded limit, then surfaced as failed if retries are exhausted — the caller is always informed of final state, never left in permanent "queued" limbo.
- **Worker pool exhaustion**: new jobs queue rather than being dropped; if queue depth grows unboundedly, this is an operational alert condition, not a silent degradation.
- **Runaway job exceeding timeout**: forcibly terminated, marked failed, and does not block other jobs in the pool.

## Observability
- Queue depth and age of oldest pending job, per job type.
- Job success/failure rate and average duration, per job type.
- Retry rate and final-failure rate after retries exhausted.
- Worker pool utilization and timeout-termination frequency.

## P0/P1/P2/P3
**P0.** This layer is foundational: without it, any heavy operation (dataset analysis, document parsing, AI-heavy reasoning) would have to run inline on a request, directly violating Core Contract #8 and creating request-timeout and reliability problems across nearly every other module the moment real workloads arrive.

## Current Status
Documented, not implemented. No Job Queue, Worker Pool, or job schema exists in code; this document defines the intended async-execution boundary ahead of implementation.

## Open Questions
- Whether the Job Queue is backed by the same Redis instance used for caching (Data Storage's Cache row) or a dedicated broker, and what the tradeoffs are for this platform's expected job volume.
- How job priority is determined when multiple job types compete for limited worker capacity (e.g. an interactive AI task versus a large batch metadata sync).
- Whether statistical execution (R/Python) jobs need a fundamentally different worker isolation model (e.g. per-job containers) than lighter jobs like PDF text extraction.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [Data Storage](./27%20DATA%20STORAGE.md)
- [Event Bus & Workflows](./30%20EVENT%20BUS%20WORKFLOWS.md)
- [Submission Orchestration](./24%20SUBMISSION%20ORCHESTRATION.md)
- [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md)
