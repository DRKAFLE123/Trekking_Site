import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight, FaInfoCircle, FaMapMarkerAlt, FaHeadset, FaEnvelope, FaStar, FaPassport, FaSuitcaseRolling, FaExclamationTriangle, FaShieldAlt, FaCompass } from "react-icons/fa";
import { renderLexical } from "@/lib/lexical-renderer";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import ScrollSpyTOC from "@/components/ScrollSpyTOC";
import FAQAccordion from "@/components/FAQAccordion";
import { Faq } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Why Choose Us & Travel Information | Nature Heaven Trekking & Expedition",
  description: "Get comprehensive travel advice for Nepal: tourist visa instructions, travel insurance requirements, packing checklists, and FAQs.",
};

function extractYoutubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

async function getPageData() {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'companyPages',
      where: {
        slug: {
          equals: 'why-us',
        },
      },
      depth: 2,
    });
    if (result.docs.length === 0) return null;
    return result.docs[0];
  } catch (error) {
    console.error("Error in getPageData:", error);
    return null;
  }
}

async function getPagesList() {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'companyPages',
      limit: 20,
      depth: 0,
    });
    return result.docs;
  } catch (error) {
    console.error("Error in getPagesList:", error);
    return [];
  }
}

export default async function WhyUsPage() {
  const page = await getPageData();
  
  // Graceful Fallback if page not created in CMS yet
  if (!page) {
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
                  Most tourists visiting Nepal can easily obtain a tourist visa <strong>On Arrival</strong> at Tribhuvan International Airport (TIA) in Kathmandu, or at land borders. There is no need for pre-application at embassies for most nationalities (except for selected countries).
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
                    <span>Filled arrival card & online visa application form at airport terminals</span>
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
                  Trekking at high altitudes in Nepal (such as crossing Thorong La at 5416m or Kala Patthar at 5545m) carries inherent risks, including Acute Mountain Sickness (AMS). Therefore, <strong>comprehensive travel insurance is a mandatory requirement</strong> for all Nature Heaven Trekking & Expedition clients.
                </p>
                
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 leading-relaxed">
                  <FaExclamationTriangle className="text-amber-600 shrink-0 mt-0.5 h-4 w-4" />
                  <div>
                    <strong className="block text-amber-900 font-bold mb-1">CRITICAL REQUIREMENT</strong>
                    Your policy must explicitly cover <strong>hiking up to 6,000m</strong> and include emergency <strong>helicopter evacuation (heli-rescue) medical dispatch</strong> and hospitalization coverage. Standard holiday insurance policies do NOT cover this!
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
                <div className="bg-bgOffWhite/40 border border-primary/5 p-5 rounded-xl">
                  <h4 className="font-serif font-bold text-primary text-sm mb-3">1. Footwear</h4>
                  <ul className="flex flex-col gap-2 list-disc pl-3.5 text-charcoal/70">
                    <li>Broken-in trekking boots</li>
                    <li>Camp sandals or sneakers</li>
                    <li>3-4 pairs merino wool socks</li>
                    <li>Thermal hiking socks</li>
                  </ul>
                </div>

                <div className="bg-bgOffWhite/40 border border-primary/5 p-5 rounded-xl">
                  <h4 className="font-serif font-bold text-primary text-sm mb-3">2. Upper Body Layers</h4>
                  <ul className="flex flex-col gap-2 list-disc pl-3.5 text-charcoal/70">
                    <li>Moisture-wicking shirts (3)</li>
                    <li>Thermal base layers</li>
                    <li>Fleece pullover or jacket</li>
                    <li>Waterproof windbreaker jacket</li>
                  </ul>
                </div>

                <div className="bg-bgOffWhite/40 border border-primary/5 p-5 rounded-xl">
                  <h4 className="font-serif font-bold text-primary text-sm mb-3">3. Head & Hands</h4>
                  <ul className="flex flex-col gap-2 list-disc pl-3.5 text-charcoal/70">
                    <li>UV sunglasses (polarized)</li>
                    <li>Warm beanie (covers ears)</li>
                    <li>Wide-brimmed sun hat</li>
                    <li>Light gloves & thick winter gloves</li>
                  </ul>
                </div>

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

  // Render CMS dynamic premium template when seeded/created in the CMS
  const allPages = await getPagesList();

  return (
    <div className="bg-[#f8f5f0] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-[#1a2e1f]">
        {(page.heroImage as any)?.url ? (
          <Image
            src={(page.heroImage as any).url}
            alt={(page.heroImage as any).alt || page.title}
            fill
            className="object-cover opacity-50"
          />
        ) : (
          <div className="absolute inset-0 opacity-40 bg-[url('/pattern-leaf.png')] bg-repeat"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1f] via-transparent to-black/30"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-24 md:pt-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
            <FaCompass className="text-[#c8922a]" />
            Company Profile &amp; Ethics
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 drop-shadow-lg">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="text-white/90 text-sm md:text-base max-w-2xl font-sans drop-shadow">
              {page.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-[#6B6B6B] mb-8 font-sans overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-[#2E7D32] transition">Home</Link>
          <FaChevronRight className="mx-2 text-xs text-gray-400" />
          <span className="text-gray-400">Company</span>
          <FaChevronRight className="mx-2 text-xs text-gray-400" />
          <span className="font-semibold text-[#1a2e1f]">{page.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
              <article className="prose prose-lg max-w-none 
                prose-headings:font-serif prose-headings:text-[#1a2e1f] 
                prose-h2:text-2xl prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3 prose-h2:mb-6
                prose-h3:text-xl prose-h3:text-[#2E7D32]
                prose-p:text-[#4A4A4A] prose-p:leading-relaxed
                prose-a:text-[#c8922a] prose-a:font-semibold hover:prose-a:text-[#b07820]
                prose-li:text-[#4A4A4A] prose-li:marker:text-[#c8922a]
                prose-strong:text-[#1a2e1f]
                prose-img:rounded-xl prose-img:shadow-md"
              >
                {renderLexical(page.content)}
              </article>
            </div>

            {/* Downloadable Documents / PDFs Section */}
            {page.documents && page.documents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1a2e1f] mb-6 flex items-center gap-2">
                  <FaInfoCircle className="text-[#c8922a]" /> Downloadable Credentials &amp; Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {page.documents.map((doc: any) => (
                    <a 
                      key={doc.id} 
                      href={doc.url} 
                      download 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group flex items-center justify-between p-4 bg-[#fbfbfc] border border-gray-100 rounded-xl hover:border-[#c8922a] hover:bg-[#f0f6fa] hover:shadow-sm transition duration-300"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-100 transition">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <span className="font-sans text-sm font-bold text-[#1a2e1f] truncate group-hover:text-[#c8922a] transition">{doc.filename}</span>
                          <span className="text-[11px] text-gray-400 font-sans mt-0.5 capitalize">{doc.mimeType?.split('/')[1] || 'PDF Document'}</span>
                        </div>
                      </div>
                      <div className="text-gray-400 group-hover:text-[#c8922a] shrink-0 transition pl-4">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* YouTube Helper Videos Section */}
            {page.videos && page.videos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1a2e1f] mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#c8922a]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Featured Company Videos &amp; Documentaries
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {page.videos.map((vid: any, idx: number) => {
                    const videoId = extractYoutubeId(vid.youtubeUrl);
                    if (!videoId) return null;
                    return (
                      <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition">
                        <div className="relative aspect-video w-full bg-black">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={vid.title}
                            className="absolute inset-0 w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="p-4 flex-1 bg-gray-50/50 border-t border-gray-100 flex items-center">
                          <span className="font-sans text-sm font-bold text-[#1a2e1f] leading-snug">{vid.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommended Treks / Trips Section */}
            {page.relatedTreks && page.relatedTreks.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1a2e1f] mb-6 flex items-center gap-2">
                  <FaStar className="text-[#c8922a]" /> Recommended Trips &amp; Itineraries
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {page.relatedTreks.map((trek: any) => (
                    <div key={trek.slug} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full">
                      {/* Trek Image */}
                      <div className="relative h-48 w-full bg-[#1a2e1f]">
                        {trek.coverImage?.url ? (
                          <Image src={trek.coverImage.url} alt={trek.coverImage.alt || trek.title} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white/40"><FaMapMarkerAlt className="text-4xl" /></div>
                        )}
                        <div className="absolute top-4 right-4 bg-[#c8922a] text-white px-2.5 py-1 rounded-lg text-xs font-bold font-sans uppercase tracking-wider">
                          {trek.difficulty || 'Moderate'}
                        </div>
                      </div>
                      {/* Trek Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-[#1a2e1f] mb-2 hover:text-[#c8922a] transition duration-200">
                            <Link href={`/trips/${trek.slug}`}>{trek.title}</Link>
                          </h4>
                          <p className="text-xs text-gray-500 font-sans mb-4">{trek.duration || 14} Days duration</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">From</span>
                            <span className="text-lg font-extrabold text-[#2E7D32] font-sans">${trek.price || 1200} <span className="text-xs text-gray-400 font-normal">USD</span></span>
                          </div>
                          <Link href={`/trips/${trek.slug}`} className="bg-[#1a2e1f] hover:bg-[#c8922a] text-white font-sans font-bold text-xs px-4 py-2.5 rounded-lg transition duration-200 uppercase tracking-wider">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[350px] shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* ScrollSpy Table of Contents */}
              <ScrollSpyTOC />

              {/* Quick Links */}
              {allPages.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-serif text-xl font-bold text-[#1a2e1f] mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#c8922a]" /> Company Info
                  </h3>
                  <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                    {allPages.map((p: any) => {
                      const isStatic = ["about-us", "why-us", "responsible-tourism", "our-team", "terms-conditions", "privacy-policy", "legal-documents"].includes(p.slug);
                      const href = isStatic ? `/${p.slug}` : `/company/${p.slug}`;
                      return (
                        <li key={p.slug}>
                          <Link 
                            href={href}
                            className={`block px-3 py-2 rounded-lg text-sm font-semibold transition ${
                              p.slug === page.slug 
                                ? 'bg-[#1a2e1f] text-white' 
                                : 'text-[#4A4A4A] hover:bg-gray-50 hover:text-[#c8922a]'
                            }`}
                          >
                            {p.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Need Help CTA */}
              <div className="bg-gradient-to-br from-[#1a2e1f] to-[#2E7D32] rounded-2xl p-6 text-white text-center shadow-lg">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <FaHeadset className="text-3xl text-[#c8922a]" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Need Expert Advice?</h3>
                <p className="text-sm text-white/80 mb-6 font-sans">
                  Our travel experts are here to help you plan your perfect Himalayan adventure.
                </p>
                <Link 
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 bg-[#c8922a] hover:bg-[#b07820] text-white w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition shadow-md hover:shadow-lg"
                >
                  <FaEnvelope /> Contact Us
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
