"use server";

import { refresh } from "next/cache";
import { getAdminSupabase, requireAdmin } from "@/lib/admin";

export async function deleteSignup(formData: FormData) {
  requireAdmin();

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
