import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Reading and writing the sign-in cookie. Nothing here touches Next's request
 * APIs, so proxy.ts can use it as well as pages, routes and actions.
 */

/**
 * Holds proof of sign-in. The browser's scripts can't read it. The name dates
 * from when only admins could sign in; keeping it keeps existing admins
 * signed in.
 */
export const SESSION_COOKIE = "tmg_admin";
export const SESSION_DAYS = 30;

/** Holds the state, PKCE verifier and return path while the visitor is at Google. */
export const OAUTH_COOKIE = "tmg_admin_oauth";

/** Admins can do everything members can. */
export type Role = "member" | "admin";

export type Session = {
  role: Role;
  /** Null for the admin password, which isn't tied to anyone. */
  email: string | null;
};

export function hasRole(session: Session | null, role: Role) {
  if (!session) return false;
  return role === "member" || session.role === "admin";
}

/**
 * Which signed-in role each part of the site needs. proxy.ts sends visitors
 * without it to sign in, and each page checks again with requireUser() or
 * requireAdmin(). Add a path here to put it behind sign-in.
 */
export const protectedPaths: { prefix: string; role: Role }[] = [
  { prefix: "/admin", role: "admin" },
  { prefix: "/account", role: "member" },
];

/** Where visitors sign in, so they're never sent there in a loop. */
export const signInPaths = ["/login", "/admin/login"];

function underPath(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function requiredRole(pathname: string): Role | null {
  if (signInPaths.some((path) => underPath(pathname, path))) return null;
  return (
    protectedPaths.find((rule) => underPath(pathname, rule.prefix))?.role ??
    null
  );
}

/**
 * A path on this site to return to after signing in. Anything else, such as
 * "//evil.example" or "https://…", falls back so sign-in can't be used to
 * send people elsewhere.
 */
export function safeNext(value: unknown, fallback = "/account") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\")) return fallback;
  return value;
}

function password() {
  return process.env.ADMIN_PASSWORD || null;
}

/** Lowercased addresses from ADMIN_EMAILS (comma-separated). */
export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/** Any Google account can sign in as a member once these are set. */
export function googleConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
}

/** Google can only make someone an admin if ADMIN_EMAILS lists them. */
export function googleAdminConfigured() {
  return googleConfigured() && adminEmails().length > 0;
}

export function adminConfigured() {
  return password() !== null || googleAdminConfigured();
}

/** Must match an "Authorized redirect URI" in Google Cloud exactly. */
export function googleCallbackUrl(origin: string) {
  return new URL("/admin/login/google/callback", origin).href;
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
 * Checks the signature and expiry. The role is decided on every request from
 * ADMIN_EMAILS, so removing someone from the list takes away admin at once
 * (they stay signed in as a member).
 */
function googleSession(cookie: string): Session | null {
  const [prefix, encodedEmail, expires, signature] = cookie.split(".");
  if (prefix !== "g" || !encodedEmail || !expires || !signature) return null;
  const expected = sign(`g.${encodedEmail}.${expires}`);
  if (!expected || !safeEqual(signature, expected)) return null;
  if (!(Number(expires) > Date.now())) return null;
  const email = Buffer.from(encodedEmail, "base64url").toString();
  return { email, role: adminEmails().includes(email) ? "admin" : "member" };
}

export const sessionCookieOptions = {
  maxAge: SESSION_DAYS * 24 * 60 * 60,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};

/**
 * The password session cookie holds a value derived from the password, so
 * changing ADMIN_PASSWORD signs those sessions out.
 */
export function passwordSessionToken() {
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

/** Who the cookie belongs to, or null if it's missing, forged or expired. */
export function readSession(cookie: string | undefined): Session | null {
  if (!cookie) return null;
  const google = googleSession(cookie);
  if (google) return google;
  const token = passwordSessionToken();
  if (token !== null && safeEqual(cookie, token)) {
    return { email: null, role: "admin" };
  }
  return null;
}
