"use client";

import { useActionState, useState } from "react";
import { BODY_MAX } from "@/lib/forum";
import { createReply, type ForumFormState } from "../actions";

const initial: ForumFormState = { status: "idle" };

export function ReplyForm({ threadId }: { threadId: number }) {
  const [body, setBody] = useState("");
  const [state, action, pending] = useActionState(
    async (previous: ForumFormState, formData: FormData) => {
      const result = await createReply(previous, formData);
      if (result.status === "success") setBody("");
      return result;
    },
    initial,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="threadId" value={threadId} />
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor="reply-body" className="text-xl font-bold">
          Add a reply
        </label>
        <span className="text-sm text-muted">
          {body.length}/{BODY_MAX}
        </span>
      </div>
      <textarea
        id="reply-body"
        name="body"
        required
        maxLength={BODY_MAX}
        rows={4}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Be kind, be honest."
        className="resize-y rounded-2xl border-2 border-line bg-background px-4 py-2.5"
      />
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary-strong px-6 py-3 font-extrabold text-on-primary hover:bg-primary-hover disabled:opacity-60"
        >
          {pending ? "Posting…" : "Reply"}
        </button>
        {state.status === "error" && (
          <p role="alert" className="text-accent-strong">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
