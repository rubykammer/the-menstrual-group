import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { roleFor } from "./roles";
import {
  SESSION_COOKIE,
  adminConfigured,
  readSession,
  type Session,
} from "./session";

/**
 * Without this, a build that runs before the sign-in settings are set
 * prerenders these pages once for everyone, which adding the variables later
 * doesn't undo. Waiting for a request makes every visit check afresh.
 */
export async function waitForRequest() {
  await connection();
}

/**
 * The signed-in visitor, or null, with their current role from ADMIN_EMAILS
 * or the users table. Read once per request.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  await waitForRequest();
  const session = readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session?.email) return session;
  return { ...session, role: await roleFor(session.email) };
});

/**
 * Call at the top of every members-only page, route and action. Visitors who
 * aren't signed in go to /login and come back to `returnTo` afterwards.
 */
export async function requireUser(returnTo = "/account") {
  const session = await getSession();
  if (!session) {
    redirect(`/login?${new URLSearchParams({ next: returnTo })}`);
  }
  return session;
}

/**
 * Call at the top of every admin page, route and action. Without an
 * ADMIN_PASSWORD or Google admins set up, the live site has no admin at all
 * (404), while `next dev` sends you to the sign-in page, which explains how
 * to set one. Members who aren't admins see the sign-in page's "not an
 * admin" message.
 */
export async function requireAdmin() {
  await waitForRequest();
  if (!adminConfigured() && process.env.NODE_ENV !== "development") {
    notFound();
  }
  const session = await getSession();
  if (session?.role !== "admin") redirect("/admin/login");
  return session;
}
