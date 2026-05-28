"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaUserFriends,
  FaRegClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import EnquiryModal from "./EnquiryModal";

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

  // Enquiry modal state
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryTrek, setEnquiryTrek] = useState<{
    title: string;
    slug: string;
    price: number;
    startDate: string;
  } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const start = new Date(startStr).toLocaleDateString("en-US", options);
      const end = new Date(endStr).toLocaleDateString("en-US", options);
      return `${start} – ${end}`;
    } catch (e) {
      return `${startStr} - ${endStr}`;
    }
  };

  const formatShortDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
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
        slug: "manaslu-circuit-trek-16",
        duration: 16,
        price: 1699,
        discountedPrice: 1359,
        difficulty: "hard",
      },
    },
    {
      id: "fallback-4",
      startDate: "2026-11-01",
      endDate: "2026-11-12",
      availableSeats: 8,
      bookedSeats: 4,
      status: "available",
      isGuaranteed: true,
      trek: {
        id: "fallback-trek-4",
        title: "Annapurna Base Camp Trek",
        slug: "annapurna-base-camp-trek",
        duration: 12,
        price: 1199,
        discountedPrice: 959,
        difficulty: "moderate",
      },
    },
    {
      id: "fallback-5",
      startDate: "2026-11-15",
      endDate: "2026-12-01",
      availableSeats: 0,
      bookedSeats: 16,
      status: "sold_out",
      isGuaranteed: true,
      trek: {
        id: "fallback-trek-5",
        title: "Langtang Valley Trek",
        slug: "langtang-valley-trek",
        duration: 10,
        price: 999,
        discountedPrice: 799,
        difficulty: "moderate",
      },
    },
    {
      id: "fallback-6",
      startDate: "2026-12-10",
      endDate: "2026-12-25",
      availableSeats: 10,
      bookedSeats: 6,
      status: "available",
      isGuaranteed: false,
      trek: {
        id: "fallback-trek-6",
        title: "Everest Base Camp Trek",
        slug: "everest-base-camp-trek-14",
        duration: 14,
        price: 1599,
        discountedPrice: 1279,
        difficulty: "hard",
      },
    },
  ];

  const list = departures.length > 0 ? departures : fallbackDepartures;

  // Pagination logic
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const paginatedList = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEnquiry = (dep: Departure) => {
    const trekData = dep.trek;
    setEnquiryTrek({
      title: trekData.title,
      slug: trekData.slug,
      price: trekData.discountedPrice || trekData.price,
      startDate: dep.startDate,
    });
    setEnquiryOpen(true);
  };

  const difficultyColor = (d: string) => {
    switch (d) {
      case "easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "moderate":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "hard":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "extreme":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const statusBadge = (status: string, seats: number) => {
    switch (status) {
      case "sold_out":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200/60">
            Sold Out
          </span>
        );
      case "limited":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
            <FaExclamationTriangle className="text-[8px]" />
            {seats} Left
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <FaCheckCircle className="text-[8px]" />
            Available
          </span>
        );
    }
  };

  return (
    <>
      <section
        id="upcoming"
        className="py-16 md:py-24 px-4 md:px-6 bg-white border-y border-secondary/15"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
              Guaranteed Small Group Slots
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
              Upcoming Departures
            </h2>
            <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
            <p className="text-sm md:text-base text-charcoal/80 font-sans">
              Join one of our scheduled private group tours this season. Tightly
              limited seats ensure maximum safety, native guide focus, and local
              pricing.
            </p>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="overflow-hidden rounded-2xl border border-secondary/10">
              <div className="bg-[#1a3c2e] p-4">
                <div className="grid grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="h-4 bg-white/20 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="grid grid-cols-6 gap-4 p-4 border-b border-secondary/5"
                >
                  {[1, 2, 3, 4, 5, 6].map((c) => (
                    <div
                      key={c}
                      className="h-5 bg-slate-100 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* ============================== */}
              {/* DESKTOP TABLE VIEW (md+)       */}
              {/* ============================== */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-secondary/10 shadow-sm">
                {/* Table Header */}
                <div className="bg-[#1a3c2e] text-white">
                  <div className="grid grid-cols-[2.2fr_1.8fr_1fr_1fr_1.3fr] gap-1 px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider">
                    <span>Trip Name</span>
                    <span>Dates</span>
                    <span className="text-center">Availability</span>
                    <span className="text-center">Price (USD)</span>
                    <span className="text-right">Actions</span>
                  </div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-secondary/8 bg-white">
                  {paginatedList.map((dep, idx) => {
                    const trek = dep.trek;
                    if (!trek) return null;

                    const isSoldOut =
                      dep.status === "sold_out" || dep.status === "cancelled";
                    const originalPrice = dep.priceOverride || trek.price;
                    const discountedPrice =
                      trek.discountedPrice ||
                      Math.round(originalPrice * 0.8);
                    const hasDiscount = originalPrice > discountedPrice;

                    return (
                      <div
                        key={dep.id}
                        className={`grid grid-cols-[2.2fr_1.8fr_1fr_1fr_1.3fr] gap-1 px-6 py-4 items-center transition-colors duration-200 ${
                          idx % 2 === 0
                            ? "bg-white"
                            : "bg-[#f9faf8]"
                        } hover:bg-secondary/5 ${
                          isSoldOut ? "opacity-60" : ""
                        }`}
                      >
                        {/* Trip Name + Duration Badge */}
                        <div className="flex flex-col gap-1.5">
                          <Link
                            href={`/trips/${trek.slug}`}
                            className="font-serif font-bold text-sm text-primary hover:text-secondary transition-colors duration-200 leading-tight"
                          >
                            {trek.title}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${difficultyColor(
                                trek.difficulty
                              )}`}
                            >
                              {trek.difficulty}
                            </span>
                            <span className="text-[10px] text-charcoal/50 font-semibold flex items-center gap-1">
                              <FaRegClock className="text-[8px]" />
                              {trek.duration} Days
                            </span>
                            {dep.isGuaranteed && (
                              <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                                <FaCheckCircle className="text-[7px]" />
                                Guaranteed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center gap-2 text-xs text-charcoal/80 font-medium">
                          <FaCalendarAlt className="text-secondary text-[10px] shrink-0" />
                          <span>
                            {formatDateRange(dep.startDate, dep.endDate)}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="flex justify-center">
                          {statusBadge(dep.status, dep.availableSeats)}
                        </div>

                        {/* Price */}
                        <div className="flex flex-col items-center">
                          {hasDiscount ? (
                            <>
                              <span className="text-[10px] text-charcoal/40 line-through font-medium">
                                ${originalPrice}
                              </span>
                              <span className="text-base font-black text-emerald-700">
                                ${discountedPrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-base font-black text-[#1A1A2E]">
                              ${originalPrice}
                            </span>
                          )}
                          <span className="text-[9px] text-charcoal/40 uppercase font-bold">
                            per person
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2">
                          {isSoldOut ? (
                            <button
                              disabled
                              className="bg-slate-100 text-slate-400 text-[10px] font-bold px-4 py-2 rounded-lg cursor-not-allowed border border-slate-200"
                            >
                              Sold Out
                            </button>
                          ) : (
                            <>
                              <Link
                                href={`/booking/${trek.slug}?departure=${dep.id}&startDate=${dep.startDate}&endDate=${dep.endDate}`}
                                className="bg-primary text-white text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-secondary hover:text-primary transition-all duration-300 shadow-sm border border-primary hover:border-secondary"
                              >
                                Book Now
                              </Link>
                              <button
                                onClick={() => handleEnquiry(dep)}
                                className="bg-white text-primary text-[10px] font-bold px-3.5 py-2 rounded-lg border border-primary/20 hover:border-secondary hover:text-secondary transition-all duration-300 flex items-center gap-1.5"
                              >
                                <FaEnvelope className="text-[8px]" />
                                Enquiry
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Table Footer with count + pagination */}
                <div className="bg-[#f4f6f3] px-6 py-3 flex items-center justify-between border-t border-secondary/10">
                  <span className="text-[11px] text-charcoal/50 font-semibold">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, list.length)} of{" "}
                    {list.length} departures
                  </span>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-md hover:bg-secondary/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <FaChevronLeft className="text-[10px] text-primary" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 rounded-md text-[10px] font-bold transition ${
                              currentPage === page
                                ? "bg-primary text-white"
                                : "text-charcoal/60 hover:bg-secondary/10"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-md hover:bg-secondary/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <FaChevronRight className="text-[10px] text-primary" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ============================== */}
              {/* MOBILE CARD VIEW (<md)          */}
              {/* ============================== */}
              <div className="md:hidden flex flex-col gap-4">
                {paginatedList.map((dep) => {
                  const trek = dep.trek;
                  if (!trek) return null;

                  const isSoldOut =
                    dep.status === "sold_out" || dep.status === "cancelled";
                  const originalPrice = dep.priceOverride || trek.price;
                  const discountedPrice =
                    trek.discountedPrice || Math.round(originalPrice * 0.8);
                  const hasDiscount = originalPrice > discountedPrice;

                  return (
                    <div
                      key={dep.id}
                      className={`bg-white border border-secondary/10 rounded-xl p-5 flex flex-col gap-3 shadow-sm ${
                        isSoldOut ? "opacity-60" : ""
                      }`}
                    >
                      {/* Top: Title + Status */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <Link
                            href={`/trips/${trek.slug}`}
                            className="font-serif font-bold text-base text-primary hover:text-secondary transition leading-tight"
                          >
                            {trek.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span
                              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${difficultyColor(
                                trek.difficulty
                              )}`}
                            >
                              {trek.difficulty}
                            </span>
                            <span className="text-[10px] text-charcoal/50 font-semibold">
                              {trek.duration} Days
                            </span>
                          </div>
                        </div>
                        {statusBadge(dep.status, dep.availableSeats)}
                      </div>

                      {/* Details row */}
                      <div className="flex items-center gap-3 text-xs text-charcoal/70 bg-[#f9faf8] rounded-lg px-3 py-2.5 border border-secondary/5">
                        <FaCalendarAlt className="text-secondary shrink-0" />
                        <span className="font-medium">
                          {formatShortDate(dep.startDate)} –{" "}
                          {formatShortDate(dep.endDate)}
                        </span>
                        {dep.isGuaranteed && (
                          <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 ml-auto">
                            <FaCheckCircle className="text-[7px]" />
                            Guaranteed
                          </span>
                        )}
                      </div>

                      {/* Price + Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-1.5">
                          {hasDiscount && (
                            <span className="text-xs text-charcoal/40 line-through">
                              ${originalPrice}
                            </span>
                          )}
                          <span className="text-lg font-black text-emerald-700">
                            ${discountedPrice}
                          </span>
                          <span className="text-[9px] text-charcoal/40 uppercase">
                            USD
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSoldOut ? (
                            <button
                              disabled
                              className="bg-slate-100 text-slate-400 text-[10px] font-bold px-3 py-2 rounded-lg cursor-not-allowed"
                            >
                              Sold Out
                            </button>
                          ) : (
                            <>
                              <Link
                                href={`/booking/${trek.slug}?departure=${dep.id}&startDate=${dep.startDate}&endDate=${dep.endDate}`}
                                className="bg-primary text-white text-[10px] font-bold px-3.5 py-2 rounded-lg hover:bg-secondary hover:text-primary transition-all shadow-sm"
                              >
                                Book Now
                              </Link>
                              <button
                                onClick={() => handleEnquiry(dep)}
                                className="bg-white text-primary text-[10px] font-bold px-3 py-2 rounded-lg border border-primary/20 hover:border-secondary transition-all flex items-center gap-1"
                              >
                                <FaEnvelope className="text-[8px]" />
                                Enquiry
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Mobile Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg hover:bg-secondary/10 transition disabled:opacity-30"
                    >
                      <FaChevronLeft className="text-xs text-primary" />
                    </button>
                    <span className="text-xs font-bold text-charcoal/60">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg hover:bg-secondary/10 transition disabled:opacity-30"
                    >
                      <FaChevronRight className="text-xs text-primary" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Enquiry Modal */}
      {enquiryTrek && (
        <EnquiryModal
          isOpen={enquiryOpen}
          onClose={() => {
            setEnquiryOpen(false);
            setEnquiryTrek(null);
          }}
          tripTitle={enquiryTrek.title}
          defaultPrice={enquiryTrek.price}
          defaultStartDate={enquiryTrek.startDate}
          defaultTrekSlug={enquiryTrek.slug}
        />
      )}
    </>
  );
}
