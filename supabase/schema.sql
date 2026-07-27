-- =====================================================================
-- MetodePenelitian.com — Supabase schema (v1.0)
-- Traceability: BRD -> PRD -> FRD -> API -> ERD
-- Run this in the Supabase SQL editor, or via `supabase db push`.
-- =====================================================================

-- Extensions
create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "pg_trgm";        -- fuzzy search

-- ---------------------------------------------------------------------
-- Roles / Users  (IA §4 User Roles)
-- Auth is handled by Supabase Auth (auth.users). We keep an app-level
-- profile table linked 1:1 to auth.users.
-- ---------------------------------------------------------------------
create type user_role as enum (
  'guest', 'member', 'premium', 'instructor', 'contributor', 'admin', 'super_admin'
);

create table if not exists profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  full_name    text,
  avatar_url   text,
  role         user_role not null default 'member',
  locale       text not null default 'id',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Content taxonomy (IA §5)
-- ---------------------------------------------------------------------
create table if not exists categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name_id    text not null,           -- Bahasa Indonesia
  name_en    text not null,           -- English
  parent_id  uuid references categories (id) on delete set null,
  sort_order int not null default 0
);

create table if not exists tags (
  id    uuid primary key default gen_random_uuid(),
  slug  text unique not null,
  name  text not null
);

-- ---------------------------------------------------------------------
-- Knowledge Base / Articles  (FR-002)
-- ---------------------------------------------------------------------
create table if not exists articles (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  category_id     uuid references categories (id) on delete set null,
  author_id       uuid references profiles (id) on delete set null,
  title_id        text not null,
  title_en        text,
  excerpt_id      text,
  excerpt_en      text,
  body_id         text,               -- HTML/Markdown (Bahasa Indonesia)
  body_en         text,               -- HTML/Markdown (English)
  reading_minutes int not null default 5,
  difficulty      text default 'beginner',   -- beginner|intermediate|advanced
  status          text not null default 'published', -- draft|published|archived
  published_at    timestamptz,
  updated_at      timestamptz not null default now(),
  -- full-text search vector (Bahasa Indonesia + English)
  search_tsv      tsvector generated always as (
                    to_tsvector('simple', coalesce(title_id,'') || ' ' ||
                    coalesce(title_en,'') || ' ' || coalesce(excerpt_id,'') || ' ' ||
                    coalesce(excerpt_en,''))
                  ) stored
);
create index if not exists articles_search_idx on articles using gin (search_tsv);
create index if not exists articles_title_trgm_idx on articles using gin (title_id gin_trgm_ops);

create table if not exists article_tags (
  article_id uuid references articles (id) on delete cascade,
  tag_id     uuid references tags (id) on delete cascade,
  primary key (article_id, tag_id)
);

create table if not exists article_feedback (
  id         uuid primary key default gen_random_uuid(),
  article_id uuid references articles (id) on delete cascade,
  user_id    uuid references profiles (id) on delete set null,
  helpful    boolean not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Research Tools history  (Research Tools module)
-- ---------------------------------------------------------------------
create table if not exists tool_history (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references profiles (id) on delete cascade,
  tool       text not null,          -- 'sample_size' | 'slovin' | 'cronbach' | 'citation'
  input      jsonb not null,
  output     jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists tool_history_user_idx on tool_history (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- AI Research requests  (FR-003 AI Title Generator, etc.)
-- ---------------------------------------------------------------------
create table if not exists ai_requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles (id) on delete cascade,
  feature     text not null,          -- 'title_generator' | 'research_gap' | ...
  prompt      text not null,
  response    jsonb,
  tokens_used int,
  status      text not null default 'completed', -- pending|completed|failed
  created_at  timestamptz not null default now()
);
create index if not exists ai_requests_user_idx on ai_requests (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- Repository templates (Repository module)
-- ---------------------------------------------------------------------
create table if not exists repository_items (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  kind          text not null,        -- proposal|thesis|dissertation|dataset|template
  description   text,
  file_path     text,                 -- Supabase Storage path
  is_premium    boolean not null default false,
  downloads     int not null default 0,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Row Level Security (baseline — tighten per environment)
-- ---------------------------------------------------------------------
alter table profiles         enable row level security;
alter table tool_history     enable row level security;
alter table ai_requests      enable row level security;
alter table article_feedback enable row level security;

-- Public content is readable by anyone
alter table articles         enable row level security;
alter table categories       enable row level security;
alter table tags             enable row level security;
alter table repository_items enable row level security;

create policy "public read articles"   on articles         for select using (status = 'published');
create policy "public read categories" on categories       for select using (true);
create policy "public read tags"        on tags            for select using (true);
create policy "public read repo"        on repository_items for select using (true);

-- Users can read/write only their own rows
create policy "own profile read"   on profiles      for select using (auth.uid() = id);
create policy "own profile update" on profiles      for update using (auth.uid() = id);
create policy "own tool history"   on tool_history  for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own ai requests"    on ai_requests   for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own feedback"       on article_feedback for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
