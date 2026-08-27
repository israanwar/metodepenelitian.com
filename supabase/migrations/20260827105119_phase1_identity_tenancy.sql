-- =====================================================================
-- Platform Phase 1 — Identity & Tenancy
--
-- Authority: docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md
-- (Phase 1), docs/architecture/01 PLATFORM CORE.md, ADR 009 (Private by
-- Default), docs/implementation/P0 IMPLEMENTATION GATES.md (Gate B,
-- identity/project-authorization half only — the ResearchProject half of
-- Gate B is Phase 2 and is explicitly out of scope here).
--
-- Adds tenant/institution identity (`organizations`), tenant-scoped
-- membership+role (`organization_members`), and a trigger-driven audit
-- trail (`audit_log`). Does not touch any Phase 0 table. Authentication
-- itself is not reimplemented — it reuses Supabase Auth (`auth.users`),
-- which Phase 0's `profiles` table already extends.
--
-- Forbidden scope (per Phase 1's own table): institution workspace,
-- supervisor dashboards, billing UI, social/community roles, broad
-- enterprise administration. Deliberately NOT built here: resource-scoped
-- (`ResearchProject`-level) PermissionGrant (no such resource exists
-- yet), self-service "leave organization", owner transfer, platform-admin
-- cross-tenant bypass. See supabase/migrations/README.md for convention.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tenant-scoped role, ranked so authorization checks are one comparison,
-- not a chain of OR'd string equalities.
-- ---------------------------------------------------------------------
create type org_role as enum ('member', 'admin', 'owner');

create or replace function public.org_role_rank(r org_role)
returns int language sql immutable as $$
  select case r when 'owner' then 3 when 'admin' then 2 else 1 end;
$$;

-- ---------------------------------------------------------------------
-- organizations — tenant/institution identity.
-- ---------------------------------------------------------------------
create table if not exists organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique not null,
  created_by uuid not null references profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- organization_members — tenant-scoped membership + role. This is the
-- table every authorization decision in this phase ultimately checks.
-- ---------------------------------------------------------------------
create table if not exists organization_members (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references organizations (id) on delete cascade,
  user_id    uuid not null references profiles (id) on delete cascade,
  role       org_role not null default 'member',
  invited_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);
create index if not exists organization_members_user_idx on organization_members (user_id);
create index if not exists organization_members_org_idx  on organization_members (org_id);

-- ---------------------------------------------------------------------
-- audit_log — generic append-only audit trail. Scoped to identity/
-- tenancy mutations in this phase; the shape is generic so a later
-- phase can reuse the same table rather than inventing a second one.
-- No INSERT/UPDATE/DELETE policy is granted to any application role:
-- rows are written exclusively by SECURITY DEFINER triggers below, so
-- "audit actor/timestamps present on mutations" cannot be bypassed by
-- a future caller forgetting to log it in application code.
-- ---------------------------------------------------------------------
create table if not exists audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references profiles (id) on delete set null,
  action      text not null,
  target_type text not null,
  target_id   uuid,
  org_id      uuid references organizations (id) on delete set null,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists audit_log_org_idx   on audit_log (org_id, created_at desc);
create index if not exists audit_log_actor_idx on audit_log (actor_id, created_at desc);

-- ---------------------------------------------------------------------
-- Authorization kernel primitive: the caller's own role-rank within one
-- org, or 0 if not a member. SECURITY DEFINER so it can read
-- organization_members without triggering that table's own RLS policy
-- against itself (the well-known Postgres RLS self-recursion pitfall).
-- Every RLS policy below, and the application-layer authorization
-- kernel (src/lib/platform/authz.ts), both resolve to this same
-- function, so the database-enforced and server-declared decisions
-- cannot silently disagree.
-- ---------------------------------------------------------------------
create or replace function public.my_org_role_rank(check_org_id uuid)
returns int language sql stable security definer set search_path = public as $$
  select coalesce(max(org_role_rank(role)), 0)
  from organization_members
  where org_id = check_org_id and user_id = auth.uid();
$$;
revoke all on function public.my_org_role_rank(uuid) from public;
grant execute on function public.my_org_role_rank(uuid) to anon, authenticated, service_role;

-- ---------------------------------------------------------------------
-- Base table grants. Discovered during Phase 1 rehearsal: a table
-- created by the `postgres` role (as every migration runs) does not
-- automatically inherit the broad anon/authenticated/service_role grant
-- that Supabase's own `supabase_admin`-provisioned default ACL gives
-- tables created through the dashboard — on a plain local Postgres,
-- `postgres`-owned tables default to Truncate/References/Trigger/
-- Maintain only, with no Select/Insert/Update/Delete for any
-- non-owner role. Without this, RLS is unreachable: Postgres denies at
-- the base-privilege check before a policy is ever evaluated. RLS
-- above remains the actual authorization boundary; these grants only
-- make it reachable, exactly matching Supabase's own default posture.
--
-- audit_log intentionally receives SELECT only, for every role
-- including service_role — writes go exclusively through the
-- SECURITY DEFINER triggers below (owned by the table owner, which
-- bypasses RLS and holds full privileges on its own objects
-- regardless of this grant), so no role can insert/update/delete an
-- audit row directly, by policy or by grant.
-- ---------------------------------------------------------------------
grant select, insert, update, delete on organizations        to anon, authenticated, service_role;
grant select, insert, update, delete on organization_members to anon, authenticated, service_role;
grant select                          on audit_log             to anon, authenticated, service_role;

-- ---------------------------------------------------------------------
-- Row Level Security — default deny. No table below has a permissive
-- policy for an action beyond what is listed; everything else is denied.
-- ---------------------------------------------------------------------
alter table organizations        enable row level security;
alter table organization_members enable row level security;
alter table audit_log            enable row level security;

-- organizations
--
-- The `or created_by = auth.uid()` arm is not redundant with the
-- bootstrap trigger: Postgres evaluates an `INSERT ... RETURNING`
-- statement's SELECT-policy visibility for the new row as part of the
-- same command, which in practice does not observe the AFTER INSERT
-- trigger's own insert into organization_members yet (verified
-- empirically during rehearsal — omitting this arm made every
-- creator's own `insert().select()` fail with "new row violates
-- row-level security policy" even though the insert itself was
-- allowed). A creator being able to see their own org unconditionally
-- is correct on its own merits regardless of that timing detail.
create policy "org members can read" on organizations
  for select using (my_org_role_rank(id) >= org_role_rank('member') or created_by = auth.uid());
