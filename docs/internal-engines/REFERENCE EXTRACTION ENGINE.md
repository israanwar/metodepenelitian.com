# Reference Extraction Engine

**Status:** P1 research-specific capability contract — documented, not implemented

## Purpose

Reference Extraction Engine identifies citations/bibliography entries in validated files, normalizes them into reviewable candidates, and converts between research-reference formats without fabricating metadata or bypassing canonical `ResearchReference` validation.

## Capabilities

- Extract citation markers and bibliography entries from structured documents/PDF text when supported.
- Parse RIS, BibTeX, CSL JSON, and EndNote XML into canonical candidate fields.
- Convert RIS↔BibTeX, RIS↔CSL JSON, BibTeX↔CSL JSON, and EndNote XML where mappings are verified.
- Resolve DOI→RIS/BibTeX only through an approved metadata source via Integration Gateway, recording source/fetched-at/verification; a DOI is never expanded from model memory.
- Deduplicate/link candidates using canonical reference rules, with ambiguity retained for review.

## Provenance and normalization

Each extracted record pins input asset/version/checksum, page/paragraph/entry coordinates, parser/version, raw entry, normalized fields, field-level confidence/source, DOI/metadata lookup provenance, warnings/unmapped fields, and review decision. Conversion round-trip/fidelity limitations remain explicit.

## Import boundary

Outputs are `ReferenceCandidate`s until format/schema, metadata, ambiguity, and access/license checks pass and user approves project import. Canonical Literature & Evidence owns resulting `ResearchReference`; this engine owns no parallel reference silo.

## Failure and security

Malformed entries, unverified DOI, ambiguous title/author, unsupported field/type, extraction omission, and license/provider unavailability return warnings/errors/unknown fields rather than invented values. Files remain private; external metadata lookup sends identifiers/minimum query only, not the academic file.

## Related documents

- [File Interoperability Engine](./FILE%20INTEROPERABILITY%20ENGINE.md)
- [Academic Document Import Workflow](../workflows/ACADEMIC%20DOCUMENT%20IMPORT%20WORKFLOW.md)
- [Reference Managers](../architecture/14%20REFERENCE%20MANAGERS.md)

