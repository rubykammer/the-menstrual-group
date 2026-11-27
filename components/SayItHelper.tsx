"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  sayItAudiences,
  sayItLimits,
  type SayItAudience,
  type SayItReply,
} from "@/lib/say-it";

/**
 * "Help me say it": an AI helper under the "Say this, not that" scripts on
 * the supporter pages. The visitor describes their own moment and gets three
 * things they could say, one to avoid and a next step, in the same card
 * style as the scripts above it.
 */
export function SayItHelper({ audience }: { audience: SayItAudience }) {
  const { placeholder, examples } = sayItAudiences[audience];
  const [situation, setSituation] = useState("");
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<SayItReply | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (reply) resultRef.current?.focus();
  }, [reply]);

  async function ask(text: string) {
    const trimmed = text.trim().slice(0, sayItLimits.maxLength);
    if (!trimmed || busy) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);
    setReply(null);
    setCopied(null);
    try {
      const response = await fetch("/api/say-it", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: trimmed, audience }),
        signal: controller.signal,
      });
      const data = (await response.json().catch(() => null)) as SayItReply | null;
      setReply(
        data ?? { ok: false, message: "Sorry, I couldn't answer just now. Please try again in a moment." },
      );
    } catch {
      if (!controller.signal.aborted) {
        setReply({
          ok: false,
          message: "Sorry, I couldn't reach the server. Check your connection and try again.",
        });
      }
    } finally {
      if (abortRef.current === controller) setBusy(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    ask(situation);
  }

  async function copy(line: string, index: number) {
    try {
      await navigator.clipboard.writeText(line);
      setCopied(index);
    } catch {
      // Copying isn't allowed here; the words are still on screen to select.
    }
  }

  return (
    <div className="reveal mt-12 rounded-card border-2 border-dashed border-divider bg-surface p-5 sm:p-8">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-honey text-2xl">
          💬
        </span>
        <div>
          <h3 className="text-2xl sm:text-3xl">Help me say it</h3>
          <p className="mt-1 max-w-2xl text-muted">
            Your moment isn&apos;t on the list? Describe what&apos;s going on and
            get a few kind ways to put it.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6">
        <label htmlFor={`say-it-${audience}`} className="font-extrabold">
          What&apos;s happening?
        </label>
        <textarea
          id={`say-it-${audience}`}
          value={situation}
          onChange={(event) => setSituation(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              ask(situation);
            }
          }}
          rows={3}
          maxLength={sayItLimits.maxLength}
          placeholder={placeholder}
          className="mt-2 block w-full resize-y rounded-2xl border-2 border-line bg-background px-4 py-3 outline-none focus:border-primary-strong"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Or try:</span>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setSituation(example);
                ask(example);
              }}
              disabled={busy}
              className="cursor-pointer rounded-full border-2 border-divider px-3 py-1 text-left text-sm font-bold text-primary-strong transition-colors hover:border-primary-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={busy || situation.trim().length < 8}
            className="h-12 cursor-pointer rounded-full bg-primary-strong px-6 font-extrabold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Thinking…" : "Suggest what to say"}
          </button>
          <p className="max-w-md text-xs text-muted">
            Written by AI, so use your own judgement, and it isn&apos;t medical
            advice. Google may review what you type, so leave out names.{" "}
            <Link href="/privacy#auntflo" className="underline underline-offset-2">Privacy</Link>
          </p>
        </div>
      </form>

      <div aria-live="polite">
        {busy && (
          <div className="mt-6 flex gap-1 py-2" aria-label="Writing suggestions">
            {[0, 150, 300].map((delay) => (
              <span key={delay} className="size-2.5 rounded-full bg-accent motion-safe:animate-bounce" style={{ animationDelay: `${delay}ms` }} />
            ))}
          </div>
        )}

        {reply && !reply.ok && (
          <p className="mt-6 rounded-2xl bg-peach px-4 py-3">{reply.message}</p>
        )}

        {reply?.ok && (
          <div ref={resultRef} tabIndex={-1} className="mt-6 outline-none motion-safe:animate-toast-in">
            {reply.note && (
              <p role="alert" className="mb-4 rounded-2xl border-2 border-accent-strong bg-peach px-4 py-3 font-bold">
                {reply.note}
              </p>
            )}
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-honey p-4 sm:col-span-2">
                <dt className="flex items-center gap-2 font-extrabold">
                  <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-primary-strong" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  You could say
                </dt>
                <dd>
                  <ul className="mt-2 space-y-2">
                    {reply.sayThis.map((line, index) => (
                      <li key={index} className="flex flex-col items-start gap-1 rounded-xl bg-surface/70 px-3 py-2 sm:flex-row sm:justify-between sm:gap-3">
                        <span>“{line}”</span>
                        <button
                          type="button"
                          onClick={() => copy(line, index)}
                          className="shrink-0 cursor-pointer self-end rounded-full px-2 py-0.5 text-sm font-bold text-primary-strong hover:bg-surface sm:self-start"
                        >
                          {copied === index ? "Copied" : "Copy"}
                          <span className="sr-only"> suggestion {index + 1}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              {reply.notThat && (
                <div className="rounded-2xl bg-mist p-4">
                  <dt className="flex items-center gap-2 font-extrabold">
                    <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-accent-strong" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                    Not that
                  </dt>
                  <dd className="mt-1">{reply.notThat}</dd>
                </div>
              )}
              {reply.thenDo && (
                <div className="rounded-2xl border-2 border-line p-4">
                  <dt className="font-extrabold text-primary-strong">Then:</dt>
                  <dd className="mt-1">{reply.thenDo}</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-sm text-muted">
              Put it in your own words: how you say it matters more than the exact wording.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
