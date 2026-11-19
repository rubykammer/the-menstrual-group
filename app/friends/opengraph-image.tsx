import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "A guide to supporting a friend on their period";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    title: "How to be a great period friend",
    label: "For friends",
    art: ogArt.figure("friends"),
  });
}
