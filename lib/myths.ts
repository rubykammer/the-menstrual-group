import type { Source } from "./posts";

export type Myth = {
  myth: string;
  fact: string;
  source: Source;
};

const nhsPeriods = {
  label: "Periods, NHS",
  url: "https://www.nhs.uk/conditions/periods/",
};

export const myths: Myth[] = [
  {
    myth: "You can't get pregnant on your period.",
    fact: "It's less likely, but it can happen. Sperm can survive for several days, so sex during a period can overlap with an early ovulation.",
    source: nhsPeriods,
  },
  {
    myth: "Every cycle is exactly 28 days.",
    fact: "Twenty-eight is only an average. Periods commonly arrive anywhere from every 21 to every 35 days.",
    source: nhsPeriods,
  },
  {
    myth: "A period means losing a huge amount of blood.",
    fact: "It can look like a lot, but it usually adds up to about 1 to 5 tablespoons. Some people do bleed more heavily, and that's worth raising with a doctor.",
    source: nhsPeriods,
  },
  {
    myth: "Bad period pain is just something you put up with.",
    fact: "Pain that stops you from doing your usual things deserves a doctor's visit. It can be a sign of a treatable condition.",
    source: {
      label: "Period pain, NHS",
      url: "https://www.nhs.uk/conditions/period-pain/",
    },
  },
  {
    myth: "PMS is all in your head.",
    fact: "More than 90% of women report some premenstrual symptoms. For less than 5%, they're severe enough to be a condition called PMDD.",
    source: {
      label: "Premenstrual syndrome, Office on Women's Health",
      url: "https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome",
    },
  },
  {
    myth: "Exercise makes cramps worse.",
    fact: "Regular aerobic exercise, such as walking or swimming, can actually ease period pain. Rest is fine too, on the days you need it.",
    source: {
      label: "Painful periods, ACOG",
      url: "https://www.acog.org/womens-health/faqs/dysmenorrhea-painful-periods",
    },
  },
];
