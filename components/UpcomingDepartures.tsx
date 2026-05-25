"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaUserFriends, FaRegClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

interface Departure {
  id: string | number;
  startDate: string;
  endDate: string;
  availableSeats: number;
  bookedSeats: number;
  status: "available" | "limited" | "sold_out" | "cancelled";
  priceOverride?: number;
  isGuaranteed?: boolean;
  trek: {
    id: string | number;
    title: string;
    slug: string;
    duration: number;
    price: number;
    discountedPrice?: number;
    difficulty: "easy" | "moderate" | "hard" | "extreme";
  };
}

export default function UpcomingDepartures() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDepartures() {
      try {
        setLoading(true);
        const res = await fetch("/api/departures");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.departures)) {
            setDepartures(data.departures);
          }
        }
      } catch (err) {
        console.error("Failed to load upcoming departures:", err);
      } finally {
        setLoading(false);
      }
    }
    getDepartures();
  }, []);

  // Format date range nicely: e.g. "Sep 12, 2026 - Sep 27, 2026"
  const formatDateRange = (startStr: string, endStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
      const start = new Date(startStr).toLocaleDateString("en-US", options);
      const end = new Date(endStr).toLocaleDateString("en-US", options);
      return `${start} - ${end}`;
    } catch (e) {
      return `${startStr} - ${endStr}`;
    }
  };

  // Safe fallback departures to display if API returns empty
  const fallbackDepartures: Departure[] = [
    {
      id: "fallback-1",
      startDate: "2026-09-12",
      endDate: "2026-09-27",
      availableSeats: 4,
      bookedSeats: 12,
      status: "limited",
      isGuaranteed: true,
      trek: {
        id: "fallback-trek-1",
        title: "Everest Base Camp Trek",
        slug: "everest-base-camp-trek-14",
        duration: 14,
        price: 1599,
        discountedPrice: 1279,
        difficulty: "hard",
      },
    },
    {
      id: "fallback-2",
      startDate: "2026-10-05",
      endDate: "2026-10-20",
      availableSeats: 6,
      bookedSeats: 10,
      status: "available",
      isGuaranteed: true,
      trek: {
        id: "fallback-trek-2",
        title: "Annapurna Circuit Trek",
        slug: "annapurna-circuit-14",
        duration: 14,
        price: 1399,
        discountedPrice: 1119,
        difficulty: "moderate",
      },
    },
    {
      id: "fallback-3",
      startDate: "2026-10-18",
      endDate: "2026-11-02",
      availableSeats: 3,
      bookedSeats: 13,
      status: "limited",
      isGuaranteed: true,
      trek: {
        id: "fallback-trek-3",
        title: "Manaslu Circuit Trek",
        slug: "manaslu-circuit-16",
        duration: 16,
        price: 1699,
        discountedPrice: 1359,
        difficulty: "hard",
      },
    },
  ];

  const list = departures.length > 0 ? departures : fallbackDepartures;

  return (
    <section id="upcoming" className="py-16 md:py-24 px-4 md:px-6 bg-white border-y border-secondary/15">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Guaranteed Small Group Slots
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
            Upcoming Departures
          </h2>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80 font-sans">
            Join one of our scheduled private group tours this season. Tightly limited seats ensure maximum safety, native guide focus, and local pricing.
          </p>
        </div>

        {/* LOADING STATE - Premium Skeleton Grids */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-secondary/10 rounded-2xl p-6 bg-[#fcfbfa] flex flex-col gap-5 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-16 bg-slate-200 rounded-full"></div>
                  <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-7 w-3/4 bg-slate-200 rounded-md"></div>
                <div className="flex flex-col gap-3 py-3 border-y border-secondary/5">
                  <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-col gap-1">
                    <div className="h-3 w-12 bg-slate-200 rounded"></div>
                    <div className="h-5 w-24 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* DEPARTURES GRID DISPLAY */
          <div className="flex overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory gap-6 md:grid md:grid-cols-3 md:gap-8 -mx-4 px-4 md:mx-0 md:px-0">
            {list.map((dep) => {
              const trek = dep.trek;
              if (!trek) return null;

              const isSoldOut = dep.status === "sold_out";
              const isLimited = dep.status === "limited";

              const originalPrice = dep.priceOverride || trek.price;
              const discountedPrice = trek.discountedPrice || Math.round(originalPrice * 0.8);
              const hasDiscount = originalPrice > discountedPrice;

              return (
                <div
                  key={dep.id}
                  className={`bg-[#fcfbfa] border rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden w-[290px] md:w-auto shrink-0 snap-align-start ${
                    isSoldOut ? "border-slate-200 opacity-80" : "border-secondary/10"
                  }`}
                >
                  {/* Promo Discount Badge */}
                  {hasDiscount && !isSoldOut && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white font-sans font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md animate-pulse">
                      SPECIAL OFFER
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      {/* Difficulty */}
                      <span className="text-[9px] text-primary uppercase font-black tracking-widest bg-secondary/15 px-2.5 py-0.5 rounded-full">
                        {trek.difficulty}
                      </span>

                      {/* Status Badge */}
                      {isSoldOut ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200/50">
                          Sold Out
                        </span>
                      ) : isLimited ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50 flex items-center gap-1">
                          <FaExclamationTriangle /> Limited
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50 flex items-center gap-1">
                          <FaCheckCircle /> Available
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xl font-bold text-primary mb-3 hover:text-secondary transition duration-300">
                      <Link href={`/trips/${trek.slug}`}>{trek.title}</Link>
                    </h3>

                    {/* Details list */}
                    <div className="flex flex-col gap-3 py-3 border-y border-secondary/5 text-xs text-charcoal/70 mb-5">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-secondary h-4 w-4 shrink-0" />
                        <span className="font-semibold text-primary">
                          {formatDateRange(dep.startDate, dep.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaRegClock className="text-secondary h-4 w-4 shrink-0" />
                        <span>{trek.duration} Days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUserFriends className="text-secondary h-4 w-4 shrink-0" />
                        {isSoldOut ? (
                          <span className="text-red-500 font-bold">No slots remaining</span>
                        ) : isLimited ? (
                          <span className="text-amber-600 font-bold">Only {dep.availableSeats} spots left!</span>
                        ) : (
                          <span className="text-emerald-600 font-bold">Guaranteed departure ({dep.availableSeats} open)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between mt-2 pt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted tracking-wider uppercase">Trek Rate</span>
                      <div className="flex items-baseline gap-1">
                        {hasDiscount ? (
                          <>
                            <span className="text-xs text-muted line-through">${originalPrice}</span>
                            <span className="text-lg font-black text-emerald-600">${discountedPrice}</span>
                          </>
                        ) : (
                          <span className="text-lg font-black text-[#1A1A2E]">${originalPrice}</span>
                        )}
                        <span className="text-[9px] text-muted uppercase">USD</span>
                      </div>
                    </div>

                    {isSoldOut ? (
                      <button
                        disabled
                        className="bg-slate-100 text-slate-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed border border-slate-200"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <Link
                        href={`/booking/${trek.slug}?departure=${dep.id}&startDate=${dep.startDate}&endDate=${dep.endDate}`}
                        className="bg-primary text-bgOffWhite text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-secondary hover:text-primary transition-all duration-300 shadow-md border border-primary hover:border-secondary"
                      >
                        Book Now
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
