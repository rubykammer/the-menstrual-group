import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";
import { getTopic } from "@/lib/site";
import { PostArt } from "./PostArt";

export function PostCard({
  post,
  headingLevel: Heading = "h3",
}: {
  post: Post;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <article className="group relative flex flex-col">
      <div className="aspect-[5/3] shrink-0 overflow-hidden rounded-card">
        <PostArt
          slug={post.slug}
          topic={post.topic}
          className="transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-sm font-extrabold text-primary-strong">
          {getTopic(post.topic)?.label}
        </p>
        <Heading className="mt-1 text-2xl">
          <Link
            href={`/blog/${post.slug}`}
            className="underline-offset-4 group-hover:underline after:absolute after:inset-0"
          >
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 text-muted">{post.excerpt}</p>
        <p className="mt-auto pt-3 text-sm text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {post.readingMinutes} min read
        </p>
      </div>
    </article>
  );
}
