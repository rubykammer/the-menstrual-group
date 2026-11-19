"use client";

import { useTransition } from "react";
import { setFavorite } from "@/app/actions/favorites";
import type { FavoriteKind } from "@/lib/favorites";

/** Unsaves an item from the favourites list; the page refreshes without it. */
export function RemoveFavorite({
  kind,
  slug,
  name,
}: {
  kind: FavoriteKind;
  slug: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => void (await setFavorite(kind, slug, false)))
      }
      aria-label={`Remove ${name} from favourites`}
      className="relative z-10 rounded-full bg-surface/90 px-3 py-1 text-sm font-bold text-accent-strong shadow-soft hover:bg-blush disabled:opacity-50"
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
