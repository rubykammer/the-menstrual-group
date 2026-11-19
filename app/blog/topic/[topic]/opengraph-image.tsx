import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";
import { getPostsByTopic } from "@/lib/posts";
import { getTopic, topics } from "@/lib/site";

export const alt = "Articles on one topic from The Menstrual Group";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return topics.map((topic) => ({ topic: topic.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const topic = getTopic((await params).topic);
  const [first] = topic ? getPostsByTopic(topic.slug) : [];
  return ogImage({
    title: topic?.description ?? "Articles on periods and health",
    label: topic ? `${topic.label} articles` : undefined,
    art: first ? ogArt.post(first.slug) : ogArt.self(),
  });
}
