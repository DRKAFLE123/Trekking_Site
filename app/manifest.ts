import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nature Heaven Trek & Expedition",
    short_name: "Nature Heaven",
    description:
      "Nepal's leading agency for 100% private, personalized trekking packages in Everest, Annapurna, and Manaslu regions.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f5f0",
    theme_color: "#1a3c2e",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
