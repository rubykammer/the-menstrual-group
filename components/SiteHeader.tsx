"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/site";
import { Avatar } from "./Avatar";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

/** Fired by the profile form after saving, so the header photo updates. */
export const PROFILE_UPDATED = "tmg:profile-updated";

type Me = {
  signedIn: boolean;
  name?: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
};

// Only admins see the Admin link (others go to /admin/login by URL). The pages
// for partners, dads and friends share one "For loved ones" menu, so the
// full row fits from the lg breakpoint. Narrower screens use the menu.
const adminLink = { href: "/admin", label: "Admin" };
const lovedOnesHrefs = new Set(["/partners", "/dads", "/friends"]);
const lovedOnesLinks = navLinks.filter((link) => lovedOnesHrefs.has(link.href));
// The group sits where the first of its links was in the list
const lovedOnesAt = navLinks.findIndex((link) => lovedOnesHrefs.has(link.href));
const mainBefore = navLinks.slice(0, lovedOnesAt);
const mainAfter = navLinks
  .slice(lovedOnesAt)
  .filter((link) => !lovedOnesHrefs.has(link.href));

const pill =
  "rounded-full px-2 py-2 font-bold xl:px-2.5 whitespace-nowrap transition-colors duration-200 hover:bg-peach hover:text-primary-strong aria-[current=page]:bg-peach aria-[current=page]:text-primary-strong";
// 40px on phones so the logo and three buttons fit a 360px screen
const iconButton =
  "flex size-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-peach hover:text-primary-strong aria-[current=page]:bg-peach aria-[current=page]:text-primary-strong sm:size-11";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lovedOpen, setLovedOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const lovedButton = useRef<HTMLButtonElement>(null);
  const lovedMenu = useRef<HTMLLIElement>(null);
  const [me, setMe] = useState<Me | null>(null);

  // Pages are the same for everyone, so ask who's signed in to show their
  // photo on the account button. Again after moving page (signing in or out
  // changes the page) and after the profile is saved.
  useEffect(() => {
    const controller = new AbortController();
    const load = () =>
      fetch("/api/me", { signal: controller.signal })
        .then((response) => response.json())
        .then((data: Me) => setMe(data))
        .catch(() => {});
    load();
    window.addEventListener(PROFILE_UPDATED, load);
    return () => {
      controller.abort();
      window.removeEventListener(PROFILE_UPDATED, load);
    };
  }, [pathname]);

  // Close both menus when the page changes
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setLovedOpen(false);
  }

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

  useEffect(() => {
    if (!lovedOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLovedOpen(false);
        lovedButton.current?.focus();
      }
    }
    function closeOnOutside(event: Event) {
      if (!lovedMenu.current?.contains(event.target as Node)) {
        setLovedOpen(false);
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("focusin", closeOnOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("focusin", closeOnOutside);
    };
  }, [lovedOpen]);

  function isCurrent(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  const inLovedOnes = lovedOnesLinks.some((link) => isCurrent(link.href));

  const mainLink = (link: { href: string; label: string }) => (
    <li key={link.href}>
      <Link
        href={link.href}
        aria-current={isCurrent(link.href) ? "page" : undefined}
        className={pill}
      >
        {link.label}
      </Link>
    </li>
  );

  const mobileLink = (link: { href: string; label: string }) => (
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
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur-sm">
      <div className="page-width flex h-[4.5rem] items-center justify-between gap-2 sm:gap-4">
        <Link
          href="/"
          className="shrink-0 transition-opacity duration-200 hover:opacity-80"
          onClick={() => setMenuOpen(false)}
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center xl:gap-1">
            {mainBefore.map(mainLink)}
            <li ref={lovedMenu} className="relative">
              <button
                ref={lovedButton}
                type="button"
                aria-expanded={lovedOpen}
                aria-controls="loved-ones-menu"
                data-current={inLovedOnes || undefined}
                onClick={() => setLovedOpen((open) => !open)}
                className={`${pill} flex cursor-pointer items-center gap-1 data-current:bg-peach data-current:text-primary-strong`}
              >
                For loved ones
                <svg
                  viewBox="0 0 24 24"
                  className={`size-4 transition-transform duration-200 ${lovedOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <ul
                id="loved-ones-menu"
                hidden={!lovedOpen}
                className="animate-toast-in absolute top-full left-0 mt-2 w-56 rounded-2xl border border-line bg-surface p-2 shadow-soft"
              >
                {lovedOnesLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isCurrent(link.href) ? "page" : undefined}
                      onClick={() => setLovedOpen(false)}
                      className="block rounded-xl px-3 py-2 font-bold transition-colors duration-200 hover:bg-peach hover:text-primary-strong aria-[current=page]:bg-peach aria-[current=page]:text-primary-strong"
                    >
                      For {link.label.toLowerCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {mainAfter.map(mainLink)}
          </ul>
        </nav>

        <div className="flex items-center sm:gap-1">
          <Link
            href="/search"
            title="Search"
            aria-current={isCurrent("/search") ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
            className={iconButton}
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
          {me?.isAdmin && (
            <Link
              href={adminLink.href}
              title="Admin"
              aria-current={isCurrent(adminLink.href) ? "page" : undefined}
              className={`${iconButton} hidden! xl:flex!`}
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
                {/* A shield, so it doesn't read as a filter control */}
                <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </Link>
          )}
          <Link
            href="/account"
            title="Account"
            aria-current={
              isCurrent("/account") || isCurrent("/login") ? "page" : undefined
            }
            onClick={() => setMenuOpen(false)}
            className={iconButton}
          >
            <span className="sr-only">
              {me?.signedIn ? "Your account" : "Account"}
            </span>
            {me === null ? (
              // Still asking who's signed in: a soft placeholder, so the
              // photo doesn't replace a person icon a moment later
              <span
                className="size-8 animate-pulse rounded-full bg-peach"
                aria-hidden="true"
              />
            ) : me.signedIn && (me.avatarUrl || me.name) ? (
              <Avatar
                src={me.avatarUrl ?? null}
                name={me.name ?? ""}
                size={32}
              />
            ) : (
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
            )}
          </Link>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <button
            ref={menuButton}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={`${iconButton} cursor-pointer lg:hidden`}
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
        className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line lg:hidden"
      >
        <ul className="page-width flex flex-col gap-1 py-3">
          {mainBefore.map(mobileLink)}
          <li>
            <p className="px-4 pt-3 pb-1 text-sm font-extrabold tracking-wide text-muted uppercase">
              For loved ones
            </p>
            <ul className="flex flex-col gap-1">
              {lovedOnesLinks.map(mobileLink)}
            </ul>
          </li>
          <li aria-hidden="true" className="mx-4 my-2 border-t border-line" />
          {mainAfter.map(mobileLink)}
          {me?.isAdmin && mobileLink(adminLink)}
          <li className="flex items-center justify-between rounded-2xl px-4 py-1 sm:hidden">
            <span className="text-lg font-bold">Theme</span>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
