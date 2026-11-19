import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Articles on periods, cycles and health";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    title: "Plain-spoken articles on periods, cycles and health",
    label: "The blog",
    art: ogArt.self(),
  });
}
