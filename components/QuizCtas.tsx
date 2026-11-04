import Link from "next/link";
import { quizzes, type Quiz } from "@/lib/quizzes";
import { DadFigure, FriendFigure, PartnerFigure } from "./People";

export const quizFigures: Record<Quiz["slug"], typeof PartnerFigure> = {
  partners: PartnerFigure,
  dads: DadFigure,
  friends: FriendFigure,
};

/** Three quiz cards, one per audience, each with its own illustration. */
export function QuizCtas() {
  return (
    <section aria-labelledby="quiz-heading" className="page-width">
      <div className="max-w-2xl">
        <h2 id="quiz-heading" className="text-3xl sm:text-4xl">
          How ready are you to show up?
        </h2>
        <p className="mt-3 text-lg">
          Pick your quiz. Five questions, about a minute, and no one sees your
          score.
        </p>
      </div>
      <QuizCardGrid />
    </section>
  );
}

export function QuizCardGrid() {
  return (
    <ul className="mt-8 grid gap-6 md:grid-cols-3">
      {quizzes.map((quiz) => (
        <li key={quiz.slug}>
          <QuizCard quiz={quiz} />
        </li>
      ))}
    </ul>
  );
}

function QuizCard({ quiz }: { quiz: Quiz }) {
  const Figure = quizFigures[quiz.slug];
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-card p-6 transition-all duration-300 hover:shadow-soft motion-safe:hover:-translate-y-1 ${quiz.tint}`}
    >
      <Figure className="mx-auto h-56 w-auto transition-transform duration-300 motion-safe:group-hover:-rotate-2" />
      <p className="mt-4 text-sm font-extrabold tracking-wide text-primary-strong uppercase">
        {quiz.label}
      </p>
      <h3 className="mt-1 text-2xl">{quiz.title}</h3>
      <p className="mt-2 grow">{quiz.teaser}</p>
      <Link
        href={`/quiz/${quiz.slug}`}
        className="mt-5 self-start rounded-full bg-primary-strong px-5 py-2.5 font-extrabold text-white transition-colors duration-200 after:absolute after:inset-0 group-hover:bg-orange-800"
      >
        Take the quiz
        <span className="sr-only">: {quiz.title}</span>
      </Link>
    </article>
  );
}

/** A single wide quiz banner, for the top of a guide page. */
export function QuizBanner({ slug }: { slug: Quiz["slug"] }) {
  const quiz = quizzes.find((q) => q.slug === slug)!;
  const Figure = quizFigures[slug];
  return (
    <section className="page-width mt-14">
      <div
        className={`relative flex flex-col items-center gap-6 overflow-hidden rounded-card px-6 pt-8 sm:flex-row sm:gap-10 sm:px-10 sm:pt-6 ${quiz.tint}`}
      >
        <div className="sm:order-2 sm:py-4">
          <p className="text-sm font-extrabold tracking-wide text-primary-strong uppercase">
            Quick quiz
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl">{quiz.title}</h2>
          <p className="mt-2 max-w-lg">{quiz.teaser}</p>
          <Link
            href={`/quiz/${quiz.slug}`}
            className="mt-5 inline-block rounded-full bg-primary-strong px-5 py-2.5 font-extrabold text-white transition-colors duration-200 after:absolute after:inset-0 hover:bg-orange-800"
          >
            Take the quiz
          </Link>
        </div>
        <Figure className="-mb-14 h-56 w-auto shrink-0 sm:order-1 sm:-mb-16 sm:h-64" />
      </div>
    </section>
  );
}
