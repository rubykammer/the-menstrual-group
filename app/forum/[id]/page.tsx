import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getCategory, getThread, timeAgo } from "@/lib/forum";
import { AuthorBadge, ForumNotSetUp } from "../parts";
import { PostBody } from "../PostBody";
import { ReplyForm } from "./ReplyForm";

export const metadata: Metadata = {
  title: "Forum",
  robots: { index: false, follow: false },
};

export default async function ThreadPage({ params }: PageProps<"/forum/[id]">) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isSafeInteger(id) || id < 1) notFound();

  const session = await requireUser(`/forum/${id}`);
  const result = await getThread(id, {
    email: session.email,
    isAdmin: session.role === "admin",
  });

  if (result.status === "not-set-up") {
    return (
      <div className="page-width pt-12 pb-16">
        <ForumNotSetUp />
      </div>
    );
  }
  if (result.status === "error") {
    return (
      <div className="page-width pt-12 pb-16">
        <p className="rounded-card bg-mist p-6">
          Couldn&apos;t load this conversation: {result.message}
        </p>
      </div>
    );
  }

  const thread = result.data;
  if (!thread) notFound();
  const category = getCategory(thread.category);

  return (
    <div className="page-width pt-8 pb-16 sm:pt-12">
      <nav aria-label="Breadcrumb" className="text-sm font-bold text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/forum" className="hover:text-primary-strong">
              Forum
            </Link>
          </li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/forum?category=${category.slug}`}
                  className="hover:text-primary-strong"
                >
                  {category.label}
                </Link>
              </li>
            </>
          )}
        </ol>
      </nav>

      <h1 className="mt-6 max-w-3xl text-3xl break-words sm:text-5xl">
        {thread.title}
      </h1>

      <ol className="mt-8 flex max-w-3xl flex-col gap-4">
        {thread.posts.map((post) => (
          <li
            key={post.id}
            id={`post-${post.id}`}
            className={`rounded-card p-5 shadow-soft sm:p-6 ${
              post.isOpening ? "bg-surface ring-2 ring-divider" : "bg-surface"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <AuthorBadge author={post.author} />
              <time dateTime={post.createdAt} className="text-sm text-muted">
                {timeAgo(post.createdAt)}
              </time>
            </div>
            <PostBody
              postId={post.id}
              body={post.body}
              edited={post.editedAt !== null}
              canEdit={post.canEdit}
              canDelete={post.canDelete}
              isOpening={post.isOpening}
              title={post.isOpening ? thread.title : undefined}
            />
          </li>
        ))}
      </ol>

      <div className="mt-8 max-w-3xl rounded-card bg-surface p-5 shadow-soft sm:p-6">
        {session.email ? (
          <ReplyForm threadId={thread.id} />
        ) : (
          <p>
            You signed in with the admin password, which isn&apos;t tied to
            anyone. Sign in with Google to reply.
          </p>
        )}
      </div>
    </div>
  );
}
