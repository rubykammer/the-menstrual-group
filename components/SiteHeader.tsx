"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/site";
import { Logo } from "./Logo";

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
    <header className="page-width sticky top-3 z-40 mt-3">
      <div className="rounded-[1.75rem] bg-background/85 shadow-soft backdrop-blur-md">
        <div className="flex h-14 items-center justify-between gap-4 pr-2 pl-5">
          <Link
            href="/"
            className="transition-opacity duration-200 hover:opacity-80"
            onClick={() => setMenuOpen(false)}
          >
            <Logo />
          </Link>

          <div className="flex items-center gap-2">
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isCurrent(link.href) ? "page" : undefined}
                      className="rounded-full px-3 py-2 font-semibold underline-offset-4 transition-colors duration-200 hover:underline aria-[current=page]:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href="#newsletter"
              className="hidden rounded-full bg-rose px-4 py-2 font-extrabold transition-colors duration-200 hover:bg-foreground hover:text-background sm:inline-block"
              onClick={() => setMenuOpen(false)}
            >
              Subscribe
            </a>

            <button
              ref={menuButton}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-stone md:hidden"
            >
              <span className="sr-only">{menuOpen ? "Close" : "Open"} menu</span>
              <svg
                viewBox="0 0 24 24"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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
          className="border-t border-line md:hidden"
        >
          <ul className="flex flex-col gap-1 p-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl px-3 py-2.5 text-lg font-semibold transition-colors duration-200 hover:bg-stone aria-[current=page]:bg-stone"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
