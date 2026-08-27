# Platform Phase 0 — Foundation: Implementation Record

**Status:** `IMPLEMENTED` — awaiting independent review before `VERIFIED`/`LOCKED`, per [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md)'s own rule that "a phase cannot mark itself `VERIFIED`; review is required before `LOCKED`."
**Amends:** nothing. This is the evidence record for `Phase 0 — Foundation`, the first phase in the already-`LOCKED` [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md). No locked document was changed to produce it.
**Scope:** exactly Phase 0's required areas — configuration, database connection lifecycle, migration foundation, structured/redacted logging, health/readiness, error envelope, and the test harness those need. No domain entity (`ResearchProject`, `Dataset`, `AnalysisRun`, etc.) was created — Phase 0's own forbidden scope excludes them.

For the full acceptance-criteria-by-criteria evidence table, exact test commands/output, and the formal `REPORT`/`Definition of Done` verdict, see the implementation report delivered alongside this document (chat transcript / PR description) — this file is the durable, in-repo record; the chat report is the point-in-time submission.

## What was built

| Area | File(s) |
|---|---|
| Configuration schema + fail-closed validation | [src/lib/platform/config.ts](../../src/lib/platform/config.ts) |
| Normalized error envelope | [src/lib/platform/errors.ts](../../src/lib/platform/errors.ts) |
| Correlation id | [src/lib/platform/correlation.ts](../../src/lib/platform/correlation.ts) |
| Structured, redacted logger | [src/lib/platform/logger.ts](../../src/lib/platform/logger.ts) |
| Database connection lifecycle check | [src/lib/platform/db.ts](../../src/lib/platform/db.ts) |
| Liveness endpoint | [src/app/api/health/route.ts](../../src/app/api/health/route.ts) |
| Readiness endpoint | [src/app/api/ready/route.ts](../../src/app/api/ready/route.ts) |
| Test harness (Vitest) | [vitest.config.mts](../../vitest.config.mts), `*.test.ts` beside each module above |
| Secret scan | [scripts/secret-scan.mjs](../../scripts/secret-scan.mjs) |
| Migration foundation | [supabase/config.toml](../../supabase/config.toml), [supabase/migrations/](../../supabase/migrations/), [supabase/migrations/README.md](../../supabase/migrations/README.md) |

## Design decisions worth recording

- **Liveness vs. readiness are two endpoints, not one**, deliberately: liveness (`/api/health`) never touches the database, so a database outage cannot cause a process-management system to kill an otherwise-healthy process. Readiness (`/api/ready`) is the only endpoint allowed to say "not ready," and it says so honestly (503 with a normalized error envelope), never a fabricated 200 — this is the specific failure mode ("false-ready process") Phase 0 names.
- **`COMPLETED`/`ok:true` is only ever reported after a real round trip.** `checkDatabaseConnection` performs an actual query against the `profiles` table with a bounded timeout; it never infers readiness from configuration alone.
- **Redaction is key-name based, not content-scanning** (see the logger's own doc comment and its `logger.test.ts`). This is a deliberate, documented scope boundary, not an oversight: value-content secret detection is a materially larger feature than Phase 0's "structured, redacted logs" asks for.
- **Migration history was seeded from the existing `supabase/schema.sql`**, not started empty, because Phase 0 explicitly requires the *existing database upgrade path* to work, not only a from-scratch bootstrap. `schema.sql` remains as a human-readable reference; it is no longer where schema changes are made.
- **No ORM/query-builder was introduced.** The existing `@supabase/supabase-js` client pattern (`src/lib/supabase/{client,server}.ts`) was reused as-is, consistent with "gunakan existing stack dan conventions."
- **No ESLint config exists in this repository** (`next lint` prompts to create one interactively — confirmed pre-existing, not introduced by this work). Left as-is: setting up lint tooling is not a named Phase 0 requirement and is out of this phase's scope to fix.

## Known, deliberate non-scope

Per Phase 0's own forbidden scope and this task's explicit `DO NOT` list: no `ResearchProject`/RDT/Dataset/AnalysisRun entity, no auth UI, no queue/event-bus infrastructure, no external provider integration, and no statistical/analysis feature was added. Rate limiting on `/api/ready` was deliberately not added — it is not part of Phase 0's named security baseline, and there is no rate-limiting infrastructure in this codebase to build on yet; noted as a residual risk (an unauthenticated caller could poll `/api/ready` at a high rate, adding load to the database) for a later phase to address, not silently accepted as solved.

## Related documents

- [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md), [P0 Implementation Gates](../implementation/P0%20IMPLEMENTATION%20GATES.md) (Gate A), [P0 Definition of Done](../implementation/P0%20DEFINITION%20OF%20DONE.md).
- [supabase/migrations/README.md](../../supabase/migrations/README.md) — migration naming, ownership, and recovery policy.
