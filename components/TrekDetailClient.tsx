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
  FaLock,
  FaCheck,
  FaTimes,
  FaStar,
  FaDownload,
  FaShareAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaWhatsapp,
  FaEnvelope,
  FaShieldAlt,
  FaMedkit,
  FaUserFriends,
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
  FaPlay
} from "react-icons/fa";
import { Trek, Testimonial, Faq } from "@/types";
import { renderLexical } from "@/lib/lexical-renderer";
import { getMediaUrl } from "@/lib/cloudinary-loader";
import EnquiryModal from "./EnquiryModal";

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

// ----------------------------------------------------
// FALLBACK DATA FOR PREMIUM SPECIFICATIONS
// ----------------------------------------------------
const EBC_FALLBACK = {
  highlights: [
    "Stand at the base of Mt. Everest (5,364m / 17,598ft)",
    "Dramatic flight to Lukla's Tenzing-Hillary Airport",
    "Two acclimatization days in Namche Bazaar & Dingboche",
    "Jaw-dropping sunrise panoramas from Kala Patthar (5,545m / 18,192ft)",
    "Explore historic Tengboche Monastery surrounded by Ama Dablam",
    "Hike along the Khumbu Glacier moraine",
    "Trek through Sagarmatha National Park (UNESCO World Heritage)",
    "Cross high suspension bridges draped in prayer flags",
    "Immersive Sherpa cultural experiences and home-cooked meals",
    "Spectacular views of Lhotse, Nuptse, Makalu, and Cho Oyu",
    "Professional local Sherpa guides and porter team support",
    "Certified carbon-neutral booking options",
    "Lifetime memories of the world's most iconic trekking route"
  ],
  dayByDayItinerary: [
    {
      day: 1,
      title: "Arrival in Kathmandu (1,400m / 4,593ft)",
      description: "Upon arrival at Tribhuvan International Airport, you will be met by our representative and transferred to your hotel. In the evening, we host a welcome dinner featuring traditional Nepalese cuisine and a trek briefing.",
      accommodation: "3-Star Hotel",
      meals: "Welcome Dinner",
      distance: "N/A",
      altitude: 1400
    },
    {
      day: 2,
      title: "Fly to Lukla (2,860m) and Trek to Phakding (2,650m)",
      description: "An early morning scenic flight brings us to Lukla's famous Tenzing-Hillary Airport. After assembling our team, we begin trekking along the Dudh Koshi river, passing small villages and prayer wheels, until we arrive in Phakding.",
      accommodation: "Standard Teahouse",
      meals: "B, L, D",
      distance: "8.2 km (5.1 miles)",
      altitude: 2650
    },
    {
      day: 3,
      title: "Trek from Phakding to Namche Bazaar (3,440m / 11,286ft)",
      description: "We follow the river bank and enter the Sagarmatha National Park at Monjo. After crossing the high Hillary Suspension Bridge, we embark on a steep, challenging climb up Namche Hill, where we catch our first view of Mt. Everest.",
      accommodation: "Standard Teahouse",
      meals: "B, L, D",
      distance: "10.5 km (6.5 miles)",
      altitude: 3440
    },
    {
      day: 4,
      title: "Rest and Acclimatization at Namche Bazaar (3,440m)",
      description: "Acclimatization day. We take a scenic morning hike to the Everest View Hotel (3,880m) for panoramic views of Everest, Lhotse, and Ama Dablam. Afternoon is free to explore the shops, bakeries, and museums in Namche Bazaar.",
      accommodation: "Standard Teahouse",
      meals: "B, L, D",
      distance: "5.0 km (3.1 miles)",
      altitude: 3440
    },
    {
      day: 5,
      title: "Trek from Namche Bazaar to Tengboche (3,860m / 12,664ft)",
      description: "The trail follows a relatively flat ridge before descending to the river at Phunki Tenga. After lunch, we ascend steeply through rhododendron forests to Tengboche, home to the famous and sacred Tengboche Monastery.",
      accommodation: "Standard Teahouse",
      meals: "B, L, D",
      distance: "9.6 km (6.0 miles)",
      altitude: 3860
    },
    {
      day: 6,
      title: "Trek from Tengboche to Dingboche (4,410m / 14,468ft)",
      description: "We descend through forests to Deboche, cross the Imja Khola, and pass the ancient mani wall. The trail rises gradually towards Pangboche, and then advances through pasturelands up to the summer valley of Dingboche.",
      accommodation: "Standard Teahouse",
      meals: "B, L, D",
      distance: "9.0 km (5.6 miles)",
      altitude: 4410
    },
    {
      day: 7,
      title: "Rest and Acclimatization at Dingboche (4,410m)",
      description: "Our second acclimatization day. We hike up Nangkartshang Peak (5,083m) for breathtaking views of Makalu, Lhotse, and the spectacular north face of Ama Dablam. Returning to Dingboche, we rest for the high altitude ahead.",
      accommodation: "Standard Teahouse",
      meals: "B, L, D",
      distance: "4.5 km (2.8 miles)",
      altitude: 4410
    },
    {
      day: 8,
      title: "Trek from Dingboche to Lobuche (4,940m / 16,207ft)",
      description: "We climb gently to Thukla and then climb the steep moraine of the Khumbu Glacier, passing the moving stone memorials for climbers who lost their lives on Everest. The trail then levels off towards Lobuche.",
      accommodation: "Standard Teahouse",
      meals: "B, L, D",
      distance: "11.0 km (6.8 miles)",
      altitude: 4940
    },
    {
      day: 9,
      title: "Trek to Gorak Shep (5,164m) and Everest Base Camp (5,364m)",
      description: "Trekking along the rough moraine of the Khumbu Glacier leads us to Gorak Shep. After a quick lunch, we push onward to Everest Base Camp. Stand in awe on the active glacier, take photos, and return to Gorak Shep for the night.",
      accommodation: "Standard Teahouse",
      meals: "B, L, D",
      distance: "15.0 km (9.3 miles)",
      altitude: 5164
    },
    {
      day: 10,
      title: "Hike to Kala Patthar (5,545m) and Trek to Pheriche (4,240m)",
      description: "We wake up before dawn and climb the steep trail to Kala Patthar (5,545m), the highest point of our trek, for a golden sunrise over Everest and surrounding peaks. We descend to Gorak Shep, eat breakfast, and trek down to Pheriche.",
      accommodation: "Standard Teahouse",
      meals: "B, L, D",
      distance: "15.0 km (9.3 miles)",
      altitude: 4240
    },
    {
      day: 11,
      title: "Trek from Pheriche to Namche Bazaar (3,440m / 11,286ft)",
      description: "We trace our path down the valley, crossing the Imja Khola, passing through Tengboche, and climbing down the hill to the river. We then ascend back along the ridge to Namche Bazaar for a hot shower and celebratory drinks.",
      accommodation: "Standard Teahouse",
      meals: "B, L, D",
      distance: "14.3 km (8.9 miles)",
      altitude: 3440
    },
    {
      day: 12,
      title: "Trek from Namche Bazaar to Lukla (2,850m / 9,350ft)",
      description: "On our final trekking day, we descend Namche Hill and cross the Hillary suspension bridges once more. The trail follows the Dudh Koshi river back to Lukla, where we celebrate our successful journey with our guides and porters.",
      accommodation: "Standard Teahouse",
      meals: "B, L, D",
      distance: "18.6 km (11.5 miles)",
      altitude: 2850
    },
    {
      day: 13,
      title: "Fly from Lukla to Kathmandu",
      description: "We take an early morning scenic flight back to Kathmandu (or Manthali). Upon arrival, transfer to your hotel. You have the rest of the day free for shopping, relaxation, or visiting historic temples.",
      accommodation: "3-Star Hotel",
      meals: "Breakfast, Farewell Dinner",
      distance: "35 mins flight",
      altitude: 1400
    },
    {
      day: 14,
      title: "Final Departure from Kathmandu",
      description: "After breakfast, your room check-out is complete. A representative will transfer you to Tribhuvan International Airport for your international flight home, marking the end of your memorable Himalayan adventure.",
      accommodation: "N/A",
      meals: "Breakfast",
      distance: "N/A",
      altitude: 1400
    }
  ],
  inclusions: [
    "All airport transfers by private vehicle",
    "Round-trip domestic flights (Kathmandu - Lukla - Kathmandu) including airport tax",
    "Twin-sharing accommodation in 3-star hotels in Kathmandu (3 nights)",
    "Twin-sharing accommodation in local teahouses during the trek (10 nights)",
    "Three meals a day (Breakfast, Lunch, Dinner) during the trek",
    "Welcome and farewell dinners in Kathmandu",
    "Government-licensed, English-speaking Sherpa trekking guide",
    "Experienced porters (1 porter for every 2 clients, carrying up to 20kg total)",
    "Sagarmatha National Park entry permit and Khumbu Pasang Lhamu municipality fee",
    "First aid kit carried by the guide, including pulse oximeter",
    "All government taxes, office service charges, and VAT",
    "Down jacket and sleeping bag rental (if required, returned after trek)",
    "Nature Heaven Treks duffel bag and completion certificate"
  ],
  exclusions: [
    "International airfare and airport departure taxes",
    "Nepal entry visa fee ($50 USD for 30 days, obtainable on arrival)",
    "Travel and medical insurance (must cover high-altitude rescue up to 6,000m)",
    "Lunch and dinner in Kathmandu (except welcome/farewell dinners)",
    "Personal expenses (wifi, hot showers, battery charging, laundry, snacks, drinks)",
    "Personal equipment (boots, hiking poles, daypack, sunglasses)",
    "Tipping for guide and porter team (recommended 10-15% of trek cost)",
    "Any expenses incurred due to flight delays, weather cancellations, or political strikes"
  ],
  tripInfo: [
    {
      title: "Accommodations",
      content: "During the trek, you will stay in clean, local family-run teahouses. Rooms are twin-sharing with common bathrooms. In Kathmandu, we provide 3 nights in a 3-star boutique hotel with private facilities."
    },
    {
      title: "Meals (B/L/D)",
      content: "We provide 3 nutritious meals daily on trek. Breakfast includes porridge, eggs, potatoes, or pancakes. Lunch and dinner feature traditional Nepalese Dal Bhat (lentils, rice, curry), pasta, momo, soups, and teas."
    },
    {
      title: "Water & Hydration",
      content: "Staying hydrated is key to preventing altitude sickness. We recommend drinking 3-4 liters of water daily. Bring water bottles or a hydration bladder, and use water purification tablets or drops."
    },
    {
      title: "Luggage Limits",
      content: "The domestic flight from Kathmandu/Manthali to Lukla restricts luggage weight to 15kg (33 lbs) total per person, which includes 10kg for your duffel bag (carried by porters) and 5kg for your daypack."
    },
    {
      title: "Lukla Flight & Contingency",
      content: "Flights to/from Lukla are weather-dependent. Delays are common. During peak seasons (Oct/Nov/Mar/Apr), flights may operate from Manthali Airport (Ramechhap), which is a 4-hour drive from Kathmandu."
    },
    {
      title: "Travel Insurance",
      content: "Accident and medical travel insurance is mandatory. It must specifically cover high-altitude hiking up to 6,000m and emergency helicopter search and evacuation in the Himalayas."
    },
    {
      title: "Passport & Visa Info",
      content: "Your passport must be valid for at least 6 months beyond your travel dates. You can obtain a Nepal Visa on arrival at Kathmandu Airport ($30 USD for 15 days, $50 for 30 days)."
    },
    {
      title: "Altitude Sickness (AMS) Safety",
      content: "Our guides are trained to identify and manage Acute Mountain Sickness (AMS). We trek slowly, climb high/sleep low, and carry pulse oximeters. Diamox is recommended as a preventative measure."
    },
    {
      title: "Helicopter Evacuation",
      content: "In case of severe altitude sickness or serious injury, our guides will coordinate an immediate helicopter rescue. This service is billed to your travel insurance provider directly."
    },
    {
      title: "Guide and Porter Team",
      content: "You will be led by a certified, local Sherpa guide who speaks fluent English and has years of climbing experience. Porters are recruited locally, insured, and carry up to 20kg (10kg per client)."
    },
    {
      title: "Typical Day on Trek",
      content: "Wake up around 6:30 AM, pack your duffel, eat breakfast at 7:30 AM, and begin hiking by 8:00 AM. Hike 3-4 hours to our lunch spot. Walk another 2-3 hours to our night's lodging. Enjoy dinner at 6:30 PM."
    },
    {
      title: "Extra Personal Expenses",
      content: "Expect to spend $15-$25 per day on trek for extra comfort items: Wi-Fi ($3-5), device charging ($2-5), hot showers ($3-5), bottle water, beer, chocolate bars, and tipping guides ($150-$200 total)."
    },
    {
      title: "Ecotourism & Sustainability",
      content: "We practice responsible tourism. We discourage single-use plastic water bottles, use eco-friendly teahouses, pay fair wages to porters, and ensure we pack out all waste to protect the fragile environment."
    },
    {
      title: "Electricity & Wifi",
      content: "Teahouses offer solar/hydro electricity to charge devices for a small fee ($2-5 per device). Wi-Fi is available in Namche and Lukla (and via prepaid Air Nepal cards in high altitude teahouses)."
    },
    {
      title: "Hot Showers",
      content: "Solar or gas showers are available at low altitudes for $3-5. Above Namche Bazaar, hot water is scarce and expensive, and temperatures are freezing. Most trekkers use wet wipes for personal hygiene."
    },
    {
      title: "Tipping Guidelines",
      content: "Tipping is custom in Nepal to reward excellent service. We recommend a tip pool of $150-$200 USD per client, which will be distributed to your guide and porter team on the last day of the trek."
    },
    {
      title: "Card Payments & ATMs",
      content: "ATMs are only available in Kathmandu and Namche Bazaar. Credit cards are accepted in Thamel hotels and Namche bakeries (subject to 3-4% fee). Carry enough cash in Nepalese Rupees for the trek."
    }
  ],
  packingChecklist: [
    {
      category: "Headwear",
      items: [
        "Sun Hat / Cap (SPF protection recommended)",
        "Warm Fleece Beanie or insulated wool hat",
        "Neck Gaiter / Buff (essential for dry wind and dust)",
        "LED Headlamp (with spare batteries for sunrise hikes)"
      ]
    },
    {
      category: "Body Wear (Layers)",
      items: [
        "Thermal Underwear / Base layers (moisture-wicking, 2 pairs)",
        "Trekking Shirts (synthetic, quick-dry, short & long sleeve, 3-4 pairs)",
        "Fleece Jacket or warm mid-layer top",
        "Heavy Down Jacket (warm, rated to -10°C / -15°C, provided if needed)",
        "Waterproof/Windproof Shell Jacket (breathable)",
        "Convertible Hiking Pants (comfortable, quick-dry, 2 pairs)"
      ]
    },
    {
      category: "Handwear & Footwear",
      items: [
        "Lightweight Inner Gloves (fleece)",
        "Waterproof/Windproof Outer Gloves or mittens",
        "Hiking Boots (sturdy, waterproof, ankle-support, broken-in)",
        "Camp Shoes / Sandals (for evenings in the teahouse)",
        "Trekking Socks (merino wool, moisture-wicking, 4 pairs)",
        "Thick Thermal Socks (for sleeping/summit morning)"
      ]
    },
    {
      category: "Personal Gear",
      items: [
        "Sleeping Bag (rated to -15°C / 0°F, provided if needed)",
        "Daypack (30-40L with waist straps and rain cover)",
        "Duffel Bag (80-90L, provided by Summit Trail for porters)",
        "Trekking Poles (adjustable, shock-absorbing)",
        "UV Protection Sunglasses (essential for snow glare)",
        "Water Bottles (insulated metal, 1L capacity, 2 bottles)"
      ]
    },
    {
      category: "Toiletries & Meds",
      items: [
        "Quick-dry Towel (microfiber)",
        "Sunscreen (SPF 50+) and Lip Balm with sunblock",
        "Wet Wipes (large packs for hygiene when no showers are available)",
        "Hand Sanitizer (biodegradable)",
        "First-Aid Kit (diamox, ibuprofen, blister tape, rehydration salts)",
        "Water Purification Tablets or UV sterilizer (SteriPEN)"
      ]
    }
  ]
};

