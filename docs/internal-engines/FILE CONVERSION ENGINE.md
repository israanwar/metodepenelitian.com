# File Conversion Engine

**Status:** LOCKED P1 engine contract — documented, not implemented

## Purpose

File Conversion Engine orchestrates validated file conversion through a provider-neutral Conversion Gateway. It never owns product-specific canonical research content, mutates source assets, or exposes provider endpoints to frontend clients.

## Components

- File Classifier and security-validation gate.
- Format/Action Capability Registry with source/target/action, execution modes, limits, fidelity checks, license status, and `PROPOSED/VERIFIED/REQUIRES TESTING` state.
- Format Router using format, size, privacy, browser/server needs, complexity, health, and license approval.
- Conversion Gateway implementing provider abstraction and normalized request/result envelopes.
- Output Validator and Normalizer producing a new `FileAsset` plus fidelity/provenance report.
- Async coordinator for heavy jobs, expiry, retries, cancellation, and cleanup.

## Provider contract

Conceptual interface:

```text
supports(source_format, target_format, action, execution_mode)
validate(input_asset, parameters)
convert(validated_input, parameters, execution_context)
getCapabilities()
healthCheck()
```

Providers return normalized status, output asset(s), checksums, engine/version, warnings/errors, fidelity/validation evidence, and resource metrics. They cannot write into ResearchProject/RDT directly.

## Execution flow

Authorize → classify/validate → resolve verified capability → select mode/provider → preview privacy/fidelity/cost → run local or create job → validate output → create immutable output asset → preview → authorized project import/download. Local browser completion reports metadata/checksums without requiring source upload when feasible.

## Failure strategy

Timeout, transient failure, corrupt/password-protected input, unsupported pair, resource limit, provider unhealthy, partial output, or fidelity warning is explicit. Retry only safe/idempotent attempts; fallback only to another approved provider with equal privacy/license/fidelity contract and disclosed route. Partial output is quarantined until user accepts a clearly supported recovery action.

## Security/license

Enforce MIME/extension/signature, malware, sandbox/network/resource, signed access, temporary storage/cleanup, encryption, tenant/project authorization, audit, and provider disclosure. Provider eligibility requires recorded license/security/fidelity/operations reviews.

## Related documents

- [Research File Tools](../architecture/RESEARCH%20FILE%20TOOLS.md)
- [Conversion Job Model](../database/CONVERSION%20JOB%20MODEL.md)
- [Document Conversion Workflow](../workflows/DOCUMENT%20CONVERSION%20WORKFLOW.md)

