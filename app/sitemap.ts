import type { MetadataRoute } from "next";
import { getAllPosts, getPostsByTopic } from "@/lib/posts";
import { products } from "@/lib/products";
import { quizzes } from "@/lib/quizzes";
import { absoluteUrl } from "@/lib/seo";
import { topics } from "@/lib/site";

/**
 * Every public page, for search engines. Private pages (account, forum,
 * admin, sign-in) are left out and blocked in robots.ts. Each entry lists the
 * page's share image too, from its opengraph-image.tsx.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const newest = posts[0]?.date;

  const entry = (
    path: string,
    options: {
      priority: number;
      changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
      lastModified?: string;
    },
  ): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    images: [absoluteUrl(`${path.replace(/\/$/, "")}/opengraph-image`)],
  });

  return [
    entry("/", {
      priority: 1,
      changeFrequency: "weekly",
      lastModified: newest,
    }),
    entry("/blog", {
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: newest,
    }),
    ...posts.map((post) =>
      entry(`/blog/${post.slug}`, {
        priority: 0.8,
        changeFrequency: "monthly",
        lastModified: post.date,
      }),
    ),
    ...topics.map((topic) =>
      entry(`/blog/topic/${topic.slug}`, {
        priority: 0.6,
        changeFrequency: "weekly",
        lastModified: getPostsByTopic(topic.slug)[0]?.date,
      }),
    ),
    entry("/products", { priority: 0.8, changeFrequency: "monthly" }),
    ...products.map((product) =>
      entry(`/products/${product.slug}`, {
        priority: 0.7,
        changeFrequency: "monthly",
      }),
    ),
    ...["/your-cycle", "/partners", "/dads", "/friends"].map((path) =>
      entry(path, { priority: 0.8, changeFrequency: "monthly" }),
    ),
    entry("/quiz", { priority: 0.6, changeFrequency: "monthly" }),
    ...quizzes.map((quiz) =>
      entry(`/quiz/${quiz.slug}`, {
        priority: 0.5,
        changeFrequency: "monthly",
      }),
    ),
    entry("/about", { priority: 0.4, changeFrequency: "yearly" }),
  ];
}
