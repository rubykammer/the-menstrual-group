/**
 * Shared plumbing for the site's Gemini features (AuntFlo and the "Help me
 * say it" helper): which models to try, the API key, a rough rate limit and
 * readable error reasons.
 */

/**
 * The Gemini models that answer, on Google's free tier, tried in order until
 * one isn't busy or out of quota. Flash-lite comes first: on the free tier
 * it answers in seconds while the bigger models are often overloaded. Set
 * GEMINI_MODEL to put another first; Google retires old models, so check
 * this list now and then.
 */
export const geminiModels = [
  ...(process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : []),
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
];

/** Errors where another model (or a moment's wait) might succeed. */
export const retryableStatus = new Set([429, 500, 503, 504]);

/**
 * The key from the environment. Trimmed, and stripped of surrounding quote
 * marks, since pasted keys often pick up a stray space, newline or quotes.
 */
export function geminiKey() {
  return process.env.GEMINI_API_KEY?.trim().replace(/^["']|["']$/g, "").trim();
}

/** The visitor's IP address, for rate limiting. */
export function visitorIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
}

/**
 * A rough per-visitor limit. It lives in this server's memory, so on Vercel
 * each instance counts separately: enough to stop a runaway script, not a
 * determined abuser. It also keeps one visitor from using up the free quota.
 * Returns a function that records a request and says whether it's over.
 */
export function createRateLimiter(windowMs: number, maxRequests: number) {
  const recentRequests = new Map<string, number[]>();
  return function rateLimited(ip: string) {
    const now = Date.now();
    const recent = (recentRequests.get(ip) ?? []).filter(
      (time) => now - time < windowMs,
    );
    recent.push(now);
    recentRequests.set(ip, recent);
    if (recentRequests.size > 5000) recentRequests.clear();
    return recent.length > maxRequests;
  };
}

/**
 * Google's short reason for an error, such as "400 API_KEY_INVALID: API key
 * not valid", with the key removed in case Google ever echoes it back.
 */
export function errorReason(error: unknown, apiKey: string) {
  const status = (error as { status?: number }).status ?? "?";
  const text = String((error as Error).message ?? error);
  // Streaming errors wrap Google's JSON in another, escaped layer, so allow
  // backslashes before the quotes and skip a "message" that's just "{".
  const reason = text.match(/\\*"reason\\*":\s*\\*"([A-Z_]+)/)?.[1] ?? "";
  const message =
    [...text.matchAll(/\\*"message\\*":\s*\\*"([^"\\]{1,120})/g)]
      .map((match) => match[1])
      .find((value) => value !== "{") ?? "";
  return `${status} ${reason}: ${message}`
    .split(apiKey)
    .join("[key]")
    .replace(/[^\x20-\x7e]/g, "");
}

/**
 * The HTTP status and visitor-facing words for a request no model could
 * answer. 400, 401 and 403 mean the key or settings are wrong, not that
 * Google is busy, so say so: the site owner can then tell the two apart.
 */
export function failureResponse(name: string, status: number | undefined) {
  const setupProblem = status === 400 || status === 401 || status === 403;
  return {
    status: setupProblem ? 503 : status === 429 ? 429 : 502,
    message: setupProblem
      ? `${name} isn't set up properly yet. Please try again later.`
      : status === 429
        ? `${name} is very popular right now and has hit today's limit. Please try again later.`
        : "Sorry, I couldn't answer just now. Please try again in a moment.",
  };
}
