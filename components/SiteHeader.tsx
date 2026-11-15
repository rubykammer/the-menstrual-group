"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { hasAdminLinkCookie } from "@/lib/adminLink";
import { navLinks } from "@/lib/site";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

// Cookies have no change event. The header re-renders on every navigation,
// which re-reads the cookie, so signing in or out updates the link.
const noSubscription = () => () => {};

export function SiteHeader() {
  const pathname = usePathname();
  // Only someone signed in to /admin sees the link. On wide screens it's an
  // icon beside the theme toggle, because an eighth text link squeezes the logo.
  const showAdmin = useSyncExternalStore(
    noSubscription,
    hasAdminLinkCookie,
    () => false,
  );
  const mobileLinks = showAdmin
    ? [...navLinks, { href: "/admin", label: "Admin" }]
    : navLinks;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  function isCurrent(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur-sm">
      <div className="page-width flex h-[4.5rem] items-center justify-between gap-4">
        <Link
          href="/"
          className="transition-opacity duration-200 hover:opacity-80"
          onClick={() => setMenuOpen(false)}
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  className="rounded-full px-4 py-2 font-bold whitespace-nowrap transition-colors duration-200 hover:bg-peach hover:text-primary-strong aria-[current=page]:bg-peach aria-[current=page]:text-primary-strong"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          {showAdmin && (
            <Link
              href="/admin"
              title="Admin"
              aria-current={isCurrent("/admin") ? "page" : undefined}
              className="hidden size-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-peach hover:text-primary-strong aria-[current=page]:bg-peach aria-[current=page]:text-primary-strong lg:flex"
            >
              <span className="sr-only">Admin</span>
              <svg
                viewBox="0 0 24 24"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h8M16 18h4" />
                <circle cx="16" cy="6" r="2" />
                <circle cx="8" cy="12" r="2" />
                <circle cx="14" cy="18" r="2" />
              </svg>
            </Link>
          )}
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-peach lg:hidden"
          >
            <span className="sr-only">{menuOpen ? "Close" : "Open"} menu</span>
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-line lg:hidden"
      >
        <ul className="page-width flex flex-col gap-1 py-3">
          {mobileLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-lg font-bold transition-colors duration-200 hover:bg-peach aria-[current=page]:bg-peach aria-[current=page]:text-primary-strong"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
