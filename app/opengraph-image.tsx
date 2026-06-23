import { ImageResponse } from "next/og";

// Brand OG image at /opengraph-image — auto-discovered by Next.js metadata
// conventions and used wherever a route doesn't override metadata.openGraph.images.

export const runtime = "edge";
export const alt = "Nature Heaven Trek & Expedition — Private Himalayan Trekking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PRIMARY = "#1a3c2e";
const PRIMARY_LIGHT = "#2a5a44";
const SECONDARY = "#c8922a";
const BG_OFFWHITE = "#f8f5f0";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 90px",
          color: BG_OFFWHITE,
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)`,
          position: "relative",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        {/* Mountain silhouette anchor at bottom */}
        <svg
          width="1200"
          height="320"
          viewBox="0 0 1200 320"
          style={{ position: "absolute", left: 0, bottom: 0, opacity: 0.18 }}
        >
          <path
            fill={SECONDARY}
            d="M0 280 L100 160 L210 240 L320 110 L450 220 L580 80 L720 200 L850 130 L1000 230 L1130 150 L1200 200 L1200 320 L0 320 Z"
          />
        </svg>

        {/* Topo lines decoration top-right */}
        <svg
          width="540"
          height="540"
          viewBox="0 0 540 540"
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            opacity: 0.12,
          }}
        >
          {[60, 110, 160, 210, 260].map((r, i) => (
            <circle
              key={i}
              cx="270"
              cy="270"
              r={r}
              fill="none"
              stroke={SECONDARY}
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 22px",
            border: `2px solid ${SECONDARY}`,
            borderRadius: 999,
            color: SECONDARY,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          <span>🏔️</span>
          <span>Nepal · Private Trekking</span>
        </div>

        {/* Brand */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 1020,
              flexWrap: "wrap",
            }}
          >
            <span>Nature Heaven&nbsp;</span>
            <span style={{ color: SECONDARY }}>Trek &amp; Expedition</span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 32,
              height: 4,
              width: 120,
              background: SECONDARY,
              borderRadius: 4,
            }}
          />

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              fontWeight: 400,
              lineHeight: 1.4,
              color: "rgba(248, 245, 240, 0.85)",
              maxWidth: 920,
            }}
          >
            100% private, customizable treks across Everest, Annapurna, Manaslu &amp;
            beyond — led by native Sherpa guides.
          </div>
        </div>

        {/* Footer URL */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            right: 70,
            fontSize: 22,
            fontWeight: 700,
            color: SECONDARY,
            letterSpacing: "0.1em",
          }}
        >
          natureheaventreks.com
        </div>
      </div>
    ),
    { ...size },
  );
}
