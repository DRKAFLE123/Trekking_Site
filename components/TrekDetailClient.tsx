"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
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
  FaMedkit
} from "react-icons/fa";
import { Trek, Testimonial } from "@/types";
import { renderLexical } from "@/lib/lexical-renderer";
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
}

// ----------------------------------------------------
// FALLBACK DATA FOR EVEREST BASE CAMP REPLICATION
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
    "Summit Trail Trekking duffel bag and completion certificate"
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

const GROUP_PRICE_TIERS = [
  { pax: "1 Pax", price: 1330, note: "Single Traveler" },
  { pax: "2 - 3 Pax", price: 1280, note: "Small Group" },
  { pax: "4 - 7 Pax", price: 1230, note: "Recommended Group" },
  { pax: "8 - 13 Pax", price: 1180, note: "Standard Group" },
  { pax: "14 - 21 Pax", price: 1150, note: "Large Group Discount" }
];

export default function TrekDetailClient({ trek, similarTreks, testimonials }: TrekDetailClientProps) {
  const isEBC = trek.slug === "everest-base-camp-trek";

  // Data selection: Fallback to EBC exact replicas if the fields are empty or EBC slug matches
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

  const galleryList = trek.gallery?.map((g: any) => typeof g === "string" ? g : g?.image).filter(Boolean) || [
    "https://cms.discoveryworldtrekking.com/media/7484/sunrise-on-the-top-of-mount-everest.webp",
    "https://cms.discoveryworldtrekking.com/media/8120/everest-base-camp-trek-map.webp",
    "https://cms.discoveryworldtrekking.com/media/7484/sunrise-on-the-top-of-mount-everest.webp"
  ];

  // ----------------------------------------------------
  // INTERACTIVE STATES
  // ----------------------------------------------------
  const [activeSection, setActiveSection] = useState("overview");
  const [startDate, setStartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [dateStatus, setDateStatus] = useState<"none" | "guaranteed" | "limited" | "soldout">("none");
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  
  // Itinerary accordions
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({ 1: true });
  
  // Packing checklist state
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});
  
  // Trip Info accordions
  const [openInfo, setOpenInfo] = useState<Record<string, boolean>>({ Accommodations: true });
  
  // Reviews Tab Switcher
  const [activeReviewTab, setActiveReviewTab] = useState<"tripadvisor" | "google" | "facebook">("tripadvisor");
  const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({});

  // Share dropdown
  const [showShare, setShowShare] = useState(false);

  // References for sections (for spy scroll)
  const secRefs = {
    overview: useRef<HTMLDivElement>(null),
    itinerary: useRef<HTMLDivElement>(null),
    map: useRef<HTMLDivElement>(null),
    includes: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
  };

  // Group size stepper pricing calculation
  const getUnitPriceForGuests = (guests: number) => {
    if (guests === 1) return 1330;
    if (guests <= 3) return 1280;
    if (guests <= 7) return 1230;
    if (guests <= 13) return 1180;
    return 1150;
  };

  // Auto-calculate return date when departure date changes
  useEffect(() => {
    if (!startDate) {
      setReturnDate("");
      setDateStatus("none");
      return;
    }
    const dep = new Date(startDate);
    const ret = new Date(dep);
    ret.setDate(dep.getDate() + (trek.duration || 14));
    
    // Format return date
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    setReturnDate(ret.toLocaleDateString('en-US', options));

    // Dynamic Urgency/Sold Out states depending on departure date
    const day = dep.getDate();
    if (day % 7 === 0) {
      setDateStatus("soldout");
    } else if (day % 3 === 0) {
      setDateStatus("limited");
    } else {
      setDateStatus("guaranteed");
    }
  }, [startDate, trek.duration]);

  // Scrollspy logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // offset sticky navbar + spy bar
      
      const entries = Object.entries(secRefs);
      for (let i = entries.length - 1; i >= 0; i--) {
        const [key, ref] = entries[i];
        if (ref.current && ref.current.offsetTop <= scrollPosition) {
          setActiveSection(key);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (sectionKey: keyof typeof secRefs) => {
    const target = secRefs[sectionKey].current;
    if (target) {
      const yOffset = -150; // Align nicely below header/navs
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(sectionKey);
    }
  };

  // Toggle itinerary days
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

  // Packing list toggles
  const toggleChecklistItem = (item: string) => {
    setPackedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  // Packing progress calculation
  const totalChecklistItems = packingChecklist.reduce((acc, cat) => acc + cat.items.length, 0);
  const totalPackedItems = Object.values(packedItems).filter(Boolean).length;
  const packedPercentage = Math.round((totalPackedItems / totalChecklistItems) * 100) || 0;

  // Toggle guide details
  const toggleInfo = (title: string) => {
    setOpenInfo((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // TripAdvisor mock reviews
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

  return (
    <div className="bg-[#F8F7F4] text-[#3D3D3D] font-sans antialiased pb-16 lg:pb-0">
      {/* ----------------------------------------------------
          1. HERO HEADER SECTION (50vh, Image Only)
          ---------------------------------------------------- */}
      <section className="relative w-full h-[50vh] bg-[#1A1A2E] overflow-hidden">
        <Image
          src={
            isEBC
              ? "https://cms.discoveryworldtrekking.com/media/7484/sunrise-on-the-top-of-mount-everest.webp"
              : trek.heroImage || "https://cms.discoveryworldtrekking.com/media/7484/sunrise-on-the-top-of-mount-everest.webp"
          }
          alt={trek.title}
          fill
          priority
          className="object-cover object-center"
          unoptimized
        />
      </section>

      {/* ----------------------------------------------------
          2. BREADCRUMBS, BADGES & TITLE SECTION (White bg)
          ---------------------------------------------------- */}
      <section className="bg-white border-b border-[#E5E5E5] py-8">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col gap-4">
          {/* Breadcrumbs */}
          <div className="text-xs text-[#6B6B6B] flex items-center gap-1.5 font-semibold">
            <Link href="/" className="hover:text-[#4FA3E0] transition">Home</Link>
            <span>/</span>
            <Link href="/trips" className="hover:text-[#4FA3E0] transition">Trips</Link>
            <span>/</span>
            <span className="text-[#1A1A2E] font-medium">{trek.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              {/* Region & Top Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#1A6FBF] text-white font-bold text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-md">
                  {trek.region?.name || "Khumbu"} Region
                </span>
                {trek.isBestSeller && (
                  <span className="bg-[#F5A623] text-[#1A1A2E] font-bold text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-md flex items-center gap-1">
                    <FaStar className="text-[9px]" /> Best Seller
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] text-[#1A2E44]">
                {trek.title}
              </h1>
            </div>

            {/* Share & Download PDF Row */}
            <div className="flex items-center gap-3 relative shrink-0">
              <button
                onClick={() => setShowShare(!showShare)}
                className="bg-white hover:bg-slate-50 border border-[#E5E5E5] px-4 py-2 rounded-lg text-xs font-bold text-[#1A1A2E] transition flex items-center gap-1.5 shadow-sm"
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
                href="/why-us#packing"
                className="bg-[#4FA3E0] hover:bg-[#3d92cf] text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <FaDownload /> PDF Brochure
              </a>
            </div>
          </div>

          {/* TripAdvisor / rating row */}
          <div className="flex flex-wrap items-center gap-4 border-t border-[#E5E5E5] pt-4 mt-2">
            <div className="flex items-center gap-1 text-[#F5A623]">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              <span className="text-[#1A1A2E] text-xs font-bold ml-1">5.0 / 5.0 (420 Reviews)</span>
            </div>
            <span className="h-4 w-px bg-[#E5E5E5]"></span>
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
              <span className="bg-emerald-600 text-white rounded px-1.5 py-0.5 text-[9px] font-bold">TripAdvisor</span>
              <span>Certificate of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          3. STICKY SECONDARY NAVIGATION SPY BAR
          ---------------------------------------------------- */}
      <nav className="sticky top-[56px] lg:top-[60px] bg-white border-b border-[#E5E5E5] shadow-sm z-40 overflow-x-auto scrollbar-none font-sans font-bold text-xs">
        <div className="max-w-[1240px] mx-auto px-6 flex items-center justify-start gap-6">
          {[
            { id: "overview", label: "Overview" },
            { id: "itinerary", label: "Itinerary" },
            { id: "map", label: "Map" },
            { id: "includes", label: "Inclusions" },
            { id: "gallery", label: "Gallery" },
            { id: "reviews", label: "Reviews" },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id as any)}
              className={`py-4 px-1 border-b-[3px] transition-all whitespace-nowrap ${
                activeSection === sec.id
                  ? "border-[#4FA3E0] text-[#4FA3E0]"
                  : "border-transparent text-[#6B6B6B] hover:text-[#4FA3E0]"
              }`}
            >
              {sec.label}
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
      <section className="max-w-[1240px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-12 min-w-0">
            
            {/* Section 1: Overview */}
            <div ref={secRefs.overview} className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
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
                        <span className="text-[#4FA3E0] text-sm shrink-0">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Section 2: Detailed Itinerary */}
            <div ref={secRefs.itinerary} className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 flex-wrap gap-4">
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] flex items-center gap-2">
                  Detailed Itinerary
                </h2>
                <div className="flex items-center gap-3 text-xs font-bold text-[#4FA3E0]">
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
                      className="border border-[#E5E5E5] rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleDay(day.day)}
                        className="w-full px-5 py-4 bg-white hover:bg-[#F8F7F4] flex items-center justify-between text-left focus:outline-none transition group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="bg-[#4FA3E0] text-white font-black font-sans text-xs px-2.5 py-1 rounded-md">
                            DAY {day.day}
                          </span>
                          <span className="font-serif font-black text-sm md:text-base text-[#1A1A2E] group-hover:text-[#4FA3E0] transition duration-300">
                            {day.title}
                          </span>
                        </div>
                        <span className={`p-1 text-[#4FA3E0] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}>
                          <FaChevronDown />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 py-5 bg-[#F8F7F4]/40 border-t border-[#E5E5E5] flex flex-col gap-4 animate-fade-in">
                          <p className="text-xs md:text-sm text-[#3D3D3D] leading-relaxed">
                            {day.description}
                          </p>

                          {/* Day specific images grid */}
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {[0, 1, 2].map((i) => (
                              <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#1A1A2E]/5">
                                <Image
                                  src={galleryList[(day.day + i) % galleryList.length]}
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
                                <span className="text-[#4FA3E0]">📈</span>
                                <span>Alt: <strong className="text-[#1A1A2E]">{day.altitude}m</strong></span>
                              </div>
                            )}
                            {day.distance && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[#4FA3E0]">📍</span>
                                <span>Dist: <strong className="text-[#1A1A2E]">{day.distance}</strong></span>
                              </div>
                            )}
                            {day.accommodation && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[#4FA3E0]">🏨</span>
                                <span>Sleep: <strong className="text-[#1A1A2E]">{day.accommodation}</strong></span>
                              </div>
                            )}
                            {day.meals && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[#4FA3E0]">🍛</span>
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

            {/* Section 3: Route Map */}
            <div ref={secRefs.map} className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
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

            {/* Additional Non-tab Section: Experience Video */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6">
              <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4 flex items-center gap-2">
                Himalayan Trek Experience Video
              </h2>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg group">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/fAsw_vB3JpI?autoplay=0"
                  title="Everest Base Camp Trek Video Experience"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Section 4: Inclusions & Exclusions */}
            <div ref={secRefs.includes} className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
              {/* Inclusions */}
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

              {/* Exclusions */}
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

            {/* Additional Non-tab Section: Packing Checklist */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 flex-wrap gap-4">
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E]">
                  Packing Checklist
                </h2>
                <div className="flex items-center gap-2 text-xs font-bold text-[#4FA3E0]">
                  <span>Progress: {totalPackedItems}/{totalChecklistItems} packed ({packedPercentage}%)</span>
                </div>
              </div>

              {/* Progress bar */}
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
                              className="mt-0.5 rounded accent-[#4FA3E0] cursor-pointer"
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

            {/* Additional Non-tab Section: Important Trip Information */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6">
              <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4">
                Important Trip Information
              </h2>

              <div className="flex flex-col gap-3">
                {tripInfoList.map((info, idx) => {
                  const isOpen = !!openInfo[info.title];
                  return (
                    <div
                      key={idx}
                      className="border border-[#E5E5E5] rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleInfo(info.title)}
                        className="w-full px-5 py-3.5 bg-slate-50 hover:bg-[#F8F7F4] flex items-center justify-between text-left focus:outline-none transition font-sans font-bold text-xs md:text-sm text-[#1A1A2E]"
                      >
                        <span>{idx + 1}. {info.title}</span>
                        <span className={`text-[#4FA3E0] transition-transform ${isOpen ? "rotate-180" : ""}`}>
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

            {/* Section 5: Gallery */}
            <div ref={secRefs.gallery} className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4 flex items-center gap-2">
                Photo Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryList.map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden shadow-sm group bg-slate-100">
                    <Image
                      src={img}
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

            {/* Section 6: Reviews */}
            <div ref={secRefs.reviews} className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6 scroll-mt-24">
              <div className="border-b border-[#E5E5E5] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E]">
                  Customer Reviews
                </h2>

                {/* Stars summary */}
                <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] font-bold">
                  <div className="flex text-[#F5A623] gap-0.5">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span>4.9/5 based on 320 reviews</span>
                </div>
              </div>

              {/* Tab selectors */}
              <div className="flex border-b border-[#E5E5E5] gap-2">
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
                        ? "border-[#4FA3E0] text-[#4FA3E0]"
                        : "border-transparent text-[#6B6B6B] hover:text-[#4FA3E0]"
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
                          className="text-xs font-bold text-[#4FA3E0] self-start hover:underline mt-1 focus:outline-none"
                        >
                          {isExpanded ? "Show Less" : "Read Full Review"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Non-tab Section: FAQs */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6">
              <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4">
                Frequently Asked Questions
              </h2>

              <div className="flex flex-col gap-4">
                {[
                  {
                    q: "What is the best time of year to trek to Everest Base Camp?",
                    a: "The absolute best seasons are Spring (March to May) and Autumn (September to November). During these months, skies are typically clear, providing magnificent mountain vistas, and weather on the trail is relatively stable."
                  },
                  {
                    q: "How difficult is the Everest Base Camp Trek?",
                    a: "It is rated as hard/moderate. While it requires no technical climbing skills, you will walk 5 to 7 hours daily on rugged uphill and downhill trails. Physical conditioning, regular cardio exercises, and stair climbing preparations are highly recommended."
                  },
                  {
                    q: "Is altitude sickness common, and how do you manage it?",
                    a: "Altitude sickness (AMS) is a potential risk above 3,000 meters. Our 14-day itinerary includes two dedicated acclimatization rest days to help your body adapt. Guides monitor blood oxygen levels daily and carry emergency medication."
                  },
                  {
                    q: "What training or physical fitness do I need?",
                    a: "You need a good level of cardiovascular fitness. Try doing regular aerobic workouts like hiking, running, swimming, or cycling 3-4 times a week starting at least two months before your departure date."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-4 bg-[#F8F7F4] border border-[#E5E5E5] rounded-xl">
                    <h4 className="font-serif font-black text-sm md:text-base text-[#1A1A2E]">{faq.q}</h4>
                    <p className="text-xs md:text-sm text-[#6B6B6B] leading-relaxed border-t border-[#E5E5E5]/60 pt-2 mt-1">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Non-tab Section: Plan Departure Date Picker */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-10 shadow-sm flex flex-col gap-6">
              <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1A1A2E] border-b border-[#E5E5E5] pb-4 flex items-center gap-2">
                Plan Your Departure Date
              </h2>
              <p className="text-xs md:text-sm text-[#6B6B6B] leading-relaxed">
                Select your preferred start date below to check availability. All private departures are 100% customizable to your scheduling preferences.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F8F7F4] border border-[#E5E5E5] p-6 rounded-2xl">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#1A1A2E] uppercase flex items-center gap-1.5">
                    <FaCalendarAlt className="text-[#4FA3E0]" /> Start Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4FA3E0] cursor-pointer bg-white"
                  />
                </div>
                
                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-[#E5E5E5] pt-4 md:pt-0 md:pl-6">
                  {returnDate ? (
                    <div className="flex flex-col gap-1.5 animate-fade-in">
                      <span className="text-[10px] uppercase font-bold text-[#6B6B6B]">Computed Return Date</span>
                      <span className="text-base font-black text-[#1A1A2E]">{returnDate} ({trek.duration} Days)</span>
                      
                      {dateStatus === "soldout" && (
                        <span className="text-red-600 text-xs font-black flex items-center gap-1 mt-1">
                          ● Sold Out (Select another date)
                        </span>
                      )}
                      {dateStatus === "limited" && (
                        <span className="text-amber-600 text-xs font-black flex items-center gap-1 mt-1 animate-pulse">
                          ⚠️ Limited Availability! Book soon
                        </span>
                      )}
                      {dateStatus === "guaranteed" && (
                        <span className="text-green-700 text-xs font-black flex items-center gap-1 mt-1">
                          ✓ Guaranteed Departure (Available)
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-[#6B6B6B] italic">
                      Choose a start date to calculate trip return date.
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Sticky Booking & Advisor Widgets) */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-[140px] w-full">
            
            {/* BOOKING WIDGET */}
            <div className="bg-white border border-[#E5E5E5] shadow-md rounded-2xl p-6 flex flex-col gap-6">
              
              {/* Cost Box */}
              <div>
                <span className="text-[10px] text-[#6B6B6B] uppercase tracking-wider font-bold block mb-1">
                  Private departures pricing
                </span>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  {trek.price && trek.discountedPrice && trek.discountedPrice < trek.price && (
                    <span className="text-sm text-[#6B6B6B] line-through font-semibold">${trek.price}</span>
                  )}
                  <span className="text-3xl font-black text-[#1a3c2e] font-sans">${trek.discountedPrice || trek.price}</span>
                  <span className="text-xs text-[#6B6B6B] font-bold">USD / Traveler</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 mt-3 flex items-center gap-1.5 w-fit">
                  <FaCheckCircle className="text-emerald-600 shrink-0" />
                  <span>100% Private Trek</span>
                </div>
              </div>

              {/* Duration/Difficulty Highlights Row */}
              <div className="grid grid-cols-2 gap-3 border-t border-b border-[#E5E5E5] py-4 my-1 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#6B6B6B] font-medium">Duration:</span>
                  <span className="font-bold text-[#1A1A2E]">{trek.duration} Days</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#6B6B6B] font-medium">Difficulty:</span>
                  <span className="font-bold text-[#1A1A2E] uppercase">{trek.difficulty}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#6B6B6B] font-medium">Max Altitude:</span>
                  <span className="font-bold text-[#1A1A2E]">{trek.maxAltitude}m</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#6B6B6B] font-medium">Group Size:</span>
                  <span className="font-bold text-[#1A1A2E]">Private (1-20+)</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full bg-[#4FA3E0] hover:bg-[#3d92cf] text-white font-bold py-3 rounded-xl border border-transparent transition duration-300 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm animate-pulse"
                >
                  Send Enquiry
                </button>

                <a
                  href="https://wa.me/9779851218358"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition duration-300 shadow-sm"
                >
                  <FaWhatsapp className="text-sm" /> WhatsApp Us
                </a>
              </div>
            </div>

            {/* EXPERT ADVISOR PROFILE CARD */}
            <div className="bg-[#1A2E44] text-white rounded-2xl shadow-md p-6 flex flex-col gap-4 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#4FA3E0] to-[#1A6FBF] flex items-center justify-center text-white font-black text-lg shadow-md border-2 border-[#4FA3E0] shrink-0 select-none">
                  K
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#4FA3E0] font-bold">Expert Advisor</span>
                  <h4 className="font-serif font-black text-base text-white">Kafle</h4>
                  <p className="text-[10px] text-white/60 font-semibold">Senior Himalayan Specialist</p>
                </div>
              </div>

              <p className="text-[11px] text-white/80 leading-relaxed border-t border-white/10 pt-3">
                &ldquo;Namaste! I have been guiding in the Himalayas for over 15 years. Contact me directly to customize your itinerary or check live trail conditions.&rdquo;
              </p>

              <div className="flex flex-col gap-2 mt-1">
                <a
                  href="https://wa.me/9779851218358"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-2.5 rounded-xl text-xs transition duration-300"
                >
                  <FaWhatsapp /> WhatsApp Specialist
                </a>
                <a
                  href="mailto:info@natureheaventrek.com"
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2.5 rounded-xl text-xs transition duration-300"
                >
                  <FaEnvelope /> Email Consultation
                </a>
              </div>
            </div>

            {/* SECURE & GUARANTEED INFO CARD */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
              <h4 className="font-serif text-sm font-bold text-[#1A1A2E] flex items-center gap-1.5">
                <FaShieldAlt className="text-green-600" /> Secure & Guaranteed
              </h4>
              <p className="text-[10px] md:text-xs text-[#6B6B6B] leading-relaxed">
                Your booking is secured by Sectigo SSL encryption. We are associated with TAAN, NMA, KEEP, and licensed by the Government of Nepal.
              </p>
              <div className="border-t border-[#E5E5E5] pt-3 flex items-center gap-2">
                <FaMedkit className="text-red-500 text-lg shrink-0" />
                <span className="text-[10px] text-[#3D3D3D] font-bold">Helicopter Rescue & Oxygen cylinders provided on request.</span>
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
                          src={simTrek.heroImage || "https://cms.discoveryworldtrekking.com/media/7484/sunrise-on-the-top-of-mount-everest.webp"}
                          alt={simTrek.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h5 className="font-sans font-bold text-xs text-[#1A1A2E] truncate group-hover:text-[#4FA3E0] transition">
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
          <span className="text-[9px] text-[#6B6B6B] uppercase font-bold">Price from</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-[#1a3c2e]">${trek.discountedPrice || trek.price}</span>
            <span className="text-[9px] text-[#6B6B6B] font-semibold">USD</span>
          </div>
        </div>
        
        <button
          onClick={() => setIsEnquiryModalOpen(true)}
          className="bg-[#4FA3E0] hover:bg-[#3d92cf] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300"
        >
          Send Enquiry
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
