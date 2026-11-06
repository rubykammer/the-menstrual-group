"use client";

/**
 * A script that runs while the HTML is parsed, before first paint. The client
 * render marks it text/plain, which keeps React from warning about rendering
 * a script; suppressHydrationWarning accepts the server's type.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
