import { getAdminSupabase } from "./admin";
import { adminEmails, type Role } from "./session";

/**
 * Roles saved in Supabase's `users` table (see supabase/users.sql), which
 * admins change from /admin. Addresses in ADMIN_EMAILS are always admins, so
 * nobody can lock everyone out from the page.
 */

export type User = {
  email: string;
  role: Role;
  created_at: string;
  last_signed_in_at: string;
};

export function isEnvAdmin(email: string) {
  return adminEmails().includes(email.toLowerCase());
}

/**
 * The role for a Google address. If the table is missing or Supabase can't be
 * reached, anyone not in ADMIN_EMAILS counts as a member, never an admin.
 */
export async function roleFor(email: string): Promise<Role> {
  if (isEnvAdmin(email)) return "admin";
  const supabase = getAdminSupabase();
  if (!supabase) return "member";
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) {
    if (!isMissingTable(error)) {
      console.error("Looking up a role failed:", error.message);
    }
    return "member";
  }
  return data?.role === "admin" ? "admin" : "member";
}

/** Adds the address on its first sign-in, keeping any role it already has. */
export async function recordSignIn(email: string) {
  const supabase = getAdminSupabase();
  if (!supabase) return;
  const { error } = await supabase.from("users").upsert(
    {
      email: email.toLowerCase(),
      last_signed_in_at: new Date().toISOString(),
    },
    { onConflict: "email" },
  );
  if (error && !isMissingTable(error)) {
    console.error("Recording a sign-in failed:", error.message);
  }
}

// PostgREST's and Postgres's codes for "that table doesn't exist".
export function isMissingTable(error: { code?: string }) {
  return error.code === "PGRST205" || error.code === "42P01";
}

/**
 * Makes sure the address has a users row, which favourites, quiz results and
 * forum posts point to. People who signed in before the table existed have
 * none until their next sign-in.
 */
export async function ensureUserRow(email: string) {
  const supabase = getAdminSupabase();
  if (!supabase) return;
  await supabase
    .from("users")
    .upsert(
      { email: email.toLowerCase() },
      { onConflict: "email", ignoreDuplicates: true },
    );
}
