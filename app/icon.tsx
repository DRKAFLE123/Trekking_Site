import { ImageResponse } from "next/og";

// 32×32 favicon. Next.js auto-injects <link rel="icon"> for this file.
// We keep a single visual recipe used at every size — a forest-green tile
// with a gold mountain silhouette + "NH" monogram — and just tune sizing.

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a3c2e",
          color: "#c8922a",
          fontSize: 20,
          fontWeight: 900,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.05em",
          borderRadius: 6,
        }}
      >
        NH
      </div>
    ),
    { ...size },
  );
}
