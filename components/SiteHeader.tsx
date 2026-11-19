"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/site";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

// Everyone sees the Admin link; the page itself asks who you are. With nine
// main links, the full row only fits from the xl breakpoint, and even then
// Admin is an icon beside the theme toggle. Narrower screens use the menu.
const adminLink = { href: "/admin", label: "Admin" };
const mobileLinks = [...navLinks, adminLink];

export function SiteHeader() {
  const pathname = usePathname();
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
          className="shrink-0 transition-opacity duration-200 hover:opacity-80 xl:w-[11.5rem]"
          onClick={() => setMenuOpen(false)}
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  className="rounded-full px-2.5 py-2 font-bold whitespace-nowrap transition-colors duration-200 hover:bg-peach hover:text-primary-strong aria-[current=page]:bg-peach aria-[current=page]:text-primary-strong"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            title="Search"
            aria-current={isCurrent("/search") ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
            className="flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-peach hover:text-primary-strong aria-[current=page]:bg-peach aria-[current=page]:text-primary-strong"
          >
            <span className="sr-only">Search</span>
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5L21 21" />
            </svg>
          </Link>
          <Link
            href={adminLink.href}
            title="Admin"
            aria-current={isCurrent(adminLink.href) ? "page" : undefined}
            className="hidden size-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-peach hover:text-primary-strong aria-[current=page]:bg-peach aria-[current=page]:text-primary-strong xl:flex"
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
          <Link
            href="/account"
            title="Account"
            aria-current={
              isCurrent("/account") || isCurrent("/login") ? "page" : undefined
            }
            onClick={() => setMenuOpen(false)}
            className="flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-peach hover:text-primary-strong aria-[current=page]:bg-peach aria-[current=page]:text-primary-strong"
          >
            <span className="sr-only">Account</span>
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
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
          </Link>
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-peach xl:hidden"
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
        className="border-t border-line xl:hidden"
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
