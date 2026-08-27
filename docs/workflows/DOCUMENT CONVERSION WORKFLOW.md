# Document Conversion Workflow

**Status:** LOCKED P1 workflow contract — documented, not implemented

## Goal

Convert a validated asset through a truthful, privacy-aware, provider-neutral route and produce a validated immutable output for preview, project save, or download.

## Workflow

```text
Validated FileAsset → Requested action/target → Format Router
→ Route/Privacy/Fidelity Preview → User confirmation when needed
→ LOCAL_BROWSER | SERVER_ISOLATED | ASYNC_WORKER
→ Output Validation/Normalization → Preview
→ Save to Project / Download / Reject
```

1. Pin input asset/checksum, source/target/action, parameters, owner/project, privacy and capability-registry versions.
2. Validate exact pair/action and source integrity; unsupported or testing-only capability cannot execute.
3. Route using format, size, privacy, browser capability, server need, complexity, provider health/license, and async thresholds.
4. Present mode/provider category, server disclosure, expected fidelity limits, resource/cost class and fallback rules where relevant.
5. Execute locally or create `ConversionJob`; frontend never calls Gotenberg/Pandoc/other provider directly.
6. Validate output MIME/signature/checksum/content/structure/fidelity and create a new derived FileAsset. Source remains immutable.
7. Show preview and warnings; user saves/imports/downloads or rejects. Project import invokes owning-domain validation separately.
8. Expire/clean temporary inputs/intermediates/outputs according to retention and record audit proof.

## Async operations

OCR, large PDF/Office conversion, figure/table extraction, document parsing, and batch conversion use queue/worker. Job status is `QUEUED`, `VALIDATING`, `PROCESSING`, `COMPLETED`, `FAILED`, or `EXPIRED`; progress is normalized. Timeouts and retries are bounded and idempotent.

## Failure and fallback

Explicit outcomes cover timeout, provider unhealthy, unsupported format, corrupt/password-protected input, resource limit, partial conversion, and fidelity warning. Fallback must be verified/license-approved, satisfy privacy requirements, and be disclosed; it cannot silently upload a locally expected file or change semantics.

## Related documents

- [File Conversion Engine](../internal-engines/FILE%20CONVERSION%20ENGINE.md)
- [Conversion Job Model](../database/CONVERSION%20JOB%20MODEL.md)
- [LibreOffice WASM candidate](../integrations/writing/LIBREOFFICE%20WASM.md)
- [Gotenberg candidate](../integrations/writing/GOTENBERG.md)
- [Pandoc candidate](../integrations/writing/PANDOC.md)

