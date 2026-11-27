import { GoogleGenAI } from "@google/genai";
import { auntFloSystemPrompt, chatLimits } from "@/lib/auntflo";
import {
  createRateLimiter,
  errorReason,
  failureResponse,
  geminiKey,
  geminiModels,
  retryableStatus,
  visitorIp,
} from "@/lib/gemini";

// Replies can take a little while to finish streaming.
export const maxDuration = 60;

type ChatMessage = { role: "user" | "assistant"; content: string };

/** At most 30 messages per visitor every 10 minutes. */
const rateLimited = createRateLimiter(10 * 60 * 1000, 30);

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

  if (rateLimited(visitorIp(request))) {
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
  for (const model of geminiModels) {
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
      if (request.signal.aborted || !retryableStatus.has(status ?? 0)) break;
    }
  }
  if (!chunks) {
    const failure = failureResponse("AuntFlo", status);
    return plainText(failure.message, failure.status, reason);
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
