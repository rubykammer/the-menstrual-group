"use client";

import { useActionState } from "react";
import { subscribe, type SignupState } from "@/app/actions/newsletter";

const initialState: SignupState = { status: "idle", message: "" };

export function NewsletterSignup() {
  const [state, formAction, pending] = useActionState(subscribe, initialState);
  const hasError = state.status === "error";

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="bg-stone"
    >
      <div className="page-width grid items-center gap-6 py-16 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 id="newsletter-heading" className="text-3xl sm:text-4xl">
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
                  className="mt-1 block min-h-12 w-full rounded-full border border-muted bg-surface px-5 transition-colors duration-200 hover:border-primary-strong aria-invalid:border-accent-strong"
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
                className="min-h-12 shrink-0 cursor-pointer rounded-full bg-foreground px-6 font-extrabold text-background transition-colors duration-200 hover:bg-primary-strong disabled:cursor-wait disabled:opacity-70"
              >
                {pending ? "Signing up…" : "Sign up"}
              </button>
            </form>
          )}

          <p
            id="newsletter-status"
            role="status"
            className={
              hasError
                ? "mt-2 font-bold text-accent-strong empty:hidden"
                : "text-lg font-bold empty:hidden"
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
    </section>
  );
}
