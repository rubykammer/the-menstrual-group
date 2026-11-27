"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { setFavorite } from "@/app/actions/favorites";
import type { FavoriteKind } from "@/lib/favorites";

type State = "loading" | "signed-out" | "saved" | "unsaved" | "error";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const pill =
  "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 font-extrabold transition-colors duration-200";

/**
 * Saves an article or product to the member's favourites. Pages are the same
 * for everyone, so it checks the visitor's status after loading.
 */
export function FavoriteButton({
  kind,
  slug,
  className = "",
}: {
  kind: FavoriteKind;
  slug: string;
  className?: string;
}) {
  const pathname = usePathname();
  const [state, setState] = useState<State>("loading");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/favorites?${new URLSearchParams({ kind, slug })}`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data: { signedIn?: boolean; saved?: boolean }) => {
        if (!data.signedIn) setState("signed-out");
        else setState(data.saved ? "saved" : "unsaved");
      })
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") setState("error");
      });
    return () => controller.abort();
  }, [kind, slug]);

  if (state === "loading" || state === "error") {
    // Keeps the space so the page doesn't jump when it appears.
    return (
      <span className={`inline-block h-11 ${className}`} aria-hidden="true" />
    );
  }

  if (state === "signed-out") {
    return (
      <Link
        href={`/login?${new URLSearchParams({ next: pathname })}`}
        className={`${pill} border-line text-muted hover:border-primary-strong hover:text-primary-strong ${className}`}
      >
        <HeartIcon filled={false} />
        Sign in to save
      </Link>
    );
  }

  const saved = state === "saved";
  return (
    <button
      type="button"
      aria-pressed={saved}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await setFavorite(kind, slug, !saved);
          if (result.status === "ok")
            setState(result.saved ? "saved" : "unsaved");
          else if (result.status === "signed-out") setState("signed-out");
        })
      }
      className={`${pill} ${
        saved
          ? "border-accent-strong bg-mist text-accent-strong"
          : "border-line text-foreground hover:border-accent-strong hover:text-accent-strong"
      } disabled:opacity-60 ${className}`}
    >
      <HeartIcon filled={saved} />
      {saved ? "Saved to favourites" : "Save to favourites"}
    </button>
  );
}
