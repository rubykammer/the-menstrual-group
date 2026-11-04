import Link from "next/link";
import { supporterPages } from "@/lib/site";

/** Buttons that move between the partner, dad and friend guides. */
export function SupporterLinks({ current }: { current: string }) {
  return (
    <nav aria-labelledby="supporter-links-heading" className="page-width mt-20">
      <div className="rounded-card bg-surface p-8 shadow-soft sm:p-10">
        <h2 id="supporter-links-heading" className="text-3xl sm:text-4xl">
          Supporting someone else, too?
        </h2>
        <ul className="mt-6 flex flex-col gap-3 sm:flex-row">
          {supporterPages.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                aria-current={page.href === current ? "page" : undefined}
                className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-lg font-extrabold text-primary-strong transition-colors duration-200 hover:bg-primary-strong hover:text-white aria-[current=page]:bg-primary-strong aria-[current=page]:text-white sm:w-auto ${page.tint}`}
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
