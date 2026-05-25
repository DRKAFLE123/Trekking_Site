"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes, FaWhatsapp, FaChevronDown, FaSearch, FaStar, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Trip data (extended)
const TRIP_DATA: Record<string, { title: string; slug: string }[]> = {
  "All Trips": [],
  "Everest Treks": [
    { title: "Everest Base Camp Trek - 14 Days", slug: "everest-base-camp-trek-14" },
    { title: "Everest Base Camp Trek - 12 Days", slug: "everest-base-camp-trek-12" },
    { title: "Everest Base Camp Trek via Gokyo Lakes - 15 Days", slug: "everest-base-camp-gokyo-lakes-15" },
    { title: "Everest Base Camp Chola Pass Gokyo Trek - 15 Days", slug: "everest-chola-pass-gokyo-15" },
    { title: "Everest Base Camp Short Trek - 10 Days", slug: "everest-base-camp-short-10" },
    { title: "Gokyo Ri Trek - 11 Days", slug: "gokyo-ri-11" },
    { title: "Everest Three Passes Trek - 17 Days", slug: "everest-three-passes-17" },
    { title: "Everest High Pass Trek - 15 Days", slug: "everest-high-pass-15" },
    { title: "Everest View Trek - 7 Days", slug: "everest-view-7" },
    { title: "Luxury Everest Base Camp Trek - 14 Days", slug: "luxury-everest-base-camp-14" },
    { title: "Ama Dablam Base Camp - 13 Days", slug: "ama-dablam-base-camp-13" },
    { title: "Everest Base Camp Hike - 17 Days", slug: "everest-base-camp-hike-17" },
    { title: "Everest Base Camp Helicopter - 10 Days", slug: "everest-helicopter-10" },
    { title: "Everest Base Camp Helicopter - 5 Days", slug: "everest-helicopter-5" },
    { title: "Island Peak Climbing with EBC - 16 Days", slug: "island-peak-climbing-16" },
    { title: "Everest Base Camp Trek - 15 Days", slug: "everest-base-camp-15" },
    { title: "Everest Base Camp Helicopter Tour - 1 Day", slug: "everest-helicopter-tour-1" },
    { title: "Everest Helicopter Tour - 10 Days", slug: "everest-helicopter-tour-10" },
    { title: "Everest Base Camp trek with Gokyo Ri (avoiding Chola Pass) - 15 Days", slug: "everest-gokyo-ri-avoiding-chola-15" }
  ],
  "Annapurna Treks": [
    { title: "Annapurna Circuit Trek - 14 Days", slug: "annapurna-circuit-14" },
    { title: "Annapurna Base Camp Trek - 10 Days", slug: "annapurna-base-camp-10" }
  ],
  "Manaslu Treks": [
    { title: "Manaslu Circuit Trek - 16 Days", slug: "manaslu-circuit-16" },
    { title: "Manaslu Circuit Trek - 12 Days", slug: "manaslu-circuit-12" }
  ],
  "Langtang Treks": [
    { title: "Langtang Valley Trek - 8 Days", slug: "langtang-valley-8" }
  ],
  "Ganesh Himal Treks": [
    { title: "Ganesh Himal Trek - 10 Days", slug: "ganesh-himal-10" }
  ],
  "Mustang Treks": [
    { title: "Upper Mustang Trek - 12 Days", slug: "upper-mustang-12" },
    { title: "Muktinath Trek - 7 Days", slug: "muktinath-7" }
  ],
  "Peak Climbing In Nepal": [
    { title: "Island Peak Climbing - 16 Days", slug: "island-peak-16" },
    { title: "Ama Dablam Base Camp - 13 Days", slug: "ama-dablam-base-camp-13" }
  ],
  "Jungle Safari In Nepal": [
    { title: "Jungle Safari Trek - 12 Days", slug: "jungle-safari-12" }
  ]
};

// Populate All Trips dynamically
const allTripsMap = new Map<string, { title: string; slug: string }>();
Object.entries(TRIP_DATA).forEach(([cat, list]) => {
  if (cat !== "All Trips") {
    list.forEach(t => allTripsMap.set(t.slug, t));
  }
});
TRIP_DATA["All Trips"] = Array.from(allTripsMap.values());

