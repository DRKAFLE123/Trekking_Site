"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface CounterItemProps {
  end: number;
  suffix: string;
  duration?: number;
}

function CounterItem({ end, suffix, duration = 2000 }: CounterItemProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <span ref={elementRef} className="font-serif">
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function StatsCounter({ transparent = false }: { transparent?: boolean }) {
  const [showNo, setShowNo] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Delay showing "No" to sync with count-up animation
          setTimeout(() => {
            setShowNo(true);
          }, 400);
        }
      },
      { threshold: 0.1 }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={triggerRef} 
      className={`${
        transparent 
          ? "bg-black/30 backdrop-blur-md border-t border-white/10 py-5" 
          : "bg-[#1a3c2e] border-y border-[#c8922a]/20 py-8"
      } text-white relative overflow-hidden w-full`}
    >
      {/* Background overlay accent */}
      {!transparent && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />
      )}
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
        
        {/* Item 1 */}
        <div className="flex flex-col gap-1">
          <span className="text-3xl md:text-5xl font-black text-[#c8922a] tracking-tight">
            <CounterItem end={10000} suffix="+" />
          </span>
          <span className="text-xs md:text-sm text-white/80 font-bold tracking-wider uppercase">
            Clients
          </span>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col gap-1">
          <span className="text-3xl md:text-5xl font-black text-[#c8922a] tracking-tight">
            <CounterItem end={15} suffix="+" />
          </span>
          <span className="text-xs md:text-sm text-white/80 font-bold tracking-wider uppercase">
            Years
          </span>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col gap-1">
          <span className="text-3xl md:text-5xl font-black text-[#c8922a] tracking-tight">
            <CounterItem end={100} suffix="%" />
          </span>
          <span className="text-xs md:text-sm text-white/80 font-bold tracking-wider uppercase">
            Private
          </span>
        </div>

        {/* Item 4 */}
        <div className="flex flex-col gap-1">
          <span className="text-3xl md:text-5xl font-black text-[#c8922a] tracking-tight min-h-[36px] md:min-h-[48px] flex items-center justify-center">
            {showNo ? (
              <motion.span
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                className="font-serif inline-block"
              >
                No
              </motion.span>
            ) : (
              <span className="opacity-0 font-serif">No</span>
            )}
          </span>
          <span className="text-xs md:text-sm text-white/80 font-bold tracking-wider uppercase">
            Hidden Fees
          </span>
        </div>

      </div>
    </section>
  );
}
