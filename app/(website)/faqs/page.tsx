"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaQuestionCircle, FaChevronDown, FaArrowRight, FaSearch } from "react-icons/fa";

const faqData = [
  {
    category: "Before Your Trek",
    faqs: [
      {
        q: "What is the best time of year to trek in Nepal?",
        a: "The two prime trekking seasons are Spring (March–May) and Autumn (September–November). Both seasons offer stable weather and clear mountain views. Autumn is slightly less crowded post-monsoon with crystal-clear skies. Winter (Dec–Feb) is possible on lower altitude routes but cold and challenging for EBC or Annapurna Circuit. Monsoon season (June–August) is not recommended due to leeches, heavy rain, and landslide risks.",
      },
      {
        q: "How physically fit do I need to be for an EBC Trek?",
        a: "The Everest Base Camp Trek is rated as moderately difficult and requires a good baseline fitness level. You should be comfortable walking 5–7 hours daily on uneven, uphill/downhill terrain for consecutive days. Begin cardio training (hiking, stair climbing, running) at least 2–3 months before departure. No technical climbing skills or equipment are required.",
      },
      {
        q: "Do I need a guide for trekking in Nepal?",
        a: "A licensed guide is mandatory for most restricted areas and national parks (including the Everest and Annapurna regions after 2023 regulations). Even outside restricted zones, a government-licensed Sherpa guide dramatically improves safety, acclimatization monitoring, cultural experience, and logistical support. Nature Heaven provides certified guides for all packages.",
      },
      {
        q: "What permits do I need for the Everest Base Camp Trek?",
        a: "You require two permits: (1) Sagarmatha National Park Entry Permit (~NPR 3,000 / ~$23 USD), and (2) Khumbu Pasang Lhamu Municipality Tourism Fee (~NPR 2,000 / ~$15 USD). Both are obtained at the trek entry checkpoint in Monjo. Nature Heaven includes all permit costs in your package fee.",
      },
      {
        q: "Can I do the trek solo without a guide?",
        a: "As of April 2023, solo trekking without a registered guide in the Everest and Annapurna regions is officially prohibited. All trekkers must be accompanied by a licensed Nepali guide. This regulation was introduced for safety reasons following multiple deaths of solo trekkers.",
      },
    ],
  },
  {
    category: "Health & Safety",
    faqs: [
      {
        q: "What is Acute Mountain Sickness (AMS) and how do you prevent it?",
        a: "AMS is a condition caused by reduced oxygen at high altitudes, typically above 2,500m. Symptoms include headache, nausea, dizziness, and fatigue. Prevention: ascend slowly (follow 'climb high, sleep low'), stay well hydrated, avoid alcohol, and consider Diamox (acetazolamide) as a preventive medication after consulting your doctor. Our guides monitor oxygen saturation levels with pulse oximeters every evening.",
      },
      {
        q: "Is travel insurance mandatory?",
        a: "Yes — comprehensive travel insurance is a mandatory requirement for all Nature Heaven trekking clients. Your policy must explicitly cover high-altitude trekking (up to 6,000m) and emergency helicopter evacuation. Standard holiday insurance does NOT cover this. See our Travel Insurance page for recommended providers.",
      },
      {
        q: "What happens if someone gets serious altitude sickness mid-trek?",
        a: "Our guides are trained in Wilderness First Aid and Himalayan Rescue protocols. If a trekker shows severe AMS symptoms (HACE or HAPE), the guide will immediately descend to a lower altitude, administer emergency oxygen if available, and coordinate a helicopter rescue via satellite communication. Helicopters can reach most evacuation points within 2–4 hours.",
      },
      {
        q: "Is the drinking water safe in Nepal?",
        a: "Do not drink tap water or unfiltered river water. Bottled water is available at teahouses but creates significant plastic waste. We recommend using a SteriPen UV sterilizer, water purification tablets (iodine or chlorine), or a personal filter like a Sawyer Squeeze. Drink at least 3–4 liters per day to prevent altitude sickness.",
      },
    ],
  },
  {
    category: "Costs & Booking",
    faqs: [
      {
        q: "What does the package price include?",
        a: "Our packages include: all airport transfers, domestic Lukla flights, trek permits, accommodation (teahouses + Kathmandu hotel), three meals daily during trek, licensed Sherpa guide, porters (1:2 ratio), government taxes, duffel bag, and completion certificate. International flights, personal expenses, tips, and travel insurance are not included.",
      },
      {
        q: "What is the deposit amount to book?",
        a: "We require a 10% advance deposit to confirm your booking and hold your trekking dates. The remaining balance can be paid upon arrival in Kathmandu before the trek begins, or fully online. We accept Stripe, PayPal, SWIFT bank transfer, and local payments (eSewa, Khalti).",
      },
      {
        q: "Is there a group discount available?",
        a: "Yes! We offer tiered group discounts: 2–3 persons (4% off), 4–7 persons (8% off), 8–13 persons (12% off), and 14+ persons (up to 16% off per person). We recommend groups of 6–12 for the optimal blend of experience, guide attention, and savings.",
      },
      {
        q: "Can I customize the itinerary?",
        a: "Absolutely. We specialize in fully customizable private treks. Want to add a detour to Island Peak, extend your acclimatization, or combine Everest with Gokyo Lakes? Contact our team with your ideas and we will build a bespoke itinerary and cost estimate within 24 hours.",
      },
    ],
  },
  {
    category: "Logistics & On Trail",
    faqs: [
      {
        q: "How do I get from Kathmandu to the trek start point?",
        a: "For Everest treks, you take a 30-minute scenic flight from Kathmandu (or Manthali Airport, 4 hours by road) to Lukla's famous Tenzing-Hillary Airport. All transfers and domestic flights are arranged by us. For Annapurna treks, you drive to Pokhara (~6-7 hours by tourist bus or 25-min flight) and then proceed by jeep to the trailhead.",
      },
      {
        q: "What is the accommodation like on the trail?",
        a: "Teahouses (also called lodges or guesthouses) are the standard accommodation on Himalayan treks. They offer simple, clean twin or dormitory-style rooms, shared or private bathrooms, electric heaters in common areas, and homemade food. Quality decreases at higher altitudes. In Kathmandu, we provide 3-star boutique hotel accommodation.",
      },
      {
        q: "Is there WiFi or cell signal on the trek?",
        a: "WiFi is available in teahouses along most major trekking routes but becomes slower and more expensive at higher altitudes (expect to pay NPR 200–500 per session). NTC (Nepal Telecom) and Ncell SIM cards provide reasonable signal up to around 4,500m. Above that, connectivity is limited to satellite communication. We recommend purchasing a local SIM at Kathmandu airport.",
      },
      {
        q: "What currency should I bring?",
        a: "The Nepalese Rupee (NPR) is the local currency. USD, EUR, and GBP are widely accepted in Kathmandu and can be exchanged at banks, hotels, or money changers. ATMs are available in Kathmandu and Namche Bazaar only — carry sufficient cash before heading to higher altitude. Credit cards are accepted at select hotels in Kathmandu (with 3-4% fee).",
      },
      {
        q: "How much should I tip my guide and porters?",
        a: "Tipping is customary in Nepal and forms a meaningful part of our guide and porter income. For a 14-day EBC trek, we recommend a total tip pool of $150–$200 USD per client, to be divided between your guide (lead share) and porter team. The exact split and ceremony is usually done on the final day in Lukla or Namche.",
      },
    ],
  },
];

