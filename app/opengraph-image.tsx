import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

/** The default share image, for any page without its own. */
export default function Image() {
  return ogImage({
    title: "Periods are everyone’s business.",
    label: site.tagline,
    art: ogArt.supporter(),
  });
}
