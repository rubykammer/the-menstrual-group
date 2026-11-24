"use client";

import { track } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsent } from "@/components/CookieConsent";
import {
  cleanUrl,
  type AnalyticsEvent,
  type AnalyticsEvents,
} from "@/lib/analytics";
import { readConsent } from "@/lib/consent";

/**
 * Vercel Web Analytics (page views and events) and Speed Insights (real-world
 * page speed). Both are cookieless and anonymous, but they only load once the
 * visitor accepts the cookie banner. Admin pages are left out so our own
 * visits don't count, and query strings are stripped (see cleanUrl).
 */
export function SiteAnalytics() {
  if (useConsent() !== "accepted") return null;

  return (
    <>
      <Analytics
        beforeSend={(event) => {
          if (new URL(event.url).pathname.startsWith("/admin")) return null;
          return { ...event, url: cleanUrl(event.url) };
        }}
      />
      <SpeedInsights
        beforeSend={(event) => ({ ...event, url: cleanUrl(event.url) })}
      />
    </>
  );
}

/** Records a custom event from the browser, if the visitor accepted. */
export function trackClient<E extends AnalyticsEvent>(
  ...[event, properties]: AnalyticsEvents[E] extends undefined
    ? [event: E]
    : [event: E, properties: AnalyticsEvents[E]]
) {
  if (readConsent() !== "accepted") return;
  track(event, properties);
}
