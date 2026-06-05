import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { Trek, Region } from "@/types";
import { FaClock, FaMapMarkerAlt, FaWhatsapp, FaPaperPlane, FaRegCompass, FaChevronRight, FaAward, FaCalendarAlt } from "react-icons/fa";
import TrekCard from "@/components/TrekCard";
import CountryInquiryForm from "./CountryInquiryForm";

type Params = Promise<{ slug: string }>;

interface CountryData {
  name: string;
  headline: string;
  description: string;
  heroImage: string;
  highlights: string[];
  bio: string;
}

const COUNTRIES: Record<string, CountryData> = {
  nepal: {
    name: "Nepal",
    headline: "The Ultimate Trekking Playground",
    description: "Home to 8 of the world's 14 highest peaks, including Mt. Everest. Nepal offers legendary high-altitude trekking, rich biodiversity, and deep cultural experiences.",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600",
    highlights: [
      "Trek to legendary Everest Base Camp (5,364m)",
      "Annapurna Circuit & Sanctuary high-altitude vistas",
      "Off-the-beaten-path Manaslu Circuit exploration",
      "Native Sherpa guided 100% private custom itineraries",
    ],
    bio: "Nepal remains the spiritual and geological heart of alpine adventure. Whether you are aiming for high Himalayan passes, climbing semi-technical trekking peaks, or walking through pristine pine forests and rhododendron-clad valleys, our private custom packages provide elite acclimatization standards, licensed local Sherpa guides, and unprecedented safety configurations.",
  },
  tibet: {
    name: "Tibet",
    headline: "The Roof of the World",
    description: "Explore the ancient monasteries of Lhasa, follow sacred pilgrimage paths (Koras), and stand in awe of Mt. Everest's dramatic North Face.",
    heroImage: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600",
    highlights: [
      "Potala Palace & Jokhang Temple spiritual tours in Lhasa",
      "Pilgrimage hikes around the legendary Mt. Kailash (Kora)",
      "Everest Base Camp North Face (Tibet side) vista point",
      "Stunning turquoise waters of Lake Yamdrok & Lake Namtso",
    ],
    bio: "Steeped in deep Buddhist spirituality and bounded by the massive northern slopes of the Himalayas, Tibet offers a truly mystic travel experience. Traveling in Tibet requires specialized permits and authorized guides. We manage all Tibet tourist visa invitations, permit approvals, and private logistics from Kathmandu, ensuring a seamless high-altitude adventure.",
  },
  bhutan: {
    name: "Bhutan",
    headline: "The Land of the Thunder Dragon",
    description: "Experience the last remaining Himalayan Buddhist Kingdom. Explore ancient cliffside monasteries, lush valleys, and traditional fortress dzongs.",
    heroImage: "https://images.unsplash.com/photo-1578593139888-39622e2077ef?q=80&w=1600",
    highlights: [
      "Hike to the legendary Tigers Nest (Paro Taktsang) Monastery",
      "Explore Punakha Dzong, the most beautiful fortress in Bhutan",
      "Cross high mountain passes like Dochula Pass (3,100m)",
      "Witness vibrant traditional festivals (Tshechus) in Thimphu",
    ],
    bio: "Bhutan is famous for its sustainable high-value, low-volume tourism model and measuring success through Gross National Happiness. It remains one of the most exclusive, pristine, and well-preserved cultural sanctuaries on Earth. We offer luxury private cultural tours and mountain hikes across Paro, Thimphu, Punakha, and the Bumthang valleys, tailored completely to your schedule.",
  },
};

