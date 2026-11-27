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
    "Clear, practical guidance on menstrual cycles: how they work, how to handle them, and how to support someone who has one.",
  url: siteUrl(),
};

/** Every main page, in the order the footer lists them. */
export const navLinks = [
  { href: "/your-cycle", label: "Your Cycle" },
  { href: "/partners", label: "Partners" },
  { href: "/dads", label: "Dads" },
  { href: "/friends", label: "Friends" },
  { href: "/quiz", label: "Quizzes" },
  { href: "/blog", label: "Blog" },
  { href: "/products", label: "Products" },
  { href: "/forum", label: "Forum" },
  { href: "/about", label: "About" },
];

export type NavLink = { href: string; label: string };
export type NavGroup = { id: string; label: string; links: NavLink[] };
export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "links" in item;
}

/**
 * The header menu: five choices, built around who you are first (someone
 * with a cycle, or someone supporting them), then reading and community.
 */
export const mainNav: NavItem[] = [
  { href: "/your-cycle", label: "Your cycle" },
  {
    id: "supporting",
    label: "Supporting someone",
    links: [
      { href: "/partners", label: "For partners" },
      { href: "/dads", label: "For dads" },
      { href: "/friends", label: "For friends" },
      { href: "/quiz", label: "Quizzes" },
    ],
  },
  {
    id: "learn",
    label: "Learn",
    links: [
      { href: "/blog", label: "Articles" },
      { href: "/products", label: "Products" },
    ],
  },
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

/** Each topic borrows a cycle-phase colour, for its labels and badges. */
export const topicAccents: Record<
  TopicSlug,
  { dot: string; text: string; badge: string }
> = {
  "cycle-basics": {
    dot: "bg-phase-menstrual",
    text: "text-phase-menstrual-strong",
    badge: "bg-phase-menstrual-tint text-phase-menstrual-strong",
  },
  health: {
    dot: "bg-phase-follicular",
    text: "text-phase-follicular-strong",
    badge: "bg-phase-follicular-tint text-phase-follicular-strong",
  },
  "everyday-life": {
    dot: "bg-phase-ovulation",
    text: "text-phase-ovulation-strong",
    badge: "bg-phase-ovulation-tint text-phase-ovulation-strong",
  },
  "for-partners": {
    dot: "bg-phase-luteal",
    text: "text-phase-luteal-strong",
    badge: "bg-phase-luteal-tint text-phase-luteal-strong",
  },
};

export function getTopic(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

/** The pages for people supporting someone with a cycle. */
export const supporterPages = [
  { href: "/partners", label: "For partners", tint: "bg-peach" },
  { href: "/dads", label: "For dads", tint: "bg-honey" },
  { href: "/friends", label: "For friends", tint: "bg-mist" },
];
