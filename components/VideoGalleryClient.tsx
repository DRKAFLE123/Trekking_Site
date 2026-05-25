"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface VideoItem {
  id: string;
  title: string;
  trekName: string;
}

interface VideoGalleryClientProps {
  videos: VideoItem[];
}

export default function VideoGalleryClient({ videos }: VideoGalleryClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll positions to show/hide navigation buttons
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
      // Run once initially
      checkScroll();
      // Watch for window resizing
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [videos]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.95; // Scroll slightly less than full width for nice overlap
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white border-b border-secondary/10">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Watch the Journey
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
            Himalayan Trek Experience
          </h2>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80">
            Get a firsthand look at what it is like to trek through remote mountain passes, local teahouses, and snow-capped peaks with Nature Heaven Trekking &amp; Expedition.
          </p>
        </div>

        {/* Slider View with Prev/Next buttons on desktop */}
        <div className="relative group">
          
          {/* Prev Button (desktop only, shown when scrollable) */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-secondary hover:text-primary text-primary rounded-full shadow-lg flex items-center justify-center transition border border-secondary/20 hover:scale-105 active:scale-95 duration-200 hidden md:flex cursor-pointer"
              aria-label="Previous videos"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* Scrollable Slider */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory gap-6 -mx-4 px-4 md:mx-0 md:px-0"
            style={{
              scrollSnapType: "x mandatory",
            }}
          >
            {videos.map((vid, idx) => (
              <div
                key={idx}
                className="bg-bgOffWhite rounded-xl overflow-hidden border border-secondary/10 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full w-[290px] md:w-[48%] lg:w-[31.5%] shrink-0 snap-align-start"
              >
                {/* Lazy Embedded Player */}
                <div className="aspect-video w-full overflow-hidden bg-black relative shadow-inner">
                  <LiteYouTubeEmbed
                    id={vid.id}
                    title={vid.title}
                    poster="maxresdefault"
                    noCookie={true}
                  />
                </div>

                {/* Title info */}
                <div className="p-4 md:p-5 flex flex-col justify-between grow">
                  <span className="text-[10px] text-secondary font-bold tracking-wider uppercase mb-1.5 block">
                    {vid.trekName}
                  </span>
                  <h3 className="font-serif font-bold text-primary text-sm md:text-base leading-snug line-clamp-2">
                    {vid.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button (desktop only, shown when scrollable) */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-secondary hover:text-primary text-primary rounded-full shadow-lg flex items-center justify-center transition border border-secondary/20 hover:scale-105 active:scale-95 duration-200 hidden md:flex cursor-pointer"
              aria-label="Next videos"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Explore More Button linking to the dedicated Video Gallery page */}
        {videos.length > 3 && (
          <div className="text-center mt-10">
            <Link
              href="/video-gallery"
              className="inline-flex items-center gap-2 text-primary font-bold border-b-2 border-secondary hover:text-secondary transition duration-300 pb-1 cursor-pointer"
            >
              <span>Explore More Videos</span>
              <span className="text-xs">→</span>
            </Link>
          </div>
        )}

        {/* Admin hint */}
        <p className="text-center text-xs text-charcoal/40 mt-8 font-sans">
          Manage videos via{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/admin" className="underline hover:text-secondary transition">
            Admin → Site Settings → Video Gallery
          </a>
        </p>

      </div>
    </section>
  );
}
