"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaStar, FaRegClock, FaSignal, FaHiking } from "react-icons/fa";
import { Trek } from "@/types";
import { getMediaUrl } from "@/lib/cloudinary-loader";


interface TrekCardProps {
  trek: Trek;
}

export default function TrekCard({ trek }: TrekCardProps) {
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
        {heroImage ? (
          <Image
            src={getMediaUrl(heroImage)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/40 font-serif">
            Nature Heaven Trekking
          </div>
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
    </div>
  );
}
