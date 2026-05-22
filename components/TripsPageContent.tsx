"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSlidersH, FaTimes, FaSearch } from "react-icons/fa";
import { Trek, Region } from "@/types";
import TrekCard from "./TrekCard";

interface TripsPageContentProps {
  initialTreks: Trek[];
  regions: Region[];
}

export default function TripsPageContent({ initialTreks, regions }: TripsPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync URL search params on mount
  useEffect(() => {
    const search = searchParams.get("search");
    const duration = searchParams.get("duration");
    const budget = searchParams.get("budget");

    if (search) setSearchQuery(search);
    if (duration) setSelectedDuration(duration);
    if (budget) setSelectedBudget(budget);
  }, [searchParams]);

  // Handle difficulties toggles
  const handleDifficultyToggle = (diff: string) => {
    setSelectedDifficulty((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
  };

  // Handle region toggles
  const handleRegionToggle = (regSlug: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regSlug) ? prev.filter((r) => r !== regSlug) : [...prev, regSlug]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty([]);
    setSelectedRegions([]);
    setSelectedDuration("all");
    setSelectedBudget("all");
    setSortBy("featured");
    router.replace("/trips");
  };

  // Filtered and Sorted Treks memo
  const filteredTreks = useMemo(() => {
    let result = [...initialTreks];

    // 1. Text Search Filter (title or highlights)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (trek) =>
          trek.title.toLowerCase().includes(q) ||
          trek.highlights?.some((h) => 
            (typeof h === "string" ? h : (h as any)?.highlight || "").toLowerCase().includes(q)
          )
      );
    }

    // 2. Difficulty Filter
    if (selectedDifficulty.length > 0) {
      result = result.filter((trek) => selectedDifficulty.includes(trek.difficulty));
    }

    // 3. Region Filter
    if (selectedRegions.length > 0) {
      result = result.filter((trek) => selectedRegions.includes(trek.region.slug));
    }

    // 4. Duration Filter
    if (selectedDuration !== "all") {
      result = result.filter((trek) => {
        if (selectedDuration === "short") return trek.duration < 10;
        if (selectedDuration === "medium") return trek.duration >= 10 && trek.duration <= 14;
        if (selectedDuration === "long") return trek.duration > 14;
        return true;
      });
    }

    // 4.5. Budget Filter
    if (selectedBudget !== "all") {
      result = result.filter((trek) => {
        const price = trek.discountedPrice || trek.price;
        if (selectedBudget === "under-1000") return price < 1000;
        if (selectedBudget === "1000-1500") return price >= 1000 && price <= 1500;
        if (selectedBudget === "over-1500") return price > 1500;
        return true;
      });
    }

    // 5. Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
    } else if (sortBy === "duration-asc") {
      result.sort((a, b) => a.duration - b.duration);
    } else if (sortBy === "duration-desc") {
      result.sort((a, b) => b.duration - a.duration);
    }

    return result;
  }, [initialTreks, searchQuery, selectedDifficulty, selectedRegions, selectedDuration, selectedBudget, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedDifficulty.length > 0 ||
    selectedRegions.length > 0 ||
    selectedDuration !== "all" ||
    selectedBudget !== "all";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-secondary/15">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary">Explore All Trekking Trips</h1>
          <p className="text-sm text-charcoal/70 mt-2">
            Showing {filteredTreks.length} of {initialTreks.length} trekking itineraries in Nepal
          </p>
        </div>

        {/* Sorting and Mobile Filter triggers */}
        <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-between sm:justify-start">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 bg-primary text-bgOffWhite px-4 py-2.5 rounded-xl text-sm font-semibold border border-primary active:scale-95 transition"
          >
            <FaSlidersH />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal/60 font-semibold tracking-wider uppercase whitespace-nowrap">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-secondary/20 rounded-xl px-4 py-2 text-sm text-charcoal focus:outline-none focus:border-secondary"
            >
              <option value="featured">Best Matches</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Short to Long</option>
              <option value="duration-desc">Duration: Long to Short</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:flex flex-col gap-8 bg-white border border-secondary/10 shadow-lg rounded-2xl p-6 sticky top-28">
          <div className="flex justify-between items-center border-b border-primary/5 pb-3">
            <h3 className="font-serif font-bold text-primary text-lg">Filter Trips</h3>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs font-bold text-secondary hover:underline">
                Clear All
              </button>
            )}
          </div>

          {/* Text Search */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trip name..."
                className="w-full bg-bgOffWhite border border-secondary/20 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-secondary text-charcoal"
              />
              <FaSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted h-3.5 w-3.5" />
            </div>
          </div>

          {/* Region Filter */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Regions</label>
            <div className="flex flex-col gap-2">
              {regions.map((reg) => (
                <label key={reg.id} className="flex items-center gap-2.5 text-sm text-charcoal/80 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(reg.slug)}
                    onChange={() => handleRegionToggle(reg.slug)}
                    className="h-4 w-4 rounded border-secondary/20 text-secondary focus:ring-secondary cursor-pointer accent-secondary"
                  />
                  <span>{reg.name} Region</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Difficulty</label>
            <div className="flex flex-col gap-2">
              {["easy", "moderate", "hard", "extreme"].map((diff) => (
                <label key={diff} className="flex items-center gap-2.5 text-sm text-charcoal/80 cursor-pointer select-none capitalize">
                  <input
                    type="checkbox"
                    checked={selectedDifficulty.includes(diff)}
                    onChange={() => handleDifficultyToggle(diff)}
                    className="h-4 w-4 rounded border-secondary/20 text-secondary focus:ring-secondary cursor-pointer accent-secondary"
                  />
                  <span>{diff}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Duration</label>
            <div className="flex flex-col gap-2">
              {[
                { label: "All Durations", value: "all" },
                { label: "Short (< 10 Days)", value: "short" },
                { label: "Medium (10 - 14 Days)", value: "medium" },
                { label: "Long (14+ Days)", value: "long" },
              ].map((dur) => (
                <label key={dur.value} className="flex items-center gap-2.5 text-sm text-charcoal/80 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="duration"
                    value={dur.value}
                    checked={selectedDuration === dur.value}
                    onChange={() => setSelectedDuration(dur.value)}
                    className="h-4 w-4 border-secondary/20 text-secondary focus:ring-secondary cursor-pointer accent-secondary"
                  />
                  <span>{dur.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget Filter */}
          <div className="flex flex-col gap-2.5 border-t border-primary/5 pt-4">
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Budget</label>
            <div className="flex flex-col gap-2">
              {[
                { label: "All Budgets", value: "all" },
                { label: "Under $1000", value: "under-1000" },
                { label: "$1000 - $1500", value: "1000-1500" },
                { label: "Over $1500", value: "over-1500" },
              ].map((bud) => (
                <label key={bud.value} className="flex items-center gap-2.5 text-sm text-charcoal/80 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="budget"
                    value={bud.value}
                    checked={selectedBudget === bud.value}
                    onChange={() => setSelectedBudget(bud.value)}
                    className="h-4 w-4 border-secondary/20 text-secondary focus:ring-secondary cursor-pointer accent-secondary"
                  />
                  <span>{bud.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Trips Grid */}
        <div className="lg:col-span-3">
          {filteredTreks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredTreks.map((trek) => (
                <TrekCard key={trek.id} trek={trek} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-secondary/10 rounded-2xl p-8 flex flex-col items-center gap-4">
              <span className="text-5xl">🏔️</span>
              <h3 className="font-serif font-bold text-xl text-primary">No treks match your filters</h3>
              <p className="text-sm text-charcoal/70 max-w-sm">
                Try clearing your filters or updating your search query to find matching treks.
              </p>
              <button
                onClick={resetFilters}
                className="bg-secondary text-primary font-bold px-6 py-2.5 rounded-xl text-sm hover:scale-105 active:scale-95 transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slider Filters Menu */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Overlay */}
          <div onClick={() => setShowMobileFilters(false)} className="fixed inset-0 bg-black/60"></div>
          
          {/* Menu */}
          <div className="relative w-4/5 max-w-sm bg-white h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-primary/5 pb-3">
                <h3 className="font-serif font-bold text-primary text-lg">Filter Trips</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-charcoal hover:text-secondary p-1">
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              {/* Text Search */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search trip name..."
                    className="w-full bg-bgOffWhite border border-secondary/20 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-secondary"
                  />
                  <FaSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted h-3.5 w-3.5" />
                </div>
              </div>

              {/* Region Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Regions</label>
                <div className="flex flex-col gap-2">
                  {regions.map((reg) => (
                    <label key={reg.id} className="flex items-center gap-2.5 text-sm text-charcoal/80">
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(reg.slug)}
                        onChange={() => handleRegionToggle(reg.slug)}
                        className="h-4 w-4 rounded text-secondary accent-secondary"
                      />
                      <span>{reg.name} Region</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Difficulty</label>
                <div className="flex flex-col gap-2">
                  {["easy", "moderate", "hard", "extreme"].map((diff) => (
                    <label key={diff} className="flex items-center gap-2.5 text-sm text-charcoal/80 capitalize">
                      <input
                        type="checkbox"
                        checked={selectedDifficulty.includes(diff)}
                        onChange={() => handleDifficultyToggle(diff)}
                        className="h-4 w-4 rounded text-secondary accent-secondary"
                      />
                      <span>{diff}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Duration</label>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "All Durations", value: "all" },
                    { label: "Short (< 10 Days)", value: "short" },
                    { label: "Medium (10 - 14 Days)", value: "medium" },
                    { label: "Long (14+ Days)", value: "long" },
                  ].map((dur) => (
                    <label key={dur.value} className="flex items-center gap-2.5 text-sm text-charcoal/80">
                      <input
                        type="radio"
                        name="duration-mobile"
                        value={dur.value}
                        checked={selectedDuration === dur.value}
                        onChange={() => setSelectedDuration(dur.value)}
                        className="h-4 w-4 text-secondary accent-secondary"
                      />
                      <span>{dur.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Filter */}
              <div className="flex flex-col gap-2 border-t border-primary/5 pt-4">
                <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Budget</label>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "All Budgets", value: "all" },
                    { label: "Under $1000", value: "under-1000" },
                    { label: "$1000 - $1500", value: "1000-1500" },
                    { label: "Over $1500", value: "over-1500" },
                  ].map((bud) => (
                    <label key={bud.value} className="flex items-center gap-2.5 text-sm text-charcoal/80">
                      <input
                        type="radio"
                        name="budget-mobile"
                        value={bud.value}
                        checked={selectedBudget === bud.value}
                        onChange={() => setSelectedBudget(bud.value)}
                        className="h-4 w-4 text-secondary accent-secondary"
                      />
                      <span>{bud.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-12 pt-6 border-t border-primary/5">
              <button
                onClick={resetFilters}
                className="w-1/2 bg-bgOffWhite hover:bg-charcoal/10 font-bold py-2.5 rounded-xl text-sm transition"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-1/2 bg-primary text-bgOffWhite font-bold py-2.5 rounded-xl text-sm hover:bg-secondary hover:text-primary transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
