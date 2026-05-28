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
    { title: "Everest Base Camp Trek – 12 Days", slug: "everest-base-camp-trek-12" },
    { title: "Everest Base Camp Trek with Chola Pass Gokyo Trek - 19 Days", slug: "everest-base-camp-chola-gokyo-19" },
    { title: "Everest Base Camp Helicopter - 10 Days", slug: "everest-helicopter-10" },
    { title: "Everest Base Camp Helicopter - 1 Day", slug: "everest-helicopter-1" },
    { title: "Everest Base Camp Hike - 17 Days", slug: "everest-hike-17" },
    { title: "Everest Three Passes Trek - 21 Days", slug: "everest-three-passes-21" },
    { title: "Everest View Trek - 7 Days", slug: "everest-view-7" },
    { title: "Everest High Passes Trek - 19 Days", slug: "everest-high-passes-19" },
    { title: "Gokyo Ri Trek - 14 Days", slug: "gokyo-ri-14" },
    { title: "Ama Dablam Base Camp - 15 Days", slug: "ama-dablam-base-camp-15" },
    { title: "Island Peak Climbing With EBC - 19 Days", slug: "island-peak-climbing-ebc-19" },
    { title: "Lobuche peak Climbing with EBC - 19 Days", slug: "lobuche-peak-climbing-ebc-19" }
  ],
  "Annapurna Treks": [
    { title: "Annapurna Sunrise Trek – 5 Days", slug: "annapurna-sunrise-5" },
    { title: "Annapurna Base Camp Short Trek - 7 Days", slug: "annapurna-base-camp-short-7" },
    { title: "Annapurna Base Camp - 13 Days", slug: "annapurna-base-camp-13" },
    { title: "Annapurna Circuit Treks - 14 Days", slug: "annapurna-circuit-14" },
    { title: "Annapurna Circuit Trek with Tilicho Lake – 16 Days", slug: "annapurna-circuit-tilicho-16" },
    { title: "Mardi Himal with Annapurna Base Camp Trek - 15 Days", slug: "mardi-himal-abc-15" },
    { title: "Mardi Himal Trek - 7 Days", slug: "mardi-himal-7" },
    { title: "Khopra Danda and Annapurna Base Camp Trek - 15 Days", slug: "khopra-danda-abc-15" },
    { title: "Khopra Danda Trek - 7 Days", slug: "khopra-danda-7" },
    { title: "Poon Hill Trek - 5 Days", slug: "poon-hill-5" },
    { title: "Narphu Valley Trek - 15 Days", slug: "narphu-valley-15" },
    { title: "Khopra Danda With Mardi Himal Trek - 14 Days", slug: "khopra-mardi-himal-14" }
  ],
  "Manaslu Treks": [
    { title: "Manaslu Circuit Trek - 12 Days", slug: "manaslu-circuit-12" },
    { title: "Manaslu Circuit Trek - 15 Days", slug: "manaslu-circuit-15" },
    { title: "Manaslu Circuit Trek - 16 Days", slug: "manaslu-circuit-trek-16" },
    { title: "Manaslu Tsum Valley Trek - 19 Days", slug: "manaslu-tsum-valley-19" },
    { title: "Tsum Valley Trek - 14 Days", slug: "tsum-valley-14" }
  ],
  "Langtang Treks": [
    { title: "Langtang Valley Trek - 7 Days", slug: "langtang-valley-7" },
    { title: "Gosainkunda Trek - 7 Days", slug: "gosainkunda-7" },
    { title: "Langtang Valley with Gosainkunda Trek – 11 Days", slug: "langtang-gosainkunda-11" },
    { title: "Langtang Valley Full Trek - 13 Days", slug: "langtang-valley-full-13" }
  ],
  "Ganesh Himal Treks": [
    { title: "Ganesh Himal Base Camp Trek- 14 Days", slug: "ganesh-himal-bc-14" },
    { title: "Ganesh Himal Trek- 15 Days", slug: "ganesh-himal-15" }
  ],
  "Mustang Treks": [
    { title: "Upper Mustang Trek - 7 Days", slug: "upper-mustang-7" },
    { title: "Upper Mustang Tiji Festival Trek - 13 Days", slug: "upper-mustang-tiji-13" },
    { title: "Upper Mustang Trek - 11 Days", slug: "upper-mustang-11" }
  ],
  "Kanchenjunga Treks": [
    { title: "Kanchenjunga Base Camp Trek- 25 Days", slug: "kanchenjunga-base-camp-25" }
  ],
  "Makalu Treks": [
    { title: "Makalu Base Camp Trek- 21 Days", slug: "makalu-base-camp-21" }
  ],
  "Dolpa Treks": [
    { title: "Lower Dolpa Trek – 15 Days", slug: "lower-dolpa-15" },
    { title: "Upper Dolpa Trek- 25 Days", slug: "upper-dolpa-25" },
    { title: "Dolpa Trek - 17 Days", slug: "dolpa-trek-17" }
  ],
  "Tour in Nepal": [
    { title: "Kathmandu Valley Tour – 1 Day", slug: "kathmandu-valley-tour-1" },
    { title: "Gokyo Valley Tour - 2 Days", slug: "gokyo-valley-tour-2" },
    { title: "Everest Base Camp with Heli Tour - 1 Day", slug: "ebc-heli-tour-1" },
    { title: "Namche Bazzar Valley tour - 1 Day", slug: "namche-bazaar-tour-1" },
    { title: "Manang Valley Tour – 2 Days", slug: "manang-valley-tour-2" },
    { title: "Kathmandu Valley World Heritage Sites Tour- 3 Days", slug: "kathmandu-heritage-3" },
    { title: "Pokhara Valley with Sunrise tour - 3 Days", slug: "pokhara-sunrise-3" },
    { title: "Kathmandu Nagarkot with Sunrise Tour – 3 Days", slug: "kathmandu-nagarkot-sunrise-3" },
    { title: "Lumbini Tour- 2 Days", slug: "lumbini-tour-2" }
  ],
  "Expedition in Nepal": [
    { title: "Everest Expedition - 60 Days", slug: "everest-expedition-60" },
    { title: "Annapurna Expedition - 40 Days", slug: "annapurna-expedition-40" },
    { title: "Manaslu Expedition - 40 Days", slug: "manaslu-expedition-40" },
    { title: "Ama Dablam Expedition - 30 Days", slug: "ama-dablam-expedition-30" }
  ],
  "Peak Climbing in Nepal": [
    { title: "Island Peak Climbing - 16 Days", slug: "island-peak-climbing-16" },
    { title: "Lobuche East peak climbing - 16 Days", slug: "lobuche-east-climbing-16" },
    { title: "Mera Peak Climbing - 16 Days", slug: "mera-peak-climbing-16" }
  ],
  "Jungle Safari in Nepal": [
    { title: "Bardia National Park - 3 Days", slug: "bardia-national-park-3" },
    { title: "Chitwan National Park - 3 Days", slug: "chitwan-national-park-3" }
  ],
  "River Rafting in Nepal": [
    { title: "Trishuli River Rafting - 1 Day", slug: "trishuli-river-rafting-1" },
    { title: "Bhotekosi River Rafting - 1 Day", slug: "bhotekosi-river-rafting-1" }
  ],
  "Bungee Jumping in Nepal": [
    { title: "Pokhara Bungee Jumping", slug: "pokhara-bungee-jumping" },
    { title: "Kusma Bungee Jumping", slug: "kusma-bungee-jumping" }
  ],
  "Paragliding in Nepal": [
    { title: "Pokhara Paragliding", slug: "pokhara-paragliding" },
    { title: "Kathmandu Paragliding", slug: "kathmandu-paragliding" }
  ]
};

