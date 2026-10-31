export const site = {
  name: "The Menstrual Group",
  tagline: "Understanding cycles, together.",
  description:
    "Friendly, honest guidance on menstrual cycles: how they work, how to navigate them, and how to be a great partner to someone who has one.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/partners", label: "For Partners" },
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
