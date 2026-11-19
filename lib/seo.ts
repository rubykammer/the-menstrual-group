import type { Metadata } from "next";
import { site } from "./site";

/**
 * Metadata for a public page: title, description, canonical link, and the
 * Open Graph and X (Twitter) cards. The share image comes from the nearest
 * opengraph-image.tsx file, which Next.js adds on its own.
 *
 * Next.js replaces, rather than merges, a parent's openGraph and twitter
 * objects, so every page sets the full set here.
 */
export function pageMetadata({
  title,
  description,
  path,
  shareTitle,
  type = "website",
  publishedTime,
  section,
}: {
  /** Shown in the browser tab and search results, before " | The Menstrual Group". */
  title: string;
  /** For search results and share cards. Aim for 110 to 160 characters. */
  description: string;
  /** The page's own path, such as "/blog". */
  path: string;
  /** A longer or friendlier title for share cards, if different. */
  shareTitle?: string;
  type?: "website" | "article";
  publishedTime?: string;
  section?: string;
}): Metadata {
  const cardTitle = shareTitle ?? title;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: cardTitle,
      description,
      url: path,
      siteName: site.name,
      locale: "en_US",
      type,
      ...(type === "article"
        ? { publishedTime, section, authors: [site.name] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: cardTitle,
      description,
    },
  };
}

/** Absolute URL for a path on the live site. */
export function absoluteUrl(path: string) {
  return new URL(path, site.url).href;
}

/** Who publishes the site, for structured data. */
export function organization() {
  return {
    "@type": "Organization",
    name: site.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/apple-icon"),
  };
}

/** A schema.org breadcrumb trail, from the home page down. */
export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map(
      (crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      }),
    ),
  };
}
