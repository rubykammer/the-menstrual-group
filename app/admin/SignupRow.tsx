"use client";

import { useActionState, useState } from "react";
import type { Signup } from "@/lib/admin";
import { deleteSignup, updateSignup, type SignupFormState } from "./actions";
import { DeleteButton } from "./DeleteButton";

const initial: SignupFormState = { status: "idle" };

const smallButton =
  "rounded-full px-3 py-1 text-sm font-bold hover:bg-peach disabled:opacity-50";

export function SignupRow({
  signup,
  signedUpLabel,
}: {
  signup: Signup;
  /** Formatted on the server so it matches during hydration. */
  signedUpLabel: string;
}) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState(
    async (previous: SignupFormState, formData: FormData) => {
      const result = await updateSignup(previous, formData);
      if (result.status === "success") setEditing(false);
      return result;
    },
    initial,
  );
  const inputId = `edit-signup-${signup.id}`;

  if (editing) {
    return (
      <li className="px-5 py-3">
        <form action={action} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="id" value={signup.id} />
          <label htmlFor={inputId} className="sr-only">
            Email for this signup
          </label>
          <input
            id={inputId}
            name="email"
            type="email"
            required
            maxLength={254}
            defaultValue={signup.email}
            autoFocus
            aria-describedby={state.message ? `${inputId}-error` : undefined}
            className="min-w-0 flex-1 rounded-full border-2 border-line bg-background px-4 py-1.5"
          />
          <button
            type="submit"
            disabled={pending}
            className={`${smallButton} text-primary-strong`}
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setEditing(false)}
            className={`${smallButton} text-muted`}
          >
            Cancel
          </button>
        </form>
        {state.status === "error" && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="mt-2 text-accent-strong"
          >
            {state.message}
          </p>
        )}
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3">
      <span className="min-w-0 break-all font-bold">{signup.email}</span>
      <span className="flex items-center gap-1">
        <time dateTime={signup.created_at} className="mr-2 text-sm text-muted">
          {signedUpLabel}
        </time>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`Edit ${signup.email}`}
          className={`${smallButton} text-primary-strong`}
        >
          Edit
        </button>
        <form action={deleteSignup}>
          <input type="hidden" name="id" value={signup.id} />
          <DeleteButton email={signup.email} />
        </form>
      </span>
    </li>
  );
}
