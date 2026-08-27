# Migration conventions — Platform Phase 0

**Status:** Operational convention, established as part of Platform Phase 0 — Foundation. Not itself a locked architecture document; extends [P0 Backend Implementation Sequence](../../docs/implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) Phase 0's "Migrations" requirement with the concrete mechanics this repository uses.

## Naming and ownership

- One migration = one file = one deployable, ordered change. Filenames follow the Supabase CLI convention `<UTC timestamp>_<short_description>.sql`, created via `supabase migration new <short_description>` — never hand-numbered or hand-dated.
- Every migration is owned by whichever module/phase introduces it. A migration's leading comment states which phase/PR it belongs to and, for anything past Phase 0, which entity it changes and why — consistent with [P0 Definition of Done](../../docs/implementation/P0%20DEFINITION%20OF%20DONE.md)'s "entity ownership, canonical IDs, tenant/project keys and referential constraints are explicit."
- `supabase/schema.sql` remains a human-readable snapshot of the schema at the point this migration history began (see `20260827101317_baseline_schema.sql`). It is a reference, not a second source of truth: from this point forward, every schema change is a new migration file, never a hand-edit to `schema.sql` or to a past migration.

## Recovery policy: roll-forward, not edit-in-place

- Migrations in this repository are **forward-only**. A mistake in an already-applied migration is corrected by a new migration that fixes it, never by editing or deleting the original file — the same immutability discipline the locked data models ([ANALYSIS MODEL.md](../../docs/database/ANALYSIS%20MODEL.md), [DATASET MODEL.md](../../docs/database/DATASET%20MODEL.md)) already require of application data applies to the migration history itself.
- For local/CI environments, "rollback" means `supabase db reset`, which replays every migration from a clean database — this is the rehearsed recovery path for Phase 0 (see Evidence, below), not a per-migration `down` script.
- A destructive migration (dropping a column/table with real data) requires an explicit written note in the migration file about what data it affects and why, per Phase 0's "no unresolved P0 ... migration ... defect" bar — none of the current migrations are destructive.

## Baseline

- `20260827101317_baseline_schema.sql` — the pre-existing CMS/blog/tools schema (`profiles`, `categories`, `tags`, `articles`, `article_tags`, `article_feedback`, `tool_history`, `ai_requests`, `repository_items`, RLS policies, `handle_new_user` trigger), copied verbatim from `supabase/schema.sql` into migration history. No behavior change.
- `20260827101319_phase0_empty_baseline.sql` — a deliberate no-op, proving the migration mechanism (apply / track / replay-from-clean) independent of real schema content. This is the literal "empty migration" Phase 0's acceptance criterion names.
- `supabase/seed.sql` is applied automatically by `supabase db reset` after all migrations, per Supabase CLI convention — it is non-sensitive, deterministic seed content, not a migration.

## Rehearsal evidence

Migration rehearsal (clean apply, idempotent re-apply, upgrade path from the pre-Phase-0 baseline) was run locally against an isolated Docker Postgres container, not a production database. See the Phase 0 implementation report for the exact commands and captured output.
