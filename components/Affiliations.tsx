"use client";

import React from "react";

export default function Affiliations() {
  const associations = [
    { name: "NTB", label: "Nepal Tourism Board", desc: "Government Authority" },
    { name: "NMA", label: "Nepal Mountaineering Association", desc: "Climbing Regulator" },
    { name: "TAAN", label: "Trekking Agencies' Association of Nepal", desc: "Trek Regulator" },
    { name: "KEEP", label: "Kathmandu Environmental Project", desc: "Eco Tourism Partner" },
    { name: "HRA", label: "Himalayan Rescue Association", desc: "Safety & Rescue" },
  ];

  return (
    <section className="py-12 bg-bgOffWhite border-t border-secondary/10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-charcoal/50">
            Registered & Associated With
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:opacity-85 hover:grayscale-0 transition-all duration-500">
          {associations.map((assoc, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center max-w-[150px] group transition duration-300"
            >
              {/* Graphic Logo Silhouette */}
              <div className="h-10 w-10 mb-2 border-2 border-charcoal/30 group-hover:border-primary flex items-center justify-center rounded-lg font-serif font-black text-sm tracking-tighter text-charcoal group-hover:text-primary transition duration-300">
                {assoc.name}
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
