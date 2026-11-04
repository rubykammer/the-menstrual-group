import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { PartnerScripts } from "@/components/PartnerScripts";
import { PostCard } from "@/components/PostCard";
import { QuizBanner } from "@/components/QuizCtas";
import { SupporterLinks } from "@/components/SupporterLinks";
import { friendScripts } from "@/lib/partnerScripts";
import { getPost } from "@/lib/posts";

export const metadata: Metadata = {
  title: "For Friends",
  description:
    "How to be a good friend or coworker to someone with a period: small, practical things that make a real difference.",
};

const principles = [
  {
    title: "Be the one with a spare",
    body: "A pad or tampon in your bag costs nothing and can save someone's whole day.",
  },
  {
    title: "Keep it low-key",
    body: "Help quietly. No announcements, no jokes, no telling the group chat.",
  },
  {
    title: "Take pain seriously",
    body: "Period pain can be severe. A friend who cancels isn't being dramatic.",
  },
  {
    title: "Skip the period jokes",
    body: "“Is it that time of the month?” shuts people down. Respond to what they actually said.",
  },
];

const readingList = [
  "what-to-say-and-what-not-to",
  "cramps-what-actually-helps",
  "endometriosis-guide",
  "pms-or-pmdd",
];

export default function FriendsPage() {
  const posts = readingList.map(getPost).filter((post) => post !== undefined);

  return (
    <>
      <header className="page-width pt-12 sm:pt-16">
        <h1 className="max-w-3xl text-4xl sm:text-6xl">
          Good friends <span className="text-primary">carry a spare</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg sm:text-xl">
          For friends, roommates, teammates and coworkers. You don&apos;t need to
          know everything about cycles to make someone&apos;s bad day a little
          easier.
        </p>
      </header>

      <QuizBanner slug="friends" />

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

      <section className="page-width mt-20">
        <div className="rounded-card bg-honey px-6 py-16 text-center sm:py-20">
          <p className="mx-auto max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            &ldquo;Do you need anything?&rdquo; is almost always the right
            question.
          </p>
        </div>
      </section>

      <section aria-labelledby="scripts-heading" className="page-width mt-20">
        <h2 id="scripts-heading" className="text-3xl sm:text-4xl">
          Say this, not that
        </h2>
        <p className="mt-3 max-w-2xl text-lg">
          A few moments that come up between friends, and how to handle them
          well.
        </p>
        <PartnerScripts scripts={friendScripts} />
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

      <SupporterLinks current="/friends" />
    </>
  );
}
