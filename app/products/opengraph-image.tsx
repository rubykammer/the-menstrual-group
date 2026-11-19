import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Period products compared: pads, tampons, cups and more";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    title: "Find the period product that suits you",
    label: "Period products compared",
    art: ogArt.product("menstrual-cup"),
  });
}
