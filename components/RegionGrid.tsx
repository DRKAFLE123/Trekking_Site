"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Region } from "@/types";
import { getMediaUrl } from "@/lib/cloudinary-loader";

interface RegionGridProps {
  regions: Region[];
}

export default function RegionGrid({ regions }: RegionGridProps) {
  // Fallback regions if database is empty - added Dolpo and Makalu Region
  const defaultRegions = [
    { name: "Everest Region", slug: "everest-region", coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600", description: "Home to Mt. Everest and historic Sherpa villages." },
    { name: "Annapurna Region", slug: "annapurna-region", coverImage: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=600", description: "Stunning diverse landscapes and rich Gurung culture." },
    { name: "Langtang Region", slug: "langtang-region", coverImage: "https://images.unsplash.com/photo-1627894481078-43d9972c49ee?q=80&w=600", description: "Beautiful valley of glaciers nearest to Kathmandu." },
    { name: "Manaslu Region", slug: "manaslu-region", coverImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600", description: "Pristine, restricted wilderness trekking circuit." },
    { name: "Mustang Region", slug: "mustang-region", coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600", description: "Arid high-altitude deserts and ancient caves." },
    { name: "Kanchanjunga Region", slug: "kanchanjunga-region", coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600", description: "Remote eastern giants bordering India." },
    { name: "Dolpo Region", slug: "dolpo-region", coverImage: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=600", description: "Shey Phoksundo lake and ancient Tibetan culture." },
    { name: "Makalu Region", slug: "makalu-region", coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600", description: "Home to the world's fifth highest peak and pristine wilderness." }
  ];

  // Merge database regions and default fallback regions (preventing duplicate entries)
  const dbSlugs = new Set((regions || []).map(r => r.slug.toLowerCase()));
  const mergedRegions = [
    ...(regions || []),
    ...defaultRegions.filter(d => {
      const cleanSlug = d.slug.toLowerCase().replace("-region", "");
      return !dbSlugs.has(d.slug.toLowerCase()) && !dbSlugs.has(cleanSlug);
    })
  ];

  const displayRegions = mergedRegions.slice(0, 8) as unknown as Region[];

  // Safely resolve the coverImage strings for standard Next.js <Image> rendering
  const resolvedRegions = displayRegions.map((region) => {
    const rawImage = getMediaUrl(region.coverImage);
    const coverImage = rawImage || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600";
    return {
      ...region,
      coverImage
    };
  });

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Destinations
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
            Explore Trekking Regions
          </h2>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80">
            Discover the unique cultures, diverse landscapes, and epic trekking trails across the major regions of the Nepal Himalayas.
          </p>
        </div>

        {/* 4-Column Grid (Slider on mobile, standard grid on desktop) */}
        <div className="flex overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {resolvedRegions.map((region, idx) => (
            <div key={region.slug || idx} className="w-[260px] sm:w-auto shrink-0 snap-align-start flex">
              <Link
                href={`/regions/${region.slug}`}
                className="group relative h-[320px] w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 block border border-secondary/10"
              >
                {/* Full bleed image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={region.coverImage || "/general/placeholder.jpg"}
                    alt={region.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition duration-700"
                  />
                  {/* Dark name overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
                </div>

                {/* Text overlays */}
                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end text-bgOffWhite">
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-serif text-2xl font-bold text-bgOffWhite tracking-wide group-hover:text-secondary transition-colors duration-300">
                      {region.name}
                    </h3>
                    {region.description && (
                      <p className="text-xs text-bgOffWhite/80 mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-sans font-light">
                        {region.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs text-secondary font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      <span>Explore Treks</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
