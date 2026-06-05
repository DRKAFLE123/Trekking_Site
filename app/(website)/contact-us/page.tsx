import React from "react";
import { Metadata } from "next";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import ContactForm from "@/components/ContactForm";
import { getPayload } from "payload";
import config from "@/payload/payload.config";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config });
    const cpRes = await payload.find({
      collection: "contactPages",
      where: { slug: { equals: "contact-us" } },
      depth: 0,
      limit: 1,
    });
    const cp = cpRes.docs[0] as any;
    if (cp?.seoTitle || cp?.title) {
      return {
        title: cp.seoTitle || `${cp.title} | Nature Heaven Trekking & Expedition`,
        description:
          cp.seoDescription ||
          cp.excerpt ||
          "Get in touch with Nature Heaven Trekking & Expedition. Call, email, or WhatsApp us.",
      };
    }
  } catch {}
  return {
    title: "Contact Us | Nature Heaven Trekking & Expedition",
    description:
      "Get in touch with Nature Heaven Trekking & Expedition Kathmandu office. Call us, email us, or send a WhatsApp message to start customizing your private Himalayan trek.",
  };
}

export default async function ContactPage() {
  let siteSettings: any = null;
  let contactPage: any = null;
  try {
    const payload = await getPayload({ config });
    const [settingsRes, cpRes] = await Promise.all([
      payload.find({ collection: "siteSettings", depth: 2, limit: 1 }),
      payload.find({
        collection: "contactPages",
        where: { slug: { equals: "contact-us" } },
        depth: 1,
        limit: 1,
      }),
    ]);
    siteSettings = settingsRes.docs[0] || null;
    contactPage = cpRes.docs[0] || null;
  } catch (err: any) {
    console.warn("[Contact Page] Failed to fetch data:", err.message);
  }

  // ── Map ──────────────────────────────────────────────────────────────────
  const mapCoordinates =
    siteSettings?.contactInfo?.mapCoordinates || "27.71672384712074, 85.30808857301508";
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapCoordinates)}&z=17&output=embed`;
  const directionLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapCoordinates)}`;

  // ── Office Addresses ──────────────────────────────────────────────────────
  const headOfficeAddress =
    siteSettings?.footerSettings?.nepalHeadOfficeAddress ||
    "Pakjonal Marga -16, Thamel, Kathmandu, Nepal";
  const ukOfficeAddress =
    siteSettings?.footerSettings?.ukBranchOfficeAddress || "London, United Kingdom";

  // ── Dynamic contact details ───────────────────────────────────────────────
  const mainPhone = siteSettings?.contactInfo?.phone || "+977 9851218358";
  const mainEmail = siteSettings?.contactInfo?.email || "info@natureheaventrek.com";
  const secondEmail = "natureheaventrek@gmail.com";
  const landline = "+977 01-4385821";

  // Resolve WhatsApp: prefer linked team-member doc, then static text field
  const linkedMember = siteSettings?.headerSettings?.expert;
  const expertWhatsApp =
    linkedMember && typeof linkedMember === "object" && linkedMember.whatsApp
      ? linkedMember.whatsApp
      : siteSettings?.headerSettings?.expertWhatsApp ||
        siteSettings?.contactInfo?.whatsapp ||
        "+977 9851218358";
  const cleanWa = expertWhatsApp.replace(/[^0-9]/g, "");

  // ── Page heading overrides from contactPage CMS entry ─────────────────────
  const pageTitle = contactPage?.title || "Contact An Expert";
  const pageSubtitle =
    contactPage?.excerpt ||
    "Have questions about acclimatization, customized itineraries, or booking deposits? Contact our local Sherpa team directly.";

  const googleProfileLink = "https://maps.app.goo.gl/X45yuwgc9aCehw2G9";

  return (
    <div className="bg-[#fcfbfa] min-h-screen pt-24 md:pt-32 pb-16">

      {/* 1. Full-width Google Map Cover Header with Floating Card */}
      <div className="relative w-full h-[350px] md:h-[500px] bg-primary/5 -mt-24 md:-mt-32 mb-12 border-b border-secondary/15 z-0">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Nature Heaven Headquarters Map"
          className="w-full h-full relative z-0"
        ></iframe>

        {/* Floating Office Details Card (Desktop Overlay) */}
        <div className="absolute right-6 top-24 md:top-36 z-10 w-96 bg-white/95 backdrop-blur-md border border-secondary/15 rounded-2xl shadow-2xl p-4 hidden md:flex flex-col gap-3 h-fit max-h-[440px] transition-all duration-300">
          <h3 className="font-serif font-bold text-primary text-base border-b border-primary/5 pb-1">
            Our Offices
          </h3>

          <div className="flex flex-col gap-1 text-left">
            <span className="text-[9px] uppercase font-extrabold text-secondary tracking-wider">
              Headquarters Office
            </span>
            <GoogleBusinessCard
              title="Nature Heaven Treks & Expedition"
              address={headOfficeAddress}
              rating="5.0"
              reviewsCount="824"
              profileUrl={googleProfileLink}
              directionUrl={directionLink}
            />
          </div>

          <div className="flex flex-col gap-1 text-left border-t border-primary/5 pt-2.5">
            <span className="text-[9px] uppercase font-extrabold text-secondary tracking-wider">
              UK Branch Office
            </span>
            <GoogleBusinessCard
              title="Nature Heaven UK Branch"
              address={ukOfficeAddress}
              isLoadingProfile={true}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Start Your Journey
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary mb-4">
            {pageTitle}
          </h1>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80 leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start max-w-6xl mx-auto">

          {/* Column 1: Info Cards (1/3 width) */}
          <div className="flex flex-col gap-6">

            {/* Phone & Chat Support */}
            <div className="bg-white border border-secondary/10 p-6 rounded-2xl shadow-sm flex flex-col gap-3">
              <h4 className="font-serif font-bold text-primary text-base border-b border-primary/5 pb-2">
                Phone & Chat Support
              </h4>
              <div className="flex flex-col gap-3 text-xs text-charcoal/80">
                <a
                  href={`tel:${mainPhone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-2.5 hover:text-secondary transition font-semibold"
                >
                  <FaPhoneAlt className="text-secondary text-sm shrink-0" />
                  <span>Mobile/WhatsApp: {mainPhone}</span>
                </a>
                <a
                  href={`tel:${landline.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-2.5 hover:text-secondary transition font-semibold"
                >
                  <FaPhoneAlt className="text-secondary text-sm shrink-0" />
                  <span>Office Landline: {landline}</span>
                </a>
                <a
                  href={`https://wa.me/${cleanWa}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-green-700 hover:text-green-800 transition font-bold"
                >
                  <FaWhatsapp className="text-green-500 text-base shrink-0" />
                  <span>WhatsApp Chat: {expertWhatsApp}</span>
                </a>
              </div>
            </div>

            {/* Email Inbox */}
            <div className="bg-white border border-secondary/10 p-6 rounded-2xl shadow-sm flex flex-col gap-3">
              <h4 className="font-serif font-bold text-primary text-base border-b border-primary/5 pb-2">
                Email Inquiries
              </h4>
              <div className="flex flex-col gap-3 text-xs text-charcoal/80">
                <a
                  href={`mailto:${mainEmail}`}
                  className="flex items-center gap-2.5 hover:text-secondary transition font-semibold"
                >
                  <FaEnvelope className="text-secondary text-sm shrink-0" />
                  <span>{mainEmail}</span>
                </a>
                <a
                  href={`mailto:${secondEmail}`}
                  className="flex items-center gap-2.5 hover:text-secondary transition font-semibold"
                >
                  <FaEnvelope className="text-secondary text-sm shrink-0" />
                  <span>{secondEmail}</span>
                </a>
              </div>
            </div>

            {/* Headquarters Card */}
            <div className="bg-white border border-secondary/10 p-5 rounded-2xl shadow-sm flex flex-col gap-2.5 text-left">
              <span className="text-[10px] uppercase font-extrabold text-secondary tracking-wider ml-1">
                Headquarters Office
              </span>
              <div>
                <h4 className="font-serif font-bold text-primary text-sm mb-1">
                  Nature Heaven Treks & Expedition Pvt. Ltd.
                </h4>
                <p className="text-xs text-charcoal/80 leading-relaxed font-semibold">
                  {headOfficeAddress}
                </p>
              </div>
            </div>

            {/* UK Branch Card */}
            <div className="bg-white border border-secondary/10 p-5 rounded-2xl shadow-sm flex flex-col gap-2.5 text-left">
              <span className="text-[10px] uppercase font-extrabold text-secondary tracking-wider ml-1">
                UK Branch Office
              </span>
              <div>
                <h4 className="font-serif font-bold text-primary text-sm mb-1">
                  Nature Heaven UK Branch
                </h4>
                <p className="text-xs text-charcoal/80 leading-relaxed font-semibold">
                  {ukOfficeAddress}
                </p>
              </div>
            </div>

          </div>

          {/* Column 2: Form (2/3 width) */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}

// Google Business Profile Card Component
function GoogleBusinessCard({
  title,
  address,
  rating,
  reviewsCount,
  profileUrl,
  directionUrl,
  isLoadingProfile,
}: {
  title: string;
  address: string;
  rating?: string;
  reviewsCount?: string;
  profileUrl?: string;
  directionUrl?: string;
  isLoadingProfile?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200/80 p-2.5 rounded-xl shadow-sm flex items-start justify-between gap-2.5 text-left font-sans w-full transition duration-300 hover:shadow-md">
      <div className="flex-1 min-w-0">
        <h4 className="font-sans font-bold text-[#202124] text-[13px] leading-tight truncate mb-0.5">
          {title}
        </h4>
        <p className="text-[#70757a] text-[11px] leading-normal font-normal mb-1.5 whitespace-normal break-words line-clamp-2">
          {address}
        </p>
        {isLoadingProfile ? (
          <div className="flex items-center gap-1.5 text-[10px] text-[#70757a] font-normal mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] animate-pulse"></span>
            <span className="italic font-medium">Business Profile loading...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-normal mt-0.5 text-[#70757a]">
            <span className="text-[#202124] font-bold">{rating}</span>
            <span className="text-[#f4b400] text-xs leading-none">★</span>
            {profileUrl ? (
              <a href={profileUrl} target="_blank" rel="noreferrer" className="text-[#1a73e8] hover:underline font-medium">
                ({reviewsCount})
              </a>
            ) : (
              <span className="font-medium">({reviewsCount})</span>
            )}
            <span className="text-[#70757a] text-[10px] cursor-help ml-0.5" title="Verified Google Business rating">ⓘ</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {profileUrl ? (
          <a href={profileUrl} target="_blank" rel="noreferrer"
            className="w-7 h-7 rounded-full bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#1a73e8] flex items-center justify-center transition duration-200"
            title="View Business Profile"
          >
            <svg className="w-3.5 h-3.5 text-[#1a73e8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        ) : (
          <div className="w-7 h-7 rounded-full bg-gray-50 text-gray-200 flex items-center justify-center cursor-not-allowed">
            <svg className="w-3.5 h-3.5 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </div>
        )}

        {directionUrl ? (
          <a href={directionUrl} target="_blank" rel="noreferrer"
            className="w-7 h-7 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white flex items-center justify-center shadow-sm hover:shadow transition duration-200"
            title="Get Directions"
          >
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.43 10.4l-8.83-8.83a2.24 2.24 0 0 0-3.18 0L1.6 10.4a2.24 2.24 0 0 0 0 3.18l8.83 8.83a2.24 2.24 0 0 0 3.18 0l8.83-8.83a2.24 2.24 0 0 0 0-3.18zM13.5 14.5V12H10v3H8v-4a1 1 0 0 1 1-1h4.5V7.5L18 11l-4.5 3.5z"/>
            </svg>
          </a>
        ) : (
          <div className="w-7 h-7 rounded-full bg-gray-50 text-gray-200 flex items-center justify-center cursor-not-allowed">
            <svg className="w-3.5 h-3.5 text-gray-200" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.43 10.4l-8.83-8.83a2.24 2.24 0 0 0-3.18 0L1.6 10.4a2.24 2.24 0 0 0 0 3.18l8.83 8.83a2.24 2.24 0 0 0 3.18 0l8.83-8.83a2.24 2.24 0 0 0 0-3.18zM13.5 14.5V12H10v3H8v-4a1 1 0 0 1 1-1h4.5V7.5L18 11l-4.5 3.5z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
