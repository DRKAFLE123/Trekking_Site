"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getMediaUrl } from "@/lib/cloudinary-loader";

interface GalleryItem {
  id: string | number;
  title: string;
  image: any;
  caption?: string;
  trek?: any;
}

interface PhotoGalleryProps {
  items: GalleryItem[];
  limit?: number;
  showViewAll?: boolean;
  variant?: "masonry" | "messy-grid";
}

// Fallback gallery for when the database gallery is empty
const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: "f1",
    title: "Summit Joy at Everest Base Camp",
    image: "/gallery/happy_face1.png",
    caption: "Standing at 5,364m — a dream realized.",
  },
  {
    id: "f2",
    title: "Namche Bazaar Morning Mist",
    image: "/gallery/happy_face2.png",
    caption: "The gateway to Everest glows in golden hour.",
  },
  {
    id: "f3",
    title: "Annapurna Panorama",
    image: "/gallery/happy_face3.png",
    caption: "8,000m peaks stretching to the horizon.",
  },
  {
    id: "f4",
    title: "Thorong La Pass Summit",
    image: "/gallery/happy_face4.png",
    caption: "5,416m — the world's highest mountain pass crossing.",
  },
  {
    id: "f5",
    title: "Gokyo Lakes Reflections",
    image: "/gallery/happy_face5.png",
    caption: "Turquoise glacial lakes beneath the giants.",
  },
  {
    id: "f6",
    title: "Manaslu Circuit View",
    image: "/gallery/happy_face6.png",
    caption: "Remote trails through pristine Himalayan wilderness.",
  },
  {
    id: "f7",
    title: "Happy Hikers, Happy Hearts",
    image: "/gallery/happy_face7.png",
    caption: "Smiles that summit gives you — priceless.",
  },
  {
    id: "f8",
    title: "Sherpa Culture & Community",
    image: "/gallery/happy_face8.png",
    caption: "Authentic Himalayan hospitality in every teahouse.",
  },
  {
    id: "f9",
    title: "Prayer Flags in the Wind",
    image: "https://images.unsplash.com/photo-1471623320832-752e8bbf8413?q=80&w=800",
    caption: "Colors dancing with blessings at every high pass.",
  },
  {
    id: "f10",
    title: "Sunrise over the Himalayas",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800",
    caption: "Dawn breaks over the world's highest peaks.",
  },
  {
    id: "f11",
    title: "Trail Through Rhododendron Forest",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
    caption: "Spring blossoms light the path to the mountains.",
  },
  {
    id: "f12",
    title: "Group Summit Photo",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800",
    caption: "Celebrating together at the top of the world.",
  },
];

// A wrapper around Next.js Image that falls back to a high-quality Unsplash image if the local file is missing on disk (returns 500/404)
const SafeImage = ({ src, alt, className, fill, width, height, unoptimized }: any) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      fill={fill}
      width={width}
      height={height}
      unoptimized={unoptimized}
      onError={() => {
        // Fallback to high-quality unsplash trekking photo if file is missing/broken on disk
        setImgSrc("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600");
      }}
    />
  );
};

