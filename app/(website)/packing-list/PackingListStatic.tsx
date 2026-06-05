"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaCheck, FaArrowRight, FaShoppingBag } from "react-icons/fa";

// Note: metadata must be in a separate server component when using "use client"
// We use client component here for interactive checklist state

const categories = [
  {
    emoji: "👟",
    name: "Footwear",
    color: "bg-blue-50 border-blue-200",
    headerColor: "text-blue-800",
    items: [
      "Waterproof trekking boots (broken-in before the trek)",
      "Camp sandals or lightweight sneakers for evenings",
      "Merino wool trekking socks (4–5 pairs)",
      "Thick thermal socks for summit mornings",
      "Gaiters (for snow/mud sections above Lobuche)",
    ],
  },
  {
    emoji: "🧥",
    name: "Upper Body Layers",
    color: "bg-green-50 border-green-200",
    headerColor: "text-green-800",
    items: [
      "Moisture-wicking base layer shirts (3 pairs)",
      "Thermal long-sleeve undershirt",
      "Lightweight fleece pullover / mid-layer",
      "Heavy insulated down jacket (rated -10°C / provided on request)",
      "Waterproof windproof shell jacket (breathable, Gore-Tex preferred)",
      "Hiking shirts (quick-dry synthetic, 2–3)",
    ],
  },
  {
    emoji: "🩳",
    name: "Lower Body",
    color: "bg-amber-50 border-amber-200",
    headerColor: "text-amber-800",
    items: [
      "Convertible hiking pants (zip-off legs, 2 pairs)",
      "Thermal leggings / base layer bottoms",
      "Lightweight underwear (merino or synthetic, 3–4)",
    ],
  },
  {
    emoji: "🧤",
    name: "Head & Hands",
    color: "bg-purple-50 border-purple-200",
    headerColor: "text-purple-800",
    items: [
      "Wide-brimmed sun hat / trekking cap (UV protection)",
      "Warm insulated beanie (covers ears)",
      "Balaclava or neck gaiter / Buff",
      "Lightweight fleece inner gloves",
      "Waterproof outer gloves / mittens (for high passes)",
      "Polarized UV sunglasses (Category 3 or 4 lens)",
    ],
  },
  {
    emoji: "🎒",
    name: "Gear & Equipment",
    color: "bg-rose-50 border-rose-200",
    headerColor: "text-rose-800",
    items: [
      "Daypack 30–40L (with rain cover and waist straps)",
      "Duffel bag 80–90L for porters (provided by Nature Heaven)",
      "Trekking poles (adjustable, shock-absorbing — highly recommended)",
      "Sleeping bag rated -15°C (provided on request)",
      "Headlamp with spare batteries (essential for pre-dawn Kala Patthar hike)",
      "Insulated water bottles (1L x2, or a hydration bladder)",
      "Water purification tablets / UV SteriPen",
    ],
  },
  {
    emoji: "🧴",
    name: "Toiletries & Hygiene",
    color: "bg-teal-50 border-teal-200",
    headerColor: "text-teal-800",
    items: [
      "Biodegradable shampoo, soap, and conditioner",
      "Quick-dry microfiber towel",
      "SPF 50+ sunscreen (essential at altitude)",
      "Tinted lip balm with SPF protection",
      "Biodegradable wet wipes (for days without shower)",
      "Hand sanitizer (biodegradable preferred)",
      "Dental kit (toothbrush, toothpaste, floss)",
    ],
  },
  {
    emoji: "💊",
    name: "First Aid & Medications",
    color: "bg-orange-50 border-orange-200",
    headerColor: "text-orange-800",
    items: [
      "Diamox (acetazolamide) — AMS prevention (consult your doctor)",
      "Ibuprofen or paracetamol for headaches",
      "Blister plasters and moleskin pads",
      "Oral rehydration salts (ORS sachets)",
      "Antidiarrheal medication (loperamide)",
      "Antiseptic cream and sterile bandages",
      "Altitude sickness emergency medication (carry guide advises)",
    ],
  },
  {
    emoji: "📱",
    name: "Electronics & Documents",
    color: "bg-slate-50 border-slate-200",
    headerColor: "text-slate-700",
    items: [
      "Passport (6+ months validity) + photocopies",
      "Travel insurance policy documents (physical + digital)",
      "Trekking permit copies (issued by Nature Heaven)",
      "Power bank (20,000mAh minimum)",
      "Universal plug adapter",
      "Camera + extra memory cards and batteries",
      "Emergency contact list (laminated)",
    ],
  },
];