export default async function CountryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const country = COUNTRIES[slug.toLowerCase()];

  if (!country) {
    notFound();
  }

  // Fetch treks and site settings from database safely
  let allTreks: Trek[] = [];
  let siteSettings: any = null;
  try {
    const payload = await getPayload({ config });
    const [treksRes, siteSettingsRes] = await Promise.all([
      payload.find({
        collection: "treks",
        depth: 1,
        limit: 100,
      }),
      payload.find({
        collection: "siteSettings",
        depth: 1,
        limit: 1,
      })
    ]);
    allTreks = treksRes.docs as unknown as Trek[];
    siteSettings = siteSettingsRes.docs[0] as any;
  } catch (err: any) {
    console.warn("[Country Page] Failed to query database:", err.message);
  }
  const countryTreks = slug.toLowerCase() === "nepal" ? allTreks : [];
  // Resolve WhatsApp: prefer linked team member's whatsApp field
  const linkedMember = siteSettings?.headerSettings?.expert;
  const rawWhatsApp = (linkedMember && typeof linkedMember === "object" && linkedMember.whatsApp)
    ? linkedMember.whatsApp
    : (siteSettings?.headerSettings?.expertWhatsApp || "9779851218358");
  const formattedWhatsapp = rawWhatsApp.replace(/[^0-9]/g, "");

  return (
    <div className="w-full">
      {/* 1. Hero Cover */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={country.heroImage}
            alt={`${country.name} Landscape Cover`}
            fill
            priority
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#1a2e1f]/90 z-10 pointer-events-none" />
        </div>

        <div className="relative z-20 text-center text-bgOffWhite px-6 max-w-4xl flex flex-col gap-4">
          <span className="inline-flex items-center gap-1.5 self-center bg-secondary text-primary font-sans font-bold text-[11px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-secondary/20">
            🏔️ Explore the Himalayas
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none">
            {country.name} Treks & Tours
          </h1>
          <p className="font-sans text-base sm:text-lg md:text-xl text-bgOffWhite/90 max-w-2xl mx-auto font-light leading-relaxed">
            {country.headline}
          </p>
        </div>
      </section>

      {/* 2. Destination Highlights & Bio */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Bio Details (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-2 block">
                Destination Overview
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
                Discover the Magic of {country.name}
              </h2>
              <div className="h-0.5 w-16 bg-secondary mt-3 mb-6"></div>
            </div>
            <p className="text-sm md:text-base text-charcoal/80 leading-relaxed font-light">
              {country.description}
            </p>
            <p className="text-sm md:text-base text-charcoal/80 leading-relaxed font-light">
              {country.bio}
            </p>
            
            <div className="flex items-center gap-4 flex-wrap mt-4">
              <Link
                href="/plan-a-trip"
                className="bg-secondary text-primary font-bold px-6 py-3 rounded-xl border border-secondary hover:bg-transparent hover:text-secondary transition duration-300 text-sm flex items-center gap-2"
              >
                <FaPaperPlane className="h-3.5 w-3.5" />
                <span>Customize Your {country.name} Trip</span>
              </Link>
              <a
                href={`https://wa.me/${formattedWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold px-6 py-2.5 rounded-xl transition duration-300 text-sm flex items-center gap-2"
              >
                <FaWhatsapp className="h-4 w-4" />
                <span>WhatsApp Expert Chat</span>
              </a>
            </div>
          </div>

          {/* Right Core Highlights Panel (5 Columns) */}
          <div className="lg:col-span-5 bg-bgOffWhite border border-secondary/15 rounded-2xl p-6 md:p-8 shadow-md">
            <h3 className="font-serif font-bold text-primary text-xl border-b border-secondary/10 pb-3 mb-6 flex items-center gap-2">
              <FaRegCompass className="text-secondary" />
              <span>Travel Highlights</span>
            </h3>
            <ul className="flex flex-col gap-4">
              {country.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                    ✓
                  </span>
                  <span className="text-xs sm:text-sm text-charcoal/80 font-medium leading-normal">{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-secondary/10 flex items-center gap-4 text-xs text-charcoal/60">
              <span className="flex items-center gap-1"><FaAward className="text-secondary" /> Native Guides</span>
              <span className="flex items-center gap-1"><FaCalendarAlt className="text-secondary" /> Private Tours</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Content Section: List Trips (Nepal) or Tailored Planner widget (Tibet/Bhutan) */}
      {slug.toLowerCase() === "nepal" ? (
        <section className="py-20 px-6 bg-[#fcfbfa] border-t border-secondary/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-2 block">
                Nepal Trekking Packages
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
                Popular Nepal Adventures
              </h2>
              <div className="h-0.5 w-16 bg-secondary mx-auto mt-3"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {countryTreks.map((trek) => (
                <TrekCard key={trek._id || trek.id} trek={trek} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 px-6 bg-[#1a2e1f] text-bgOffWhite border-t border-emerald-950/20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Left Prompt */}
            <div className="md:col-span-5 flex flex-col gap-4 text-left">
              <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] leading-none">
                Tailor-Made Adventures
              </span>
              <h2 className="font-serif text-3xl font-bold leading-tight">
                Plan Your Private Custom Tour to {country.name}
              </h2>
              <p className="text-xs sm:text-sm text-bgOffWhite/70 leading-relaxed font-light">
                We organize complete visa invitations, travel clearances, native guides, and boutique lodging in Lhasa, Shigatse, Paro, Thimphu, and beyond.
              </p>
              <div className="mt-4 flex flex-col gap-2.5 text-xs text-secondary font-bold">
                <span className="flex items-center gap-2">✔ Custom Dates & Itinerary</span>
                <span className="flex items-center gap-2">✔ Hotel Class Choice (3★ to Luxury)</span>
                <span className="flex items-center gap-2">✔ Full Permit & Visa Coordination</span>
              </div>
            </div>

            {/* Right Mini Inquiry Form */}
            <div className="md:col-span-7 bg-white text-charcoal border border-secondary/15 rounded-2xl p-6 shadow-2xl">
              <CountryInquiryForm countryName={country.name} treks={allTreks} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
