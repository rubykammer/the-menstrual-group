"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import type { Role } from "@/lib/session";
import { setUserRole } from "./actions";

const button = "rounded-full px-3 py-1 text-sm font-bold disabled:opacity-50";

export function UserRow({
  email,
  role,
  lastSignedInLabel,
  lastSignedIn,
  locked,
}: {
  email: string;
  role: Role;
  /** Formatted on the server so it matches during hydration. */
  lastSignedInLabel: string;
  lastSignedIn: string;
  /** Why the role can't be changed here, if it can't. */
  locked?: string;
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3">
      <span className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="break-all font-bold">{email}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
            role === "admin"
              ? "bg-peach text-primary-strong"
              : "bg-background text-muted"
          }`}
        >
          {role === "admin" ? "Admin" : "Member"}
        </span>
      </span>
      <span className="flex items-center gap-1">
        <time dateTime={lastSignedIn} className="mr-2 text-sm text-muted">
          {lastSignedInLabel}
        </time>
        {locked ? (
          <span className="text-sm text-muted">{locked}</span>
        ) : (
          <form action={setUserRole}>
            <input type="hidden" name="email" value={email} />
            <input
              type="hidden"
              name="role"
              value={role === "admin" ? "member" : "admin"}
            />
            <RoleButton email={email} role={role} />
          </form>
        )}
      </span>
    </li>
  );
}

/** Asks on the page first, like removing a signup does. */
function RoleButton({ email, role }: { email: string; role: Role }) {
  const { pending } = useFormStatus();
  const [confirming, setConfirming] = useState(false);
  const label = role === "admin" ? "Make member" : "Make admin";

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`${label}: ${email}`}
        className={`${button} text-primary-strong hover:bg-peach`}
      >
        {label}
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1">
      <button
        type="submit"
        disabled={pending}
        autoFocus
        aria-label={
          role === "admin"
            ? `Yes, take admin away from ${email}`
            : `Yes, make ${email} an admin, with full access to this page`
        }
        className={`${button} bg-primary-strong text-on-primary`}
      >
        {pending ? "Saving…" : `Yes, ${label.toLowerCase()}`}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => setConfirming(false)}
        className={`${button} text-muted hover:bg-peach`}
      >
        Cancel
      </button>
    </span>
  );
}
