"use client";

import React, { useState, useEffect } from "react";
import { FaListUl } from "react-icons/fa";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export default function ScrollSpyTOC() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Find the main article element
    const article = document.querySelector("article");
    if (!article) return;

    // Select all H2 and H3 elements inside the article
    const headingElements = article.querySelectorAll("h2, h3");
    const headingList: HeadingItem[] = [];

    headingElements.forEach((el, index) => {
      // Ensure the element has a unique ID
      let id = el.id;
      if (!id) {
        id = el.textContent
          ? el.textContent
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "")
          : `heading-${index}`;
        el.id = id;
      }

      headingList.push({
        id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(headingList);

    // Set up IntersectionObserver to track scroll spying
    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -60% 0px", // triggers when heading is in the upper middle area of the viewport
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  const handleScrollClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      
      // Update hash in URL
      window.history.pushState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
      <h3 className="font-serif text-lg font-bold text-[#1a2e1f] mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
        <FaListUl className="text-[#c8922a] text-sm" /> Table of Contents
      </h3>
      <nav className="relative">
        {/* Left vertical progress line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-gray-100"></div>

        <ul className="space-y-3 relative z-10 flex flex-col">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`pl-5 relative group transition-all duration-200 ${
                heading.level === 3 ? "ml-4" : ""
              }`}
            >
              {/* Left active bullet node */}
              <div
                className={`absolute left-0 top-[7px] w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  activeId === heading.id
                    ? "bg-[#c8922a] border-[#c8922a] scale-110 shadow-sm"
                    : "bg-white border-gray-300 group-hover:border-[#c8922a]"
                }`}
              ></div>
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleScrollClick(e, heading.id)}
                className={`block font-sans text-xs font-semibold leading-relaxed transition-all duration-300 ${
                  activeId === heading.id
                    ? "text-[#c8922a] translate-x-1"
                    : "text-gray-500 hover:text-[#c8922a]"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
