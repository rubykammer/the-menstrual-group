/** A round profile photo, or the first letter of the name when there's none. */
export function Avatar({
  src,
  name,
  size = 96,
}: {
  src: string | null;
  name: string;
  size?: number;
}) {
  const style = { width: size, height: size };

  if (src) {
    return (
      // Photos come from Supabase Storage already cropped to a small square,
      // so next/image's resizing would add nothing.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        style={style}
        className="shrink-0 rounded-full bg-peach object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ ...style, fontSize: size * 0.42 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-peach font-display text-primary-strong"
    >
      {(name.trim()[0] ?? "?").toUpperCase()}
    </span>
  );
}
