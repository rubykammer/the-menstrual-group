"use client";

import { useFormStatus } from "react-dom";

export function DeleteButton({ email }: { email: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={`Remove ${email}`}
      onClick={(event) => {
        if (!confirm(`Remove ${email} from the list? This can't be undone.`)) {
          event.preventDefault();
        }
      }}
      className="rounded-full px-3 py-1 text-sm font-bold text-accent-strong hover:bg-blush disabled:opacity-50"
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
