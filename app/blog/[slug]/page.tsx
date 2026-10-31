import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { PostArt } from "@/components/PostArt";
import { PostCard } from "@/components/PostCard";
import { formatDate, getAllPosts, getPost, getRelatedPosts } from "@/lib/posts";
import { getTopic } from "@/lib/site";

// Only published paths exist, so anything else is a real 404
export const dynamicParams = false;

type ArticlePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const topic = getTopic(post.topic);

  return (
    <>
      <article className="page-width pt-8 sm:pt-12">
        <nav aria-label="Breadcrumb" className="text-sm font-bold text-muted">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/blog"
                className="transition-colors duration-200 hover:text-primary-strong"
              >
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/blog/topic/${post.topic}`}
                className="transition-colors duration-200 hover:text-primary-strong"
              >
                {topic?.label}
              </Link>
            </li>
          </ol>
        </nav>

        <header className="mt-5 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg text-muted sm:text-xl">{post.excerpt}</p>
          <p className="mt-4 text-sm font-semibold text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true"> · </span>
            {post.readingMinutes} min read
          </p>
        </header>

        <div className="mt-8 h-48 overflow-hidden rounded-card sm:h-64 lg:h-80">
          <PostArt slug={post.slug} topic={post.topic} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          <nav
            aria-labelledby="toc-heading"
            className="self-start rounded-2xl bg-honey p-5 lg:sticky lg:top-24 lg:order-last"
          >
            <h2 id="toc-heading" className="font-sans text-base font-extrabold">
              In this article
            </h2>
            <ul className="mt-2 space-y-2 text-[0.95rem]">
              {post.headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className="transition-colors duration-200 hover:text-primary-strong hover:underline"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 max-w-[42rem]">
            <ArticleBody content={post.content} />

            <footer className="mt-12 border-t border-line pt-6">
              <h2 className="font-sans text-base font-extrabold">Sources</h2>
              <ul className="mt-2 space-y-1">
                {post.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      rel="noopener noreferrer"
                      className="text-primary-strong underline underline-offset-2 transition-colors duration-200 hover:text-accent-strong"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">
                This article is for general education and isn&apos;t medical
                advice. Please talk to a healthcare professional about your own
                health.
              </p>
            </footer>
          </div>
        </div>
      </article>

      <section aria-labelledby="related-heading" className="page-width mt-20">
        <h2 id="related-heading" className="text-3xl">
          Keep reading
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {getRelatedPosts(post).map((related) => (
            <PostCard key={related.slug} post={related} />
          ))}
        </div>
      </section>
    </>
  );
}
