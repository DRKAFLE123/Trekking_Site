"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaClock, FaDollarSign, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [duration, setDuration] = useState("all");
  const [budget, setBudget] = useState("all");
  const router = useRouter();

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
      className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-secondary/20 shadow-2xl rounded-2xl md:rounded-full p-2.5 transition focus-within:border-secondary flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-2"
    >
      {/* Inputs Wrapper with Dividers */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* 1. Destination Search */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-2">
          <FaMapMarkerAlt className="text-secondary h-4.5 w-4.5 shrink-0" />
          <div className="flex-1 flex flex-col items-start min-w-0">
            <label className="text-[10px] uppercase font-bold text-muted tracking-wider leading-none mb-1">
              Where to?
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Trip (e.g. Everest)"
              className="w-full bg-transparent text-charcoal placeholder-muted focus:outline-none text-sm font-semibold"
            />
          </div>
        </div>

        {/* 2. Duration Dropdown */}
        <div className="w-full md:w-56 flex items-center gap-3 px-4 py-3 md:py-2">
          <FaClock className="text-secondary h-4.5 w-4.5 shrink-0" />
          <div className="flex-1 flex flex-col items-start min-w-0">
            <label className="text-[10px] uppercase font-bold text-muted tracking-wider leading-none mb-1">
              Duration
            </label>
            <div className="relative w-full flex items-center">
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-transparent text-charcoal focus:outline-none text-sm font-bold cursor-pointer appearance-none pr-6 z-10"
              >
                <option value="all" className="bg-white text-charcoal">All Durations</option>
                <option value="short" className="bg-white text-charcoal">Short (&lt; 10 Days)</option>
                <option value="medium" className="bg-white text-charcoal">Medium (10 - 14 Days)</option>
                <option value="long" className="bg-white text-charcoal">Long (14+ Days)</option>
              </select>
              <FaChevronDown className="absolute right-0 text-muted h-3 w-3 pointer-events-none z-0" />
            </div>
          </div>
        </div>

        {/* 3. Budget Dropdown */}
        <div className="w-full md:w-56 flex items-center gap-3 px-4 py-3 md:py-2">
          <FaDollarSign className="text-secondary h-4.5 w-4.5 shrink-0" />
          <div className="flex-1 flex flex-col items-start min-w-0">
            <label className="text-[10px] uppercase font-bold text-muted tracking-wider leading-none mb-1">
              Max Budget
            </label>
            <div className="relative w-full flex items-center">
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-transparent text-charcoal focus:outline-none text-sm font-bold cursor-pointer appearance-none pr-6 z-10"
              >
                <option value="all" className="bg-white text-charcoal">All Prices</option>
                <option value="under-1000" className="bg-white text-charcoal">Under $1000</option>
                <option value="1000-1500" className="bg-white text-charcoal">$1000 - $1500</option>
                <option value="over-1500" className="bg-white text-charcoal">Over $1500</option>
              </select>
              <FaChevronDown className="absolute right-0 text-muted h-3 w-3 pointer-events-none z-0" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Search CTA Button */}
      <button
        type="submit"
        className="bg-primary hover:bg-secondary text-bgOffWhite hover:text-primary font-bold py-3.5 px-8 rounded-xl md:rounded-full border border-primary hover:border-secondary flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all duration-300 shrink-0 shadow-md hover:shadow-xl active:scale-95"
        aria-label="Search"
      >
        <FaSearch className="h-3.5 w-3.5" />
        <span>Search</span>
      </button>
    </form>
  );
}
