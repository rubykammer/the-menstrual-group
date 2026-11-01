import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-foreground text-background hover:bg-primary-strong",
  secondary:
    "border border-foreground text-foreground hover:bg-foreground hover:text-background",
  rose: "bg-rose text-foreground hover:bg-background",
  light:
    "border border-background text-background hover:bg-background hover:text-foreground",
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
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 font-extrabold transition-colors duration-200 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
