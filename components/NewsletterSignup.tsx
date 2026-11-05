"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { subscribe, type SignupState } from "@/app/actions/newsletter";

const initialState: SignupState = { status: "idle", message: "" };
const toastDuration = 6000;

export function NewsletterSignup() {
  const [state, formAction, pending] = useActionState(subscribe, initialState);
  const hasError = state.status === "error";

  // Each submission returns a new state object, so remembering which one was
  // dismissed lets a later success show the toast again.
  const [dismissed, setDismissed] = useState<SignupState | null>(null);
  const showToast = state.status === "success" && dismissed !== state;

  // The toast waits while someone is pointing at it or has tabbed to its close
  // button, so it never disappears from under them. The timer starts again
  // once they move away.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;

  useEffect(() => {
    if (!showToast || paused) return;
    const timer = setTimeout(() => setDismissed(state), toastDuration);
    return () => clearTimeout(timer);
  }, [showToast, paused, state]);

  // A successful signup removes the form, taking the focused button with it.
  // Moving focus to the thank-you message keeps keyboard users in place instead
  // of sending them back to the top of the page.
  const statusRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.status === "success") statusRef.current?.focus();
  }, [state]);

  // Closing the toast removes its focused close button, so focus goes back to
  // the thank-you message for the same reason.
  function closeToast() {
    statusRef.current?.focus();
    setDismissed(state);
    setHovered(false);
    setFocused(false);
  }

  return (
    <section aria-labelledby="newsletter-heading" className="bg-peach">
      <div className="page-width grid items-center gap-6 py-12 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 id="newsletter-heading" className="text-2xl sm:text-3xl">
            One friendly email a month
          </h2>
          <p className="mt-2 text-lg">
            New articles and practical tips, for people with cycles and the
            people who love them.
          </p>
        </div>

        <div>
          {state.status !== "success" && (
            <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="grow">
                <label htmlFor="newsletter-email" className="font-extrabold">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  defaultValue={state.email}
                  aria-invalid={hasError || undefined}
                  aria-describedby="newsletter-status"
                  className="mt-1 block min-h-12 w-full rounded-full border-2 border-muted bg-surface px-5 transition-colors duration-200 hover:border-primary-strong aria-invalid:border-accent-strong"
                />
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="newsletter-website">Website</label>
                <input
                  id="newsletter-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={pending}
                className="min-h-12 shrink-0 cursor-pointer rounded-full bg-primary-strong px-6 font-extrabold text-white transition-all duration-200 hover:bg-orange-800 disabled:cursor-wait disabled:opacity-70 motion-safe:hover:-translate-y-0.5"
              >
                {pending ? "Signing up…" : "Sign up"}
              </button>
            </form>
          )}

          <p
            id="newsletter-status"
            ref={statusRef}
            tabIndex={-1}
            role="status"
            className={
              hasError
                ? "mt-2 font-bold text-accent-strong outline-none empty:hidden"
                : "text-lg font-bold outline-none empty:hidden"
            }
          >
            {state.message}
          </p>

          <p className="mt-2 text-sm text-muted">
            We&apos;ll email you a link to confirm. Sent with Buttondown, and you
            can unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* The status line above already announces this to screen readers, so the
          toast is a visual confirmation only and has no live region of its own. */}
      {showToast && (
        <div className="fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex w-full max-w-sm items-start gap-3 rounded-card border-2 border-line bg-surface p-4 shadow-soft motion-safe:animate-toast-in"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary-strong text-white"
            >
              <svg viewBox="0 0 20 20" fill="none" className="size-4">
                <path
                  d="M4 10.5l4 4 8-9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="grow">
              <p className="font-extrabold">You&apos;re signed up!</p>
              <p className="text-sm text-muted">
                Check your inbox for a link to confirm.
              </p>
            </div>
            <button
              type="button"
              onClick={closeToast}
              aria-label="Dismiss"
              className="-m-1 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-peach hover:text-foreground"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
