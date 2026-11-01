import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { CycleRing } from "@/components/CycleRing";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why The Menstrual Group exists, who it's for, and how articles are written.",
};

const sections = [
  {
    title: "Who this is for",
    body: "Everyone. Women who want to understand their own bodies better, and men and partners who want to know how to help. Dads with daughters, and moms with sons. Anyone who has ever stood in the period aisle, feeling lost.",
  },
  {
    title: "How we write",
    body: "We keep things plain, warm and shame-free. Health information is based on published guidance from organizations such as the World Health Organization, the NHS, the American College of Obstetricians and Gynecologists, and the US Office on Women's Health. Each article lists its sources, so you can read further.",
  },
  {
    title: "What we aren't",
    body: "We aren't a clinic, and nothing here is medical advice. Bodies differ, and a healthcare professional who knows you is always the best source of guidance about your own health.",
  },
];

export default function AboutPage() {
  return (
    <div className="page-width pt-12 sm:pt-16">
      <header className="grid items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <h1 className="text-5xl sm:text-7xl">
            A friendlier way to talk about periods
          </h1>
          <p className="mt-5 max-w-xl text-lg sm:text-xl">
            About half the world menstruates for decades of their life, and the
            other half often learns next to nothing about it. The Menstrual
            Group exists to close that gap.
          </p>
        </div>
        <CycleRing className="mx-auto hidden w-full max-w-xs lg:block" />
      </header>

      <div className="mt-14 lg:mt-20">
        {sections.map((section) => (
          <section
            key={section.title}
            className="grid gap-2 border-t border-line py-8 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-10"
          >
            <h2 className="text-2xl sm:text-3xl">{section.title}</h2>
            <p className="max-w-2xl text-lg">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-4">
        <ButtonLink href="/blog">Start reading</ButtonLink>
      </div>
    </div>
  );
}
