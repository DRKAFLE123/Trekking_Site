"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaQuestionCircle, FaChevronDown, FaArrowRight, FaSearch } from "react-icons/fa";

interface FAQItem {
  id: string;
  q: string;
  a: string;
  category: string;
  isFeatured: boolean;
  showOnAllTreks: boolean;
  trekIds: string[];
}

interface FAQsPageClientProps {
  faqs: FAQItem[];
  treks: { id: string; title: string; slug: string }[];
}

const FAQ_CATEGORY_LABELS: Record<string, string> = {
  general: 'Basic Information',
  prep_fitness: 'Physical Readiness & Training',
  permits: 'Entry permit',
  insurance_visa: 'Assurance and Travel permit',
  guides_staff: 'Himalayan Guide & Support Team',
  accommodation_facilities: 'Where You Stay & What’s Included',
  food_drinks: 'Meals and Refreshments',
  weather_seasons: 'Weather Patterns & Seasonal Changes',
  health_safety: 'Health Protection & Safety',
  packing_gear: 'Equipment & Packing List',
  booking_payments: 'Trip Booking & Payment Policy',
  transportation_flights: 'Flights & Ground Transport',
};

const CATEGORY_ORDER = [
  'Basic Information',
  'Physical Readiness & Training',
  'Entry permit',
  'Assurance and Travel permit',
  'Himalayan Guide & Support Team',
  'Where You Stay & What’s Included',
  'Meals and Refreshments',
  'Weather Patterns & Seasonal Changes',
  'Health Protection & Safety',
  'Equipment & Packing List',
  'Trip Booking & Payment Policy',
  'Flights & Ground Transport',
];