// Category to Region mapping for URL construction
const categoryToRegion: Record<string, { name: string; slug: string }> = {
  "Everest Treks": { name: "Everest Region", slug: "everest" },
  "Annapurna Treks": { name: "Annapurna Region", slug: "annapurna" },
  "Manaslu Treks": { name: "Manaslu Region", slug: "manaslu" },
  "Langtang Treks": { name: "Langtang Region", slug: "langtang" },
  "Ganesh Himal Treks": { name: "Ganesh Himal Region", slug: "ganesh-himal" },
  "Mustang Treks": { name: "Mustang Region", slug: "mustang" },
  "Kanchenjunga Treks": { name: "Kanchenjunga Region", slug: "kanchenjunga" },
  "Makalu Treks": { name: "Makalu Region", slug: "makalu" },
  "Dolpa Treks": { name: "Dolpa Region", slug: "dolpa" },
  "Tour in Nepal": { name: "Tour in Nepal", slug: "tour-in-nepal" },
  "Expedition in Nepal": { name: "Expedition in Nepal", slug: "expedition-in-nepal" },
  "Peak Climbing in Nepal": { name: "Peak Climbing in Nepal", slug: "peak-climbing-in-nepal" },
  "Jungle Safari in Nepal": { name: "Jungle Safari in Nepal", slug: "jungle-safari-in-nepal" },
  "River Rafting in Nepal": { name: "River Rafting in Nepal", slug: "river-rafting-in-nepal" },
  "Bungee Jumping in Nepal": { name: "Bungee Jumping in Nepal", slug: "bungee-jumping-in-nepal" },
  "Paragliding in Nepal": { name: "Paragliding in Nepal", slug: "paragliding-in-nepal" }
};

