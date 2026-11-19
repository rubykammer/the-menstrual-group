import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Quizzes for partners, dads and friends";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    title: "How well do you know periods?",
    label: "Quizzes for partners, dads and friends",
    art: ogArt.figure("partners"),
  });
}
