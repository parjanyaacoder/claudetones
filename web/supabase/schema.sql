-- claudetones — Supabase schema
--
-- Run this in the Supabase SQL editor (or `supabase db push`) on the project you
-- point SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY at. The webhook inserts licenses
-- and /api/verify reads + updates the devices array.
--
-- The web app talks to this table over PostgREST with the SERVICE ROLE key, so
-- RLS is enabled with no policies: anon/authenticated clients get nothing, the
-- service role bypasses RLS.

create table if not exists public.licenses (
  key         text primary key,
  email       text,
  payment_id  text unique,
  tier        text not null default 'pro',
  devices     text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists licenses_payment_id_idx on public.licenses (payment_id);
create index if not exists licenses_email_idx on public.licenses (lower(email));

alter table public.licenses enable row level security;

-- No policies on purpose: only the service role (server-side) can read/write.
