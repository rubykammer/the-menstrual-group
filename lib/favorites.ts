import { getAdminSupabase } from "./admin";
import { getPost, type Post } from "./posts";
import { getProduct, type Product } from "./products";
import { isMissingTable } from "./roles";

/**
 * Favourite articles and products (supabase/activity.sql). Only real slugs
 * can be saved, so the table never fills with junk.
 */

export type FavoriteKind = "article" | "product";

export function isFavoriteKind(value: unknown): value is FavoriteKind {
  return value === "article" || value === "product";
}

export function favoriteExists(kind: FavoriteKind, slug: string) {
  return kind === "article"
    ? Boolean(getPost(slug))
    : Boolean(getProduct(slug));
}

export async function isFavorite(
  email: string,
  kind: FavoriteKind,
  slug: string,
) {
  const supabase = getAdminSupabase();
  if (!supabase) return false;
  const { data } = await supabase
    .from("favorites")
    .select("slug")
    .eq("email", email.toLowerCase())
    .eq("kind", kind)
    .eq("slug", slug)
    .maybeSingle();
  return Boolean(data);
}

export type Favorites =
  | { status: "ok"; articles: Post[]; products: Product[] }
  | { status: "not-set-up" }
  | { status: "error"; message: string };

/** Newest first. Anything since removed from the site is skipped. */
export async function listFavorites(email: string): Promise<Favorites> {
  const supabase = getAdminSupabase();
  if (!supabase) return { status: "not-set-up" };

  const { data, error } = await supabase
    .from("favorites")
    .select("kind, slug")
    .eq("email", email.toLowerCase())
    .order("created_at", { ascending: false });
  if (error) {
    return isMissingTable(error)
      ? { status: "not-set-up" }
      : { status: "error", message: error.message };
  }

  const articles: Post[] = [];
  const products: Product[] = [];
  for (const row of data) {
    if (row.kind === "article") {
      const post = getPost(row.slug as string);
      if (post) articles.push(post);
    } else {
      const product = getProduct(row.slug as string);
      if (product) products.push(product);
    }
  }
  return { status: "ok", articles, products };
}
