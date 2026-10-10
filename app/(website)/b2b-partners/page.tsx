import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import B2BPartnerForm from "@/components/b2b/B2BPartnerForm";
import {
  IconOperator, IconAgency, IconDmc, IconPlatform, IconClub, IconGroup, IconTag, IconWhiteLabel, IconCalendar,
  IconShield, IconPermit, IconSupport, IconMedia, IconBolt, IconSend, IconDocs, IconHandshake, IconMountain,
  IconCheck, IconWallet, IconBuilding,
} from "@/components/b2b/B2BIcons";

export const revalidate = 3600;

const SITE = "https://natureheaventreks.com";
const PATH = "/b2b-partners";
const TITLE = "B2B Trekking Partner in Nepal | Ground Handler for Tour Operators";
const DESCRIPTION =
  "Partner with a government-licensed Nepal ground handler. Net rates, white-label private treks, peak climbing and expeditions, permits and 24/7 field support for tour operators, agencies and DMCs.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE}` },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

const IMG = {
  hero: "https://res.cloudinary.com/dslrn3soo/image/upload/v1790229500/summit-trail-trekking/Annapurna_Expedition_-40_Days-2_nul10a.jpg",
  team: "https://res.cloudinary.com/dslrn3soo/image/upload/v1790313436/summit-trail-trekking/Annapurna_Expedition_-40_Days-5_iacvrh.jpg",
  manaslu: "https://res.cloudinary.com/dslrn3soo/image/upload/v1789543680/summit-trail-trekking/Manaslu_Tsum_Valley_Trek_-19_Days-5_liwfgn.jpg",
  tsum: "https://res.cloudinary.com/dslrn3soo/image/upload/v1789543466/summit-trail-trekking/Manaslu_Tsum_Valley_Trek_-19_Days-1_or95vc.jpg",
  annapurna: "https://res.cloudinary.com/dslrn3soo/image/upload/v1789531568/summit-trail-trekking/Annapurna_Circuit_Trek_with_Tilicho_Lake_16_Days-3_rhdp2c.jpg",
  thorong: "https://res.cloudinary.com/dslrn3soo/image/upload/v1789531220/summit-trail-trekking/Annapurna_Circuit_Trek_with_Tilicho_Lake_16_Days-1_vpupli.jpg",
  trekker: "https://res.cloudinary.com/dslrn3soo/image/upload/v1789637333/summit-trail-trekking/Khopra_Danda_and_Annapurna_Base_Camp_Trek_15_Days-5_fzrel9.jpg",
};

const AUDIENCES = [
  { icon: IconOperator, title: "Tour operators", text: "Add Nepal treks to your catalogue and let a licensed local team run every day on the ground." },
  { icon: IconAgency, title: "Travel agencies", text: "Sell ready-made or tailor-made Himalayan trips to your clients at confidential partner rates." },
  { icon: IconDmc, title: "DMCs & ground handlers", text: "Extend multi-country programs with a reliable Nepal, Tibet and Bhutan operating partner." },
  { icon: IconPlatform, title: "Online travel platforms", text: "List bookable departures with clear inclusions, real photos and fast confirmations." },
  { icon: IconClub, title: "Adventure clubs", text: "Run club expeditions, peak climbs and charity treks with full logistics handled." },
  { icon: IconGroup, title: "Corporate & school groups", text: "Leadership treks, student trips and incentive travel with safety-first planning." },
];

const BENEFITS = [
  { icon: IconTag, title: "Net partner rates", text: "Confidential B2B pricing so you set your own margin. Group tiers for larger departures." },
  { icon: IconWhiteLabel, title: "White-label service", text: "Your brand stays in front of your client. We operate quietly behind it." },
  { icon: IconCalendar, title: "Any date, private groups", text: "Private departures on the dates your clients choose, from 1 traveler upward." },
  { icon: IconShield, title: "Licensed & safety-first", text: "Government-licensed company with trained, licensed guides and planned acclimatization." },
  { icon: IconPermit, title: "Permits & logistics", text: "TIMS, national park and restricted-area permits, domestic flights, hotels and transfers." },
  { icon: IconSupport, title: "24/7 field support", text: "A Kathmandu operations team and WhatsApp line reachable throughout every trip." },
  { icon: IconMedia, title: "Sales-ready content", text: "Original trip photos, day-by-day itineraries and printable PDF brochures for every trek." },
  { icon: IconBolt, title: "Fast quotes", text: "Clear quotes and confirmations so you can answer your own clients quickly." },
];

