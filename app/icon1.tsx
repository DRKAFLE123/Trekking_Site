import { ImageResponse } from "next/og";

// PWA "any maskable" icon — 192×192. Reused in the web app manifest at
// /icon1 (Next.js exposes one icon file per route).

export const runtime = "edge";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon192() {
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
        <svg
          width="192"
          height="88"
          viewBox="0 0 192 88"
          style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.25 }}
        >
          <path
            fill="#c8922a"
            d="M0 78 L32 32 L64 60 L100 16 L140 56 L170 28 L192 50 L192 88 L0 88 Z"
          />
        </svg>

        <div style={{ fontSize: 92, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1 }}>
          NH
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 15,
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
