import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListing } from "@/components/BlogListing";
import { getPostsByTopic } from "@/lib/posts";
import { getTopic, topics } from "@/lib/site";

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
  return { title: topic.label, description: topic.description };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topic = getTopic((await params).topic);
  if (!topic) notFound();

  return <BlogListing posts={getPostsByTopic(topic.slug)} activeTopic={topic} />;
}
