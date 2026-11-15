import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ADMIN_LINK_COOKIE } from "./adminLink";

/** Holds proof of sign-in. The browser's scripts can't read it. */
export const SESSION_COOKIE = "tmg_admin";
export const LINK_COOKIE = ADMIN_LINK_COOKIE;
export const SESSION_DAYS = 30;

function password() {
  return process.env.ADMIN_PASSWORD || null;
}

export function adminConfigured() {
  return password() !== null;
}

/**
 * The session cookie holds a value derived from the password, so changing
 * ADMIN_PASSWORD signs everyone out.
 */
export function sessionToken() {
  const secret = password();
  if (!secret) return null;
  return createHmac("sha256", secret).update("tmg-admin-session").digest("hex");
}

// Hashing first gives both sides the same length, which timingSafeEqual needs.
export function safeEqual(a: string, b: string) {
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(a), hash(b));
}

export function passwordMatches(attempt: string) {
  const secret = password();
  return secret !== null && safeEqual(attempt, secret);
}

export async function isSignedIn() {
  const token = sessionToken();
  if (!token) return false;
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  return cookie !== undefined && safeEqual(cookie, token);
}

/**
 * Call at the top of every admin page, route and action. Without an
 * ADMIN_PASSWORD the live site has no admin at all (404), while `next dev`
 * sends you to the sign-in page, which explains how to set one.
 */
export async function requireAdmin() {
  if (!adminConfigured() && process.env.NODE_ENV !== "development") {
    notFound();
  }
  if (!(await isSignedIn())) redirect("/admin/login");
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
