import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { products } from "@/lib/products";
import { site, topics } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/blog",
    "/your-cycle",
    "/partners",
    "/dads",
    "/friends",
    "/quiz",
    "/quiz/partners",
    "/quiz/dads",
    "/quiz/friends",
    "/about",
  ];
  const topicPages = topics.map((topic) => `/blog/topic/${topic.slug}`);
  const productPages = [
    "/products",
    ...products.map((p) => `/products/${p.slug}`),
  ];

  return [
    ...[...pages, ...topicPages, ...productPages].map((path) => ({
      url: `${site.url}${path}`,
    })),
    ...getAllPosts().map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
