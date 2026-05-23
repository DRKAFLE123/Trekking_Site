"use client";

import React, { useState } from "react";
import Image from "next/image";
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
}

// Fallback gallery for when the database gallery is empty
const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: "f1",
    title: "Summit Joy at Everest Base Camp",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
    caption: "Standing at 5,364m — a dream realized.",
  },
  {
    id: "f2",
    title: "Namche Bazaar Morning Mist",
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=800",
    caption: "The gateway to Everest glows in golden hour.",
  },
  {
    id: "f3",
    title: "Annapurna Panorama",
    image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=800",
    caption: "8,000m peaks stretching to the horizon.",
  },
  {
    id: "f4",
    title: "Thorong La Pass Summit",
    image: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=800",
    caption: "5,416m — the world's highest mountain pass crossing.",
  },
  {
    id: "f5",
    title: "Gokyo Lakes Reflections",
    image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800",
    caption: "Turquoise glacial lakes beneath the giants.",
  },
  {
    id: "f6",
    title: "Manaslu Circuit View",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    caption: "Remote trails through pristine Himalayan wilderness.",
  },
  {
    id: "f7",
    title: "Happy Hikers, Happy Hearts",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800",
    caption: "Smiles that summit gives you — priceless.",
  },
  {
    id: "f8",
    title: "Sherpa Culture & Community",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800",
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

export default function PhotoGalleryMasonry({ items }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

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

  const openLightbox = (idx: number) => {
    setPhotoIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <section className="py-24 px-6 bg-[#fcfbfa] overflow-hidden relative border-t border-secondary/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Happy Moments
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
            A Global Happy Family
          </h2>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80 font-sans">
            Capturing the raw joy, beautiful summits, and unforgettable shared stories of hikers who stood at base camps and explored trails with us.
          </p>
        </div>

        {/* Pinterest-style Masonry Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {resolvedItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid bg-white p-3 rounded-2xl border border-secondary/10 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              {/* Image wrapper */}
              <div className="relative overflow-hidden rounded-xl bg-slate-50">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={400}
                  height={idx % 2 === 0 ? 500 : 350}
                  className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-transform duration-500 rounded-xl"
                  unoptimized
                />
                
                {/* Hover overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-bgOffWhite rounded-xl">
                  <span className="text-[9px] uppercase tracking-wider text-secondary font-bold font-sans">
                    {item.trek?.title?.split(" Trek")[0] || "Himalayan Expedition"}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-bgOffWhite mt-0.5">
                    {item.title}
                  </h4>
                </div>
              </div>

              {/* Caption and Title static footer inside card */}
              <div className="mt-3 px-1 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
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
          ))}
        </div>

        {/* Immersive lightbox */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={photoIndex}
          slides={resolvedItems.map((item) => ({
            src: item.imageUrl,
            title: item.title,
            description: item.caption,
          }))}
        />

      </div>
    </section>
  );
}