const STEPS = [
  { icon: IconSend, title: "Send the partner form", text: "Tell us who you are, where you sell and which trips interest you." },
  { icon: IconDocs, title: "Get rates & itineraries", text: "We reply within 24 hours with net rates, terms and sample programs." },
  { icon: IconHandshake, title: "Book for your clients", text: "Send dates and group details. We confirm and handle permits and logistics." },
  { icon: IconMountain, title: "We operate, you grow", text: "Our guides run the trip end to end while you keep the client relationship." },
];

const PRODUCTS = [
  { img: IMG.thorong, title: "Classic Himalayan treks", text: "Everest Base Camp, Annapurna Circuit, Annapurna Base Camp, Langtang and Poon Hill.", href: "/trips", cta: "See all treks" },
  { img: IMG.manaslu, title: "Restricted-area treks", text: "Manaslu Circuit, Tsum Valley, Upper Mustang and Nar Phu with special permits arranged.", href: "/regions/manaslu", cta: "Manaslu region" },
  { img: IMG.annapurna, title: "Peak climbing & expeditions", text: "Island Peak, Mera Peak, Lobuche East, Ama Dablam and 8,000 m expeditions.", href: "/regions/peak-climbing-in-nepal", cta: "Peak climbing" },
  { img: IMG.tsum, title: "Culture, Tibet & Bhutan", text: "Kathmandu heritage tours, Lumbini, Chitwan safaris, Tibet and Bhutan add-ons.", href: "/regions/tour-in-nepal", cta: "Tours in Nepal" },
];

const FAQS = [
  {
    q: "What does a B2B partnership with Nature Heaven include?",
    a: "You get confidential net rates for our treks, tours, peak climbs and expeditions, white-label operation under your brand, help with permits and logistics, original trip photos and itineraries for your marketing, and a Kathmandu operations team supporting your clients throughout the trip.",
  },
  {
    q: "Are you a licensed trekking company in Nepal?",
    a: "Yes. Nature Heaven Treks & Expedition is a government-licensed company in Nepal (registration no. 215948/75/076) operating since 2019, and a member of the Trekking Agencies' Association of Nepal (TAAN) and Nepal Tourism Board.",
  },
  {
    q: "Can you operate trips under our own brand?",
    a: "Yes. With our white-label model your client books with you and we operate the trip on the ground. We can brief our guides to represent your company and keep all communication through you.",
  },
  {
    q: "Do you only run private trips, or group departures too?",
    a: "We specialize in private trips that start on the dates your clients choose, for any group size from one traveler. Larger groups receive tiered partner pricing.",
  },
  {
    q: "Which permits and logistics do you handle?",
    a: "TIMS and national park permits, restricted-area permits for regions such as Manaslu, Tsum Valley and Upper Mustang, peak climbing and expedition permits, domestic flights, hotels, airport transfers, guides and porters.",
  },
  {
    q: "How do payments work for partners?",
    a: "Partner terms are agreed individually. Payments are made by international bank (SWIFT) transfer in USD to our company account in Nepal, with an invoice for every booking.",
  },
  {
    q: "How quickly will we get a quote?",
    a: "We reply to partner inquiries within 24 hours with net rates and sample itineraries, and confirm specific bookings as soon as dates and group details are final.",
  },
  {
    q: "Do you have an office outside Nepal?",
    a: "Our head office is in Thamel, Kathmandu, and we have a branch office in London, United Kingdom, which makes it easier for European partners to reach us in their own time zone.",
  },
];

async function getStats() {
  try {
    const payload = await getPayload({ config });
    const s: any = (await payload.find({ collection: "siteSettings", limit: 1, depth: 0, select: { stats: true, trust: true } as any })).docs[0] || {};
    return { stats: s.stats || {}, trust: s.trust || {} };
  } catch {
    return { stats: {}, trust: {} };
  }
}

