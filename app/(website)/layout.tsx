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

  return {
    title: "Nature Heaven Trek & Expedition | Private Trekking Agency Nepal",
    description: "Nature Heaven Trek & Expedition is Nepal's leading agency specializing in 100% private, personalized trekking packages in Everest, Annapurna, and Manaslu regions.",
    metadataBase: new URL("https://natureheaventreks.com"),
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
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
