"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export type StatItem = { value: string; label: string };

/** "5,000+" -> { end: 5000, suffix: "+", decimals: 0 }; "4.9/5" -> { end: 4.9, suffix: "/5", decimals: 1 } */
function parseStat(value: string) {
  const m = value.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { end: Number(m[1].replace(/,/g, "")), suffix: m[2], decimals: (m[1].split(".")[1] || "").length };
}

function Counter({ value, started }: { value: string; started: boolean }) {
  const parsed = parseStat(value);
  const end = parsed?.end ?? 0;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!started || !parsed) return;
    let start: number | null = null;
    let raf = 0;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / 1800, 1);
      setN(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, end]);

  if (!parsed) {
    // Non-numeric value (e.g. "No"): pop in once visible.
    return started ? (
      <motion.span
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="font-serif inline-block"
      >
        {value}
      </motion.span>
    ) : (
      <span className="opacity-0 font-serif">{value}</span>
    );
  }

  return (
    <span className="font-serif tabular-nums">
      {n.toLocaleString(undefined, { minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals })}
      {parsed.suffix}
    </span>
  );
}

export default function StatsCounter({ items, transparent = false }: { items: StatItem[]; transparent?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${
        transparent
          ? "bg-black/30 backdrop-blur-md border-t border-white/10 py-5"
          : "bg-[#1a3c2e] border-y border-[#c8922a]/20 py-8"
      } text-white relative overflow-hidden w-full`}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col gap-1">
            <span className="text-3xl md:text-5xl font-black text-[#c8922a] tracking-tight min-h-[36px] md:min-h-[48px] flex items-center justify-center">
              <Counter value={it.value} started={started} />
            </span>
            <span className="text-xs md:text-sm text-white/80 font-bold tracking-wider uppercase">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