const categories = Object.keys(TRIP_DATA);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Trips");
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollYRef = useRef(0);

  // Regions data (unchanged)
  const [regions, setRegions] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [treksCount, setTreksCount] = useState<number>(7);

  const getTop5Treks = () => {
    if (siteSettings?.top5Treks && Array.isArray(siteSettings.top5Treks) && siteSettings.top5Treks.length > 0) {
      return siteSettings.top5Treks.slice(0, 5).map((t: any) => {
        if (typeof t === "object" && t !== null) {
          return {
            title: t.title,
            slug: t.slug,
            duration: t.duration || 14,
            difficulty: t.difficulty || "moderate",
            price: t.price || 1200,
            discountedPrice: t.discountedPrice,
          };
        }
        return null;
      }).filter(Boolean);
    }
    return [
      { title: "Everest Base Camp Trek", slug: "everest-base-camp-trek", duration: 14, difficulty: "hard", price: 1399 },
      { title: "Annapurna Circuit Trek", slug: "annapurna-circuit-trek", duration: 14, difficulty: "hard", price: 1199 },
      { title: "Manaslu Circuit Trek", slug: "manaslu-circuit-trek", duration: 16, difficulty: "hard", price: 1499 },
      { title: "Langtang Valley Trek", slug: "langtang-valley-trek", duration: 8, difficulty: "moderate", price: 899 },
      { title: "Mardi Himal Trek", slug: "mardi-himal-trek", duration: 5, difficulty: "moderate", price: 699 },
    ];
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/regions");
        const data = await res.json();
        setRegions(data);
      } catch (err) {
        console.error("Error fetching navbar regions:", err);
      }
    }
    async function fetchSettings() {
      try {
        const res = await fetch("/api/site-settings");
        const data = await res.json();
        setSiteSettings(data);
      } catch (err) {
        console.error("Failed to fetch site settings in Navbar:", err);
      }
    }
    async function fetchTrips() {
      try {
        const res = await fetch("/api/trips");
        const data = await res.json();
        if (Array.isArray(data)) {
          setTreksCount(data.length);
        }
      } catch (err) {
        console.error("Failed to fetch trips count in Navbar:", err);
      }
    }
    fetchData();
    fetchSettings();
    fetchTrips();
  }, []);

  // Scroll effect with direction tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 80);

      if (currentScrollY <= 80) {
        setShowNavbar(true);
      } else {
        const lastScrollY = lastScrollYRef.current;
        if (currentScrollY < lastScrollY) {
          setShowNavbar(true); // scrolling up
        } else if (currentScrollY > lastScrollY + 5) {
          setShowNavbar(false); // scrolling down
        }
      }
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
  }, [pathname]);

  // Click outside / Escape handling
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Hover handlers for dropdowns
  const handleMouseEnter = (key: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(key);
  };
  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };
  const closeDropdown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(null);
  };

  const isActive = (link: any) => {
    if (!link.dropdown && link.href) return pathname === link.href;
    if (link.key === "trips") return pathname.startsWith("/regions") || pathname.startsWith("/trips");
    if (link.key === "info") return ["/why-us", "/visa-info", "/travel-insurance", "/packing-list", "/faqs", "/private-treks"].some(p => pathname.startsWith(p));
    if (link.key === "company") return ["/about-us", "/our-team", "/gallery", "/video-gallery", "/csr"].includes(pathname);
    return false;
  };

  const navLinks = [
    {
      title: "Nepal Trips",
      dropdown: true,
      key: "trips",
      items: regions.map((r: any) => ({ label: `${r.name} Region`, href: `/regions/${r.slug}` })),
    },
    {
      title: "Travel Info",
      dropdown: true,
      key: "info",
      items: [
        { label: "Why Choose Us", href: "/why-us" },
        { label: "Visa Info", href: "/visa-info" },
        { label: "Travel Insurance", href: "/travel-insurance" },
        { label: "Packing List", href: "/packing-list" },
        { label: "FAQs", href: "/faqs" },
      ],
      megaItems: [
        // Column 1
        [
          { label: "Travel Guide for Nepal", href: "/why-us", icon: "🗺️" },
          { label: "Why Travel to Nepal?", href: "/why-us", icon: "🏔️" },
          { label: "Regions in Nepal", href: "/trips", icon: "📍" },
          { label: "Attractions in Nepal", href: "/trips", icon: "✨" },
          { label: "Guides Mandatory for Trekkers", href: "/faqs#guides", icon: "👨‍🦯" },
          { label: "Accommodation in Nepal", href: "/faqs#accommodation", icon: "🏨" },
          { label: "Altitude Acclimatization", href: "/faqs#altitude", icon: "⛰️" },
          { label: "Getting to Nepal & Visas", href: "/visa-info", icon: "✈️" },
          { label: "Private Treks in Nepal", href: "/private-treks", icon: "🎿" },
        ],
        // Column 2
        [
          { label: "Currency & Payments", href: "/faqs#currency", icon: "💳" },
          { label: "Facts About Mt. Everest", href: "/trips/everest-base-camp-trek", icon: "🏔️" },
          { label: "Food and Beverages", href: "/faqs#food", icon: "🍛" },
          { label: "Safety While Travelling", href: "/travel-insurance", icon: "🛡️" },
          { label: "Transportation in Nepal", href: "/faqs#transport", icon: "🚌" },
          { label: "Travel Insurance", href: "/travel-insurance", icon: "🔒" },
          { label: "Trekking Permits & Fees", href: "/faqs#permits", icon: "📋" },
          { label: "Weather & Climate", href: "/faqs#weather", icon: "🌤️" },
          { label: "What to Do Before Coming", href: "/packing-list", icon: "📦" },
          { label: "When to Come to Nepal?", href: "/faqs#season", icon: "📅" },
        ],
      ],
    },
    {
      title: "Company",
      dropdown: true,
      key: "company",
      items: [
        { label: "About Us", href: "/about-us" },
        { label: "Our Sherpa Team", href: "/our-team" },
        { label: "Photo Gallery", href: "/gallery" },
        { label: "Video Gallery", href: "/video-gallery" },
        { label: "CSR & Sustainability", href: "/csr" },
      ],
    },
    { title: "Blog", href: "/blogs", dropdown: false },
    { title: "Contact Us", href: "/contact-us", dropdown: false },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/trips?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={navbarRef} className="w-full z-40 relative">
      {/* Top green promo bar stripe (Visible on all viewports, scrolls off) */}
      <div className="w-full bg-[#2ea44f] text-white py-2.5 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 relative z-50">
        <svg className="w-4 h-4 text-white animate-pulse shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="leading-snug">
          Confirmed Booked Group, You Can Join for 2026 &amp; 2027
        </span>
        <Link href="/upcoming-departures" className="inline-block bg-white/20 hover:bg-white/30 text-white rounded px-2.5 py-0.5 text-[10px] sm:text-[11px] uppercase tracking-wider transition ml-1.5 border border-white/20 shrink-0">
          Know More
        </Link>
      </div>

      {/* Top Utility Bar */}
      <div className={`w-full bg-white border-b-[0.5px] border-[#e5e5e5] py-[8px] px-[24px] transition-all duration-300 ${isScrolled ? "hidden" : "block"} hidden lg:block`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left Logo */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <div className="relative w-9 h-9 overflow-hidden bg-gray-50 rounded-lg p-0.5 border border-gray-200 shadow-inner transition group-hover:scale-105 shrink-0">
              <Image src="/officiallogo.jpeg" alt="Nature Heaven Logo" fill className="object-contain" unoptimized />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sans text-[13px] font-extrabold text-[#1a2e1f] leading-none uppercase tracking-wide">Nature Heaven</span>
              <span className="text-[9px] tracking-[0.05em] text-[#6b7280] uppercase font-semibold mt-0.5 leading-none">Trek & Expedition</span>
            </div>
          </Link>

          {/* Middle: Country Navigation Widgets (Styled in secondary Amber Gold) */}
          <div className="flex items-center gap-4 md:gap-8 flex-wrap justify-center my-2 md:my-0">
            {/* Nepal */}
            <Link href="/countries/nepal" className="group flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-gray-50 transition-all duration-300">
              <div className="text-[#c8922a] group-hover:scale-110 transition duration-300 shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 48 C 14 32, 50 32, 50 48 Z" fill="#fdfbf7" />
                  <path d="M8 48 h 48" />
                  <path d="M4 54 h 56" />
                  <rect x="26" y="22" width="12" height="10" rx="1" fill="#fdfbf7" />
                  <circle cx="30" cy="27" r="1.5" fill="currentColor" />
                  <circle cx="34" cy="27" r="1.5" fill="currentColor" />
                  <path d="M32 29 Q 32.5 30.5, 32 31" />
                  <path d="M32 22 V 10" />
                  <path d="M28 10 h 8" />
                  <path d="M29 7 h 6" />
                  <path d="M32 7 V 4" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans text-[12px] font-bold uppercase tracking-wider text-[#1a2e1f] group-hover:text-[#c8922a] transition duration-200">Nepal</span>
                <span className="text-[10px] text-[#6b7280] font-semibold leading-none mt-0.5">{treksCount} Trips</span>
              </div>
            </Link>

            {/* Tibet */}
            <Link href="/countries/tibet" className="group flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-gray-50 transition-all duration-300">
              <div className="text-[#c8922a] group-hover:scale-110 transition duration-300 shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 50 h 40" fill="#fdfbf7" />
                  <path d="M16 50 L 18 38 h 28 L 50 50" />
                  <path d="M18 38 C 16 38, 16 35, 18 35 h 28 C 50 35, 50 38, 48 38" />
                  <path d="M22 35 L 24 24 h 16 L 42 35" fill="#fdfbf7" />
                  <path d="M24 24 C 22 24, 22 21, 24 21 h 16 C 42 21, 42 24, 40 24" />
                  <path d="M27 21 L 28 14 h 8 L 37 21" />
                  <path d="M28 14 Q 32 8, 36 14 Z" />
                  <path d="M32 8 V 4" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans text-[12px] font-bold uppercase tracking-wider text-[#1a2e1f] group-hover:text-[#c8922a] transition duration-200">Tibet</span>
                <span className="text-[10px] text-[#6b7280] font-semibold leading-none mt-0.5">1 Trips</span>
              </div>
            </Link>

            {/* Bhutan */}
            <Link href="/countries/bhutan" className="group flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-gray-50 transition-all duration-300">
              <div className="text-[#c8922a] group-hover:scale-110 transition duration-300 shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 52 h 52" fill="#fdfbf7" />
                  <path d="M10 52 L 14 30 h 36 L 54 52" />
                  <line x1="20" y1="44" x2="20" y2="40" stroke="currentColor" />
                  <line x1="32" y1="44" x2="32" y2="40" stroke="currentColor" />
                  <line x1="44" y1="44" x2="44" y2="40" stroke="currentColor" />
                  <path d="M18 30 h 28" />
                  <path d="M18 24 h 28" />
                  <path d="M16 24 C 14 24, 14 20, 18 20 h 28 C 50 20, 50 24, 48 24" fill="#fdfbf7" />
                  <path d="M22 20 L 25 12 h 14 L 37 20" />
                  <path d="M22 12 Q 32 6, 42 12 Z" />
                  <path d="M32 6 V 2" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans text-[12px] font-bold uppercase tracking-wider text-[#1a2e1f] group-hover:text-[#c8922a] transition duration-200">Bhutan</span>
                <span className="text-[10px] text-[#6b7280] font-semibold leading-none mt-0.5">1 Trips</span>
              </div>
            </Link>
          </div>

          {/* Right: Talk to Expert Card & Stepper CTA (Aligned dynamically) */}
          <div className="flex items-center gap-6 justify-center shrink-0">
            {/* Talk to Expert Card (Original beloved design!) */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-[13px] shadow-sm select-none">
                {(siteSettings?.headerSettings?.expertName || "K")[0]}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-bold text-[#1a2e1f] leading-tight mb-0.5">Talk to an Expert ({siteSettings?.headerSettings?.expertName || "Kafle"})</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-[14px] h-[14px] rounded-full bg-[#25D366] flex items-center justify-center text-white font-black text-[9px] leading-none select-none">W</div>
                  <a href={`https://wa.me/${(siteSettings?.headerSettings?.expertWhatsApp || "9779851218358").replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-charcoal hover:text-[#c8922a] transition">{siteSettings?.headerSettings?.expertWhatsApp || "+977 9851218358"}</a>
                </div>
              </div>
            </div>

            {/* Plan Your Trip CTA Button (Styled in secondary gold) */}
            <Link 
              href="/plan-a-trip" 
              className="border-2 border-[#c8922a] hover:bg-[#c8922a] text-[#c8922a] hover:text-white font-sans font-bold px-4 py-2 rounded-[6px] text-[12px] uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-sm"
            >
              <FaPaperPlane className="h-3.5 w-3.5" />
              <span>Plan Your Trip</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Nav */}
      <nav className={`transition-all duration-300 z-50 ${
        isScrolled 
          ? `fixed left-0 right-0 mx-auto w-[92%] max-w-5xl rounded-full bg-[#1a2e1f]/90 backdrop-blur-md shadow-2xl border border-white/10 py-1.5 px-3 transform transition-all duration-300 ${showNavbar ? "top-4 opacity-100 translate-y-0" : "-top-24 opacity-0 -translate-y-4 pointer-events-none"}`
          : "w-full bg-[#1a2e1f] py-3"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          {/* Logo - Always visible on mobile, visible on desktop only when scrolled */}
          <div className={`transition-all duration-300 ${isScrolled ? "opacity-100 block" : "opacity-100 block lg:opacity-0 lg:hidden"}`}>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 overflow-hidden bg-white/20 rounded-md p-0.5 shrink-0">
                <Image src="/officiallogo.jpeg" alt="Nature Heaven Logo" fill className="object-contain" unoptimized />
              </div>
              <span className="font-sans text-[12px] font-extrabold text-white uppercase tracking-wide">Nature Heaven</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <div key={link.title} className={link.key === "trips" ? "" : "relative"} onMouseEnter={() => link.dropdown && link.key && handleMouseEnter(link.key)} onMouseLeave={handleMouseLeave}>
                {link.dropdown ? (
                  <button onClick={() => {
                    if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
                    setActiveDropdown(activeDropdown === link.key ? null : (link.key || null));
                  }} className={`flex items-center gap-1 font-sans font-semibold text-white/95 hover:text-[#c8922a] py-3.5 border-b-[3px] focus:outline-none transition duration-300 text-[13px] ${isActive(link) ? "border-[#c8922a] text-[#c8922a]" : "border-transparent"}`}> {link.title}<FaChevronDown className={`h-3 w-3 text-[#c8922a] transition-transform duration-300 ${activeDropdown === link.key ? "rotate-180" : ""}`} /></button>
                ) : (
                  <Link href={link.href || "/"} className={`font-sans font-semibold text-white/95 hover:text-[#c8922a] py-3.5 border-b-[3px] transition duration-300 text-[13px] ${isActive(link) ? "border-[#c8922a] text-[#c8922a]" : "border-transparent"}`}>{link.title}</Link>
                )}
                {/* Dropdown */}
                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.key && (
                      link.key === "trips" ? (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }} onMouseEnter={() => link.key && handleMouseEnter(link.key)} onMouseLeave={handleMouseLeave} className="absolute left-0 right-0 top-full mt-1 w-full bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 z-50 flex gap-6 text-charcoal before:content-[''] before:absolute before:top-[-20px] before:left-0 before:right-0 before:h-[20px] before:bg-transparent animate-in fade-in slide-in-from-top-3 duration-250">
                          {/* Left categories */}
                          <div className="w-60 flex flex-col gap-1 border-r border-[#e5e5e5] pr-6 shrink-0">
                            {categories.map((cat) => (
                              <button key={cat} onClick={() => setActiveCategory(cat)} onMouseEnter={() => setActiveCategory(cat)} className={`w-full text-left px-4 py-2 rounded transition duration-200 text-[12.5px] font-sans font-semibold border-l-[3px] ${activeCategory === cat ? "bg-secondary/10 border-secondary text-secondary-dark" : "border-transparent text-charcoal/80 hover:bg-secondary/5 hover:text-secondary-dark"}`}>{cat}</button>
                            ))}
                          </div>
                          {/* Right content */}
                          <div className="flex-1 pl-4">
                            <div className="text-xs uppercase font-bold text-muted tracking-wider mb-4 border-b border-[#e5e5e5] pb-2 font-sans">{activeCategory} ({TRIP_DATA[activeCategory].length} Options)</div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 font-sans">
                              {TRIP_DATA[activeCategory].map((trip) => (
                                <Link key={trip.slug} href={`/trips/${trip.slug}`} onClick={closeDropdown} className="text-[12.5px] font-semibold text-charcoal/80 hover:bg-secondary/10 hover:text-secondary-dark px-3 py-2 rounded transition duration-200 block truncate">{trip.title}</Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : link.key === "info" && (link as any).megaItems ? (
                        // ===== TRAVEL INFO MEGA DROPDOWN =====
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.2 }}
                          onMouseEnter={() => link.key && handleMouseEnter(link.key)}
                          onMouseLeave={handleMouseLeave}
                          className="absolute left-1/2 -translate-x-1/2 mt-1 w-[600px] bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 overflow-hidden before:content-[''] before:absolute before:top-[-20px] before:left-0 before:right-0 before:h-[20px] before:bg-transparent"
                        >
                          {/* Header */}
                          <div className="bg-[#1a2e1f] px-5 py-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-[#c8922a] uppercase tracking-[0.15em]">Nepal Travel Information</span>
                            <Link href="/why-us" onClick={closeDropdown} className="text-[10px] text-white/60 hover:text-[#c8922a] font-semibold transition">
                              View All →
                            </Link>
                          </div>
                          {/* 2-column grid */}
                          <div className="grid grid-cols-2 divide-x divide-gray-100">
                            {((link as any).megaItems as { label: string; href: string; icon: string }[][]).map((col, ci) => (
                              <div key={ci} className="flex flex-col py-2">
                                {col.map((item) => (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={closeDropdown}
                                    className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-[12.5px] font-semibold text-[#3D3D3D] hover:bg-[#c8922a]/8 hover:text-[#1a2e1f] transition duration-200 group"
                                  >
                                    <span className="text-sm w-5 text-center shrink-0 group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                                    <span className="leading-tight">{item.label}</span>
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                          {/* Footer CTA strip */}
                          <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/80 flex items-center justify-between gap-3">
                            <div className="flex gap-2 flex-wrap">
                              {[
                                { label: "Visa Info", href: "/visa-info" },
                                { label: "Insurance", href: "/travel-insurance" },
                                { label: "Packing List", href: "/packing-list" },
                                { label: "FAQs", href: "/faqs" },
                              ].map((q) => (
                                <Link
                                  key={q.label}
                                  href={q.href}
                                  onClick={closeDropdown}
                                  className="text-[10px] font-bold text-[#1a2e1f] bg-white border border-gray-200 hover:border-[#c8922a] hover:text-[#c8922a] px-2.5 py-1 rounded-full transition duration-200"
                                >
                                  {q.label}
                                </Link>
                              ))}
                            </div>
                            <Link
                              href="/contact-us"
                              onClick={closeDropdown}
                              className="text-[10px] font-bold bg-[#c8922a] hover:bg-[#b07820] text-white px-3 py-1.5 rounded-full transition duration-200 shrink-0"
                            >
                              Ask an Expert
                            </Link>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }} onMouseEnter={() => link.key && handleMouseEnter(link.key)} onMouseLeave={handleMouseLeave} className="absolute left-0 mt-1 min-w-[220px] bg-white border border-gray-150 shadow-2xl rounded-xl py-2 z-50 overflow-hidden before:content-[''] before:absolute before:top-[-20px] before:left-0 before:right-0 before:h-[20px] before:bg-transparent">
                          {link.items && link.items.map((item) => (
                            <Link key={item.label} href={item.href} onClick={closeDropdown} className="block px-5 py-2.5 font-sans text-xs font-semibold text-charcoal/80 hover:bg-secondary/10 hover:text-secondary-dark transition duration-300">{item.label}</Link>
                          ))}
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            {/* Top 5 Treks */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("top5")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => {
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current);
                    closeTimeoutRef.current = null;
                  }
                  setActiveDropdown(activeDropdown === "top5" ? null : "top5");
                }}
                className={`flex items-center gap-1.5 font-sans font-bold text-[#c8922a] hover:text-[#c8922a]/80 py-3 border-b-[3px] focus:outline-none transition duration-300 text-[13px] ${
                  activeDropdown === "top5" ? "border-[#c8922a]" : "border-transparent"
                }`}
              >
                <FaStar className="h-3.5 w-3.5 text-[#c8922a] animate-pulse" />
                <span>Top 5 Treks</span>
                <FaChevronDown className={`h-3 w-3 text-[#c8922a] transition-transform duration-300 ${activeDropdown === "top5" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "top5" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => handleMouseEnter("top5")}
                    onMouseLeave={handleMouseLeave}
                    className="absolute left-0 mt-1 min-w-[280px] bg-white border border-gray-150 shadow-2xl rounded-xl py-3 z-50 overflow-hidden before:content-[''] before:absolute before:top-[-20px] before:left-0 before:right-0 before:h-[20px] before:bg-transparent"
                  >
                    <div className="px-5 py-1.5 border-b border-gray-100 mb-2">
                      <span className="text-[10px] uppercase font-bold text-muted tracking-wider block font-sans">
                        Recommended Treks
                      </span>
                    </div>
                    {getTop5Treks().map((item: any) => (
                      <Link
                        key={item.slug}
                        href={`/trips/${item.slug}`}
                        onClick={closeDropdown}
                        className="block px-5 py-2.5 font-sans text-xs font-semibold text-charcoal/80 hover:bg-secondary/10 hover:text-secondary-dark transition duration-300 border-l-[3px] border-transparent hover:border-secondary"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-primary transition duration-200">{item.title}</span>
                          <span className="text-[10px] text-charcoal/50 mt-0.5 font-normal">{item.duration} Days • <span className="capitalize">{item.difficulty}</span> • ${item.discountedPrice || item.price} USD</span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right CTA & Mobile Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto lg:ml-0">
            {/* Desktop Search Button */}
            <button 
              onClick={() => setSearchOpen(true)} 
              className="group border-2 border-[#c8922a] hover:bg-[#c8922a] text-white hover:text-[#1a2e1f] font-sans font-bold px-4 py-2 rounded-[6px] text-[12px] uppercase tracking-wider transition-all duration-300 hidden lg:flex items-center gap-2 shadow-sm"
            >
              <FaSearch className="h-3.5 w-3.5 text-[#c8922a] group-hover:text-[#1a2e1f] transition-colors duration-300" />
              <span>Search Your Trip</span>
            </button>

            {/* Mobile/Tablet WhatsApp CTA */}
            <a 
              href={`https://wa.me/${(siteSettings?.headerSettings?.expertWhatsApp || "9779851218358").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden p-1.5 text-[#25D366] hover:scale-105 transition-transform duration-200"
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp className="h-5.5 w-5.5" />
            </a>

            {/* Mobile/Tablet Search trigger */}
            <button 
              onClick={() => setSearchOpen(true)} 
              className="lg:hidden p-1.5 text-white hover:text-[#c8922a] hover:scale-105 transition duration-200"
              aria-label="Search trips"
            >
              <FaSearch className="h-4.5 w-4.5" />
            </button>

            {/* Mobile Hamburger menu */}
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="lg:hidden p-1.5 text-white hover:text-[#c8922a] focus:outline-none block" 
              aria-label="Open Mobile Menu"
            >
              <FaBars className="h-5.5 w-5.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>{searchOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#1a2e1f]/95 z-50 flex items-center justify-center p-6">
          <button onClick={() => setSearchOpen(false)} className="absolute top-6 right-6 text-bgOffWhite hover:text-[#c8922a] p-2 transition" aria-label="Close search"><FaTimes className="h-8 w-8" /></button>
          <div className="w-full max-w-2xl text-center flex flex-col gap-6">
            <h2 className="font-serif text-2xl md:text-4xl text-[#c8922a] font-black">Find Your Himalayan Adventure</h2>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input type="text" placeholder="Type trek name, region or difficulty..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/10 border-2 border-[#c8922a]/35 text-white rounded-2xl py-4 pl-6 pr-16 text-lg focus:outline-none focus:border-[#c8922a] placeholder-white/40" autoFocus />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#c8922a] text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition" aria-label="Submit search"><FaSearch className="h-5 w-5" /></button>
            </form>
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>{mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[360px] bg-[#1a2e1f]/95 backdrop-blur-lg border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl z-50 text-white">
            <div className="flex flex-col gap-8">
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 overflow-hidden bg-white/20 rounded-md p-0.5 shrink-0"><Image src="/officiallogo.jpeg" alt="Nature Heaven Logo" fill className="object-contain" unoptimized /></div>
                  <span className="font-sans text-xs font-bold text-white uppercase tracking-wider">Nature Heaven</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-bgOffWhite hover:text-[#c8922a] focus:outline-none" aria-label="Close Mobile Menu"><FaTimes className="h-6 w-6" /></button>
              </div>
              {/* Mobile Links */}
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <div key={link.title} className="flex flex-col gap-2">
                    {link.dropdown ? (
                      <>
                        <button onClick={() => setActiveDropdown(activeDropdown === link.key ? null : (link.key || null))} className="flex items-center justify-between font-sans font-bold text-bgOffWhite text-left py-1.5 hover:text-[#c8922a] focus:outline-none transition text-sm"><span>{link.title}</span><FaChevronDown className={`h-3 w-3 text-[#c8922a] transition-transform duration-300 ${activeDropdown === link.key ? "rotate-180" : ""}`} /></button>
                        <div className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${activeDropdown === link.key ? "max-h-none opacity-100 py-1" : "max-h-0 opacity-0"}`}>
                          {link.key === "trips" ? (
                            <div className="flex flex-col gap-3 py-1 pl-1">
                              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory font-sans">
                                {categories.map((cat) => (
                                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap snap-align-start transition ${activeCategory === cat ? "bg-[#c8922a] text-white" : "bg-white/10 text-white/80 hover:bg-white/15"}`}>{cat}</button>
                                ))}
                              </div>
                              <div className="flex flex-col gap-1 pr-1">
                                {TRIP_DATA[activeCategory].map((trip) => (
                                  <Link key={trip.slug} href={`/trips/${trip.slug}`} onClick={() => { setMobileMenuOpen(false); closeDropdown(); }} className="text-xs font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2.5 rounded-lg transition">{trip.title}</Link>
                                ))}
                              </div>
                            </div>
                          ) : link.key === "info" && (link as any).megaItems ? (
                            <div className="flex flex-col gap-0.5 pl-2">
                              {((link as any).megaItems as { label: string; href: string; icon: string }[][]).flat().map((item) => (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => { setMobileMenuOpen(false); closeDropdown(); }}
                                  className="flex items-center gap-2.5 text-xs font-semibold text-white/75 hover:text-[#c8922a] transition py-1.5 px-2 rounded-lg hover:bg-white/5"
                                >
                                  <span className="text-sm w-4 text-center shrink-0">{item.icon}</span>
                                  <span>{item.label}</span>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2 pl-4">
                              {link.items?.map((item) => (
                                <Link key={item.label} href={item.href} onClick={() => { setMobileMenuOpen(false); closeDropdown(); }} className="text-xs font-semibold text-bgOffWhite/70 hover:text-[#c8922a] transition py-1">{item.label}</Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <Link href={link.href || "/"} className="font-sans font-bold text-bgOffWhite py-1.5 hover:text-[#c8922a] transition text-sm">{link.title}</Link>
                    )}
                  </div>
                ))}
                {/* Top 5 Treks */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === "top5" ? null : "top5")}
                    className="flex items-center justify-between font-sans font-bold text-[#c8922a] text-left py-1.5 hover:text-[#c8922a]/80 focus:outline-none transition text-sm"
                  >
                    <div className="flex items-center gap-1.5">
                      <FaStar className="h-3.5 w-3.5 text-[#c8922a] animate-pulse" />
                      <span>Top 5 Treks</span>
                    </div>
                    <FaChevronDown className={`h-3 w-3 text-[#c8922a] transition-transform duration-300 ${activeDropdown === "top5" ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${activeDropdown === "top5" ? "max-h-none opacity-100 py-1" : "max-h-0 opacity-0"}`}>
                    <div className="flex flex-col gap-1.5 pl-4 font-sans">
                      {getTop5Treks().map((item: any) => (
                        <Link
                          key={item.slug}
                          href={`/trips/${item.slug}`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            closeDropdown();
                          }}
                          className="text-xs font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2.5 rounded-lg transition"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-white">{item.title}</span>
                            <span className="text-[9px] text-white/50 mt-0.5">{item.duration} Days • <span className="capitalize">{item.difficulty}</span> • ${item.discountedPrice || item.price} USD</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer Contact */}
            <div className="flex flex-col gap-3 mt-12 pt-6 border-t border-white/10">
              <Link 
                href="/plan-a-trip" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border-2 border-[#c8922a] hover:bg-[#c8922a] text-[#c8922a] hover:text-white font-sans font-bold py-2.5 rounded-xl text-sm transition duration-300"
              >
                <FaPaperPlane className="h-4 w-4" />
                <span>Plan Your Trip</span>
              </Link>
              <a href={`https://wa.me/${(siteSettings?.headerSettings?.expertWhatsApp || "9779851218358").replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm transition duration-300"><FaWhatsapp className="h-5 w-5" /><span>WhatsApp Chat</span></a>
              <div className="text-center text-xs text-white/50 flex flex-col gap-1"><span>Emergency 24/7 Support</span><a href={`tel:${(siteSettings?.headerSettings?.expertPhone || "9779851218358").replace(/[^0-9]/g, "")}`} className="text-[#c8922a] font-bold hover:underline">{siteSettings?.headerSettings?.expertPhone || "+977 9851218358"}</a></div>
            </div>
          </motion.div>
        </div>
      )}</AnimatePresence>
    </div>
  );
}

