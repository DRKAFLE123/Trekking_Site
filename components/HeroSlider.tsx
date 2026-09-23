"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export type HeroSlide = {
  title: string;
  href: string;
  image: string;
  /** e.g. "14 days · from $1,750" */
  meta?: string;
};

const INTERVAL_MS = 6000;
const BTN =
  "h-11 w-11 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white hover:text-primary transition active:scale-95";

/**
 * Homepage hero: crossfading image slides (one per featured trek), thumbnail
 * rail, counter + arrows, and a caption card linking to the active trek.
 * The page owns the single <h1> and passes it in as children, so the slides
 * never add headings of their own.
 */
export default function HeroSlider({
  slides,
  children,
  footer,
}: {
  slides: HeroSlide[];
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const n = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  useEffect(() => {
    if (n < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % n), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [n, paused]);

  const current = slides[active];

  return (
    <section
      className="relative w-full h-[88svh] min-h-[620px] md:h-[90vh] md:min-h-[680px] max-h-[1000px] bg-primary overflow-hidden flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {slides.map((s, i) => (
          <div
            key={s.href}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === active ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={s.image}
              alt=""
              fill
              sizes="100vw"
              quality={70}
              priority={i === 0}
              className={`object-cover ${i === active ? "hero-kenburns" : ""}`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/25" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
      </div>

      {/* Page-owned content (h1, search, CTA) */}
      <div className="relative z-20 grow flex flex-col justify-center pt-8 pb-6">{children}</div>

      {/* Counter, arrows and active-trek caption */}
      {n > 0 && (
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-5 flex items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <span className="font-serif text-2xl md:text-3xl font-black tabular-nums leading-none">
              {String(active + 1).padStart(2, "0")}
              <span className="text-sm text-white/60 font-sans font-semibold"> / {String(n).padStart(2, "0")}</span>
            </span>
            {n > 1 && (
              <div className="flex gap-2">
                <button type="button" onClick={() => go(active - 1)} aria-label="Previous trek" className={BTN}>
                  <FaArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => go(active + 1)} aria-label="Next trek" className={BTN}>
                  <FaArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <Link
            href={current.href}
            className="group flex items-center gap-3 rounded-[5px] bg-white/10 backdrop-blur border border-white/15 px-4 py-2.5 hover:bg-white/20 transition max-w-[62%] sm:max-w-md"
          >
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Featured trek</span>
              <span className="block font-serif font-bold text-sm md:text-base leading-tight truncate">{current.title}</span>
              {current.meta && <span className="block text-[11px] text-white/70">{current.meta}</span>}
            </span>
            <FaArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      )}

      {footer && <div className="relative z-20 hidden md:block">{footer}</div>}

      {/* Thumbnail rail (desktop) */}
      {n > 1 && (
        <ul className="absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3" aria-label="Featured treks">
          {slides.map((s, i) => (
            <li key={s.href}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${s.title}`}
                aria-current={i === active}
                className={`relative block h-12 w-12 xl:h-14 xl:w-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  i === active ? "border-white scale-110 shadow-lg" : "border-white/30 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={s.image} alt="" fill sizes="56px" quality={60} className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
