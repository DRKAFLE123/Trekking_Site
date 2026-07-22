import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

import { getPayload } from "payload";
import config from "@/payload/payload.config";
import cloudinaryLoader, { getMediaUrl } from "@/lib/cloudinary-loader";

export async function generateMetadata(): Promise<Metadata> {
  let allowIndexing = true;
  // The last-resort fallback is now our own brand-generated OG image at
  // /opengraph-image (Next ImageResponse). The old hardcoded competitor
  // placeholder was deleted so it can never come back as a fallback.
  let seoImageUrl: string | null = null;
  let lastUpdated: Date | null = null;
  try {
    const payload = await getPayload({ config });
    const siteSettings = await payload.find({
      collection: 'siteSettings',
      depth: 1,
    });
    const settingsDoc = siteSettings.docs[0] as any;
    if (settingsDoc) {
      allowIndexing = settingsDoc.allowIndexing ?? true;
      const rawImage = getMediaUrl(settingsDoc.seoImage);
      if (rawImage) {
        seoImageUrl = cloudinaryLoader({ src: rawImage, width: 1200 });
      }
      if (settingsDoc.updatedAt) lastUpdated = new Date(settingsDoc.updatedAt);
    }

    // Fallback to "Why Travel with Us" image from HomepageSettings if no
    // explicit seoImage is uploaded.
    if (!seoImageUrl) {
      const homepageSettings = await payload.find({
        collection: 'homepageSettings',
        depth: 1,
      });
      const homeDoc = homepageSettings.docs[0] as any;
      if (homeDoc) {
        const rawHomeImage = getMediaUrl(homeDoc.whyTravelImage);
        if (rawHomeImage) {
          seoImageUrl = cloudinaryLoader({ src: rawHomeImage, width: 1200 });
        }
        if (homeDoc.updatedAt) {
          const homeDate = new Date(homeDoc.updatedAt);
          if (!lastUpdated || homeDate > lastUpdated) lastUpdated = homeDate;
        }
      }
    }
  } catch (error: any) {
    const errorMsg = error?.message || '';
    if (errorMsg.includes('connect') || errorMsg.includes('ENOTFOUND')) {
      console.warn('Database offline/unavailable for layout metadata; using default fallback image.');
    } else {
      console.error('Error fetching settings for layout metadata:', error);
    }
  }

  // Final fallback: the brand-generated 1200x630 OG image (app/opengraph-image.tsx).
  if (!seoImageUrl) seoImageUrl = "/opengraph-image";

  const siteUrl = "https://natureheaventreks.com";
  const defaultTitle = "Nature Heaven Trek & Expedition | Private Trekking Agency Nepal";
  const defaultDescription =
    "Nature Heaven Trek & Expedition is Nepal's leading agency specializing in 100% private, personalized trekking packages in Everest, Annapurna, and Manaslu regions.";

  return {
    title: { default: defaultTitle, template: "%s | Nature Heaven Trekking" },
    description: defaultDescription,
    metadataBase: new URL(siteUrl),
    // Deliberately no `alternates.canonical` here — Next.js inherits root
    // metadata to every child page, so setting canonical="/" here would tell
    // Google every trek / blog / region page is a duplicate of the homepage.
    // Individual pages (regions, countries) set their own canonical.
    applicationName: "Nature Heaven Trekking",
    keywords: [
      "Nepal trekking",
      "private trekking Nepal",
      "Everest Base Camp trek",
      "Annapurna trek",
      "Manaslu Circuit",
      "Himalayan adventure",
      "Sherpa guide",
    ],
    authors: [{ name: "Nature Heaven Trek & Expedition" }],
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: {
        index: allowIndexing,
        follow: allowIndexing,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      // Must match the WebSite schema `name` on the homepage exactly. Google
      // cross-checks og:site_name against that schema; when they disagree it
      // distrusts both and shows the bare domain instead.
      siteName: "Nature Heaven Treks and Expedition",
      url: siteUrl,
      title: defaultTitle,
      description: defaultDescription,
      // og:updated_time hints to Facebook / LinkedIn / etc. that the page's
      // OG content has changed, so they re-scrape sooner than their default
      // ~7-day cache window. Falls back to "now" if no CMS timestamp.
      ...(lastUpdated ? { updatedTime: lastUpdated.toISOString() } : {}),
      images: [
        {
          url: seoImageUrl,
          width: 1200,
          height: 630,
          alt: "Trekkers approaching the Himalayas with Nature Heaven Trek & Expedition",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: [seoImageUrl],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
    },
    manifest: "/manifest.webmanifest",
  };
}

// Admin-managed tracking tags (Site Settings → Tracking & Marketing Scripts).
// Rendered as raw HTML at the top of <body>: server-rendered <script> tags are
// part of the initial document, so the browser executes them on parse — no
// client-side re-injection needed. Only admins can edit this field, and its
// contents run with full page access, hence the trust warning in the CMS.
async function TrackingScripts() {
  try {
    const payload = await getPayload({ config });
    const siteSettings = await payload.find({ collection: "siteSettings", depth: 0, limit: 1 });
    const headScripts = (siteSettings.docs[0] as any)?.trackingSettings?.headScripts;
    if (!headScripts) return null;
    return (
      <div
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{ __html: headScripts }}
      />
    );
  } catch {
    // Never let a tracking-tag fetch failure take down the whole site shell.
    return null;
  }
}

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7LZ9XN30TV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7LZ9XN30TV');
          `}
        </Script>
      </head>
      <body className="font-sans bg-bgOffWhite text-charcoal min-h-screen flex flex-col" suppressHydrationWarning>
        <TrackingScripts />
        <Navbar />
        <main className="grow">{children}</main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
        <CookieConsent />
      </body>
    </html>
  );
}
