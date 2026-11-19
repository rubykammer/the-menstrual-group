import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { ProductCard } from "@/components/ProductCard";
import { requireUser } from "@/lib/auth";
import { listFavorites } from "@/lib/favorites";
import { RemoveFavorite } from "./RemoveFavorite";

export const metadata: Metadata = { title: "Favourites" };

function Empty({ what, href }: { what: string; href: string }) {
  return (
    <p className="mt-4 rounded-card bg-surface p-6 text-muted shadow-soft">
      Nothing saved yet. Tap{" "}
      <span className="font-bold text-foreground">Save to favourites</span> on
      any{" "}
      <Link href={href} className="font-bold text-primary-strong underline">
        {what}
      </Link>{" "}
      to keep it here.
    </p>
  );
}

export default async function FavouritesPage() {
  const session = await requireUser("/account/favourites");

  if (!session.email) {
    return (
      <p className="max-w-xl">
        You signed in with the admin password, which isn&apos;t tied to anyone.
        Sign in with Google to save favourites.
      </p>
    );
  }

  const result = await listFavorites(session.email);

  if (result.status !== "ok") {
    return (
      <p className="max-w-xl rounded-card bg-honey p-6">
        {result.status === "not-set-up"
          ? "Favourites aren't set up yet. In Supabase, run supabase/activity.sql from this project."
          : `Couldn't load your favourites: ${result.message}`}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="fav-articles">
        <h2 id="fav-articles" className="text-2xl sm:text-3xl">
          Articles
        </h2>
        {result.articles.length === 0 ? (
          <Empty what="article" href="/blog" />
        ) : (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.articles.map((post) => (
              <li key={post.slug} className="relative">
                <PostCard post={post} />
                <div className="absolute top-3 right-3">
                  <RemoveFavorite
                    kind="article"
                    slug={post.slug}
                    name={post.title}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="fav-products">
        <h2 id="fav-products" className="text-2xl sm:text-3xl">
          Products
        </h2>
        {result.products.length === 0 ? (
          <Empty what="product" href="/products" />
        ) : (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.products.map((product) => (
              <li key={product.slug} className="relative">
                <ProductCard product={product} />
                <div className="absolute top-3 right-3">
                  <RemoveFavorite
                    kind="product"
                    slug={product.slug}
                    name={product.name}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