export default async function B2BPartnersPage() {
  const { stats, trust } = await getStats();
  const founded = trust.foundedYear || 2019;
  const regNo = trust.registrationNo || "215948/75/076";
  const STATS = [
    { value: stats.clients || "5,000+", label: "Travelers hosted" },
    { value: stats.treks || "50+", label: "Ready itineraries" },
    { value: `Since ${founded}`, label: "Licensed in Nepal" },
    { value: stats.rating || "4.9/5", label: "Average traveler rating" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}${PATH}#webpage`,
        url: `${SITE}${PATH}`,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#organization` },
        breadcrumb: { "@id": `${SITE}${PATH}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE}${PATH}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "B2B Partners", item: `${SITE}${PATH}` },
        ],
      },
      {
        "@type": "Service",
        name: "B2B ground handling for treks and expeditions in Nepal",
        serviceType: "Tour operator ground handling",
        provider: { "@type": "TravelAgency", name: "Nature Heaven Treks & Expedition", url: SITE, telephone: "+977-9851218358", email: "info@natureheaventreks.com" },
        areaServed: [{ "@type": "Country", name: "Nepal" }, { "@type": "Country", name: "Bhutan" }, { "@type": "AdministrativeArea", name: "Tibet" }],
        audience: { "@type": "BusinessAudience", audienceType: "Tour operators, travel agencies, DMCs and online travel platforms" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  const H2 = "font-serif text-3xl md:text-4xl font-black text-[#1a2e1f] leading-tight";
  const KICKER = "text-xs font-bold uppercase tracking-[0.2em] text-[#2E7D32]";

  return (
    <div className="bg-[#fcfbfa] text-[#3D3D3D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#1a2e1f] text-white">
        <Image src={IMG.hero} alt="Trekker on a Himalayan ridge on a Nature Heaven Annapurna expedition" fill priority sizes="100vw" className="object-cover -z-10 opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1a2e1f] via-[#1a2e1f]/85 to-[#1a2e1f]/30" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 md:pt-36 pb-16 md:pb-24">
          <nav aria-label="Breadcrumb" className="text-sm text-white/70 mb-6">
            <Link prefetch={false} href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <span className="text-white">B2B Partners</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5A623]">B2B partnership program</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mt-3 max-w-3xl">
            Your licensed ground handler for treks &amp; expeditions in Nepal
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
            Tour operators, travel agencies and DMCs partner with Nature Heaven Treks &amp; Expedition for private treks,
            peak climbing and Himalayan expeditions, operated by our own Kathmandu team at confidential net rates.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#partner-form" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#a87418] hover:bg-[#8f6213] px-7 py-4 text-lg font-black text-white shadow-lg transition">
              <IconHandshake className="h-6 w-6" /> Become a partner
            </a>
            <a href="https://wa.me/9779851218358?text=Hello%2C%20I%27d%20like%20to%20discuss%20a%20B2B%20partnership." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/70 hover:bg-white hover:text-[#1a2e1f] px-7 py-4 text-lg font-bold text-white transition">
              WhatsApp our partnerships team
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/90">
            {[`Government licensed · Reg. No. ${regNo}`, "TAAN member", "Nepal Tourism Board", `Operating since ${founded}`, "UK branch office in London"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-[#F5A623]" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STATS INFOGRAPHIC */}
      <section aria-label="Nature Heaven in numbers" className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <dl className="grid grid-cols-2 lg:grid-cols-4 rounded-3xl bg-white border border-[#E5E5E5] shadow-xl overflow-hidden">
          {STATS.map((s, i) => (
            <div key={s.label} className={`p-6 md:p-8 text-center ${i % 2 ? "border-l border-[#EFEFEF]" : ""} ${i > 1 ? "border-t lg:border-t-0 border-[#EFEFEF]" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-serif text-3xl md:text-4xl font-black text-[#1a2e1f] tabular-nums">{s.value}</dd>
              <dd className="mt-1 text-sm font-semibold text-[#6B6B6B]">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* WHO WE WORK WITH */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        <div className="max-w-2xl">
          <p className={KICKER}>Who we work with</p>
          <h2 className={`${H2} mt-3`}>A Nepal operating partner for every kind of travel business</h2>
          <p className="mt-4 text-lg leading-relaxed">
            Whether you sell one Everest Base Camp trek a year or run regular Himalayan departures, you work directly with
            the local company that guides your clients, not a reseller.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AUDIENCES.map(({ icon: I, title, text }) => (
            <article key={title} className="rounded-2xl bg-white border border-[#E5E5E5] p-6 hover:border-[#2E7D32]/40 hover:shadow-md transition">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E7D32]/10 text-[#2E7D32]">
                <I className="h-8 w-8" />
              </span>
              <h3 className="mt-4 text-lg font-black text-[#1a2e1f]">{title}</h3>
              <p className="mt-2 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#1a2e1f] text-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5A623]">Partner benefits</p>
            <h2 className="font-serif text-3xl md:text-4xl font-black leading-tight mt-3">What you get as a Nature Heaven partner</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10" style={{ ["--icon-tint" as any]: "rgba(245,166,35,.22)" }}>
            {BENEFITS.map(({ icon: I, title, text }) => (
              <div key={title}>
                <I className="h-10 w-10 text-[#F5A623]" />
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-white/80 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: process infographic */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className={KICKER}>How it works</p>
          <h2 className={`${H2} mt-3`}>From first inquiry to first departure in four steps</h2>
        </div>
        <ol className="relative mt-14 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          {/* connector line (desktop) */}
          <svg aria-hidden="true" className="hidden md:block absolute left-[12.5%] right-[12.5%] top-8 h-2 w-[75%]" viewBox="0 0 100 2" preserveAspectRatio="none">
            <line x1="0" y1="1" x2="100" y2="1" stroke="#2E7D32" strokeOpacity=".35" strokeWidth="2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          </svg>
          {STEPS.map(({ icon: I, title, text }, i) => (
            <li key={title} className="relative flex md:flex-col items-start md:items-center gap-5 md:gap-0 md:text-center">
              <span className="relative z-10 inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white border-2 border-[#2E7D32] text-[#2E7D32] shadow-sm">
                <I className="h-8 w-8" />
                <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-[#a87418] text-white text-sm font-black flex items-center justify-center" aria-hidden="true">{i + 1}</span>
              </span>
              <div className="md:mt-5">
                <h3 className="text-lg font-black text-[#1a2e1f]"><span className="sr-only">Step {i + 1}: </span>{title}</h3>
                <p className="mt-1.5 leading-relaxed">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* PRODUCTS */}
      <section className="bg-[#F3F1EC] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className={KICKER}>What you can sell</p>
            <h2 className={`${H2} mt-3`}>Treks, peaks, expeditions and tours across the Himalaya</h2>
            <p className="mt-4 text-lg leading-relaxed">
              Every program below can be booked at partner rates, as a private trip on your clients&apos; dates, with
              itineraries and photos you can use in your own sales material.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRODUCTS.map((p) => (
              <article key={p.title} className="group rounded-3xl overflow-hidden bg-white border border-[#E5E5E5] flex flex-col sm:flex-row">
                <div className="relative sm:w-2/5 aspect-[16/10] sm:aspect-auto shrink-0">
                  <Image src={p.img} alt={p.title} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-6 flex flex-col">
                  <h3 className="text-xl font-black text-[#1a2e1f]">{p.title}</h3>
                  <p className="mt-2 leading-relaxed grow">{p.text}</p>
                  <Link prefetch={false} href={p.href} className="mt-4 inline-flex items-center gap-1.5 font-bold text-[#2E7D32] hover:underline underline-offset-4">
                    {p.cta} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY A LOCAL OPERATOR (long-form, SEO) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
          <Image src={IMG.team} alt="A Nature Heaven guide team with trekkers at an Himalayan base camp" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div>
          <p className={KICKER}>Why a local operator</p>
          <h2 className={`${H2} mt-3`}>Work directly with the team that guides your clients</h2>
          <div className="mt-5 flex flex-col gap-4 text-lg leading-relaxed">
            <p>
              Many Nepal trips sold abroad pass through several resellers before they reach the people who actually run
              them. As a Kathmandu-based, government-licensed trekking company, we plan, permit and operate every trip
              ourselves, so your clients get consistent standards and you get one accountable partner.
            </p>
            <p>
              Our guides know the classic routes such as the{" "}
              <Link prefetch={false} href="/trips/everest-base-camp-trek" className="text-[#2E7D32] font-semibold underline underline-offset-4">Everest Base Camp trek</Link>{" "}
              and{" "}
              <Link prefetch={false} href="/trips/annapurna-circuit-trek" className="text-[#2E7D32] font-semibold underline underline-offset-4">Annapurna Circuit</Link>,
              as well as quieter restricted areas like the{" "}
              <Link prefetch={false} href="/trips/manaslu-circuit-trek" className="text-[#2E7D32] font-semibold underline underline-offset-4">Manaslu Circuit</Link>{" "}
              and{" "}
              <Link prefetch={false} href="/trips/tsum-valley-trek" className="text-[#2E7D32] font-semibold underline underline-offset-4">Tsum Valley</Link>,
              where a licensed operator and special permits are mandatory.
            </p>
          </div>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Local Kathmandu team, no middle-man resellers", "Planned acclimatization on every itinerary", "Clear inclusions on every quote", "One contact from quote to return"].map((t) => (
              <li key={t} className="flex items-start gap-2.5 font-semibold text-[#1a2e1f]">
                <IconCheck className="h-6 w-6 shrink-0 text-[#2E7D32]" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PAYMENTS & OFFICES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: IconWallet, title: "Simple payments", text: "Invoices in USD for every booking, paid by international SWIFT bank transfer to our company account in Nepal." },
            { icon: IconBuilding, title: "Offices in Kathmandu & London", text: "Head office in Thamel, Kathmandu, plus a UK branch office for partners in Europe." },
            { icon: IconSupport, title: "Always reachable", text: "Email info@natureheaventreks.com or WhatsApp +977-9851218358 for urgent operational questions." },
          ].map(({ icon: I, title, text }) => (
            <div key={title} className="rounded-2xl border border-[#E5E5E5] bg-white p-6 flex gap-4">
              <I className="h-9 w-9 shrink-0 text-[#2E7D32]" />
              <div>
                <h3 className="font-black text-[#1a2e1f]">{title}</h3>
                <p className="mt-1.5 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section id="partner-form" className="scroll-mt-24 bg-white border-y border-[#E5E5E5] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
          <div>
            <p className={KICKER}>Partner inquiry</p>
            <h2 className={`${H2} mt-3`}>Tell us about your business</h2>
            <p className="mt-3 text-lg leading-relaxed mb-10">
              Fields marked <span className="text-red-600 font-bold">*</span> are required. We reply within 24 hours with
              net rates, partnership terms and sample itineraries.
            </p>
            <B2BPartnerForm />
          </div>
          <aside className="lg:sticky lg:top-28 flex flex-col gap-5">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image src={IMG.trekker} alt="Trekker on the Khopra Danda trail with Himalayan peaks behind" fill sizes="(max-width: 1024px) 100vw, 360px" className="object-cover" />
            </div>
            <div className="rounded-2xl bg-[#1a2e1f] text-white p-6">
              <h3 className="font-serif text-xl font-black">Prefer to talk first?</h3>
              <p className="mt-2 text-white/80">Our partnerships team answers on WhatsApp and email.</p>
              <a href="https://wa.me/9779851218358" target="_blank" rel="noopener noreferrer" className="mt-4 block font-black text-[#F5A623] text-lg">+977-9851218358</a>
              <a href="mailto:info@natureheaventreks.com" className="mt-1 block font-semibold underline underline-offset-4">info@natureheaventreks.com</a>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        <div className="text-center">
          <p className={KICKER}>Partner FAQ</p>
          <h2 className={`${H2} mt-3`}>B2B partnership questions</h2>
        </div>
        <div className="mt-10 flex flex-col gap-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-[#E5E5E5] bg-white px-6 py-5 open:shadow-sm">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-black text-[#1a2e1f] text-lg">
                {f.q}
                <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-[#2E7D32] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-10 text-center text-lg">
          Ready to start?{" "}
          <a href="#partner-form" className="font-black text-[#2E7D32] underline underline-offset-4">Send your partner inquiry</a>
        </p>
      </section>
    </div>
  );
}
