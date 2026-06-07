"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaClock, FaDollarSign, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [duration, setDuration] = useState("all");
  const [budget, setBudget] = useState("all");
  
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  
  const durationRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (durationRef.current && !durationRef.current.contains(event.target as Node)) {
        setIsDurationOpen(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
        setIsBudgetOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const durationOptions = [
    { value: "all", label: "All Durations" },
    { value: "short", label: "Short (< 10 Days)" },
    { value: "medium", label: "Medium (10 - 14 Days)" },
    { value: "long", label: "Long (14+ Days)" },
  ];

  const budgetOptions = [
    { value: "all", label: "All Prices" },
    { value: "under-1000", label: "Under $1000" },
    { value: "1000-1500", label: "$1000 - $1500" },
    { value: "over-1500", label: "Over $1500" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let url = "/trips?";
    const params = [];
    if (query.trim()) params.push(`search=${encodeURIComponent(query.trim())}`);
    if (duration !== "all") params.push(`duration=${duration}`);
    if (budget !== "all") params.push(`budget=${budget}`);
    url += params.join("&");
    router.push(url);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-secondary/20 shadow-2xl rounded-full p-1.5 md:p-2.5 transition focus-within:border-secondary flex flex-row items-center gap-2"
    >
      {/* Inputs Wrapper with Dividers */}
      <div className="flex-1 flex flex-row items-center divide-x divide-gray-200 min-w-0">
        {/* 1. Destination Search */}
        <div className="flex-1 flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 min-w-0">
          <FaMapMarkerAlt className="text-secondary h-4 w-4 md:h-4.5 md:w-4.5 shrink-0" />
          <div className="flex-1 flex flex-col items-start min-w-0">
            <label className="hidden sm:block text-[9px] md:text-[10px] uppercase font-bold text-muted tracking-wider leading-none mb-1">
              Where to?
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Trip (e.g. Everest)"
              className="w-full bg-transparent text-charcoal placeholder-muted focus:outline-none text-xs md:text-sm font-semibold"
            />
          </div>
        </div>

        {/* 2. Duration Dropdown (Hidden on mobile) */}
        <div ref={durationRef} className="hidden md:flex w-56 items-center gap-3 px-4 py-2 relative">
          <FaClock className="text-secondary h-4.5 w-4.5 shrink-0" />
          <div className="flex-1 flex flex-col items-start min-w-0">
            <label className="text-[10px] uppercase font-bold text-muted tracking-wider leading-none mb-1">
              Duration
            </label>
            <div className="relative w-full flex items-center">
              <button
                type="button"
                onClick={() => {
                  setIsDurationOpen(!isDurationOpen);
                  setIsBudgetOpen(false);
                }}
                className="w-full bg-transparent text-charcoal text-left focus:outline-none text-sm font-bold cursor-pointer pr-6 flex items-center justify-between"
              >
                <span className="truncate">
                  {durationOptions.find((o) => o.value === duration)?.label}
                </span>
                <FaChevronDown className={`text-muted h-3 w-3 transition-transform duration-200 ${isDurationOpen ? "rotate-180" : ""}`} />
              </button>

              {isDurationOpen && (
                <div className="absolute left-0 top-[calc(100%+12px)] w-56 bg-white border border-gray-150 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {durationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setDuration(opt.value);
                        setIsDurationOpen(false);
                      }}
                      className={`w-full text-left px-5 py-2.5 text-xs md:text-sm font-semibold transition-colors duration-150 flex items-center ${
                        duration === opt.value
                          ? "bg-secondary/15 text-primary font-bold"
                          : "text-charcoal hover:bg-slate-50 hover:text-primary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Budget Dropdown (Hidden on mobile) */}
        <div ref={budgetRef} className="hidden md:flex w-56 items-center gap-3 px-4 py-2 relative">
          <FaDollarSign className="text-secondary h-4.5 w-4.5 shrink-0" />
          <div className="flex-1 flex flex-col items-start min-w-0">
            <label className="text-[10px] uppercase font-bold text-muted tracking-wider leading-none mb-1">
              Max Budget
            </label>
            <div className="relative w-full flex items-center">
              <button
                type="button"
                onClick={() => {
                  setIsBudgetOpen(!isBudgetOpen);
                  setIsDurationOpen(false);
                }}
                className="w-full bg-transparent text-charcoal text-left focus:outline-none text-sm font-bold cursor-pointer pr-6 flex items-center justify-between"
              >
                <span className="truncate">
                  {budgetOptions.find((o) => o.value === budget)?.label}
                </span>
                <FaChevronDown className={`text-muted h-3 w-3 transition-transform duration-200 ${isBudgetOpen ? "rotate-180" : ""}`} />
              </button>

              {isBudgetOpen && (
                <div className="absolute left-0 top-[calc(100%+12px)] w-56 bg-white border border-gray-150 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setBudget(opt.value);
                        setIsBudgetOpen(false);
                      }}
                      className={`w-full text-left px-5 py-2.5 text-xs md:text-sm font-semibold transition-colors duration-150 flex items-center ${
                        budget === opt.value
                          ? "bg-secondary/15 text-primary font-bold"
                          : "text-charcoal hover:bg-slate-50 hover:text-primary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Search CTA Button */}
      <button
        type="submit"
        className="bg-primary hover:bg-secondary text-bgOffWhite hover:text-primary font-bold py-2 md:py-3.5 px-3.5 md:px-8 rounded-full border border-primary hover:border-secondary flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-wider transition-all duration-300 shrink-0 shadow-md hover:shadow-xl active:scale-95"
        aria-label="Search"
      >
        <FaSearch className="h-3.5 w-3.5" />
        <span className="hidden md:inline">Search</span>
      </button>
    </form>
  );
}
