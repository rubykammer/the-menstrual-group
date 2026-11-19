import type { Metadata } from "next";
import Link from "next/link";
import { SiteSearch } from "@/components/SiteSearch";
import { getSitePages } from "@/lib/pages";
import { getAllPosts, searchableText } from "@/lib/posts";
import type { SearchEntry } from "@/lib/search";
import { pageMetadata } from "@/lib/seo";
import { getTopic } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Search",
    description:
      "Search every article, product guide and quiz on The Menstrual Group, from cramps and PMDD to supporting a partner.",
    path: "/search",
  }),
  // Results pages shouldn't be indexed, but their links should be followed.
  robots: { index: false, follow: true },
};

function ResultRow({
  href,
  kind,
  title,
  description,
}: {
  href: string;
  kind: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block px-5 py-4 transition-colors duration-200 hover:bg-peach/40 sm:px-6"
    >
      <span className="text-sm font-extrabold tracking-wide text-primary-strong uppercase">
        {kind}
      </span>
      <span className="mt-1 block font-display text-xl group-hover:text-primary-strong sm:text-2xl">
        {title}
      </span>
      <span className="mt-1 block text-muted">{description}</span>
    </Link>
  );
}

export default function SearchPage() {
  // Guides and quizzes come first when a word matches equally well
  const entries: SearchEntry[] = [
    ...getSitePages().map((page) => ({
      slug: page.href,
      title: page.title,
      summary: page.description,
      body: page.body,
      card: <ResultRow {...page} />,
    })),
    ...getAllPosts().map((post) => ({
      slug: `/blog/${post.slug}`,
      title: post.title,
      summary: `${post.excerpt} ${post.headings.map(({ text }) => text).join(" ")}`,
      body: searchableText(post.content),
      card: (
        <ResultRow
          href={`/blog/${post.slug}`}
          kind={`Article · ${getTopic(post.topic)?.label}`}
          title={post.title}
          description={post.excerpt}
        />
      ),
    })),
  ];

  return (
    <div className="page-width pt-12 sm:pt-16">
      <h1 className="text-4xl sm:text-5xl">Search</h1>
      <SiteSearch entries={entries} />
    </div>
  );
}
