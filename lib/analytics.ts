/**
 * Custom events sent to Vercel Web Analytics, with the only properties each
 * may carry.
 *
 * This is a health site, so events say *that* something happened, never who
 * did it or anything personal: no emails, names, quiz answers or scores,
 * post text or search terms.
 */
export type AnalyticsEvents = {
  /** A first Google sign-in, which creates the member's account. */
  "Sign Up": undefined;
  /** Any later Google sign-in. */
  "Sign In": undefined;
  "Newsletter Signup": undefined;
  "Quiz Completed": { quiz: string };
  "Quiz Result Shared": { quiz: string };
  "Forum Thread Started": { category: string };
  "Forum Reply": undefined;
  "Favorite Saved": { kind: string };
};

export type AnalyticsEvent = keyof AnalyticsEvents;

/** Query parameters worth keeping on page views: campaign tags only. */
const keptParams = /^utm_/;

/**
 * Removes query strings from URLs before they're sent, except campaign tags,
 * so searches (/search?q=…) and similar never reach analytics.
 */
export function cleanUrl(url: string) {
  try {
    const parsed = new URL(url);
    for (const key of [...parsed.searchParams.keys()]) {
      if (!keptParams.test(key)) parsed.searchParams.delete(key);
    }
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return url;
  }
}
