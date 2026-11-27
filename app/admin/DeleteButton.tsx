"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

const button = "rounded-full px-3 py-1 text-sm font-bold disabled:opacity-50";

/**
 * Asks on the page rather than with confirm(), which some browsers (and
 * embedded previews) block, silently answering "Cancel".
 */
export function DeleteButton({ email }: { email: string }) {
  const { pending } = useFormStatus();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Remove ${email}`}
        className={`${button} text-accent-strong hover:bg-mist`}
      >
        Remove
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1">
      <button
        type="submit"
        disabled={pending}
        autoFocus
        aria-label={`Yes, remove ${email}. This can't be undone.`}
        className={`${button} bg-accent-strong text-on-primary`}
      >
        {pending ? "Removing…" : "Yes, remove"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => setConfirming(false)}
        className={`${button} text-muted hover:bg-peach`}
      >
        Keep
      </button>
    </span>
  );
}
