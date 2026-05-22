"use client";

import React, { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white border border-secondary/20 shadow-2xl hover:bg-primary-light hover:scale-105 active:scale-95 transition-all duration-300"
      aria-label="Back to Top"
    >
      <FaChevronUp className="h-5 w-5 text-secondary" />
    </button>
  );
}
