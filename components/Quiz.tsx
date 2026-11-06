"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { quizResult, type Quiz as QuizData } from "@/lib/quizzes";

export function Quiz({ quiz }: { quiz: QuizData }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  const total = quiz.questions.length;
  const question = quiz.questions[index];
  const answered = picked !== null;

  // Move focus to the new question or the result, but not on first load
  useEffect(() => {
    if (started.current) heading.current?.focus();
    started.current = true;
  }, [index, finished]);

  function choose(option: number) {
    if (answered) return;
    setPicked(option);
    if (option === question.answer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 < total) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
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
          if (answered && isAnswer) state = "border-green-700 bg-green-50";
          else if (answered && isPicked) state = "border-accent-strong bg-blush";
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
          type="button"
          onClick={next}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-strong px-6 py-3 font-extrabold text-on-primary transition-colors duration-200 hover:bg-primary-hover"
        >
          {index + 1 < total ? "Next question" : "See my result"}
          <span aria-hidden="true">&nbsp;→</span>
        </button>
      )}
    </div>
  );
}
