import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "A guide for partners of people with periods";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    title: "You don’t need a cycle to be good at this",
    label: "For partners",
    art: ogArt.figure("partners"),
  });
}
