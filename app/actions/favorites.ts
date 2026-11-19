"use server";

import { refresh } from "next/cache";
import { getAdminSupabase } from "@/lib/admin";
import { getSession } from "@/lib/auth";
import { favoriteExists, isFavoriteKind } from "@/lib/favorites";
import { ensureUserRow } from "@/lib/roles";

export type FavoriteResult =
  | { status: "ok"; saved: boolean }
  | { status: "signed-out" }
  | { status: "error" };

/** Saves or unsaves an article or product for the signed-in member. */
export async function setFavorite(
  kind: unknown,
  slug: unknown,
  saved: boolean,
): Promise<FavoriteResult> {
  if (
    !isFavoriteKind(kind) ||
    typeof slug !== "string" ||
    !favoriteExists(kind, slug)
  ) {
    return { status: "error" };
  }

  const session = await getSession();
  if (!session?.email) return { status: "signed-out" };
  const email = session.email.toLowerCase();

  const supabase = getAdminSupabase();
  if (!supabase) return { status: "error" };

  if (saved) {
    await ensureUserRow(email);
    const { error } = await supabase
      .from("favorites")
      .upsert(
        { email, kind, slug },
        { onConflict: "email,kind,slug", ignoreDuplicates: true },
      );
    if (error) {
      console.error("Saving a favourite failed:", error.message);
      return { status: "error" };
    }
  } else {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("email", email)
      .eq("kind", kind)
      .eq("slug", slug);
    if (error) {
      console.error("Removing a favourite failed:", error.message);
      return { status: "error" };
    }
  }

  refresh();
  return { status: "ok", saved };
}
