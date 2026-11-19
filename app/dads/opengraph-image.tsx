import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "A guide for dads talking to kids about periods";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    title: "Ready for the period talk, Dad?",
    label: "For dads",
    art: ogArt.figure("dads"),
  });
}
