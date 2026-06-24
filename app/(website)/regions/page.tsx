import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaMapMarkedAlt } from "react-icons/fa";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { Region } from "@/types";
import { getMediaUrl } from "@/lib/cloudinary-loader";

export const revalidate = 300;

// ─────────────────────────────────────────────────────────────────────────
// Defaults — used when no CMS row exists yet, so the page never breaks.
// ─────────────────────────────────────────────────────────────────────────
const DEFAULTS = {
  heroKicker: "Explore by Region",
  heroTitle: "Trekking Regions of the Himalayas",
  heroDescription:
    "From the iconic Everest and Annapurna massifs to remote, restricted areas like Upper Mustang and Dolpa — pick the terrain that matches your ambition.",
  metaTitle: "Trekking Regions of the Himalayas | Nature Heaven Trekking & Expedition",
  metaDescription:
    "Browse every Himalayan trekking region we operate in — Everest, Annapurna, Manaslu, Langtang, Mustang, Dolpa, Makalu, Kanchenjunga, and more. Pick your terrain.",
  ctaKicker: "Not sure where to go?",
  ctaTitle: "Let our Sherpa team build you a custom itinerary",
  ctaDescription:
    "Every region has its own character — best season, difficulty, permits, altitude schedule. Tell us what you want and we'll design the trip around you.",
  ctaButtonLabel: "Plan my trip",
  ctaButtonHref: "/plan-a-trip",
};

type RegionWithCount = Region & {
  country?: string;
  trekCount: number;
  coverImageUrl: string | null;
};

const COUNTRY_LABEL: Record<string, string> = {
  nepal: "Nepal",
  tibet: "Tibet",
  bhutan: "Bhutan",
};

const COUNTRY_ORDER: Array<keyof typeof COUNTRY_LABEL> = ["nepal", "tibet", "bhutan"];

async function fetchPageSettings() {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "regionsPageSettings" as any,
      depth: 1,
      limit: 1,
      overrideAccess: true,
    });
    return (res.docs[0] as any) || null;
  } catch (e: any) {
    console.warn("[Regions Listing] settings fetch failed:", e?.message);
    return null;
  }
}

