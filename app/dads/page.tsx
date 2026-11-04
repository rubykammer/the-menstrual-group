import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { PartnerScripts } from "@/components/PartnerScripts";
import { PostCard } from "@/components/PostCard";
import { QuizBanner } from "@/components/QuizCtas";
import { SupporterLinks } from "@/components/SupporterLinks";
import { dadScripts } from "@/lib/partnerScripts";
import { getPost } from "@/lib/posts";

export const metadata: Metadata = {
  title: "For Dads",
  description:
    "A practical guide for dads: how to talk to your kids about periods, what to keep at home, and how to be the calm one.",
};

const principles = [
  {
    title: "Start early",
    body: "A first period can arrive as early as eight. Talk about it before it happens, not after.",
  },
  {
    title: "Use real words",
    body: "Say “period”, “uterus” and “vagina”. Plain words tell your kids there's nothing to be ashamed of.",
  },
  {
    title: "Don't hand it off",
    body: "If you only ever say “ask your mom”, they learn it's not something to bring to you.",
  },
  {
    title: "Talk to sons, too",
    body: "Boys who understand periods grow into kinder classmates, friends and partners.",
  },
];

const kit = [
  "A few pads in a small, plain pouch for their school bag",
  "A spare pair of underwear and a sealable bag",
  "Pads and, when they're ready, other products stocked at home",
  "A hot water bottle or heat pad",
  "Pain relief that's suitable for their age, and the go-ahead to ask for it",
];

const readingList = [
  "talking-to-kids-about-periods",
  "guide-to-period-products",
  "menstrual-cycle-explained",
  "whats-normal-when-to-see-a-doctor",
];

export default function DadsPage() {
  const posts = readingList.map(getPost).filter((post) => post !== undefined);

  return (
    <>
      <header className="page-width pt-12 sm:pt-16">
        <h1 className="max-w-3xl text-4xl sm:text-6xl">
          Dads, you can be the one they{" "}
          <span className="text-primary">come to</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg sm:text-xl">
          Whether you&apos;re raising a daughter, a son or both, a relaxed dad
          who knows the basics makes growing up a lot easier. Here&apos;s what
          to know, and what to keep in the cupboard.
        </p>
      </header>

      <QuizBanner slug="dads" />

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

      <section aria-labelledby="kit-heading" className="mt-20 bg-honey py-16 sm:py-20">
        <div className="page-width grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 id="kit-heading" className="text-3xl sm:text-4xl">
              A first-period kit
            </h2>
            <p className="mt-3 text-lg">
              Put it together before it&apos;s needed, then show them where it
              is. It says &ldquo;this is normal, and you&apos;re ready&rdquo;
              without a big speech.
            </p>
          </div>
          <ul className="divide-y divide-orange-200">
            {kit.map((item) => (
              <li key={item} className="flex items-start gap-3 py-4 text-lg">
                <svg
                  viewBox="0 0 24 24"
                  className="mt-1 size-5 shrink-0 text-primary-strong"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="scripts-heading" className="page-width mt-20">
        <h2 id="scripts-heading" className="text-3xl sm:text-4xl">
          Say this, not that
        </h2>
        <p className="mt-3 max-w-2xl text-lg">
          Your tone matters more than your words. Calm and matter-of-fact is
          exactly right.
        </p>
        <PartnerScripts scripts={dadScripts} />
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

      <SupporterLinks current="/dads" />
    </>
  );
}
