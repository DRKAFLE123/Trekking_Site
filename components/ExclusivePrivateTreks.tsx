"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  FaRunning,
  FaUserShield,
  FaCalendarCheck,
  FaHotel,
  FaUserCheck,
  FaMountain,
  FaCompass,
  FaStar,
} from "react-icons/fa";

export type PrivateTreksUSP = {
  icon?: string;
  title: string;
  description?: string;
  desc?: string;
};

interface ExclusivePrivateTreksProps {
  kicker?: string;
  title?: string;
  description?: string;
  usps?: PrivateTreksUSP[];
}

const ICONS: Record<string, React.ReactNode> = {
  running: <FaRunning className="h-6 w-6 text-secondary" />,
  shield: <FaUserShield className="h-6 w-6 text-secondary" />,
  "calendar-check": <FaCalendarCheck className="h-6 w-6 text-secondary" />,
  hotel: <FaHotel className="h-6 w-6 text-secondary" />,
  "user-check": <FaUserCheck className="h-6 w-6 text-secondary" />,
  mountain: <FaMountain className="h-6 w-6 text-secondary" />,
  compass: <FaCompass className="h-6 w-6 text-secondary" />,
  star: <FaStar className="h-6 w-6 text-secondary" />,
};

const DEFAULT_USPS: PrivateTreksUSP[] = [
  {
    icon: "running",
    title: "Your Pace",
    description:
      "No rushing to catch up, no waiting for slower hikers. Set a comfortable speed that fits your fitness level.",
  },
  {
    icon: "shield",
    title: "Sherpa Guide",
    description:
      "A dedicated guide focused entirely on your health & safety, providing deep cultural and geographical insights.",
  },
  {
    icon: "calendar-check",
    title: "Any Date",
    description:
      "Choose any calendar date that works for your international flights and vacation schedules.",
  },
  {
    icon: "hotel",
    title: "Custom Hotels",
    description:
      "Upgrade or downgrade lodging options to suit your preferences, from basic teahouses to boutique mountain resorts.",
  },
  {
    icon: "user-check",
    title: "Solo Friendly",
    description:
      "We support single solo travelers with dedicated private guides, ensuring maximum safety and companionship.",
  },
];

export default function ExclusivePrivateTreks({
  kicker,
  title,
  description,
  usps,
}: ExclusivePrivateTreksProps = {}) {
  const displayUsps: PrivateTreksUSP[] =
    usps && usps.length > 0 ? usps : DEFAULT_USPS;
  const displayKicker = kicker || "100% Customized Trips";
  const displayTitle = title || "Exclusive Private Treks";
  const displayDescription =
    description ||
    "Unlike cookie-cutter group tours, we specialize in private treks. You set the date, you set the pace, and our guides look after only you.";

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <section className="py-16 md:py-24 px-4 md:px-6 bg-primary text-bgOffWhite relative overflow-hidden">
      {/* Background Accent Rings */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            {displayKicker}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-bgOffWhite">
            {displayTitle}
          </h2>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-bgOffWhite/80 leading-relaxed font-sans">
            {displayDescription}
          </p>
        </div>

        {/* Grid (slider on mobile, columns on desktop) */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={`flex overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory gap-6 lg:grid lg:gap-6 -mx-4 px-4 lg:mx-0 lg:px-0 ${
            displayUsps.length === 5
              ? "lg:grid-cols-5"
              : displayUsps.length === 4
              ? "lg:grid-cols-4"
              : displayUsps.length === 3
              ? "lg:grid-cols-3"
              : "lg:grid-cols-5"
          }`}
        >
          {displayUsps.map((usp, idx) => {
            const iconNode = (usp.icon && ICONS[usp.icon]) || ICONS.running;
            const text = usp.description || usp.desc || "";
            return (
              <div
                key={idx}
                className="bg-[#10251c] border border-secondary/15 p-6 rounded-2xl text-center hover:border-secondary hover:shadow-xl transition-all duration-300 flex flex-col justify-between w-[260px] lg:w-auto shrink-0 snap-align-start"
              >
                <div>
                  <div className="h-12 w-12 bg-secondary/10 border border-secondary/20 flex items-center justify-center rounded-xl mx-auto mb-5">
                    {iconNode}
                  </div>
                  <h4 className="font-serif font-bold text-secondary text-lg mb-3 tracking-wide">
                    {usp.title}
                  </h4>
                  <p className="text-xs text-bgOffWhite/75 leading-relaxed font-sans font-light">
                    {text}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] uppercase tracking-wider text-secondary/70 font-semibold">
                  USP Feature 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step-wise pagination dots (visible only on mobile/tablet) */}
        <div className="flex justify-center gap-2 mt-4 lg:hidden">
          {displayUsps.map((_, idx) => (
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
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/private-treks"
            className="bg-secondary text-primary font-bold px-8 py-4 rounded-xl inline-block hover:bg-secondary-light hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            Learn More About Private Treks
          </Link>
        </div>
      </div>
    </section>
  );
}
