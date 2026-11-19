"use server";

import { getAdminSupabase } from "@/lib/admin";
import { getSession } from "@/lib/auth";
import { scoreAnswers } from "@/lib/quiz-results";
import { getQuiz } from "@/lib/quizzes";
import { ensureUserRow, isMissingTable } from "@/lib/roles";

export type SaveQuizResult =
  { status: "saved" } | { status: "signed-out" } | { status: "error" };

/**
 * Saves a finished quiz for the signed-in member. Visitors who aren't signed
 * in can still take quizzes; nothing is saved for them.
 */
export async function saveQuizResult(
  slug: unknown,
  answers: unknown,
): Promise<SaveQuizResult> {
  const quiz = typeof slug === "string" ? getQuiz(slug) : undefined;
  if (!quiz) return { status: "error" };
  const result = scoreAnswers(quiz, answers);
  if (!result) return { status: "error" };

  const session = await getSession();
  if (!session?.email) return { status: "signed-out" };
  const email = session.email.toLowerCase();

  const supabase = getAdminSupabase();
  if (!supabase) return { status: "error" };

  await ensureUserRow(email);
  const { error } = await supabase.from("quiz_results").insert({
    email,
    quiz: quiz.slug,
    score: result.score,
    total: result.total,
    answers: result.answers,
  });
  if (error) {
    if (!isMissingTable(error)) {
      console.error("Saving a quiz result failed:", error.message);
    }
    return { status: "error" };
  }
  return { status: "saved" };
}
