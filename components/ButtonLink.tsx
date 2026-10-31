import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-primary-strong text-white hover:bg-orange-800",
  secondary:
    "border-2 border-primary-strong text-primary-strong hover:bg-primary-strong hover:text-white",
};

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 font-extrabold transition-all duration-200 motion-safe:hover:-translate-y-0.5 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
