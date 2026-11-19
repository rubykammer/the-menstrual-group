import type { Metadata } from "next";
import { QuizCardGrid } from "@/components/QuizCtas";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Period quizzes for partners, dads and friends",
  description:
    "Quick quizzes for partners, dads and friends: five questions each on how to show up well for someone with a period.",
  path: "/quiz",
});

export default function QuizzesPage() {
  return (
    <div className="page-width pt-12 sm:pt-16">
      <header>
        <h1 className="max-w-3xl text-4xl sm:text-6xl">
          How ready are you to <span className="text-primary">show up</span>?
        </h1>
        <p className="mt-5 max-w-2xl text-lg sm:text-xl">
          Pick your quiz. Five questions, about a minute, and no one sees your
          score.
        </p>
      </header>
      <QuizCardGrid headingLevel="h2" />
    </div>
  );
}
