import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { FaGraduationCap, FaSeedling, FaTshirt, FaMoneyBillWave } from "react-icons/fa";

export const metadata: Metadata = {
  title: "CSR & Sustainability | Nature Heaven Trekking & Expedition",
  description: "Learn about our corporate social responsibility initiatives: supporting schools, ensuring porter welfare, and operating eco-friendly treks.",
};

export default function CSRPage() {
  return (
    <div className="bg-[#fcfbfa] min-h-screen pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Responsible Tourism in Action
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary mb-6">
            CSR & Sustainability
          </h1>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80 leading-relaxed">
            We love the Himalayas, and we believe it is our collective duty to preserve their environmental beauty, support local economic development, and respect mountain community welfare.
          </p>
        </div>

        {/* Introduction Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20 bg-white border border-secondary/10 p-8 md:p-12 rounded-2xl shadow-md">
          {/* Content */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">
              Giving Back to Mountain Communities
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              Trekking has changed the economic landscapes of rural Nepal. However, it can also strain resources and leave remote villages behind.
            </p>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              At Nature Heaven Trekking & Expedition, we pledge a portion of our annual profits directly to rural communities in Solukhumbu (Everest) and Gorkha (Manaslu) regions, specifically focusing on school library development and clean drinking water systems.
            </p>

            <div className="border-l-4 border-secondary pl-4 italic text-xs text-charcoal/70 my-2 leading-relaxed">
              &quot;We don&apos;t just lead tours; we support the children and porters whose ancestors have cared for these mountains for centuries.&quot; <br/>
              <span className="font-sans font-bold text-primary not-italic block mt-1">— Mingma Sherpa, CEO</span>
            </div>
          </div>

          {/* Graphic Side */}
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border-2 border-secondary/15 shadow-xl">
            <Image
              src="regions/manaslu_region_cover"
              alt="Sherpa kids smiling in mountain school"
              fill
                className="object-cover"
            />
          </div>
        </div>

        {/* Four Commitments Grid */}
        <div className="mb-20">
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary text-center mb-12">Our Core Commitments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Box 1 */}
            <div className="bg-white border border-secondary/10 p-8 rounded-xl flex gap-5 items-start">
              <span className="p-3 bg-secondary/10 text-secondary rounded-xl text-xl shrink-0">
                <FaGraduationCap />
              </span>
              <div>
                <h3 className="font-serif font-bold text-primary text-lg mb-2">Village School Library Project</h3>
                <p className="text-xs text-charcoal/75 leading-relaxed">
                  We supply textbooks, English storybooks, and reference encyclopedias to three rural primary schools in the Gorkha foothills, funding teacher salaries and study desks.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-white border border-secondary/10 p-8 rounded-xl flex gap-5 items-start">
              <span className="p-3 bg-secondary/10 text-secondary rounded-xl text-xl shrink-0">
                <FaTshirt />
              </span>
              <div>
                <h3 className="font-serif font-bold text-primary text-lg mb-2">Porter Welfare & Rights Code</h3>
                <p className="text-xs text-charcoal/75 leading-relaxed">
                  We are active supporters of IPPG (International Porter Protection Group). We guarantee maximum weight limits, hot nutritional meals, and warm shelter facilities for our helpers.
                </p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-white border border-secondary/10 p-8 rounded-xl flex gap-5 items-start">
              <span className="p-3 bg-secondary/10 text-secondary rounded-xl text-xl shrink-0">
                <FaSeedling />
              </span>
              <div>
                <h3 className="font-serif font-bold text-primary text-lg mb-2">Zero Single-Use Plastics</h3>
                <p className="text-xs text-charcoal/75 leading-relaxed">
                  We equip guides with gravity filter bags and water purification tablets, discouraging clients from buying bottled plastic mineral water in teahouses.
                </p>
              </div>
            </div>

            {/* Box 4 */}
            <div className="bg-white border border-secondary/10 p-8 rounded-xl flex gap-5 items-start">
              <span className="p-3 bg-secondary/10 text-secondary rounded-xl text-xl shrink-0">
                <FaMoneyBillWave />
              </span>
              <div>
                <h3 className="font-serif font-bold text-primary text-lg mb-2">Local Economic Support</h3>
                <p className="text-xs text-charcoal/75 leading-relaxed">
                  We source 100% of our teahouse stops from locally owned family lodges instead of foreign-owned corporate chains, keeping money directly in mountain economies.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
