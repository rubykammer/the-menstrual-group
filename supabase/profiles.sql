-- Run once in Supabase, after users.sql: SQL Editor → New query → paste → Run.
-- Adds the profile people edit on /account, and a storage bucket for their
-- photos.

alter table public.users
  add column if not exists display_name text
    check (char_length(display_name) <= 60),
  add column if not exists bio text
    check (char_length(bio) <= 280),
  -- The photo's path inside the avatars bucket, or null for none.
  add column if not exists avatar_path text;

-- Photos are public so pages can show them without signing in. Only the
-- site's server (with the secret key) can upload or delete them, because the
-- bucket has no policies that let the publishable key write.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  1048576,
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

notify pgrst, 'reload schema';
