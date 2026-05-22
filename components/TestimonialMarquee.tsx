"use client";

import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { Testimonial } from "@/types";

interface TestimonialMarqueeProps {
  testimonials: Testimonial[];
}

export default function TestimonialMarquee({ testimonials }: TestimonialMarqueeProps) {
  // Mock testimonials if database is empty
  const defaultTestimonials = [
    {
      clientName: "David Miller",
      country: "United States",
      rating: 5,
      reviewText: "Nature Heaven organized an incredible private trek to EBC. The guide was exceptionally knowledgeable, pacing was perfect, and the service was top notch! Highly recommend Kafle and his team.",
      trek: { title: "Everest Base Camp Trek" },
    },
    {
      clientName: "Emma Watson",
      country: "United Kingdom",
      rating: 5,
      reviewText: "Fabulous experience doing the Annapurna Circuit. Pacing was carefully managed for acclimatization. The porter was super friendly and helpful. Will definitely return!",
      trek: { title: "Annapurna Circuit Trek" },
    },
    {
      clientName: "Hans Müller",
      country: "Germany",
      rating: 5,
      reviewText: "Everything was perfectly arranged from airport pickup to drop off. The private guide handled permits, lodges, and meals seamlessly. Safety was always their primary concern.",
      trek: { title: "Manaslu Circuit Trek" },
    },
    {
      clientName: "Sarah Jenkins",
      country: "Australia",
      rating: 5,
      reviewText: "Langtang valley was stunning. Booking a private tour with Nature Heaven was the best decision. Extremely personal service and attention to detail. Thank you Kafle!",
      trek: { title: "Langtang Valley Trek" },
    },
  ];

  const items = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials as unknown as Testimonial[];
  
  // Duplicate the array to ensure smooth seamless marquee transition
  const marqueeItems = [...items, ...items, ...items];

  return (
    <section className="py-24 px-6 bg-[#fcfbfa] overflow-hidden relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
          Testimonials
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
          A Global Happy Family
        </h2>
        <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
        <p className="text-sm md:text-base text-charcoal/80 font-sans">
          Read verified stories from hikers who crossed mountain passes, stood at base camps, and explored trails with us.
        </p>
      </div>

      {/* Marquee Track Container */}
      <div className="relative w-full overflow-hidden py-4 flex mask-fade select-none">
        
        {/* CSS for Infinite Scrolling Marquee */}
        <style jsx global>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.3333%);
            }
          }
          .animate-marquee-track {
            display: flex;
            gap: 1.5rem;
            width: max-content;
            animation: marquee 50s linear infinite;
          }
          .animate-marquee-track:hover {
            animation-play-state: paused;
          }
          .mask-fade {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
        `}</style>

        <div className="animate-marquee-track">
          {marqueeItems.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/5 w-[380px] sm:w-[420px] flex flex-col justify-between hover:shadow-md hover:border-secondary/20 transition-all duration-300 pointer-events-auto"
            >
              <div className="flex flex-col gap-4">
                {/* Quote Icon and Rating */}
                <div className="flex items-center justify-between">
                  <FaQuoteLeft className="text-secondary/15 h-8 w-8" />
                  <div className="flex text-secondary gap-0.5">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <FaStar key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-sm text-charcoal/85 leading-relaxed font-sans font-light italic line-clamp-4">
                  &ldquo;{testimonial.reviewText}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="border-t border-gray-100 pt-4 mt-6 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-primary text-sm sm:text-base">
                    {testimonial.clientName}
                  </h4>
                  <span className="text-[10px] sm:text-xs text-charcoal/50 uppercase tracking-wider font-sans font-medium">
                    {testimonial.country}
                  </span>
                </div>
                {testimonial.trek && (
                  <span className="text-[10px] sm:text-xs bg-[#EEF5FB] text-[#1A6FBF] font-semibold font-sans px-2.5 py-1 rounded-full max-w-[150px] truncate">
                    {testimonial.trek.title}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
