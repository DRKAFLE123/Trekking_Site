import React from "react";
import { Metadata } from "next";
import { FaPassport, FaSuitcaseRolling, FaExclamationTriangle, FaShieldAlt } from "react-icons/fa";


import { Faq } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import FAQAccordion from "@/components/FAQAccordion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Why Choose Us & Travel Information | Nature Heaven Trekking & Expedition",
  description: "Get comprehensive travel advice for Nepal: tourist visa instructions, travel insurance requirements, packing checklists, and FAQs.",
};

export default async function WhyUsPage() {
  let faqs: Faq[] = [];
  try {
    const payload = await getPayload({ config });
    const response = await payload.find({
      collection: "faqs",
      depth: 1,
    });
    faqs = response.docs as unknown as Faq[];
  } catch (err: any) {
    console.warn("[WhyUs Page] Failed to fetch FAQs (relation may not exist yet during build):", err.message);
  }

  return (
    <div className="bg-[#fcfbfa] min-h-screen pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Nepal Travel Guide & FAQs
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary mb-6">
            Travel Information & Why Us
          </h1>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80 leading-relaxed">
            Planning a trek in the Himalayas requires preparation. Read our comprehensive travel advisor guidelines below covering visas, insurance, packing, and FAQs.
          </p>
        </div>

        {/* 1. Visa Information Section */}
        <section id="visa-info" className="scroll-mt-28 bg-white border border-secondary/10 p-8 md:p-10 rounded-2xl shadow-md mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex flex-col gap-4">
              <span className="p-3 bg-secondary/10 border border-secondary/25 text-secondary rounded-xl w-fit text-xl">
                <FaPassport />
              </span>
              <h2 className="font-serif text-2xl font-bold text-primary">Nepal Visa on Arrival</h2>
              <p className="text-sm text-charcoal/80 leading-relaxed">
                Most tourists visiting Nepal can easily obtain a tourist visa **On Arrival** at Tribhuvan International Airport (TIA) in Kathmandu, or at land borders. There is no need for pre-application at embassies for most nationalities (except for selected countries).
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <div className="bg-bgOffWhite/50 p-4 rounded-xl border border-primary/5 text-center">
                  <span className="font-bold text-primary block text-sm">15 Days</span>
                  <span className="text-secondary font-black text-xl mt-1 block">$30 USD</span>
                </div>
                <div className="bg-bgOffWhite/50 p-4 rounded-xl border border-primary/5 text-center">
                  <span className="font-bold text-primary block text-sm">30 Days</span>
                  <span className="text-secondary font-black text-xl mt-1 block">$50 USD</span>
                </div>
                <div className="bg-bgOffWhite/50 p-4 rounded-xl border border-primary/5 text-center">
                  <span className="font-bold text-primary block text-sm">90 Days</span>
                  <span className="text-secondary font-black text-xl mt-1 block">$125 USD</span>
                </div>
              </div>
            </div>

            <div className="bg-primary text-bgOffWhite p-6 rounded-xl border border-secondary/20 w-full md:max-w-xs shrink-0 flex flex-col gap-4 text-xs">
              <h4 className="font-serif font-bold text-secondary text-sm">What you need:</h4>
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Passport with 6+ months validity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>One recent passport-sized photograph</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Cash payment (USD preferred; other major currencies accepted)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Filled arrival card & online visa application form form at airport terminals</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Insurance Section */}
        <section id="insurance" className="scroll-mt-28 bg-white border border-secondary/10 p-8 md:p-10 rounded-2xl shadow-md mb-12">
          <div className="flex flex-col md:flex-row-reverse justify-between items-start gap-8">
            <div className="flex flex-col gap-4 grow">
              <span className="p-3 bg-secondary/10 border border-secondary/25 text-secondary rounded-xl w-fit text-xl">
                <FaShieldAlt />
              </span>
              <h2 className="font-serif text-2xl font-bold text-primary">Mandatory Travel Insurance</h2>
              <p className="text-sm text-charcoal/80 leading-relaxed">
                Trekking at high altitudes in Nepal (such as crossing Thorong La at 5416m or Kala Patthar at 5545m) carries inherent risks, including Acute Mountain Sickness (AMS). Therefore, **comprehensive travel insurance is a mandatory requirement** for all Nature Heaven Trekking & Expedition clients.
              </p>
              
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 leading-relaxed">
                <FaExclamationTriangle className="text-amber-600 shrink-0 mt-0.5 h-4 w-4" />
                <div>
                  <strong className="block text-amber-900 font-bold mb-1">CRITICAL REQUIREMENT</strong>
                  Your policy must explicitly cover **hiking up to 6,000m** and include emergency **helicopter evacuation (heli-rescue) medical dispatch** and hospitalization coverage. Standard holiday insurance policies do NOT cover this!
                </div>
              </div>
            </div>

            <div className="bg-bgOffWhite/50 p-6 rounded-xl border border-secondary/15 w-full md:max-w-xs shrink-0 flex flex-col gap-4 text-xs text-charcoal/80">
              <h4 className="font-serif font-bold text-primary text-sm">Recommended Providers:</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <strong className="block text-primary">World Nomads</strong>
                  <span>Supports high-altitude trekking under their Explorer plan.</span>
                </li>
                <li>
                  <strong className="block text-primary">Ripcord Rescue Travel Insurance</strong>
                  <span>Excellent for rescue search operations and remote medical emergencies.</span>
                </li>
                <li>
                  <strong className="block text-primary">Allianz / Cover-More</strong>
                  <span>Be sure to purchase the adventure sports add-on module.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Packing Lists Section */}
        <section id="packing" className="scroll-mt-28 bg-white border border-secondary/10 p-8 md:p-10 rounded-2xl shadow-md mb-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="p-3 bg-secondary/10 border border-secondary/25 text-secondary rounded-xl w-fit text-xl">
                <FaSuitcaseRolling />
              </span>
              <h2 className="font-serif text-2xl font-bold text-primary">Himalayan Packing Checklist</h2>
              <p className="text-sm text-charcoal/80 leading-relaxed">
                We provide a free high-quality Nature Heaven duffel bag and sleeping bag for all bookings. However, you need to pack appropriate personal clothing layers, footwear, and toiletries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs leading-relaxed">
              {/* Box 1 */}
              <div className="bg-bgOffWhite/40 border border-primary/5 p-5 rounded-xl">
                <h4 className="font-serif font-bold text-primary text-sm mb-3">1. Footwear</h4>
                <ul className="flex flex-col gap-2 list-disc pl-3.5 text-charcoal/70">
                  <li>Broken-in trekking boots</li>
                  <li>Camp sandals or sneakers</li>
                  <li>3-4 pairs merino wool socks</li>
                  <li>Thermal hiking socks</li>
                </ul>
              </div>

              {/* Box 2 */}
              <div className="bg-bgOffWhite/40 border border-primary/5 p-5 rounded-xl">
                <h4 className="font-serif font-bold text-primary text-sm mb-3">2. Upper Body Layers</h4>
                <ul className="flex flex-col gap-2 list-disc pl-3.5 text-charcoal/70">
                  <li>Moisture-wicking shirts (3)</li>
                  <li>Thermal base layers</li>
                  <li>Fleece pullover or jacket</li>
                  <li>Waterproof windbreaker jacket</li>
                </ul>
              </div>

              {/* Box 3 */}
              <div className="bg-bgOffWhite/40 border border-primary/5 p-5 rounded-xl">
                <h4 className="font-serif font-bold text-primary text-sm mb-3">3. Head & Hands</h4>
                <ul className="flex flex-col gap-2 list-disc pl-3.5 text-charcoal/70">
                  <li>UV sunglasses (polarized)</li>
                  <li>Warm beanie (covers ears)</li>
                  <li>Wide-brimmed sun hat</li>
                  <li>Light gloves & thick winter gloves</li>
                </ul>
              </div>

              {/* Box 4 */}
              <div className="bg-bgOffWhite/40 border border-primary/5 p-5 rounded-xl">
                <h4 className="font-serif font-bold text-primary text-sm mb-3">4. Gear & Toiletries</h4>
                <ul className="flex flex-col gap-2 list-disc pl-3.5 text-charcoal/70">
                  <li>Headlamp with spare batteries</li>
                  <li>Trekking poles (highly recommended)</li>
                  <li>Biodegradable wet wipes</li>
                  <li>High SPF sunscreen & lip balm</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FAQs Section */}
        <section id="faq" className="scroll-mt-28 py-10">
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary text-center mb-10">
            Frequently Asked Questions
          </h2>
          <FAQAccordion faqs={faqs} />
        </section>

      </div>
    </div>
  );
}
