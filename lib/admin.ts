import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

/** Holds proof of sign-in. The browser's scripts can't read it. */
export const SESSION_COOKIE = "tmg_admin";
export const SESSION_DAYS = 30;

function password() {
  return process.env.ADMIN_PASSWORD || null;
}

export function adminConfigured() {
  return password() !== null || googleConfigured();
}

/** Lowercased addresses from ADMIN_EMAILS (comma-separated). */
export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/** Holds the state and PKCE verifier while the visitor is at Google. */
export const OAUTH_COOKIE = "tmg_admin_oauth";

/** Must match an "Authorized redirect URI" in Google Cloud exactly. */
export function googleCallbackUrl(origin: string) {
  return new URL("/admin/login/google/callback", origin).href;
}

export function googleConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      adminEmails().length > 0,
  );
}

/**
 * Google sessions are signed with a key derived from the client secret, so
 * rotating the secret signs every Google session out.
 */
function googleSigningKey() {
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update("tmg-admin-google").digest();
}

function sign(value: string) {
  const key = googleSigningKey();
  if (!key) return null;
  return createHmac("sha256", key).update(value).digest("base64url");
}

/** A cookie value naming who signed in with Google and until when. */
export function googleSessionToken(email: string) {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `g.${Buffer.from(email).toString("base64url")}.${expires}`;
  const signature = sign(payload);
  return signature ? `${payload}.${signature}` : null;
}

/**
 * Checks the signature and expiry, and that the address is still in
 * ADMIN_EMAILS, so removing someone from the list signs them out.
 */
function googleSessionValid(cookie: string) {
  const [prefix, encodedEmail, expires, signature] = cookie.split(".");
  if (prefix !== "g" || !encodedEmail || !expires || !signature) return false;
  const expected = sign(`g.${encodedEmail}.${expires}`);
  if (!expected || !safeEqual(signature, expected)) return false;
  if (!(Number(expires) > Date.now())) return false;
  const email = Buffer.from(encodedEmail, "base64url").toString();
  return adminEmails().includes(email);
}

export const sessionCookieOptions = {
  maxAge: SESSION_DAYS * 24 * 60 * 60,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};

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
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return false;
  if (googleSessionValid(cookie)) return true;
  const token = sessionToken();
  return token !== null && safeEqual(cookie, token);
}

/**
 * Without this, a build that runs before ADMIN_PASSWORD is set prerenders
 * the admin pages as a permanent 404, which adding the variable later
 * doesn't undo. Waiting for a request makes every visit check afresh.
 */
export async function waitForRequest() {
  await connection();
}

/**
 * Call at the top of every admin page, route and action. Without an
 * ADMIN_PASSWORD or Google sign-in set up, the live site has no admin at all (404), while `next dev`
 * sends you to the sign-in page, which explains how to set one.
 */
export async function requireAdmin() {
  await waitForRequest();
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
