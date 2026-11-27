import { GoogleGenAI } from "@google/genai";
import { auntFloSystemPrompt, chatLimits } from "@/lib/auntflo";

// Replies can take a little while to finish streaming.
export const maxDuration = 60;

/**
 * The Gemini models that answer, on Google's free tier, tried in order until
 * one isn't busy or out of quota. Flash-lite comes first: on the free tier
 * it answers in seconds while the bigger models are often overloaded. Set
 * GEMINI_MODEL to put another first; Google retires old models, so check
 * this list now and then.
 */
const models = [
  ...(process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : []),
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
];

/** Errors where another model (or a moment's wait) might succeed. */
const retryable = new Set([429, 500, 503, 504]);

type ChatMessage = { role: "user" | "assistant"; content: string };

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 30;
const recentRequests = new Map<string, number[]>();

/**
 * A rough per-visitor limit. It lives in this server's memory, so on Vercel
 * each instance counts separately: enough to stop a runaway script, not a
 * determined abuser. It also keeps one visitor from using up the free quota.
 */
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (recentRequests.get(ip) ?? []).filter(
    (time) => now - time < RATE_WINDOW_MS,
  );
  recent.push(now);
  recentRequests.set(ip, recent);
  if (recentRequests.size > 5000) recentRequests.clear();
  return recent.length > RATE_MAX_REQUESTS;
}

/** Keeps only well-formed messages, trimmed to the limits, starting with the visitor. */
function cleanMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const messages = input
    .filter(
      (m): m is ChatMessage =>
        typeof m === "object" &&
        m !== null &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim() !== "",
    )
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, chatLimits.maxMessageLength),
    }))
    .slice(-chatLimits.maxMessages);
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages.at(-1)!.role !== "user") return null;
  return messages;
}

function plainText(text: string, status: number, reason?: string) {
  return new Response(text, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Why Google refused, for the site owner to check with curl or the
      // browser's network tab. Never contains the key.
      ...(reason ? { "X-AuntFlo-Error": reason } : {}),
    },
  });
}

/**
 * Google's short reason for an error, such as "400 API_KEY_INVALID: API key
 * not valid", with the key removed in case Google ever echoes it back.
 */
function errorReason(error: unknown, apiKey: string) {
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
 * The key from the environment. Trimmed, and stripped of surrounding quote
 * marks, since pasted keys often pick up a stray space, newline or quotes.
 */
function geminiKey() {
  return process.env.GEMINI_API_KEY?.trim().replace(/^["']|["']$/g, "").trim();
}

const cantHelp =
  "Sorry, love, I can't help with that one. Is there something else about periods or cycles I can help with?";

/**
 * AuntFlo, the site's chat helper. Takes the conversation so far and streams
 * back the reply as plain text. Nothing is stored here: the conversation
 * lives in the visitor's browser and is sent to Google's Gemini API only to
 * write the reply.
 */
export async function POST(request: Request) {
  const apiKey = geminiKey();
  if (!apiKey) return plainText("AuntFlo isn't set up yet.", 503);

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (rateLimited(ip)) {
    return plainText(
      "You've sent a lot of messages in a short time. Have a breather and try again in a few minutes.",
      429,
    );
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return plainText("That message didn't come through properly.", 400);
  }
  const messages = cleanMessages(body.messages);
  if (!messages) return plainText("There's no question to answer yet.", 400);

  const ai = new GoogleGenAI({ apiKey });
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  let chunks: Awaited<ReturnType<typeof ai.models.generateContentStream>> | undefined;
  let status: number | undefined;
  let reason: string | undefined;
  for (const model of models) {
    try {
      chunks = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: auntFloSystemPrompt(),
          // Thinking counts towards this on some models, so leave room.
          maxOutputTokens: 4000,
          abortSignal: request.signal,
        },
      });
      break;
    } catch (error) {
      console.error(`AuntFlo request to ${model} failed`, error);
      status = (error as { status?: number }).status;
      reason = `${model}: ${errorReason(error, apiKey)}`;
      if (request.signal.aborted || !retryable.has(status ?? 0)) break;
    }
  }
  if (!chunks) {
    // 400, 401 and 403 mean the key or settings are wrong, not that Google
    // is busy, so say so: the site owner can then tell the two apart.
    const setupProblem = status === 400 || status === 401 || status === 403;
    return plainText(
      setupProblem
        ? "AuntFlo isn't set up properly yet. Please try again later."
        : status === 429
          ? "AuntFlo is very popular right now and has hit today's limit. Please try again later."
          : "Sorry, I couldn't answer just now. Please try again in a moment.",
      setupProblem ? 503 : status === 429 ? 429 : 502,
      reason,
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wroteText = false;
      try {
        for await (const chunk of chunks) {
          const text = chunk.text;
          if (text) {
            wroteText = true;
            controller.enqueue(encoder.encode(text));
          }
        }
        // Nothing back usually means Google's safety filters blocked it.
        if (!wroteText) controller.enqueue(encoder.encode(cantHelp));
      } catch (error) {
        if (request.signal.aborted) return;
        console.error("AuntFlo reply failed", error);
        controller.enqueue(
          encoder.encode(
            wroteText
              ? "\n\n(Sorry, I lost my train of thought there. Try asking again.)"
              : "Sorry, I couldn't answer just now. Please try again in a moment.",
          ),
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
