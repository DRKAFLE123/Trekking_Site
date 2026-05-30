"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {
  FaUsers,
  FaChevronDown,
  FaCalendarAlt,
  FaStar,
  FaDownload,
  FaShareAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaWhatsapp,
  FaEnvelope,
  FaShieldAlt,
  FaMedkit,
  FaInfoCircle,
  FaRegCalendarCheck,
  FaCreditCard,
  FaRegEye,
  FaListUl,
  FaRegCheckCircle,
  FaMap,
  FaHiking,
  FaRegImage,
  FaRegComments,
  FaQuestionCircle,
  FaPlay,
  FaGlobeAsia,
  FaSignal,
  FaMapMarkerAlt,
  FaBed,
  FaUtensils,
  FaWalking,
  FaMountain,
  FaPaperPlane,
  FaRegClock,
  FaArrowRight,
  FaWater,
  FaSuitcase,
  FaHeadSideVirus,
  FaBath,
  FaCoins,
  FaHandshake,
  FaPlug,
  FaCloud,
} from "react-icons/fa";
import { FiPlusCircle, FiXCircle } from "react-icons/fi";
import { Trek, Testimonial, Faq, TripInfoSection, PackingCategory } from "@/types";
import { renderLexical } from "@/lib/lexical-renderer";
import { getMediaUrl } from "@/lib/cloudinary-loader";
import EnquiryModal from "./EnquiryModal";

const parseYoutubeIdStatic = (url: string) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : url;
};

// Dynamically load TrekMap to bypass SSR issues with Leaflet
const TrekMap = dynamic(() => import("./TrekMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-primary/5 rounded-2xl flex items-center justify-center text-primary/60 font-medium">
      Loading interactive route map...
    </div>
  ),
});

interface TrekDetailClientProps {
  trek: Trek;
  similarTreks: Trek[];
  testimonials: Testimonial[];
  faqs?: Faq[];
}

// ── Icon map for Trip Info section icons ────────────────────────────────────
const TRIP_INFO_ICONS: Record<string, React.ReactNode> = {
  accommodation: <FaBed />,
  food:          <FaUtensils />,
  water:         <FaWater />,
  luggage:       <FaSuitcase />,
  flights:       <FaPaperPlane />,
  insurance:     <FaShieldAlt />,
  visa:          <FaInfoCircle />,
  health:        <FaMedkit />,
  helicopter:    <FaHeadSideVirus />,
  guide:         <FaUsers />,
  weather:       <FaCloud />,
  electricity:   <FaPlug />,
  shower:        <FaBath />,
  money:         <FaCoins />,
  tipping:       <FaHandshake />,
  info:          <FaInfoCircle />,
};

// ── FAQ categories ───────────────────────────────────────────────────────────
const FAQ_CATEGORIES = {
  general:                  { label: "General Info",        icon: "ℹ️" },
  prep_fitness:             { label: "Prep & Fitness",      icon: "💪" },
  permits:                  { label: "Permits",             icon: "🎫" },
  insurance_visa:           { label: "Insurance & Visa",    icon: "📋" },
  guides_staff:             { label: "Guides & Staff",      icon: "👥" },
  accommodation_facilities: { label: "Lodging & Facilities",icon: "🏨" },
  food_drinks:              { label: "Food & Drinks",       icon: "🍽️" },
  weather_seasons:          { label: "Weather & Seasons",   icon: "☀️" },
  health_safety:            { label: "Health & Safety",     icon: "🏥" },
  packing_gear:             { label: "Packing & Gear",      icon: "🎒" },
  booking_payments:         { label: "Booking & Payments",  icon: "💳" },
  transportation_flights:   { label: "Transport & Flights", icon: "✈️" },
};

// ── Inclusion / Exclusion category grouping ─────────────────────────────────
const PACKAGE_CATEGORIES = [
  { key: "transport",     label: "Transportation",    Icon: FaPaperPlane, keywords: ["flight","airfare","airport","transfer","transport","vehicle","bus","drive","domestic","lukla","pick-up","pickup","drop-off","drop off"] },
  { key: "accommodation", label: "Accommodations",    Icon: FaBed,        keywords: ["accommodation","hotel","teahouse","tea house","lodge","nights","night ","twin-sharing","twin sharing","rooms"] },
  { key: "food",          label: "Food & Drinks",     Icon: FaUtensils,   keywords: ["meal","breakfast","lunch","dinner","b, l, d","fresh fruit","drinking water","water purification","dal bhat"] },
  { key: "guide",         label: "Guide & Porter",    Icon: FaUsers,      keywords: ["guide","porter","sherpa","trek leader","crew","wages"] },
  { key: "permits",       label: "Permits & Fees",    Icon: FaListUl,     keywords: ["permit","entry fee","national park","municipality","tims","vat","government tax"] },
  { key: "insurance",     label: "Travel Insurance",  Icon: FaShieldAlt,  keywords: ["insurance"] },
  { key: "visa",          label: "Visa",              Icon: FaInfoCircle, keywords: ["visa"] },
  { key: "equipment",     label: "Equipment & Gear",  Icon: FaMedkit,     keywords: ["sleeping bag","down jacket","duffel","duffle","equipment","first aid","first-aid","oximeter","certificate","hiking poles","boots","daypack"] },
  { key: "personal",      label: "Personal Expenses", Icon: FaCreditCard, keywords: ["personal","tip","tipping","wifi","wi-fi","laundry","hot shower","battery","charging","snack","alcohol","phone","shopping","bottled","beverage"] },
];

function categorizePackageItems(items: string[], fallbackLabel: string) {
  const map = new Map<string, string[]>();
  const other: string[] = [];
  for (const item of items) {
    const lower = (item || "").toLowerCase();
    const cat = PACKAGE_CATEGORIES.find((c) => c.keywords.some((k) => lower.includes(k)));
    if (cat) {
      if (!map.has(cat.key)) map.set(cat.key, []);
      map.get(cat.key)!.push(item);
    } else {
      other.push(item);
    }
  }
  const groups = PACKAGE_CATEGORIES.filter((c) => map.has(c.key)).map((c) => ({
    label: c.label,
    Icon: c.Icon,
    items: map.get(c.key)!,
  }));
  if (other.length) groups.push({ label: fallbackLabel, Icon: FaInfoCircle, items: other });
  return groups;
}

// ── Default packing list (shown only if none configured in CMS) ──────────────
const DEFAULT_PACKING_LIST: PackingCategory[] = [
  { category: "Headwear", items: [
    { item: "Sun Hat / Cap (SPF protection recommended)" },
    { item: "Warm Fleece Beanie or insulated wool hat" },
    { item: "Neck Gaiter / Buff (for dry wind and dust)" },
    { item: "LED Headlamp (with spare batteries)" },
  ]},
  { category: "Clothing Layers", items: [
    { item: "Thermal Underwear / Base Layers (moisture-wicking, 2 pairs)" },
    { item: "Trekking Shirts (synthetic, quick-dry, 3–4 pairs)" },
    { item: "Fleece Jacket or warm mid-layer top" },
    { item: "Heavy Down Jacket (rated to -10°C, provided if needed)" },
    { item: "Waterproof/Windproof Shell Jacket (breathable)" },
    { item: "Convertible Hiking Pants (quick-dry, 2 pairs)" },
  ]},
  { category: "Footwear & Handwear", items: [
    { item: "Lightweight Inner Gloves (fleece liner)" },
    { item: "Waterproof Outer Gloves or mittens" },
    { item: "Hiking Boots (waterproof, ankle-support, broken-in)" },
    { item: "Camp Shoes / Sandals (for evenings)" },
    { item: "Trekking Socks (merino wool, 4 pairs)" },
  ]},
  { category: "Personal Gear", items: [
    { item: "Sleeping Bag (rated -15°C, provided if needed)" },
    { item: "Daypack (30–40L with waist straps and rain cover)" },
    { item: "Duffel Bag (80–90L, provided by us for porters)" },
    { item: "Trekking Poles (adjustable, shock-absorbing)" },
    { item: "UV Protection Sunglasses (essential for snow glare)" },
    { item: "Insulated Water Bottles (1L, 2 bottles)" },
  ]},
  { category: "Toiletries & Medicines", items: [
    { item: "Quick-dry Microfiber Towel" },
    { item: "Sunscreen SPF 50+ and Lip Balm" },
    { item: "Wet Wipes (large packs for hygiene)" },
    { item: "Hand Sanitizer (biodegradable)" },
    { item: "First-Aid Kit (diamox, ibuprofen, blister tape, rehydration salts)" },
    { item: "Water Purification Tablets or UV sterilizer (SteriPEN)" },
  ]},
];