const FAQ_CATEGORIES = {
  general: { label: "General Info", icon: "ℹ️" },
  prep_fitness: { label: "Prep & Fitness", icon: "💪" },
  permits: { label: "Permits", icon: "🎫" },
  insurance_visa: { label: "Insurance & Visa", icon: "📋" },
  guides_staff: { label: "Guides & Staff", icon: "👥" },
  accommodation_facilities: { label: "Lodging & Facilities", icon: "🏨" },
  food_drinks: { label: "Food & Drinks", icon: "🍽️" },
  weather_seasons: { label: "Weather & Seasons", icon: "☀️" },
  health_safety: { label: "Health & Safety", icon: "🏥" },
  packing_gear: { label: "Packing & Gear", icon: "🎒" },
  booking_payments: { label: "Booking & Payments", icon: "💳" },
  transportation_flights: { label: "Transport & Flights", icon: "✈️" }
};

const DEFAULT_FAQS = [
  {
    id: "df1",
    question: "What is the best time of year to trek to Everest Base Camp?",
    answer: "The absolute best seasons are Spring (March to May) and Autumn (September to November). During these months, skies are typically clear, providing magnificent mountain vistas, and weather on the trail is relatively stable.",
    category: "weather_seasons"
  },
  {
    id: "df2",
    question: "How difficult is the Everest Base Camp Trek?",
    answer: "It is rated as hard/moderate. While it requires no technical climbing skills, you will walk 5 to 7 hours daily on rugged uphill and downhill trails. Physical conditioning, regular cardio exercises, and stair climbing preparations are highly recommended.",
    category: "prep_fitness"
  },
  {
    id: "df3",
    question: "Is altitude sickness common, and how do you manage it?",
    answer: "Altitude sickness (AMS) is a potential risk above 3,000 meters. Our 14-day itinerary includes two dedicated acclimatization rest days to help your body adapt. Guides monitor blood oxygen levels daily and carry emergency medication.",
    category: "health_safety"
  },
  {
    id: "df4",
    question: "What training or physical fitness do I need?",
    answer: "You need a good level of cardiovascular fitness. Try doing regular aerobic workouts like hiking, running, swimming, or cycling 3-4 times a week starting at least two months before your departure date.",
    category: "prep_fitness"
  }
];

