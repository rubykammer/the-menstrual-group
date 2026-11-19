"use client";

import { useActionState, useState } from "react";
import { BODY_MAX, TITLE_MAX, categories } from "@/lib/forum";
import { createThread, type ForumFormState } from "../actions";

const initial: ForumFormState = { status: "idle" };
const field = "rounded-2xl border-2 border-line bg-background px-4 py-2.5";

export function NewThreadForm({ category }: { category?: string }) {
  const [state, action, pending] = useActionState(createThread, initial);
  const [body, setBody] = useState("");

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="thread-category" className="font-bold">
          Category
        </label>
        <select
          id="thread-category"
          name="category"
          defaultValue={category ?? ""}
          required
          className={field}
        >
          <option value="" disabled>
            Choose one
          </option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="thread-title" className="font-bold">
          Title
        </label>
        <input
          id="thread-title"
          name="title"
          required
          minLength={3}
          maxLength={TITLE_MAX}
          placeholder="What would you like to talk about?"
          className={field}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor="thread-body" className="font-bold">
            Your message
          </label>
          <span className="text-sm text-muted">
            {body.length}/{BODY_MAX}
          </span>
        </div>
        <textarea
          id="thread-body"
          name="body"
          required
          maxLength={BODY_MAX}
          rows={8}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Share your experience or ask a question."
          className={`${field} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary-strong px-6 py-3 font-extrabold text-on-primary hover:bg-primary-hover disabled:opacity-60"
        >
          {pending ? "Posting…" : "Post"}
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
