"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import {
  LINK_COOKIE,
  SESSION_COOKIE,
  SESSION_DAYS,
  getAdminSupabase,
  passwordMatches,
  requireAdmin,
  sessionToken,
} from "@/lib/admin";

export type SignInState = { error?: string };

export async function signIn(
  _state: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const attempt = String(formData.get("password") ?? "");
  const token = sessionToken();

  if (!token || !passwordMatches(attempt)) {
    // Slows down anyone trying passwords one after another.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { error: "That password isn't right." };
  }

  const options = {
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
  const store = await cookies();
  store.set(SESSION_COOKIE, token, { ...options, httpOnly: true });
  store.set(LINK_COOKIE, "1", options);

  redirect("/admin");
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(LINK_COOKIE);
  redirect("/");
}

export async function deleteSignup(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const supabase = getAdminSupabase();
  if (!supabase || !Number.isInteger(id)) return;

  const { error } = await supabase
    .from("newsletter_signups")
    .delete()
    .eq("id", id);
  if (error) console.error("Deleting signup failed:", error.message);

  refresh();
}
