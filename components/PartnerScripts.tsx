import { partnerScripts } from "@/lib/partnerScripts";

export function PartnerScripts() {
  return (
    <ul className="mt-8 grid gap-6 lg:grid-cols-2">
      {partnerScripts.map(({ situation, sayThis, notThat, thenDo }) => (
        <li
          key={situation}
          className="flex flex-col rounded-card bg-surface p-6 shadow-soft"
        >
          <h3 className="text-xl sm:text-2xl">{situation}</h3>
          <dl className="mt-4 flex grow flex-col gap-3">
            <div className="grid grow gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-sage p-4">
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
              <div className="rounded-2xl bg-sand p-4">
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
            </div>
            <div className="border-t border-line pt-3">
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
