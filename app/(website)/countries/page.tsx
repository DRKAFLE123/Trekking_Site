import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaGlobeAsia } from "react-icons/fa";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { getMediaUrl } from "@/lib/cloudinary-loader";

export const revalidate = 300;

// ─────────────────────────────────────────────────────────────────────────
// Defaults — used when the CountriesPageSettings singleton is empty.
// Card images use existing CMS uploads / Unsplash URLs already referenced
// by the per-country /countries/<slug> pages so the look stays consistent.
// ─────────────────────────────────────────────────────────────────────────
const DEFAULTS = {
  heroKicker: "Browse by Country",
  heroTitle: "Choose Your Himalayan Destination",
  heroDescription:
    "Three countries, one Himalaya. Nepal for the legendary Everest and Annapurna circuits, Tibet for the high-altitude monasteries and remote north face, Bhutan for pristine kingdom valleys and Buddhist culture.",
  metaTitle:
    "Trekking Destinations by Country | Nature Heaven Trekking & Expedition",
  metaDescription:
    "Discover private Himalayan trekking experiences across Nepal, Tibet, and Bhutan — three distinct cultures, terrains, and routes curated by native Sherpa guides.",
  ctaKicker: "Cross-border itinerary?",
  ctaTitle: "Multi-country journeys, fully customized",
  ctaDescription:
    "Combine Nepal with Tibet via the Friendship Highway, or pair Bhutan with an Everest base camp trek. Tell us your dream itinerary and we will handle permits, logistics, and the local crew.",
  ctaButtonLabel: "Plan my trip",
  ctaButtonHref: "/plan-a-trip",
};

type CountryCard = {
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  imageUrl: string;
  hide?: boolean;
};

const DEFAULT_COUNTRIES: CountryCard[] = [
  {
    name: "Nepal",
    slug: "nepal",
    tagline: "The Ultimate Trekking Playground",
    description:
      "Home to 8 of the world's 14 highest peaks, including Mt. Everest. Legendary high-altitude trekking, deep cultural roots, and the spiritual heart of Himalayan adventure.",
    imageUrl:
      "https://res.cloudinary.com/dslrn3soo/image/upload/v1782021389/summit-trail-trekking/Welcome_to_the_Himalayan_Kingdom_of_Nepal_pa3fa5.jpg",
  },
  {
    name: "Tibet",
    slug: "tibet",
    tagline: "The Roof of the World",
    description:
      "Ancient monasteries of Lhasa, sacred pilgrimage Kora paths, and the dramatic North Face of Everest. A high-altitude plateau steeped in Buddhist tradition.",
    imageUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600",
  },
  {
    name: "Bhutan",
    slug: "bhutan",
    tagline: "The Last Buddhist Kingdom",
    description:
      "Pristine valleys, fortress monasteries (dzongs), and the sacred Tiger's Nest above Paro. The world's only carbon-negative country, fiercely protective of its culture.",
    imageUrl:
      "https://images.unsplash.com/photo-1578593139888-39622e2077ef?q=80&w=1600",
  },
];

async function fetchPageSettings() {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "countriesPageSettings" as any,
      depth: 2,
      limit: 1,
      overrideAccess: true,
    });
    return (res.docs[0] as any) || null;
  } catch (e: any) {
    console.warn("[Countries Listing] settings fetch failed:", e?.message);
    return null;
  }
}

function resolveCountries(settings: any): CountryCard[] {
  const cmsList: any[] = settings?.countries || [];
  // Filter out hidden + empty rows, and only keep entries that have a slug.
  const fromCms: CountryCard[] = cmsList
    .filter((c) => c && c.slug && !c.hide)
    .map((c) => ({
      name: c.name || c.slug,
      slug: c.slug,
      tagline: c.tagline || undefined,
      description: c.description || undefined,
      imageUrl: getMediaUrl(c.image) || "",
    }));

  if (fromCms.length > 0) {
    // Merge: CMS-supplied wins; fill any blank imageUrl with the matching
    // default's image so a freshly-created CMS row without an upload still
    // renders a card instead of a black square.
    return fromCms.map((c) => {
      if (c.imageUrl) return c;
      const fallback = DEFAULT_COUNTRIES.find((d) => d.slug === c.slug);
      return { ...c, imageUrl: fallback?.imageUrl || "" };
    });
  }
  return DEFAULT_COUNTRIES;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPageSettings();
  return {
    title: settings?.metaTitle || DEFAULTS.metaTitle,
    description: settings?.metaDescription || DEFAULTS.metaDescription,
    alternates: { canonical: "/countries" },
  };
}

