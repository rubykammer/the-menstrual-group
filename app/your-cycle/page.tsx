import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { PostCard } from "@/components/PostCard";
import { phases } from "@/lib/cycle";
import { getPost } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Your Cycle",
  description:
    "For people who have periods: how to work with each phase of your cycle, and the signs it's time to see a doctor.",
};

const seeADoctor = [
  "Your period lasts longer than seven days",
  "You need to change a pad or tampon every one to two hours",
  "Pain stops you from going to school, work or doing everyday things",
  "Your periods stop for three months or more, and you're not pregnant",
  "You bleed between periods, after sex or after menopause",
  "Your cycles are often shorter than 21 days or longer than 35 days",
];

const readingList = [
  "menstrual-cycle-explained",
  "cramps-what-actually-helps",
  "guide-to-period-products",
  "pms-or-pmdd",
];

export default function YourCyclePage() {
  const posts = readingList.map(getPost).filter((post) => post !== undefined);

  return (
    <>
      <header className="page-width pt-12 sm:pt-16">
        <h1 className="max-w-3xl text-4xl sm:text-6xl">
          Your cycle, <span className="text-primary">on your terms</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg sm:text-xl">
          Understand what your body is doing, feel better on the harder days,
          and know when something deserves a closer look.
        </p>
      </header>

      <section
        aria-labelledby="month-heading"
        className="mt-14 bg-blush py-16 sm:py-20"
      >
        <div className="page-width">
          <h2 id="month-heading" className="text-3xl sm:text-4xl">
            Working with each phase
          </h2>
          <p className="mt-3 max-w-2xl text-lg">
            These are based on a textbook 28-day cycle. Yours might be shorter
            or longer, and that&apos;s usually fine.
          </p>
          <ul className="mt-8 divide-y divide-divider">
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
                  <span className="font-sans text-sm font-semibold text-muted">
                    {phase.days}
                  </span>
                </h3>
                <p>{phase.forYou}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="doctor-heading"
        className="page-width mt-20 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
      >
        <div>
          <h2 id="doctor-heading" className="text-3xl sm:text-4xl">
            When to see a doctor
          </h2>
          <p className="mt-3 text-lg">
            Painful or heavy periods are common, but that doesn&apos;t mean you
            have to put up with them. Book an appointment if any of these sound
            familiar.
          </p>
          <ButtonLink
            href="/blog/whats-normal-when-to-see-a-doctor"
            variant="secondary"
            className="mt-6"
          >
            Read what&apos;s normal
          </ButtonLink>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {seeADoctor.map((sign) => (
            <li key={sign} className="rounded-card bg-blush p-5 text-lg">
              {sign}
            </li>
          ))}
        </ul>
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