export default function PhotoGalleryMasonry({ items, limit, showViewAll, variant }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use backend items if available, otherwise show beautiful fallback gallery
  const sourceItems = items && items.length > 0 ? items : FALLBACK_GALLERY;

  // Resolved clean list of images
  const resolvedItems = sourceItems.map((item) => {
    const rawUrl = getMediaUrl(item.image);
    // If image is already a URL string (fallback items), use it directly
    const imageUrl = rawUrl || (typeof item.image === "string" ? item.image : "") || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600";
    return {
      ...item,
      imageUrl,
    };
  });

  const displayItems = limit ? resolvedItems.slice(0, limit) : resolvedItems;
  const activeVariant = variant || (limit === 6 ? "messy-grid" : "masonry");

  const openLightbox = (idx: number) => {
    setPhotoIndex(idx);
    setLightboxOpen(true);
  };

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const children = Array.from(el.children);
    let closestIndex = 0;
    let minDiff = Infinity;
    children.forEach((child, idx) => {
      const diff = Math.abs((child as HTMLElement).offsetLeft - el.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
    setActiveIndex(closestIndex);
  };

  return (
    <section className={`py-16 md:py-24 px-4 md:px-6 overflow-hidden relative border-t transition-all duration-300 ${
      activeVariant === "messy-grid"
        ? "bg-[#10251c] border-white/5 text-white"
        : "bg-[#fcfbfa] border-secondary/10 text-primary"
    }`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Happy Moments
          </span>
          <h2 className={`font-serif text-3xl md:text-5xl font-bold mb-4 ${
            activeVariant === "messy-grid" ? "text-white" : "text-primary"
          }`}>
            A Global Happy Family
          </h2>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className={`text-sm md:text-base font-sans ${
            activeVariant === "messy-grid" ? "text-bgOffWhite/80" : "text-charcoal/80"
          }`}>
            Capturing the raw joy, beautiful summits, and unforgettable shared stories of hikers who stood at base camps and explored trails with us.
          </p>
        </div>

        {/* Swipeable Horizontal Slider on Mobile */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex sm:hidden overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory gap-6 -mx-4 px-4"
        >
          {displayItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => openLightbox(idx)}
              className={`w-[280px] shrink-0 snap-align-start p-3 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                activeVariant === "messy-grid"
                  ? "bg-white/5 border-white/10 text-white shadow-md hover:bg-white/10"
                  : "bg-white border-secondary/10 shadow-sm text-primary"
              }`}
            >
              <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-slate-900/40">
                <SafeImage
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover rounded-xl"
                  unoptimized
                />
                {/* Bottom text gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[9px] uppercase tracking-wider text-secondary font-bold font-sans">
                    {item.trek?.title?.split(" Trek")[0] || "Himalayan Expedition"}
                  </span>
                  <h4 className="font-serif font-bold text-xs mt-0.5 leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>
              <div className="mt-3 px-1 flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-serif font-bold text-xs truncate max-w-[65%] ${
                    activeVariant === "messy-grid" ? "text-white" : "text-primary"
                  }`}>
                    {item.title}
                  </h4>
                  {item.trek && item.trek.title && (
                    <span className={`text-[8px] border px-2 py-0.5 rounded-full font-sans font-semibold shrink-0 uppercase tracking-wide ${
                      activeVariant === "messy-grid"
                        ? "bg-white/5 border-white/10 text-white"
                        : "bg-primary/5 border-secondary/15 text-primary"
                    }`}>
                      {item.trek.title.split(" Trek")[0] || "Trek"}
                    </span>
                  )}
                </div>
                {item.caption && (
                  <p className={`text-[10px] italic font-sans font-light leading-normal line-clamp-2 mt-1 ${
                    activeVariant === "messy-grid" ? "text-bgOffWhite/70" : "text-charcoal/70"
                  }`}>
                    &ldquo;{item.caption}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Step-wise pagination dots (visible only on mobile) */}
        <div className="flex justify-center gap-2 mt-2 mb-6 sm:hidden">
          {displayItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const el = scrollContainerRef.current;
                if (el && el.children[idx]) {
                  el.children[idx].scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "start",
                  });
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx ? "w-8 bg-secondary" : "w-2 bg-secondary/30"
              }`}
              aria-label={`Go to photo ${idx + 1}`}
            />
          ))}
        </div>

        {/* Modern Photo Grid Layout (Hidden on Mobile) */}
        {activeVariant === "messy-grid" && displayItems.length >= 6 ? (
          /* Custom Premium Messy Grid matching user's reference exactly */
          <div className="hidden sm:grid grid-cols-12 gap-4 md:gap-5 auto-rows-[220px]">
            {/* Item 0 (Large Top-Left) */}
            <div
              onClick={() => openLightbox(0)}
              className="col-span-8 row-span-2 relative overflow-hidden rounded-[32px] group cursor-pointer bg-slate-900 shadow-lg"
            >
              <SafeImage
                src={displayItems[0].imageUrl}
                alt={displayItems[0].title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 text-white z-10">
                <span className="text-[10px] uppercase tracking-wider text-secondary font-bold font-sans transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {displayItems[0].trek?.title?.split(" Trek")[0] || "Himalayan Expedition"}
                </span>
                <h4 className="font-serif font-bold text-lg text-white mt-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-[50ms]">
                  {displayItems[0].title}
                </h4>
                {displayItems[0].caption && (
                  <p className="text-xs text-white/85 italic font-sans font-light mt-1.5 leading-normal line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-[100ms]">
                    &ldquo;{displayItems[0].caption}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Item 1 (Top-Right Top) */}
            <div
              onClick={() => openLightbox(1)}
              className="col-span-4 row-span-1 relative overflow-hidden rounded-[32px] group cursor-pointer bg-slate-900 shadow-md"
            >
              <SafeImage
                src={displayItems[1].imageUrl}
                alt={displayItems[1].title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 text-white z-10">
                <span className="text-[9px] uppercase tracking-wider text-secondary font-bold font-sans transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {displayItems[1].trek?.title?.split(" Trek")[0] || "Himalayan Expedition"}
                </span>
                <h4 className="font-serif font-bold text-sm text-white mt-0.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-[50ms]">
                  {displayItems[1].title}
                </h4>
              </div>
            </div>

            {/* Item 2 (Top-Right Bottom) */}
            <div
              onClick={() => openLightbox(2)}
              className="col-span-4 row-span-1 relative overflow-hidden rounded-[32px] group cursor-pointer bg-slate-900 shadow-md"
            >
              <SafeImage
                src={displayItems[2].imageUrl}
                alt={displayItems[2].title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 text-white z-10">
                <span className="text-[9px] uppercase tracking-wider text-secondary font-bold font-sans transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {displayItems[2].trek?.title?.split(" Trek")[0] || "Himalayan Expedition"}
                </span>
                <h4 className="font-serif font-bold text-sm text-white mt-0.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-[50ms]">
                  {displayItems[2].title}
                </h4>
              </div>
            </div>

            {/* Item 3 (Bottom-Left) */}
            <div
              onClick={() => openLightbox(3)}
              className="col-span-4 row-span-1 relative overflow-hidden rounded-[32px] group cursor-pointer bg-slate-900 shadow-md"
            >
              <SafeImage
                src={displayItems[3].imageUrl}
                alt={displayItems[3].title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 text-white z-10">
                <span className="text-[9px] uppercase tracking-wider text-secondary font-bold font-sans transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {displayItems[3].trek?.title?.split(" Trek")[0] || "Himalayan Expedition"}
                </span>
                <h4 className="font-serif font-bold text-sm text-white mt-0.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-[50ms]">
                  {displayItems[3].title}
                </h4>
              </div>
            </div>

            {/* Item 4 (Bottom-Middle) */}
            <div
              onClick={() => openLightbox(4)}
              className="col-span-4 row-span-1 relative overflow-hidden rounded-[32px] group cursor-pointer bg-slate-900 shadow-md"
            >
              <SafeImage
                src={displayItems[4].imageUrl}
                alt={displayItems[4].title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 text-white z-10">
                <span className="text-[9px] uppercase tracking-wider text-secondary font-bold font-sans transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {displayItems[4].trek?.title?.split(" Trek")[0] || "Himalayan Expedition"}
                </span>
                <h4 className="font-serif font-bold text-sm text-white mt-0.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-[50ms]">
                  {displayItems[4].title}
                </h4>
              </div>
            </div>

            {/* Item 5 (Bottom-Right) */}
            <div
              onClick={() => openLightbox(5)}
              className="col-span-4 row-span-1 relative overflow-hidden rounded-[32px] group cursor-pointer bg-slate-900 shadow-md"
            >
              <SafeImage
                src={displayItems[5].imageUrl}
                alt={displayItems[5].title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 text-white z-10">
                <span className="text-[9px] uppercase tracking-wider text-secondary font-bold font-sans transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {displayItems[5].trek?.title?.split(" Trek")[0] || "Himalayan Expedition"}
                </span>
                <h4 className="font-serif font-bold text-sm text-white mt-0.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-[50ms]">
                  {displayItems[5].title}
                </h4>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Masonry / Cards Grid Layout */
          <div className={`hidden sm:grid ${
            limit === 6 
              ? "grid-cols-2 md:grid-cols-3" 
              : sourceItems.length < 4 
              ? `grid-cols-${sourceItems.length}` 
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          } gap-6`}>
            {displayItems.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => openLightbox(idx)}
                className="bg-white p-3 rounded-2xl border border-secondary/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer flex flex-col"
              >
                {/* Image wrapper */}
                <div className="relative overflow-hidden rounded-xl bg-slate-50 aspect-[4/5] w-full shrink-0">
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500 rounded-xl"
                    unoptimized
                  />
                  
                  {/* Hover overlay details */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 text-bgOffWhite rounded-xl z-10">
                    <span className="text-[9px] uppercase tracking-wider text-secondary font-bold font-sans transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {item.trek?.title?.split(" Trek")[0] || "Himalayan Expedition"}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-bgOffWhite mt-0.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-[50ms]">
                      {item.title}
                    </h4>
                    {item.caption && (
                      <p className="text-[10px] text-bgOffWhite/80 italic font-sans font-light mt-1.5 leading-normal line-clamp-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-[100ms]">
                        &ldquo;{item.caption}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Caption and Title static footer inside card */}
                <div className="mt-3 px-1 flex flex-col gap-0.5 grow justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-serif font-bold text-primary text-xs sm:text-sm group-hover:text-secondary transition duration-300 truncate max-w-[70%]">
                        {item.title}
                      </h4>
                      {item.trek && item.trek.title && (
                        <span className="text-[8px] sm:text-[9px] bg-primary/5 border border-secondary/15 text-primary px-2 py-0.5 rounded-full font-sans font-semibold shrink-0 uppercase tracking-wide">
                          {item.trek.title.split(" Trek")[0] || "Trek"}
                        </span>
                      )}
                    </div>
                    {item.caption && (
                      <p className="text-[10px] sm:text-xs text-charcoal/70 italic font-sans font-light leading-relaxed line-clamp-2 mt-1">
                        &ldquo;{item.caption}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Photos CTA Button (linked to full gallery page) */}
        {showViewAll && (
          <div className="text-center mt-12 relative z-10">
            <Link href="/gallery" className="bg-secondary text-primary font-bold px-8 py-3.5 rounded-xl inline-block hover:bg-secondary-light hover:scale-105 active:scale-95 transition-all duration-300 shadow-md">
              View All Gallery
            </Link>
          </div>
        )}

        {/* Immersive lightbox */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={photoIndex}
          slides={displayItems.map((item) => ({
            src: item.imageUrl,
            title: item.title,
            description: item.caption,
          }))}
        />

      </div>
    </section>
  );
}
