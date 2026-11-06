"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme";

const darkQuery = "(prefers-color-scheme: dark)";

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function isDarkNow() {
  const chosen = document.documentElement.getAttribute("data-theme");
  if (chosen) return chosen === "dark";
  return window.matchMedia(darkQuery).matches;
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(darkQuery);
  media.addEventListener("change", onChange);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

export function ThemeToggle() {
  // null on the server and during hydration, so the markup always matches
  const isDark = useSyncExternalStore(subscribe, isDarkNow, () => null);

  // In development, Strict Mode's remount strips the attribute the head
  // script set on <html>. Put it back before paint. No-op in production.
  useLayoutEffect(() => {
    const stored = readStored();
    if (stored) document.documentElement.setAttribute("data-theme", stored);
  }, []);

  function toggle() {
    const next = isDarkNow() ? "light" : "dark";
    const systemIsDark = window.matchMedia(darkQuery).matches;
    const root = document.documentElement;
    try {
      // Picking what the OS already wants means "follow the OS" again
      if ((next === "dark") === systemIsDark) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      // Storage blocked: the choice still applies for this page view
    }
    if ((next === "dark") === systemIsDark) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", next);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark ?? undefined}
      className="flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-peach"
    >
      <span className="sr-only">Dark mode</span>
      {/* Moon in light mode, sun in dark mode. CSS picks, so no flash. */}
      <svg
        viewBox="0 0 24 24"
        className="size-6 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="hidden size-6 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
    </button>
  );
}
