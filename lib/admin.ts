import { createClient } from "@supabase/supabase-js";

export type Signup = { id: number; email: string; created_at: string };

/**
 * Reading or deleting signups needs the secret key, which bypasses Row Level
 * Security. It must only ever be used on the server: never give it a
 * NEXT_PUBLIC_ name.
 */
export function getAdminSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
