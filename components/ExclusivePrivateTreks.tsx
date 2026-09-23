"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

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

// One illustration per USP, matched by position (1st USP -> pace, 2nd -> guide ...).
const IMAGES = [
  "/private-treks/pace.webp",
  "/private-treks/guide.webp",
  "/private-treks/any-date.webp",
  "/private-treks/hotels.webp",
  "/private-treks/solo.webp",
];

const DEFAULT_USPS: PrivateTreksUSP[] = [
  {
    title: "Your Pace",
    description:
      "No rushing to catch up, no waiting for slower hikers. Set a comfortable speed that fits your fitness level.",
  },
  {
    title: "Sherpa Guide",
    description:
      "A dedicated guide focused entirely on your health & safety, providing deep cultural and geographical insights.",
  },
  {
    title: "Any Date",
    description:
      "Choose any calendar date that works for your international flights and vacation schedules.",
  },
  {
    title: "Custom Hotels",
    description:
      "Upgrade or downgrade lodging options to suit your preferences, from basic teahouses to boutique mountain resorts.",
  },
  {
    title: "Solo Friendly",
    description:
      "We support single solo travelers with dedicated private guides, ensuring maximum safety and companionship.",
  },
];

const ROTATE_MS = 5000;

export default function ExclusivePrivateTreks({
  kicker,
  title,
  description,
  usps,
}: ExclusivePrivateTreksProps = {}) {
  const items = (usps && usps.length > 0 ? usps : DEFAULT_USPS).slice(0, IMAGES.length);
  const displayKicker = kicker || "100% Customized Trips";
  const displayTitle = title || "Exclusive Private Treks";
  const displayDescription =
    description ||
    "Unlike cookie-cutter group tours, we specialize in private treks. You set the date, you set the pace, and our guides look after only you.";

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % items.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, items.length]);

  return (
    <section
      className="py-16 md:py-24 px-4 md:px-6 bg-primary text-white relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">{displayKicker}</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">{displayTitle}</h2>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6" />
          <p className="text-sm md:text-base text-white/80 leading-relaxed">{displayDescription}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Illustration for the active USP */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square max-w-md mx-auto rounded-2xl bg-white shadow-2xl ring-1 ring-white/10 overflow-hidden">
              {items.map((it, i) => (
                <Image
                  key={i}
                  src={IMAGES[i]}
                  alt={it.title}
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className={`object-contain p-3 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
                />
              ))}
              <div className="absolute bottom-4 left-4 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 shadow">
                {String(active + 1).padStart(2, "0")} · {items[active]?.title}
              </div>
            </div>
          </div>

          {/* USP list: hover/tap a row to switch the illustration */}
          <ol className="lg:col-span-7 flex flex-col gap-3">
            {items.map((it, i) => {
              const text = it.description || it.desc || "";
              const isActive = i === active;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`w-full text-left flex items-start gap-4 md:gap-5 rounded-xl border px-4 py-4 md:px-5 transition-all duration-300 ${
                      isActive
                        ? "bg-[#10251c] border-secondary shadow-lg"
                        : "bg-white/[0.03] border-white/10 hover:border-secondary/50"
                    }`}
                  >
                    <span
                      className={`font-serif text-2xl md:text-3xl font-black leading-none tabular-nums shrink-0 w-10 pt-0.5 ${
                        isActive ? "text-secondary" : "text-white/30"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-serif font-bold text-base md:text-lg">{it.title}</span>
                      <span className={`block text-xs md:text-sm leading-relaxed text-white/70 mt-1 ${isActive ? "" : "hidden md:block"}`}>
                        {text}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-10 md:mt-12">
          <Link
            href="/private-treks"
            className="bg-secondary text-white font-bold px-8 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition shadow-lg"
          >
            Learn More About Private Treks
            <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/plan-a-trip"
            className="border border-white/30 text-white font-bold px-8 py-3.5 rounded-xl inline-flex items-center justify-center hover:bg-white hover:text-primary transition"
          >
            Plan a Private Trip
          </Link>
        </div>
      </div>
    </section>
  );
}
