import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { FaPassport, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaArrowRight } from "react-icons/fa";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import CmsLexicalPage from "@/components/CmsLexicalPage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nepal Visa Information — On-Arrival Guide | Nature Heaven Trekking",
  description:
    "Everything you need to know about obtaining a Nepal tourist visa on arrival: fees, requirements, passport validity, and special country exemptions.",
  alternates: { canonical: "/visa-info" },
};

async function getCmsPage() {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "pages",
      where: { slug: { equals: "visa-info" } },
      depth: 2,
      limit: 1,
      overrideAccess: true,
    });
    return res.docs[0] || null;
  } catch {
    return null;
  }
}

const visaFees = [
  { duration: "15 Days", fee: "$30 USD", detail: "Short holiday or transit" },
  { duration: "30 Days", fee: "$50 USD", detail: "Standard trekking trip" },
  { duration: "90 Days", fee: "$125 USD", detail: "Extended expedition" },
];

const requirements = [
  "Valid passport with at least 6 months remaining validity",
  "One recent passport-sized photograph (uploaded digitally at airport kiosk)",
  "Completed online visa application via the Nepal immigration portal",
  "Cash payment in USD, EUR, GBP, or major foreign currencies",
  "Return flight ticket or onward travel documents",
  "Proof of sufficient funds for your stay (bank statement)",
];

const exemptCountries = [
  "India (no visa required — only a valid ID)",
  "China (requires prior special arrangement through embassy)",
  "South African nationals may need to contact the Nepal Embassy beforehand",
];

const ports = [
  { name: "Tribhuvan International Airport", city: "Kathmandu", type: "Airport" },
  { name: "Birgunj (Raxaul Bazaar)", city: "Birgunj", type: "Land Border" },
  { name: "Kakarvitta", city: "Jhapa", type: "Land Border" },
  { name: "Kodari (closed periodically)", city: "Sindhupalchowk", type: "Land Border" },
  { name: "Belahiya (Bhairahawa/Sunauli)", city: "Rupandehi", type: "Land Border" },
];

export default async function VisaInfoPage() {
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
            "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1a2e1f]/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
            <FaPassport /> Nepal Travel Guide
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            Nepal Visa on Arrival
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Most nationalities can obtain a Nepal tourist visa on arrival at
            Tribhuvan International Airport or designated land borders — no
            embassy pre-application required.
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
          <span className="text-[#1A1A2E] font-medium">Visa Information</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Visa Fee Cards */}
        <section>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1a2e1f] mb-2">
            Tourist Visa Fees (On Arrival)
          </h2>
          <p className="text-sm text-[#6B6B6B] mb-6 leading-relaxed">
            Nepal offers three types of tourist visa durations. Choose based on your planned trekking schedule.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {visaFees.map((v, i) => (
              <div
                key={i}
                className={`relative bg-white rounded-2xl p-6 border shadow-sm flex flex-col items-center text-center gap-2 transition hover:shadow-md ${
                  i === 1
                    ? "border-[#2E7D32] ring-1 ring-[#2E7D32]/20"
                    : "border-[#E5E5E5]"
                }`}
              >
                {i === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2E7D32] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <span className="text-3xl font-black text-[#1a2e1f] font-sans mt-2">{v.fee}</span>
                <span className="text-base font-serif font-bold text-[#1A1A2E]">{v.duration}</span>
                <span className="text-xs text-[#6B6B6B]">{v.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Main 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Left */}
          <div className="flex flex-col gap-8">

            {/* Requirements */}
            <section className="bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="p-2.5 bg-[#2E7D32]/10 text-[#2E7D32] rounded-xl text-lg">
                  <FaCheckCircle />
                </span>
                <h2 className="font-serif text-xl font-bold text-[#1a2e1f]">
                  Required Documents
                </h2>
              </div>
              <ul className="flex flex-col gap-3">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#3D3D3D]">
                    <span className="text-[#2E7D32] mt-0.5 shrink-0">✓</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Entry Ports */}
            <section className="bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="p-2.5 bg-[#1a2e1f]/10 text-[#1a2e1f] rounded-xl text-lg">
                  <FaInfoCircle />
                </span>
                <h2 className="font-serif text-xl font-bold text-[#1a2e1f]">
                  Official Entry Points
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {ports.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#1A1A2E] block">{p.name}</span>
                      <span className="text-[#6B6B6B]">{p.city}</span>
                    </div>
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider ${
                        p.type === "Airport"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {p.type}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Special Notes */}
            <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-3 mb-4">
                <FaExclamationTriangle className="text-amber-600 text-lg shrink-0 mt-0.5" />
                <h2 className="font-serif text-lg font-bold text-amber-900">
                  Special Exemptions & Notes
                </h2>
              </div>
              <ul className="flex flex-col gap-2.5">
                {exemptCountries.map((e, i) => (
                  <li key={i} className="text-sm text-amber-900 flex items-start gap-2">
                    <span className="text-amber-600 shrink-0">•</span>
                    <span>{e}</span>
                  </li>
                ))}
                <li className="text-sm text-amber-900 flex items-start gap-2 mt-2 pt-2 border-t border-amber-200">
                  <span className="text-amber-600 shrink-0">•</span>
                  <span>
                    Multiple-entry visas for Nepal are available. If you plan to
                    visit Tibet or India and return to Nepal, ensure you apply
                    for a multiple-entry visa.
                  </span>
                </li>
              </ul>
            </section>

          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-5 md:sticky md:top-24 self-start">
            <div className="bg-[#1a2e1f] text-white rounded-2xl p-6 shadow-lg flex flex-col gap-4">
              <h3 className="font-serif text-lg font-bold text-[#F5A623]">Step-by-Step Process</h3>
              <ol className="flex flex-col gap-3 text-xs text-white/85 leading-relaxed">
                {[
                  "Complete the online Nepal Visa application form before departure.",
                  "Land at Tribhuvan International Airport (TIA) in Kathmandu.",
                  "Go to the immigration visa-on-arrival counters — avoid the exit queues.",
                  "Submit your photo, completed form, and payment at the counter.",
                  "Collect your visa stamp, then proceed through immigration.",
                  "Collect your baggage and exit into the arrival hall.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#F5A623]/20 border border-[#F5A623]/40 text-[#F5A623] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <h4 className="font-serif text-sm font-bold text-[#1a2e1f]">Ready to Book Your Trek?</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Our team will guide you through the full visa process as part of your trekking package.
              </p>
              <Link
                href="/trips"
                className="flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 rounded-xl text-xs transition"
              >
                Browse Nepal Treks <FaArrowRight className="text-[10px]" />
              </Link>
              <Link
                href="/contact-us"
                className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-[#1a2e1f] font-bold py-3 rounded-xl text-xs border border-[#E5E5E5] transition"
              >
                Contact Our Team
              </Link>
            </div>

            {/* Quick links to other info pages */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">Related Pages</h4>
              {[
                { href: "/travel-insurance", label: "Travel Insurance Guide" },
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
