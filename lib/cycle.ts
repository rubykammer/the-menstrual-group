export type Phase = {
  id: string;
  name: string;
  days: string;
  firstDay: number;
  lastDay: number;
  color: string;
  summary: string;
  forYou: string;
  forPartners: string;
};

/** A textbook 28-day cycle. Real cycles vary, and the UI says so. */
export const phases: Phase[] = [
  {
    id: "menstruation",
    name: "Menstruation",
    days: "Days 1–5",
    firstDay: 1,
    lastDay: 5,
    color: "#ec4899",
    summary:
      "The lining of the uterus sheds and leaves the body as a period. Hormones are at their lowest, and cramps and tiredness are common.",
    forYou:
      "Reach for heat, rest and pain relief early, before the cramps build. Lower the bar for the day if you can.",
    forPartners:
      "Bring the hot water bottle, take a chore off the list, and ask what would help instead of guessing.",
  },
  {
    id: "follicular",
    name: "Follicular",
    days: "Days 6–13",
    firstDay: 6,
    lastDay: 13,
    color: "#d97706",
    summary:
      "Estrogen climbs, the lining rebuilds, and an egg matures in the ovary. Many people notice their energy and mood lifting.",
    forYou:
      "If you feel good, this can be a nice window for the tasks and plans you were putting off.",
    forPartners:
      "Enjoy it, and plan things together. Just don't treat this as the “real” version of your partner.",
  },
  {
    id: "ovulation",
    name: "Ovulation",
    days: "Around day 14",
    firstDay: 14,
    lastDay: 15,
    color: "#ea580c",
    summary:
      "An ovary releases an egg, usually 12 to 16 days before the next period. Some people feel a one-sided twinge or notice more discharge.",
    forYou:
      "This is the most fertile point in the cycle. If you're tracking, note it. If you're avoiding pregnancy, keep using contraception.",
    forPartners:
      "Pregnancy planning and prevention are a shared job. Know the plan, and carry your half of it.",
  },
  {
    id: "luteal",
    name: "Luteal",
    days: "Days 16–28",
    firstDay: 16,
    lastDay: 28,
    color: "#fb923c",
    summary:
      "Progesterone rises to prepare for a possible pregnancy. If there isn't one, hormones drop, and PMS can show up in the last week or two.",
    forYou:
      "Protect your sleep, eat regularly, and be kind to yourself. Track your symptoms if they feel big.",
    forPartners:
      "Take feelings at face value. Never blame them on hormones. A real concern is still real in week four.",
  },
];

export function phaseForDay(day: number) {
  return phases.find((p) => day >= p.firstDay && day <= p.lastDay) ?? phases[0];
}
