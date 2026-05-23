import React from "react";
import Image from "next/image";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { Trek } from "@/types";
import PlanTripForm from "./PlanTripForm";

export const revalidate = 60; // Revalidate every minute

export default async function PlanATripPage() {
  const payload = await getPayload({ config });
  const treksRes = await payload.find({
    collection: "treks",
    depth: 1,
    limit: 100,
  });

  const treks = treksRes.docs as unknown as Trek[];

  return (
    <div className="w-full min-h-screen bg-bgOffWhite flex flex-col items-center">
      {/* 1. Header Banner */}
      <section className="relative w-full h-[30vh] min-h-[220px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600"
            alt="Alpine Peaks Cover"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-[#1a2e1f]/85 z-10 pointer-events-none" />
        </div>

        <div className="relative z-20 text-center text-bgOffWhite px-6 max-w-4xl flex flex-col gap-2.5">
          <span className="inline-flex items-center gap-1.5 self-center bg-secondary text-primary font-sans font-bold text-[10px] tracking-[0.25em] uppercase px-4 py-1.5 rounded-full border border-secondary/25 shadow-md">
            🗺️ Tailor-Made Himalayan Journeys
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none">
            Plan Your Private Dream Trip
          </h1>
          <p className="font-sans text-xs sm:text-sm md:text-base text-bgOffWhite/90 max-w-xl mx-auto font-light leading-relaxed">
            Tell us your travel style, preferred routes, and schedule. Kafle and our licensed Sherpa experts will customize an itinerary perfect for you.
          </p>
        </div>
      </section>

      {/* 2. Interactive Form Container */}
      <section className="w-full max-w-4xl px-4 sm:px-6 py-12 md:py-16 -mt-10 relative z-25">
        <PlanTripForm treks={treks} />
      </section>
    </div>
  );
}
