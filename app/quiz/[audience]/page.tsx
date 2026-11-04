import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Quiz } from "@/components/Quiz";
import { quizFigures } from "@/components/QuizCtas";
import { getQuiz, quizzes } from "@/lib/quizzes";

// Only the three quizzes exist, so anything else is a real 404
export const dynamicParams = false;

type QuizPageProps = { params: Promise<{ audience: string }> };

export function generateStaticParams() {
  return quizzes.map((quiz) => ({ audience: quiz.slug }));
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const quiz = getQuiz((await params).audience);
  if (!quiz) return {};
  return { title: quiz.title, description: quiz.teaser };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const quiz = getQuiz((await params).audience);
  if (!quiz) notFound();

  const Figure = quizFigures[quiz.slug];

  return (
    <div className="page-width pt-8 sm:pt-12">
      <nav aria-label="Breadcrumb" className="text-sm font-bold text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link
              href={quiz.guideHref}
              className="transition-colors duration-200 hover:text-primary-strong"
            >
              {quiz.label}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">Quiz</li>
        </ol>
      </nav>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-16">
        <div>
          <h1 className="text-4xl sm:text-5xl">{quiz.title}</h1>
          <p className="mt-4 max-w-2xl text-lg">{quiz.intro}</p>
          <div className="mt-8">
            <Quiz quiz={quiz} />
          </div>
        </div>
        <div
          className={`hidden rounded-card px-6 pt-10 lg:sticky lg:top-28 lg:block ${quiz.tint}`}
        >
          <Figure className="mx-auto h-80 w-auto" />
        </div>
      </div>
    </div>
  );
}
