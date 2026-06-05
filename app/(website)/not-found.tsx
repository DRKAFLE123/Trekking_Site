import type { Metadata } from "next";
import Link from "next/link";
import {
  FaArrowRight,
  FaCompass,
  FaMountain,
  FaMapMarkedAlt,
  FaWhatsapp,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "404 — Trail Not Found | Nature Heaven Trek & Expedition",
  description:
    "This route doesn't exist on our map. Head back to the trailhead, browse our private Himalayan treks, or talk to a guide.",
  robots: { index: false, follow: false },
};

const suggestedRoutes: Array<{ href: string; label: string; hint: string }> = [
  { href: "/trips", label: "Browse all treks", hint: "Everest, Annapurna, Manaslu & more" },
  { href: "/blogs", label: "Himalayan chronicles", hint: "Guides, training tips, season picks" },
  { href: "/about-us", label: "About Nature Heaven", hint: "The Sherpa crew behind the journey" },
  { href: "/contact-us", label: "Talk to an expert", hint: "We answer within 6–12 hours" },
];

export default function NotFound() {
  return (
    <section className="relative w-full bg-bgOffWhite overflow-hidden pt-28 md:pt-32 pb-24 md:pb-32 px-4 md:px-6">
      {/* Subtle topographic background */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full text-primary/[0.05] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1400 900"
      >
        <defs>
          <pattern id="topo-404" patternUnits="userSpaceOnUse" width="220" height="220">
            <path
              d="M0 110 Q55 70 110 110 T220 110 M0 170 Q55 130 110 170 T220 170 M0 50 Q55 10 110 50 T220 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo-404)" />
      </svg>

      {/* Faint mountain silhouette anchor at bottom */}
      <svg
        aria-hidden="true"
        className="absolute -bottom-1 left-0 right-0 w-full h-40 md:h-56 text-primary/10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0 200 L120 110 L240 170 L360 80 L520 160 L680 60 L840 140 L1000 90 L1160 170 L1320 100 L1440 160 L1440 220 L0 220 Z"
        />
      </svg>

      <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center gap-8 md:gap-10">
        {/* Kicker */}
        <div className="flex items-center gap-2.5 bg-white border border-secondary/25 text-primary font-bold text-[10px] md:text-xs tracking-[0.25em] uppercase px-4 py-1.5 rounded-full shadow-sm">
          <FaCompass className="text-secondary" />
          <span>Off the trail</span>
        </div>

        {/* 404 figure */}
        <div className="relative">
          <h1 className="font-serif font-black text-primary leading-none text-[120px] sm:text-[180px] md:text-[220px] tracking-tight">
            404
          </h1>
          <div className="mx-auto -mt-2 h-1 w-24 md:w-32 bg-secondary rounded-full" />
        </div>

        {/* Headline */}
        <div className="flex flex-col items-center gap-4 max-w-2xl">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-primary leading-tight">
            This route isn’t on our map.
          </h2>
          <p className="text-sm md:text-base text-charcoal/75 leading-relaxed font-light">
            You’ve wandered off the trail. The page you’re looking for has moved, been
            retired, or never existed. Don’t worry — our guides know the way back.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-bgOffWhite hover:text-secondary font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95"
          >
            <FaMountain className="text-secondary" />
            <span>Back to the trailhead</span>
          </Link>
          <Link
            href="/trips"
            className="inline-flex items-center justify-center gap-2 bg-transparent border border-primary/40 hover:border-secondary text-primary hover:text-secondary font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <FaMapMarkedAlt />
            <span>Explore all treks</span>
            <FaArrowRight className="text-[11px]" />
          </Link>
        </div>

        {/* Suggested routes */}
        <div className="w-full max-w-3xl mt-10 md:mt-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-primary/15" />
            <span className="text-[10px] md:text-xs font-bold text-primary/60 tracking-[0.25em] uppercase">
              Or try one of these
            </span>
            <div className="h-px flex-1 bg-primary/15" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {suggestedRoutes.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-center justify-between gap-4 bg-white border border-secondary/15 hover:border-secondary rounded-2xl px-5 py-4 text-left shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col">
                  <span className="font-serif font-black text-primary text-sm md:text-base group-hover:text-secondary transition">
                    {r.label}
                  </span>
                  <span className="text-[11px] md:text-xs text-charcoal/60 font-light mt-0.5">
                    {r.hint}
                  </span>
                </div>
                <span className="shrink-0 w-9 h-9 rounded-full border border-primary/15 group-hover:border-secondary group-hover:bg-secondary/10 flex items-center justify-center text-primary group-hover:text-secondary transition-all duration-300 group-hover:translate-x-0.5">
                  <FaArrowRight className="text-xs" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Lost? talk to a guide */}
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-3 text-xs md:text-sm text-charcoal/70">
          <span>Still lost?</span>
          <a
            href="https://wa.me/9779851218358"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-bold border-b-2 border-secondary hover:text-secondary transition pb-0.5"
          >
            <FaWhatsapp className="text-[#25D366]" />
            <span>Message a guide on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