// Travel Info page list mapping
const travelInfoPages = [
  { slug: "travel-guide-for-nepal", title: "Ultimate Travel Guide to Nepal" },
  { slug: "private-treks-in-nepal", title: "Tailor-Made Private Treks in Nepal" },
  { slug: "why-travel-to-nepal", title: "What Makes Nepal Special?" },
  { slug: "regions-in-nepal", title: "Trekking Region in Nepal" },
  { slug: "attractions-in-nepal", title: "Famous Destinations in Nepal" },
  { slug: "guides-mandatory-for-trekkers", title: "Why Guides are Mandatory for Trekkers?" },
  { slug: "accommodation-in-nepal", title: "Accommodation Facilities" },
  { slug: "altitude-acclimatization", title: "Altitude Acclimatization: 8 Essential Golden Rules" },
  { slug: "getting-to-nepal-and-visas", title: "Nepal Arrival and Immigration Guide" },
  { slug: "currency-and-payments", title: "Global Currency and Digital Payment Solutions" },
  { slug: "facts-about-mt-everest", title: "Lesser-Known Facts of Mount Everest" },
  { slug: "fact-about-lord-buddha", title: "Fact About Lord Buddha" },
  { slug: "food-and-beverages", title: "Beverages and Food" },
  { slug: "safety-while-travelling", title: "Guidelines for Safe and Secure Travel in Nepal" },
  { slug: "transportation-in-nepal", title: "How Transportation Works in Nepal" },
  { slug: "trekking-permits-and-fees", title: "Permit Rules and Fees for Trekking in Nepal" },
  { slug: "weather-and-climate", title: "Weather and Climate Variations Across Nepal" },
  { slug: "what-to-do-before-coming", title: "Travel Preparation Guide for Nepal Visitors" },
  { slug: "health-safety-risk-prevention", title: "Health, Safety, and Risk Prevention" },
  { slug: "know-festival-in-nepal", title: "Know Festival in Nepal" }
];

// Categorized travel info mapping for premium multi-column dropdown
const TRAVEL_INFO_CATEGORIES = [
  {
    title: "Essential Planning",
    items: [
      { slug: "travel-guide-for-nepal", title: "Ultimate Travel Guide to Nepal" },
      { slug: "getting-to-nepal-and-visas", title: "Nepal Arrival & Visas" },
      { slug: "trekking-permits-and-fees", title: "Permit Rules & Fees" },
      { slug: "currency-and-payments", title: "Currency & Payments" },
      { slug: "weather-and-climate", title: "Weather & Climate" },
      { slug: "what-to-do-before-coming", title: "Travel Preparation Guide" },
      { slug: "transportation-in-nepal", title: "How Transportation Works" }
    ]
  },
  {
    title: "Safety & Accommodation",
    items: [
      { slug: "altitude-acclimatization", title: "Altitude Acclimatization Rules" },
      { slug: "safety-while-travelling", title: "Guidelines for Safe Travel" },
      { slug: "health-safety-risk-prevention", title: "Health & Risk Prevention" },
      { slug: "accommodation-in-nepal", title: "Accommodation Facilities" },
      { slug: "food-and-beverages", title: "Beverages and Food" },
      { slug: "guides-mandatory-for-trekkers", title: "Why Guides are Mandatory?" }
    ]
  },
  {
    title: "Destinations & Culture",
    items: [
      { slug: "regions-in-nepal", title: "Trekking Region in Nepal" },
      { slug: "attractions-in-nepal", title: "Famous Destinations" },
      { slug: "private-treks-in-nepal", title: "Tailor-Made Private Treks" },
      { slug: "why-travel-to-nepal", title: "What Makes Nepal Special?" },
      { slug: "facts-about-mt-everest", title: "Lesser-Known Facts of Everest" },
      { slug: "fact-about-lord-buddha", title: "Fact About Lord Buddha" },
      { slug: "know-festival-in-nepal", title: "Know Festival in Nepal" }
    ]
  }
];

