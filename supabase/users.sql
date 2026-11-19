-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Lists everyone who has signed in with Google, and their role. Admins change
-- roles from the Users section of /admin. Addresses in ADMIN_EMAILS are
-- always admins, whatever this table says.

create table if not exists public.users (
  -- Stored lowercased by the site.
  email text primary key check (char_length(email) <= 254),
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  last_signed_in_at timestamptz not null default now()
);

-- Row Level Security with no policies means the public publishable key can't
-- read or change this table at all. Only the site's server, using the secret
-- key, can. You can still see every row in the dashboard's Table Editor.
alter table public.users enable row level security;
