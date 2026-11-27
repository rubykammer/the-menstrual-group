"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { saveQuizResult, type SaveQuizResult } from "@/app/actions/quiz";
import { quizResult, type Quiz as QuizData } from "@/lib/quizzes";
import { trackClient } from "./SiteAnalytics";

export function Quiz({ quiz }: { quiz: QuizData }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [saveState, setSaveState] = useState<
    SaveQuizResult["status"] | "saving" | null
  >(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const started = useRef(false);

  const total = quiz.questions.length;
  const question = quiz.questions[index];
  const answered = picked !== null;

  // Move focus to the new question or the result, but not on first load
  useEffect(() => {
    if (started.current) heading.current?.focus();
    started.current = true;
  }, [index, finished]);

  // On a phone the feedback and Next button land below the fold, so bring
  // them into view once an answer is picked
  useEffect(() => {
    if (picked === null) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nextButton.current?.scrollIntoView({
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [picked]);

  function choose(option: number) {
    if (answered) return;
    setPicked(option);
    setAnswers((previous) => [...previous, option]);
    if (option === question.answer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 < total) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      setFinished(true);
      trackClient("Quiz Completed", { quiz: quiz.slug });
      // Signed-in members get the attempt saved to their account.
      setSaveState("saving");
      saveQuizResult(quiz.slug, answers)
        .then((result) => setSaveState(result.status))
        .catch(() => setSaveState("error"));
    }
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
    setAnswers([]);
    setSaveState(null);
  }

  if (finished) {
    const result = quizResult(score, total);
    return (
      <div className="rounded-card bg-surface p-6 shadow-soft sm:p-10">
        <p className="font-extrabold text-primary-strong">
          You scored {score} out of {total}
        </p>
        <h2
          ref={heading}
          tabIndex={-1}
          className="mt-2 text-3xl outline-none sm:text-4xl"
        >
          {result.heading}
        </h2>
        <p className="mt-3 max-w-xl text-lg">{result.body}</p>
        <p className="mt-4 text-muted" role="status">
          {saveState === "saving" && "Saving your result…"}
          {saveState === "saved" && (
            <>
              Saved to your account.{" "}
              <Link
                href="/account/quizzes"
                className="font-bold text-primary-strong underline"
              >
                See your results and how to improve
              </Link>
            </>
          )}
          {saveState === "signed-out" && (
            <>
              <Link
                href={`/login?${new URLSearchParams({ next: `/quiz/${quiz.slug}` })}`}
                className="font-bold text-primary-strong underline"
              >
                Sign in
              </Link>{" "}
              to save your results and see how to improve next time.
            </>
          )}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={quiz.guideHref}
            className="inline-flex items-center justify-center rounded-full bg-primary-strong px-6 py-3 font-extrabold text-on-primary transition-colors duration-200 hover:bg-primary-hover"
          >
            {quiz.guideLabel}
          </Link>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center justify-center rounded-full border-2 border-primary-strong px-6 py-3 font-extrabold text-primary-strong transition-colors duration-200 hover:bg-primary-strong hover:text-on-primary"
          >
            Try again
          </button>
        </div>
        <ShareResult
          quiz={quiz.slug}
          title={quiz.title}
          text={`I got "${result.heading}" (${score} out of ${total}) on "${quiz.title}". How about you?`}
        />
      </div>
    );
  }

  return (
    <div className="rounded-card bg-surface p-6 shadow-soft sm:p-10">
      <div className="flex items-center gap-4">
        <p className="shrink-0 text-sm font-extrabold text-muted">
          Question {index + 1} of {total}
        </p>
        <div
          className="h-2 grow overflow-hidden rounded-full bg-peach"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index + (answered ? 1 : 0)}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
      </div>

      <h2
        ref={heading}
        tabIndex={-1}
        className="mt-5 text-2xl outline-none sm:text-3xl"
      >
        {question.question}
      </h2>

      <ul className="mt-6 flex flex-col gap-3">
        {question.options.map((option, i) => {
          const isAnswer = i === question.answer;
          const isPicked = i === picked;
          let state = "border-line bg-background hover:border-primary";
          if (answered && isAnswer) state = "border-correct bg-correct-bg";
          else if (answered && isPicked) state = "border-accent-strong bg-mist";
          else if (answered) state = "border-line bg-background opacity-60";

          return (
            <li key={option}>
              <button
                type="button"
                onClick={() => choose(i)}
                aria-disabled={answered}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-lg font-bold transition-colors duration-200 ${state} ${answered ? "cursor-default" : ""}`}
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-current text-sm"
                  aria-hidden="true"
                >
                  {answered && isAnswer ? "✓" : answered && isPicked ? "✕" : String.fromCharCode(65 + i)}
                </span>
                {option}
                {answered && isAnswer && <span className="sr-only">(correct answer)</span>}
                {answered && isPicked && !isAnswer && (
                  <span className="sr-only">(your answer)</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite">
        {answered && (
          <div className="mt-6 rounded-2xl bg-honey p-5">
            <p className="font-extrabold">
              {picked === question.answer ? "That's right." : "Not quite."}
            </p>
            <p className="mt-1">{question.explanation}</p>
          </div>
        )}
      </div>

      {answered && (
        <button
          ref={nextButton}
          type="button"
          onClick={next}
          className="mt-6 inline-flex w-full scroll-mb-6 sm:w-auto items-center justify-center rounded-full bg-primary-strong px-6 py-3 font-extrabold text-on-primary transition-colors duration-200 hover:bg-primary-hover"
        >
          {index + 1 < total ? "Next question" : "See my result"}
          <span aria-hidden="true">&nbsp;→</span>
        </button>
      )}
    </div>
  );
}

/** Uses the phone's share sheet where there is one, else copies a link. */
function ShareResult({
  quiz,
  title,
  text,
}: {
  quiz: string;
  title: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        trackClient("Quiz Result Shared", { quiz });
      } catch {
        // Closing the share sheet isn't an error worth showing
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      trackClient("Quiz Result Shared", { quiz });
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked: nothing more we can do
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="-ml-4 mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 font-extrabold text-primary-strong transition-colors duration-200 hover:bg-peach"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
      </svg>
      <span aria-live="polite">{copied ? "Link copied" : "Share your result"}</span>
    </button>
  );
}
