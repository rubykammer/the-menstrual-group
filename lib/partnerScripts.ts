export type PartnerScript = {
  situation: string;
  sayThis: string;
  notThat: string;
  thenDo: string;
};

export const partnerScripts: PartnerScript[] = [
  {
    situation: "They're in pain and need to cancel plans",
    sayThis: "“Don't worry about tonight. What would help most right now?”",
    notThat: "“Again? We've been planning this for weeks.”",
    thenDo: "Sort out the cancellation yourself, so it's one less job for them.",
  },
  {
    situation: "They're upset with you",
    sayThis: "“I can tell this matters to you. Tell me more.”",
    notThat: "“Is it that time of the month?”",
    thenDo: "Listen to the end, and treat the problem as real, because it is.",
  },
  {
    situation: "Their period pain keeps getting in the way",
    sayThis: "“This sounds really hard. Want me to come with you to the doctor?”",
    notThat: "“My sister has cramps too, and she just gets on with it.”",
    thenDo: "Offer to book the appointment, and let them decide what happens next.",
  },
  {
    situation: "There's a stain on the sheets",
    sayThis: "“No worries, I've got it.”",
    notThat: "“Ugh, gross.”",
    thenDo: "Rinse it in cold water, wash it, and don't make it a big moment.",
  },
  {
    situation: "They've run out of supplies",
    sayThis: "“I'm heading out now. Which ones do you use?”",
    notThat: "“Can't you get those yourself? It's embarrassing.”",
    thenDo: "Take a photo of the box, so you can get the right ones next time.",
  },
  {
    situation: "They don't feel like being intimate",
    sayThis: "“No problem. Want to just hang out instead?”",
    notThat: "“You're no fun this week.”",
    thenDo: "Take the no as a no, then make the rest of the evening easy.",
  },
];
