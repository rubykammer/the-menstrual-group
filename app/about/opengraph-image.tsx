import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "About The Menstrual Group";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    title: "Why The Menstrual Group exists",
    label: "About us",
    art: ogArt.supporter(),
  });
}
