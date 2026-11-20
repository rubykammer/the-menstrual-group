import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { categories, getCategory, listThreads, timeAgo } from "@/lib/forum";
import { AuthorBadge, ForumNotSetUp, Guidelines } from "./parts";

export const metadata: Metadata = {
  title: "Forum",
  description: "Talk about periods with other members.",
  robots: { index: false, follow: false },
};

const chip =
  "rounded-full px-4 py-2 font-bold whitespace-nowrap transition-colors duration-200 hover:bg-peach hover:text-primary-strong aria-[current=page]:bg-peach aria-[current=page]:text-primary-strong";

export default async function ForumPage({ searchParams }: PageProps<"/forum">) {
  const { category: categoryParam } = await searchParams;
  const category = getCategory(categoryParam);
  await requireUser(category ? `/forum?category=${category.slug}` : "/forum");

  const result = await listThreads(category?.slug);
  const newHref = category
    ? `/forum/new?category=${category.slug}`
    : "/forum/new";

  return (
    <div className="page-width pt-12 pb-16 sm:pt-16">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-6xl">Forum</h1>
          <p className="mt-4 text-lg sm:text-xl">
            Swap experiences, ask questions and find people who get it. Only
            signed-in members can read and post.
          </p>
        </div>
        <Link
          href={newHref}
          className="rounded-full bg-primary-strong px-6 py-3 font-extrabold text-on-primary hover:bg-primary-hover"
        >
          Start a conversation
        </Link>
      </header>

      <nav
        aria-label="Forum categories"
        className="mt-10"
      >
        <ul className="flex flex-wrap gap-1">
          <li>
            <Link
              href="/forum"
              aria-current={!category ? "page" : undefined}
              className={chip}
            >
              Everything
            </Link>
          </li>
          {categories.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/forum?category=${item.slug}`}
                aria-current={category?.slug === item.slug ? "page" : undefined}
                className={chip}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {category && <p className="mt-3 text-muted">{category.description}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <section aria-label="Conversations">
          {result.status === "not-set-up" && <ForumNotSetUp />}
          {result.status === "error" && (
            <p className="rounded-card bg-blush p-6">
              Couldn&apos;t load the forum: {result.message}
            </p>
          )}
          {result.status === "ok" && result.data.length === 0 && (
            <div className="rounded-card bg-surface p-8 text-center shadow-soft">
              <p className="text-lg font-bold">No conversations here yet.</p>
              <p className="mt-2 text-muted">Why not start the first one?</p>
            </div>
          )}
          {result.status === "ok" && result.data.length > 0 && (
            <ul className="divide-y divide-line overflow-hidden rounded-card bg-surface shadow-soft">
              {result.data.map((thread) => (
                <li
                  key={thread.id}
                  className="relative px-5 py-4 hover:bg-peach/40"
                >
                  <p className="text-sm font-extrabold tracking-wide text-primary-strong uppercase">
                    {getCategory(thread.category)?.label ?? "General chat"}
                  </p>
                  <h2 className="mt-1 text-lg sm:text-xl">
                    <Link
                      href={`/forum/${thread.id}`}
                      className="after:absolute after:inset-0"
                    >
                      {thread.title}
                    </Link>
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
                    <AuthorBadge author={thread.author} size={28} />
                    <span className="text-muted">
                      {thread.postCount === 1
                        ? "No replies yet"
                        : `${thread.postCount - 1} ${thread.postCount === 2 ? "reply" : "replies"}`}{" "}
                      · {timeAgo(thread.lastPostAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Guidelines />
      </div>
    </div>
  );
}
