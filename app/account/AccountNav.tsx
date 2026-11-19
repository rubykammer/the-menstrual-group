"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/account", label: "Profile" },
  { href: "/account/posts", label: "Your posts" },
  { href: "/account/favourites", label: "Favourites" },
  { href: "/account/quizzes", label: "Quiz results" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Your account" className="-mx-4 mt-6 overflow-x-auto px-4">
      <ul className="flex gap-1 border-b border-line">
        {sections.map((section) => {
          const current = pathname === section.href;
          return (
            <li key={section.href}>
              <Link
                href={section.href}
                aria-current={current ? "page" : undefined}
                className="-mb-px block border-b-[3px] border-transparent px-4 py-3 font-bold whitespace-nowrap text-muted transition-colors duration-200 hover:text-primary-strong aria-[current=page]:border-primary-strong aria-[current=page]:text-primary-strong"
              >
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
