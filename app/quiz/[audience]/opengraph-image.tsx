import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";
import { getQuiz, quizzes } from "@/lib/quizzes";

export const alt = "A quiz from The Menstrual Group";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return quizzes.map((quiz) => ({ audience: quiz.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ audience: string }>;
}) {
  const quiz = getQuiz((await params).audience);
  return ogImage({
    title: quiz?.title ?? "How well do you know periods?",
    label: quiz ? `Quiz · ${quiz.label}` : undefined,
    art: ogArt.figure(quiz?.slug ?? "partners"),
  });
}
