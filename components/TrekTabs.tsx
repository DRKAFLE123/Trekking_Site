"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FaCheck, FaTimes, FaMapMarkerAlt, FaBed, FaUtensils, FaTachometerAlt, FaChevronDown, FaImages, FaInfoCircle, FaFileAlt } from "react-icons/fa";
import { Trek } from "@/types";
import { renderLexical } from "@/lib/lexical-renderer";

// Load Leaflet Map dynamically to prevent window is not defined errors in SSR
const TrekMap = dynamic(() => import("./TrekMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-primary/5 rounded-2xl flex items-center justify-center text-primary/60 font-medium">
      Loading interactive route map...
    </div>
  ),
});

interface TrekTabsProps {
  trek: Trek;
}

export default function TrekTabs({ trek }: TrekTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "inc-exc" | "map" | "gallery">("overview");
  
  // Accordion state for itinerary days
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({ 1: true });
  
  // Lightbox gallery state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const {
    overview,
    highlights,
    dayByDayItinerary,
    inclusions,
    exclusions,
    gallery,
    gpsCoordinates,
    region,
  } = trek;

  // Safe normalization of lists/arrays from Payload to match string[]
  const highlightsList = highlights?.map((h: any) => typeof h === "string" ? h : h?.highlight).filter(Boolean) || [];
  const inclusionsList = inclusions?.map((i: any) => typeof i === "string" ? i : i?.inclusion).filter(Boolean) || [];
  const exclusionsList = exclusions?.map((e: any) => typeof e === "string" ? e : e?.exclusion).filter(Boolean) || [];
  const galleryList = gallery?.map((g: any) => typeof g === "string" ? g : g?.image).filter(Boolean) || [];

  // Toggle single day accordion
  const toggleDay = (dayNum: number) => {
    setOpenDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  // Expand all days
  const expandAllDays = () => {
    const allOpen: Record<number, boolean> = {};
    dayByDayItinerary?.forEach((day) => {
      allOpen[day.day] = true;
    });
    setOpenDays(allOpen);
  };

  // Collapse all days
  const collapseAllDays = () => {
    setOpenDays({});
  };


  const tabs = [
    { id: "overview", label: "Overview", icon: <FaInfoCircle /> },
    { id: "itinerary", label: "Itinerary", icon: <FaFileAlt /> },
    { id: "inc-exc", label: "Inclusions", icon: <FaCheck /> },
    { id: "map", label: "Route Map", icon: <FaMapMarkerAlt /> },
    { id: "gallery", label: "Gallery", icon: <FaImages /> },
  ] as const;

  return (
    <div className="w-full flex flex-col gap-6 bg-white border border-secondary/10 shadow-lg rounded-2xl p-6 md:p-8">
      {/* Tab Buttons */}
      <div className="flex border-b border-secondary/15 overflow-x-auto pb-px gap-2 scrollbar-none shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-sans font-bold text-sm transition-all whitespace-nowrap focus:outline-none ${
              activeTab === tab.id
                ? "border-secondary text-primary bg-secondary/5 rounded-t-xl"
                : "border-transparent text-charcoal/70 hover:text-primary hover:border-charcoal/20"
            }`}
          >
            <span className="text-secondary">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        
        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Rich text overview */}
            <div className="prose prose-emerald max-w-none">
              {renderLexical(overview)}
            </div>

            {/* Highlights bullet list */}
            {highlightsList.length > 0 && (
              <div className="bg-bgOffWhite/40 border border-secondary/10 rounded-2xl p-6 md:p-8">
                <h3 className="font-serif font-bold text-primary text-lg md:text-xl mb-4 flex items-center gap-2">
                  <span className="text-secondary text-base">🏔️</span> Trip Highlights
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlightsList.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-charcoal/90">
                      <span className="text-secondary mt-1 shrink-0">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Day-by-Day Itinerary */}
        {activeTab === "itinerary" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Expand / Collapse Controls */}
            <div className="flex items-center justify-end gap-3 border-b border-primary/5 pb-3">
              <button onClick={expandAllDays} className="text-xs font-bold text-primary hover:underline">
                Expand All
              </button>
              <span className="h-3 w-px bg-primary/20"></span>
              <button onClick={collapseAllDays} className="text-xs font-bold text-primary hover:underline">
                Collapse All
              </button>
            </div>

            {/* Itinerary Accordion List */}
            <div className="flex flex-col gap-4">
              {dayByDayItinerary?.map((day, idx) => {
                const isOpen = !!openDays[day.day];

                return (
                  <div
                    key={idx}
                    className="border border-secondary/15 rounded-xl bg-white overflow-hidden shadow-sm transition-all duration-300"
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleDay(day.day)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-bgOffWhite/20 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="bg-secondary text-primary font-black font-sans text-xs px-2.5 py-1 rounded-lg">
                          DAY {day.day}
                        </span>
                        <span className="font-serif font-bold text-primary text-sm md:text-base group-hover:text-secondary transition duration-300 pr-4">
                          {day.title}
                        </span>
                      </div>
                      <span className={`p-1 rounded-full bg-primary/5 text-secondary transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180 bg-secondary/10" : ""
                      }`}>
                        <FaChevronDown className="h-3 w-3" />
                      </span>
                    </button>

                    {/* Content */}
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[500px] border-t border-secondary/10" : "max-h-0"
                    }`}>
                      <div className="px-5 py-5 bg-bgOffWhite/30 flex flex-col gap-4">
                        <p className="text-sm md:text-base text-charcoal/80 leading-relaxed">
                          {day.description}
                        </p>

                        {/* Specs row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-primary/5 text-xs text-charcoal/70">
                          {day.altitude && (
                            <div className="flex items-center gap-2">
                              <FaTachometerAlt className="text-secondary shrink-0" />
                              <span>Alt: <strong className="text-primary font-semibold">{day.altitude}m</strong></span>
                            </div>
                          )}
                          {day.distance && (
                            <div className="flex items-center gap-2">
                              <FaMapMarkerAlt className="text-secondary shrink-0" />
                              <span>Dist: <strong className="text-primary font-semibold">{day.distance}</strong></span>
                            </div>
                          )}
                          {day.accommodation && (
                            <div className="flex items-center gap-2">
                              <FaBed className="text-secondary shrink-0" />
                              <span>Lodging: <strong className="text-primary font-semibold">{day.accommodation.split("/")[0]}</strong></span>
                            </div>
                          )}
                          {day.meals && (
                            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                              <FaUtensils className="text-secondary shrink-0" />
                              <span>Meals: <strong className="text-primary font-semibold">{day.meals}</strong></span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Inclusions & Exclusions */}
        {activeTab === "inc-exc" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start animate-fade-in">
            {/* Inclusions */}
            <div className="bg-green-50/30 border border-green-200/50 rounded-2xl p-6 md:p-8 flex flex-col gap-4">
              <h3 className="font-serif font-bold text-green-950 text-lg md:text-xl border-b border-green-200/50 pb-2.5 flex items-center gap-2">
                <span className="p-1 rounded-full bg-green-100 text-green-600"><FaCheck className="h-3.5 w-3.5" /></span>
                <span>Included in Price</span>
              </h3>
              <ul className="flex flex-col gap-3.5">
                {inclusionsList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-charcoal/80 leading-relaxed">
                    <span className="text-green-600 mt-1 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="bg-red-50/20 border border-red-200/30 rounded-2xl p-6 md:p-8 flex flex-col gap-4">
              <h3 className="font-serif font-bold text-red-950 text-lg md:text-xl border-b border-red-200/30 pb-2.5 flex items-center gap-2">
                <span className="p-1 rounded-full bg-red-100 text-red-500"><FaTimes className="h-3.5 w-3.5" /></span>
                <span>Excluded from Cost</span>
              </h3>
              <ul className="flex flex-col gap-3.5">
                {exclusionsList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-charcoal/85 leading-relaxed">
                    <span className="text-red-500 mt-1 shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Route Map (Leaflet) */}
        {activeTab === "map" && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {gpsCoordinates && gpsCoordinates.length > 0 ? (
              <TrekMap waypoints={gpsCoordinates} center={region?.mapCenter} />
            ) : (
              <div className="w-full h-[400px] bg-primary/5 rounded-xl border border-secondary/20 flex items-center justify-center text-primary/60 font-medium">
                No route coordinate data found for this trip.
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Gallery (Grid with Lightbox) */}
        {activeTab === "gallery" && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {galleryList.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryList.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className="relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-primary/10 border border-secondary/15 hover:scale-102 hover:shadow-lg active:scale-98 transition duration-300"
                  >
                    <Image
                      src={img}
                      alt={`${trek.title} gallery photo ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition duration-300"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-[400px] bg-primary/5 rounded-xl border border-secondary/20 flex items-center justify-center text-primary/60 font-medium">
                No gallery images found for this trip.
              </div>
            )}

            {/* Fullscreen Lightbox Modal */}
            {lightboxIndex !== null && galleryList.length > 0 && (
              <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
                {/* Close Button */}
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="absolute top-6 right-6 text-white hover:text-secondary p-2 z-50 focus:outline-none"
                  aria-label="Close Gallery Lightbox"
                >
                  <FaTimes className="h-8 w-8" />
                </button>

                {/* Lightbox Content Container */}
                <div className="relative w-full max-w-4xl aspect-video max-h-[80vh] flex items-center justify-center select-none">
                  {/* Prev Button */}
                  {lightboxIndex > 0 && (
                    <button
                      onClick={() => setLightboxIndex((prev) => (prev !== null ? prev - 1 : null))}
                      className="absolute left-4 text-white hover:text-secondary p-4 z-50 bg-black/40 hover:bg-black/80 rounded-full focus:outline-none font-sans font-bold text-xl md:text-3xl"
                    >
                      ‹
                    </button>
                  )}

                  {/* Image */}
                  <div className="relative w-full h-full">
                    <Image
                      src={galleryList[lightboxIndex]}
                      alt="Lightbox visual"
                      fill
                                className="object-contain"
                      sizes="100vw"
                    />
                  </div>

                  {/* Next Button */}
                  {lightboxIndex < galleryList.length - 1 && (
                    <button
                      onClick={() => setLightboxIndex((prev) => (prev !== null ? prev + 1 : null))}
                      className="absolute right-4 text-white hover:text-secondary p-4 z-50 bg-black/40 hover:bg-black/80 rounded-full focus:outline-none font-sans font-bold text-xl md:text-3xl"
                    >
                      ›
                    </button>
                  )}
                </div>

                {/* Counter */}
                <div className="absolute bottom-6 text-white/70 text-xs font-semibold">
                  Photo {lightboxIndex + 1} of {galleryList.length}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
