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
  let seoImageUrl = "/Manaslu-Circuit-Trek.jpg";
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
    }

    // Fallback to "Why Travel with Us" image from HomepageSettings if no explicit seoImage is uploaded
    if (seoImageUrl === "/Manaslu-Circuit-Trek.jpg") {
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

  const siteUrl = "https://natureheaventreks.com";
  const defaultTitle = "Nature Heaven Trek & Expedition | Private Trekking Agency Nepal";
  const defaultDescription =
    "Nature Heaven Trek & Expedition is Nepal's leading agency specializing in 100% private, personalized trekking packages in Everest, Annapurna, and Manaslu regions.";

  return {
    title: { default: defaultTitle, template: "%s | Nature Heaven Trekking" },
    description: defaultDescription,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: "/" },
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
      siteName: "Nature Heaven Trekking",
      url: siteUrl,
      title: defaultTitle,
      description: defaultDescription,
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
