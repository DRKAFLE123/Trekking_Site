import { ImageResponse } from "next/og";

// Apple touch icon (180×180). Used when iOS Safari users add the site to
// their home screen. Next.js auto-injects <link rel="apple-touch-icon">.

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a3c2e",
          color: "#c8922a",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Mountain silhouette */}
        <svg
          width="180"
          height="80"
          viewBox="0 0 180 80"
          style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.25 }}
        >
          <path
            fill="#c8922a"
            d="M0 70 L30 30 L60 55 L95 15 L130 50 L160 25 L180 45 L180 80 L0 80 Z"
          />
        </svg>

        <div
          style={{
            fontSize: 86,
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          NH
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(248, 245, 240, 0.85)",
          }}
        >
          Trekking
        </div>
      </div>
    ),
    { ...size },
  );
}