// Curated Top 15 bestseller list
const TOP_BESTSELLERS = [
  { title: "Everest Base Camp Trek - 14 Days", slug: "everest-base-camp-trek-14", duration: 14, difficulty: "hard", price: 1399 },
  { title: "Annapurna Base Camp Trek - 13 Days", slug: "annapurna-base-camp-13", duration: 13, difficulty: "moderate", price: 999 },
  { title: "Manaslu Circuit Trek - 16 Days", slug: "manaslu-circuit-trek-16", duration: 16, difficulty: "hard", price: 1299 },
  { title: "Everest Three Passes Trek - 21 Days", slug: "everest-three-passes-21", duration: 21, difficulty: "extreme", price: 2199 },
  { title: "Island Peak Climbing With EBC - 19 Days", slug: "island-peak-climbing-ebc-19", duration: 19, difficulty: "extreme", price: 2299 },
  { title: "Langtang Valley Trek - 7 Days", slug: "langtang-valley-7", duration: 7, difficulty: "moderate", price: 599 },
  { title: "Dolpa Trek - 25 Days", slug: "upper-dolpa-25", duration: 25, difficulty: "extreme", price: 2799 },
  { title: "Kanchenjunga Base Camp Trek - 25 Days", slug: "kanchenjunga-base-camp-25", duration: 25, difficulty: "extreme", price: 2499 },
  { title: "Makalu Base Camp Trek - 21 Days", slug: "makalu-base-camp-21", duration: 21, difficulty: "extreme", price: 2199 },
  { title: "Tsum Valley Trek - 14 Days", slug: "tsum-valley-14", duration: 14, difficulty: "hard", price: 1299 },
  { title: "Mardi Himal Trek - 7 Days", slug: "mardi-himal-7", duration: 7, difficulty: "moderate", price: 599 },
  { title: "Gokyo Ri Trek - 14 Days", slug: "gokyo-ri-14", duration: 14, difficulty: "hard", price: 1399 },
  { title: "Annapurna Circuit Treks - 14 Days", slug: "annapurna-circuit-14", duration: 14, difficulty: "hard", price: 1099 },
  { title: "Narphu Valley Trek - 15 Days", slug: "narphu-valley-15", duration: 15, difficulty: "hard", price: 1599 },
  { title: "Poon Hill Trek - 5 Days", slug: "poon-hill-5", duration: 5, difficulty: "easy", price: 449 }
];

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
  const [showAllTopTreks, setShowAllTopTreks] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollYRef = useRef(0);

  // Reset showAllTopTreks when dropdown closes
  useEffect(() => {
    if (activeDropdown !== "top10") {
      setShowAllTopTreks(false);
    }
  }, [activeDropdown]);

  // Hide floating pill nav on conversion/form pages
  const hideFloatingNav = ["/contact-us", "/plan-a-trip"].some(p => pathname.startsWith(p))
    || pathname.startsWith("/booking");

  // Regions data (unchanged)
  const [regions, setRegions] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [treksCount, setTreksCount] = useState<number>(7);
  const [dbTreks, setDbTreks] = useState<any[]>([]);

  const getDropdownTreks = () => {
    if (dbTreks && dbTreks.length > 0) {
      return dbTreks.slice(0, showAllTopTreks ? 15 : 10);
    }
    return TOP_BESTSELLERS.slice(0, showAllTopTreks ? 15 : 10);
  };

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
          setDbTreks(data);
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
    closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 350);
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
    if (link.key === "info") return pathname.startsWith("/travel-info") || pathname.startsWith("/faqs");
    if (link.key === "company") return ["/about-us", "/our-team", "/gallery", "/video-gallery", "/csr"].includes(pathname);
    if (link.key === "top10") return pathname === "/bestsellers";
    return false;
  };

  const navLinks = [
    {
      title: "Nepal Trip",
      dropdown: true,
      key: "trips",
      items: Object.keys(TRIP_DATA).filter(k => k !== "All Trips").map(k => ({ label: k, href: `/regions/${categoryToRegion[k]?.slug || 'everest'}` })),
    },
    {
      title: "Travel Info",
      dropdown: true,
      key: "info",
      items: travelInfoPages.map(p => ({ label: p.title, href: `/travel-info/${p.slug}` })),
    },
    {
      title: "Company",
      dropdown: true,
      key: "company",
      items: [
        { label: "About Us", href: "/about-us" },
        { label: "Our Team", href: "/our-team" },
        { label: "Responsible Tourism", href: "/csr" },
        { label: "Terms & Conditions", href: "/terms-and-conditions" },
        { label: "Legal Documents", href: "/about-us#licensing" },
        { label: "Privacy Policy", href: "/privacy-policy" }
      ],
    },
    { title: "Blog", href: "/blogs", dropdown: false },
    { title: "Contact Us", href: "/contact-us", dropdown: false },
    {
      title: "Top 10 Treks",
      dropdown: true,
      key: "top10",
    }
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
            <div className="relative w-12 h-12 overflow-hidden bg-gray-50 rounded-lg p-0.5 border border-gray-200 shadow-inner transition group-hover:scale-105 shrink-0">
              <Image src="/finalofficiallogo.jpeg" alt="Nature Heaven Logo" fill className="object-contain" unoptimized />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sans text-[13px] font-extrabold text-[#1a2e1f] leading-none uppercase tracking-wide">
                {(siteSettings?.siteName || "Nature Heaven Trekking & Expedition").replace(/\s*(Trekking|Trek).*$/i, "") || "Nature Heaven"}
              </span>
              <span className="text-[9px] tracking-[0.05em] text-[#6b7280] uppercase font-semibold mt-0.5 leading-none">Trekking &amp; Expedition</span>
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

      {/* Sticky Nav — hidden on booking/contact/plan-a-trip */}
      <nav className={`transition-all duration-300 z-50 ${
        isScrolled && !hideFloatingNav
          ? `fixed left-0 right-0 mx-auto w-[90%] max-w-5xl rounded-full bg-[#1a2e1f]/95 backdrop-blur-md shadow-xl border border-white/10 py-1 px-2 transform transition-all duration-300 ${showNavbar ? "top-3 opacity-100 translate-y-0" : "-top-24 opacity-0 -translate-y-4 pointer-events-none"}`
          : isScrolled && hideFloatingNav
          ? "hidden"
          : "w-full bg-[#1a2e1f] py-3"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          {/* Logo — compact in floating mode: just logo + "Nature Heaven" */}
          <div className={`transition-all duration-300 ${isScrolled ? "opacity-100 block" : "opacity-100 block lg:opacity-0 lg:hidden"}`}>
            <Link href="/" className="flex items-center gap-1.5">
              <div className="relative w-6 h-6 overflow-hidden bg-white/20 rounded-md p-0.5 shrink-0">
                <Image src="/finalofficiallogo.jpeg" alt="Nature Heaven Logo" fill className="object-contain" unoptimized />
              </div>
              <span className="font-sans text-[10px] font-extrabold text-white uppercase tracking-wide leading-none">
                Nature Heaven
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links — tighter spacing in floating mode */}
          <div className={`hidden lg:flex items-center ${isScrolled ? "gap-4" : "gap-7"}`}>
            {navLinks.map((link) => (
              <div key={link.title} className={(link.key === "trips" || link.key === "info") ? "" : "relative"} onMouseEnter={() => link.dropdown && link.key && handleMouseEnter(link.key)} onMouseLeave={handleMouseLeave}>
                {link.dropdown ? (
                  <button onClick={() => {
                    if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
                    setActiveDropdown(activeDropdown === link.key ? null : (link.key || null));
                  }} className={`flex items-center gap-1 font-sans font-medium text-white/90 hover:text-[#c8922a] py-3 border-b-2 focus:outline-none transition duration-300 ${isScrolled ? "text-[11px]" : "text-[13px] font-semibold"} ${isActive(link) || activeDropdown === link.key ? "border-[#c8922a] text-[#c8922a]" : "border-transparent"}`}>
                    {link.key === "top10" && <FaStar className="h-2.5 w-2.5 text-[#c8922a] animate-pulse" />}
                    <span>{link.title}</span>
                    <FaChevronDown className={`h-2.5 w-2.5 text-[#c8922a] transition-transform duration-300 ${activeDropdown === link.key ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link href={link.href || "/"} className={`font-sans font-medium text-white/90 hover:text-[#c8922a] py-3 border-b-2 transition duration-300 ${isScrolled ? "text-[11px]" : "text-[13px] font-semibold"} ${isActive(link) ? "border-[#c8922a] text-[#c8922a]" : "border-transparent"}`}>{link.title}</Link>
                )}
                {/* Dropdown */}
                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.key && (
                      link.key === "trips" ? (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }} onMouseEnter={() => link.key && handleMouseEnter(link.key)} onMouseLeave={handleMouseLeave} className="absolute left-0 right-0 top-full mt-1 w-full bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 z-50 flex gap-6 text-charcoal before:content-[''] before:absolute before:top-[-20px] before:left-0 before:right-0 before:h-[20px] before:bg-transparent animate-in fade-in slide-in-from-top-3 duration-250">
                          {/* Left Categories */}
                          <div className="w-56 flex flex-col gap-0.5 border-r border-gray-100 pr-5 shrink-0 max-h-[400px] overflow-y-auto scrollbar-thin">
                            <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-gray-400 mb-3 block border-b border-gray-100 pb-2 font-sans">
                              Regions &amp; Categories
                            </span>
                            {categories.map((cat) => (
                              <button 
                                key={cat} 
                                onClick={() => setActiveCategory(cat)} 
                                onMouseEnter={() => setActiveCategory(cat)} 
                                className={`w-full text-left px-3 py-2 rounded-xl transition duration-200 text-[13px] font-sans font-bold border-l-[3px] ${activeCategory === cat ? "bg-secondary/10 border-secondary text-secondary-dark" : "border-transparent text-gray-900 hover:bg-secondary/5 hover:text-secondary-dark"}`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                          
                          {/* Center Content: full trek names, no truncation */}
                          <div className="flex-1 pl-2 min-w-0">
                            <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
                              <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-gray-400 font-sans">
                                Popular Trips under {activeCategory} ({TRIP_DATA[activeCategory].length} Options)
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-sans max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
                              {TRIP_DATA[activeCategory].map((trip) => (
                                <Link 
                                  key={trip.slug} 
                                  href={`/trips/${trip.slug}`} 
                                  onClick={closeDropdown} 
                                  className="text-[12px] font-semibold text-charcoal/80 hover:bg-secondary/10 hover:text-secondary-dark px-3 py-2 rounded-lg transition duration-200 block leading-snug"
                                >
                                  {trip.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : link.key === "info" ? (
                        // ===== PREMIUM CATEGORIZED TRAVEL INFO DROPDOWN =====
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.2 }}
                          onMouseEnter={() => link.key && handleMouseEnter("info")}
                          onMouseLeave={handleMouseLeave}
                          className="absolute left-0 right-0 mx-auto mt-1 w-full max-w-5xl bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 grid grid-cols-3 gap-6 text-charcoal z-50 before:content-[''] before:absolute before:top-[-20px] before:left-0 before:right-0 before:h-[20px] before:bg-transparent animate-in fade-in slide-in-from-top-3 duration-250"
                        >
                          {TRAVEL_INFO_CATEGORIES.map((category) => (
                            <div key={category.title} className="flex flex-col">
                              <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-[#c8922a] mb-3.5 block border-b border-gray-100 pb-2 font-sans">
                                {category.title}
                              </span>
                              <div className="flex flex-col gap-1 max-h-[320px] overflow-y-auto scrollbar-none pr-1">
                                {category.items.map((item) => (
                                  <Link
                                    key={item.slug}
                                    href={`/travel-info/${item.slug}`}
                                    onClick={closeDropdown}
                                    className="block px-3 py-2 rounded-lg font-sans text-xs font-semibold text-charcoal/80 hover:bg-secondary/10 hover:text-secondary-dark transition duration-200"
                                  >
                                    {item.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      ) : link.key === "top10" ? (
                        // ===== TOP 10 TREKS DROPDOWN =====
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.2 }}
                          onMouseEnter={() => handleMouseEnter("top10")}
                          onMouseLeave={handleMouseLeave}
                          className="absolute left-0 mt-1 min-w-[300px] max-w-[340px] bg-white border border-gray-150 shadow-2xl rounded-xl py-3 z-50 overflow-hidden before:content-[''] before:absolute before:top-[-20px] before:left-0 before:right-0 before:h-[20px] before:bg-transparent"
                        >
                          <div className="px-5 py-1.5 border-b border-gray-100 mb-2">
                            <span className="text-[10px] uppercase font-bold text-muted tracking-wider block font-sans">
                              Bestseller Himalayan Treks
                            </span>
                          </div>
                          <div className="max-h-[380px] overflow-y-auto scrollbar-none flex flex-col">
                            {getDropdownTreks().map((item: any) => (
                              <Link
                                key={item.slug}
                                href={`/trips/${item.slug}`}
                                onClick={closeDropdown}
                                className="block px-5 py-2.5 font-sans text-xs font-semibold text-charcoal/80 hover:bg-secondary/10 hover:text-secondary-dark transition duration-300 border-l-[3px] border-transparent hover:border-secondary"
                              >
                                <div className="flex flex-col">
                                  <span className="font-bold text-primary transition duration-200">{item.title}</span>
                                  <span className="text-[10px] text-charcoal/50 mt-0.5 font-normal">{item.duration} Days • <span className="capitalize">{item.difficulty}</span> • ${item.price} USD</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="px-5 pt-2 mt-1 border-t border-gray-150 flex items-center justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAllTopTreks(!showAllTopTreks);
                              }}
                              className="text-xs font-bold text-secondary-dark hover:text-secondary transition-colors duration-200 focus:outline-none flex items-center gap-1"
                            >
                              {showAllTopTreks ? "Collapse List" : "+ Show 5 More Bestsellers"}
                            </button>
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
          </div>

          {/* Right CTA & Mobile Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto lg:ml-0">
            {/* Desktop Search Button — compact icon+text in floating, full button in top bar */}
            <button 
              onClick={() => setSearchOpen(true)} 
              className={`group border border-[#c8922a] hover:bg-[#c8922a] text-white hover:text-white font-sans transition-all duration-300 hidden lg:flex items-center gap-1.5 ${
                isScrolled
                  ? "px-2.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wide"
                  : "px-4 py-2 rounded-[6px] text-[12px] font-bold border-2 tracking-wider shadow-sm"
              }`}
            >
              <FaSearch className={`text-[#c8922a] group-hover:text-white transition-colors duration-300 ${isScrolled ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`} />
              <span>{isScrolled ? "Search" : "Search Your Trip"}</span>
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
                  <div className="relative w-7 h-7 overflow-hidden bg-white/20 rounded-md p-0.5 shrink-0"><Image src="/finalofficiallogo.jpeg" alt="Nature Heaven Logo" fill className="object-contain" unoptimized /></div>
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-bold text-white uppercase tracking-wider leading-none">
                      {((siteSettings?.siteName || "Nature Heaven Trekking & Expedition").replace(/\s*(Trekking|Trek).*$/i, "") || "Nature Heaven")}
                    </span>
                    <span className="text-[8px] text-white/50 uppercase tracking-widest font-semibold mt-0.5 leading-none">Trekking &amp; Expedition</span>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-bgOffWhite hover:text-[#c8922a] focus:outline-none" aria-label="Close Mobile Menu"><FaTimes className="h-6 w-6" /></button>
              </div>
              {/* Mobile Links */}
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <div key={link.title} className="flex flex-col gap-2">
                    {link.dropdown ? (
                      <>
                        <button onClick={() => setActiveDropdown(activeDropdown === link.key ? null : (link.key || null))} className="flex items-center justify-between font-sans font-bold text-bgOffWhite text-left py-1.5 hover:text-[#c8922a] focus:outline-none transition text-sm">
                          <span className="flex items-center gap-1.5">
                            {link.key === "top10" && <FaStar className="h-3.5 w-3.5 text-[#c8922a] animate-pulse mr-1" />}
                            {link.title}
                          </span>
                          <FaChevronDown className={`h-3 w-3 text-[#c8922a] transition-transform duration-300 ${activeDropdown === link.key ? "rotate-180" : ""}`} />
                        </button>
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
                          ) : link.key === "top10" ? (
                            <div className="flex flex-col gap-1.5 pl-4 font-sans">
                              {getDropdownTreks().map((item: any) => (
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
                                    <span className="text-[9px] text-white/50 mt-0.5">{item.duration} Days • <span className="capitalize">{item.difficulty}</span> • ${item.price} USD</span>
                                  </div>
                                </Link>
                              ))}
                              <div className="pt-2 flex items-center justify-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAllTopTreks(!showAllTopTreks);
                                  }}
                                  className="text-xs font-bold text-[#c8922a] hover:text-[#c8922a]/80 transition duration-200 focus:outline-none"
                                >
                                  {showAllTopTreks ? "Collapse List" : "+ Show 5 More Bestsellers"}
                                </button>
                              </div>
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

