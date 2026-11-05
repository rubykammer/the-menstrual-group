import { partnerScripts, type PartnerScript } from "@/lib/partnerScripts";

export function PartnerScripts({
  scripts = partnerScripts,
}: {
  scripts?: PartnerScript[];
}) {
  return (
    <ul className="mt-8 grid gap-6 lg:grid-cols-2">
      {scripts.map(({ situation, sayThis, notThat, thenDo }) => (
        <li
          key={situation}
          className="flex flex-col rounded-card bg-surface p-6 shadow-soft transition-all duration-300 hover:shadow-lg motion-safe:hover:-translate-y-1"
        >
          <h3 className="text-xl sm:text-2xl">{situation}</h3>
          {/* A <dl> only allows one wrapper <div> around each term, so the list
              is the grid itself rather than holding a grid inside it. */}
          <dl className="mt-4 grid grow gap-3 sm:grid-cols-2 sm:grid-rows-[1fr_auto]">
            <div className="rounded-2xl bg-honey p-4">
              <dt className="flex items-center gap-2 font-extrabold">
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 shrink-0 text-primary-strong"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Say this
              </dt>
              <dd className="mt-1">{sayThis}</dd>
            </div>
            <div className="rounded-2xl bg-blush p-4">
              <dt className="flex items-center gap-2 font-extrabold">
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 shrink-0 text-accent-strong"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
                Not that
              </dt>
              <dd className="mt-1">{notThat}</dd>
            </div>
            <div className="border-t border-line pt-3 sm:col-span-2">
              <dt className="inline font-extrabold text-primary-strong">
                Then:
              </dt>{" "}
              <dd className="inline">{thenDo}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
