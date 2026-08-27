# Platform Phase 1 — Identity & Tenancy: Implementation Record

**Status:** `IMPLEMENTED` — awaiting independent review before `VERIFIED`/`LOCKED`, per [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md)'s own rule that a phase cannot self-assign verification.
**Amends:** nothing. This is the evidence record for `Phase 1 — Identity & Tenancy`. No locked document was changed to produce it. Phase 0 was not reopened — every Phase 1 file is additive (one migration, new `src/lib/platform/{auth,authz}.ts`, new `src/app/api/organizations/**`, one new export added to `src/lib/supabase/server.ts`).
**Gate note:** [P0 Implementation Gates](../implementation/P0%20IMPLEMENTATION%20GATES.md) **Gate B** requires evidence from *both* Phase 1 (identity/tenant authorization) and Phase 2 (`ResearchProject` persistence). This document closes Phase 1's half only — Gate B itself is not claimed passed here, and `ResearchProject` was deliberately not built (out of Phase 1 scope).

## What was built

| Area | File(s) |
|---|---|
| Tenant identity, membership, role, audit trail (migration) | [supabase/migrations/20260827105119_phase1_identity_tenancy.sql](../../supabase/migrations/20260827105119_phase1_identity_tenancy.sql) |
| User-scoped (RLS-respecting) Supabase client | [src/lib/supabase/server.ts](../../src/lib/supabase/server.ts) (`createUserScopedClient`, additive) |
| Session/identity resolution | [src/lib/platform/auth.ts](../../src/lib/platform/auth.ts) |
| Authorization kernel (rank decision + DB round trip) | [src/lib/platform/authz.ts](../../src/lib/platform/authz.ts) |
| Organizations API (create/list) | [src/app/api/organizations/route.ts](../../src/app/api/organizations/route.ts) |
| Membership API (add member) | [src/app/api/organizations/[id]/members/route.ts](../../src/app/api/organizations/%5Bid%5D/members/route.ts) |
| Real RLS enforcement proof (against live Postgres, not mocks) | [scripts/phase1-rls-rehearsal.mjs](../../scripts/phase1-rls-rehearsal.mjs) |

## Design decisions worth recording

- **No new authentication system.** Session/credential handling is entirely Supabase Auth (`auth.users`), already the platform's identity provider since Phase 0's `profiles` table. Phase 1 adds tenancy/authorization on top, not a competing identity layer.
- **RLS is the enforced boundary; the application-layer authorization kernel exists to produce the right HTTP status, not to be the actual security control.** Every table grant is `anon, authenticated, service_role` (this project has no path where an unauthenticated caller can act — RLS denies before any row is touched), and every policy was proven against a real Postgres, not asserted from reading the SQL.
- **Privilege escalation is prevented by a rank comparison the database enforces directly** (`org_role_rank(role) < my_org_role_rank(org_id)` on both `INSERT` and `UPDATE`/`DELETE` of `organization_members`): an actor can only grant, modify, or remove a member ranked strictly below themselves. No one — including another owner — can promote anyone to `owner` through the API; ownership transfer is out of Phase 1 scope.
- **Audit trail is trigger-driven, not application-code-driven**, and no role has an `INSERT`/`UPDATE`/`DELETE` grant on `audit_log` at all — a future caller cannot forget to log a mutation, and cannot forge one either.
- **Object-enumeration safety:** a non-member gets the same `404` whether an organization exists or not; a member below the required rank gets `403` (they already know it exists). This distinction is made at the application layer specifically because RLS alone cannot distinguish the two (both look like "zero rows" to the database).
- **A real bug was found and fixed during rehearsal, not assumed away**: tables created by a plain migration (running as the `postgres` role) do not automatically inherit Supabase's usual `anon`/`authenticated`/`service_role` grants the way a dashboard-provisioned hosted project's default ACL does — confirmed by testing, not by reading documentation. Explicit `GRANT` statements were added to the Phase 1 migration for its own three tables (`audit_log` receives `SELECT` only — no write grant to any application role, by design). This defect was also present, unfixed, in Phase 0's tables, on this local rehearsal environment; **it was not corrected here** (out of Phase 1's scope to touch Phase 0), and it remains open — see Known Limitations.
- **A second real bug was found and fixed**: `INSERT ... RETURNING` under RLS requires the `SELECT` policy to already permit the new row, which is not reliably true yet inside the same statement as the `AFTER INSERT` bootstrap trigger. Fixed by allowing a creator to always see their own organization (`created_by = auth.uid()`), independent of the trigger's timing — see the migration's own comment on that policy for the full explanation.

## Known, deliberate non-scope

Per Phase 1's own forbidden scope and this task's `DO NOT` list: no institution workspace, supervisor dashboard, billing UI, social/community roles, or broad enterprise administration. Not built: resource-scoped (`ResearchProject`-level) `PermissionGrant` (no such resource exists yet — Phase 2's job), self-service "leave organization," owner transfer, platform-admin cross-tenant bypass. No frontend/UI was added.

## Related documents

- [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) (Phase 1), [P0 Implementation Gates](../implementation/P0%20IMPLEMENTATION%20GATES.md) (Gate B), [01 Platform Core](../architecture/01%20PLATFORM%20CORE.md), [ADR 009 Private by Default](../adr/ADR%20009%20PRIVATE%20BY%20DEFAULT.md).
- [Platform Phase 0 Foundation](PLATFORM%20PHASE%200%20FOUNDATION.md) — the phase this one builds on, untouched.
