import { track } from "@vercel/analytics/server";
import type { AnalyticsEvent, AnalyticsEvents } from "@/lib/analytics";

/**
 * Records a custom event from a server action or route. Analytics must never
 * break the thing being measured, so failures are only logged.
 */
export async function trackServer<E extends AnalyticsEvent>(
  ...[event, properties]: AnalyticsEvents[E] extends undefined
    ? [event: E]
    : [event: E, properties: AnalyticsEvents[E]]
) {
  try {
    await track(event, properties);
  } catch (error) {
    console.error(`Analytics event "${event}" failed:`, error);
  }
}
