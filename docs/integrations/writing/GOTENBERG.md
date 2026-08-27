# Gotenberg Conversion Candidate

**Conversion readiness:** `PROPOSED` / `REQUIRES TESTING` — not production-approved, not installed

**Integration-map verification status:** `PARTIALLY VERIFIED` — official capability/configuration and top-level MIT evidence found; exact image/interface/dependency stack remains uncleared

## Purpose

Evaluate Gotenberg as a replaceable server-side conversion provider behind the internal Conversion Gateway for complex document/PDF operations. Frontend and product domains never call it directly.

## Proposed capability scope

Candidate actions: Office→PDF, HTML→PDF, Markdown→PDF, PDF merge/split/rotate/flatten, PDF/A only if verified available for the selected version/configuration, and other complex PDF conversion proven by capability tests. Each pair/action remains separately statused; this list is not an implementation/API guarantee.

## Deployment boundary

`GotenbergProvider` receives normalized jobs from Conversion Gateway inside a tenant/job-isolated server-processing boundary. Use signed/internal authorization, network restrictions, strict upload/output limits, sandbox/container hardening, time/resource limits, health/circuit state, logs without document content, temporary storage, and cleanup. No public Gotenberg endpoint or public output URL.

## Validation and fidelity

Test representative academic fixtures: long theses, citations, tables/figures, equations, fonts, page breaks, headers/footers, multilingual text, accessibility/metadata, and malformed/password-protected inputs. Output checksum/MIME/pages/fidelity warnings are recorded. Partial conversion cannot be reported as clean completion.

## License/operations gate

Verify exact version/license, commercial/server use, distribution/container obligations, notices, bundled dependencies/fonts, source-disclosure implications, security support, update/SBOM/vulnerability process, capacity/timeout behavior, and operational ownership before `VERIFIED`. No API claim is made until official versioned interface testing.

## Failure/fallback

Timeout/provider unhealthy may retry safely or use another approved provider with disclosed privacy/fidelity differences. Corrupt/password-protected/unsupported input is not retried blindly. Partial files are quarantined/expired.

## Related documents

- [Research File Tools](../../architecture/RESEARCH%20FILE%20TOOLS.md)
- [Conversion Job Model](../../database/CONVERSION%20JOB%20MODEL.md)
- [Conversion Capability & License Matrix](./CONVERSION%20CAPABILITY%20LICENSE%20MATRIX.md)
