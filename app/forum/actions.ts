"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSupabase } from "@/lib/admin";
import { requireUser } from "@/lib/auth";
import { BODY_MAX, TITLE_MAX, TITLE_MIN, getCategory } from "@/lib/forum";
import { safeNext } from "@/lib/session";
import { trackServer } from "@/lib/track-server";

export type ForumFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Changes on every success, so a reply box can clear itself. */
  savedAt?: number;
};

const failed = (message: string): ForumFormState => ({
  status: "error",
  message,
});

/** Posting needs a Google sign-in, which the admin password isn't. */
async function poster(returnTo: string) {
  const session = await requireUser(returnTo);
  if (!session.email) return null;
  return { ...session, email: session.email.toLowerCase() };
}

/**
 * Slows down floods and runaway double-clicks: at most 5 posts a minute and
 * 5 new conversations an hour per person.
 */
async function tooFast(email: string, table: "forum_posts" | "forum_threads") {
  const supabase = getAdminSupabase();
  if (!supabase) return false;
  const windowMs = table === "forum_posts" ? 60_000 : 60 * 60_000;
  const { count } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("author_email", email)
    .gte("created_at", new Date(Date.now() - windowMs).toISOString());
  return (count ?? 0) >= 5;
}

function cleanBody(formData: FormData) {
  // Keep line breaks, but not runs of blank lines.
  return String(formData.get("body") ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function createThread(
  _state: ForumFormState,
  formData: FormData,
): Promise<ForumFormState> {
  const user = await poster("/forum/new");
  if (!user) return failed("Sign in with Google to post.");

  const category = getCategory(formData.get("category"));
  const title = String(formData.get("title") ?? "").trim();
  const body = cleanBody(formData);
  if (!category) return failed("Please choose a category.");
  if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    return failed(
      `Give it a title between ${TITLE_MIN} and ${TITLE_MAX} characters.`,
    );
  }
  if (!body) return failed("Please write something to start the conversation.");
  if (body.length > BODY_MAX) {
    return failed(`Keep it to ${BODY_MAX} characters.`);
  }

  const supabase = getAdminSupabase();
  if (!supabase) return failed("The forum isn't set up yet.");
  if (await tooFast(user.email, "forum_threads")) {
    return failed(
      "You've started a lot of conversations recently. Please try again later.",
    );
  }

  // People who signed in before the users table existed have no row yet.
  await supabase
    .from("users")
    .upsert(
      { email: user.email },
      { onConflict: "email", ignoreDuplicates: true },
    );

  const { data: thread, error } = await supabase
    .from("forum_threads")
    .insert({ category: category.slug, title, author_email: user.email })
    .select("id")
    .single();
  if (error || !thread) {
    console.error("Creating a thread failed:", error?.message);
    return failed("Couldn't post. Please try again.");
  }

  const { error: postError } = await supabase
    .from("forum_posts")
    .insert({ thread_id: thread.id, author_email: user.email, body });
  if (postError) {
    console.error("Creating an opening post failed:", postError.message);
    await supabase.from("forum_threads").delete().eq("id", thread.id);
    return failed("Couldn't post. Please try again.");
  }

  await trackServer("Forum Thread Started", { category: category.slug });
  redirect(`/forum/${thread.id}`);
}

export async function createReply(
  _state: ForumFormState,
  formData: FormData,
): Promise<ForumFormState> {
  const threadId = Number(formData.get("threadId"));
  if (!Number.isInteger(threadId)) return failed("Unknown conversation.");

  const user = await poster(`/forum/${threadId}`);
  if (!user) return failed("Sign in with Google to reply.");

  const body = cleanBody(formData);
  if (!body) return failed("Please write a reply first.");
  if (body.length > BODY_MAX) {
    return failed(`Keep it to ${BODY_MAX} characters.`);
  }

  const supabase = getAdminSupabase();
  if (!supabase) return failed("The forum isn't set up yet.");
  if (await tooFast(user.email, "forum_posts")) {
    return failed("You're posting quickly. Please wait a minute.");
  }

  await supabase
    .from("users")
    .upsert(
      { email: user.email },
      { onConflict: "email", ignoreDuplicates: true },
    );

  const { error } = await supabase
    .from("forum_posts")
    .insert({ thread_id: threadId, author_email: user.email, body });
  if (error) {
    // 23503: the thread was deleted while they were typing.
    if (error.code === "23503") {
      return failed("That conversation has been removed.");
    }
    console.error("Creating a reply failed:", error.message);
    return failed("Couldn't post. Please try again.");
  }

  await trackServer("Forum Reply");
  refresh();
  return { status: "success", savedAt: Date.now() };
}

/**
 * Removes a post. Authors can remove their own and admins can remove any.
 * Removing a conversation's opening post removes the whole conversation.
 */
export async function deletePost(formData: FormData) {
  const postId = Number(formData.get("postId"));
  if (!Number.isInteger(postId)) return;

  const session = await requireUser("/forum");
  const supabase = getAdminSupabase();
  if (!supabase) return;

  const { data: post } = await supabase
    .from("forum_posts")
    .select("id, thread_id, author_email")
    .eq("id", postId)
    .maybeSingle();
  if (!post) return;

  const isAuthor =
    session.email !== null && post.author_email === session.email.toLowerCase();
  if (!isAuthor && session.role !== "admin") return;

  const { data: opening } = await supabase
    .from("forum_posts")
    .select("id")
    .eq("thread_id", post.thread_id)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(1)
    .single();

  if (opening?.id === post.id) {
    const { error } = await supabase
      .from("forum_threads")
      .delete()
      .eq("id", post.thread_id);
    if (error) {
      console.error("Deleting a thread failed:", error.message);
      return;
    }
    // The conversation page no longer exists, so go back to where they were
    // (their posts list) or to the forum.
    const back = safeNext(formData.get("returnTo"), "/forum");
    if (back !== "/account/posts") redirect("/forum");
    refresh();
    return;
  }

  const { error } = await supabase
    .from("forum_posts")
    .delete()
    .eq("id", postId);
  if (error) console.error("Deleting a post failed:", error.message);
  refresh();
}

/**
 * Edits a post. Only its author can, not admins. On a conversation's opening
 * post, the author can change the title too.
 */
export async function updatePost(
  _state: ForumFormState,
  formData: FormData,
): Promise<ForumFormState> {
  const postId = Number(formData.get("postId"));
  if (!Number.isInteger(postId)) return failed("Unknown post.");

  const user = await poster("/account/posts");
  if (!user) return failed("Sign in with Google to edit.");

  const body = cleanBody(formData);
  if (!body) return failed("A post can't be empty.");
  if (body.length > BODY_MAX) {
    return failed(`Keep it to ${BODY_MAX} characters.`);
  }

  const supabase = getAdminSupabase();
  if (!supabase) return failed("The forum isn't set up yet.");

  const { data: post } = await supabase
    .from("forum_posts")
    .select("id, thread_id, author_email")
    .eq("id", postId)
    .maybeSingle();
  if (!post || post.author_email !== user.email) {
    return failed("You can only edit your own posts.");
  }

  const titleField = formData.get("title");
  if (titleField !== null) {
    const title = String(titleField).trim();
    if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
      return failed(
        `Give it a title between ${TITLE_MIN} and ${TITLE_MAX} characters.`,
      );
    }
    // Only the conversation's starter, editing its opening post.
    const { data: opening } = await supabase
      .from("forum_posts")
      .select("id")
      .eq("thread_id", post.thread_id)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .limit(1)
      .single();
    if (opening?.id !== post.id) {
      return failed("Only the opening post has a title.");
    }
    const { error: titleError } = await supabase
      .from("forum_threads")
      .update({ title })
      .eq("id", post.thread_id)
      .eq("author_email", user.email);
    if (titleError) {
      console.error("Editing a title failed:", titleError.message);
      return failed("Couldn't save. Please try again.");
    }
  }

  const { error } = await supabase
    .from("forum_posts")
    .update({ body, edited_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("author_email", user.email);
  if (error) {
    console.error("Editing a post failed:", error.message);
    return failed("Couldn't save. Please try again.");
  }

  refresh();
  return { status: "success", savedAt: Date.now() };
}