export default async function CountriesListingPage() {
  const settings = await fetchPageSettings();

  const heroKicker = settings?.heroKicker || DEFAULTS.heroKicker;
  const heroTitle = settings?.heroTitle || DEFAULTS.heroTitle;
  const heroDescription = settings?.heroDescription || DEFAULTS.heroDescription;
  const heroBgUrl = getMediaUrl(settings?.heroBackgroundImage);

  const ctaKicker = settings?.ctaKicker || DEFAULTS.ctaKicker;
  const ctaTitle = settings?.ctaTitle || DEFAULTS.ctaTitle;
  const ctaDescription = settings?.ctaDescription || DEFAULTS.ctaDescription;
  const ctaButtonLabel = settings?.ctaButtonLabel || DEFAULTS.ctaButtonLabel;
  const ctaButtonHref = settings?.ctaButtonHref || DEFAULTS.ctaButtonHref;

  const countries = resolveCountries(settings);

  return (
    <div className="w-full bg-bgOffWhite">
      {/* Hero */}
      <section className="relative w-full pt-28 md:pt-36 pb-12 md:pb-20 px-4 md:px-6 text-bgOffWhite overflow-hidden bg-primary">
        {heroBgUrl && (
          <Image
            src={heroBgUrl}
            alt={heroTitle}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center z-0"
            unoptimized
          />
        )}
        <div className="absolute inset-0 z-[5] bg-gradient-to-b from-primary/80 via-primary/55 to-primary/85" />

        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full text-secondary/[0.06] pointer-events-none z-[6]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1400 600"
        >
          <defs>
            <pattern
              id="topo-countries"
              patternUnits="userSpaceOnUse"
              width="220"
              height="220"
            >
              <path
                d="M0 110 Q55 70 110 110 T220 110 M0 170 Q55 130 110 170 T220 170 M0 50 Q55 10 110 50 T220 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo-countries)" />
        </svg>

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/30 text-secondary font-bold text-[10px] md:text-xs tracking-[0.25em] uppercase px-4 py-1.5 rounded-full backdrop-blur-sm">
            <FaGlobeAsia />
            <span>{heroKicker}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-black leading-tight max-w-3xl drop-shadow-lg">
            {heroTitle}
          </h1>
          <div className="h-0.5 w-20 bg-secondary mx-auto" />
          <p className="text-sm md:text-base text-bgOffWhite/90 max-w-2xl font-light leading-relaxed drop-shadow">
            {heroDescription}
          </p>
        </div>
      </section>

      {/* 3-card grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        {countries.length === 0 ? (
          <div className="text-center py-16 bg-white border border-secondary/10 rounded-2xl flex flex-col items-center gap-3">
            <span className="text-4xl">🌏</span>
            <h3 className="font-serif font-bold text-lg text-primary">
              No countries configured yet
            </h3>
            <p className="text-xs text-charcoal/70 max-w-sm">
              Add country cards in Admin → Countries Page Settings to populate this page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {countries.map((c) => (
              <Link
                key={c.slug}
                href={`/countries/${c.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-secondary/10 block"
              >
                {c.imageUrl ? (
                  <Image
                    src={c.imageUrl}
                    alt={c.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition duration-700"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center">
                    <span className="font-serif text-bgOffWhite/40 text-5xl">
                      {c.name?.[0] ?? "?"}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 transition-opacity duration-300 group-hover:from-black/95" />

                <div className="absolute inset-x-0 bottom-0 p-7 text-bgOffWhite z-10">
                  {c.tagline && (
                    <span className="block text-secondary uppercase font-bold text-[10px] md:text-xs tracking-[0.25em] mb-2">
                      {c.tagline}
                    </span>
                  )}
                  <h2 className="font-serif text-3xl md:text-4xl font-black tracking-tight group-hover:text-secondary transition">
                    {c.name}
                  </h2>
                  {c.description && (
                    <p className="text-xs md:text-sm text-bgOffWhite/85 mt-3 line-clamp-3 font-light leading-relaxed">
                      {c.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs text-secondary font-bold mt-4 group-hover:gap-3 transition-all duration-300">
                    <span>Explore {c.name}</span>
                    <FaArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-white border-t border-secondary/15 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
          <span className="text-secondary uppercase font-bold text-[10px] md:text-xs tracking-[0.25em]">
            {ctaKicker}
          </span>
          <h3 className="font-serif text-2xl md:text-3xl font-black text-primary leading-tight">
            {ctaTitle}
          </h3>
          <p className="text-sm text-charcoal/70 max-w-xl font-light">
            {ctaDescription}
          </p>
          <Link
            href={ctaButtonHref}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-bgOffWhite hover:text-secondary font-bold px-7 py-3 rounded-xl text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <span>{ctaButtonLabel}</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </section>
    </div>
  );
}
