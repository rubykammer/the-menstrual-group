/**
 * The visitor's answer to the cookie banner. It lives in a cookie, rather
 * than localStorage, so server actions can check it before recording an
 * analytics event too. Safe to import from the browser and the server.
 */

export const CONSENT_COOKIE = "tmg_consent";
/** How long an answer lasts before the banner asks again. */
export const CONSENT_DAYS = 365;

export type Consent = "accepted" | "declined";

export function parseConsent(value: string | undefined | null): Consent | null {
  return value === "accepted" || value === "declined" ? value : null;
}

// Browser-only below.

const CHANGE_EVENT = "tmg-consent-change";

export function readConsent(): Consent | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`),
  );
  return parseConsent(match?.[1]);
}

export function writeConsent(consent: Consent) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${consent}; Path=/; Max-Age=${
    CONSENT_DAYS * 24 * 60 * 60
  }; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Forgets the answer, so the banner shows again. */
export function clearConsent() {
  document.cookie = `${CONSENT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** For useSyncExternalStore. Cookies have no change event, so ours fires one. */
export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}
