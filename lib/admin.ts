import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

/**
 * The admin pages have no sign-in yet, so they only exist while running
 * `npm run dev`. On the live site every /admin URL is a 404, which keeps the
 * subscriber list private until real authentication is added.
 */
export const adminEnabled = process.env.NODE_ENV === "development";

export function requireAdmin() {
  if (!adminEnabled) notFound();
}

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
