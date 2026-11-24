"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  clearConsent,
  readConsent,
  subscribeConsent,
  writeConsent,
  type Consent,
} from "@/lib/consent";

/**
 * The visitor's cookie choice: null until they answer, and "unknown" on the
 * server and during hydration, so the markup always matches and returning
 * visitors never see the banner flash.
 */
export function useConsent(): Consent | null | "unknown" {
  return useSyncExternalStore(subscribeConsent, readConsent, () => "unknown");
}

const buttonClass =
  "inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-2.5 font-extrabold transition-all duration-200 motion-safe:hover:-translate-y-0.5";

/**
 * Asks once, on the first visit, whether we may use analytics. Both buttons
 * get the same weight, since saying no should be as easy as saying yes.
 */
export function CookieConsent() {
  const consent = useConsent();
  if (consent !== null) return null;

  return (
    <section
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-2xl rounded-card border border-line bg-surface p-5 shadow-soft sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <h2 id="cookie-consent-title" className="text-xl">
        A quick question about cookies
      </h2>
      <p className="mt-2 text-muted">
        We&apos;d like to measure visits and page speed, anonymously, so we can
        see which guides help most. Sign-in and your settings work either way.{" "}
        <Link
          href="/privacy"
          className="font-bold text-primary-strong underline underline-offset-2"
        >
          Read our privacy policy
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => writeConsent("accepted")}
          className={`${buttonClass} bg-primary-strong text-on-primary hover:bg-primary-hover`}
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => writeConsent("declined")}
          className={`${buttonClass} border-2 border-primary-strong text-primary-strong hover:bg-primary-strong hover:text-on-primary`}
        >
          Decline
        </button>
      </div>
    </section>
  );
}

/** For the privacy page: shows the current choice and lets people change it. */
export function CookieChoice() {
  const consent = useConsent();
  if (consent === "unknown") return null;

  const label =
    consent === "accepted"
      ? "You've accepted analytics cookies."
      : consent === "declined"
        ? "You've declined analytics cookies."
        : "You haven't made a choice yet.";

  return (
    <p className="mt-3 text-lg">
      {label}{" "}
      {consent && (
        <button
          type="button"
          onClick={clearConsent}
          className="cursor-pointer font-bold text-primary-strong underline underline-offset-2"
        >
          Change your choice
        </button>
      )}
    </p>
  );
}
