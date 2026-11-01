import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getTopic, type TopicSlug } from "./site";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const WORDS_PER_MINUTE = 200;

export type Source = { label: string; url: string };
export type Heading = { id: string; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  topic: TopicSlug;
  sources: Source[];
  content: string;
  headings: Heading[];
  readingMinutes: number;
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  if (!getTopic(data.topic)) {
    throw new Error(`${fileName}: unknown topic "${data.topic}"`);
  }

  const headings = [...content.matchAll(/^## (.+)$/gm)].map(([, text]) => ({
    id: slugify(text),
    text,
  }));

  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    // YAML parses bare dates into Date objects
    date: new Date(data.date).toISOString().slice(0, 10),
    topic: data.topic,
    sources: data.sources ?? [],
    content,
    headings,
    readingMinutes: Math.max(
      1,
      Math.round(content.split(/\s+/).length / WORDS_PER_MINUTE),
    ),
  };
}

export function getAllPosts() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByTopic(topic: TopicSlug) {
  return getAllPosts().filter((post) => post.topic === topic);
}

export function getRelatedPosts(post: Post, count = 3) {
  const others = getAllPosts().filter((other) => other.slug !== post.slug);
  const sameTopic = others.filter((other) => other.topic === post.topic);
  const rest = others.filter((other) => other.topic !== post.topic);
  return [...sameTopic, ...rest].slice(0, count);
}

/** Markdown without its link addresses and formatting marks. */
export function searchableText(markdown: string) {
  return markdown
    .replace(/\]\([^)]*\)/g, " ")
    .replace(/[#>*_|`[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(date));
}
