-- Run once in Supabase, after users.sql and forum.sql:
-- SQL Editor → New query → paste → Run.
-- Everything people see under /account: editing their forum posts, their
-- favourite articles and products, and their quiz results.

-- When a forum post was last edited, or null if never.
alter table public.forum_posts
  add column if not exists edited_at timestamptz;

create table if not exists public.favorites (
  email text not null
    references public.users (email) on update cascade on delete cascade,
  -- "article" (a slug in content/posts) or "product" (a slug in lib/products.ts).
  kind text not null check (kind in ('article', 'product')),
  slug text not null check (char_length(slug) <= 100),
  created_at timestamptz not null default now(),
  primary key (email, kind, slug)
);

create table if not exists public.quiz_results (
  id bigint generated always as identity primary key,
  email text not null
    references public.users (email) on update cascade on delete cascade,
  -- A quiz slug from lib/quizzes.ts.
  quiz text not null check (char_length(quiz) <= 40),
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  -- The option picked for each question, in order.
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists quiz_results_email_idx
  on public.quiz_results (email, created_at desc);

-- Only the site's server, with the secret key, can read or write these.
alter table public.favorites enable row level security;
alter table public.quiz_results enable row level security;

notify pgrst, 'reload schema';
