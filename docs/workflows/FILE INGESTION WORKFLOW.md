# File Ingestion Workflow

**Status:** LOCKED P1 workflow contract — documented, not implemented

## Goal

Accept an authorized research file, establish immutable identity and security status, classify academic/file type, and expose only verified actions without automatically converting, importing, or sending content to AI.

## Workflow

1. **Authorize intent** — validate owner/project/tenant, action purpose, privacy/consent, size/plan, and upload session.
2. **Privacy-first preflight** — inspect available browser metadata/capabilities and determine whether local processing can avoid server upload. Route is not yet conversion approval.
3. **Acquire file** — use local handle or signed private upload; compute checksum where feasible; create provisional FileAsset.
4. **Security validation** — MIME/signature validation, extension mismatch, file-size limits, malware scan, password/encryption and embedded-content classification. Unsafe files are quarantined.
5. **Classify** — detect source format, academic document/data/reference/PDF/figure role, complexity, and confidence using versioned classifier/capability.
6. **Register original** — persist immutable original FileAsset/version/checksum, provenance, privacy, retention/expiry, and validation results; no public URL.
7. **Resolve actions** — Format Router returns only `VERIFIED` actions/providers/modes for that asset plus rationale, privacy/fidelity/license disclosures. Proposed/testing capabilities are visibly unavailable.
8. **User chooses** — Convert, Extract, Import, Preview, Save to Project, or Download; selection starts the relevant workflow, not a direct provider call.

## Outputs and events

Output is a validated/quarantined FileAsset, classification, action menu, and audit record. Conceptual events: `file.uploaded`, `file.validation.failed/passed`, `file.classified`, `file.quarantined`, `file.ready`, `file.expired/deleted`.

## Failure/recovery

MIME mismatch, malware, oversize, corrupt/password-protected/unsupported file, low-confidence classification, failed upload, or expired session produces explicit status and safe recovery. No silent format assumption. Temporary copies are cleaned; user may supply password only through an approved secure flow if such capability later exists.

## Related documents

- [File Asset Model](../database/FILE%20ASSET%20MODEL.md)
- [Research File Tools](../architecture/RESEARCH%20FILE%20TOOLS.md)
- [Document Conversion Workflow](./DOCUMENT%20CONVERSION%20WORKFLOW.md)

