"use client";

import { useEffect } from "react";
import { ButtonLink } from "@/components/ButtonLink";

/**
 * The "something broke on our side" message, shared by app/error.tsx (inside
 * the site layout) and app/global-error.tsx (when the layout itself failed).
 */
export function ErrorMessage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Server errors carry a digest that matches the server logs; showing it
  // lets someone quote it when they tell us what happened.
  const digest =
    error instanceof Error && "digest" in error
      ? String((error as Error & { digest?: string }).digest ?? "")
      : "";

  return (
    <div className="page-width py-24 text-center">
      <p className="font-extrabold tracking-wide text-primary-strong uppercase">
        Error 500
      </p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Something went wrong on our end</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
        It&apos;s not you, it&apos;s us. Give it another try in a moment, and
        if it keeps happening, head back home and try again later.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex cursor-pointer items-center justify-center rounded-full bg-primary-strong px-6 py-3 font-extrabold text-on-primary transition-all duration-200 hover:bg-primary-hover motion-safe:hover:-translate-y-0.5"
        >
          Try again
        </button>
        <ButtonLink href="/" variant="secondary">
          Go to the home page
        </ButtonLink>
      </div>
      {digest && (
        <p className="mt-10 text-sm text-muted">
          Reference: <code>{digest}</code>
        </p>
      )}
    </div>
  );
}
