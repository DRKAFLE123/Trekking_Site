"use client";

import React from "react";
import Link from "next/link";
import { FaCalendarAlt, FaUserFriends, FaRegClock } from "react-icons/fa";

export default function UpcomingDepartures() {
  const departures = [
    {
      title: "Everest Base Camp Trek",
      slug: "everest-base-camp-trek",
      date: "Sep 12, 2026 - Sep 27, 2026",
      duration: 16,
      originalPrice: 1599,
      discountedPrice: 1279,
      spotsLeft: 4,
      difficulty: "Hard",
    },
    {
      title: "Annapurna Circuit Trek",
      slug: "annapurna-circuit-trek",
      date: "Oct 05, 2026 - Oct 20, 2026",
      duration: 16,
      originalPrice: 1399,
      discountedPrice: 1119,
      spotsLeft: 6,
      difficulty: "Moderate",
    },
    {
      title: "Manaslu Circuit Trek",
      slug: "manaslu-circuit-trek",
      date: "Oct 18, 2026 - Nov 02, 2026",
      duration: 16,
      originalPrice: 1699,
      discountedPrice: 1359,
      spotsLeft: 3,
      difficulty: "Hard",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white border-y border-secondary/15">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Limited Time Offers
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
            Upcoming Departures
          </h2>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80 font-sans">
            Join one of our scheduled private group tours this season and save big. Limited spaces available for maximum safety and personalization.
          </p>
        </div>

        {/* Departures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {departures.map((dep, idx) => (
            <div
              key={idx}
              className="bg-[#fcfbfa] border border-secondary/10 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
            >
              {/* Promo Badge */}
              <div className="absolute top-4 right-4 bg-red-500 text-white font-sans font-bold text-xs px-3 py-1 rounded-full shadow-md animate-pulse">
                20% OFF
              </div>

              <div>
                {/* Difficulty */}
                <span className="text-[10px] text-primary uppercase font-bold tracking-widest bg-secondary/15 px-2 py-0.5 rounded-full mb-3 inline-block">
                  {dep.difficulty}
                </span>

                {/* Title */}
                <h3 className="font-serif text-xl font-bold text-primary mb-3 hover:text-secondary transition duration-300">
                  <Link href={`/trips/${dep.slug}`}>{dep.title}</Link>
                </h3>

                {/* Details list */}
                <div className="flex flex-col gap-3 py-3 border-y border-secondary/5 text-xs text-charcoal/70 mb-5">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-secondary h-4 w-4 shrink-0" />
                    <span className="font-semibold text-primary">{dep.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegClock className="text-secondary h-4 w-4 shrink-0" />
                    <span>{dep.duration} Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserFriends className="text-secondary h-4 w-4 shrink-0" />
                    <span className="text-amber-600 font-bold">Only {dep.spotsLeft} spots left!</span>
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between mt-2 pt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted tracking-wider uppercase">Special Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-muted line-through">${dep.originalPrice}</span>
                    <span className="text-xl font-bold text-emerald-600">${dep.discountedPrice}</span>
                    <span className="text-[10px] text-muted uppercase">USD</span>
                  </div>
                </div>

                <Link
                  href={`/trips/${dep.slug}`}
                  className="bg-primary text-bgOffWhite text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-secondary hover:text-primary transition-all duration-300 shadow-md border border-primary hover:border-secondary"
                >
                  Join Trek
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
