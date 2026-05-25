"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaQuestionCircle, FaChevronDown, FaArrowRight, FaSearch } from "react-icons/fa";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  faqs: FAQItem[];
}

interface FAQsPageClientProps {
  initialFAQs: FAQCategory[];
}

export default function FAQsPageClient({ initialFAQs }: FAQsPageClientProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  const toggle = (key: string) =>
    setOpen((p) => ({ ...p, [key]: !p[key] }));

  const filtered = initialFAQs.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (f) =>
        !search ||
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.faqs.length > 0);

  const totalFAQs = initialFAQs.reduce((a, c) => a + c.faqs.length, 0);

  return (
    <div className="bg-[#fcfbfa] min-h-screen">
      {/* Hero */}
      <div className="relative w-full bg-[#1a2e1f] py-24 md:py-32 overflow-hidden">
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
          <h1 className="font-serif text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            Frequently Asked Questions
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            {totalFAQs} answers to the most common questions about trekking in Nepal — from permits and
            safety to booking and costs.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-white/40 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#F5A623] transition"
            />
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
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-10">

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#6B6B6B]">
            <FaQuestionCircle className="text-5xl mx-auto mb-4 opacity-20" />
            <p className="font-semibold">No results found for &ldquo;{search}&rdquo;</p>
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-sm text-[#2E7D32] hover:underline font-bold"
            >
              Clear search
            </button>
          </div>
        )}

        {filtered.map((cat) => (
          <section key={cat.category}>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#1a2e1f] mb-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-[#2E7D32]/30 to-transparent" />
              {cat.category}
              <span className="h-px flex-1 bg-gradient-to-l from-[#2E7D32]/30 to-transparent" />
            </h2>

            <div className="flex flex-col gap-3">
              {cat.faqs.map((faq, i) => {
                const key = `${cat.category}::${i}`;
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
                        <p className="text-sm text-[#3D3D3D] leading-relaxed">{faq.a}</p>
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
