"use client";

import React from "react";
import Image from "next/image";

export default function Affiliations() {
  const associations = [
    { name: "NTB", label: "Nepal Tourism Board", logo: "/ntb.webp", desc: "Government Authority" },
    { name: "NMA", label: "Nepal Mountaineering Association", logo: "/nma.webp", desc: "Climbing Regulator" },
    { name: "GOV", label: "Ministry of Tourism", logo: "/nepal-gov.webp", desc: "Government of Nepal" },
    { name: "TAAN", label: "Trekking Agencies' Association of Nepal", logo: "/taan.webp", desc: "Trek Regulator" },
    { name: "KEEP", label: "Kathmandu Environmental Project", logo: "/keep.webp", desc: "Eco Tourism Partner" },
    { name: "HRA", label: "Himalayan Rescue Association", logo: "/himalayan-rescue-association.webp", desc: "Safety & Rescue" },
  ];

  return (
    <section className="py-16 bg-bgOffWhite border-t border-secondary/10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-2 block">
            Government Registered
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">
            We are associated with
          </h2>
          <div className="h-0.5 w-12 bg-secondary mx-auto mt-3"></div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          {associations.map((assoc, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center max-w-[150px] group transition duration-300"
            >
              {/* Graphic Logo Image */}
              <div className="relative h-16 w-28 mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={assoc.logo}
                  alt={`${assoc.name} Logo`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-[11px] font-sans font-bold text-charcoal group-hover:text-primary transition duration-300 leading-tight">
                {assoc.label}
              </span>
              <span className="text-[9px] text-charcoal/60 mt-0.5 leading-none">
                {assoc.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
