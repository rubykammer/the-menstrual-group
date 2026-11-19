"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSupabase } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import {
  SESSION_COOKIE,
  passwordMatches,
  passwordSessionToken,
  sessionCookieOptions,
} from "@/lib/session";
import { isValidEmail } from "@/lib/email";

export type SignInState = { error?: string };

export async function signIn(
  _state: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const attempt = String(formData.get("password") ?? "");
  const token = passwordSessionToken();

  if (!token || !passwordMatches(attempt)) {
    // Slows down anyone trying passwords one after another.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { error: "That password isn't right." };
  }

  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);

  redirect("/admin");
}

export type SignupFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Changes on every success, so a form can reset itself. */
  savedAt?: number;
};

function cleanEmail(formData: FormData) {
  return String(formData.get("email") ?? "").trim();
}

// 23505 is Postgres's unique-violation code: the address is already listed
// (the index ignores capitalisation).
function saveError(error: { code?: string; message: string }, action: string) {
  if (error.code === "23505") {
    return {
      status: "error" as const,
      message: "That address is already on the list.",
    };
  }
  console.error(`${action} signup failed:`, error.message);
  return {
    status: "error" as const,
    message: "Couldn't save. Please try again.",
  };
}

export async function createSignup(
  _state: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  await requireAdmin();

  const email = cleanEmail(formData);
  if (!isValidEmail(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const supabase = getAdminSupabase();
  if (!supabase) return { status: "error", message: "Supabase isn't set up." };

  const { error } = await supabase.from("newsletter_signups").insert({ email });
  if (error) return saveError(error, "Adding");

  refresh();
  return { status: "success", message: `Added ${email}.`, savedAt: Date.now() };
}

export async function updateSignup(
  _state: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const email = cleanEmail(formData);
  if (!Number.isInteger(id))
    return { status: "error", message: "Unknown signup." };
  if (!isValidEmail(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const supabase = getAdminSupabase();
  if (!supabase) return { status: "error", message: "Supabase isn't set up." };

  const { data, error } = await supabase
    .from("newsletter_signups")
    .update({ email })
    .eq("id", id)
    .select("id");
  if (error) return saveError(error, "Updating");
  if (!data?.length) {
    return { status: "error", message: "That signup no longer exists." };
  }

  refresh();
  return { status: "success", savedAt: Date.now() };
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
