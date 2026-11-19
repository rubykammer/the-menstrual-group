import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { timeAgo } from "@/lib/forum";
import {
  listQuizResults,
  readingFor,
  type QuizHistory,
} from "@/lib/quiz-results";
import { quizzes } from "@/lib/quizzes";

export const metadata: Metadata = { title: "Quiz results" };

export default async function QuizResultsPage() {
  const session = await requireUser("/account/quizzes");

  if (!session.email) {
    return (
      <p className="max-w-xl">
        You signed in with the admin password, which isn&apos;t tied to anyone.
        Sign in with Google to save quiz results.
      </p>
    );
  }

  const result = await listQuizResults(session.email);
  if (result.status !== "ok") {
    return (
      <p className="max-w-xl rounded-card bg-honey p-6">
        {result.status === "not-set-up"
          ? "Quiz results aren't set up yet. In Supabase, run supabase/activity.sql from this project."
          : `Couldn't load your results: ${result.message}`}
      </p>
    );
  }

  const taken = new Set(result.history.map((entry) => entry.quiz.slug));
  const notTaken = quizzes.filter((quiz) => !taken.has(quiz.slug));

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div>
        <h2 className="text-2xl sm:text-3xl">Quiz results</h2>
        <p className="mt-2 text-muted">
          Every quiz you finish while signed in is saved here. Only you can see
          it.
        </p>
      </div>

      {result.history.length === 0 && (
        <p className="rounded-card bg-surface p-6 shadow-soft">
          You haven&apos;t finished a quiz while signed in yet.
        </p>
      )}

      {result.history.map((entry) => (
        <QuizCard key={entry.quiz.slug} entry={entry} />
      ))}

      {notTaken.length > 0 && (
        <section aria-labelledby="try-heading">
          <h2 id="try-heading" className="text-xl sm:text-2xl">
            {result.history.length === 0 ? "Try a quiz" : "Quizzes to try"}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {notTaken.map((quiz) => (
              <li key={quiz.slug} className={`rounded-card p-5 ${quiz.tint}`}>
                <p className="text-sm font-extrabold text-primary-strong uppercase">
                  {quiz.label}
                </p>
                <Link
                  href={`/quiz/${quiz.slug}`}
                  className="mt-1 block text-lg font-bold hover:text-primary-strong"
                >
                  {quiz.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function QuizCard({ entry }: { entry: QuizHistory }) {
  const { quiz, attempts, best } = entry;
  const latest = attempts[0];
  const first = attempts[attempts.length - 1];
  const missed = quiz.questions.flatMap((question, index) =>
    latest.answers[index] === question.answer
      ? []
      : [{ question, index, picked: latest.answers[index] }],
  );
  // Oldest to newest, at most the last 10, for the little chart.
  const recent = attempts.slice(0, 10).reverse();

  return (
    <section
      aria-labelledby={`quiz-${quiz.slug}`}
      className="rounded-card bg-surface p-6 shadow-soft sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-primary-strong uppercase">
            {quiz.label}
          </p>
          <h3 id={`quiz-${quiz.slug}`} className="mt-1 text-xl sm:text-2xl">
            {quiz.title}
          </h3>
        </div>
        <Link
          href={`/quiz/${quiz.slug}`}
          className="rounded-full bg-primary-strong px-5 py-2 font-extrabold text-on-primary hover:bg-primary-hover"
        >
          Take it again
        </Link>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl bg-peach p-3">
          <dt className="text-sm font-bold text-muted">Latest</dt>
          <dd className="font-display text-3xl text-primary-strong">
            {latest.score}/{latest.total}
          </dd>
        </div>
        <div className="rounded-2xl bg-honey p-3">
          <dt className="text-sm font-bold text-muted">Best</dt>
          <dd className="font-display text-3xl text-primary-strong">
            {best}/{latest.total}
          </dd>
        </div>
        <div className="rounded-2xl bg-blush p-3">
          <dt className="text-sm font-bold text-muted">Attempts</dt>
          <dd className="font-display text-3xl text-primary-strong">
            {attempts.length}
          </dd>
        </div>
      </dl>

      {attempts.length > 1 && (
        <div className="mt-6">
          <p className="text-sm font-bold text-muted">
            {latest.score > first.score
              ? `Up from ${first.score}/${first.total} on your first try.`
              : latest.score === first.score
                ? "Same score as your first try."
                : `Your first try was ${first.score}/${first.total}.`}
          </p>
          <ol
            className="mt-3 flex h-16 items-end gap-1.5"
            aria-label="Your scores, oldest to newest"
          >
            {recent.map((attempt) => (
              <li
                key={attempt.id}
                className="flex-1 rounded-t-md bg-primary"
                style={{
                  height: `${Math.max(8, (attempt.score / attempt.total) * 100)}%`,
                }}
              >
                <span className="sr-only">
                  {attempt.score} out of {attempt.total},{" "}
                  {timeAgo(attempt.createdAt)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-8">
        <h4 className="text-lg font-extrabold">How to improve</h4>
        {missed.length === 0 ? (
          <p className="mt-2">
            Full marks last time, {timeAgo(latest.createdAt)}. Nothing to work
            on here.
          </p>
        ) : (
          <>
            <p className="mt-1 text-muted">
              From your latest try, {timeAgo(latest.createdAt)}:
            </p>
            <ul className="mt-4 flex flex-col gap-4">
              {missed.map(({ question, index, picked }) => {
                const reading = readingFor(quiz, index);
                return (
                  <li key={index} className="rounded-2xl bg-honey p-5">
                    <p className="font-bold">{question.question}</p>
                    <p className="mt-2 text-sm">
                      <span className="font-bold text-accent-strong">
                        You said:
                      </span>{" "}
                      {question.options[picked] ?? "—"}
                    </p>
                    <p className="mt-1 text-sm">
                      <span className="font-bold text-correct">Better:</span>{" "}
                      {question.options[question.answer]}
                    </p>
                    <p className="mt-2">{question.explanation}</p>
                    {reading && (
                      <Link
                        href={reading.href}
                        className="mt-2 inline-block font-bold text-primary-strong underline"
                      >
                        Read: {reading.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
