"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { FaRunning, FaUserShield, FaCalendarCheck, FaHotel, FaUserCheck } from "react-icons/fa";

export default function ExclusivePrivateTreks() {
  const usps = [
    {
      title: "Your Pace",
      desc: "No rushing to catch up, no waiting for slower hikers. Set a comfortable speed that fits your fitness level.",
      icon: <FaRunning className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Sherpa Guide",
      desc: "A dedicated guide focused entirely on your health & safety, providing deep cultural and geographical insights.",
      icon: <FaUserShield className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Any Date",
      desc: "Choose any calendar date that works for your international flights and vacation schedules.",
      icon: <FaCalendarCheck className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Custom Hotels",
      desc: "Upgrade or downgrade lodging options to suit your preferences, from basic teahouses to boutique mountain resorts.",
      icon: <FaHotel className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Solo Friendly",
      desc: "We support single solo travelers with dedicated private guides, ensuring maximum safety and companionship.",
      icon: <FaUserCheck className="h-6 w-6 text-secondary" />,
    },
  ];

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
            100% Customized Trips
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-bgOffWhite">
            Exclusive Private Treks
          </h2>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-bgOffWhite/80 leading-relaxed font-sans">
            Unlike cookie-cutter group tours, we specialize in private treks. You set the date, you set the pace, and our guides look after only you.
          </p>
        </div>

        {/* 5-Column Grid (Slider on mobile, standard grid on desktop) */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory gap-6 lg:grid lg:grid-cols-5 lg:gap-6 -mx-4 px-4 lg:mx-0 lg:px-0"
        >
          {usps.map((usp, idx) => (
            <div
              key={idx}
              className="bg-[#10251c] border border-secondary/15 p-6 rounded-2xl text-center hover:border-secondary hover:shadow-xl transition-all duration-300 flex flex-col justify-between w-[260px] lg:w-auto shrink-0 snap-align-start"
            >
              <div>
                <div className="h-12 w-12 bg-secondary/10 border border-secondary/20 flex items-center justify-center rounded-xl mx-auto mb-5">
                  {usp.icon}
                </div>
                <h4 className="font-serif font-bold text-secondary text-lg mb-3 tracking-wide">{usp.title}</h4>
                <p className="text-xs text-bgOffWhite/75 leading-relaxed font-sans font-light">{usp.desc}</p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] uppercase tracking-wider text-secondary/70 font-semibold">
                USP Feature 0{idx + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Step-wise pagination dots (visible only on mobile/tablet) */}
        <div className="flex justify-center gap-2 mt-4 lg:hidden">
          {usps.map((_, idx) => (
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
