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

// Card titles sit one level below whatever heading comes before the grid:
// h3 under the homepage's section heading, h2 straight under a page's h1.
type HeadingLevel = "h2" | "h3";

export function QuizCardGrid({
  headingLevel = "h3",
}: {
  headingLevel?: HeadingLevel;
}) {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
      {quizzes.map((quiz) => (
        <li key={quiz.slug}>
          <QuizCard quiz={quiz} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}

function QuizCard({
  quiz,
  headingLevel: Heading,
}: {
  quiz: Quiz;
  headingLevel: HeadingLevel;
}) {
  const Figure = quizFigures[quiz.slug];
  return (
    // Phones: a row with the figure beside the text. Wider: a column.
    <article
      className={`group relative flex h-full items-center gap-4 overflow-hidden rounded-card p-4 transition-all duration-300 hover:shadow-soft motion-safe:hover:-translate-y-1 sm:flex-col sm:items-stretch sm:gap-0 sm:p-5 ${quiz.tint}`}
    >
      <Figure className="h-32 w-auto shrink-0 transition-transform duration-300 motion-safe:group-hover:-rotate-2 sm:mx-auto" />
      <div className="flex min-w-0 grow flex-col self-stretch sm:self-auto">
        <p className="mt-1 text-sm font-extrabold tracking-wide text-primary-strong uppercase sm:mt-3 sm:text-xs">
          {quiz.label}
        </p>
        <Heading className="mt-1 text-lg sm:grow">{quiz.title}</Heading>
        <p className="mt-1 hidden text-sm text-muted md:block">{quiz.teaser}</p>
        <Link
          href={`/quiz/${quiz.slug}`}
          className="mt-3 inline-flex min-h-11 items-center self-start rounded-full bg-primary-strong px-4 text-sm font-extrabold text-on-primary transition-colors duration-200 after:absolute after:inset-0 group-hover:bg-primary-hover"
        >
          Take the quiz
          <span className="sr-only">: {quiz.title}</span>
        </Link>
      </div>
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
            className="mt-5 inline-block rounded-full bg-primary-strong px-5 py-2.5 font-extrabold text-on-primary transition-colors duration-200 after:absolute after:inset-0 hover:bg-primary-hover"
          >
            Take the quiz
          </Link>
        </div>
        <Figure className="-mb-14 h-56 w-auto shrink-0 sm:order-1 sm:-mb-16 sm:h-64" />
      </div>
    </section>
  );
}