export default function TrekDetailClient({ trek, similarTreks, testimonials, faqs = [] }: TrekDetailClientProps) {
  const router = useRouter();
  const isEBC = trek.slug === "everest-base-camp-trek" || trek.slug === "everest-base-camp-trek-14" || trek.slug === "everest-base-camp-trek-12" || trek.slug?.startsWith("everest-base-camp-");

  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/site-settings");
        const data = await res.json();
        setSiteSettings(data);
      } catch (err) {
        console.error("Failed to fetch site settings in TrekDetailClient:", err);
      }
    }
    fetchSettings();
  }, []);

  // Data selection fallbacks
  const dayByDayItinerary = isEBC && (!trek.dayByDayItinerary || trek.dayByDayItinerary.length <= 2)
    ? EBC_FALLBACK.dayByDayItinerary
    : (trek.dayByDayItinerary || []);

  const highlightsList = isEBC && (!trek.highlights || trek.highlights.length <= 2)
    ? EBC_FALLBACK.highlights
    : (trek.highlights?.map((h: any) => typeof h === "string" ? h : h?.highlight).filter(Boolean) || []);

  const inclusionsList = isEBC && (!trek.inclusions || trek.inclusions.length <= 2)
    ? EBC_FALLBACK.inclusions
    : (trek.inclusions?.map((i: any) => typeof i === "string" ? i : i?.inclusion).filter(Boolean) || []);

  const exclusionsList = isEBC && (!trek.exclusions || trek.exclusions.length <= 2)
    ? EBC_FALLBACK.exclusions
    : (trek.exclusions?.map((e: any) => typeof e === "string" ? e : e?.exclusion).filter(Boolean) || []);

  const tripInfoList = EBC_FALLBACK.tripInfo;
  const packingChecklist = EBC_FALLBACK.packingChecklist;

  const computedGallery = (trek.gallery?.map((g: any) => {
    const rawImage = typeof g === "string" ? g : g?.image;
    return getMediaUrl(rawImage);
  }).filter(Boolean) || []) as string[];

  const galleryList = computedGallery.length > 0 ? computedGallery : [
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
    "https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?q=80&w=800",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800"
  ];

  // Dynamic Group Discount Tiers
  const groupDiscounts = trek.groupDiscounts && trek.groupDiscounts.length > 0
    ? trek.groupDiscounts
    : [
        { minPersons: 1, maxPersons: 1, pricePerPerson: trek.discountedPrice || trek.price },
        { minPersons: 2, maxPersons: 3, pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.96) },
        { minPersons: 4, maxPersons: 7, pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.92) },
        { minPersons: 8, maxPersons: 13, pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.88) },
        { minPersons: 14, maxPersons: 25, pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.84) },
      ];

  // ----------------------------------------------------
  // INTERACTIVE STATES
  // ----------------------------------------------------
  const [activeSection, setActiveSection] = useState("overview");

  // Hero photo gallery lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Mobile carousel index
  const [carouselIndex, setCarouselIndex] = useState(0);
  const touchStartX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setCarouselIndex((p) => (p + 1) % heroImages.length);
      else setCarouselIndex((p) => (p - 1 + heroImages.length) % heroImages.length);
    }
  };

  // Scrollspy effect to highlight active section in sub-nav on scroll
  useEffect(() => {
    let isScrolling = false;
    const handleScroll = () => {
      if (isScrolling) return;
      isScrolling = true;
      requestAnimationFrame(() => {
        const sections = ["overview", "dates", "video", "itinerary", "includes", "map", "packing", "info", "reviews", "faqs"];
        const scrollPosition = window.scrollY + 140; // offset threshold for sticky header

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
        isScrolling = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [startDate, setStartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [dateStatus, setDateStatus] = useState<"none" | "guaranteed" | "limited" | "soldout">("none");
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [guests, setGuests] = useState(2);
  
  // Itinerary & Info accordions
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({ 1: true });
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});
  const [openInfo, setOpenInfo] = useState<Record<string, boolean>>({ Accommodations: true });
  
  // Reviews Tab
  const [activeReviewTab, setActiveReviewTab] = useState<"tripadvisor" | "google" | "facebook">("tripadvisor");
  const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({});
  const [showShare, setShowShare] = useState(false);

  // FAQ Console State
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>("all");
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});

  // Live Departures Database State
  const [departures, setDepartures] = useState<any[]>([]);
  const [loadingDepartures, setLoadingDepartures] = useState(true);
  const [selectedDeparture, setSelectedDeparture] = useState<any | null>(null);

  // Calendar month state
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => new Date());

  const findDepartureForDate = (date: Date) => {
    if (!departures || departures.length === 0) return null;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    
    return departures.find((dep: any) => {
      const depDate = new Date(dep.startDate);
      const depY = depDate.getFullYear();
      const depM = String(depDate.getMonth() + 1).padStart(2, '0');
      const depD = String(depDate.getDate()).padStart(2, '0');
      const depStr = `${depY}-${depM}-${depD}`;
      return dateStr === depStr;
    });
  };

  const selectDepartureFromCalendar = (dep: any) => {
    setSelectedDeparture(dep);
    setStartDate(dep.startDate);
    setReturnDate(dep.endDate);
    if (dep.status === 'sold_out') setDateStatus("soldout");
    else if (dep.status === 'limited') setDateStatus("limited");
    else if (dep.isGuaranteed) setDateStatus("guaranteed");
    else setDateStatus("none");
  };

  const startYear = new Date().getFullYear();
  const years = [startYear, startYear + 1, startYear + 2];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Fetch Live departures from database API
  useEffect(() => {
    async function fetchDepartures() {
      try {
        const res = await fetch(`/api/departures?slug=${trek.slug}`);
        if (res.ok) {
          const data = await res.json();
          setDepartures(data.departures || []);
        }
      } catch (err) {
        console.error("Error fetching departures:", err);
      } finally {
        setLoadingDepartures(false);
      }
    }
    fetchDepartures();
  }, [trek.slug]);

  // Pricing calculations
  const getUnitPriceForGuests = (paxCount: number) => {
    const tier = groupDiscounts.find(d => paxCount >= d.minPersons && paxCount <= d.maxPersons);
    return tier ? tier.pricePerPerson : (trek.discountedPrice || trek.price);
  };

  const paxPrice = getUnitPriceForGuests(guests);
  const totalCost = paxPrice * guests;
  const originalPricePP = trek.price || Math.round(paxPrice * 1.15);
  const totalDiscount = (originalPricePP - paxPrice) * guests;

  // Auto-calculate return date when custom departure date changes
  useEffect(() => {
    if (selectedDeparture) {
      setStartDate(selectedDeparture.startDate);
      setReturnDate(selectedDeparture.endDate);
      if (selectedDeparture.status === 'sold_out') setDateStatus("soldout");
      else if (selectedDeparture.status === 'limited') setDateStatus("limited");
      else if (selectedDeparture.isGuaranteed) setDateStatus("guaranteed");
      else setDateStatus("none");
      return;
    }

    if (!startDate) {
      setReturnDate("");
      setDateStatus("none");
      return;
    }

    const dep = new Date(startDate);
    const ret = new Date(dep);
    ret.setDate(dep.getDate() + (trek.duration || 14));
    
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    setReturnDate(ret.toLocaleDateString('en-US', options));

    // Dynamic Urgency/Sold Out states based on custom date modulo
    const day = dep.getDate();
    if (day % 9 === 0) {
      setDateStatus("soldout");
    } else if (day % 4 === 0) {
      setDateStatus("limited");
    } else {
      setDateStatus("guaranteed");
    }
  }, [startDate, selectedDeparture, trek.duration]);

  const scrollToSection = (sectionKey: string) => {
    setActiveSection(sectionKey);
    const target = document.getElementById(sectionKey);
    if (target) {
      const yOffset = -60; // Offset to account for sticky sub-nav height
      const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const selectDepartureFromGrid = (dep: any) => {
    setSelectedDeparture(dep);
    setStartDate(dep.startDate);
    // Smooth scroll to booking widget sidebar on select
    const target = document.getElementById("booking-card-widget");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Navigates directly to the checkout flow
  const handleProceedToBooking = () => {
    if (!startDate || dateStatus === "soldout") {
      router.push(`/booking/${trek.slug}?guests=${guests}`);
      return;
    }
    const depParam = selectedDeparture ? `&departure=${selectedDeparture.id}` : "";
    router.push(
      `/booking/${trek.slug}?guests=${guests}&startDate=${startDate}&endDate=${returnDate}${depParam}`
    );
  };

  // Checkbox helpers
  const toggleChecklistItem = (item: string) => {
    setPackedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const totalChecklistItems = packingChecklist.reduce((acc, cat) => acc + cat.items.length, 0);
  const totalPackedItems = Object.values(packedItems).filter(Boolean).length;
  const packedPercentage = Math.round((totalPackedItems / totalChecklistItems) * 100) || 0;

  // Toggle accordions
  const toggleDay = (dayNum: number) => {
    setOpenDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const expandAllDays = () => {
    const all: Record<number, boolean> = {};
    dayByDayItinerary.forEach((d) => { all[d.day] = true; });
    setOpenDays(all);
  };

  const collapseAllDays = () => {
    setOpenDays({});
  };

  const toggleInfo = (title: string) => {
    setOpenInfo((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Reviews
  const reviewCards = {
    tripadvisor: [
      {
        author: "Mark S.",
        country: "Australia",
        stars: 5,
        title: "Once in a lifetime experience, flawlessly organized!",
        text: "Nature Heaven Trek & Expedition exceeded all our expectations for the EBC trek. Our guide, Kafle, was exceptionally knowledgeable, friendly, and kept a close eye on our oxygen levels every single day. The team was supportive, the food was great, and standing at EBC at sunrise is something I'll never forget. Highly recommend their services."
      },
      {
        author: "Sarah Jenkins",
        country: "United Kingdom",
        stars: 5,
        title: "Incredible Support Team and Safe Trek",
        text: "I was nervous about altitude sickness, but the guide's slow pace and safety protocols made me feel incredibly secure. We were checking our heart rates and blood oxygen levels every night. When one member in our group needed support, the team handled it with outstanding professionalism. Duffy bags and down jackets were also high quality."
      }
    ],
    google: testimonials && testimonials.length > 0
      ? testimonials.map((t) => ({
          author: t.clientName,
          country: t.country || "Traveler",
          stars: t.rating || 5,
          title: "Excellent Experience!",
          text: t.reviewText
        }))
      : [
          {
            author: "David Miller",
            country: "United States",
            stars: 5,
            title: "Professional outfit, fair prices, best guides",
            text: "From my initial inquiry emails to final airport transfer, everything was smooth. Nature Heaven Trekking & Expedition matched the premium standard in every way. Guides are certified and know the Sagarmatha region inside out. Very fair prices compared to western companies, yet the service is premium. Don't hesitate to book!"
          }
        ],
    facebook: [
      {
        author: "Emma Watson",
        country: "Canada",
        stars: 5,
        title: "Highly recommend for solo travelers!",
        text: "I joined a group trek and had an amazing time. Our Sherpa guide made us feel like family. Safe, eco-friendly, carbon-neutral booking, and beautiful trails. I will definitely return to Nepal and trek with them again."
      }
    ]
  };

  const renderCalendarGrid = (mDate: Date) => {
    const year = mDate.getFullYear();
    const month = mDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const blanks = Array(firstDayIndex).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    
    return (
      <div className="flex flex-col gap-2">
        {/* Month Header */}
        <div className="text-center font-serif font-black text-xs text-[#1A1A2E] py-2 bg-slate-50 border border-slate-200/60 rounded-xl uppercase tracking-wider">
          {months[month]} {year}
        </div>
        
        {/* Week Days Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-[9px] uppercase text-[#6B6B6B] border-b border-[#E5E5E5] pb-1.5 mt-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>
        
        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 mt-1.5">
          {blanks.map((_, idx) => (
            <div key={`blank-${idx}`} className="aspect-square"></div>
          ))}
          {days.map((day) => {
            const date = new Date(year, month, day);
            const dep = findDepartureForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();
            
            // Check status
            const isSoldOut = dep?.status === "sold_out";
            const isLimited = dep?.status === "limited";
            const isSelected = selectedDeparture && 
              new Date(selectedDeparture.startDate).toDateString() === date.toDateString();
              
            let cellStyle = "bg-slate-50 text-[#C5C5C5] cursor-default";
            let clickHandler = undefined;
            let displayElement = <span className="font-bold text-[11px]">{day}</span>;
            
            if (dep) {
              if (isSoldOut) {
                cellStyle = "bg-red-50 text-red-300 line-through cursor-not-allowed border border-red-100 flex flex-col items-center justify-center relative";
                displayElement = (
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-black text-[11px] text-red-400">{day}</span>
                    <span className="text-[7px] text-red-500 font-extrabold leading-none mt-0.5">FULL</span>
                  </div>
                );
              } else if (isLimited) {
                cellStyle = `bg-amber-50 text-amber-900 border border-amber-200 hover:border-amber-400 cursor-pointer flex flex-col items-center justify-center relative transition shadow-sm ${
                  isSelected ? "ring-2 ring-offset-1 ring-[#008CCF] bg-amber-100/80 scale-[1.03]" : ""
                }`;
                clickHandler = () => selectDepartureFromCalendar(dep);
                displayElement = (
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-black text-[11px]">{day}</span>
                    <span className="text-[7px] text-amber-700 font-extrabold leading-none mt-0.5">{dep.availableSeats} LFT</span>
                  </div>
                );
              } else {
                // Available
                cellStyle = `bg-emerald-50 text-emerald-950 border border-emerald-200 hover:border-emerald-500 cursor-pointer flex flex-col items-center justify-center relative transition shadow-sm ${
                  isSelected ? "ring-2 ring-offset-1 ring-[#008CCF] bg-emerald-100/80 scale-[1.03]" : ""
                }`;
                clickHandler = () => selectDepartureFromCalendar(dep);
                displayElement = (
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-black text-[11px]">{day}</span>
                    <span className="text-[7px] text-emerald-700 font-extrabold leading-none mt-0.5">GO</span>
                  </div>
                );
              }
            } else {
              // Normal day (disabled / unavailable)
              cellStyle = `bg-white text-slate-400 border border-slate-100/50 flex items-center justify-center aspect-square ${
                isToday ? "border-slate-300 bg-slate-50/50" : ""
              }`;
            }
            
            return (
              <button
                key={`day-${day}`}
                type="button"
                disabled={!dep || isSoldOut}
                onClick={clickHandler}
                className={`aspect-square w-full rounded-xl flex items-center justify-center select-none transition ${cellStyle}`}
              >
                {displayElement}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Build hero gallery: up to 5 images; first is always the cover/hero
  const heroImages = (() => {
    const cover = isEBC
      ? "https://cms.discoveryworldtrekking.com/media/7484/sunrise-on-the-top-of-mount-everest.webp"
      : getMediaUrl(trek.heroImage) || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200";
    const extras = galleryList.filter((g) => g !== cover);
    return [cover, ...extras].slice(0, 5);
  })();

  const extraHeroImages = [
    "https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?q=80&w=800",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800",
    "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?q=80&w=800",
    "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800",
  ];

  // Ensure we always have 5 images
  while (heroImages.length < 5) {
    heroImages.push(extraHeroImages[(heroImages.length - 1) % extraHeroImages.length]);
  }

  // All gallery images for lightbox
  const allLightboxImages = [...heroImages, ...galleryList.filter((g) => !heroImages.includes(g))].map((src) => ({ src }));

  return (
    <div className="bg-[#F8F7F4] text-[#3D3D3D] font-sans antialiased pb-16 lg:pb-0">
      {/* Lightbox overlay */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={allLightboxImages}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
      />

      {/* ----------------------------------------------------
          1. HERO PHOTO GALLERY (Split Grid on Desktop, Carousel on Mobile)
          ---------------------------------------------------- */}
      <section className="relative w-full bg-[#1a2e1f] overflow-hidden">

        {/* ===== DESKTOP: Split Photo Grid (hidden on mobile) ===== */}
        <div className="hidden md:grid md:grid-cols-[60fr_40fr] gap-1 h-[72vh] max-h-[620px]">

          {/* Left: Large Main Cover Photo */}
          <div
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
          >
            <Image
              src={heroImages[0]}
              alt={`${trek.title} - Main Photo`}
              fill
              priority
              className="object-cover object-center transition duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Right: 2x2 Grid of smaller photos */}
          <div className="grid grid-cols-2 grid-rows-2 gap-1">
            {heroImages.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => { setLightboxIndex(idx + 1); setLightboxOpen(true); }}
              >
                <Image
                  src={img}
                  alt={`${trek.title} photo ${idx + 2}`}
                  fill
                  className="object-cover object-center transition duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-300" />
              </div>
            ))}
          </div>

          {/* "View All Photos" floating button */}
          <button
            onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
            className="absolute bottom-5 right-5 z-20 bg-white/95 backdrop-blur-sm hover:bg-white text-[#1a2e1f] font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95 border border-white/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View All Photos ({allLightboxImages.length})
          </button>
        </div>

        {/* ===== MOBILE: Swipe Carousel (visible on mobile only) ===== */}
        <div
          className="relative md:hidden h-[55vw] min-h-[260px] max-h-[400px] overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-500 ${
                idx === carouselIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
            >
              <Image
                src={img}
                alt={`${trek.title} photo ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover object-center"
                unoptimized
              />
            </div>
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none z-20" />

          {/* Dot pagination */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCarouselIndex(idx); }}
                className={`rounded-full transition-all duration-300 ${
                  idx === carouselIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Photo count badge */}
          <button
            onClick={() => { setLightboxIndex(carouselIndex); setLightboxOpen(true); }}
            className="absolute bottom-3 right-3 z-30 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {allLightboxImages.length} Photos
          </button>
        </div>
      </section>

      {/* ----------------------------------------------------
          2. TITLE SECTION
          ---------------------------------------------------- */}
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
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#1a2e1f] text-white font-bold text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full">
                  {trek.region?.name || "Khumbu"} Region
                </span>
                {trek.isBestSeller && (
                  <span className="bg-gradient-to-r from-[#F5A623] to-[#e8950f] text-white font-bold text-[10px] tracking-[0.12em] uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <FaStar className="text-[9px]" /> Best Seller
                  </span>
                )}
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] tracking-[0.12em] uppercase px-3 py-1 rounded-full">
                  {trek.duration} Days
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-[#1a2e1f]">
                {trek.title}
              </h1>
            </div>

            <div className="flex items-center gap-2.5 relative shrink-0">
              <button
                onClick={() => setShowShare(!showShare)}
                className="bg-white hover:bg-slate-50 border border-[#E5E5E5] px-3.5 py-2 rounded-xl text-xs font-bold text-[#1A1A2E] transition flex items-center gap-1.5 shadow-sm hover:shadow"
              >
                <FaShareAlt /> Share
              </button>
              {showShare && (
                <div className="absolute right-0 top-full mt-2 bg-white text-[#1A1A2E] rounded-xl shadow-2xl p-4 flex flex-col gap-2 z-50 min-w-[200px] border border-[#E5E5E5]">
                  <a
                    href={`https://wa.me/?text=Check%20out%20this%20awesome%20Himalayan%20trek:%20${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center gap-2 hover:bg-slate-100 p-2 rounded transition"
                  >
                    <FaWhatsapp className="text-green-500" /> Share on WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                        setShowShare(false);
                      }
                    }}
                    className="text-left text-xs flex items-center gap-2 hover:bg-slate-100 p-2 rounded transition"
                  >
                    <FaEnvelope /> Copy Link
                  </button>
                </div>
              )}
              <a
                href="/packing-list"
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm hover:shadow-md"
              >
                <FaDownload /> PDF Brochure
              </a>
            </div>
          </div>

          {/* Rating strip */}
          <div className="flex flex-wrap items-center gap-4 border-t border-[#F0F0F0] pt-4 mt-1">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-[#F5A623] text-sm" />
              ))}
              <span className="text-[#1A1A2E] text-xs font-bold ml-1.5">5.0</span>
              <span className="text-[#6B6B6B] text-xs font-semibold ml-0.5">(420 Reviews)</span>
            </div>
            <span className="h-4 w-px bg-[#E5E5E5]"></span>
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
              <span className="bg-emerald-700 text-white rounded-full px-2.5 py-0.5 text-[9px] font-bold">TripAdvisor</span>
              <span className="font-semibold">Certificate of Excellence</span>
            </div>
            <span className="h-4 w-px bg-[#E5E5E5]"></span>
            <span className="text-xs text-[#6B6B6B] font-semibold flex items-center gap-1">
              <span className="text-[#2E7D32]" aria-hidden>🏔️</span>
              Max altitude: <strong className="text-[#1A1A2E] ml-1">{trek.maxAltitude?.toLocaleString()}m</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          3. STICKY QUICK NAVIGATION BAR
          ---------------------------------------------------- */}
      <nav className="sticky top-0 bg-[#F1F3F5] border-b border-slate-200 shadow-md z-40 overflow-x-auto scrollbar-none font-sans font-bold text-xs transition-all duration-300">
        <div className="max-w-[1240px] mx-auto flex items-center justify-start h-12">
          {[
            { id: "overview", label: "Overview", icon: <FaRegEye className="text-sm shrink-0" /> },
            { id: "dates", label: "Trip Dates", icon: <FaRegCalendarCheck className="text-sm shrink-0" /> },
            { id: "video", label: "Video", icon: <FaPlay className="text-xs shrink-0" /> },
            { id: "itinerary", label: "Itinerary", icon: <FaListUl className="text-sm shrink-0" /> },
            { id: "includes", label: "Includes", icon: <FaRegCheckCircle className="text-sm shrink-0" /> },
            { id: "map", label: "Map", icon: <FaMap className="text-sm shrink-0" /> },
            { id: "packing", label: "Equipment", icon: <FaHiking className="text-sm shrink-0" /> },
            { id: "info", label: "Trip Info", icon: <FaInfoCircle className="text-sm shrink-0" /> },
            { id: "reviews", label: "Reviews", icon: <FaRegComments className="text-sm shrink-0" /> },
            { id: "faqs", label: "FAQs", icon: <FaQuestionCircle className="text-sm shrink-0" /> },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id as any)}
              className={`h-full flex items-center gap-2 px-5 transition-all duration-200 whitespace-nowrap border-r border-slate-200/80 last:border-r-0 select-none ${
                activeSection === sec.id
                  ? "bg-[#1a2e1f] text-white font-black"
                  : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ----------------------------------------------------
          4. KEY SPECIFICATIONS BAR
          ---------------------------------------------------- */}
      <section className="bg-white border-b border-[#E5E5E5] py-6 shadow-inner relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 text-center">
            {[
              { label: "Destination", value: "Nepal (Everest)", icon: "📍" },
              { label: "Difficulty Grade", value: trek.difficulty.toUpperCase(), icon: "🏔️" },
              { label: "Start / End", value: `${trek.startPoint || "Lukla"} / ${trek.endPoint || "Lukla"}`, icon: "🥾" },
              { label: "Max Altitude", value: `${trek.maxAltitude}m / ${Math.round(trek.maxAltitude * 3.28084)}ft`, icon: "📈" },
              { label: "Best Season", value: "Spring / Autumn", icon: "🌤️" },
              { label: "Accommodations", value: "Teahouses / Hotels", icon: "🏨" },
              { label: "Meals", value: "Breakfast, Lunch, Dinner", icon: "🍛" },
              { label: "Activity", value: "High Altitude Trekking", icon: "🚶" }
            ].map((spec, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-2 border-r border-[#E5E5E5] last:border-0 last:pr-0">
                <span className="text-xl mb-1">{spec.icon}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#6B6B6B] font-bold">{spec.label}</span>
                <span className="text-xs font-black text-[#1A1A2E] mt-0.5">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          5. MAIN TWO-COLUMN CONTENT GRID
          ---------------------------------------------------- */}
      <section id="main-content-grid" className="max-w-[1240px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-8 min-w-0">
            
            {/* Section 1: Overview */}
            <div id="overview" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4 flex items-center gap-2">
                    Trip Overview
                  </h2>
                  <div className="prose max-w-none text-sm md:text-base leading-relaxed text-[#3D3D3D]">
                    {trek.overview ? (
                      renderLexical(trek.overview)
                    ) : (
                      <p>
                        The Everest Base Camp Trek is a legendary journey that follows the footsteps of early mountaineers. Walking through pristine pine forests, crossing high suspension bridges, and experiencing the incredible hospitality of Sherpa villages, you will stand face-to-face with the world’s highest peak.
                      </p>
                    )}
                  </div>

                  {/* Highlights */}
                  {highlightsList.length > 0 && (
                    <div className="bg-[#F8F7F4] border border-[#E5E5E5] rounded-2xl p-6 md:p-8 mt-4">
                      <h3 className="font-serif text-lg md:text-xl font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                        🏆 Trek Highlights
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {highlightsList.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm font-semibold text-[#3D3D3D]">
                            <span className="text-[#2E7D32] text-sm shrink-0">✓</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Section 8: Photo Gallery (integrated at the bottom of Overview tab) */}
                <div id="gallery" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4 flex items-center gap-2">
                    Photo Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryList.map((img: string, idx: number) => (
                      <div key={idx} className="relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden shadow-sm group bg-slate-100">
                        <Image
                          src={img || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200"}
                          alt={`${trek.title} gallery image ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover hover:scale-105 transition duration-300"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>

            {/* Section 2: Trip Dates (Departure Calendar System) */}
            <div id="dates" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
                  <div className="border-b border-[#E5E5E5] pb-4">
                    <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] flex items-center gap-2">
                      🏔️ Upcoming fixed departures
                    </h2>
                    <p className="text-xs text-[#6B6B6B] mt-1 font-semibold">
                      Join a small guaranteed group (average 8–10 people) and share the adventure. Pricing includes premium guides.
                    </p>
                  </div>

                  {loadingDepartures ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <div className="w-10 h-10 border-4 border-t-[#2E7D32] border-[#E5E5E5] rounded-full animate-spin"></div>
                      <span className="text-xs text-[#6B6B6B] font-bold">Scanning departures registry...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {/* Calendar Navigation Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentMonthDate(prev => {
                                const next = new Date(prev);
                                next.setMonth(prev.getMonth() - 1);
                                return next;
                              });
                            }}
                            className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E5] hover:bg-slate-50 hover:border-[#2E7D32] flex items-center justify-center font-bold text-slate-700 transition shadow-sm cursor-pointer select-none"
                          >
                            &lt;
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentMonthDate(prev => {
                                const next = new Date(prev);
                                next.setMonth(prev.getMonth() + 1);
                                return next;
                              });
                            }}
                            className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E5] hover:bg-slate-50 hover:border-[#2E7D32] flex items-center justify-center font-bold text-slate-700 transition shadow-sm cursor-pointer select-none"
                          >
                            &gt;
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Month dropdown */}
                          <select
                            value={currentMonthDate.getMonth()}
                            onChange={(e) => {
                              const m = parseInt(e.target.value);
                              setCurrentMonthDate(prev => {
                                const next = new Date(prev);
                                next.setMonth(m);
                                return next;
                              });
                            }}
                            className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1A1A2E] focus:outline-none focus:border-[#2E7D32] cursor-pointer"
                          >
                            {months.map((name, i) => (
                              <option key={i} value={i}>{name}</option>
                            ))}
                          </select>

                          {/* Year dropdown */}
                          <select
                            value={currentMonthDate.getFullYear()}
                            onChange={(e) => {
                              const y = parseInt(e.target.value);
                              setCurrentMonthDate(prev => {
                                const next = new Date(prev);
                                next.setFullYear(y);
                                return next;
                              });
                            }}
                            className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1A1A2E] focus:outline-none focus:border-[#2E7D32] cursor-pointer"
                          >
                            {years.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Side-by-Side Month Grids */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Calendar Month 1 */}
                        {renderCalendarGrid(currentMonthDate)}

                        {/* Calendar Month 2 */}
                        {(() => {
                          const nextM = new Date(currentMonthDate);
                          nextM.setMonth(currentMonthDate.getMonth() + 1);
                          return renderCalendarGrid(nextM);
                        })()}
                      </div>

                      {/* Legends & Helpers */}
                      <div className="border-t border-[#E5E5E5] pt-4 flex flex-wrap justify-between items-center gap-4 text-[11px]">
                        <div className="flex flex-wrap gap-4 font-semibold text-[#6B6B6B]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[7px] text-emerald-700 font-extrabold font-sans">GO</span>
                            <span>Available Departure</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-[7px] text-amber-700 font-extrabold font-sans">LFT</span>
                            <span>Limited Seats</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-md bg-red-50 border border-red-100 flex items-center justify-center text-[7px] text-red-400 font-extrabold font-sans line-through">FULL</span>
                            <span>Sold Out</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-md bg-white border border-slate-100 flex items-center justify-center text-[8px] text-slate-300 font-black">22</span>
                            <span>No Departures</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsEnquiryModalOpen(true)}
                          className="text-[#008CCF] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          🗺️ Looking for custom private dates? Request Private Trek
                        </button>
                      </div>

                      {/* Selected Booking Checkout Box */}
                      <div className="mt-4 border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-sm transition-all duration-300 bg-[#F8F7F4]">
                        {selectedDeparture ? (
                          <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
                            <div className="flex flex-col gap-1.5">
                              <span className="bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded self-start">
                                Selected Departure Slot
                              </span>
                              <h4 className="font-serif font-black text-base text-[#1A1A2E] leading-tight">
                                {new Date(startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} &mdash; {new Date(returnDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </h4>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B6B6B] font-semibold mt-1">
                                <span className="flex items-center gap-1 text-[#2E7D32]">
                                  ✓ Guaranteed departure
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E5E5E5]"></span>
                                <span>⏱️ {trek.duration} Days</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E5E5E5]"></span>
                                <span className="text-[#1a3c2e] font-black">${selectedDeparture.priceOverride || paxPrice} USD / PP</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 flex-wrap sm:flex-nowrap">
                              {/* Guests stepper inside dates section */}
                              <div className="flex flex-col gap-1 bg-white border border-[#E5E5E5] rounded-xl px-3 py-1.5 shadow-sm">
                                <span className="text-[8px] uppercase tracking-wider text-[#6B6B6B] font-black">Number of Guests</span>
                                <div className="flex items-center gap-2 h-7 w-[100px]">
                                  <button
                                    type="button"
                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                    className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer select-none"
                                  >
                                    -
                                  </button>
                                  <span className="grow text-center text-xs font-black text-[#1A1A2E]">{guests}</span>
                                  <button
                                    type="button"
                                    onClick={() => setGuests(Math.min(30, guests + 1))}
                                    className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer select-none"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={handleProceedToBooking}
                                  className="bg-[#008CCF] hover:bg-[#0070A6] text-white font-black text-xs uppercase px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 tracking-wider cursor-pointer select-none"
                                >
                                  Continue Booking <span className="text-base font-sans font-light leading-none">&rarr;</span>
                                </button>
                                <span className="text-[8.5px] text-[#6B6B6B] text-center font-medium">Advance deposit only ${Math.round(totalCost * 0.1)}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 text-center flex flex-col items-center justify-center gap-3">
                            <span className="text-2xl">📅</span>
                            <div className="flex flex-col gap-1 max-w-[400px]">
                              <h4 className="font-serif font-black text-sm text-[#1A1A2E]">
                                Please Select Your Departure Date
                              </h4>
                              <p className="text-xs text-[#6B6B6B] leading-normal font-semibold">
                                Browse the calendars above and click on any green or amber colored departure slot to view trip summary and proceed with your booking.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

            {/* Experience Video Section */}
            <div id="video" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4 flex items-center gap-2">
                    Himalayan Trek Experience Video
                  </h2>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg group">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${trek.youtubeVideoId || "fAsw_vB3JpI"}?autoplay=0`}
                      title={`${trek.title} Video Experience`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

            {/* Section 3: Detailed Itinerary */}
            <div id="itinerary" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 flex-wrap gap-4">
                    <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] flex items-center gap-2">
                      Detailed Itinerary
                    </h2>
                    <div className="flex items-center gap-3 text-xs font-bold text-[#2E7D32]">
                      <button onClick={expandAllDays} className="hover:underline">Expand All</button>
                      <span className="h-3 w-px bg-[#E5E5E5]"></span>
                      <button onClick={collapseAllDays} className="hover:underline">Collapse All</button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mt-2">
                    {dayByDayItinerary.map((day) => {
                      const isOpen = !!openDays[day.day];

                      return (
                        <div
                          key={day.day}
                          className="border border-[#E5E5E5] rounded-xl overflow-hidden transition-all duration-300 shadow-sm bg-white"
                        >
                          <button
                            onClick={() => toggleDay(day.day)}
                            className="w-full px-5 py-4 bg-white hover:bg-slate-50 flex items-center justify-between text-left focus:outline-none transition group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="bg-[#2E7D32] text-white font-black font-sans text-xs px-2.5 py-1 rounded-md">
                                DAY {day.day}
                              </span>
                              <span className="font-serif font-black text-sm md:text-base text-[#1A1A2E] group-hover:text-[#2E7D32] transition duration-300">
                                {day.title}
                              </span>
                            </div>
                            <span className={`p-1 text-[#2E7D32] transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}>
                              <FaChevronDown />
                            </span>
                          </button>

                          {isOpen && (
                            <div className="px-5 py-5 bg-slate-50/50 border-t border-[#E5E5E5] flex flex-col gap-4 animate-fade-in">
                              <p className="text-xs md:text-sm text-[#3D3D3D] leading-relaxed">
                                {day.description}
                              </p>

                              {/* Day specific images grid */}
                              <div className="grid grid-cols-3 gap-2 mt-2">
                                {[0, 1, 2].map((i) => (
                                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#1A1A2E]/5">
                                    <Image
                                      src={galleryList[(day.day + i) % galleryList.length] || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200"}
                                      alt={`Itinerary Day ${day.day} visual ${i + 1}`}
                                      fill
                                      sizes="30vw"
                                      className="object-cover hover:scale-105 transition duration-300"
                                      unoptimized
                                    />
                                  </div>
                                ))}
                              </div>

                              {/* Stats footer row */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#E5E5E5] text-[11px] text-[#6B6B6B] font-semibold uppercase tracking-wider">
                                {day.altitude && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[#2E7D32]">📈</span>
                                    <span>Alt: <strong className="text-[#1A1A2E]">{day.altitude}m</strong></span>
                                  </div>
                                )}
                                {day.distance && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[#2E7D32]">📍</span>
                                    <span>Dist: <strong className="text-[#1A1A2E]">{day.distance}</strong></span>
                                  </div>
                                )}
                                {day.accommodation && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[#2E7D32]">🏨</span>
                                    <span>Sleep: <strong className="text-[#1A1A2E]">{day.accommodation}</strong></span>
                                  </div>
                                )}
                                {day.meals && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[#2E7D32]">🍛</span>
                                    <span>Meals: <strong className="text-[#1A1A2E]">{day.meals}</strong></span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

            {/* Section 4: Inclusions & Exclusions */}
            <div id="includes" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
                  <div className="bg-white rounded-2xl border border-green-200 p-6 md:p-8 flex flex-col gap-4 shadow-sm">
                    <h3 className="font-serif text-xl font-bold text-green-900 border-b border-green-100 pb-3 flex items-center gap-2">
                      <span className="p-1 rounded-full bg-green-100 text-green-600"><FaCheck className="h-3 w-3" /></span>
                      <span>Included in Cost</span>
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {inclusionsList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-[#3D3D3D]">
                          <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl border border-red-200 p-6 md:p-8 flex flex-col gap-4 shadow-sm">
                    <h3 className="font-serif text-xl font-bold text-red-900 border-b border-red-100 pb-3 flex items-center gap-2">
                      <span className="p-1 rounded-full bg-red-100 text-red-500"><FaTimes className="h-3 w-3" /></span>
                      <span>Excluded from Cost</span>
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {exclusionsList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-[#3D3D3D]">
                          <span className="text-red-500 font-bold shrink-0 mt-0.5">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

            {/* Section 5: Route Map */}
            <div id="map" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4 flex items-center gap-2">
                    Trek Route Map
                  </h2>
                  {isEBC ? (
                    <div className="relative w-full aspect-[3/4] sm:aspect-square md:aspect-[4/3] rounded-xl overflow-hidden border border-[#E5E5E5]">
                      <Image
                        src="https://cms.discoveryworldtrekking.com/media/8120/everest-base-camp-trek-map.webp"
                        alt="Everest Base Camp Trek Route Map"
                        fill
                        className="object-contain bg-slate-50"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full">
                      {trek.gpsCoordinates && trek.gpsCoordinates.length > 0 ? (
                        <TrekMap waypoints={trek.gpsCoordinates} center={trek.region?.mapCenter} />
                      ) : (
                        <div className="h-[300px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                          No coordinates route mapped.
                        </div>
                      )}
                    </div>
                  )}
                </div>

            {/* Section 6: Equipment / Packing Checklist */}
            <div id="packing" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 flex-wrap gap-4">
                    <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E]">
                      Required Equipment List
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
                      <span>Progress: {totalPackedItems}/{totalChecklistItems} packed ({packedPercentage}%)</span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${packedPercentage}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                    {packingChecklist.map((cat, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        <h4 className="font-serif text-base font-bold text-[#1A1A2E] border-b border-[#E5E5E5] pb-1.5">
                          {cat.category}
                        </h4>
                        <div className="flex flex-col gap-2">
                          {cat.items.map((item, itemIdx) => {
                            const isPacked = !!packedItems[item];
                            return (
                              <label
                                key={itemIdx}
                                className={`flex items-start gap-2.5 text-xs cursor-pointer p-1 rounded hover:bg-slate-50 select-none ${
                                  isPacked ? "text-[#6B6B6B] line-through font-medium" : "text-[#3D3D3D] font-semibold"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isPacked}
                                  onChange={() => toggleChecklistItem(item)}
                                  className="mt-0.5 rounded accent-[#2E7D32] cursor-pointer"
                                />
                                <span>{item}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

            {/* Section 7: Important Trip Info */}
            <div id="info" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4">
                    Important Trip Information
                  </h2>

                  <div className="flex flex-col gap-3">
                    {tripInfoList.map((info, idx) => {
                      const isOpen = !!openInfo[info.title];
                      return (
                        <div
                          key={idx}
                          className="border border-[#E5E5E5] rounded-xl overflow-hidden transition-all shadow-sm bg-white"
                        >
                          <button
                            onClick={() => toggleInfo(info.title)}
                            className="w-full px-5 py-3.5 bg-slate-50 hover:bg-[#F8F7F4] flex items-center justify-between text-left focus:outline-none transition font-sans font-bold text-xs md:text-sm text-[#1A1A2E]"
                          >
                            <span>{idx + 1}. {info.title}</span>
                            <span className={`text-[#2E7D32] transition-transform ${isOpen ? "rotate-180" : ""}`}>
                              <FaChevronDown />
                            </span>
                          </button>
                          {isOpen && (
                            <div className="px-5 py-4 bg-white border-t border-[#E5E5E5] text-xs md:text-sm text-[#3D3D3D] leading-relaxed animate-fade-in">
                              {info.content}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

            {/* Section 9: Reviews */}
            <div id="reviews" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
                  <div className="border-b border-[#E5E5E5] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E]">
                      Customer Reviews
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] font-bold">
                      <div className="flex text-[#F5A623] gap-0.5">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                      <span>4.9/5 based on 320 reviews</span>
                    </div>
                  </div>

                  {/* Tab selectors */}
                  <div className="flex border-b border-[#E5E5E5] gap-2 overflow-x-auto scrollbar-none">
                    {[
                      { id: "tripadvisor", label: "TripAdvisor Reviews", rating: "5.0 ★" },
                      { id: "google", label: "Google Reviews", rating: "4.9 ★" },
                      { id: "facebook", label: "Facebook Reviews", rating: "5.0 ★" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveReviewTab(tab.id as any)}
                        className={`px-4 py-2 border-b-2 font-sans font-bold text-xs transition whitespace-nowrap focus:outline-none ${
                          activeReviewTab === tab.id
                            ? "border-[#2E7D32] text-[#2E7D32]"
                            : "border-transparent text-[#6B6B6B] hover:text-[#2E7D32]"
                        }`}
                      >
                        {tab.label} <span className="ml-1 text-[9px] bg-slate-100 rounded px-1">{tab.rating}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active reviews cards */}
                  <div className="flex flex-col gap-5 mt-4">
                    {reviewCards[activeReviewTab].map((rev, idx) => {
                      const isExpanded = !!expandedReviews[idx];
                      const rawText = rev.text;
                      const textLimit = 220;
                      const shouldTruncate = rawText.length > textLimit;
                      const displayStr = shouldTruncate && !isExpanded ? `${rawText.substring(0, textLimit)}...` : rawText;

                      return (
                        <div key={idx} className="bg-slate-50 border border-[#E5E5E5] rounded-xl p-5 md:p-6 flex flex-col gap-2 shadow-sm hover:shadow transition duration-300">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <div className="flex text-[#F5A623] gap-0.5 text-xs">
                              {[...Array(rev.stars)].map((_, i) => (
                                <FaStar key={i} />
                              ))}
                            </div>
                            <span className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-wider">{rev.author} ({rev.country})</span>
                          </div>
                          <h4 className="font-serif font-black text-sm md:text-base text-[#1A1A2E]">{rev.title}</h4>
                          <p className="text-xs md:text-sm text-[#3D3D3D] leading-relaxed">
                            &ldquo;{displayStr}&rdquo;
                          </p>
                          {shouldTruncate && (
                            <button
                              onClick={() => setExpandedReviews((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                              className="text-xs font-bold text-[#2E7D32] self-start hover:underline mt-1 focus:outline-none"
                            >
                              {isExpanded ? "Show Less" : "Read Full Review"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

            {/* FAQs Section — Interactive Console */}
            {(() => {
              // Build the FAQ dataset from CMS or fallback
              const faqData = (faqs && faqs.length > 0)
                ? faqs.map((f: any) => ({
                    id: f.id || f._id || `faq-${Math.random()}`,
                    question: f.question,
                    answer: typeof f.answer === 'string'
                      ? f.answer
                      : (f.answer && f.answer.root && f.answer.root.children
                          ? (() => {
                              const extract = (nodes: any[]): string =>
                                nodes.map(n => n.type === 'text' ? (n.text || '') : (n.children ? extract(n.children) : '')).join(' ');
                              return extract(f.answer.root.children);
                            })()
                          : (Array.isArray(f.answer)
                              ? f.answer.map((b: any) => b?.children?.map((c: any) => c?.text).join('') || '').join(' ')
                              : '')),
                    category: f.category || 'general',
                  }))
                : DEFAULT_FAQS;

              // Count per category
              const categoryCounts: Record<string, number> = {};
              faqData.forEach((f: any) => {
                categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
              });

              // Filter by active category & search
              const filtered = faqData.filter((f: any) => {
                const matchesCat = activeFaqCategory === 'all' || f.category === activeFaqCategory;
                const matchesSearch = !faqSearchQuery || f.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) || f.answer.toLowerCase().includes(faqSearchQuery.toLowerCase());
                return matchesCat && matchesSearch;
              });

              const toggleFaq = (id: string) => {
                setExpandedFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
              };

              const expandAll = () => {
                const expanded: Record<string, boolean> = {};
                filtered.forEach((f: any) => { expanded[f.id] = true; });
                setExpandedFaqs((prev) => ({ ...prev, ...expanded }));
              };

              const collapseAll = () => {
                const collapsed: Record<string, boolean> = {};
                filtered.forEach((f: any) => { collapsed[f.id] = false; });
                setExpandedFaqs((prev) => ({ ...prev, ...collapsed }));
              };

              // Only show category tabs that have FAQs
              const activeCats = Object.keys(FAQ_CATEGORIES).filter((cat) => categoryCounts[cat] && categoryCounts[cat] > 0);

              return (
                <div id="faqs" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
                  <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#E5E5E5] pb-4">
                    <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E]">
                      FAQs For {trek.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <button onClick={expandAll} className="text-[10px] font-bold text-[#2E7D32] hover:underline">
                        Expand All
                      </button>
                      <span className="text-[#E5E5E5]">|</span>
                      <button onClick={collapseAll} className="text-[10px] font-bold text-[#6B6B6B] hover:underline">
                        Collapse All
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* LEFT PANEL: Search + Category Tabs */}
                    <div className="lg:w-[260px] shrink-0 flex flex-col gap-4">
                      {/* Search */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search questions..."
                          value={faqSearchQuery}
                          onChange={(e) => setFaqSearchQuery(e.target.value)}
                          className="w-full bg-[#F8F7F4] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#1A1A2E] focus:outline-none focus:border-[#2E7D32] transition pr-9 placeholder:text-[#999]"
                        />
                        <FaQuestionCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] text-xs" />
                      </div>

                      {/* Category tabs (vertical) */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => setActiveFaqCategory('all')}
                          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                            activeFaqCategory === 'all'
                              ? 'bg-[#2E7D32] text-white shadow-md'
                              : 'bg-[#F8F7F4] text-[#3D3D3D] hover:bg-[#2E7D32]/10'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>📋</span>
                            <span>All Questions</span>
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                            activeFaqCategory === 'all' ? 'bg-white/20 text-white' : 'bg-[#2E7D32]/10 text-[#2E7D32]'
                          }`}>
                            {faqData.length}
                          </span>
                        </button>
                        {activeCats.map((catKey) => {
                          const cat = FAQ_CATEGORIES[catKey as keyof typeof FAQ_CATEGORIES];
                          if (!cat) return null;
                          return (
                            <button
                              key={catKey}
                              onClick={() => setActiveFaqCategory(catKey)}
                              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                                activeFaqCategory === catKey
                                  ? 'bg-[#2E7D32] text-white shadow-md'
                                  : 'bg-[#F8F7F4] text-[#3D3D3D] hover:bg-[#2E7D32]/10'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                activeFaqCategory === catKey ? 'bg-white/20 text-white' : 'bg-[#2E7D32]/10 text-[#2E7D32]'
                              }`}>
                                {categoryCounts[catKey]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* RIGHT PANEL: Accordions */}
                    <div className="flex-1 flex flex-col gap-3">
                      {filtered.length === 0 ? (
                        <div className="text-center py-12 text-[#999] text-sm">
                          <FaQuestionCircle className="mx-auto mb-3 text-3xl text-[#E5E5E5]" />
                          <p className="font-bold">No matching questions found.</p>
                          <p className="text-xs mt-1">Try a different search term or category.</p>
                        </div>
                      ) : (
                        filtered.map((faq: any) => {
                          const isOpen = !!expandedFaqs[faq.id];
                          const catMeta = FAQ_CATEGORIES[faq.category as keyof typeof FAQ_CATEGORIES];
                          return (
                            <div
                              key={faq.id}
                              className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                                isOpen ? 'border-[#2E7D32]/30 bg-[#2E7D32]/[0.02] shadow-sm' : 'border-[#E5E5E5] bg-[#F8F7F4]'
                              }`}
                            >
                              <button
                                onClick={() => toggleFaq(faq.id)}
                                className="w-full flex items-center gap-3 p-4 text-left group"
                              >
                                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                  isOpen ? 'bg-[#2E7D32] text-white rotate-180' : 'bg-[#E5E5E5] text-[#6B6B6B] group-hover:bg-[#2E7D32]/20 group-hover:text-[#2E7D32]'
                                }`}>
                                  <FaChevronDown className="text-[10px]" />
                                </span>
                                <div className="flex-1">
                                  <h4 className={`font-serif font-black text-sm transition-colors ${
                                    isOpen ? 'text-[#2E7D32]' : 'text-[#1A1A2E] group-hover:text-[#2E7D32]'
                                  }`}>
                                    {faq.question}
                                  </h4>
                                  {catMeta && (
                                    <span className="text-[9px] text-[#999] font-bold uppercase tracking-wider mt-0.5 block">
                                      {catMeta.icon} {catMeta.label}
                                    </span>
                                  )}
                                </div>
                              </button>
                              <div
                                className={`overflow-hidden transition-all duration-300 ${
                                  isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                              >
                                <div className="px-4 pb-4 pl-14">
                                  <p className="text-xs md:text-sm text-[#6B6B6B] leading-relaxed border-t border-[#E5E5E5]/40 pt-3">
                                    {faq.answer}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
            </div>

            {/* RIGHT COLUMN (Sticky Booking & Advisor Widgets) */}
            <div className="flex flex-col gap-8 lg:sticky lg:top-[64px] self-start h-fit w-full">
            
            {/* BOOKING CARD WIDGET */}
            <div id="booking-card-widget" className="relative bg-white border border-[#E5E5E5] shadow-lg rounded-2xl p-6 flex flex-col gap-5">
              
              {/* Cost Box */}
              {(() => {
                const basePrice = trek.discountedPrice || trek.price;
                const originalPrice = trek.price || Math.round(basePrice * 1.15);
                const personSavings = originalPrice - basePrice;

                return (
                  <div className="flex flex-col gap-4 relative">
                    {/* Top right yellow/orange discount ribbon */}
                    {personSavings > 0 && (
                      <div className="absolute -top-6 -right-6 bg-[#FF9800] text-white font-extrabold text-[9px] uppercase px-3 py-1 rounded-tr-2xl rounded-bl-2xl shadow-sm z-10 select-none">
                        SAVE ${personSavings} PP
                      </div>
                    )}
                    
                    <div>
                      <span className="text-[10px] text-[#6B6B6B] uppercase tracking-wider font-extrabold block mb-1">
                        Starting Price
                      </span>
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        {originalPrice > basePrice && (
                          <span className="text-sm text-[#6B6B6B] line-through font-semibold">${originalPrice}</span>
                        )}
                        <span className="text-3xl font-black text-[#1a3c2e] font-sans">${basePrice}</span>
                        <span className="text-xs text-[#6B6B6B] font-bold">USD / PP</span>
                      </div>
                    </div>

                    {/* Capsule pill for duration & cost */}
                    <div className="bg-[#1a2e1f]/5 text-[#1a2e1f] font-bold text-xs px-3.5 py-2.5 rounded-xl border border-[#1a2e1f]/10 shadow-inner flex items-center justify-center gap-2">
                      <span>⏱️ {trek.duration} Days</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1a2e1f]/20"></span>
                      <span>From ${basePrice} PP</span>
                    </div>

                    {/* Simplified Group-Size Discounts table */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-extrabold uppercase text-[#6B6B6B] tracking-wider">Group Size Discounts</span>
                      <div className="flex flex-col border border-[#E5E5E5] rounded-xl overflow-hidden text-[10px] bg-slate-50/20 shadow-inner">
                        <div className="grid grid-cols-[1.5fr_1fr] bg-slate-50/80 font-bold border-b border-[#E5E5E5] p-2 text-[#6B6B6B] uppercase tracking-wider">
                          <span>Persons</span>
                          <span className="text-right">Price PP</span>
                        </div>
                        {groupDiscounts.slice(0, 4).map((tier, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-[1.5fr_1fr] p-2 border-b last:border-0 border-[#E5E5E5]/60 font-semibold text-[#3D3D3D]"
                          >
                            <span>
                              {tier.minPersons === tier.maxPersons
                                ? `${tier.minPersons} Person`
                                : `${tier.minPersons}–${tier.maxPersons} Persons`}
                            </span>
                            <span className="text-right font-bold text-[#1a3c2e]">${tier.pricePerPerson}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="flex flex-col gap-2.5 border-t border-[#E5E5E5] pt-4">
                <button
                  type="button"
                  onClick={handleProceedToBooking}
                  className="w-full bg-[#008CCF] hover:bg-[#0070A6] text-white font-bold py-3.5 rounded-xl transition duration-300 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
                >
                  <FaRegCalendarCheck className="text-sm shrink-0" /> Book Now
                </button>

                <button
                  type="button"
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full bg-white hover:bg-[#F8F7F4] text-[#008CCF] border-2 border-[#008CCF] font-bold py-3 rounded-xl transition duration-300 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  Send Enquiry
                </button>

                <a
                  href={`https://wa.me/${(siteSettings?.headerSettings?.expertWhatsApp || "9779851218358").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition duration-300 shadow-sm"
                >
                  <FaWhatsapp className="text-sm shrink-0" /> WhatsApp Us
                </a>
              </div>
            </div>

            {/* EXPERT ADVISOR CARD */}
            <div className="bg-[#1a2e1f] text-white rounded-2xl shadow-md p-6 flex flex-col gap-4 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2E7D32] to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md border-2 border-green-500 shrink-0 select-none">
                  {(siteSettings?.headerSettings?.expertName || "Kafle")[0]}
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
                <a
                  href={`https://wa.me/${(siteSettings?.headerSettings?.expertWhatsApp || "9779851218358").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2.5 rounded-xl text-xs transition duration-300 shadow-sm"
                >
                  <FaWhatsapp /> WhatsApp Specialist
                </a>
                <a
                  href={`mailto:${siteSettings?.headerSettings?.quickEmail || "info@natureheaventrek.com"}`}
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2.5 rounded-xl text-xs transition duration-300"
                >
                  <FaEnvelope /> Email Consultation
                </a>
              </div>
            </div>

            {/* SECURE & TRUST METRICS */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
              <h4 className="font-serif text-sm font-bold text-[#1A1A2E] flex items-center gap-1.5">
                <FaShieldAlt className="text-green-600" /> Secure Booking System
              </h4>
              <p className="text-[10px] md:text-xs text-[#6B6B6B] leading-relaxed">
                Your checkout session is secure and encrypted by 256-bit SSL. Associated with TAAN, KEEP, NMA, and registered with Nepal Tourism Board.
              </p>
              
              {/* Payment Method Badges */}
              <div className="border-t border-[#E5E5E5] pt-3 flex flex-wrap gap-2 items-center justify-center">
                {['Stripe', 'PayPal', 'eSewa', 'Khalti', 'SWIFT'].map((name, i) => (
                  <span key={i} className="text-[9px] bg-slate-100 text-[#6B6B6B] border border-[#E5E5E5] font-extrabold rounded px-2 py-0.5 shadow-sm">
                    {name}
                  </span>
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
                <h4 className="font-serif font-black text-sm text-[#1A1A2E] border-b border-[#E5E5E5] pb-2">
                  Similar Trek Packages
                </h4>
                <div className="flex flex-col gap-3">
                  {similarTreks.slice(0, 2).map((simTrek) => (
                    <Link
                      key={simTrek.id}
                      href={`/trips/${simTrek.slug}`}
                      className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden hover:shadow-md transition duration-300 flex items-center gap-3 p-2.5 group"
                    >
                      <div className="relative h-16 w-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={getMediaUrl(simTrek.heroImage) || "https://cms.discoveryworldtrekking.com/media/7484/sunrise-on-the-top-of-mount-everest.webp"}
                          alt={simTrek.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h5 className="font-sans font-bold text-xs text-[#1A1A2E] truncate group-hover:text-[#2E7D32] transition">
                          {simTrek.title}
                        </h5>
                        <span className="text-[10px] text-[#6B6B6B] mt-0.5">{simTrek.duration} Days</span>
                        <span className="text-xs font-black text-[#1a3c2e] mt-1">${simTrek.discountedPrice || simTrek.price} USD</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          6. FIXED BOTTOM BOOKING BAR FOR MOBILE
          ---------------------------------------------------- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#E5E5E5] px-6 py-3.5 flex items-center justify-between z-40 lg:hidden shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[9px] text-[#6B6B6B] uppercase font-bold">Guests: {guests} Pax</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-[#1a3c2e]">${paxPrice}</span>
            <span className="text-[9px] text-[#6B6B6B] font-semibold">USD / PP</span>
          </div>
        </div>
        
        <button
          onClick={handleProceedToBooking}
          disabled={dateStatus === "soldout"}
          className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300"
        >
          {dateStatus === "soldout" ? "Sold Out" : "Book Trek"}
        </button>
      </div>

      {/* ----------------------------------------------------
          7. FLOATING ENQUIRY MODAL
          ---------------------------------------------------- */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        tripTitle={trek.title}
        defaultPrice={trek.discountedPrice || trek.price}
      />
    </div>
  );
}
