# Conversion Job Model

**Status:** LOCKED P1 conceptual model — no SQL, queue, API, or worker implementation

## ConversionJob

Minimum conceptual fields:

```text
conversion_job_id
input_asset_id
source_format
target_format
engine
engine_version
execution_mode
parameters
status
started_at
completed_at
output_asset_id
warnings
errors
expires_at
```

Additional fields: owner/project/tenant, requested action, capability/version/status, provider id, route/rationale/version, privacy/license decisions, idempotency/correlation ids, queue/worker/attempt, priority/resource class, requested/created timestamps, progress, validation/fidelity reports, output asset ids, partial/quarantine state, retry/fallback lineage, cancellation, temporary-workspace/cleanup proof, audit reference, and supersession.

## Status model

Canonical job status:

```text
QUEUED
VALIDATING
PROCESSING
COMPLETED
FAILED
EXPIRED
```

Cancellation/partial/fallback are recorded as explicit decision/result metadata or future extension states; they cannot be mislabeled `COMPLETED`. A job completes only after output validation and asset creation. Expiry includes cleanup outcome.

## Supporting models

- `ConversionCapability`: source/target/action, provider/execution modes, limits, validation/fidelity schema, privacy/license eligibility, status `PROPOSED/VERIFIED/REQUIRES TESTING`.
- `ConversionRouteDecision`: inputs (format/size/privacy/browser/server/complexity), selected mode/provider, alternatives, reason, policy/capability/health versions, user disclosure/approval.
- `ConversionAttempt`: immutable attempt, provider/worker/environment, start/end, input/output checksums, warnings/errors, timeout/resource data, retryability.
- `ConversionFidelityReport`: structural/content/layout/reference/table/figure checks, omissions/changes, severity, fixture/policy/version, reviewer/user acceptance.
- `ConversionLicenseReview`: provider/version/license, commercial/distribution/source/server/browser obligations, evidence, owner/legal decision/date/expiry/restrictions.

## Async and failure invariants

- Heavy actions use `ASYNC_WORKER`; work is isolated and time/resource bounded.
- Retries are bounded/idempotent and create attempts, not duplicate authoritative outputs.
- Fallback requires an approved compatible capability and retains route disclosure.
- Timeout/corrupt/password-protected/unsupported/partial/fidelity-warning outcomes are explicit.
- Temporary/intermediate outputs are quarantined and automatically cleaned unless an authorized validated asset is saved.
- Frontend observes normalized job state and never provider endpoints/credentials.

## Related documents

- [File Conversion Engine](../internal-engines/FILE%20CONVERSION%20ENGINE.md)
- [File Asset Model](./FILE%20ASSET%20MODEL.md)
- [Document Conversion Workflow](../workflows/DOCUMENT%20CONVERSION%20WORKFLOW.md)
