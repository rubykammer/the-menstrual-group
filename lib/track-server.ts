import { track } from "@vercel/analytics/server";
import { cookies } from "next/headers";
import type { AnalyticsEvent, AnalyticsEvents } from "@/lib/analytics";
import { CONSENT_COOKIE, parseConsent } from "@/lib/consent";

/**
 * Records a custom event from a server action or route, if the visitor
 * accepted the cookie banner. Analytics must never break the thing being
 * measured, so failures are only logged.
 */
export async function trackServer<E extends AnalyticsEvent>(
  ...[event, properties]: AnalyticsEvents[E] extends undefined
    ? [event: E]
    : [event: E, properties: AnalyticsEvents[E]]
) {
  try {
    const consent = parseConsent((await cookies()).get(CONSENT_COOKIE)?.value);
    if (consent !== "accepted") return;
    await track(event, properties);
  } catch (error) {
    console.error(`Analytics event "${event}" failed:`, error);
  }
}
