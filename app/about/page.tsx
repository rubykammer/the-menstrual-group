import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why The Menstrual Group exists, who it's for, and how articles are written.",
};

export default function AboutPage() {
  return (
    <div className="page-width pt-12 sm:pt-16">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl">
          A friendlier way to talk about periods
        </h1>
        <p className="mt-5 text-lg sm:text-xl">
          About half the world menstruates for decades of their life, and the
          other half often learns next to nothing about it. The Menstrual Group
          exists to close that gap.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">Who this is for</h2>
          <p className="mt-3 text-lg">
            Everyone. Women who want to understand their own bodies better, and
            men and partners who want to know how to help. Dads with daughters,
            and moms with sons. Anyone who has ever stood in the period aisle,
            feeling lost.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">How we write</h2>
          <p className="mt-3 text-lg">
            We keep things plain, warm and shame-free. Health information is
            based on published guidance from organizations such as the World
            Health Organization, the NHS, the American College of Obstetricians
            and Gynecologists, and the US Office on Women&apos;s Health. Each
            article lists its sources, so you can read further.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">What we aren&apos;t</h2>
          <p className="mt-3 text-lg">
            We aren&apos;t a clinic, and nothing here is medical advice. Bodies
            differ, and a healthcare professional who knows you is always the
            best source of guidance about your own health.
          </p>
        </section>

        <div className="mt-10">
          <ButtonLink href="/blog">Start reading</ButtonLink>
        </div>
      </div>
    </div>
  );
}
