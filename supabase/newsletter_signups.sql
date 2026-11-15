-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Stores newsletter signups from the site's form.

create table if not exists public.newsletter_signups (
  id bigint generated always as identity primary key,
  email text not null check (char_length(email) <= 254),
  created_at timestamptz not null default now()
);

-- One row per address, ignoring capitalisation.
create unique index if not exists newsletter_signups_email_key
  on public.newsletter_signups (lower(email));

-- The site talks to Supabase with the publishable key, which is public. Row
-- Level Security plus this single policy means that key can add a signup but
-- can never read, change or delete the list. You can still see every row in
-- the dashboard's Table Editor.
alter table public.newsletter_signups enable row level security;

drop policy if exists "Anyone can sign up" on public.newsletter_signups;
create policy "Anyone can sign up"
  on public.newsletter_signups
  for insert
  to anon
  with check (true);
