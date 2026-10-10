// Plain JS on purpose: the host's glibc is too old for Next's native SWC, and
// Next 16 can't transpile a TypeScript config on the WebAssembly fallback.
import { withPayload } from "@payloadcms/next/withPayload";
// Dead URLs Google still holds for this domain (the WordPress site that lived
// here before, plus seven /company/* pages that duplicated root pages). Each is
// mapped to its closest live equivalent; order matters — specific rules sit
// above the /st_tour/:rest* style fallbacks. Source: Search Console, Sep 2026.
import legacyRedirects from "./legacy-redirects.json" with { type: "json" };

// Content Security Policy for the public site. 'unsafe-inline' scripts are required by
// Next's inline bootstrap without per-request nonces (nonces would force dynamic rendering).
// Adding a new third-party tag (e.g. via CMS tracking scripts) means adding its origin here.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.clarity.ms https://*.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: https://res.cloudinary.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com https://*.clarity.ms https://c.bing.com https://res.cloudinary.com",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com https://maps.google.com https://td.doubleclick.net https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loaderFile: "./lib/cloudinary-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cms.discoveryworldtrekking.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Prerender pulls every trek/blog from a remote Postgres; give slow builds
  // headroom instead of failing the deploy at the 60s default.
  poweredByHeader: false,
  staticPageGenerationTimeout: 180,
  serverExternalPackages: ["@react-pdf/renderer"],
  // pdfkit loads its built-in fonts with a dynamic require, so the file tracer
  // misses them and the brochure route 500s on the host. Pull them in by hand.
  outputFileTracingIncludes: {
    "/api/brochure/[slug]": [
      "./node_modules/pdfkit/js/standard-fonts/**",
      "./node_modules/pdfkit/js/data/**",
      "./node_modules/@react-pdf/**",
      "./public/fonts/**",
      "./public/brand/**",
      "./public/Map Image/**",
    ],
  },
  experimental: {
    serverMinification: false,
  },
  crossOrigin: "anonymous",
  async redirects() {
    return [
      // Canonical host: www serves the same site without redirecting, so Google
      // indexed https://www.natureheaventreks.com/ as the canonical homepage
      // while sitemap/robots/schema all point at the apex ("Duplicate without
      // user-selected canonical" in GSC). One host must win: 301 www -> apex.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.natureheaventreks.com" }],
        destination: "https://natureheaventreks.com/:path*",
        permanent: true,
      },
      ...legacyRedirects.map((r) => ({ ...r, permanent: true })),
      { source: "/wp-admin", destination: "/admin/login", permanent: true },
      { source: "/wp-admin/:path*", destination: "/admin/login", permanent: true },
      { source: "/wp-login.php", destination: "/admin/login", permanent: true },
      { source: "/responsible-tourism", destination: "/csr", permanent: true },
      { source: "/terms-conditions", destination: "/terms-and-condition", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        // Website pages only; the Payload admin and API keep their own needs.
        source: "/((?!admin|api).*)",
        headers: [{ key: "Content-Security-Policy-Report-Only", value: CSP }],
      },
    ];
  },
};

export default withPayload(nextConfig);

