import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import { InlineScript } from "@/components/InlineScript";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import "./globals.css";

// No extra axes: nothing sets the SOFT axis, and loading it made the font
// file every page preloads much larger.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "periods",
    "menstrual cycle",
    "period products",
    "PMS",
    "PMDD",
    "period pain",
    "supporting a partner",
    "talking to kids about periods",
  ],
  category: "health",
  // Stops phones turning numbers in articles into phone links.
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/** Matches the page background, so mobile browser bars blend in. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffbeb" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1714" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}
      // The theme script in <head> sets data-theme before React hydrates
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={themeScript} />
        {/* Not in the Open Graph standard, and Next.js's metadata has no
            option for it, but some link checkers (such as Orca Scan's)
            expect it. */}
        <meta property="og:logo" content={absoluteUrl("/apple-icon")} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-5 focus:py-2.5 focus:font-bold focus:text-background"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <CookieConsent />
        <SiteAnalytics />
      </body>
    </html>
  );
}
