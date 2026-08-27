# File Asset Model

**Status:** LOCKED P1 conceptual model — no SQL, migration, storage, or upload implementation

## Ownership

Research File Tools owns file identity, immutable byte/version references, classification, processing lifecycle, retention/expiry, and file-operation provenance. Object Storage owns encrypted bytes. ResearchProject/RDT, Literature, Dataset, and Writing domains reference/import validated assets but remain owners of their canonical research entities.

## FileAsset

Minimum conceptual fields:

```text
file_asset_id
owner_id
project_id
original_filename
original_format
detected_format
mime_type
size
checksum
storage_location
privacy_classification
processing_status
created_at
expires_at
deleted_at
```

Additional fields: organization/tenant id, asset role (`ORIGINAL`, `DERIVED`, `EXTRACTED`, `NORMALIZED`, `EXPORT`, `TEMPORARY`), parent/source asset ids, detection capability/version/confidence, encryption/key reference, malware/security validation reference, upload/import provenance, retention policy, content disposition, access policy, metadata, current version/supersession, quarantine state, and audit correlation id.

## Supporting entities

- `FileAssetVersion`: immutable bytes/checksum/storage and validity history; derived output is never a mutation of source.
- `FileClassification`: detected format/type/academic role, confidence/signals, classifier version and review decision.
- `FileSecurityValidation`: MIME/signature/extension, size, malware, password/encryption, embedded-content checks, result/issues, scanner/version/date.
- `FileProvenanceLink`: input/output/normalized/project-object relationship, conversion/extraction job, engine/version, source coordinates, rationale and validity.
- `FileRetentionRecord`: expiry/hold/deletion request, temporary-copy cleanup evidence, actor/job/timestamps and minimized audit outcome.

## Status

`processing_status` distinguishes upload/validation/quarantine/ready/processing/completed/failed/expired/deleted states as separately governed lifecycle values; it does not replace ConversionJob status. A quarantined or failed asset cannot be routed/imported.

## Invariants

- Original bytes/checksum and each version are immutable.
- Every asset is owner/project/tenant scoped and private by default; no public storage URL.
- Signed access is short-lived, action/asset/user scoped, and audited.
- Temporary/intermediate assets expire and are cleaned; saved output gets explicit retention.
- Imported canonical objects link to validated asset/version/provenance, never raw provider shapes.
- Deletion follows retention/consent/legal holds and records completion without retaining sensitive content in logs.

## Related documents

- [Research File Tools](../architecture/RESEARCH%20FILE%20TOOLS.md)
- [Conversion Job Model](./CONVERSION%20JOB%20MODEL.md)
- [Master Data Governance](../MASTER%20DATA%20GOVERNANCE.md)

