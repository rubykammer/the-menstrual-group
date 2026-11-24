"use client";

import { Fraunces, Nunito } from "next/font/google";
import { ErrorMessage } from "@/components/ErrorMessage";
import { InlineScript } from "@/components/InlineScript";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

/**
 * Shown when the root layout itself fails. It replaces the whole document,
 * so it brings its own <html>, styles, fonts and saved theme.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={themeScript} />
        <title>Something went wrong | The Menstrual Group</title>
      </head>
      <body className="flex min-h-full flex-col justify-center">
        <main id="main">
          <ErrorMessage error={error} retry={retry} />
        </main>
      </body>
    </html>
  );
}
