"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import {
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
  (await cookies()).set(SESSION_COOKIE, token, { ...options, httpOnly: true });

  redirect("/admin");
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
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
