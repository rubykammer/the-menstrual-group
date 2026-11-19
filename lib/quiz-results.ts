import { getAdminSupabase } from "./admin";
import { getPost } from "./posts";
import { quizzes, type Quiz } from "./quizzes";
import { isMissingTable } from "./roles";

/**
 * Saved quiz attempts (supabase/activity.sql) and what to read to improve.
 * Scores are always worked out here from the answers, never trusted from the
 * browser.
 */

/** For each quiz, in question order: where to read more about it. */
const furtherReading: Record<Quiz["slug"], string[]> = {
  partners: [
    "/blog/cramps-what-actually-helps",
    "/blog/menstrual-cycle-explained",
    "/blog/luteal-rage-is-real",
    "/blog/whats-normal-when-to-see-a-doctor",
    "/products",
  ],
  dads: [
    "/blog/talking-to-kids-about-periods",
    "/blog/talking-to-kids-about-periods",
    "/blog/talking-to-kids-about-periods",
    "/products",
    "/products",
  ],
  friends: [
    "/blog/what-to-say-and-what-not-to",
    "/blog/what-to-say-and-what-not-to",
    "/blog/endometriosis-guide",
    "/blog/menstrual-cycle-explained",
    "/blog/what-to-say-and-what-not-to",
  ],
};

export function readingFor(quiz: Quiz, questionIndex: number) {
  const href = furtherReading[quiz.slug][questionIndex];
  if (!href) return null;
  if (href === "/products") return { href, label: "Compare period products" };
  const post = getPost(href.replace("/blog/", ""));
  return post ? { href, label: post.title } : null;
}

/** Null if the answers don't fit the quiz. */
export function scoreAnswers(quiz: Quiz, answers: unknown) {
  if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
    return null;
  }
  let score = 0;
  for (const [index, question] of quiz.questions.entries()) {
    const answer = answers[index];
    if (
      !Number.isInteger(answer) ||
      answer < 0 ||
      answer >= question.options.length
    ) {
      return null;
    }
    if (answer === question.answer) score += 1;
  }
  return { score, total: quiz.questions.length, answers: answers as number[] };
}

export type Attempt = {
  id: number;
  score: number;
  total: number;
  answers: number[];
  createdAt: string;
};

export type QuizHistory = {
  quiz: Quiz;
  /** Newest first. */
  attempts: Attempt[];
  best: number;
};

export type QuizResults =
  | { status: "ok"; history: QuizHistory[] }
  | { status: "not-set-up" }
  | { status: "error"; message: string };

export async function listQuizResults(email: string): Promise<QuizResults> {
  const supabase = getAdminSupabase();
  if (!supabase) return { status: "not-set-up" };

  const { data, error } = await supabase
    .from("quiz_results")
    .select("id, quiz, score, total, answers, created_at")
    .eq("email", email.toLowerCase())
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    return isMissingTable(error)
      ? { status: "not-set-up" }
      : { status: "error", message: error.message };
  }

  const history: QuizHistory[] = [];
  for (const quiz of quizzes) {
    const attempts = data
      .filter((row) => row.quiz === quiz.slug)
      .map((row) => ({
        id: row.id as number,
        score: row.score as number,
        total: row.total as number,
        answers: row.answers as number[],
        createdAt: row.created_at as string,
      }));
    if (attempts.length === 0) continue;
    history.push({
      quiz,
      attempts,
      best: Math.max(...attempts.map((attempt) => attempt.score)),
    });
  }
  return { status: "ok", history };
}
