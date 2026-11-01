import { myths } from "@/lib/myths";

export function MythList() {
  return (
    <ul className="divide-y divide-line">
      {myths.map(({ myth, fact, source }) => (
        <li key={myth} className="py-8 first:pt-0 lg:py-12">
          {/* Struck through so a skimmed heading can't read as advice */}
          <h3 className="text-3xl font-light text-muted sm:text-5xl">
            <span className="sr-only">Myth: </span>
            <s className="decoration-accent/70 decoration-1">{myth}</s>
          </h3>
          <p className="mt-4 max-w-xl">
            <strong className="font-extrabold">The truth:</strong> {fact}
          </p>
          <p className="mt-2 text-sm">
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
