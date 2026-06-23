import { ImageResponse } from "next/og";

// PWA large icon — 512×512. Used by web app manifest, push notifications,
// and high-DPI install prompts.

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon512() {
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
          width="512"
          height="220"
          viewBox="0 0 512 220"
          style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.22 }}
        >
          <path
            fill="#c8922a"
            d="M0 200 L80 80 L170 160 L270 40 L370 140 L450 70 L512 130 L512 220 L0 220 Z"
          />
        </svg>

        <div style={{ fontSize: 256, fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 1 }}>
          NH
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "0.2em",
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
