"use client";

import React, { useState, useMemo } from "react";
import { FaChevronDown, FaSearch, FaExpandArrowsAlt, FaCompressArrowsAlt } from "react-icons/fa";

interface TermsAccordionProps {
  sections: {
    title: string;
    contentElement: React.ReactNode;
  }[];
}

export default function TermsAccordion({ sections }: TermsAccordionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const expandAll = () => {
    const newState: Record<number, boolean> = {};
    sections.forEach((_, idx) => {
      newState[idx] = true;
    });
    setOpenSections(newState);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter((s) => s.title.toLowerCase().includes(query));
  }, [sections, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#fbfbfc] border border-gray-100 p-4 rounded-xl shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <FaSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search terms (e.g. cancellation, deposit, payment)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1a2e1f] placeholder-gray-400 focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition"
          />
        </div>

        {/* Expand/Collapse All */}
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={expandAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-[#2E7D32] hover:text-[#2E7D32] text-charcoal/80 rounded-lg text-xs font-bold font-sans transition shadow-sm active:scale-95"
          >
            <FaExpandArrowsAlt className="text-[#c8922a]" />
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-red-400 hover:text-red-500 text-charcoal/80 rounded-lg text-xs font-bold font-sans transition shadow-sm active:scale-95"
          >
            <FaCompressArrowsAlt />
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion List */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 text-sm">No sections found matching &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredSections.map((section, idx) => {
            const originalIndex = sections.findIndex((s) => s.title === section.title);
            const isOpen = !!openSections[originalIndex];

            return (
              <div
                key={originalIndex}
                className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-[#2E7D32] shadow-md ring-1 ring-[#2E7D32]/10"
                    : "border-gray-100 hover:border-[#c8922a] hover:shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggleSection(originalIndex)}
                  className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-base md:text-lg text-[#1a2e1f] hover:text-[#2E7D32] transition duration-200 select-none bg-white"
                >
                  <span>{section.title}</span>
                  <span
                    className={`text-gray-400 transition-transform duration-300 shrink-0 ml-4 ${
                      isOpen ? "transform rotate-180 text-[#2E7D32]" : ""
                    }`}
                  >
                    <FaChevronDown />
                  </span>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[2000px] opacity-100 border-t border-gray-50" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 md:p-8 bg-[#fbfbfc]/30">
                    <article
                      className="prose prose-sm md:prose-base max-w-none 
                        prose-headings:font-serif prose-headings:text-[#1a2e1f]
                        prose-p:text-[#4A4A4A] prose-p:leading-relaxed prose-p:mb-4
                        prose-strong:text-[#1a2e1f]
                        prose-a:text-[#c8922a] prose-a:font-semibold hover:prose-a:text-[#b07820]
                        prose-li:text-[#4A4A4A] prose-li:marker:text-[#c8922a]
                        prose-img:rounded-xl"
                    >
                      {section.contentElement}
                    </article>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
