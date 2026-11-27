"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Markdown, { type Components } from "react-markdown";
import { chatLimits } from "@/lib/auntflo-limits";

type ChatMessage = { role: "user" | "assistant"; content: string };

const starters = [
  "Are my cramps normal?",
  "How can I support my partner on their period?",
  "What's the difference between PMS and PMDD?",
  "How do I talk to my kid about periods?",
];

const greeting =
  "Hi, I'm **AuntFlo**! Ask me anything about periods and the menstrual cycle, for yourself or for someone you love. No question is too awkward.";

const markdown: Components = {
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="font-bold text-primary-strong underline underline-offset-2">
        {children}
      </Link>
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-primary-strong underline underline-offset-2"
      >
        {children}
      </a>
    ),
  p: ({ children }) => <p className="mt-2 first:mt-0">{children}</p>,
  ul: ({ children }) => <ul className="mt-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mt-2 list-decimal space-y-1 pl-5">{children}</ol>,
};

/**
 * AuntFlo, the site's chat helper: a button in the corner that opens a chat
 * panel. It sits in the root layout, so the conversation carries on as people
 * move between pages, and it's gone when they close the tab.
 */
export function AuntFlo() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function close() {
    setOpen(false);
    launcherRef.current?.focus();
  }

  async function send(text: string) {
    const question = text.trim().slice(0, chatLimits.maxMessageLength);
    if (!question || busy) return;

    const history: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const setReply = (content: string) =>
      setMessages([...history, { role: "assistant", content }]);

    try {
      const response = await fetch("/api/auntflo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        setReply((await response.text()) || "Sorry, I couldn't answer just now.");
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setReply(reply);
      }
    } catch {
      if (!controller.signal.aborted) {
        setReply("Sorry, I couldn't reach the server. Check your connection and try again.");
      }
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    send(draft);
  }

  function startOver() {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
    inputRef.current?.focus();
  }

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls="auntflo-panel"
        aria-label={open ? "Close chat" : undefined}
        // A quiet speech bubble rather than a big button, so it doesn't
        // compete with the page's own calls to action.
        className={`fixed right-4 bottom-4 z-30 inline-flex cursor-pointer items-center border border-line bg-surface text-left text-foreground shadow-soft transition-all duration-200 hover:border-divider motion-safe:animate-toast-in motion-safe:hover:-translate-y-0.5 sm:right-6 sm:bottom-6 ${open ? "size-12 justify-center rounded-full text-2xl leading-none max-sm:hidden" : "gap-2.5 rounded-2xl rounded-br-sm py-2 pr-4 pl-2"}`}
      >
        {open ? (
          "×"
        ) : (
          <>
            <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-peach text-lg">
              🌸
            </span>
            <span className="leading-tight">
              <span className="block text-xs text-muted">Got a question?</span>
              <span className="block text-sm font-bold">Ask AuntFlo</span>
            </span>
          </>
        )}
      </button>

      {open && (
        <section
          id="auntflo-panel"
          aria-labelledby="auntflo-title"
          onKeyDown={(event) => event.key === "Escape" && close()}
          className="fixed inset-x-3 top-3 bottom-3 z-40 flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-soft sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-24 sm:h-[min(38rem,calc(100dvh-8rem))] sm:w-[26rem]"
        >
          <header className="flex items-center gap-3 border-b border-line bg-mist px-5 py-3">
            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-xl text-white">
              🌸
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="auntflo-title" className="text-xl leading-tight">AuntFlo</h2>
              <p className="text-sm text-muted">Your friendly cycle helper</p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={startOver}
                className="cursor-pointer rounded-full px-3 py-1 text-sm font-bold text-accent-strong hover:bg-surface"
              >
                Start over
              </button>
            )}
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="grid size-9 cursor-pointer place-items-center rounded-full text-2xl leading-none hover:bg-surface"
            >
              ×
            </button>
          </header>

          <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-peach px-4 py-2.5">
              <Markdown components={markdown}>{greeting}</Markdown>
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => send(starter)}
                    className="cursor-pointer rounded-full border-2 border-divider px-3 py-1.5 text-left text-sm font-bold text-primary-strong transition-colors hover:border-primary-strong"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message, index) =>
              message.role === "user" ? (
                <div key={index} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary-strong px-4 py-2.5 whitespace-pre-wrap text-on-primary">
                  <span className="sr-only">You said: </span>
                  {message.content}
                </div>
              ) : (
                <div key={index} className="max-w-[85%] rounded-2xl rounded-tl-sm bg-peach px-4 py-2.5">
                  <span className="sr-only">AuntFlo said: </span>
                  {message.content ? (
                    <Markdown components={markdown}>{message.content}</Markdown>
                  ) : (
                    <span className="inline-flex gap-1 py-2" aria-label="AuntFlo is typing">
                      {[0, 150, 300].map((delay) => (
                        <span key={delay} className="size-2 rounded-full bg-accent motion-safe:animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </span>
                  )}
                </div>
              ),
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-line p-3">
            <div className="flex items-end gap-2">
              <label htmlFor="auntflo-input" className="sr-only">Your question for AuntFlo</label>
              <textarea
                id="auntflo-input"
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send(draft);
                  }
                }}
                rows={1}
                maxLength={chatLimits.maxMessageLength}
                placeholder="Ask AuntFlo anything…"
                className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border-2 border-line bg-background px-4 py-2 outline-none focus:border-primary-strong"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                className="h-11 cursor-pointer rounded-full bg-primary-strong px-5 font-extrabold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">
              AuntFlo is an AI and can get things wrong. It isn&apos;t medical advice: see a doctor for anything worrying. Google may review chats, so don&apos;t share personal details.{" "}
              <Link href="/privacy#auntflo" className="underline underline-offset-2">Privacy</Link>
            </p>
          </form>
        </section>
      )}
    </>
  );
}
