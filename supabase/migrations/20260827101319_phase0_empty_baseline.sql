-- =====================================================================
-- Phase 0 empty baseline migration — Platform Phase 0 — Foundation
--
-- Deliberately a no-op. Its only purpose is to prove the migration
-- mechanism itself (apply, track, replay from clean) works, independent
-- of any real schema content — this is the literal "empty migration"
-- Phase 0's acceptance criterion names: "a clean checkout can provision
-- an isolated test environment and exercise one empty migration without
-- production secrets."
--
-- Do not add real schema changes to this file. The next real change
-- gets its own new migration via `supabase migration new <name>`.
-- =====================================================================

select 1; -- intentional no-op statement; proves the migration runner executes this file.