create policy "authenticated can create org" on organizations for insert with check (auth.uid() = created_by);
create policy "org admins can update"   on organizations for update using (my_org_role_rank(id) >= org_role_rank('admin'));
create policy "org owners can delete"   on organizations for delete using (my_org_role_rank(id) >= org_role_rank('owner'));

-- organization_members
-- Insert/update/delete all require the actor to be admin+ in that org,
-- AND require the target row's role (existing role on update/delete, the
-- role being assigned on insert/update) to rank strictly below the
-- actor's own rank — this is the concrete, testable "privilege
-- escalation" prevention Phase 1's Tests row names: an admin cannot
-- grant/hold owner-or-equal rank over a peer, and cannot modify a member
-- ranked at or above themselves.
create policy "org members can list members" on organization_members
  for select using (my_org_role_rank(org_id) >= org_role_rank('member'));

create policy "org admins can add members" on organization_members
  for insert
  with check (
    my_org_role_rank(org_id) >= org_role_rank('admin')
    and org_role_rank(role) < my_org_role_rank(org_id)
  );

create policy "org admins can update members" on organization_members
  for update
  using (
    my_org_role_rank(org_id) >= org_role_rank('admin')
    and org_role_rank(role) < my_org_role_rank(org_id)
  )
  with check (
    org_role_rank(role) < my_org_role_rank(org_id)
  );

create policy "org admins can remove members" on organization_members
  for delete
  using (
    my_org_role_rank(org_id) >= org_role_rank('admin')
    and org_role_rank(role) < my_org_role_rank(org_id)
  );

-- audit_log: read-only for org admins/owners of that org; no write policy
-- for any application role (see comment on the table above).
create policy "org admins can read audit" on audit_log
  for select using (org_id is not null and my_org_role_rank(org_id) >= org_role_rank('admin'));

-- ---------------------------------------------------------------------
-- Bootstrap: the creator of an organization becomes its first member,
-- at 'owner' rank, atomically with creation. Runs SECURITY DEFINER
-- (owned by the table owner, which bypasses RLS by default) specifically
-- so this one system-generated row does not need a special case carved
-- into the admin-only INSERT policy above.
-- ---------------------------------------------------------------------
create or replace function public.bootstrap_org_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into organization_members (org_id, user_id, role, invited_by)
  values (new.id, new.created_by, 'owner', new.created_by);
  return new;
end;
$$;

drop trigger if exists trg_bootstrap_org_owner on organizations;
create trigger trg_bootstrap_org_owner
  after insert on organizations
  for each row execute function public.bootstrap_org_owner();

-- ---------------------------------------------------------------------
-- Audit triggers — every mutation on organizations / organization_members
-- writes one audit_log row, unconditionally, regardless of which
-- apiclient/role performed it. actor_id falls back to the row's own
-- created_by only when auth.uid() is unavailable (e.g. a service-role
-- initiated write), never fabricated.
-- ---------------------------------------------------------------------
create or replace function public.audit_organizations()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into audit_log (actor_id, action, target_type, target_id, org_id, metadata)
    values (coalesce(auth.uid(), new.created_by), 'organization.created', 'organization', new.id, new.id,
            jsonb_build_object('name', new.name, 'slug', new.slug));
  elsif tg_op = 'UPDATE' then
    insert into audit_log (actor_id, action, target_type, target_id, org_id, metadata)
    values (auth.uid(), 'organization.updated', 'organization', new.id, new.id,
            jsonb_build_object('before', to_jsonb(old), 'after', to_jsonb(new)));
  elsif tg_op = 'DELETE' then
    insert into audit_log (actor_id, action, target_type, target_id, org_id, metadata)
    values (auth.uid(), 'organization.deleted', 'organization', old.id, old.id,
            jsonb_build_object('name', old.name, 'slug', old.slug));
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_audit_organizations on organizations;
create trigger trg_audit_organizations
  after insert or update or delete on organizations
  for each row execute function public.audit_organizations();

create or replace function public.audit_organization_members()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into audit_log (actor_id, action, target_type, target_id, org_id, metadata)
    values (coalesce(auth.uid(), new.invited_by), 'member.added', 'organization_member', new.id, new.org_id,
            jsonb_build_object('user_id', new.user_id, 'role', new.role));
  elsif tg_op = 'UPDATE' then
    insert into audit_log (actor_id, action, target_type, target_id, org_id, metadata)
    values (auth.uid(), 'member.role_changed', 'organization_member', new.id, new.org_id,
            jsonb_build_object('user_id', new.user_id, 'before_role', old.role, 'after_role', new.role));
  elsif tg_op = 'DELETE' then
    insert into audit_log (actor_id, action, target_type, target_id, org_id, metadata)
    values (auth.uid(), 'member.removed', 'organization_member', old.id, old.org_id,
            jsonb_build_object('user_id', old.user_id, 'role', old.role));
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_audit_organization_members on organization_members;
create trigger trg_audit_organization_members
  after insert or update or delete on organization_members
  for each row execute function public.audit_organization_members();
