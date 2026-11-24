import { cookies, headers } from "next/headers";
import {
  cleanUrl,
  umamiHost,
  umamiWebsiteId,
  type AnalyticsEvent,
  type AnalyticsEvents,
} from "@/lib/analytics";
import { CONSENT_COOKIE, parseConsent } from "@/lib/consent";
import { site } from "@/lib/site";

/**
 * Records a custom event in Umami from a server action or route, if the
 * visitor accepted the cookie banner. Analytics must never break the thing
 * being measured, so failures are only logged.
 */
export async function trackServer<E extends AnalyticsEvent>(
  ...[event, properties]: AnalyticsEvents[E] extends undefined
    ? [event: E]
    : [event: E, properties: AnalyticsEvents[E]]
) {
  if (!umamiWebsiteId) return;
  try {
    const consent = parseConsent((await cookies()).get(CONSENT_COOKIE)?.value);
    if (consent !== "accepted") return;

    const incoming = await headers();
    // The page the visitor was on, so the event shows against it in Umami.
    const referer = incoming.get("referer");
    const path = referer ? new URL(referer).pathname : "/";

    const response = await fetch(`${umamiHost}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Umami ignores requests without a browser user agent.
        "User-Agent": incoming.get("user-agent") ?? "Mozilla/5.0",
      },
      body: JSON.stringify({
        type: "event",
        payload: {
          website: umamiWebsiteId,
          hostname: new URL(site.url).hostname,
          url: cleanUrl(path),
          language: incoming.get("accept-language")?.split(",")[0],
          name: event,
          data: properties,
        },
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) {
      console.error(`Analytics event "${event}" failed: ${response.status}`);
    }
  } catch (error) {
    console.error(`Analytics event "${event}" failed:`, error);
  }
}
