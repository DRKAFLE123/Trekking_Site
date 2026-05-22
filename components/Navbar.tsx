"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes, FaWhatsapp, FaChevronDown, FaSearch, FaStar, FaClock, FaDollarSign, FaMapMarkerAlt } from "react-icons/fa";
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

  // Regions data (unchanged)
  const [regions, setRegions] = useState<any[]>([]);
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
    fetchData();
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
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
    if (link.key === "info") return pathname.startsWith("/why-us");
    if (link.key === "company") return ["/about-us", "/our-team", "/gallery", "/csr"].includes(pathname);
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
        { label: "Visa Info", href: "/why-us#visa-info" },
        { label: "Travel Insurance", href: "/why-us#insurance" },
        { label: "Packing List", href: "/why-us#packing" },
        { label: "FAQs", href: "/why-us#faq" },
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
      {/* Top Utility Bar */}
      <div className={`w-full bg-white border-b-[0.5px] border-[#e5e5e5] py-[10px] px-[24px] transition-all duration-300 ${isScrolled ? "hidden" : "block"}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative w-9 h-9 overflow-hidden bg-gray-50 rounded-lg p-0.5 border border-gray-200 shadow-inner transition group-hover:scale-105 shrink-0">
              <Image src="/officiallogo.jpeg" alt="Nature Heaven Logo" fill className="object-contain" unoptimized />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sans text-[13px] font-extrabold text-[#1a2e1f] leading-none uppercase tracking-wide">Nature Heaven</span>
              <span className="text-[9px] tracking-[0.05em] text-[#6b7280] uppercase font-semibold mt-0.5 leading-none">Trek & Expedition</span>
            </div>
          </Link>

          {/* Spacer */}
          <div className="hidden md:block flex-1" />

          {/* Center Email Block */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left md:pr-8">
            <span className="text-[11px] text-[#6b7280] leading-tight mb-0.5">Quick Questions? Email Us</span>
            <a href="mailto:info@natureheaventrek.com" className="text-[12px] font-semibold text-[#1A6FBF] hover:text-[#4FA3E0] hover:underline">info@natureheaventrek.com</a>
          </div>

          {/* Right Expert Card */}
          <div className="flex items-center gap-3">
            <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-[13px] shadow-sm select-none">K</div>
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-bold text-[#1a2e1f] leading-tight mb-0.5">Talk to an Expert (Kafle)</span>
              <div className="flex items-center gap-1.5">
                <div className="w-[14px] h-[14px] rounded-full bg-[#25D366] flex items-center justify-center text-white font-black text-[9px] leading-none select-none">W</div>
                <a href="https://wa.me/9779851218358" target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-charcoal hover:text-[#1A6FBF] transition">+977 9851218358</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Nav */}
      <nav className={`w-full relative z-50 transition-all duration-300 ${isScrolled ? "fixed top-0 left-0 right-0 bg-[#1a2e1f]/95 backdrop-blur-md shadow-xl py-2 border-b border-[#4FA3E0]/20" : "relative bg-[#1a2e1f] py-3"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          {/* Small logo when scrolled */}
          <div className={`transition-all duration-300 ${isScrolled ? "opacity-100 block" : "opacity-0 hidden lg:hidden"}`}>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-7 h-7 overflow-hidden bg-white/20 rounded-md p-0.5 shrink-0">
                <Image src="/officiallogo.jpeg" alt="Nature Heaven Logo" fill className="object-contain" unoptimized />
              </div>
              <span className="font-sans text-[11px] font-extrabold text-white uppercase tracking-wide">Nature Heaven</span>
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
                  }} className={`flex items-center gap-1 font-sans font-semibold text-white/95 hover:text-[#4FA3E0] py-3.5 border-b-[3px] focus:outline-none transition duration-300 text-[13px] ${isActive(link) ? "border-[#4FA3E0] text-[#4FA3E0]" : "border-transparent"}`}> {link.title}<FaChevronDown className={`h-3 w-3 text-[#4FA3E0] transition-transform duration-300 ${activeDropdown === link.key ? "rotate-180" : ""}`} /></button>
                ) : (
                  <Link href={link.href || "/"} className={`font-sans font-semibold text-white/95 hover:text-[#4FA3E0] py-3.5 border-b-[3px] transition duration-300 text-[13px] ${isActive(link) ? "border-[#4FA3E0] text-[#4FA3E0]" : "border-transparent"}`}>{link.title}</Link>
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
                              <button key={cat} onClick={() => setActiveCategory(cat)} onMouseEnter={() => setActiveCategory(cat)} className={`w-full text-left px-4 py-2 rounded transition duration-200 text-[12.5px] font-sans font-semibold border-l-[3px] ${activeCategory === cat ? "bg-[#EEF5FB] border-[#1A6FBF] text-[#1A6FBF]" : "border-transparent text-charcoal/80 hover:bg-[#EEF5FB]/50 hover:text-[#1A6FBF]"}`}>{cat}</button>
                            ))}
                          </div>
                          {/* Right content */}
                          <div className="flex-1 pl-4">
                            <div className="text-xs uppercase font-bold text-muted tracking-wider mb-4 border-b border-[#e5e5e5] pb-2 font-sans">{activeCategory} ({TRIP_DATA[activeCategory].length} Options)</div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 font-sans">
                              {TRIP_DATA[activeCategory].map((trip) => (
                                <Link key={trip.slug} href={`/trips/${trip.slug}`} onClick={closeDropdown} className="text-[12.5px] font-semibold text-charcoal/80 hover:bg-[#EEF5FB] hover:text-[#1A6FBF] px-3 py-2 rounded transition duration-200 block truncate">{trip.title}</Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }} onMouseEnter={() => link.key && handleMouseEnter(link.key)} onMouseLeave={handleMouseLeave} className="absolute left-0 mt-1 min-w-[220px] bg-white border border-gray-150 shadow-2xl rounded-xl py-2 z-50 overflow-hidden before:content-[''] before:absolute before:top-[-20px] before:left-0 before:right-0 before:h-[20px] before:bg-transparent">
                          {link.items && link.items.map((item) => (
                            <Link key={item.label} href={item.href} onClick={closeDropdown} className="block px-5 py-2.5 font-sans text-xs font-semibold text-charcoal/80 hover:bg-[#EEF5FB] hover:text-[#1A6FBF] transition duration-300">{item.label}</Link>
                          ))}
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            {/* Top 5 Treks */}
            <Link href="/trips" className="flex items-center gap-1.5 font-sans font-bold text-[#4FA3E0] hover:text-[#4FA3E0]/80 py-3 border-b-[3px] border-transparent transition duration-300 text-[13px]"><FaStar className="h-3.5 w-3.5 text-[#4FA3E0] animate-pulse" /><span>Top 5 Treks</span></Link>
          </div>

          {/* Right CTA & Mobile */}
          <div className="flex items-center gap-4 ml-auto lg:ml-0">
            <button onClick={() => setSearchOpen(true)} className="bg-[#4FA3E0] text-white font-bold px-5 py-2.5 rounded-[6px] text-xs uppercase tracking-wider hover:bg-[#4FA3E0]/90 transition-all duration-300 hidden sm:flex items-center gap-2 shadow-sm"><FaSearch className="h-3.5 w-3.5" /><span>Search Your Trip</span></button>
            <button onClick={() => setMobileMenuOpen(true)} className={`lg:hidden p-2 text-bgOffWhite hover:text-[#4FA3E0] focus:outline-none ${isScrolled ? "block" : "hidden"}`} aria-label="Open Mobile Menu"><FaBars className="h-6 w-6" /></button>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>{searchOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#1a2e1f]/95 z-50 flex items-center justify-center p-6">
          <button onClick={() => setSearchOpen(false)} className="absolute top-6 right-6 text-bgOffWhite hover:text-[#4FA3E0] p-2 transition" aria-label="Close search"><FaTimes className="h-8 w-8" /></button>
          <div className="w-full max-w-2xl text-center flex flex-col gap-6">
            <h2 className="font-serif text-2xl md:text-4xl text-[#4FA3E0] font-black">Find Your Himalayan Adventure</h2>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input type="text" placeholder="Type trek name, region or difficulty..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/10 border-2 border-[#4FA3E0]/35 text-white rounded-2xl py-4 pl-6 pr-16 text-lg focus:outline-none focus:border-[#4FA3E0] placeholder-white/40" autoFocus />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#4FA3E0] text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition" aria-label="Submit search"><FaSearch className="h-5 w-5" /></button>
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
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-bgOffWhite hover:text-[#4FA3E0] focus:outline-none" aria-label="Close Mobile Menu"><FaTimes className="h-6 w-6" /></button>
              </div>
              {/* Mobile Links */}
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <div key={link.title} className="flex flex-col gap-2">
                    {link.dropdown ? (
                      <>
                        <button onClick={() => setActiveDropdown(activeDropdown === link.key ? null : (link.key || null))} className="flex items-center justify-between font-sans font-bold text-bgOffWhite text-left py-1.5 hover:text-[#4FA3E0] focus:outline-none transition text-sm"><span>{link.title}</span><FaChevronDown className={`h-3 w-3 text-[#4FA3E0] transition-transform duration-300 ${activeDropdown === link.key ? "rotate-180" : ""}`} /></button>
                        <div className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${activeDropdown === link.key ? "max-h-[450px] opacity-100 py-1" : "max-h-0 opacity-0"}`}>
                          {link.key === "trips" ? (
                            <div className="flex flex-col gap-3 py-1 pl-1">
                              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                                {categories.map((cat) => (
                                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap snap-align-start transition ${activeCategory === cat ? "bg-[#4FA3E0] text-white" : "bg-white/10 text-white/80 hover:bg-white/15"}`}>{cat}</button>
                                ))}
                              </div>
                              <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-1">
                                {TRIP_DATA[activeCategory].map((trip) => (
                                  <Link key={trip.slug} href={`/trips/${trip.slug}`} onClick={() => { setMobileMenuOpen(false); closeDropdown(); }} className="text-xs font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2.5 rounded-lg transition">{trip.title}</Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2 pl-4">
                              {link.items?.map((item) => (
                                <Link key={item.label} href={item.href} onClick={() => { setMobileMenuOpen(false); closeDropdown(); }} className="text-xs font-semibold text-bgOffWhite/70 hover:text-[#4FA3E0] transition py-1">{item.label}</Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <Link href={link.href || "/"} className="font-sans font-bold text-bgOffWhite py-1.5 hover:text-[#4FA3E0] transition text-sm">{link.title}</Link>
                    )}
                  </div>
                ))}
                {/* Top 5 Treks */}
                <Link href="/trips" className="flex items-center gap-1.5 font-sans font-bold text-[#4FA3E0] hover:text-[#4FA3E0]/80 py-1.5 transition text-sm"><FaStar className="h-3.5 w-3.5 text-[#4FA3E0] animate-pulse" /><span>Top 5 Treks</span></Link>
              </div>
            </div>
            {/* Footer Contact */}
            <div className="flex flex-col gap-4 mt-12 pt-6 border-t border-white/10">
              <a href="https://wa.me/9779851218358" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-650 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition duration-300"><FaWhatsapp className="h-5 w-5" /><span>WhatsApp Chat</span></a>
              <div className="text-center text-xs text-white/50 flex flex-col gap-1"><span>Emergency 24/7 Support</span><a href="tel:+9779851218358" className="text-[#4FA3E0] font-bold hover:underline">+977 9851218358</a></div>
            </div>
          </motion.div>
        </div>
      )}</AnimatePresence>
    </div>
  );
}

