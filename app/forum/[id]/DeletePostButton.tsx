"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { deletePost } from "../actions";

const button = "rounded-full px-3 py-1 text-sm font-bold disabled:opacity-50";

/** Asks on the page first, like the admin page does. */
export function DeletePostButton({
  postId,
  isOpening,
  returnTo,
}: {
  postId: number;
  /** Removing the opening post removes the whole conversation. */
  isOpening: boolean;
  /** Where to stay after removing a whole conversation. */
  returnTo?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const what = isOpening ? "conversation" : "post";

  return (
    <form action={deletePost} className="flex items-center gap-1">
      <input type="hidden" name="postId" value={postId} />
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
      {confirming ? (
        <Confirm what={what} onCancel={() => setConfirming(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className={`${button} text-muted hover:bg-blush hover:text-accent-strong`}
        >
          Remove {what}
        </button>
      )}
    </form>
  );
}

function Confirm({ what, onCancel }: { what: string; onCancel: () => void }) {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        disabled={pending}
        autoFocus
        aria-label={`Yes, remove this ${what}. This can't be undone.`}
        className={`${button} bg-accent-strong text-on-primary`}
      >
        {pending ? "Removing…" : "Yes, remove"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={onCancel}
        className={`${button} text-muted hover:bg-peach`}
      >
        Keep
      </button>
    </>
  );
}
