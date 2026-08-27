# ADR 007 — Async Job Model

**Status:** LOCKED

**Decision:** Any work too slow or too heavy to run inline on a request (AI long-running tasks, document parsing, PDF extraction, dataset processing, file conversion, embedding generation, metadata synchronization, citation refresh, publication verification, email, exports) runs through a dedicated async job/queue/worker layer, never inline in the request/response path. Statistical execution and file conversion specifically run inside isolated, sandboxed workers reached through this same layer.

**Context:** Architectural Principle #9: *"Heavy or slow work runs through the async job system, never inline on a request."* Master Backend Architecture Section 22 defines the flow `API → Job Queue → Worker → Result → Event/Notification` and states: *"Statistical execution (Section 13.3) and file conversion (Section 15) both run inside isolated workers reached through this same layer — never inline in the request/response path."* Security considerations are explicit: *"workers sandboxed per job, no shared filesystem state between tenants' jobs, timeouts enforced."* Priority is stated as P0.

**Rationale:** Research workloads include operations (statistical execution, large file conversion, AI synthesis) whose duration is unpredictable and whose failure must not block or corrupt an HTTP request/response cycle. A synchronous request path cannot safely bound execution time, isolate tenant workloads from each other, or recover cleanly from a crashed worker; a queue/worker model with per-job sandboxing and enforced timeouts is required to make those failure modes safe rather than catastrophic.

**Consequences:**
- No P0 phase may implement a long-running or resource-heavy operation as a synchronous request handler.
- Workers must not share filesystem or process state across tenants/jobs; cross-tenant leakage through a shared worker is a security defect.
- Job outcomes propagate through an event/notification path, not a blocking response — callers must handle pending/async states truthfully rather than fabricating a synchronous success.

**Constraints:** This ADR fixes the async execution boundary, not the specific queue technology — the backing store (Section 21) and library/runtime choice remain open implementation decisions within the owning phase.

**Source of Truth:** [Master Backend Architecture](../MASTER%20BACKEND%20ARCHITECTURE.md) — Section 3 (Principle #9), Section 22. [Master Data Governance](../MASTER%20DATA%20GOVERNANCE.md). [29 Background Jobs](../architecture/29%20BACKGROUND%20JOBS.md). [30 Event Bus Workflows](../architecture/30%20EVENT%20BUS%20WORKFLOWS.md).

**Supersedes:** None.

**Superseded By:** None.
