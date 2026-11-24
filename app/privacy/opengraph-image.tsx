import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Privacy policy for The Menstrual Group";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    title: "What we collect, and why",
    label: "Privacy policy",
    art: ogArt.supporter(),
  });
}
