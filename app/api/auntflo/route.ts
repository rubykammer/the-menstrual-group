import { GoogleGenAI } from "@google/genai";
import { auntFloSystemPrompt, chatLimits } from "@/lib/auntflo";

// Replies can take a little while to finish streaming.
export const maxDuration = 60;

/**
 * The Gemini model that answers. "gemini-flash-latest" follows Google's
 * newest Flash model, which is on the free tier; set GEMINI_MODEL to pin one.
 */
const model = process.env.GEMINI_MODEL || "gemini-flash-latest";

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

function plainText(text: string, status: number) {
  return new Response(text, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
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
  const apiKey = process.env.GEMINI_API_KEY;
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
  let chunks: Awaited<ReturnType<typeof ai.models.generateContentStream>>;
  try {
    chunks = await ai.models.generateContentStream({
      model,
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: auntFloSystemPrompt(),
        // Thinking counts towards this on some models, so leave room.
        maxOutputTokens: 4000,
        abortSignal: request.signal,
      },
    });
  } catch (error) {
    console.error("AuntFlo request failed", error);
    const status = (error as { status?: number }).status;
    return plainText(
      status === 429
        ? "AuntFlo is very popular right now and has hit today's limit. Please try again later."
        : "Sorry, I couldn't answer just now. Please try again in a moment.",
      status === 429 ? 429 : 502,
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