async function fetchRegionsWithCounts(): Promise<RegionWithCount[]> {
  try {
    const payload = await getPayload({ config });
    const [regionsRes, treksRes] = await Promise.all([
      payload.find({
        collection: "regions",
        depth: 1,
        limit: 100,
        overrideAccess: true,
      }),
      payload.find({
        collection: "treks",
        depth: 0,
        limit: 500,
        overrideAccess: true,
      }),
    ]);
    const counts = new Map<string | number, number>();
    for (const t of treksRes.docs as any[]) {
      const regionId = typeof t.region === "object" ? t.region?.id : t.region;
      if (regionId == null) continue;
      counts.set(regionId, (counts.get(regionId) ?? 0) + 1);
    }
    return (regionsRes.docs as unknown as Region[]).map((r) => ({
      ...r,
      country: (r as any).country ?? "nepal",
      trekCount: counts.get((r as any).id) ?? 0,
      coverImageUrl: getMediaUrl((r as any).coverImage) ?? null,
    }));
  } catch (e) {
    console.warn("[Regions Listing] fetch failed:", (e as any)?.message);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPageSettings();
  return {
    title: settings?.metaTitle || DEFAULTS.metaTitle,
    description: settings?.metaDescription || DEFAULTS.metaDescription,
    alternates: { canonical: "/regions" },
  };
}

export default async function RegionsListingPage() {
  const [settings, regions] = await Promise.all([
    fetchPageSettings(),
    fetchRegionsWithCounts(),
  ]);

  const heroKicker = settings?.heroKicker || DEFAULTS.heroKicker;
  const heroTitle = settings?.heroTitle || DEFAULTS.heroTitle;
  const heroDescription = settings?.heroDescription || DEFAULTS.heroDescription;
  const heroBgUrl = getMediaUrl(settings?.heroBackgroundImage);

  const ctaKicker = settings?.ctaKicker || DEFAULTS.ctaKicker;
  const ctaTitle = settings?.ctaTitle || DEFAULTS.ctaTitle;
  const ctaDescription = settings?.ctaDescription || DEFAULTS.ctaDescription;
  const ctaButtonLabel = settings?.ctaButtonLabel || DEFAULTS.ctaButtonLabel;
  const ctaButtonHref = settings?.ctaButtonHref || DEFAULTS.ctaButtonHref;

  // Group regions by country in a stable order. CMS controls within-country
  // ordering through Region creation order.
  const grouped = new Map<string, RegionWithCount[]>();
  for (const r of regions) {
    const key = (r.country ?? "nepal").toLowerCase();
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(r);
  }
  const orderedCountries: string[] = [
    ...COUNTRY_ORDER.filter((c) => grouped.has(c)),
    ...[...grouped.keys()].filter((c) => !COUNTRY_ORDER.includes(c as any)),
  ];

  return (
    <div className="w-full bg-bgOffWhite">
      {/* Hero header */}
      <section className="relative w-full pt-28 md:pt-36 pb-12 md:pb-20 px-4 md:px-6 text-bgOffWhite overflow-hidden bg-primary">
        {/* CMS background image (if set) */}
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
        {/* Dark gradient overlay over the image so text stays legible */}
        <div className="absolute inset-0 z-[5] bg-gradient-to-b from-primary/80 via-primary/55 to-primary/85" />

        {/* Subtle topo decoration */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full text-secondary/[0.06] pointer-events-none z-[6]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1400 600"
        >
          <defs>
            <pattern id="topo-regions" patternUnits="userSpaceOnUse" width="220" height="220">
              <path
                d="M0 110 Q55 70 110 110 T220 110 M0 170 Q55 130 110 170 T220 170 M0 50 Q55 10 110 50 T220 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo-regions)" />
        </svg>

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/30 text-secondary font-bold text-[10px] md:text-xs tracking-[0.25em] uppercase px-4 py-1.5 rounded-full backdrop-blur-sm">
            <FaMapMarkedAlt />
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

      {/* Grouped regions grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col gap-16">
        {regions.length === 0 ? (
          <div className="text-center py-16 bg-white border border-secondary/10 rounded-2xl flex flex-col items-center gap-3">
            <span className="text-4xl">🏔️</span>
            <h3 className="font-serif font-bold text-lg text-primary">
              No regions configured yet
            </h3>
            <p className="text-xs text-charcoal/70 max-w-sm">
              Add regions in the admin to populate this page. Falls back gracefully when empty.
            </p>
            <Link
              href="/trips"
              className="bg-secondary text-primary font-bold px-5 py-2 rounded-xl text-xs hover:scale-105 active:scale-95 transition"
            >
              Browse all treks instead
            </Link>
          </div>
        ) : (
          orderedCountries.map((country) => {
            const list = grouped.get(country) ?? [];
            const label =
              COUNTRY_LABEL[country] ?? country.charAt(0).toUpperCase() + country.slice(1);
            return (
              <div key={country} className="flex flex-col gap-6">
                {/* Country heading */}
                <div className="flex items-end justify-between gap-4 border-b border-secondary/15 pb-3">
                  <div>
                    <span className="text-secondary uppercase font-bold text-[10px] md:text-xs tracking-[0.25em]">
                      {label}
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl font-black text-primary mt-1">
                      Regions in {label}
                    </h2>
                  </div>
                  <span className="text-xs text-charcoal/60 font-light">
                    {list.length} {list.length === 1 ? "region" : "regions"}
                  </span>
                </div>

                {/* Card grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {list.map((region) => (
                    <Link
                      key={region.slug}
                      href={`/regions/${region.slug}`}
                      className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-secondary/10 block"
                    >
                      {region.coverImageUrl ? (
                        <Image
                          src={region.coverImageUrl}
                          alt={region.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center">
                          <span className="font-serif text-bgOffWhite/40 text-3xl">
                            {region.name?.[0] ?? "?"}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/95" />

                      <div className="absolute top-4 right-4 bg-secondary text-primary font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                        {region.trekCount} {region.trekCount === 1 ? "trek" : "treks"}
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-6 text-bgOffWhite z-10">
                        <h3 className="font-serif text-2xl md:text-3xl font-black tracking-tight group-hover:text-secondary transition">
                          {region.name}
                        </h3>
                        {region.description && (
                          <p className="text-xs text-bgOffWhite/80 mt-2 line-clamp-3 font-light leading-relaxed">
                            {region.description}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-xs text-secondary font-bold mt-3 group-hover:gap-3 transition-all duration-300">
                          <span>Explore Region</span>
                          <FaArrowRight />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
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
