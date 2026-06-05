"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaCalendarAlt,
  FaMountain,
  FaRegClock,
  FaRegTimesCircle,
} from "react-icons/fa";

interface VideoItem {
  id: string;
  title: string;
  trekName: string;
  description?: string;
  duration?: string | null;
  maxAltitude?: string | null;
  bestSeason?: string | null;
}

interface VideoGalleryClientProps {
  kicker: string;
  title: string;
  description: string;
  videos: VideoItem[];
}

export default function VideoGalleryClient({
  kicker,
  title,
  description,
  videos,
}: VideoGalleryClientProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeRegion, setActiveRegion] = useState("All Treks");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);

  // Drag-to-scroll carousel state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Extract unique regions dynamically
  const regions = [
    "All Treks",
    ...Array.from(
      new Set(
        videos.map((v) => {
          const name = v.trekName.toLowerCase();
          if (name.includes("everest")) return "Everest Region";
          if (name.includes("annapurna")) return "Annapurna Region";
          if (name.includes("langtang")) return "Langtang Region";
          if (name.includes("manaslu")) return "Manaslu Region";
          if (name.includes("mardi")) return "Annapurna Region"; // Mardi Himal is in Annapurna region
          return v.trekName;
        })
      )
    ),
  ].slice(0, 7); // Limit to 7 pills max

  // Filter videos based on selected region
  const filteredVideos = videos.filter((v) => {
    if (activeRegion === "All Treks") return true;
    const name = v.trekName.toLowerCase();
    const active = activeRegion.toLowerCase();
    if (active.includes("everest") && name.includes("everest")) return true;
    if (active.includes("annapurna") && (name.includes("annapurna") || name.includes("mardi"))) return true;
    if (active.includes("langtang") && name.includes("langtang")) return true;
    if (active.includes("manaslu") && name.includes("manaslu")) return true;
    return v.trekName === activeRegion;
  });

  const activeVideo = filteredVideos[activeIdx] || filteredVideos[0] || videos[0];

  // Sync scroll indicators
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [filteredVideos]);

  // Reset active video index when region changes
  const handleRegionChange = (region: string) => {
    setActiveRegion(region);
    setActiveIdx(0);
  };

  // Drag scroll mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollContainerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.6;
    el.scrollLeft = scrollLeft - walk;
  };

  const scrollCarousel = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Manage body scroll lock during fullscreen modal
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  // Escape key handler to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      className={`py-16 md:py-24 px-4 md:px-6 border-b border-secondary/10 transition-colors duration-500 ${
        isDimmed ? "bg-[#090f0a] text-white" : "bg-[#fcfbfa] text-[#1a2e1f]"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* 1. Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#c8922a] uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            — {kicker} —
          </span>
          <h2
            className={`font-serif text-3xl md:text-5xl font-black mb-4 transition-colors duration-500 ${
              isDimmed ? "text-white" : "text-[#1a2e1f]"
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-sm md:text-base leading-relaxed transition-colors duration-500 ${
              isDimmed ? "text-white/60" : "text-charcoal/80"
            }`}
          >
            Watch{" "}
            <span className="text-[#c8922a] font-bold">real journeys</span>{" "}
            through Nepal&apos;s most iconic mountain trails.
          </p>
        </div>

        {/* 2. Featured Video Story Card */}
        {activeVideo && (
          <div className="relative w-full max-w-5xl mx-auto mb-16 rounded-3xl overflow-hidden shadow-2xl border border-secondary/10 group">
            {/* Aspect Container */}
            <div className="relative w-full min-h-[340px] md:h-[480px] flex flex-col justify-end p-6 md:p-12 z-10">
              {/* Background cover image with heavy overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-100 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://img.youtube.com/vi/${activeVideo.id}/maxresdefault.jpg')`,
                }}
              />
              {/* Custom Dark Gradient Mask for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090f0a] via-[#090f0a]/85 to-transparent md:bg-gradient-to-r md:from-[#090f0a] md:via-[#090f0a]/90 md:to-transparent z-0" />

              {/* Pulsating Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-16 h-16 md:w-20 md:h-20 bg-[#c8922a] hover:bg-[#b07820] text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl relative cursor-pointer"
                >
                  {/* Outer Pulsating Rings */}
                  <span className="absolute inset-0 rounded-full bg-[#c8922a] opacity-35 animate-ping" />
                  <span className="absolute -inset-2 rounded-full border border-white/20 scale-100 hover:scale-110 transition duration-300" />
                  <FaPlay className="text-xl md:text-2xl ml-1.5" />
                </button>
              </div>

              {/* Dim the Lights Switch (Desktop Only) */}
              <div className="absolute top-6 right-6 z-20 hidden md:block">
                <button
                  onClick={() => setIsDimmed(!isDimmed)}
                  className="bg-black/40 hover:bg-[#c8922a] text-white/95 hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition shadow-md flex items-center gap-2 border border-white/10"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDimmed ? "bg-green-400" : "bg-gray-400"
                    }`}
                  />
                  {isDimmed ? "Turn Lights On" : "Dim the Lights"}
                </button>
              </div>

              {/* Story Details Block */}
              <div className="relative z-10 max-w-xl text-left space-y-4">
                <span className="text-[#c8922a] text-[10px] md:text-xs font-black tracking-widest uppercase block mb-1">
                  — FEATURED STORY
                </span>
                <h3 className="font-serif font-black text-2xl md:text-4xl text-white leading-tight">
                  {activeVideo.title}
                </h3>

                {/* Specs Pills (dynamic display) */}
                {(activeVideo.duration ||
                  activeVideo.maxAltitude ||
                  activeVideo.bestSeason) && (
                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 font-medium pt-1">
                    {activeVideo.duration && (
                      <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        <FaRegClock className="text-xs text-[#c8922a]" />{" "}
                        {activeVideo.duration}
                      </span>
                    )}
                    {activeVideo.maxAltitude && (
                      <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        <FaMountain className="text-xs text-[#c8922a]" />{" "}
                        {activeVideo.maxAltitude}
                      </span>
                    )}
                    {activeVideo.bestSeason && (
                      <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        <FaCalendarAlt className="text-xs text-[#c8922a]" />{" "}
                        {activeVideo.bestSeason}
                      </span>
                    )}
                  </div>
                )}

                {/* Video Description */}
                {activeVideo.description && (
                  <p className="text-white/70 text-xs md:text-sm leading-relaxed line-clamp-3">
                    {activeVideo.description}
                  </p>
                )}

                {/* Button Action */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="bg-[#c8922a] hover:bg-[#b07820] text-white font-bold py-3 px-6 rounded-xl text-xs md:text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span className="flex items-center justify-center w-5 h-5 bg-white/20 rounded-full">
                      <FaPlay className="text-[8px] ml-0.5" />
                    </span>
                    Watch Full Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Trek Stories Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-secondary/10 pt-10 pb-8 gap-6">
          {/* Section Heading */}
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-8 bg-[#c8922a]" />
            <h3
              className={`font-serif text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${
                isDimmed ? "text-white" : "text-[#1a2e1f]"
              }`}
            >
              TREK STORIES
            </h3>
          </div>

          {/* Region Pills and Scroll Buttons */}
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 max-w-full">
            <div className="flex gap-2">
              {regions.map((reg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRegionChange(reg)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeRegion === reg
                      ? "bg-[#1a2e1f] text-white border border-[#1a2e1f]"
                      : isDimmed
                      ? "bg-white/5 hover:bg-white/15 text-white/80 border border-white/10"
                      : "bg-white hover:bg-bgOffWhite text-charcoal/80 border border-secondary/20"
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            {/* Nav Arrows (Desktop Only) */}
            {filteredVideos.length > 3 && (
              <div className="hidden md:flex items-center gap-1.5 shrink-0 pl-2">
                <button
                  onClick={() => scrollCarousel("left")}
                  disabled={!canScrollLeft}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed ${
                    isDimmed
                      ? "border-white/10 hover:bg-white/10 text-white"
                      : "border-secondary/20 hover:bg-bgOffWhite text-primary"
                  }`}
                >
                  <FaChevronLeft className="text-xs" />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  disabled={!canScrollRight}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed ${
                    isDimmed
                      ? "border-white/10 hover:bg-white/10 text-white"
                      : "border-secondary/20 hover:bg-bgOffWhite text-primary"
                  }`}
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Drag / Swipe Indicator */}
        <p className="text-left text-[10px] text-[#c8922a] font-bold tracking-widest uppercase mb-4 opacity-70">
          ← Drag / Swipe To Explore →
        </p>

        {/* 4. Horizontal Slider Carousel */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-none cursor-grab active:cursor-grabbing ${
              isDragging ? "select-none" : ""
            }`}
          >
            {filteredVideos.map((vid, idx) => {
              const isSelected = activeVideo.id === vid.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => !isDragging && setActiveIdx(idx)}
                  className={`flex-none w-[270px] md:w-[320px] snap-align-start rounded-2xl overflow-hidden shadow-md border transition-all duration-300 ${
                    isSelected
                      ? "border-[#c8922a] ring-2 ring-[#c8922a]/30 scale-[0.98]"
                      : isDimmed
                      ? "border-white/10 bg-white/5 hover:bg-white/10 hover:-translate-y-1"
                      : "border-secondary/10 bg-white hover:shadow-lg hover:-translate-y-1"
                  }`}
                >
                  {/* Thumbnail Card with Play Overlay */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black select-none pointer-events-none">
                    {/* Cover backdrop */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Shadow bottom gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Centered play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-80">
                      <div className="w-10 h-10 bg-white/25 backdrop-blur-sm hover:bg-white/40 text-white rounded-full flex items-center justify-center transition border border-white/25">
                        <FaPlay className="text-[10px] ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                      <span className="text-[#c8922a] text-[9px] font-black uppercase tracking-wider block mb-1">
                        {vid.trekName}
                      </span>
                      <h4 className="text-white text-xs md:text-sm font-bold leading-snug line-clamp-2">
                        {vid.title}
                      </h4>
                      {/* Sub specs */}
                      {(vid.duration || vid.maxAltitude) && (
                        <div className="flex gap-2.5 text-[10px] text-white/70 font-semibold mt-1">
                          {vid.duration && <span>{vid.duration}</span>}
                          {vid.maxAltitude && <span>{vid.maxAltitude}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots Indicator */}
        {filteredVideos.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {filteredVideos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIdx === idx
                    ? "w-6 bg-[#c8922a]"
                    : isDimmed
                    ? "w-2 bg-white/20 hover:bg-white/40"
                    : "w-2 bg-[#1a2e1f]/20 hover:bg-[#1a2e1f]/45"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* 5. Explore More Stories Footer Button */}
        <div className="text-center mt-12">
          <Link
            href="/video-gallery"
            className={`inline-flex items-center gap-2 border px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm cursor-pointer ${
              isDimmed
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                : "bg-white border-secondary/20 hover:bg-[#1a2e1f] hover:text-white text-[#1a2e1f]"
            }`}
          >
            Explore More Stories →
          </Link>
        </div>
      </div>

      {/* Cinematic Fullscreen Lightbox Modal */}
      {isLightboxOpen && activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
          {/* Escape close handle overlay */}
          <div
            className="absolute inset-0 z-0 cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          />

          <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
            {/* Header info */}
            <div className="w-full flex items-center justify-between text-white mb-4">
              <div className="text-left">
                <span className="text-[#c8922a] text-xs font-bold uppercase tracking-wider">
                  {activeVideo.trekName}
                </span>
                <h4 className="font-serif text-lg md:text-xl font-bold line-clamp-1">
                  {activeVideo.title}
                </h4>
              </div>
              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="text-white/60 hover:text-white hover:scale-110 transition duration-200 text-3xl cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <FaRegTimesCircle />
              </button>
            </div>

            {/* Video container */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
              <LiteYouTubeEmbed
                id={activeVideo.id}
                title={activeVideo.title}
                poster="maxresdefault"
                noCookie={true}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
