import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactElement, ReactNode } from "react";
import { ImageResponse } from "next/og";
import { DadFigure, FriendFigure, PartnerFigure } from "@/components/People";
import { productScene } from "@/components/illustrations/products";
import { doorScenes, postScene } from "@/components/illustrations/scenes";
import { backdrops } from "@/components/illustrations/kit";
import { site } from "./site";
import { svgMarkup } from "./svg-markup";

/**
 * Branded share images (1200 x 630) for links posted to social media and
 * messaging apps. Each opengraph-image.tsx file picks a title, a label and
 * one of the site's drawings; this draws the card.
 */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const colors = {
  background: "#fffbeb",
  ink: "#292524",
  muted: "#57534e",
  primary: "#b83c0a",
  ring: { orange: "#fb923c", pink: "#ec4899", amber: "#d97706" },
};

let fonts: Promise<{ name: string; data: Buffer; weight: 600 | 700 | 800 }[]>;
function loadFonts() {
  const file = (name: string) =>
    readFile(join(process.cwd(), "assets", "fonts", name));
  fonts ??= Promise.all([
    file("Fraunces-600.ttf").then((data) => ({
      name: "Fraunces",
      data,
      weight: 600 as const,
    })),
    file("Nunito-700.ttf").then((data) => ({
      name: "Nunito",
      data,
      weight: 700 as const,
    })),
    file("Nunito-800.ttf").then((data) => ({
      name: "Nunito",
      data,
      weight: 800 as const,
    })),
  ]);
  return fonts;
}

/** A drawing for the right-hand panel, and the colour behind it. */
export type OgArt = {
  svg: ReactElement;
  background: string;
  /** Scenes with people run off the bottom edge, so sit them on it. */
  align?: "center" | "bottom";
};

function scene(
  art: ReactNode,
  background: string,
  align: OgArt["align"] = "bottom",
): OgArt {
  return {
    background,
    align,
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
        {art}
      </svg>
    ),
  };
}

export const ogArt = {
  post(slug: string) {
    const { art, bg } = postScene(slug);
    return scene(art, bg);
  },
  product(slug: string) {
    const { art, bg } = productScene(slug);
    return scene(art, bg, "center");
  },
  self: () => scene(doorScenes.self, backdrops.honey),
  supporter: () => scene(doorScenes.supporter, backdrops.peach),
  figure(who: "partners" | "dads" | "friends") {
    const Figure = {
      partners: PartnerFigure,
      dads: DadFigure,
      friends: FriendFigure,
    }[who];
    const background = {
      partners: backdrops.peach,
      dads: backdrops.honey,
      friends: backdrops.blush,
    }[who];
    return { background, svg: <Figure />, align: "bottom" as const };
  },
};

/**
 * The image renderer only takes plain SVG, so draw it as a standalone image.
 * Scenes keep their important parts between x 60 and 340 of 400, so they are
 * drawn larger than the panel and cropped at the edges.
 */
function svgDataUri(svg: ReactElement) {
  let markup = svgMarkup(svg);
  if (!markup.includes("xmlns=")) {
    markup = markup.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return `data:image/svg+xml;base64,${Buffer.from(markup).toString("base64")}`;
}

function titleSize(title: string) {
  if (title.length <= 32) return 76;
  if (title.length <= 56) return 64;
  if (title.length <= 80) return 54;
  return 46;
}

/** The card: brand at the top, label and title, address, and a drawing. */
export async function ogImage({
  title,
  label,
  art,
}: {
  title: string;
  /** A short line above the title, such as "Article · Health". */
  label?: string;
  art: OgArt;
}) {
  const host = new URL(site.url).host;
  const figure = art.svg.type !== "svg";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: colors.background,
        padding: 56,
        gap: 48,
        fontFamily: "Nunito",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="48" height="48" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="11"
              fill="none"
              stroke={colors.ring.orange}
              strokeWidth="6"
            />
            <path
              d="M16 5a11 11 0 0 1 11 11"
              fill="none"
              stroke={colors.ring.pink}
              strokeWidth="6"
            />
            <path
              d="M27 16a11 11 0 0 1-11 11"
              fill="none"
              stroke={colors.ring.amber}
              strokeWidth="6"
            />
          </svg>
          <span
            style={{ fontFamily: "Fraunces", fontSize: 32, color: colors.ink }}
          >
            {site.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {label && (
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: colors.primary,
              }}
            >
              {label}
            </span>
          )}
          <span
            style={{
              fontFamily: "Fraunces",
              fontSize: titleSize(title),
              lineHeight: 1.08,
              color: colors.ink,
              letterSpacing: -1,
            }}
          >
            {title}
          </span>
        </div>

        <span style={{ fontSize: 24, fontWeight: 700, color: colors.muted }}>
          {host}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: art.align === "center" ? "center" : "flex-end",
          justifyContent: "center",
          width: 440,
          borderRadius: 40,
          background: art.background,
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={svgDataUri(art.svg)}
          width={figure ? 280 : 560}
          height={figure ? 542 : 336}
          style={figure ? { marginBottom: -40 } : {}}
        />
      </div>
    </div>,
    { ...ogSize, fonts: await loadFonts() },
  );
}
