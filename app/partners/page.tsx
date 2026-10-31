import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { PostCard } from "@/components/PostCard";
import { phases } from "@/lib/cycle";
import { getPost } from "@/lib/posts";

export const metadata: Metadata = {
  title: "For Partners",
  description:
    "A practical guide for men and partners without a menstrual cycle: what to know, what to do and what to say.",
};

const principles = [
  {
    title: "Ask, don't assume",
    body: "Everyone's cycle is different. Find out what helps your partner, and what doesn't, on a calm day.",
  },
  {
    title: "Do, don't announce",
    body: "Refill the hot water bottle. Handle dinner. Buy the supplies. Quiet help counts the most.",
  },
  {
    title: "Believe them",
    body: "You can't feel their pain, so take their word for it. Severe pain deserves care, not comparison.",
  },
  {
    title: "Keep it out of arguments",
    body: "Never use a period to explain away a concern. Hormones can turn up the volume, but the feeling is still real.",
  },
];

const readingList = [
  "being-a-good-partner",
  "what-to-say-and-what-not-to",
  "pms-or-pmdd",
  "endometriosis-guide",
];

export default function PartnersPage() {
  const posts = readingList.map(getPost).filter((post) => post !== undefined);

  return (
    <>
      <header className="page-width pt-12 sm:pt-16">
        <h1 className="max-w-3xl text-4xl sm:text-6xl">
          You don&apos;t need to have a cycle to be{" "}
          <span className="text-primary">good at this</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg sm:text-xl">
          This guide is for men and for anyone else without a menstrual cycle
          who wants to be a better partner, parent or friend. It won&apos;t take
          long, and it&apos;ll be noticed.
        </p>
      </header>

      <section aria-labelledby="principles-heading" className="page-width mt-14">
        <h2 id="principles-heading" className="text-3xl sm:text-4xl">
          Four things to remember
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle, index) => (
            <li key={principle.title} className="rounded-card bg-surface p-6 shadow-soft">
              <span
                className="font-display text-4xl font-semibold text-primary"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <h3 className="mt-2 text-xl">{principle.title}</h3>
              <p className="mt-2 text-muted">{principle.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="month-heading"
        className="mt-20 bg-blush py-16 sm:py-20"
      >
        <div className="page-width">
          <h2 id="month-heading" className="text-3xl sm:text-4xl">
            How to help through the month
          </h2>
          <p className="mt-3 max-w-2xl text-lg">
            Every cycle is different, so use this as a starting point, not a
            schedule. And please don&apos;t use it to predict anyone&apos;s mood.
          </p>
          <ul className="mt-8 divide-y divide-pink-200">
            {phases.map((phase) => (
              <li
                key={phase.id}
                className="grid gap-1 py-5 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8"
              >
                <h3 className="flex items-center gap-3 text-xl">
                  <span
                    className="size-4 shrink-0 rounded-full"
                    style={{ backgroundColor: phase.color }}
                    aria-hidden="true"
                  />
                  {phase.name}
                </h3>
                <p>{phase.forPartners}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="reading-heading" className="page-width mt-20">
        <h2 id="reading-heading" className="text-3xl sm:text-4xl">
          Good places to start
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="/blog" variant="secondary">
            Browse every article
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