export default function FAQsPageClient({ faqs, treks }: FAQsPageClientProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all"); // "all" | "general" | trekId

  const toggle = (key: string) =>
    setOpen((p) => ({ ...p, [key]: !p[key] }));

  // 1. Filter FAQs based on search and selected trek/category filter
  const filteredFaqs = faqs.filter((faq) => {
    // Search text matching
    const matchesSearch =
      !search ||
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Filter by trek/general
    if (selectedFilter === "all") {
      return true;
    }
    if (selectedFilter === "general") {
      return faq.showOnAllTreks || faq.trekIds.length === 0;
    }
    // Specific trek ID
    return faq.trekIds.includes(selectedFilter) || faq.showOnAllTreks;
  });

  // 2. Group filtered FAQs by category labels
  const grouped: Record<string, FAQItem[]> = {};
  filteredFaqs.forEach((faq) => {
    const label = FAQ_CATEGORY_LABELS[faq.category] || faq.category || "Basic Information";
    if (!grouped[label]) {
      grouped[label] = [];
    }
    grouped[label].push(faq);
  });

  // Get active categories in order
  const activeCategories = CATEGORY_ORDER.filter((cat) => grouped[cat]?.length > 0);
  // Add any custom categories not in order list
  Object.keys(grouped).forEach((cat) => {
    if (!activeCategories.includes(cat)) {
      activeCategories.push(cat);
    }
  });

  // Find active trek label for helper text
  const selectedTrek = treks.find((t) => t.id === selectedFilter);

  return (
    <div className="bg-[#fcfbfa] min-h-screen">
      {/* Hero */}
      <div className="relative w-full bg-[#1a2e1f] py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
            <FaQuestionCircle /> Help Center
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-white leading-tight mb-5">
            Frequently Asked Questions
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            Find answers to questions about permits, fitness, safety, accommodation, and booking policies for your Nepal trek.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto mb-6">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-white/40 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#F5A623] transition"
            />
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className="flex bg-white/10 backdrop-blur-sm border border-white/20 p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  selectedFilter === "all" ? "bg-secondary text-primary shadow" : "text-white/80 hover:text-white"
                }`}
              >
                All FAQs
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("general")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  selectedFilter === "general" ? "bg-secondary text-primary shadow" : "text-white/80 hover:text-white"
                }`}
              >
                General Info
              </button>
            </div>

            {treks.length > 0 && (
              <div className="relative w-full sm:w-64">
                <select
                  value={selectedFilter !== "all" && selectedFilter !== "general" ? selectedFilter : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedFilter(val ? val : "all");
                  }}
                  className="w-full bg-white/10 border border-white/20 backdrop-blur-sm text-white rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-[#F5A623] cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 10px center",
                    backgroundSize: "20px",
                    backgroundRepeat: "no-repeat",
                    paddingRight: "30px",
                  }}
                >
                  <option value="" className="text-primary font-bold bg-white">-- Filter by Trek Package --</option>
                  {treks.map((t) => (
                    <option key={t.id} value={t.id} className="text-primary font-semibold bg-white">
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="text-xs text-[#6B6B6B] flex items-center gap-1.5 font-semibold flex-wrap">
          <Link href="/" className="hover:text-[#2E7D32] transition">Home</Link>
          <span className="text-[#D0D0D0]">/</span>
          <Link href="/why-us" className="hover:text-[#2E7D32] transition">Travel Info</Link>
          <span className="text-[#D0D0D0]">/</span>
          <span className="text-[#1A1A2E] font-medium">FAQs</span>
        </div>
        {selectedTrek && (
          <div className="mt-4 bg-[#2E7D32]/5 border border-[#2E7D32]/10 rounded-xl p-3.5 text-xs text-[#1a2e1f] font-semibold">
            Showing specific FAQs for <span className="font-bold text-[#2E7D32]">{selectedTrek.title}</span> (along with general travel info).
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-10">
        {activeCategories.length === 0 && (
          <div className="text-center py-16 text-[#6B6B6B]">
            <FaQuestionCircle className="text-5xl mx-auto mb-4 opacity-20" />
            <p className="font-semibold">No FAQs match your search or filter criteria.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedFilter("all");
              }}
              className="mt-3 text-sm text-[#2E7D32] hover:underline font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {activeCategories.map((cat) => (
          <section key={cat}>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#1a2e1f] mb-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-[#2E7D32]/30 to-transparent" />
              {cat}
              <span className="h-px flex-1 bg-gradient-to-l from-[#2E7D32]/30 to-transparent" />
            </h2>

            <div className="flex flex-col gap-3">
              {grouped[cat].map((faq) => {
                const key = faq.id;
                const isOpen = !!open[key];
                return (
                  <div
                    key={key}
                    className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                      isOpen ? "border-[#2E7D32]/30 shadow-md" : "border-[#E5E5E5]"
                    }`}
                  >
                    <button
                      onClick={() => toggle(key)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 group focus:outline-none"
                    >
                      <span
                        className={`font-serif font-bold text-sm md:text-base transition ${
                          isOpen ? "text-[#2E7D32]" : "text-[#1A1A2E] group-hover:text-[#2E7D32]"
                        }`}
                      >
                        {faq.q}
                      </span>
                      <span
                        className={`text-[#2E7D32] transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <FaChevronDown />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-[#E5E5E5] pt-4">
                        <p className="text-sm text-[#3D3D3D] leading-relaxed whitespace-pre-line">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Still have questions */}
        <div className="bg-[#1a2e1f] text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif font-black text-xl text-white mb-1">
              Still have a question?
            </h3>
            <p className="text-white/60 text-sm">
              Our Himalayan specialists respond within 24 hours, 7 days a week.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contact-us"
              className="flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e8950f] text-[#1a2e1f] font-bold py-3 px-6 rounded-xl text-sm transition"
            >
              Send a Message <FaArrowRight className="text-xs" />
            </Link>
            <a
              href="https://wa.me/9779851218358"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-xl text-sm transition"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/visa-info", label: "Visa Information" },
            { href: "/travel-insurance", label: "Travel Insurance" },
            { href: "/packing-list", label: "Packing List" },
            { href: "/why-us", label: "Why Choose Us" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] border border-[#2E7D32]/30 bg-emerald-50 px-3 py-1.5 rounded-full transition"
            >
              {l.label} <FaArrowRight className="text-[9px]" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
