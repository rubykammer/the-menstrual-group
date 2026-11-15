"use client";

import { useActionState } from "react";
import { createSignup, type SignupFormState } from "./actions";

const initial: SignupFormState = { status: "idle" };

export function AddSignupForm() {
  const [state, action, pending] = useActionState(createSignup, initial);

  return (
    // A new key after each save empties the field for the next address.
    <form key={state.savedAt} action={action} className="mt-6">
      <label htmlFor="add-signup" className="font-bold">
        Add a subscriber
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          id="add-signup"
          name="email"
          type="email"
          required
          maxLength={254}
          placeholder="name@example.com"
          aria-describedby={state.message ? "add-signup-message" : undefined}
          className="min-w-0 flex-1 rounded-full border-2 border-line bg-surface px-4 py-2"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary-strong px-5 py-2 font-extrabold text-on-primary hover:bg-primary-hover disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add"}
        </button>
      </div>
      {state.message && (
        <p
          id="add-signup-message"
          role={state.status === "error" ? "alert" : "status"}
          className={`mt-2 ${state.status === "error" ? "text-accent-strong" : "text-correct"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
