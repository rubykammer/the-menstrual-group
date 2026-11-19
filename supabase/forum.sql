-- Run once in Supabase, after users.sql and profiles.sql:
-- SQL Editor → New query → paste → Run.
-- Conversations (threads) and the posts in them. A thread's first post is
-- its opening message.

create table if not exists public.forum_threads (
  id bigint generated always as identity primary key,
  -- One of the categories in lib/forum.ts.
  category text not null check (char_length(category) <= 40),
  title text not null check (char_length(title) between 3 and 120),
  author_email text not null
    references public.users (email) on update cascade on delete cascade,
  created_at timestamptz not null default now(),
  last_post_at timestamptz not null default now(),
  post_count integer not null default 0
);

create table if not exists public.forum_posts (
  id bigint generated always as identity primary key,
  thread_id bigint not null
    references public.forum_threads (id) on delete cascade,
  author_email text not null
    references public.users (email) on update cascade on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);

create index if not exists forum_threads_last_post_at_idx
  on public.forum_threads (last_post_at desc);
create index if not exists forum_posts_thread_id_idx
  on public.forum_posts (thread_id, created_at);
create index if not exists forum_posts_author_idx
  on public.forum_posts (author_email, created_at desc);

-- Keeps each thread's post count and latest activity up to date.
create or replace function public.forum_post_counts()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.forum_threads
      set post_count = post_count + 1, last_post_at = new.created_at
      where id = new.thread_id;
  elsif tg_op = 'DELETE' then
    update public.forum_threads
      set post_count = greatest(post_count - 1, 0)
      where id = old.thread_id;
  end if;
  return null;
end;
$$;

drop trigger if exists forum_post_counts on public.forum_posts;
create trigger forum_post_counts
  after insert or delete on public.forum_posts
  for each row execute function public.forum_post_counts();

-- Row Level Security with no policies: the public publishable key can't read
-- or write the forum. Only the site's server, using the secret key, can, and
-- it checks that people are signed in first.
alter table public.forum_threads enable row level security;
alter table public.forum_posts enable row level security;

notify pgrst, 'reload schema';
