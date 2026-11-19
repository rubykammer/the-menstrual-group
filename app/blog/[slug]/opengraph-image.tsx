import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";
import { getAllPosts, getPost } from "@/lib/posts";
import { getTopic } from "@/lib/site";

export const alt = "An article from The Menstrual Group";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  return ogImage({
    title: post?.title ?? "The Menstrual Group",
    label: post ? `Article · ${getTopic(post.topic)?.label ?? ""}` : undefined,
    art: ogArt.post(slug),
  });
}
