import { myths } from "@/lib/myths";

export function MythList() {
  return (
    <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {myths.map(({ myth, fact, source }) => (
        <li
          key={myth}
          className="flex flex-col rounded-card bg-surface p-6 shadow-soft transition-all duration-300 hover:shadow-lg motion-safe:hover:-translate-y-1"
        >
          <p className="self-start rounded-full bg-blush px-3 py-0.5 text-sm font-extrabold tracking-wide text-accent-strong uppercase">
            Myth
          </p>
          <h3 className="mt-3 text-xl sm:text-2xl">{myth}</h3>
          <p className="mt-4 border-t border-line pt-4">
            <strong className="font-extrabold text-primary-strong">
              The truth:
            </strong>{" "}
            {fact}
          </p>
          <p className="mt-auto pt-4 text-sm">
            <a
              href={source.url}
              rel="noopener noreferrer"
              className="text-muted underline underline-offset-2 transition-colors duration-200 hover:text-primary-strong"
            >
              <span className="sr-only">Source: </span>
              {source.label}
            </a>
          </p>
        </li>
      ))}
    </ul>
  );
}
