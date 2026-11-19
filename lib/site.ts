/**
 * The live address, for canonical links, share images and the sitemap. Set
 * NEXT_PUBLIC_SITE_URL to the real domain; on Vercel it falls back to the
 * project's production domain, so shared links never point at localhost.
 */
function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const site = {
  name: "The Menstrual Group",
  tagline: "Understanding cycles, together.",
  description:
    "Friendly, honest guidance on menstrual cycles: how they work, how to navigate them, and how to be a great partner to someone who has one.",
  url: siteUrl(),
};

export const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/products", label: "Products" },
  { href: "/your-cycle", label: "Your Cycle" },
  { href: "/partners", label: "Partners" },
  { href: "/dads", label: "Dads" },
  { href: "/friends", label: "Friends" },
  { href: "/quiz", label: "Quizzes" },
  { href: "/forum", label: "Forum" },
  { href: "/about", label: "About" },
];

export const topics = [
  {
    slug: "cycle-basics",
    label: "Cycle Basics",
    description: "How the menstrual cycle works, in plain language.",
  },
  {
    slug: "health",
    label: "Health",
    description: "What's normal, what isn't, and when to see a doctor.",
  },
  {
    slug: "everyday-life",
    label: "Everyday Life",
    description: "Comfort, products and conversations at home.",
  },
  {
    slug: "for-partners",
    label: "For Partners",
    description: "Practical ways to show up for someone with a cycle.",
  },
] as const;

export type Topic = (typeof topics)[number];
export type TopicSlug = Topic["slug"];

export function getTopic(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

/** The pages for people supporting someone with a cycle. */
export const supporterPages = [
  { href: "/partners", label: "For partners", tint: "bg-peach" },
  { href: "/dads", label: "For dads", tint: "bg-honey" },
  { href: "/friends", label: "For friends", tint: "bg-blush" },
];
