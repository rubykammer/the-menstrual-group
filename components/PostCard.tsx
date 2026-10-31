import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";
import { getTopic } from "@/lib/site";
import { PostArt } from "./PostArt";

export function PostCard({
  post,
  featured = false,
  headingLevel: Heading = "h3",
}: {
  post: Post;
  featured?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-card bg-surface shadow-soft transition-all duration-300 focus-within:shadow-lg hover:shadow-lg motion-safe:hover:-translate-y-1 ${
        featured ? "md:col-span-2 md:flex-row lg:col-span-3" : ""
      }`}
    >
      <div
        className={`aspect-[5/3] shrink-0 overflow-hidden ${
          featured ? "md:aspect-auto md:w-1/2" : ""
        }`}
      >
        <PostArt
          slug={post.slug}
          topic={post.topic}
          className="transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
      </div>
      <div
        className={`flex flex-1 flex-col p-6 ${featured ? "md:justify-center md:p-10" : ""}`}
      >
        <p className="text-sm font-extrabold tracking-wide text-primary-strong uppercase">
          {getTopic(post.topic)?.label}
        </p>
        <Heading
          className={`mt-2 transition-colors duration-200 group-hover:text-primary-strong ${
            featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl"
          }`}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0"
          >
            {post.title}
          </Link>
        </Heading>
        <p className={`mt-3 text-muted ${featured ? "text-lg" : ""}`}>
          {post.excerpt}
        </p>
        <p className="mt-auto pt-4 text-sm font-semibold text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {post.readingMinutes} min read
        </p>
      </div>
    </article>
  );
}
