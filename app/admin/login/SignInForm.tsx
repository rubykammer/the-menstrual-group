"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, {});

  return (
    <form action={action} className="mt-8 flex flex-col gap-3">
      <label htmlFor="admin-password" className="font-bold">
        Password
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        autoFocus
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "admin-password-error" : undefined}
        className="rounded-full border-2 border-line bg-surface px-4 py-3"
      />
      {state.error && (
        <p id="admin-password-error" role="alert" className="text-accent-strong">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-primary-strong px-6 py-3 font-extrabold text-on-primary hover:bg-primary-hover disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
