"use client";

import React, { useEffect, useState } from "react";

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-charcoal text-white border-t border-secondary/20 shadow-2xl animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-bgOffWhite/90 text-center md:text-left">
          <p>
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By
            clicking &quot;Accept All&quot;, you consent to our use of cookies.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs hover:underline text-bgOffWhite/70 hover:text-white transition"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="bg-secondary text-primary font-bold px-6 py-2 rounded-xl text-sm hover:bg-secondary-light active:scale-95 transition-all duration-300"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
