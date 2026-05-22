import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaCompass, FaHeart, FaHandsHelping, FaFileSignature } from "react-icons/fa";

export const metadata: Metadata = {
  title: "About Us | Nature Heaven Trekking & Expedition",
  description: "Learn about Nature Heaven Trekking & Expedition, a Nepal-based private trekking agency founded by native Everest summits guides.",
};

export default function AboutUsPage() {
  return (
    <div className="bg-[#fcfbfa] min-h-screen pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Our Story & Vision
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary mb-6">
            About Nature Heaven Trekking & Expedition
          </h1>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80 leading-relaxed">
            Founded by native high-altitude Sherpa guides, Nature Heaven Trekking & Expedition represents a dream of connecting conscious international travelers with the authentic heart of the Nepalese Himalayas.
          </p>
        </div>

        {/* Brand Mission Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20 bg-white border border-secondary/10 p-8 md:p-12 rounded-2xl shadow-md">
          {/* Content */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">
              Where Adventure Meets Personalization
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              For over a decade, we watched the trekking industry shift toward large, overcrowded groups. We saw travelers rushing through pristine valleys, unable to adjust their pace or pause to appreciate local Sherpa culture.
            </p>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              We founded Nature Heaven Trekking & Expedition to offer the exact opposite: **100% private, customized departures**. On a private trek with us, you set the calendar date, you set the daily hiking speed, and our guides look after only you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex items-start gap-2.5">
                <span className="text-secondary mt-1">✓</span>
                <span className="text-xs font-bold text-primary">100% Native Sherpa Guides</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-secondary mt-1">✓</span>
                <span className="text-xs font-bold text-primary">Flexible Daily Itineraries</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-secondary mt-1">✓</span>
                <span className="text-xs font-bold text-primary">Fair Wages for Porters</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-secondary mt-1">✓</span>
                <span className="text-xs font-bold text-primary">Verified Carbon-Neutral Walks</span>
              </div>
            </div>
          </div>

          {/* Graphic Side */}
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border-2 border-secondary/15 shadow-xl">
            <Image
              src="regions/everest_region_cover"
              alt="High pass trekker looking at Mt Everest"
              fill
                className="object-cover"
            />
          </div>
        </div>

        {/* Our Pillars */}
        <div className="mb-20 text-center">
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary mb-12">Our Founding Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white border border-secondary/10 p-8 rounded-xl shadow-sm hover:shadow-md transition text-center">
              <div className="h-12 w-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mx-auto mb-5 text-xl">
                <FaCompass />
              </div>
              <h3 className="font-serif font-bold text-primary text-lg mb-3">Custom Journeys</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Every traveler is unique. We modify accommodation standard, add acclimatization days, or combine routes to match your aspirations.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border border-secondary/10 p-8 rounded-xl shadow-sm hover:shadow-md transition text-center">
              <div className="h-12 w-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mx-auto mb-5 text-xl">
                <FaHeart />
              </div>
              <h3 className="font-serif font-bold text-primary text-lg mb-3">Porter Welfare</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Porters carry our dreams. We strictly enforce maximum weight limits (20kg), provide warm jackets/boots, and pay above-average union wages.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border border-secondary/10 p-8 rounded-xl shadow-sm hover:shadow-md transition text-center">
              <div className="h-12 w-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mx-auto mb-5 text-xl">
                <FaHandsHelping className="text-secondary" />
              </div>
              <h3 className="font-serif font-bold text-primary text-lg mb-3">Eco-Ethics</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                We believe in leaving the mountains cleaner than we found them. We practice a strict Leave No Trace policy on all high-altitude base camp trails.
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Licensing Info */}
        <div className="bg-primary text-bgOffWhite rounded-2xl p-8 md:p-12 border border-secondary/20 shadow-xl flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4 max-w-2xl text-center md:text-left">
            <span className="p-3 bg-secondary/10 border border-secondary/25 text-secondary rounded-xl w-fit mx-auto md:mx-0 text-xl">
              <FaFileSignature />
            </span>
            <h3 className="font-serif font-bold text-secondary text-xl md:text-2xl">Fully Licensed & Registered Operator</h3>
            <p className="text-xs text-bgOffWhite/80 leading-relaxed">
              Nature Heaven Trekking & Expedition is fully authorized by the Ministry of Tourism, Government of Nepal (Registration No: 4893). We hold active memberships with the Nepal Mountaineering Association (NMA) and the Trekking Agencies Association of Nepal (TAAN). Your booking deposit is fully bonded and secured by the Nepal National Bank.
            </p>
          </div>
          <Link
            href="/contact-us"
            className="bg-secondary text-primary font-bold px-8 py-3.5 rounded-xl text-sm border border-secondary hover:bg-transparent hover:text-secondary hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
          >
            Contact Our Office
          </Link>
        </div>

      </div>
    </div>
  );
}
