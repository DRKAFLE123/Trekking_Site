"use client";

import React from "react";
import { FaStar } from "react-icons/fa";

interface ReviewPlatform {
  name: string;
  rating: string;
  maxRating: string;
  reviewsCount: string;
  badgeText?: string;
  stars: number;
}

interface ReviewPlatformsProps {
  platforms?: ReviewPlatform[];
}

const getPlatformColor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("tripadvisor")) return "text-[#00af87]"; // TripAdvisor green
  if (n.includes("google")) return "text-[#4285F4]"; // Google blue
  if (n.includes("booking")) return "text-[#003580]"; // Booking blue
  return "text-secondary";
};

export default function ReviewPlatforms({ platforms }: ReviewPlatformsProps) {
  const defaultPlatforms: ReviewPlatform[] = [
    {
      name: "TripAdvisor",
      rating: "5.0",
      maxRating: "5.0",
      reviewsCount: "2,234+ reviews",
      badgeText: "Certificate of Excellence",
      stars: 5,
    },
    {
      name: "Google Reviews",
      rating: "5.0",
      maxRating: "5.0",
      reviewsCount: "823+ reviews",
      badgeText: "Recommended Operator",
      stars: 5,
    },
    {
      name: "Booking.com",
      rating: "9.8",
      maxRating: "10",
      reviewsCount: "445+ recommend",
      badgeText: "Exceptional Choice",
      stars: 5,
    },
  ];

  const displayPlatforms = platforms && platforms.length > 0 ? platforms : defaultPlatforms;

  return (
    <section className="bg-secondary/5 border-y border-secondary/15 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Text */}
          <div className="text-center lg:text-left shrink-0">
            <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-2 block">
              Trusted Worldwide
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1a2e1f]">
              Our Travel Ratings
            </h3>
            <p className="text-xs text-charcoal/70 mt-1 font-sans">
              Verified review scores from independent platforms.
            </p>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full grow">
            {displayPlatforms.map((platform, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-sm border border-secondary/10 flex flex-col justify-between hover:shadow-md hover:border-secondary/30 transition duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="font-serif font-black text-lg text-[#1a2e1f] truncate">
                      {platform.name}
                    </span>
                    {platform.badgeText && (
                      <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                        {platform.badgeText}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-3xl font-sans font-black text-[#1a2e1f] tracking-tight">
                      {platform.rating}
                    </span>
                    <span className="text-xs text-charcoal/50">/{platform.maxRating}</span>
                  </div>

                  <div className={`flex ${getPlatformColor(platform.name)} gap-0.5 mb-2`}>
                    {[...Array(Math.min(5, Math.max(1, platform.stars || 5)))].map((_, i) => (
                      <FaStar key={i} className="h-3.5 w-3.5 fill-current text-amber-500" />
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-2 flex items-center justify-between text-[11px] text-charcoal/60 uppercase tracking-wider font-semibold font-sans">
                  <span>{platform.reviewsCount}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
