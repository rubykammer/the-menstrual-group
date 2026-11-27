import type { Metadata } from "next";
import Link from "next/link";
import { ForumNotSetUp } from "@/app/forum/parts";
import { PostBody } from "@/app/forum/PostBody";
import { requireUser } from "@/lib/auth";
import { getCategory, listMyPosts, timeAgo } from "@/lib/forum";

export const metadata: Metadata = { title: "Your posts" };

export default async function MyPostsPage() {
  const session = await requireUser("/account/posts");

  if (!session.email) {
    return (
      <p className="max-w-xl">
        You signed in with the admin password, which isn&apos;t tied to anyone,
        so there are no posts to show. Sign in with Google to post.
      </p>
    );
  }

  const result = await listMyPosts(session.email);

  return (
    <section aria-labelledby="posts-heading" className="max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="posts-heading" className="text-2xl sm:text-3xl">
            Your posts
          </h2>
          <p className="mt-2 text-muted">
            Everything you&apos;ve written in the forum. Edit or remove any of
            it here.
          </p>
        </div>
        <Link
          href="/forum"
          className="rounded-full border-2 border-primary-strong px-5 py-2 font-extrabold text-primary-strong hover:bg-primary-strong hover:text-on-primary"
        >
          Go to the forum
        </Link>
      </div>

      {result.status === "not-set-up" && <ForumNotSetUp />}
      {result.status === "error" && (
        <p className="mt-6 rounded-card bg-mist p-6">
          Couldn&apos;t load your posts: {result.message}
        </p>
      )}
      {result.status === "ok" && result.data.length === 0 && (
        <div className="mt-6 rounded-card bg-surface p-8 text-center shadow-soft">
          <p className="text-lg font-bold">You haven&apos;t posted yet.</p>
          <p className="mt-2 text-muted">
            <Link
              href="/forum/new"
              className="font-bold text-primary-strong underline"
            >
              Start a conversation
            </Link>{" "}
            or reply to one in the forum.
          </p>
        </div>
      )}
      {result.status === "ok" && result.data.length > 0 && (
        <ol className="mt-6 flex flex-col gap-4">
          {result.data.map((post) => (
            <li
              key={post.id}
              className="rounded-card bg-surface p-5 shadow-soft sm:p-6"
            >
              <p className="text-sm font-extrabold tracking-wide text-primary-strong uppercase">
                {post.isOpening ? "Started a conversation" : "Replied"} ·{" "}
                {getCategory(post.thread.category)?.label ?? "General chat"}
              </p>
              <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4">
                <Link
                  href={`/forum/${post.thread.id}#post-${post.id}`}
                  className="text-lg font-bold break-words hover:text-primary-strong"
                >
                  {post.thread.title}
                </Link>
                <time dateTime={post.createdAt} className="text-sm text-muted">
                  {timeAgo(post.createdAt)}
                </time>
              </div>
              <PostBody
                postId={post.id}
                body={post.body}
                edited={post.editedAt !== null}
                canEdit
                canDelete
                isOpening={post.isOpening}
                title={post.isOpening ? post.thread.title : undefined}
                returnTo="/account/posts"
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
