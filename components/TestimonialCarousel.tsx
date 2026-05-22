"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { motion, useMotionValue } from "framer-motion";
import { Testimonial } from "@/types";

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [testimonials]);

  // Country Flag Emoji Map
  const getFlagEmoji = (countryCode: string) => {
    const code = countryCode.toLowerCase().trim();
    switch (code) {
      case "usa":
      case "united states":
        return "🇺🇸";
      case "uk":
      case "united kingdom":
        return "🇬🇧";
      case "germany":
        return "🇩🇪";
      case "australia":
        return "🇦🇺";
      case "france":
        return "🇫🇷";
      case "italy":
        return "🇮🇹";
      case "japan":
        return "🇯🇵";
      case "canada":
        return "🇨🇦";
      default:
        return "✈️";
    }
  };

  return (
    <div className="relative overflow-hidden w-full py-6">
      {/* Testimonials Drag Container */}
      <motion.div
        ref={carouselRef}
        className="flex gap-6 cursor-grab active:cursor-grabbing select-none"
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        style={{ x }}
      >
        {testimonials.map((test, index) => (
          <motion.div
            key={test.id || test._id || index}
            className="min-w-[280px] sm:min-w-[350px] md:min-w-[400px] max-w-[450px] bg-white border border-secondary/10 shadow-lg rounded-xl p-6 md:p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative"
            whileHover={{ y: -5 }}
          >
            {/* Quote Icon */}
            <span className="absolute top-6 right-6 text-secondary/15 pointer-events-none">
              <FaQuoteLeft className="h-10 w-10" />
            </span>

            <div className="flex flex-col gap-4">
              {/* Rating */}
              <div className="flex text-secondary gap-1">
                {[...Array(test.rating)].map((_, i) => (
                  <FaStar key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm md:text-base text-charcoal/80 leading-relaxed italic">
                &ldquo;{test.reviewText}&rdquo;
              </p>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-4 mt-6 pt-5 border-t border-primary/5">
              {/* Initials Avatar fallback */}
              <div className="h-12 w-12 rounded-full bg-primary/10 border border-secondary/25 flex items-center justify-center font-bold text-primary font-serif shrink-0 uppercase text-lg">
                {test.clientName.charAt(0)}
              </div>

              <div className="flex flex-col">
                <span className="font-serif font-bold text-primary text-sm md:text-base">
                  {test.clientName}
                </span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <span>{getFlagEmoji(test.country)}</span>
                  <span>{test.country}</span>
                </span>
              </div>

              {test.trek && (
                <span className="ml-auto bg-primary/5 border border-secondary/20 text-primary text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0">
                  {test.trek.title.split(" Trek")[0]}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Slide hint */}
      <div className="flex justify-center gap-2 mt-8 text-xs text-muted">
        <span>← Drag / Swipe to view all reviews →</span>
      </div>
    </div>
  );
}
