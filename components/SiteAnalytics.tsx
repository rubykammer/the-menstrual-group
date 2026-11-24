"use client";

import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsent } from "@/components/CookieConsent";
import {
  cleanUrl,
  umamiHost,
  umamiWebsiteId,
  type AnalyticsEvent,
  type AnalyticsEvents,
} from "@/lib/analytics";
import { readConsent } from "@/lib/consent";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string>) => void;
    };
    umamiBeforeSend?: (
      type: string,
      payload: { url?: string },
    ) => { url?: string } | false;
  }
}

/** The page Umami's script sends to, or false to drop the event. */
function beforeSend(type: string, payload: { url?: string }) {
  if (!payload.url) return payload;
  // Umami sends full addresses, but accept paths too.
  const { pathname } = new URL(payload.url, location.origin);
  if (pathname.startsWith("/admin")) return false as const;
  return { ...payload, url: cleanUrl(payload.url) };
}

/**
 * Umami (page views and events) and Vercel Speed Insights (real-world page
 * speed). Both are cookieless and anonymous, but they only load once the
 * visitor accepts the cookie banner. Admin pages are left out so our own
 * visits don't count, and query strings are stripped (see cleanUrl).
 */
export function SiteAnalytics() {
  if (useConsent() !== "accepted") return null;

  return (
    <>
      {umamiWebsiteId && (
        <Script
          src={`${umamiHost}/script.js`}
          data-website-id={umamiWebsiteId}
          // Set below, at module load, so it exists before the first page view.
          data-before-send="umamiBeforeSend"
        />
      )}
      <SpeedInsights
        beforeSend={(event) => ({ ...event, url: cleanUrl(event.url) })}
      />
    </>
  );
}

if (typeof window !== "undefined") window.umamiBeforeSend = beforeSend;

/** Records a custom event from the browser, if the visitor accepted. */
export function trackClient<E extends AnalyticsEvent>(
  ...[event, properties]: AnalyticsEvents[E] extends undefined
    ? [event: E]
    : [event: E, properties: AnalyticsEvents[E]]
) {
  if (readConsent() !== "accepted") return;
  window.umami?.track(event, properties);
}
