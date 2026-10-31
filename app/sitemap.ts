import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site, topics } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/blog", "/partners", "/about"];
  const topicPages = topics.map((topic) => `/blog/topic/${topic.slug}`);

  return [
    ...[...pages, ...topicPages].map((path) => ({ url: `${site.url}${path}` })),
    ...getAllPosts().map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
