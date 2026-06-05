import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowRight,
  FaHelicopter,
  FaHospital,
} from "react-icons/fa";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import CmsLexicalPage from "@/components/CmsLexicalPage";

export const revalidate = 60;

async function getCmsPage() {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "pages",
      where: { slug: { equals: "travel-insurance" } },
      depth: 2,
      limit: 1,
      overrideAccess: true,
    });
    return res.docs[0] || null;
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Travel Insurance for Nepal Trekking | Nature Heaven Trekking",
  description:
    "Comprehensive guide to mandatory travel insurance for high-altitude trekking in Nepal. Learn what coverage you need, recommended providers, and helicopter evacuation policies.",
};

const mustHave = [
  "High-altitude trekking coverage (explicitly up to 6,000m / 19,685ft)",
  "Emergency helicopter evacuation and search & rescue",
  "Medical evacuation to your home country if necessary",
  "Hospitalization and in-patient medical costs",
  "Trip cancellation due to unforeseen natural disasters or emergencies",
  "Personal accident, injury, and accidental death benefit",
];

const notCovered = [
  "Standard holiday insurance — does NOT cover altitude trekking",
  "Policies that cap altitude at 2,000–3,000m are insufficient for EBC or Annapurna",
  "Budget travel insurance without a specific adventure sports rider",
  "Policies that exclude 'dangerous activities' — trekking is considered such",
];

