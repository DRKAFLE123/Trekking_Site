"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaStar, FaRegClock, FaSignal, FaHiking, FaPlay, FaTimes } from "react-icons/fa";
import { Trek } from "@/types";
import { getMediaUrl } from "@/lib/cloudinary-loader";


interface TrekCardProps {
  trek: Trek;
}

export default function TrekCard({ trek }: TrekCardProps) {
  const [videoOpen, setVideoOpen] = useState(false);
  const {
    title,
    slug,
    duration,
    price,
    discountedPrice,
    difficulty,
    maxAltitude,
    heroImage,
    isBestSeller,
    region,
    youtubeVideoId,
  } = trek;

  // Render difficulty badge
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "moderate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "hard":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "extreme":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const currentPrice = discountedPrice || price;
  const hasDiscount = !!discountedPrice && discountedPrice < price;

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-secondary/10 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
      {/* Image and Badges */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary/10 shrink-0">
        <Image
          src={getMediaUrl(heroImage) || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition duration-700"
          unoptimized
        />

        {/* Play Button Overlay */}
        {youtubeVideoId && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setVideoOpen(true);
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
            aria-label={`Play video for ${title}`}
          >
            <div className="w-14 h-14 rounded-full bg-white/95 text-primary hover:bg-secondary hover:text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 hover:scale-110 transition-all duration-300">
              <FaPlay className="h-4 w-4 ml-1 fill-current" />
            </div>
          </button>
        )}
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        {/* Region Badge */}
        {region && (
          <span className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-bgOffWhite text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-secondary/20">
            {region.name}
          </span>
        )}

        {/* Best Seller Badge */}
        {isBestSeller && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white font-sans font-bold text-[10px] tracking-wider uppercase px-2.5 py-1.5 rounded-sm shadow-md">
            BEST SELLER
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow justify-between">
        <div className="flex flex-col gap-3">
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs font-bold text-charcoal/80">
            <div className="flex text-secondary gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="h-3 w-3 fill-current" />
              ))}
            </div>
            <span>5.0</span>
            <span className="text-muted text-[10px] font-normal">(100% verified reviews)</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-primary group-hover:text-secondary transition duration-300 leading-snug line-clamp-2">
            <Link href={`/trips/${slug}`}>{title}</Link>
          </h3>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 pt-2 pb-1 text-xs text-charcoal/70 border-b border-primary/5">
            <div className="flex items-center gap-1.5">
              <FaRegClock className="text-secondary shrink-0" />
              <span>{duration} Days</span>
            </div>
            <div className="flex items-center gap-1.5 capitalize">
              <FaSignal className="text-secondary shrink-0" />
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <FaHiking className="text-secondary shrink-0" />
              <span>Max Alt: <strong className="text-primary">{maxAltitude}m</strong></span>
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-primary/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted tracking-wider uppercase">Price per person</span>
            <div className="flex items-baseline gap-1.5">
              {hasDiscount && (
                <span className="text-sm text-muted line-through font-medium">${price}</span>
              )}
              <span className={`text-xl font-bold font-sans ${hasDiscount ? "text-emerald-600" : "text-primary"}`}>${currentPrice}</span>
              <span className="text-xs text-muted font-normal">USD</span>
            </div>
          </div>

          <Link
            href={`/trips/${slug}`}
            className="bg-primary hover:bg-secondary hover:text-primary text-bgOffWhite text-xs font-bold px-4 py-2.5 rounded-xl border border-primary hover:border-secondary transition-all duration-300"
          >
            View Trek
          </Link>
        </div>
      </div>

      {/* Video Modal */}
      {videoOpen && youtubeVideoId && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
          onClick={() => setVideoOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 bg-black/60 text-white hover:text-secondary p-2 rounded-full border border-white/25 transition-all duration-200 z-50 focus:outline-none cursor-pointer"
              aria-label="Close video"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            {/* YouTube Iframe */}
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
              title={`${title} Video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
