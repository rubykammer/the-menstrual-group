import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Your cycle, phase by phase";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    title: "Your cycle, phase by phase",
    label: "For people with periods",
    art: ogArt.self(),
  });
}
