import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListing } from "@/components/BlogListing";
import { getPostsByTopic } from "@/lib/posts";
import { getTopic, site, topics } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

// Only published paths exist, so anything else is a real 404
export const dynamicParams = false;

type TopicPageProps = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return topics.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const topic = getTopic((await params).topic);
  if (!topic) return {};
  return pageMetadata({
    title: `${topic.label} articles`,
    description: `${topic.description} Plain-spoken, sourced articles on periods and menstrual health from ${site.name}.`,
    path: `/blog/topic/${topic.slug}`,
  });
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topic = getTopic((await params).topic);
  if (!topic) notFound();

  return <BlogListing posts={getPostsByTopic(topic.slug)} activeTopic={topic} />;
}