// ── Default FAQ fallback ─────────────────────────────────────────────────────
const DEFAULT_FAQS = [
  { id: "df1", question: "What is the best time of year for this trek?", answer: "The best seasons are Spring (March–May) and Autumn (September–November). Skies are clear and weather is stable during these months.", category: "weather_seasons" },
  { id: "df2", question: "How difficult is the trek?", answer: "The trek is rated moderate-to-hard. No technical climbing skills are needed, but you should be physically active. Daily hikes of 5–7 hours on mountain terrain require good cardiovascular fitness.", category: "prep_fitness" },
  { id: "df3", question: "Is altitude sickness a concern?", answer: "Altitude sickness (AMS) is a potential risk above 3,000m. Our itinerary includes acclimatization rest days. Guides monitor oxygen levels daily and carry emergency medication.", category: "health_safety" },
];

// ── Review cards (from CMS testimonials + static) ────────────────────────────
const STATIC_TRIPADVISOR_REVIEWS = [
  { author: "Mark S.", country: "Australia", stars: 5, title: "Once in a lifetime experience, flawlessly organized!", text: "Nature Heaven Trek & Expedition exceeded all our expectations. Our guide was knowledgeable and kept a close eye on our oxygen levels every day. Standing at the summit is something I'll never forget." },
  { author: "Sarah Jenkins", country: "United Kingdom", stars: 5, title: "Incredible Support Team and Safe Trek", text: "I was nervous about altitude sickness, but the guide's slow pace and safety protocols made me feel incredibly secure. When one member needed support, the team handled it with outstanding professionalism." },
];

