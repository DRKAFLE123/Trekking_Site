"use client";

import React, { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_consent";

// Three-state pattern: until we've read localStorage we render nothing.
// That avoids both (a) the SSR→client hydration mismatch from rendering
// the banner on the server when the user may have already consented, and
// (b) the banner flashing on every navigation while we sync state.
type ConsentState = "checking" | "needed" | "hidden";

export default function CookieConsent() {
  const [state, setState] = useState<ConsentState>("checking");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // Any prior choice (accepted/declined) hides the banner. The earlier
      // version persisted nothing on Decline, so the banner came back on
      // every page — that's fixed below.
      setState(stored === "accepted" || stored === "declined" ? "hidden" : "needed");
    } catch {
      // localStorage blocked (private mode, browser policy). Best we can
      // do is fall back to a session-scoped memory choice: show the banner
      // once per visit and rely on the close click to hide it for the rest
      // of this tab session.
      setState("needed");
    }
  }, []);

  const persist = (value: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Private mode etc — we still want to hide the banner for the rest
      // of this tab session even if we can't persist across reloads.
    }
    setState("hidden");
  };

  if (state !== "needed") return null;

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
            type="button"
            onClick={() => persist("declined")}
            className="text-xs hover:underline text-bgOffWhite/70 hover:text-white transition"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => persist("accepted")}
            className="bg-secondary text-primary font-bold px-6 py-2 rounded-xl text-sm hover:bg-secondary-light active:scale-95 transition-all duration-300"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
