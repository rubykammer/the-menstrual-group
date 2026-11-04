import { site } from "@/lib/site";

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <circle
          cx="16"
          cy="16"
          r="11"
          fill="none"
          stroke="#fb923c"
          strokeWidth="6"
        />
        <path
          d="M16 5a11 11 0 0 1 11 11"
          fill="none"
          stroke="#ec4899"
          strokeWidth="6"
        />
        <path
          d="M27 16a11 11 0 0 1-11 11"
          fill="none"
          stroke="#d97706"
          strokeWidth="6"
        />
      </svg>
      <span className="font-display text-lg leading-tight font-semibold tracking-tight sm:text-xl">
        {site.name}
      </span>
    </span>
  );
}