// ────────────────────────────────────────────────────────────────────────────
export default function TrekDetailClient({ trek, similarTreks, testimonials, faqs = [] }: TrekDetailClientProps) {
  const router = useRouter();

  // ── Route map ──────────────────────────────────────────────────────────────
  const mapImageUrl = getMediaUrl(trek.mapImage)
    || (trek.slug?.includes("everest-base-camp") ? "/Map%20Image/ebc-map.webp" : "")
    || (trek.slug?.includes("manaslu") ? "/Map%20Image/manslu%20trek.webp" : "");

  const handleDownloadMap = async () => {
    if (!mapImageUrl) return;
    try {
      const res = await fetch(mapImageUrl);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      const ext = mapImageUrl.split("?")[0].match(/\.(\w+)$/)?.[1] || "jpg";
      a.download = `${trek.slug || "trek"}-route-map.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);
    } catch {
      window.open(mapImageUrl, "_blank");
    }
  };

  // ── Site settings (for WhatsApp / expert name) ─────────────────────────────
  const [siteSettings, setSiteSettings] = useState<any>(null);
  useEffect(() => {
    fetch("/api/site-settings").then(r => r.json()).then(setSiteSettings).catch(() => {});
  }, []);

  // ── Normalize data from CMS ────────────────────────────────────────────────
  const dayByDayItinerary = trek.dayByDayItinerary || [];

  const highlightsList = (trek.highlights || []).map((h: any) =>
    typeof h === "string" ? h : h?.highlight
  ).filter(Boolean);

  const inclusionsList = (trek.inclusions || []).map((i: any) =>
    typeof i === "string" ? i : i?.inclusion
  ).filter(Boolean);

  const exclusionsList = (trek.exclusions || []).map((e: any) =>
    typeof e === "string" ? e : e?.exclusion
  ).filter(Boolean);

  const inclusionGroups = categorizePackageItems(inclusionsList, "Other Inclusions");
  const exclusionGroups = categorizePackageItems(exclusionsList, "Other Exclusions");

  // Packing list: CMS or default
  const packingChecklist: PackingCategory[] =
    trek.packingList && trek.packingList.length > 0
      ? trek.packingList
      : DEFAULT_PACKING_LIST;

  // Gallery
  const computedGallery = (trek.gallery || []).map((g: any) => {
    const rawImage = typeof g === "string" ? g : g?.image;
    return getMediaUrl(rawImage);
  }).filter(Boolean) as string[];

  const galleryList = computedGallery.length > 0 ? computedGallery : [
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
    "https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?q=80&w=800",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800",
  ];

  // Group discounts
  const groupDiscounts = trek.groupDiscounts && trek.groupDiscounts.length > 0
    ? trek.groupDiscounts
    : [
        { minPersons: 1,  maxPersons: 1,  pricePerPerson: trek.discountedPrice || trek.price },
        { minPersons: 2,  maxPersons: 3,  pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.96) },
        { minPersons: 4,  maxPersons: 7,  pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.92) },
        { minPersons: 8,  maxPersons: 13, pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.88) },
        { minPersons: 14, maxPersons: 25, pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.84) },
      ];

  // ── UI State ───────────────────────────────────────────────────────────────
  const [activeSection, setActiveSection]   = useState("overview");
  const [hideSubNav, setHideSubNav]         = useState(false);
  const [lightboxOpen, setLightboxOpen]     = useState(false);
  const [lightboxIndex, setLightboxIndex]   = useState(0);
  const [carouselIndex, setCarouselIndex]   = useState(0);
  const touchStartX = useRef<number>(0);

  const [openDays, setOpenDays]             = useState<Record<number, boolean>>({ 1: true });
  const [openInfoCards, setOpenInfoCards]   = useState<Record<number, boolean>>({ 0: true });
  const [packedItems, setPackedItems]       = useState<Record<string, boolean>>({});
  const [activeReviewTab, setActiveReviewTab] = useState<"tripadvisor" | "google" | "facebook">("tripadvisor");
  const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({});
  const [showShare, setShowShare]           = useState(false);
  const [activeFaqCat, setActiveFaqCat]     = useState<string>("");
  const [expandedFaqs, setExpandedFaqs]     = useState<Record<string, boolean>>({});
  const [guests, setGuests]                 = useState(2);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [videoModalId, setVideoModalId] = useState<string | null>(null);
  const [itineraryLightboxImage, setItineraryLightboxImage] = useState<string | null>(null);

  // Trek Schedule Planner (self-service date picker)
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => new Date());
  const [scheduleStart, setScheduleStart]   = useState<Date | null>(null);
  const [hoverDate, setHoverDate]           = useState<Date | null>(null);

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const startYear = new Date().getFullYear();
  const years = [startYear, startYear + 1, startYear + 2];
  const tripDays = trek.duration || 14;
  const startOfToday = (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })();

  const addDays = (date: Date, n: number) => {
    const d = new Date(date); d.setDate(d.getDate() + n); d.setHours(0,0,0,0); return d;
  };
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const scheduleEnd = scheduleStart ? addDays(scheduleStart, tripDays - 1) : null;
  const fmtLong = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const fmtISO  = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  const handleScheduleBooking = () => {
    if (!scheduleStart) return;
    const end = addDays(scheduleStart, tripDays - 1);
    router.push(`/booking/${trek.slug}?guests=${guests}&startDate=${fmtISO(scheduleStart)}&endDate=${fmtISO(end)}`);
  };

  const handleProceedToBooking = () => {
    if (scheduleStart) {
      handleScheduleBooking();
    } else {
      router.push(`/booking/${trek.slug}?guests=${guests}`);
    }
  };

  // Pricing helpers
  const getUnitPriceForGuests = (paxCount: number) => {
    const tier = groupDiscounts.find(d => paxCount >= d.minPersons && paxCount <= d.maxPersons);
    return tier ? tier.pricePerPerson : (trek.discountedPrice || trek.price);
  };
  const paxPrice      = getUnitPriceForGuests(guests);
  const originalPricePP = trek.price || Math.round(paxPrice * 1.15);

  // Touch handlers for mobile carousel
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setCarouselIndex(p => (p + 1) % heroImages.length);
      else          setCarouselIndex(p => (p - 1 + heroImages.length) % heroImages.length);
    }
  };

  // Scrollspy for main nav
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sections = ["overview","schedule","video","itinerary","includes","map","packing","info","reviews","faqs"];
        const scrollPos = window.scrollY + 140;
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
        const faqEl = document.getElementById("faqs");
        if (faqEl) setHideSubNav(faqEl.getBoundingClientRect().top <= 80);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scrollspy for FAQ category nav
  useEffect(() => {
    const handle = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-faq-cat]"));
      if (!sections.length) return;
      const scrollPos = window.scrollY + 160;
      let current = sections[0].dataset.faqCat || "";
      for (const sec of sections) {
        if (scrollPos >= sec.offsetTop) current = sec.dataset.faqCat || current;
      }
      setActiveFaqCat(current);
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, [faqs]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: "smooth" });
  };

  // Accordion helpers
  const toggleDay     = (n: number) => setOpenDays(p => ({ ...p, [n]: !p[n] }));
  const expandAllDays = () => { const all: Record<number,boolean> = {}; dayByDayItinerary.forEach(d => { all[d.day] = true; }); setOpenDays(all); };
  const collapseAllDays = () => setOpenDays({});
  const toggleInfoCard  = (i: number) => setOpenInfoCards(p => ({ ...p, [i]: !p[i] }));
  const toggleChecklistItem = (item: string) => setPackedItems(p => ({ ...p, [item]: !p[item] }));

  const totalChecklistItems = packingChecklist.reduce((acc, cat) => acc + cat.items.length, 0);
  const totalPackedItems    = Object.values(packedItems).filter(Boolean).length;
  const packedPercentage    = Math.round((totalPackedItems / totalChecklistItems) * 100) || 0;

  // ── Hero images ────────────────────────────────────────────────────────────
  const cover = getMediaUrl(trek.heroImage) || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200";
  const heroImages = (() => {
    const extras = galleryList.filter(g => g !== cover);
    const arr = [cover, ...extras].slice(0, 5);
    const fallbacks = [
      "https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?q=80&w=800",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800",
      "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?q=80&w=800",
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800",
    ];
    while (arr.length < 5) arr.push(fallbacks[(arr.length - 1) % fallbacks.length]);
    return arr;
  })();
  const allLightboxImages = [...heroImages, ...galleryList.filter(g => !heroImages.includes(g))].map(src => ({ src }));

  // ── Schedule calendar renderer ─────────────────────────────────────────────
  const renderScheduleMonth = (mDate: Date) => {
    const year  = mDate.getFullYear();
    const month = mDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const blanks = Array(firstDayIndex).fill(null);
    const days   = Array.from({ length: totalDays }, (_, i) => i + 1);

    const rangeStart = scheduleStart || hoverDate;
    const rangeEnd   = rangeStart ? addDays(rangeStart, tripDays - 1) : null;

    return (
      <div className="flex flex-col gap-2">
        <div className="text-center font-serif font-black text-xs text-[#1A1A2E] py-2 bg-slate-50 border border-slate-200/60 rounded-xl uppercase tracking-wider">
          {months[month]} {year}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-[9px] uppercase text-[#6B6B6B] border-b border-[#E5E5E5] pb-1.5 mt-1">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 mt-1.5">
          {blanks.map((_, idx) => <div key={`blank-${idx}`} className="aspect-square" />)}
          {days.map(day => {
            const date = new Date(year, month, day);
            date.setHours(0,0,0,0);
            const past = date < startOfToday;
            const isRangeStart = rangeStart && isSameDay(date, rangeStart);
            const isRangeEnd   = rangeEnd   && isSameDay(date, rangeEnd);
            const inRange      = rangeStart && rangeEnd && date > rangeStart && date < rangeEnd;

            let cellStyle = "bg-white text-[#1A1A2E] border border-slate-200 hover:border-[#2E7D32] hover:bg-emerald-50 cursor-pointer";
            if (past)                    cellStyle = "text-slate-300 cursor-not-allowed";
            else if (isRangeStart || isRangeEnd) cellStyle = "bg-[#2E7D32] text-white font-black border border-[#2E7D32] shadow-sm cursor-pointer";
            else if (inRange)            cellStyle = "bg-emerald-100 text-emerald-900 font-bold cursor-pointer";

            return (
              <button
                key={`day-${day}`}
                type="button"
                disabled={past}
                onClick={() => { if (!past) setScheduleStart(date); }}
                onMouseEnter={() => { if (!past) setHoverDate(date); }}
                onMouseLeave={() => setHoverDate(null)}
                className={`aspect-square w-full rounded-xl flex items-center justify-center select-none transition text-[11px] ${cellStyle}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Inclusion/Exclusion card renderer ──────────────────────────────────────
  const renderPackageCard = (title: string, groups: { label: string; Icon: any; items: string[] }[], included: boolean) => {
    const HeaderIcon = included ? FaCheckCircle : FaTimesCircle;
    const BulletIcon = included ? FiPlusCircle  : FiXCircle;
    const accent     = included ? "text-[#2E7D32]" : "text-[#D32F2F]";
    const headerBg   = included ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100";
    return (
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        <div className={`flex items-center gap-3 px-6 md:px-8 py-5 border-b ${headerBg}`}>
          <span className={`w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm ${accent}`}>
            <HeaderIcon className="text-lg" />
          </span>
          <h2 className="font-serif text-xl md:text-2xl font-black text-[#1A1A2E]">{title}</h2>
        </div>
        <div className="p-5 md:p-8 flex flex-col gap-4">
          {groups.map((group, gi) => {
            const CatIcon = group.Icon;
            return (
              <div key={gi} className="border border-[#E5E5E5] rounded-xl overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 bg-[#F8F7F4] border-b border-[#E5E5E5]">
                  <CatIcon className={`text-sm ${accent}`} />
                  <h3 className="font-bold text-sm text-[#1A1A2E]">{group.label}</h3>
                </div>
                <ul className="flex flex-col divide-y divide-dashed divide-[#E5E5E5] px-4">
                  {group.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-3 py-3 text-xs md:text-sm text-[#3D3D3D]">
                      <BulletIcon className={`${accent} text-base mt-0.5 shrink-0`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Review cards ───────────────────────────────────────────────────────────
  const reviewCards = {
    tripadvisor: STATIC_TRIPADVISOR_REVIEWS,
    google: testimonials && testimonials.length > 0
      ? testimonials.map(t => ({ author: t.clientName, country: t.country || "Traveler", stars: t.rating || 5, title: "Excellent Experience!", text: t.reviewText }))
      : [{ author: "David Miller", country: "United States", stars: 5, title: "Professional outfit, fair prices, best guides", text: "From my initial inquiry to the final airport transfer, everything was smooth. Nature Heaven Trekking matched a premium standard in every way. Very fair prices compared to western companies, yet the service is exceptional." }],
    facebook: [{ author: "Emma Watson", country: "Canada", stars: 5, title: "Highly recommend for solo travelers!", text: "I joined a group trek and had an amazing time. Our Sherpa guide made us feel like family. Safe, eco-friendly, and beautiful trails. I will definitely return to Nepal and trek with them again." }],
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#F8F7F4] text-[#3D3D3D] font-sans antialiased pb-16 lg:pb-0">
      {/* Lightbox */}
      <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} index={lightboxIndex} slides={allLightboxImages} on={{ view: ({ index }) => setLightboxIndex(index) }} />

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO PHOTO GALLERY
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#1a2e1f] overflow-hidden">
        {/* Desktop: split grid */}
        <div className="hidden md:grid md:grid-cols-[60fr_40fr] gap-1 h-[72vh] max-h-[620px]">
          <div className="relative overflow-hidden cursor-pointer group" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
            <Image src={heroImages[0]} alt={`${trek.title} - Main Photo`} fill priority className="object-cover object-center transition duration-700 group-hover:scale-105" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-1">
            {heroImages.slice(1,5).map((img, idx) => (
              <div key={idx} className="relative overflow-hidden cursor-pointer group" onClick={() => { setLightboxIndex(idx+1); setLightboxOpen(true); }}>
                <Image src={img} alt={`${trek.title} photo ${idx+2}`} fill className="object-cover object-center transition duration-700 group-hover:scale-110" unoptimized />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-300" />
              </div>
            ))}
          </div>
          <button onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }} className="absolute bottom-5 right-5 z-20 bg-white/95 backdrop-blur-sm hover:bg-white text-[#1a2e1f] font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95 border border-white/50">
            <FaRegImage className="text-sm" /> View All Photos ({allLightboxImages.length})
          </button>
        </div>

        {/* Mobile: swipe carousel */}
        <div className="relative md:hidden h-[55vw] min-h-[260px] max-h-[400px] overflow-hidden select-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {heroImages.map((img, idx) => (
            <div key={idx} className={`absolute inset-0 transition-opacity duration-500 ${idx === carouselIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`} onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}>
              <Image src={img} alt={`${trek.title} photo ${idx+1}`} fill priority={idx===0} className="object-cover object-center" unoptimized />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none z-20" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
            {heroImages.map((_, idx) => (
              <button key={idx} onClick={e => { e.stopPropagation(); setCarouselIndex(idx); }} className={`rounded-full transition-all duration-300 ${idx===carouselIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
            ))}
          </div>
          <button onClick={() => { setLightboxIndex(carouselIndex); setLightboxOpen(true); }} className="absolute bottom-3 right-3 z-30 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 backdrop-blur-sm">
            <FaRegImage className="h-3 w-3" /> {allLightboxImages.length} Photos
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. TITLE & META BAR
          ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-[#E5E5E5] py-6 md:py-8">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 flex flex-col gap-4">
          {/* Breadcrumb */}
          <div className="text-xs text-[#6B6B6B] flex items-center gap-1.5 font-semibold flex-wrap">
            <Link href="/" className="hover:text-[#2E7D32] transition">Home</Link>
            <span className="text-[#D0D0D0]">/</span>
            <Link href="/trips" className="hover:text-[#2E7D32] transition">Trips</Link>
            <span className="text-[#D0D0D0]">/</span>
            <span className="text-[#1A1A2E] font-medium truncate max-w-[200px]">{trek.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#1a2e1f] text-white font-bold text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full">{trek.region?.name || "Nepal"} Region</span>
                {trek.isBestSeller && <span className="bg-gradient-to-r from-[#F5A623] to-[#e8950f] text-white font-bold text-[10px] tracking-[0.12em] uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-sm"><FaStar className="text-[9px]" /> Best Seller</span>}
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] tracking-[0.12em] uppercase px-3 py-1 rounded-full">{trek.duration} Days</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-[#1a2e1f]">{trek.title}</h1>
            </div>
            <div className="flex items-center gap-2.5 relative shrink-0">
              <button onClick={() => setShowShare(!showShare)} className="bg-white hover:bg-slate-50 border border-[#E5E5E5] px-3.5 py-2 rounded-xl text-xs font-bold text-[#1A1A2E] transition flex items-center gap-1.5 shadow-sm hover:shadow">
                <FaShareAlt /> Share
              </button>
              {showShare && (
                <div className="absolute right-0 top-full mt-2 bg-white text-[#1A1A2E] rounded-xl shadow-2xl p-4 flex flex-col gap-2 z-50 min-w-[200px] border border-[#E5E5E5]">
                  <a href={`https://wa.me/?text=Check%20out%20this%20trek:%20${encodeURIComponent(typeof window!=="undefined"?window.location.href:"")}`} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-2 hover:bg-slate-100 p-2 rounded transition"><FaWhatsapp className="text-green-500" /> Share on WhatsApp</a>
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); setShowShare(false); }} className="text-left text-xs flex items-center gap-2 hover:bg-slate-100 p-2 rounded transition"><FaEnvelope /> Copy Link</button>
                </div>
              )}
              <a href="/packing-list" className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm hover:shadow-md"><FaDownload /> PDF Brochure</a>
            </div>
          </div>

          {/* Rating strip */}
          <div className="flex flex-wrap items-center gap-4 border-t border-[#F0F0F0] pt-4 mt-1">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <FaStar key={i} className="text-[#F5A623] text-sm" />)}
              <span className="text-[#1A1A2E] text-xs font-bold ml-1.5">5.0</span>
              <span className="text-[#6B6B6B] text-xs font-semibold ml-0.5">(420 Reviews)</span>
            </div>
            <span className="h-4 w-px bg-[#E5E5E5]" />
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
              <span className="bg-emerald-700 text-white rounded-full px-2.5 py-0.5 text-[9px] font-bold">TripAdvisor</span>
              <span className="font-semibold">Certificate of Excellence</span>
            </div>
            <span className="h-4 w-px bg-[#E5E5E5]" />
            <span className="text-xs text-[#6B6B6B] font-semibold flex items-center gap-1">
              🏔️ Max altitude: <strong className="text-[#1A1A2E] ml-1">{trek.maxAltitude?.toLocaleString()}m</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. STICKY SUB-NAV
          ════════════════════════════════════════════════════════════════════ */}
      <nav className={`sticky top-0 bg-[#F1F3F5] border-b border-slate-200 shadow-md z-40 overflow-x-auto scrollbar-none font-sans font-bold text-xs transition-all duration-300 ${hideSubNav ? "-translate-y-full opacity-0 pointer-events-none" : ""}`}>
        <div className="max-w-[1240px] mx-auto flex items-center justify-start h-12">
          {[
            { id: "overview",  label: "Overview",  icon: <FaRegEye className="text-sm shrink-0" /> },
            { id: "schedule",  label: "Schedule",  icon: <FaRegCalendarCheck className="text-sm shrink-0" /> },
            { id: "video",     label: "Video",     icon: <FaPlay className="text-xs shrink-0" /> },
            { id: "itinerary", label: "Itinerary", icon: <FaListUl className="text-sm shrink-0" /> },
            { id: "includes",  label: "Includes",  icon: <FaRegCheckCircle className="text-sm shrink-0" /> },
            { id: "map",       label: "Map",       icon: <FaMap className="text-sm shrink-0" /> },
            { id: "packing",   label: "Equipment", icon: <FaHiking className="text-sm shrink-0" /> },
            { id: "info",      label: "Trip Info", icon: <FaInfoCircle className="text-sm shrink-0" /> },
            { id: "reviews",   label: "Reviews",   icon: <FaRegComments className="text-sm shrink-0" /> },
            { id: "faqs",      label: "FAQs",      icon: <FaQuestionCircle className="text-sm shrink-0" /> },
          ].map(sec => (
            <button key={sec.id} onClick={() => scrollToSection(sec.id)} className={`h-full flex items-center gap-2 px-5 transition-all duration-200 whitespace-nowrap border-r border-slate-200/80 last:border-r-0 select-none ${activeSection===sec.id ? "bg-[#1a2e1f] text-white font-black" : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900"}`}>
              {sec.icon}<span>{sec.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          4. TWO-COLUMN CONTENT GRID
          ════════════════════════════════════════════════════════════════════ */}
      <section id="main-content-grid" className="max-w-[1240px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-8 min-w-0">

            {/* Key Specs Card */}
            <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-sm p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6">
                {[
                  { label: "Destination",     value: trek.region?.name || "Nepal",           Icon: FaGlobeAsia,    iconBg: "bg-blue-500" },
                  { label: "Difficulty Grade",value: trek.difficulty?.toUpperCase(),          Icon: FaSignal,       iconBg: "bg-red-500" },
                  { label: "Start / End",     value: `${trek.startPoint||"KTM"} / ${trek.endPoint||"KTM"}`, Icon: FaMapMarkerAlt, iconBg: "bg-teal-600" },
                  { label: "Accommodation",   value: trek.accommodationType || "Teahouses & Hotels", Icon: FaBed,     iconBg: "bg-purple-500" },
                  { label: "Best Season",     value: trek.bestSeason || "Spring & Autumn",   Icon: FaCalendarAlt,  iconBg: "bg-amber-500" },
                  { label: "Meals Included",  value: trek.mealsIncluded || "Breakfast, Lunch & Dinner", Icon: FaUtensils, iconBg: "bg-orange-500" },
                  { label: "Activity",        value: "High Altitude Trekking",               Icon: FaWalking,      iconBg: "bg-indigo-500" },
                  { label: "Max Altitude",    value: `${trek.maxAltitude}m / ${Math.round(trek.maxAltitude*3.28084)}ft`, Icon: FaMountain, iconBg: "bg-teal-600" },
                ].map((spec, idx) => {
                  const Icon = spec.Icon;
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <span className={`shrink-0 w-12 h-12 rounded-full ${spec.iconBg} text-white flex items-center justify-center shadow-sm`}><Icon className="text-lg" /></span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A] font-bold">{spec.label}</span>
                        <span className="text-sm font-black text-[#1A1A2E] mt-0.5 leading-snug">{spec.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── OVERVIEW / HIGHLIGHTS CONTAINER ──────────────────────── */}
            <div id="overview" className="flex flex-col gap-8 scroll-mt-24">
              {/* Highlights first */}
              {highlightsList.length > 0 && (
                <div id="highlights" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-[#2E7D32] text-[#F5A623] flex items-center justify-center shrink-0 shadow-sm"><FaStar className="text-lg" /></span>
                    Trek Highlights
                  </h2>
                  <ul className="flex flex-col divide-y divide-[#F0F0F0]">
                    {highlightsList.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm md:text-base font-medium text-[#3D3D3D] py-3 first:pt-0 last:pb-0">
                        <FaRegCheckCircle className="text-[#2E7D32] text-base mt-0.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Overview details second */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6">
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4">Trip Overview</h2>
                <div className="prose max-w-none text-sm md:text-base leading-relaxed text-[#3D3D3D]">
                  {trek.overview ? renderLexical(trek.overview) : <p>Detailed trek overview coming soon.</p>}
                </div>
              </div>
            </div>

            {/* ── FLIGHT INFO (CMS richText) ────────────────────────────── */}
            {trek.flightInfo && (
              <div id="flight-info" className="bg-[#eef5fb] rounded-2xl border border-[#dce8f3] p-6 md:p-10 shadow-sm scroll-mt-24">
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-sm"><FaPaperPlane className="text-base" /></span>
                  {trek.flightInfoTitle || 'Lukla Flight Information'}
                </h2>
                <div className="prose max-w-none text-sm md:text-base leading-relaxed text-[#3D3D3D]">
                  {renderLexical(trek.flightInfo)}
                </div>
              </div>
            )}

            {/* ── TRIP BRIEFING (CMS richText) ─────────────────────────── */}
            {trek.briefingInfo && (
              <div id="trip-briefing" className="bg-[#fdf7ec] rounded-2xl border border-[#f1e6cf] p-6 md:p-10 shadow-sm scroll-mt-24">
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-sm"><FaRegCalendarCheck className="text-base" /></span>
                  Online Trip Briefing
                </h2>
                <div className="prose max-w-none text-sm md:text-base leading-relaxed text-[#3D3D3D]">
                  {renderLexical(trek.briefingInfo)}
                </div>
              </div>
            )}

            {/* ── PHOTO GALLERY ─────────────────────────────────────────── */}
            <div id="gallery" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryList.map((img, idx) => (
                  <div key={idx} className="relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden shadow-sm group bg-slate-100" onClick={() => { setLightboxIndex(heroImages.length+idx); setLightboxOpen(true); }}>
                    <Image src={img} alt={`${trek.title} gallery ${idx+1}`} fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover hover:scale-105 transition duration-300 cursor-pointer" unoptimized />
                  </div>
                ))}
              </div>
            </div>

            {/* ── SCHEDULE / PLAN YOUR DATES ───────────────────────────── */}
            <div id="schedule" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
                <span className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-sm"><FaRegCalendarCheck className="text-base" /></span>
                Plan Your Trek Schedule
              </h2>

              <div className="bg-[#eef5fb] border border-[#dce8f3] rounded-2xl p-5">
                <h3 className="font-bold text-sm md:text-base text-[#1A1A2E] flex items-center gap-2 mb-1">
                  <FaRegCalendarCheck className="text-[#2E7D32]" /> Pick Your Start Date
                </h3>
                <p className="text-xs md:text-sm text-[#3D3D3D] leading-relaxed">
                  Click any date below to select your departure day. The calendar will automatically highlight your full <strong>{trek.duration}-day</strong> trip window. Use the arrows to browse months.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200/60 border border-slate-200/60 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 p-5 flex items-center gap-3">
                  <FaRegClock className="text-[#2E7D32] text-lg shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-bold">Trip Duration</span>
                    <span className="text-sm font-black text-[#1A1A2E]">{trek.duration} Days</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-5 flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#2E7D32] text-lg shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-bold">Start / End Point</span>
                    <span className="text-sm font-black text-[#1A1A2E]">{trek.startPoint || "Kathmandu"} → {trek.endPoint || "Kathmandu"}</span>
                  </div>
                </div>
              </div>

              {/* Month navigation */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setCurrentMonthDate(p => { const n=new Date(p); n.setMonth(p.getMonth()-1); return n; })} className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E5] hover:bg-slate-50 hover:border-[#2E7D32] flex items-center justify-center font-bold text-slate-700 transition shadow-sm cursor-pointer select-none">&lt;</button>
                  <button type="button" onClick={() => setCurrentMonthDate(p => { const n=new Date(p); n.setMonth(p.getMonth()+1); return n; })} className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E5] hover:bg-slate-50 hover:border-[#2E7D32] flex items-center justify-center font-bold text-slate-700 transition shadow-sm cursor-pointer select-none">&gt;</button>
                </div>
                <div className="flex items-center gap-3">
                  <select value={currentMonthDate.getMonth()} onChange={e => setCurrentMonthDate(p => { const n=new Date(p); n.setMonth(+e.target.value); return n; })} className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1A1A2E] focus:outline-none focus:border-[#2E7D32] cursor-pointer">
                    {months.map((name,i) => <option key={i} value={i}>{name}</option>)}
                  </select>
                  <select value={currentMonthDate.getFullYear()} onChange={e => setCurrentMonthDate(p => { const n=new Date(p); n.setFullYear(+e.target.value); return n; })} className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1A1A2E] focus:outline-none focus:border-[#2E7D32] cursor-pointer">
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Dual month calendar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderScheduleMonth(currentMonthDate)}
                {(() => { const n=new Date(currentMonthDate); n.setMonth(n.getMonth()+1); return renderScheduleMonth(n); })()}
              </div>

              {/* Selected trip summary */}
              {scheduleStart && scheduleEnd && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="bg-[#2E7D32] text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">Your Trip</span>
                  <span className="font-serif font-black text-base text-[#1A1A2E]">{fmtLong(scheduleStart)} → {fmtLong(scheduleEnd)}</span>
                  <span className="flex items-center gap-1.5 text-xs text-[#6B6B6B] font-semibold"><FaRegClock className="text-[#2E7D32]" /> {trek.duration} Days</span>
                  <button type="button" onClick={() => { setScheduleStart(null); setHoverDate(null); }} className="text-[11px] text-[#6B6B6B] hover:text-red-500 font-bold underline ml-auto cursor-pointer select-none">Clear</button>
                </div>
              )}

              <div className="border-t border-[#E5E5E5] pt-5 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs italic text-[#6B6B6B]">Group discounts are applied automatically at checkout.</span>
                <button type="button" onClick={handleScheduleBooking} disabled={!scheduleStart} className={`font-black text-xs uppercase px-6 py-3.5 rounded-xl tracking-wider transition-all duration-300 flex items-center gap-2 select-none ${scheduleStart ? "bg-[#008CCF] hover:bg-[#0070A6] text-white shadow-md hover:shadow-lg cursor-pointer" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
                  Continue Booking <FaArrowRight className="text-sm" />
                </button>
              </div>
            </div>

            {/* ── VIDEO ────────────────────────────────────────────────── */}
            {trek.youtubeVideoId && (
              <div id="video" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4">Trek Experience Video</h2>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                  <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${trek.youtubeVideoId}?autoplay=0`} title={`${trek.title} Video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
              </div>
            )}

            {/* ── DAY-BY-DAY ITINERARY ─────────────────────────────────── */}
            <div id="itinerary" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 flex-wrap gap-4">
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E]">Detailed Itinerary</h2>
                <div className="flex items-center gap-3 text-xs font-bold text-[#2E7D32]">
                  <button onClick={expandAllDays} className="hover:underline">Expand All</button>
                  <span className="h-3 w-px bg-[#E5E5E5]" />
                  <button onClick={collapseAllDays} className="hover:underline">Collapse All</button>
                </div>
              </div>
              {dayByDayItinerary.length === 0 ? (
                <p className="text-sm text-[#6B6B6B] italic">Itinerary details will be published soon. Please contact us for the day-by-day schedule.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {dayByDayItinerary.map(day => {
                    const isOpen = !!openDays[day.day];
                    return (
                      <div key={day.day} className="border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm bg-white">
                        <button onClick={() => toggleDay(day.day)} className="w-full px-5 py-4 bg-white hover:bg-slate-50 flex items-center justify-between text-left focus:outline-none transition group">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                              <span className="bg-[#2E7D32] text-white font-black font-sans text-xs px-2.5 py-1 rounded-md shrink-0">DAY {day.day}</span>
                              <span className="font-serif font-black text-sm md:text-base text-[#1A1A2E] group-hover:text-[#2E7D32] transition duration-300">{day.title}</span>
                            </div>
                            {day.location && (
                              <span className="inline-flex items-center gap-1 bg-[#008CCF]/10 text-[#008CCF] px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold border border-[#008CCF]/20 sm:ml-2">
                                <FaMapMarkerAlt className="text-[10px]" />
                                {day.location}
                              </span>
                            )}
                          </div>
                          <span className={`p-1 text-[#2E7D32] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}><FaChevronDown /></span>
                        </button>
                        {isOpen && (
                          <div className="px-5 py-5 bg-slate-50/50 border-t border-[#E5E5E5] flex flex-col gap-4 animate-fadeIn">
                            
                            {/* Specs Ribbon (Location & Height Template) */}
                            {(day.distance || day.flightHours || day.altitude || day.trekDuration) && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#F4F8FA] border border-[#E2E8F0] rounded-2xl mb-2 shadow-sm text-xs font-semibold">
                                {/* Trek Distance */}
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-full bg-white text-[#2E7D32] flex items-center justify-center shadow-sm shrink-0"><FaWalking className="text-sm" /></span>
                                  <div className="flex flex-col">
                                    <span className="text-[9px] text-[#6B6B6B] uppercase font-bold tracking-wider">Trek Distance</span>
                                    <span className="text-[#1A1A2E] font-black">{day.distance || "N/A"}</span>
                                  </div>
                                </div>
                                {/* Flight / Transport Hours */}
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-full bg-white text-[#008CCF] flex items-center justify-center shadow-sm shrink-0"><FaPaperPlane className="text-xs" /></span>
                                  <div className="flex flex-col">
                                    <span className="text-[9px] text-[#6B6B6B] uppercase font-bold tracking-wider">Flight / Drive</span>
                                    <span className="text-[#1A1A2E] font-black">{day.flightHours || "None"}</span>
                                  </div>
                                </div>
                                {/* Highest Altitude */}
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-full bg-white text-[#E56F1F] flex items-center justify-center shadow-sm shrink-0"><FaMountain className="text-xs" /></span>
                                  <div className="flex flex-col">
                                    <span className="text-[9px] text-[#6B6B6B] uppercase font-bold tracking-wider">Highest Altitude</span>
                                    <span className="text-[#1A1A2E] font-black">
                                      {day.altitude ? `${day.altitude.toLocaleString()}m / ${Math.round(day.altitude * 3.28084).toLocaleString()}ft` : "N/A"}
                                    </span>
                                  </div>
                                </div>
                                {/* Trek Duration */}
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-full bg-white text-[#7042F4] flex items-center justify-center shadow-sm shrink-0"><FaRegClock className="text-sm" /></span>
                                  <div className="flex flex-col">
                                    <span className="text-[9px] text-[#6B6B6B] uppercase font-bold tracking-wider">Trek Duration</span>
                                    <span className="text-[#1A1A2E] font-black">{day.trekDuration || "N/A"}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Description paragraph */}
                            <p className="text-xs md:text-sm text-[#3D3D3D] leading-relaxed mt-1">{day.description}</p>

                            {/* Day Media Gallery (Images & YouTube Videos) */}
                            {day.media && day.media.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-2">
                                {day.media.map((item, mIdx) => {
                                  const isVideo = item.type === "video";
                                  const youtubeId = isVideo && item.youtubeUrl ? parseYoutubeIdStatic(item.youtubeUrl) : null;
                                  const thumbnailUrl = isVideo
                                    ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
                                    : getMediaUrl(item.image);

                                  return (
                                    <div
                                      key={mIdx}
                                      className="relative aspect-video rounded-2xl overflow-hidden shadow-md group bg-slate-900 border border-slate-200/50 cursor-pointer"
                                      onClick={() => {
                                        if (isVideo && youtubeId) {
                                          setVideoModalId(youtubeId);
                                        } else if (!isVideo && item.image) {
                                          setItineraryLightboxImage(getMediaUrl(item.image));
                                        }
                                      }}
                                    >
                                      {/* Background Image / Thumbnail */}
                                      {thumbnailUrl && (
                                        <Image
                                          src={thumbnailUrl}
                                          alt={item.title || "Itinerary Media"}
                                          fill
                                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                          className="object-cover transition-all duration-500 group-hover:scale-105"
                                          unoptimized
                                        />
                                      )}

                                      {/* Dark overlay */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300 group-hover:from-black/90" />

                                      {/* Custom Play Button for Videos or Caption for Images */}
                                      {isVideo ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                                          <div className="w-11 h-11 rounded-full bg-[#008CCF]/95 text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 relative">
                                            <span className="absolute -inset-1 rounded-full bg-[#008CCF]/30 animate-ping" />
                                            <FaPlay className="text-xs ml-0.5" />
                                          </div>
                                          {item.title && (
                                            <span className="mt-2.5 text-[10px] md:text-xs font-black text-white uppercase tracking-wider line-clamp-2 px-2 drop-shadow-md">
                                              {item.title}
                                            </span>
                                          )}
                                        </div>
                                      ) : (
                                        item.title && (
                                          <div className="absolute bottom-3 left-3 right-3 text-left">
                                            <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-wider line-clamp-2 drop-shadow-md">
                                              {item.title}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Upgraded Food & Staying Blocks */}
                            {(day.accommodation || day.meals) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3.5 border-t border-[#E2E8F0] mt-1">
                                {day.accommodation && (
                                  <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl hover:bg-slate-100/50 transition">
                                    <span className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] text-[#2E7D32] flex items-center justify-center shadow-sm shrink-0"><FaBed className="text-sm" /></span>
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-wider">Accommodation</span>
                                      <span className="text-xs md:text-sm font-semibold text-[#3D3D3D] leading-snug">{day.accommodation}</span>
                                    </div>
                                  </div>
                                )}
                                {day.meals && (
                                  <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl hover:bg-slate-100/50 transition">
                                    <span className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] text-[#2E7D32] flex items-center justify-center shadow-sm shrink-0"><FaUtensils className="text-xs" /></span>
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-wider">Meals Provided</span>
                                      <span className="text-xs md:text-sm font-semibold text-[#3D3D3D] leading-snug">{day.meals}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── INCLUSIONS & EXCLUSIONS ───────────────────────────────── */}
            <div id="includes" className="flex flex-col gap-6 scroll-mt-24">
              {renderPackageCard("What is Included in This Package", inclusionGroups, true)}
              {renderPackageCard("What is Excluded from This Package", exclusionGroups, false)}
            </div>

            {/* ── ROUTE MAP ─────────────────────────────────────────────── */}
            <div id="map" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
              <div className="flex items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4 flex-wrap">
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E]">Trek Route Map</h2>
                {mapImageUrl && (
                  <button type="button" onClick={handleDownloadMap} className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 shrink-0">
                    <FaDownload /> Download Map
                  </button>
                )}
              </div>
              {mapImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mapImageUrl} alt={`${trek.title} Route Map`} className="w-full h-auto rounded-xl border border-[#E5E5E5] bg-slate-50" />
              ) : trek.gpsCoordinates && trek.gpsCoordinates.length > 0 ? (
                <TrekMap waypoints={trek.gpsCoordinates} center={trek.region?.mapCenter} />
              ) : (
                <div className="h-[300px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 text-sm">No route map available. Upload one in the CMS under Media → Route Map Image.</div>
              )}
            </div>

            {/* ── PACKING / EQUIPMENT LIST ─────────────────────────────── */}
            <div id="packing" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 flex-wrap gap-4">
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E]">Required Equipment List</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
                  <span>Progress: {totalPackedItems}/{totalChecklistItems} packed ({packedPercentage}%)</span>
                </div>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${packedPercentage}%` }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                {packingChecklist.map((cat, idx) => (
                  <div key={idx} className="flex flex-col gap-3">
                    <h4 className="font-serif text-base font-bold text-[#1A1A2E] border-b border-[#E5E5E5] pb-1.5">{cat.category}</h4>
                    <div className="flex flex-col gap-2">
                      {cat.items.map((itemObj, itemIdx) => {
                        const itemText = typeof itemObj === "string" ? itemObj : itemObj.item;
                        const isPacked = !!packedItems[itemText];
                        return (
                          <label key={itemIdx} className={`flex items-start gap-2.5 text-xs cursor-pointer p-1 rounded hover:bg-slate-50 select-none ${isPacked ? "text-[#6B6B6B] line-through font-medium" : "text-[#3D3D3D] font-semibold"}`}>
                            <input type="checkbox" checked={isPacked} onChange={() => toggleChecklistItem(itemText)} className="mt-0.5 rounded accent-[#2E7D32] cursor-pointer" />
                            <span>{itemText}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── TRIP INFO — Named Topic Cards ─────────────────────────── */}
            <div id="info" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-sm"><FaInfoCircle className="text-base" /></span>
                {trek.title} — Important Trip Info
              </h2>

              {trek.tripInfoSections && trek.tripInfoSections.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {trek.tripInfoSections.map((section, idx) => {
                    const isOpen = !!openInfoCards[idx];
                    const Icon = TRIP_INFO_ICONS[section.icon || "info"] || <FaInfoCircle />;
                    return (
                      <div key={idx} className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? "border-[#2E7D32]/30 bg-[#2E7D32]/[0.02] shadow-sm" : "border-[#E5E5E5] bg-white"}`}>
                        <button onClick={() => toggleInfoCard(idx)} className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left group">
                          <div className="flex items-center gap-3">
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition ${isOpen ? "bg-[#2E7D32] text-white" : "bg-slate-100 text-[#2E7D32]"}`}>{Icon}</span>
                            <h3 className={`font-serif font-black text-sm md:text-base transition-colors ${isOpen ? "text-[#2E7D32]" : "text-[#1A1A2E] group-hover:text-[#2E7D32]"}`}>{section.title}</h3>
                          </div>
                          <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#2E7D32] text-white rotate-180" : "bg-[#E5E5E5] text-[#6B6B6B] group-hover:bg-[#2E7D32]/20 group-hover:text-[#2E7D32]"}`}>
                            <FaChevronDown className="text-[10px]" />
                          </span>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                          <div className="px-4 md:px-5 pb-5 pt-1 border-t border-[#E5E5E5]/40">
                            <div className="prose prose-sm max-w-none text-[#3D3D3D] leading-relaxed">
                              {renderLexical(section.content)}
                            </div>
                            {section.image && (
                              <div className="mt-4 rounded-xl overflow-hidden border border-slate-200/60 shadow-sm max-w-full bg-slate-50">
                                <img
                                  src={getMediaUrl(section.image)}
                                  alt={section.title}
                                  className="w-full h-auto object-contain max-h-[600px] mx-auto block"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[#6B6B6B] italic">Trip information topics will be added soon. Contact us for details about accommodation, meals, permits, and more.</p>
              )}
            </div>

            {/* ── REVIEWS ───────────────────────────────────────────────── */}
            <div id="reviews" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
              <div className="border-b border-[#E5E5E5] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E]">Customer Reviews</h2>
                <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] font-bold">
                  <div className="flex text-[#F5A623] gap-0.5"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                  <span>4.9/5 based on 320 reviews</span>
                </div>
              </div>
              <div className="flex border-b border-[#E5E5E5] gap-2 overflow-x-auto scrollbar-none">
                {[{ id:"tripadvisor",label:"TripAdvisor",rating:"5.0 ★"},{ id:"google",label:"Google",rating:"4.9 ★"},{ id:"facebook",label:"Facebook",rating:"5.0 ★"}].map(tab => (
                  <button key={tab.id} onClick={() => setActiveReviewTab(tab.id as any)} className={`px-4 py-2 border-b-2 font-sans font-bold text-xs transition whitespace-nowrap focus:outline-none ${activeReviewTab===tab.id ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#6B6B6B] hover:text-[#2E7D32]"}`}>
                    {tab.label} <span className="ml-1 text-[9px] bg-slate-100 rounded px-1">{tab.rating}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-5 mt-4">
                {reviewCards[activeReviewTab].map((rev, idx) => {
                  const isExpanded = !!expandedReviews[idx];
                  const shouldTruncate = rev.text.length > 220;
                  const displayStr = shouldTruncate && !isExpanded ? `${rev.text.substring(0,220)}...` : rev.text;
                  return (
                    <div key={idx} className="bg-slate-50 border border-[#E5E5E5] rounded-xl p-5 md:p-6 flex flex-col gap-2 shadow-sm hover:shadow transition duration-300">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div className="flex text-[#F5A623] gap-0.5 text-xs">{[...Array(rev.stars)].map((_,i)=><FaStar key={i}/>)}</div>
                        <span className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-wider">{rev.author} ({rev.country})</span>
                      </div>
                      <h4 className="font-serif font-black text-sm md:text-base text-[#1A1A2E]">{rev.title}</h4>
                      <p className="text-xs md:text-sm text-[#3D3D3D] leading-relaxed">&ldquo;{displayStr}&rdquo;</p>
                      {shouldTruncate && (
                        <button onClick={() => setExpandedReviews(p=>({...p,[idx]:!p[idx]}))} className="text-xs font-bold text-[#2E7D32] self-start hover:underline mt-1 focus:outline-none">
                          {isExpanded ? "Show Less" : "Read Full Review"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>{/* end LEFT COLUMN */}

          {/* ── RIGHT COLUMN (Sticky Booking Sidebar) ─────────────────── */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-[64px] self-start h-fit w-full">

            {/* BOOKING WIDGET */}
            <div id="booking-card-widget" className="relative bg-white border border-[#E5E5E5] shadow-lg rounded-2xl p-6 flex flex-col gap-5">
              {/* Discount ribbon */}
              {trek.discountedPrice && trek.price > trek.discountedPrice && (
                <div className="absolute -top-6 -right-6 bg-[#FF9800] text-white font-extrabold text-[9px] uppercase px-3 py-1 rounded-tr-2xl rounded-bl-2xl shadow-sm z-10 select-none">
                  SAVE ${trek.price - trek.discountedPrice} PP
                </div>
              )}

              {/* Price */}
              <div>
                <span className="text-[10px] text-[#6B6B6B] uppercase tracking-wider font-extrabold block mb-1">Starting Price</span>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  {trek.price > (trek.discountedPrice || trek.price) && (
                    <span className="text-sm text-[#6B6B6B] line-through font-semibold">${trek.price}</span>
                  )}
                  <span className="text-3xl font-black text-[#1a3c2e] font-sans">${trek.discountedPrice || trek.price}</span>
                  <span className="text-xs text-[#6B6B6B] font-bold">USD / PP</span>
                </div>
              </div>

              {/* Duration pill */}
              <div className="bg-[#1a2e1f]/5 text-[#1a2e1f] font-bold text-xs px-3.5 py-2.5 rounded-xl border border-[#1a2e1f]/10 shadow-inner flex items-center justify-center gap-2">
                <span>⏱️ {trek.duration} Days</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a2e1f]/20" />
                <span>From ${trek.discountedPrice || trek.price} PP</span>
              </div>

              {/* Group discount table */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-extrabold uppercase text-[#6B6B6B] tracking-wider">Group Size Discounts</span>
                <div className="flex flex-col border border-[#E5E5E5] rounded-xl overflow-hidden text-[10px] bg-slate-50/20 shadow-inner">
                  <div className="grid grid-cols-[1.5fr_1fr] bg-slate-50/80 font-bold border-b border-[#E5E5E5] p-2 text-[#6B6B6B] uppercase tracking-wider">
                    <span>Persons</span><span className="text-right">Price PP</span>
                  </div>
                  {groupDiscounts.slice(0,4).map((tier,idx) => (
                    <div key={idx} className="grid grid-cols-[1.5fr_1fr] p-2 border-b last:border-0 border-[#E5E5E5]/60 font-semibold text-[#3D3D3D]">
                      <span>{tier.minPersons===tier.maxPersons ? `${tier.minPersons} Person` : `${tier.minPersons}–${tier.maxPersons} Persons`}</span>
                      <span className="text-right font-bold text-[#1a3c2e]">${tier.pricePerPerson}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected dates summary */}
              {scheduleStart && scheduleEnd && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1"><FaRegCalendarCheck /> Your Selected Dates</div>
                  <div className="font-serif font-black text-[#1A1A2E]">{fmtLong(scheduleStart)}</div>
                  <div className="text-[#6B6B6B]">→ {fmtLong(scheduleEnd)} · {trek.duration} days</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2.5 border-t border-[#E5E5E5] pt-4">
                <button type="button" onClick={handleProceedToBooking} className="w-full bg-[#008CCF] hover:bg-[#0070A6] text-white font-bold py-3.5 rounded-xl transition duration-300 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer">
                  <FaRegCalendarCheck className="text-sm shrink-0" /> {scheduleStart ? "Book Selected Dates" : "Book Now"}
                </button>
                <button type="button" onClick={() => setIsEnquiryModalOpen(true)} className="w-full bg-white hover:bg-[#F8F7F4] text-[#008CCF] border-2 border-[#008CCF] font-bold py-3 rounded-xl transition duration-300 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer">
                  Send Enquiry
                </button>
                <a href={`https://wa.me/${(siteSettings?.headerSettings?.expertWhatsApp || "9779851218358").replace(/[^0-9]/g,"")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition duration-300 shadow-sm">
                  <FaWhatsapp className="text-sm shrink-0" /> WhatsApp Us
                </a>
              </div>
            </div>

            {/* EXPERT ADVISOR */}
            <div className="bg-[#1a2e1f] text-white rounded-2xl shadow-md p-6 flex flex-col gap-4 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2E7D32] to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md border-2 border-green-500 shrink-0 select-none">
                  {(siteSettings?.headerSettings?.expertName || "K")[0]}
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-green-400 font-bold">Expert Advisor</span>
                  <h4 className="font-serif font-black text-base text-white">{siteSettings?.headerSettings?.expertName || "Kafle"}</h4>
                  <p className="text-[10px] text-white/60 font-semibold">Senior Himalayan Specialist</p>
                </div>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed border-t border-white/10 pt-3">
                &ldquo;Namaste! I have been guiding in the Himalayas for over 15 years. Contact me directly to customize your itinerary or check live trail conditions.&rdquo;
              </p>
              <div className="flex flex-col gap-2 mt-1">
                <a href={`https://wa.me/${(siteSettings?.headerSettings?.expertWhatsApp || "9779851218358").replace(/[^0-9]/g,"")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2.5 rounded-xl text-xs transition duration-300 shadow-sm"><FaWhatsapp /> WhatsApp Specialist</a>
                <a href={`mailto:${siteSettings?.headerSettings?.quickEmail || "info@natureheaventrek.com"}`} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2.5 rounded-xl text-xs transition duration-300"><FaEnvelope /> Email Consultation</a>
              </div>
            </div>

            {/* TRUST METRICS */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
              <h4 className="font-serif text-sm font-bold text-[#1A1A2E] flex items-center gap-1.5"><FaShieldAlt className="text-green-600" /> Secure Booking System</h4>
              <p className="text-[10px] md:text-xs text-[#6B6B6B] leading-relaxed">Your checkout session is secure and encrypted by 256-bit SSL. Associated with TAAN, KEEP, NMA, and registered with Nepal Tourism Board.</p>
              <div className="border-t border-[#E5E5E5] pt-3 flex flex-wrap gap-2 items-center justify-center">
                {["Stripe","PayPal","eSewa","Khalti","SWIFT"].map((name,i) => (
                  <span key={i} className="text-[9px] bg-slate-100 text-[#6B6B6B] border border-[#E5E5E5] font-extrabold rounded px-2 py-0.5 shadow-sm">{name}</span>
                ))}
              </div>
              <div className="border-t border-[#E5E5E5] pt-3 flex items-center gap-2 text-[10px] text-[#3D3D3D] font-bold">
                <FaMedkit className="text-red-500 text-lg shrink-0" />
                <span>Helicopter evacuation and oxygen safety setups verified.</span>
              </div>
            </div>

            {/* SIMILAR TREKS */}
            {similarTreks.length > 0 && (
              <div className="flex flex-col gap-3">
                <h4 className="font-serif font-black text-sm text-[#1A1A2E] border-b border-[#E5E5E5] pb-2">Similar Trek Packages</h4>
                <div className="flex flex-col gap-3">
                  {similarTreks.slice(0,2).map(simTrek => (
                    <Link key={simTrek.id} href={`/trips/${simTrek.slug}`} className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden hover:shadow-md transition duration-300 flex items-center gap-3 p-2.5 group">
                      <div className="relative h-16 w-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                        <Image src={getMediaUrl(simTrek.heroImage) || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800"} alt={simTrek.title} fill className="object-cover group-hover:scale-105 transition duration-300" unoptimized />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h5 className="font-sans font-bold text-xs text-[#1A1A2E] truncate group-hover:text-[#2E7D32] transition">{simTrek.title}</h5>
                        <span className="text-[10px] text-[#6B6B6B] mt-0.5">{simTrek.duration} Days</span>
                        <span className="text-xs font-black text-[#1a3c2e] mt-1">${simTrek.discountedPrice || simTrek.price} USD</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>{/* end RIGHT COLUMN */}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. FAQs — FULL WIDTH
          ════════════════════════════════════════════════════════════════════ */}
      <section id="faqs" className="max-w-[1240px] mx-auto px-4 md:px-6 pb-16 scroll-mt-24">
        {(() => {
          const faqData = (faqs && faqs.length > 0)
            ? faqs.map((f: any) => ({
                id: f.id || f._id || `faq-${Math.random()}`,
                question: f.question,
                answer: typeof f.answer === "string"
                  ? f.answer
                  : (f.answer?.root?.children
                      ? (() => { const extract = (nodes: any[]): string => nodes.map(n => n.type==="text"?(n.text||""):(n.children?extract(n.children):"")).join(" "); return extract(f.answer.root.children); })()
                      : (Array.isArray(f.answer) ? f.answer.map((b:any) => b?.children?.map((c:any)=>c?.text).join("")||"").join(" ") : "")),
                category: f.category || "general",
              }))
            : trek.faqs && trek.faqs.length > 0
            ? trek.faqs.map((f: any, idx: number) => ({
                id: f.id || `trek-faq-${idx}`,
                question: f.question,
                answer: typeof f.answer === "string"
                  ? f.answer
                  : (f.answer?.root?.children
                      ? (() => { const extract = (nodes: any[]): string => nodes.map(n => n.type==="text"?(n.text||""):(n.children?extract(n.children):"")).join(" "); return extract(f.answer.root.children); })()
                      : ""),
                category: f.category || "general",
              }))
            : DEFAULT_FAQS;

          const grouped: Record<string,any[]> = {};
          faqData.forEach((f:any) => { if (!grouped[f.category]) grouped[f.category]=[]; grouped[f.category].push(f); });
          const activeCats = Object.keys(FAQ_CATEGORIES).filter(cat => grouped[cat]?.length > 0);

          const toggleFaq = (id: string) => setExpandedFaqs(p => ({ ...p, [id]: !p[id] }));
          const expandCat = (catKey: string) => { const e: Record<string,boolean>={}; (grouped[catKey]||[]).forEach((f:any)=>{e[f.id]=true;}); setExpandedFaqs(p=>({...p,...e})); };
          const scrollToCat = (catKey: string) => { const el=document.getElementById(`faq-cat-${catKey}`); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-100,behavior:"smooth"}); };

          return (
            <>
              <h2 className="font-serif text-3xl md:text-4xl font-black text-[#1a2e1f] mb-8">FAQs For {trek.title}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
                {/* Sticky category nav */}
                <nav className="hidden lg:block lg:sticky lg:top-[80px] self-start">
                  <div className="flex flex-col gap-1 bg-white border border-[#E5E5E5] rounded-2xl p-2 shadow-sm">
                    {activeCats.map(catKey => {
                      const cat = FAQ_CATEGORIES[catKey as keyof typeof FAQ_CATEGORIES];
                      if (!cat) return null;
                      const active = activeFaqCat === catKey;
                      return (
                        <button key={catKey} onClick={() => scrollToCat(catKey)} className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-bold text-left transition-all duration-200 ${active ? "bg-[#1a3c2e] text-white shadow-md" : "text-[#3D3D3D] hover:bg-[#2E7D32]/10"}`}>
                          <span className="text-base shrink-0">{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </nav>
                {/* FAQ sections */}
                <div className="flex flex-col gap-10">
                  {activeCats.map(catKey => {
                    const cat = FAQ_CATEGORIES[catKey as keyof typeof FAQ_CATEGORIES];
                    if (!cat) return null;
                    return (
                      <div key={catKey} id={`faq-cat-${catKey}`} data-faq-cat={catKey} className="scroll-mt-28 flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] pb-3">
                          <h3 className="font-serif text-xl md:text-2xl font-black text-[#1a3c2e] flex items-center gap-2.5">
                            <span className="text-lg">{cat.icon}</span>{cat.label}
                          </h3>
                          <button onClick={() => expandCat(catKey)} className="text-xs font-bold text-[#c8922a] hover:underline shrink-0">Expand All</button>
                        </div>
                        <div className="flex flex-col gap-3">
                          {grouped[catKey].map((faq: any) => {
                            const isOpen = !!expandedFaqs[faq.id];
                            return (
                              <div key={faq.id} className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? "border-[#2E7D32]/30 bg-[#2E7D32]/[0.02] shadow-sm" : "border-[#E5E5E5] bg-white"}`}>
                                <button onClick={() => toggleFaq(faq.id)} className="w-full flex items-center justify-between gap-3 p-4 text-left group">
                                  <h4 className={`font-serif font-black text-sm md:text-base transition-colors ${isOpen ? "text-[#2E7D32]" : "text-[#1A1A2E] group-hover:text-[#2E7D32]"}`}>{faq.question}</h4>
                                  <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#2E7D32] text-white rotate-180" : "bg-[#E5E5E5] text-[#6B6B6B] group-hover:bg-[#2E7D32]/20 group-hover:text-[#2E7D32]"}`}>
                                    <FaChevronDown className="text-[10px]" />
                                  </span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                                  <p className="px-4 pb-4 text-xs md:text-sm text-[#6B6B6B] leading-relaxed border-t border-[#E5E5E5]/40 pt-3">{faq.answer}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          );
        })()}
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. MOBILE STICKY BOTTOM BAR
          ════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#E5E5E5] px-6 py-3.5 flex items-center justify-between z-40 lg:hidden shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[9px] text-[#6B6B6B] uppercase font-bold">From</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-[#1a3c2e]">${paxPrice}</span>
            <span className="text-[9px] text-[#6B6B6B] font-semibold">USD / PP</span>
          </div>
        </div>
        <button onClick={handleProceedToBooking} className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300">
          {scheduleStart ? "Book Dates" : "Book Trek"}
        </button>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal isOpen={isEnquiryModalOpen} onClose={() => setIsEnquiryModalOpen(false)} tripTitle={trek.title} defaultPrice={trek.discountedPrice || trek.price} />

      {/* Dynamic YouTube Video Modal */}
      {videoModalId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[999] flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn" onClick={() => setVideoModalId(null)}>
          <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10" onClick={e => e.stopPropagation()}>
            <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${videoModalId}?autoplay=1`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center font-bold text-lg cursor-pointer transition select-none z-10 hover:scale-105 active:scale-95" onClick={() => setVideoModalId(null)}>✕</button>
          </div>
        </div>
      )}

      {/* Dynamic Itinerary Image Modal (Lightbox) */}
      {itineraryLightboxImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[999] flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn" onClick={() => setItineraryLightboxImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={itineraryLightboxImage} alt="Itinerary Preview" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/10" />
            <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center font-bold text-lg cursor-pointer transition select-none z-10 hover:scale-105 active:scale-95" onClick={() => setItineraryLightboxImage(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