export default function PackingListStatic() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setChecked((p) => ({ ...p, [key]: !p[key] }));

  const total = categories.reduce((a, c) => a + c.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="bg-[#fcfbfa] min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative w-full bg-[#1a2e1f] py-24 md:py-32 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1a2e1f]/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
            <FaShoppingBag /> Trek Preparation
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            Himalayan Packing List
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            The ultimate interactive packing checklist for high-altitude Nepal trekking.
            Check items off as you pack — we provide the duffel bag and sleeping bag!
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="text-xs text-[#6B6B6B] flex items-center gap-1.5 font-semibold flex-wrap">
          <Link href="/" className="hover:text-[#2E7D32] transition">Home</Link>
          <span className="text-[#D0D0D0]">/</span>
          <Link href="/why-us" className="hover:text-[#2E7D32] transition">Travel Info</Link>
          <span className="text-[#D0D0D0]">/</span>
          <span className="text-[#1A1A2E] font-medium">Packing List</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Progress Bar */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-serif font-bold text-[#1a2e1f] text-lg">Your Packing Progress</h2>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                {done} of {total} items packed
              </p>
            </div>
            <span
              className={`text-2xl font-black font-sans ${
                pct === 100 ? "text-[#2E7D32]" : pct > 50 ? "text-[#F5A623]" : "text-[#6B6B6B]"
              }`}
            >
              {pct}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2E7D32] to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct === 100 && (
            <p className="text-xs text-[#2E7D32] font-bold flex items-center gap-1.5">
              <FaCheck /> You&apos;re fully packed! Have an incredible trek.
            </p>
          )}
        </div>

        {/* Note banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-start gap-3 text-sm text-emerald-900">
          <span className="text-lg mt-0.5">🎒</span>
          <span>
            <strong>Nature Heaven provides:</strong> high-quality duffel bag (80L) and a warm
            sleeping bag (rated -15°C) for all booked trekking clients — free of charge. Down
            jacket available on request.
          </span>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`rounded-2xl border p-5 flex flex-col gap-3 ${cat.color}`}
            >
              <h3 className={`font-serif font-bold text-base flex items-center gap-2 ${cat.headerColor}`}>
                <span className="text-xl">{cat.emoji}</span>
                {cat.name}
                <span className="ml-auto text-xs font-bold font-sans opacity-60">
                  {cat.items.filter((item) => checked[`${cat.name}::${item}`]).length}/
                  {cat.items.length}
                </span>
              </h3>
              <div className="flex flex-col gap-2">
                {cat.items.map((item) => {
                  const key = `${cat.name}::${item}`;
                  const isPacked = !!checked[key];
                  return (
                    <label
                      key={key}
                      className={`flex items-start gap-2.5 text-xs cursor-pointer select-none p-1.5 rounded-lg transition hover:bg-white/60 ${
                        isPacked ? "line-through opacity-50" : "opacity-90"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition ${
                          isPacked
                            ? "bg-[#2E7D32] border-[#2E7D32]"
                            : "bg-white/80 border-current opacity-50"
                        }`}
                      >
                        {isPacked && <FaCheck className="text-white text-[8px]" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={isPacked}
                        onChange={() => toggle(key)}
                        className="hidden"
                      />
                      <span className={`leading-relaxed ${cat.headerColor}`}>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="bg-[#1a2e1f] text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif font-black text-xl text-white mb-2">
              Ready to Book Your Trek?
            </h3>
            <p className="text-white/60 text-sm">
              Our team handles permits, accommodation, and guiding — you just need to pack!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/trips"
              className="flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e8950f] text-[#1a2e1f] font-bold py-3 px-6 rounded-xl text-sm transition"
            >
              Browse Treks <FaArrowRight className="text-xs" />
            </Link>
            <Link
              href="/contact-us"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 px-6 rounded-xl text-sm transition"
            >
              Contact Our Team
            </Link>
          </div>
        </div>

        {/* Related */}
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/visa-info", label: "Nepal Visa Info" },
            { href: "/travel-insurance", label: "Travel Insurance" },
            { href: "/faqs", label: "FAQs" },
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
