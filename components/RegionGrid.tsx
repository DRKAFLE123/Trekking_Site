"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Region } from "@/types";
import { motion } from "framer-motion";

interface RegionGridProps {
  regions: Region[];
}

export default function RegionGrid({ regions }: RegionGridProps) {
  // Fallback regions if database is empty
  const defaultRegions = [
    { name: "Everest Region", slug: "everest-region", coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600" },
    { name: "Annapurna Region", slug: "annapurna-region", coverImage: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=600" },
    { name: "Langtang Region", slug: "langtang-region", coverImage: "https://images.unsplash.com/photo-1627894481078-43d9972c49ee?q=80&w=600" },
    { name: "Manaslu Region", slug: "manaslu-region", coverImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600" },
    { name: "Mustang Region", slug: "mustang-region", coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600" },
    { name: "Kanchanjunga Region", slug: "kanchanjunga-region", coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600" },
  ];

  const displayRegions = regions && regions.length > 0 ? regions.slice(0, 6) : defaultRegions as unknown as Region[];

  return (
    <section className="py-24 px-6 bg-white">
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

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayRegions.map((region, idx) => (
            <Link
              key={region.slug || idx}
              href={`/regions/${region.slug}`}
              className="group relative h-[320px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 block border border-secondary/10"
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
          ))}
        </div>
      </div>
    </section>
  );
}
