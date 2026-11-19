"use client";

import { useActionState, useId, useState } from "react";
import { BODY_MAX, TITLE_MAX } from "@/lib/forum";
import { updatePost, type ForumFormState } from "./actions";
import { DeletePostButton } from "./[id]/DeletePostButton";

const initial: ForumFormState = { status: "idle" };
const smallButton =
  "rounded-full px-3 py-1 text-sm font-bold disabled:opacity-50";
const field = "rounded-2xl border-2 border-line bg-background px-4 py-2.5";

/**
 * A post's text, with Edit and Remove for the people allowed to. Editing
 * happens in place; on an opening post the author can change the title too.
 */
export function PostBody({
  postId,
  body,
  edited,
  canEdit,
  canDelete,
  isOpening,
  title,
  returnTo,
}: {
  postId: number;
  body: string;
  /** Shown after the text when the post has been edited. */
  edited: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isOpening: boolean;
  /** The conversation's title, editable only on its opening post. */
  title?: string;
  returnTo?: string;
}) {
  const ids = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(body);
  const [state, action, pending] = useActionState(
    async (previous: ForumFormState, formData: FormData) => {
      const result = await updatePost(previous, formData);
      if (result.status === "success") setEditing(false);
      return result;
    },
    initial,
  );

  if (editing) {
    return (
      <form action={action} className="mt-4 flex flex-col gap-3">
        <input type="hidden" name="postId" value={postId} />
        {isOpening && title !== undefined && (
          <>
            <label htmlFor={`${ids}-title`} className="text-sm font-bold">
              Title
            </label>
            <input
              id={`${ids}-title`}
              name="title"
              required
              minLength={3}
              maxLength={TITLE_MAX}
              defaultValue={title}
              className={field}
            />
          </>
        )}
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={`${ids}-body`} className="text-sm font-bold">
            Your post
          </label>
          <span className="text-sm text-muted">
            {draft.length}/{BODY_MAX}
          </span>
        </div>
        <textarea
          id={`${ids}-body`}
          name="body"
          required
          maxLength={BODY_MAX}
          rows={5}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          autoFocus
          className={`${field} resize-y`}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-primary-strong px-5 py-2 font-extrabold text-on-primary hover:bg-primary-hover disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setDraft(body);
              setEditing(false);
            }}
            className={`${smallButton} text-muted hover:bg-peach`}
          >
            Cancel
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

  return (
    <>
      {/* Plain text only: line breaks kept, nothing rendered as HTML. */}
      <p className="mt-4 whitespace-pre-wrap break-words">
        {body}
        {edited && <span className="ml-2 text-sm text-muted">(edited)</span>}
      </p>
      {(canEdit || canDelete) && (
        <div className="mt-3 flex flex-wrap justify-end gap-1">
          {canEdit && (
            <button
              type="button"
              onClick={() => {
                setDraft(body);
                setEditing(true);
              }}
              className={`${smallButton} text-primary-strong hover:bg-peach`}
            >
              Edit
            </button>
          )}
          {canDelete && (
            <DeletePostButton
              postId={postId}
              isOpening={isOpening}
              returnTo={returnTo}
            />
          )}
        </div>
      )}
    </>
  );
}
