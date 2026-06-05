import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";

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

export async function generateMetadata(): Promise<Metadata> {
  let allowIndexing = true;
  try {
    const payload = await getPayload({ config });
    const siteSettings = await payload.find({
      collection: 'siteSettings',
      depth: 0,
    });
    allowIndexing = (siteSettings.docs[0] as any)?.allowIndexing ?? true;
  } catch (error) {
    console.error('Error fetching site settings for layout metadata:', error);
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
          url: "/Manaslu-Circuit-Trek.jpg",
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
      images: ["/Manaslu-Circuit-Trek.jpg"],
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