export default function FAQsPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  const toggle = (key: string) =>
    setOpen((p) => ({ ...p, [key]: !p[key] }));

  const filtered = faqData.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (f) =>
        !search ||
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.faqs.length > 0);

  const totalFAQs = faqData.reduce((a, c) => a + c.faqs.length, 0);

  return (
    <div className="bg-[#fcfbfa] min-h-screen">
      {/* Hero */}
      <div className="relative w-full bg-[#1a2e1f] py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
            <FaQuestionCircle /> Help Center
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            Frequently Asked Questions
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            {totalFAQs} answers to the most common questions about trekking in Nepal — from permits and
            safety to booking and costs.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-white/40 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#F5A623] transition"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="text-xs text-[#6B6B6B] flex items-center gap-1.5 font-semibold flex-wrap">
          <Link href="/" className="hover:text-[#2E7D32] transition">Home</Link>
          <span className="text-[#D0D0D0]">/</span>
          <Link href="/why-us" className="hover:text-[#2E7D32] transition">Travel Info</Link>
          <span className="text-[#D0D0D0]">/</span>
          <span className="text-[#1A1A2E] font-medium">FAQs</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-10">

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#6B6B6B]">
            <FaQuestionCircle className="text-5xl mx-auto mb-4 opacity-20" />
            <p className="font-semibold">No results found for &ldquo;{search}&rdquo;</p>
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-sm text-[#2E7D32] hover:underline font-bold"
            >
              Clear search
            </button>
          </div>
        )}

        {filtered.map((cat) => (
          <section key={cat.category}>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#1a2e1f] mb-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-[#2E7D32]/30 to-transparent" />
              {cat.category}
              <span className="h-px flex-1 bg-gradient-to-l from-[#2E7D32]/30 to-transparent" />
            </h2>

            <div className="flex flex-col gap-3">
              {cat.faqs.map((faq, i) => {
                const key = `${cat.category}::${i}`;
                const isOpen = !!open[key];
                return (
                  <div
                    key={key}
                    className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                      isOpen ? "border-[#2E7D32]/30 shadow-md" : "border-[#E5E5E5]"
                    }`}
                  >
                    <button
                      onClick={() => toggle(key)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 group focus:outline-none"
                    >
                      <span
                        className={`font-serif font-bold text-sm md:text-base transition ${
                          isOpen ? "text-[#2E7D32]" : "text-[#1A1A2E] group-hover:text-[#2E7D32]"
                        }`}
                      >
                        {faq.q}
                      </span>
                      <span
                        className={`text-[#2E7D32] transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <FaChevronDown />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-[#E5E5E5] pt-4">
                        <p className="text-sm text-[#3D3D3D] leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Still have questions */}
        <div className="bg-[#1a2e1f] text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif font-black text-xl text-white mb-1">
              Still have a question?
            </h3>
            <p className="text-white/60 text-sm">
              Our Himalayan specialists respond within 24 hours, 7 days a week.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contact-us"
              className="flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e8950f] text-[#1a2e1f] font-bold py-3 px-6 rounded-xl text-sm transition"
            >
              Send a Message <FaArrowRight className="text-xs" />
            </Link>
            <a
              href="https://wa.me/9779851218358"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-xl text-sm transition"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/visa-info", label: "Visa Information" },
            { href: "/travel-insurance", label: "Travel Insurance" },
            { href: "/packing-list", label: "Packing List" },
            { href: "/why-us", label: "Why Choose Us" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] border border-[#2E7D32]/30 bg-emerald-50 px-3 py-1.5 rounded-full transition"
            >
              {l.label} <FaArrowRight className="text-[9px]" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
