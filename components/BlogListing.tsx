import Link from "next/link";
import type { Post } from "@/lib/posts";
import { topics, type Topic } from "@/lib/site";
import { PostCard } from "./PostCard";

const pillClass =
  "inline-block rounded-full border-2 border-line bg-surface px-4 py-2 font-bold transition-colors duration-200 hover:border-primary aria-[current=page]:border-foreground aria-[current=page]:bg-foreground aria-[current=page]:text-background";

export function BlogListing({
  posts,
  activeTopic,
}: {
  posts: Post[];
  activeTopic?: Topic;
}) {
  return (
    <div className="page-width pt-12 sm:pt-16">
      <header className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl">
          {activeTopic ? activeTopic.label : "The blog"}
        </h1>
        <p className="mt-4 text-lg text-muted">
          {activeTopic
            ? activeTopic.description
            : "Plain-spoken articles on cycles, health and everyday life, for people with periods and the people who love them."}
        </p>
      </header>

      <nav aria-label="Filter by topic" className="mt-8">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/blog"
              aria-current={activeTopic ? undefined : "page"}
              className={pillClass}
            >
              All articles
            </Link>
          </li>
          {topics.map((topic) => (
            <li key={topic.slug}>
              <Link
                href={`/blog/topic/${topic.slug}`}
                aria-current={
                  activeTopic?.slug === topic.slug ? "page" : undefined
                }
                className={pillClass}
              >
                {topic.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-label="Articles" className="mt-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} headingLevel="h2" />
          ))}
        </div>
      </section>
    </div>
  );
}
