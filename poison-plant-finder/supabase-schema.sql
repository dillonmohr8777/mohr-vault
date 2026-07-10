-- ============================================================================
-- Poison Plant Finder — Supabase schema
-- Run this in your Supabase project: SQL Editor -> New query -> paste -> Run.
-- It creates the tables for favorites, notes, collections and sightings, and
-- enables row-level security so each signed-in user can only see their own data.
-- ============================================================================

-- FAVORITES ------------------------------------------------------------------
create table if not exists public.favorites (
  user_id    uuid references auth.users (id) on delete cascade not null,
  plant_id   text not null,
  created_at timestamptz default now(),
  primary key (user_id, plant_id)
);

-- NOTES ----------------------------------------------------------------------
create table if not exists public.notes (
  user_id    uuid references auth.users (id) on delete cascade not null,
  plant_id   text not null,
  body       text,
  updated_at timestamptz default now(),
  primary key (user_id, plant_id)
);

-- COLLECTIONS (custom lists) -------------------------------------------------
create table if not exists public.collections (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete cascade not null,
  name       text not null,
  created_at timestamptz default now()
);

create table if not exists public.collection_items (
  collection_id uuid references public.collections (id) on delete cascade not null,
  plant_id      text not null,
  created_at    timestamptz default now(),
  primary key (collection_id, plant_id)
);

-- SIGHTINGS ------------------------------------------------------------------
create table if not exists public.sightings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete cascade not null,
  plant_id   text,
  category   text,
  lat        double precision,
  lng        double precision,
  place      text,
  seen_on    date,
  notes      text,
  created_at timestamptz default now()
);

-- ROW-LEVEL SECURITY ---------------------------------------------------------
alter table public.favorites        enable row level security;
alter table public.notes            enable row level security;
alter table public.collections      enable row level security;
alter table public.collection_items enable row level security;
alter table public.sightings        enable row level security;

-- Owner-only access on the user_id tables
create policy "own favorites" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own notes" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own collections" on public.collections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own sightings" on public.sightings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- collection_items are owned via their parent collection
create policy "own collection items" on public.collection_items
  for all
  using (exists (select 1 from public.collections c
                 where c.id = collection_items.collection_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.collections c
                 where c.id = collection_items.collection_id and c.user_id = auth.uid()));
