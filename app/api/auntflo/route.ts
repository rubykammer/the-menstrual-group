import Anthropic from "@anthropic-ai/sdk";
import { auntFloSystemPrompt, chatLimits } from "@/lib/auntflo";

// Replies can take a little while to finish streaming.
export const maxDuration = 60;

type ChatMessage = { role: "user" | "assistant"; content: string };

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 30;
const recentRequests = new Map<string, number[]>();

/**
 * A rough per-visitor limit. It lives in this server's memory, so on Vercel
 * each instance counts separately: enough to stop a runaway script, not a
 * determined abuser.
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

/**
 * AuntFlo, the site's chat helper. Takes the conversation so far and streams
 * back the reply as plain text. Nothing is stored: the conversation lives in
 * the visitor's browser and is sent to Anthropic only to write the reply.
 */
export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return plainText("AuntFlo isn't set up yet.", 503);
  }

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

  const client = new Anthropic();
  const stream = client.beta.messages.stream(
    {
      model: "claude-opus-5-5",
      max_tokens: 4000,
      // A friendly chat, not hard reasoning: low effort keeps replies quick.
      output_config: { effort: "low" },
      system: [
        {
          type: "text",
          text: auntFloSystemPrompt(),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
      // If a safety check declines the request, another model answers instead.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    },
    { signal: request.signal },
  );

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wroteText = false;
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            wroteText = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (!wroteText || final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              "\n\nSorry, love, I can't help with that one. Is there something else about periods or cycles I can help with?",
            ),
          );
        }
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
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