const providers = [
  {
    name: "World Nomads",
    plan: "Explorer Plan",
    alt: "6,000m+",
    rescue: "✓ Included",
    notes: "Best for independent and budget travelers. Online purchase available.",
    color: "blue",
  },
  {
    name: "Ripcord Rescue Travel",
    plan: "Standard / Elite",
    alt: "Unlimited",
    rescue: "✓ Priority rescue",
    notes: "Industry gold standard for remote rescue operations. Highly recommended for technical trekking.",
    color: "green",
  },
  {
    name: "Battleface",
    plan: "Adventure Plan",
    alt: "6,000m+",
    rescue: "✓ Included",
    notes: "Highly flexible, available in most countries, includes pre-existing condition options.",
    color: "amber",
  },
  {
    name: "Allianz / Cover-More",
    plan: "Adventure Sports Add-on",
    alt: "Up to 6,000m",
    rescue: "✓ With add-on",
    notes: "Purchase the adventure sports add-on module. Standard plan does not cover trekking.",
    color: "purple",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200 text-blue-800",
  green: "bg-emerald-50 border-emerald-200 text-emerald-800",
  amber: "bg-amber-50 border-amber-200 text-amber-800",
  purple: "bg-purple-50 border-purple-200 text-purple-800",
};

export default async function TravelInsurancePage() {
  const cmsPage = await getCmsPage();
  if (cmsPage) {
    return <CmsLexicalPage page={cmsPage as any} />;
  }
  return (
    <div className="bg-[#fcfbfa] min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative w-full bg-[#1a2e1f] py-24 md:py-32 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600508774634-4e11d34730e2?q=80&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        <div className="absolute inset-0 bg-[#1a2e1f]/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
            <FaShieldAlt /> Nepal Travel Safety
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            Travel Insurance Guide
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Comprehensive travel insurance is <strong className="text-white">mandatory</strong> for
            all Nature Heaven Trekking clients. Your policy must explicitly cover
            high-altitude trekking and helicopter rescue above 5,000m.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="text-xs text-[#6B6B6B] flex items-center gap-1.5 font-semibold flex-wrap">
          <Link href="/" className="hover:text-[#2E7D32] transition">Home</Link>
          <span className="text-[#D0D0D0]">/</span>
          <Link href="/why-us" className="hover:text-[#2E7D32] transition">Travel Info</Link>
          <span className="text-[#D0D0D0]">/</span>
          <span className="text-[#1A1A2E] font-medium">Travel Insurance</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Critical Warning */}
        <div className="bg-red-50 border-l-4 border-red-500 rounded-2xl p-6 flex gap-4">
          <FaExclamationTriangle className="text-red-500 text-2xl shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h2 className="font-serif font-bold text-red-900 text-lg">Critical Requirement</h2>
            <p className="text-sm text-red-800 leading-relaxed">
              A standard holiday travel insurance policy <strong>does NOT cover</strong> high-altitude
              trekking or helicopter evacuation in Nepal. You must specifically purchase a policy
              that covers trekking above 5,000m and includes emergency helicopter search and
              rescue operations. Failure to do so will leave you personally liable for evacuation
              costs which can exceed{" "}
              <strong>$10,000–$30,000 USD</strong> in a single rescue.
            </p>
          </div>
        </div>

        {/* 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="flex flex-col gap-8">

            {/* Must-Have Coverage */}
            <section className="bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="p-2.5 bg-[#2E7D32]/10 text-[#2E7D32] rounded-xl text-lg">
                  <FaCheckCircle />
                </span>
                <h2 className="font-serif text-xl font-bold text-[#1a2e1f]">
                  Your Policy Must Include
                </h2>
              </div>
              <ul className="flex flex-col gap-3.5">
                {mustHave.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#3D3D3D]">
                    <span className="text-[#2E7D32] shrink-0 mt-0.5 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* What's Not Covered */}
            <section className="bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="p-2.5 bg-red-50 text-red-500 rounded-xl text-lg">
                  <FaExclamationTriangle />
                </span>
                <h2 className="font-serif text-xl font-bold text-[#1a2e1f]">
                  What Will NOT Work
                </h2>
              </div>
              <ul className="flex flex-col gap-3.5">
                {notCovered.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#3D3D3D]">
                    <span className="text-red-500 shrink-0 mt-0.5 font-bold">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Recommended Providers */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-[#1a2e1f] mb-5">
                Recommended Insurance Providers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {providers.map((p, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl border p-5 flex flex-col gap-3 ${colorMap[p.color]}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif font-bold text-base">{p.name}</h3>
                        <span className="text-xs font-semibold opacity-75">{p.plan}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                      <span className="bg-white/60 px-2 py-1 rounded-lg border border-current/20">
                        🏔 Altitude: {p.alt}
                      </span>
                      <span className="bg-white/60 px-2 py-1 rounded-lg border border-current/20">
                        🚁 Rescue: {p.rescue}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-80">{p.notes}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Helicopter Evacuation */}
            <section className="bg-[#1a2e1f] text-white rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="p-2.5 bg-white/10 text-[#F5A623] rounded-xl text-lg">
                  <FaHelicopter />
                </span>
                <h2 className="font-serif text-xl font-bold text-white">
                  Helicopter Rescue in Nepal
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-[#F5A623] font-bold text-xs uppercase tracking-wider">Average Rescue Cost</span>
                  <span className="text-2xl font-black text-white">$5,000–$12,000</span>
                  <span className="text-white/60 text-xs">Per helicopter flight from high altitude</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-[#F5A623] font-bold text-xs uppercase tracking-wider">Medevac to Home</span>
                  <span className="text-2xl font-black text-white">$30,000–$100,000+</span>
                  <span className="text-white/60 text-xs">International air ambulance evacuation</span>
                </div>
              </div>
              <p className="text-white/70 text-xs mt-5 leading-relaxed">
                Our guides carry satellite communication devices and have direct contacts with
                rescue helicopter companies. In emergencies, evacuation can be arranged within
                2–4 hours. The billing is made directly to your insurance company — you will
                need to provide your policy number and insurer contact details.
              </p>
            </section>

            {/* Hospital Info */}
            <section className="bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2.5 bg-[#2E7D32]/10 text-[#2E7D32] rounded-xl text-lg">
                  <FaHospital />
                </span>
                <h2 className="font-serif text-lg font-bold text-[#1a2e1f]">
                  Hospitals in Kathmandu
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { name: "CIWEC Hospital", desc: "Top travel medicine clinic. Specialized in altitude sickness." },
                  { name: "Norvic International Hospital", desc: "Well-equipped ICU and international patient services." },
                  { name: "Patan Hospital", desc: "Government hospital with emergency trauma facilities." },
                  { name: "Grande International Hospital", desc: "Modern multi-specialty hospital in Kathmandu." },
                ].map((h, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <span className="font-bold text-[#1A1A2E] block mb-0.5">{h.name}</span>
                    <span className="text-[#6B6B6B]">{h.desc}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5 md:sticky md:top-24 self-start">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <h3 className="font-serif font-bold text-[#1a2e1f]">Insurance Checklist</h3>
              <ul className="flex flex-col gap-2 text-xs text-[#3D3D3D]">
                {[
                  "Altitude coverage confirmed above 5,500m",
                  "Helicopter rescue explicitly included",
                  "Medical evacuation to home country",
                  "Pre-existing condition status clarified",
                  "Policy number saved & accessible offline",
                  "Emergency hotline number saved",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 py-1.5 border-b border-[#F0F0F0] last:border-0">
                    <span className="w-4 h-4 rounded border-2 border-[#2E7D32] shrink-0 mt-0.5 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-sm bg-[#2E7D32] opacity-0 group-hover:opacity-100"></span>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1a2e1f] text-white rounded-2xl p-5 shadow-lg flex flex-col gap-3">
              <h4 className="font-serif text-sm font-bold text-[#F5A623]">Need Advice?</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Our team is happy to advise you on which insurance policy best suits your
                specific trekking itinerary and country of origin.
              </p>
              <Link
                href="/contact-us"
                className="flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e8950f] text-[#1a2e1f] font-bold py-3 rounded-xl text-xs transition"
              >
                Ask Our Advisors <FaArrowRight className="text-[10px]" />
              </Link>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">Related Pages</h4>
              {[
                { href: "/visa-info", label: "Nepal Visa Information" },
                { href: "/packing-list", label: "Packing List & Gear" },
                { href: "/faqs", label: "Frequently Asked Questions" },
                { href: "/why-us", label: "Why Choose Us" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center justify-between text-xs font-semibold text-[#3D3D3D] hover:text-[#2E7D32] transition py-1 border-b border-[#F0F0F0] last:border-0"
                >
                  {l.label}
                  <FaArrowRight className="text-[9px] text-[#6B6B6B]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
