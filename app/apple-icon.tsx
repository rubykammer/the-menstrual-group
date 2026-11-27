import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The cycle-ring logo as a PNG, for iPhone home screens and search results. */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fffbeb",
      }}
    >
      <svg width="132" height="132" viewBox="0 0 32 32">
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
          stroke="#dc2626"
          strokeWidth="6"
        />
        <path
          d="M27 16a11 11 0 0 1-11 11"
          fill="none"
          stroke="#d97706"
          strokeWidth="6"
        />
      </svg>
    </div>,
    size,
  );
}
