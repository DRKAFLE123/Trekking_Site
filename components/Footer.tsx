"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaLock
} from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/site-settings");
        const data = await res.json();
        setSiteSettings(data);
      } catch (err) {
        console.error("Failed to fetch site settings", err);
      }
    }
    fetchData();
  }, []);

  const { siteName, contactInfo, socialLinks, affiliations, emergencyNumbers } = siteSettings || {};

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setStatusMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusType("success");
        setStatusMessage("Thank you! You have successfully subscribed.");
        setName("");
        setEmail("");
      } else {
        throw new Error(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err: any) {
      setStatusType("error");
      setStatusMessage(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Safe helper to extract emergency numbers from site settings or fallback
  const getSOSNumbers = () => {
    if (emergencyNumbers && emergencyNumbers.length > 0) {
      return emergencyNumbers.map((item: any) => {
        return typeof item === "string" ? item : item?.number;
      }).filter(Boolean);
    }
    return ["+977-9851218358"];
  };

  const sosNumbers = getSOSNumbers();

  const getBlendColor = () => {
    if (pathname === "/") return "#fcfbfa";
    if (pathname?.startsWith("/trips/")) return "#ffffff";
    return "#f8f5f0";
  };
  const blendColor = getBlendColor();

  return (
    <div className="w-full relative z-10 font-sans">
      {/* 1. Main Mountain Section */}
      <section
        className="relative bg-no-repeat bg-cover bg-bottom pt-[180px] md:pt-[380px] lg:pt-[600px] pb-8 md:pb-12 lg:pb-16 text-white overflow-hidden"
        style={{ backgroundImage: "url('/footer-new-bg.webp')" }}
      >
        {/* Top smooth blend gradient from page background to transparent */}
        <div
          className="absolute top-0 left-0 w-full h-36 md:h-48 lg:h-64 pointer-events-none z-10"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${blendColor} 0%, transparent 100%)`,
          }}
        ></div>

        {/* Dark subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none z-0"></div>



        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Top Row: Logo, Newsletter form, Emergency SOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-6 border-b border-white/10 items-start">
            
            {/* Left: Logo & Bio */}
            <div className="flex flex-col gap-4">
              <Link href="/" className="group flex items-center gap-2.5">
                <div className="relative w-12 h-12 overflow-hidden bg-white/10 rounded-xl p-1 border border-white/20 shadow-inner transition group-hover:scale-105 shrink-0">
                  <Image
                    src="/officiallogo.jpeg"
                    alt="Nature Heaven Logo"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-black text-secondary-light tracking-wide group-hover:text-white transition duration-300 leading-none">
                    {siteName ? siteName.split(" & ")[0].toUpperCase() : "NATURE HEAVEN"}
                  </span>
                  <span className="text-[9px] tracking-[0.25em] text-secondary/70 group-hover:text-white uppercase font-sans font-bold mt-1">
                    Trek & Expedition
                  </span>
                </div>
              </Link>
              <p className="text-xs text-white/85 leading-relaxed max-w-sm">
                {siteName || "Nature Heaven Trekking & Expedition"} is a government-licensed, premier adventure operator in Nepal. We lead customized private trekking, peak climbing, and cultural tours across the Himalayas.
              </p>
            </div>

            {/* Center: Newsletter Subscription */}
            <div className="flex flex-col gap-4 w-full">
              <h3 className="text-sm uppercase font-bold tracking-wider text-secondary pt-2.5">
                Subscribe our Newsletter
              </h3>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-2.5 mt-1 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border border-white/20 rounded px-3 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none focus:border-secondary sm:w-[140px] grow transition"
                />
                <div className="flex items-center bg-white/5 border border-white/20 rounded px-3 py-2.5 focus-within:border-secondary grow transition">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-transparent text-xs text-white placeholder-white/50 focus:outline-none grow min-w-0"
                  />
                  <button
                    type="submit"
                    className="text-white hover:text-secondary hover:scale-105 active:scale-95 transition ml-2"
                    aria-label="Subscribe"
                    disabled={submitting}
                  >
                    <span className="border border-white/30 hover:border-secondary rounded-full p-1.5 flex items-center justify-center">
                      <svg
                        className="h-3 w-3 fill-current text-white hover:text-secondary"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 12h14M12 5l7 7-7 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </form>
              {statusMessage && (
                <p className={`text-xs ${statusType === "success" ? "text-green-400" : "text-red-400"}`}>
                  {statusMessage}
                </p>
              )}
              <p className="text-[10px] text-white/50 italic leading-relaxed max-w-sm">
                This site is protected by reCAPTCHA and the Google{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-secondary"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-secondary"
                >
                  Terms of Service
                </a>{" "}
                apply.
              </p>
            </div>

            {/* Right: Emergency SOS & Address / Office Contact */}
            <div className="flex flex-col gap-3 text-white">
              {/* Emergency SOS */}
              <div>
                <h4 className="text-sm uppercase font-bold tracking-wider text-secondary pt-2.5 flex items-center gap-1.5">
                  <FaPhoneAlt className="h-3.5 w-3.5 text-secondary/80" />
                  <span>Emergency SOS (24/7):</span>
                </h4>
                <div className="mt-1 flex flex-col gap-1 text-xs text-white/90 pl-5">
                  {sosNumbers.map((num: string, idx: number) => (
                    <p key={idx}>Phone: {num}</p>
                  ))}
                  <a
                    href={`https://wa.me/${contactInfo?.whatsapp?.replace(/[^0-9]/g, "") || "9779851218358"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-green-400 transition mt-1"
                  >
                    <FaWhatsapp className="text-green-500 h-4 w-4" />
                    <span>WhatsApp: {contactInfo?.whatsapp || "+977-9851218358"}</span>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div>
                <h4 className="text-sm uppercase font-bold tracking-wider text-secondary flex items-center gap-1.5">
                  <FaEnvelope className="h-3.5 w-3.5 text-secondary/80" />
                  <span>Email:</span>
                </h4>
                <div className="mt-1 flex flex-col gap-1 text-xs text-white/90 pl-5">
                  <a
                    href="mailto:natureheaventrek@gmail.com"
                    className="hover:underline hover:text-secondary transition break-all"
                  >
                    natureheaventrek@gmail.com
                  </a>
                  <a
                    href={`mailto:${contactInfo?.email || "info@natureheaventrek.com"}`}
                    className="hover:underline hover:text-secondary transition break-all"
                  >
                    {contactInfo?.email || "info@natureheaventrek.com"}
                  </a>
                </div>
              </div>

              {/* Address List */}
              <div className="space-y-3">
                {/* Nepal Head Office */}
                <div>
                  <h4 className="text-sm uppercase font-bold tracking-wider text-secondary flex items-center gap-1.5">
                    <FaMapMarkerAlt className="h-3.5 w-3.5 text-secondary/80" />
                    <span>Head Office - Nepal:</span>
                  </h4>
                  <p className="text-xs text-white/90 pl-5 leading-relaxed">
                    {contactInfo?.address || "Pakjonal Marga -16, Thamel, Kathmandu, Nepal"}
                  </p>
                </div>

                {/* UK Branch Office */}
                <div>
                  <h4 className="text-sm uppercase font-bold tracking-wider text-secondary flex items-center gap-1.5">
                    <FaMapMarkerAlt className="h-3.5 w-3.5 text-secondary/80" />
                    <span>Branch Office - UK:</span>
                  </h4>
                  <p className="text-xs text-white/90 pl-5 leading-relaxed">
                    London, United Kingdom
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Navigation Links Grid */}
          <div className="relative pt-6 pb-2">

            {/* Links Columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10 md:pr-48 lg:pr-64">
              
              {/* TOP 5 TREKS */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-secondary border-b border-secondary/20 pb-1.5">
                  Top 5 Treks
                </h4>
                <ul className="flex flex-col gap-2.5 text-xs text-white/80">
                  <li>
                    <Link href="/trips/everest-base-camp-trek" className="hover:text-secondary transition duration-300">
                      Everest Base Camp Trek
                    </Link>
                  </li>
                  <li>
                    <Link href="/trips/annapurna-circuit-trek" className="hover:text-secondary transition duration-300">
                      Annapurna Circuit Trek
                    </Link>
                  </li>
                  <li>
                    <Link href="/trips/ebc-via-gokyo-lakes" className="hover:text-secondary transition duration-300">
                      EBC via Gokyo Lakes
                    </Link>
                  </li>
                  <li>
                    <Link href="/trips/annapurna-base-camp-trek" className="hover:text-secondary transition duration-300">
                      Annapurna Base Camp Trek
                    </Link>
                  </li>
                  <li>
                    <Link href="/trips/manaslu-circuit-trek" className="hover:text-secondary transition duration-300">
                      Manaslu Circuit Trek
                    </Link>
                  </li>
                </ul>
              </div>

              {/* POPULAR REGIONS */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-secondary border-b border-secondary/20 pb-1.5">
                  Popular Regions
                </h4>
                <ul className="flex flex-col gap-2.5 text-xs text-white/80">
                  <li>
                    <Link href="/regions/everest" className="hover:text-secondary transition duration-300">
                      Everest Region
                    </Link>
                  </li>
                  <li>
                    <Link href="/regions/annapurna" className="hover:text-secondary transition duration-300">
                      Annapurna Region
                    </Link>
                  </li>
                  <li>
                    <Link href="/regions/manaslu" className="hover:text-secondary transition duration-300">
                      Manaslu Region
                    </Link>
                  </li>
                  <li>
                    <Link href="/regions/langtang" className="hover:text-secondary transition duration-300">
                      Langtang Region
                    </Link>
                  </li>
                  <li>
                    <Link href="/regions/mustang" className="hover:text-secondary transition duration-300">
                      Mustang Region
                    </Link>
                  </li>
                </ul>
              </div>

              {/* TRAVEL GUIDE */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-secondary border-b border-secondary/20 pb-1.5">
                  Travel Guide
                </h4>
                <ul className="flex flex-col gap-2.5 text-xs text-white/80">
                  <li>
                    <Link href="/regions/everest" className="hover:text-secondary transition duration-300">
                      Everest Travel Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/regions/annapurna" className="hover:text-secondary transition duration-300">
                      Annapurna Travel Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/regions/manaslu" className="hover:text-secondary transition duration-300">
                      Manaslu Travel Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/regions/langtang" className="hover:text-secondary transition duration-300">
                      Langtang Travel Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/regions/mustang" className="hover:text-secondary transition duration-300">
                      Mustang Travel Guide
                    </Link>
                  </li>
                </ul>
              </div>

              {/* COMPANY */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-secondary border-b border-secondary/20 pb-1.5">
                  Company
                </h4>
                <ul className="flex flex-col gap-2.5 text-xs text-white/80">
                  <li>
                    <Link href="/about-us" className="hover:text-secondary transition duration-300">
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link href="/our-team" className="hover:text-secondary transition duration-300">
                      Our Team
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact-us" className="hover:text-secondary transition duration-300">
                      Contact us
                    </Link>
                  </li>
                  <li>
                    <Link href="/csr" className="hover:text-secondary transition duration-300">
                      Responsible Tourism
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us#licensing" className="hover:text-secondary transition duration-300">
                      Registrations & Affiliations
                    </Link>
                  </li>
                </ul>
              </div>

              {/* USEFUL LINKS */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-secondary border-b border-secondary/20 pb-1.5">
                  Useful Links
                </h4>
                <ul className="flex flex-col gap-2.5 text-xs text-white/80">
                  <li>
                    <Link href="/privacy-policy" className="hover:text-secondary transition duration-300">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions" className="hover:text-secondary transition duration-300">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact-us" className="hover:text-secondary transition duration-300">
                      B2B Partner
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact-us" className="hover:text-secondary transition duration-300">
                      Make a Payment
                    </Link>
                  </li>
                  <li>
                    <Link href="/why-us" className="hover:text-secondary transition duration-300">
                      Gallery
                    </Link>
                  </li>
                </ul>
              </div>

          </div>

        </div>
      </div>

      {/* SVG Blend: Snowy Peaks Layer (Top, White, stretched 100% width without hiker) */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-24 md:h-32 lg:h-40 pointer-events-none select-none z-20 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 880 192"
          className="absolute bottom-0 left-0 w-full h-full"
          preserveAspectRatio="none"
          style={{ fill: "#ffffff" }}
        >
          <path d="m889.702 184.921c16.606-14.606 53.407-46.876 56.43-48.695 3.914-2.353 3.525-4.312 7.437-3.925 3.915.396 6.266 3.14 9.789 2.75 3.527-.392 1.96-2.75 7.047-4.706 5.089-1.963 3.131 2.352 9.005.782 1.654-.443 3.343-.744 5.048-.899-.57-.488-.924-.868-.924-.868 0-.281-.137-1.474-.838-2.805-.701-1.336-1.261-3.368-1.471-5.684-.209-2.314-.14-4.35-.277-6.734-.145-2.384.977-5.4 1.888-10.593.91-5.1914 1.121-4.8379 2.312-6.9432 1.189-2.1044.978-.492.698-1.8962-.281-1.4013.492-1.962 1.052-2.8742.559-.9113.42-3.3662.137-5.0532-.28-1.6821.496-2.0317.631-2.8036.141-.7727-.209-.981.213-3.5085.419-2.5237.629-7.5768.629-9.8197 0-2.2448-.842-2.6651-.842-2.6651l.071 8.9075c-.071.7718-1.12 1.6134-1.12 1.6134s-3.85 0-4.552-.1395c-.099-.021-.194-.0557-.284-.1032-.492-.2693-.695-.8797-.695-.8797l-.21-11.9231c.14-.8435.911-1.0556.911-1.0556l.278-1.4729c.757-.7164 2.159-.6381 3.293-.4165l.768-1.8961s-.069-.8425-.28-1.8961c-.21-1.0508.28-.6314-1.049-1.7529-1.332-1.1214-3.011-3.0147-3.57-5.9634-.56-2.946-.981-3.2268-.981-3.2268-.561 1.1921-.843 5.12-.768 5.9644.067.8416.559 1.1215.559 1.1215-.072 2.1053-1.543 0-1.543 0-.279-.7012.421-3.9986.421-5.7524 0-1.7548.072-3.4369.212-6.2443.138-2.8036.351-3.435 1.119-5.3302.77-1.8942.701.982 1.191-1.2647.248-1.1319.941-2.6756 1.613-4.0167.048-1.8598-.015-3.7559.068-4.5392.14-1.3326 1.049-1.4739 1.329-1.7548.283-.2799 1.121-.2799 1.472-1.2609.35-.9829-.351-1.1233-.629-3.7903-.28-2.6651 1.82-3.2248 2.589-4.5602.77-1.3307 2.8-1.5427 4.48-1.6134 1.682-.0669 2.872.5636 3.783.9839.909.4231 1.258-.2818 2.379-.7012 1.119-.4222 1.051-.6304 2.589 0 1.54.6295 2.73 1.1243 2.73 1.1243s-.07 1.1902.28 0c.35-1.194 1.33-.4231 1.89-.9858.56-.5607.28-.8406-.63-2.5246-.91-1.6841.28-2.5266 0-3.92791-.28-1.40513-.28-4.42269.42-5.68263.7-1.26281 2.17-2.31451 3.08-2.454928.91-.139463 3.43-.4928958 4.55-.56167193 1.13-.06877617 2.52.84250793 3.57 1.82447993 1.06.98388 1.2 1.96394 1.48 3.15702.28 1.19116-.21 4.91081-.21 4.91081.91 2.38613-1.05 4.27753-1.05 4.27753.42 2.0365-1.62 3.86-1.62 3.86.67 2.1569 2.01 3.3433 3 3.2956.99-.0488 1.64.9934 2.68 1.9343s1.63.9409 2.62 1.834c.99.8912 1.24 2.3785 2.18 3.6681.94 1.2905 1.09 1.2905 2.57 2.0824 1.48.7957 1.14 2.9755 2.18 3.7177 1.04.7451 1.63 0 2.52.2971.89.298.89 1.9343 1.68 1.9343s1.39.895 1.94 1.1425c.54.2483 1.58.1499 2.72.297 1.13.1481 2.02 1.6363 2.42 1.7834.4.149 3.27-.3964 4.06-.3438.79.0477 1.38 1.2866 1.73 1.4357.35.1471 2.57.0983 3.17 0 .59-.0994.69-.3965 1.33-1.5857.65-1.1902 2.73-1.5379 3.07-1.7834.35-.2493.69-.5474.25-.8454-.45-.298-.25-1.4863-.25-1.4863s3.37.148 3.76.148c.4 0 .15.6439-.34.9409-.5.2961-.15 1.6363-.15 1.6363s-2.43-.2961-.05.2006c2.37.4948 1.68 5.6005 1.68 5.6005 1.63.896-2.13 1.9353-2.13 1.9353l.29 71.7824c4.78-.483 1.84 13.472 1.84 13.472 9.47 17.834 17.8 28.367 24.99 31.594 7.41 3.327 21.18 3.088 31.81 6.172 7.96 2.31 37.61 14.019 77.82 16.235 8.34.461 12.85.917 13.52 1.372 14.12.342 45.29.902 93.49 1.679v3.821h-1302v-3.821c14.891-3.418 22.8346-5.237 23.8287-5.459 1.4907-.334 21.137 3.171 24.616 1.836 3.4799-1.335 6.835-.947 9.3199-1.836 2.4858-.891 6.712-.835 11.5569-2.338 3.296-1.022 13.6081-5.591 16.5914-5.579 2.9824.014 15.9061 1.546 21.1261 2.435 5.218.891 9.692 1.447 39.268 6.008 29.576 4.565 46.974 2.226 63.129 1.671 16.156-.557 22.866-1.446 28.086-1.224 5.219.223 23.362 2.226 37.778 1.336 14.415-.891 15.658.333 29.079 1.446s75.804 1.002 119.548-1.891c43.742-2.895 8.239-2.344 66.856.667 59.09 3.036 118.989 3.668 150.802 1.333 31.813-2.339 32.434-4.153 39.145-3.598 6.71.557 43.184 4.824 94.134 2.376 50.951-2.448 33.242-2.331 43.433-.105 10.19 2.226 15.409-.11 23.114 0 7.705.113 17.149 2.974 28.334 2.082 4.031-.32 11.558-1.259 19.957-2.418zm97.407-124.4488-1.025 2.2066c.603.1595 1.025.3191 1.025.3191-.142-.8387 1.539-4.63 1.539-5.2614 0-.6305-.769-.0688-.769-.0688zm13.051 65.1628s.26 0 .71-.003l.58-38.6809c-.36.8186-.63 1.4376-.77 1.6812-.65 1.1787-1.955 4.1848-2.61 6.016-.652 1.8311 0 2.7463-.259 4.0549-.262 1.3058-1.047 1.5678-1.306 3.9208-.261 2.352-3.263 5.493-2.74 6.8.52 1.307-1.435 4.706-1.176 6.927.262 2.225-.391 5.103.132 6.801.521 1.7 0 4.576 0 4.576-.118.521-.251.984-.398 1.4.957-.635 1.91-1.821 2.355-4.276.784-4.315 5.482.784 5.482.784zm11.1-.783c.1-.115.19-.244.25-.392.39-.914-.91-5.884-.91-7.846 0-1.959 1.17-2.876 2.22-4.052 1.04-1.179.13-2.355.39-3.793.26-1.437.65-2.745.91-5.489.27-2.748 2.61-9.5468 4.44-11.7687 1.83-2.2257 2.09-1.7003.26-2.2257-1.83-.5215-3.52-2.2209-5.35-4.4417-1.83-2.2257-5.22-6.5405-6.79-6.8013-.88-.1471-2.47 2.8781-3.81 5.7476l-1.13 41.8328c1.94-.03 5.19-.114 7.03-.38.48-.069 1.36-.209 2.49-.391zm21.26-35.6963c.26 2.092-.91 4.1849-1.43 5.8842-.53 1.7003-1.44 2.0929-2.61 6.0151-1.18 3.921-1.31 5.884-2.35 8.106-1.05 2.222-3.39 3.27-2.61 3.531.78.259.13 3.138.13 3.138s1.17 1.832 1.95 2.353c.79.524 2.49.787 4.96.654 2.48-.13 3.79.394 2.62 2.484-.16.284-.46.555-.86.814 3.39.224 3.18 1.71 9.73-1.208 3.57-1.588 9.97-2.577 15.4-3.16l-1.53-70.8045c-.7-.0497-1.21-.5607-1.21-.5607l-.26 1.6955-.66-1.1749s-.65 1.5694-2.47 1.8302c-1.83.2627-2.09-.7852-2.74-1.1749-.66-.3945-1.7.3897-3.01.7823-1.31.3916-1.95-.2627-3.13-1.0431-1.18-.7881-3.13.3878-3.78.3878-.66 0-1.96-.3878-2.48-.7823-.53-.3936-3.53-.7833-4.31-.6543-.78.1299-.78-.5206-1.43-1.4348-.66-.917-2.09-.7871-3.01-1.0498-.91-.2617-2.48-1.045-4.3-2.6125-1.83-1.5704-5.49-4.4475-5.49-4.4475.27.5244-1.82 2.0919-1.3 3.1398.52 1.045-.65 3.3987-.65 3.3987s.65.1299 1.04 1.0459c.39.9151-1.04 5.3588-1.04 5.3588h2.48c2.48 0 .91 1.4377 1.69 2.2257.79.7814 1.18.9142 1.31 2.8762.13 1.9611.52 4.1848.39 6.145-.13 1.9601.13 2.3536.13 2.3536s-.52 0-1.69.3917c-1.18.3916-.79 1.4395-.79 1.4395s-1.69-1.0479.26.9151c1.96 1.9601 9.01 14.252 11.23 16.2121 0 0 1.56 4.8391 1.82 6.9301zm-48.093-59.5086c.036-.0735.067-.1337.091-.1786.35-.703 1.401-.5617 1.539-2.2476.141-1.6812-1.47-.0688-1.47-.0688-.514.7565-.404 1.7137-.16 2.495z" />
        </svg>
      </div>

      {/* Climber Silhouette (Positioned 10% from the right edge, aspect ratio preserved) */}
      <img
        src="/hiker-silhouette.svg"
        alt="Hiker Silhouette"
        className="absolute bottom-0 right-[10%] h-24 md:h-32 lg:h-40 w-auto object-contain object-bottom pointer-events-none select-none z-30"
      />
      </section>

    {/* 2. Lower Payments, Associations, Social Media Band */}
    <section className="bg-white py-8 relative z-10 text-gray-700">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-between text-center md:text-left">
          
          {/* We Accept Column */}
          <div className="flex flex-col gap-2.5 items-center md:items-start">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              We Accept
            </span>
            <div className="flex flex-wrap items-center gap-3.5 justify-center md:justify-start">
              
              {/* Secures Badge */}
              <div className="border border-green-200 bg-green-50 rounded px-2 py-1 flex items-center gap-1 text-[8.5px] text-green-700 font-bold font-sans">
                <FaLock className="h-2 w-2 text-green-600" />
                <span>SECURED BY SECTIGO</span>
              </div>

              {/* Visa Badge */}
              <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5 flex items-center justify-center hover:bg-gray-50 transition h-[26px]">
                <svg className="h-3 w-10 text-[#1a1f71] fill-current" viewBox="0 0 100 32">
                  <path d="M40.7 2.3l-5.6 24.3h-4.8l3-12.8c-.8-1.5-2.2-2.3-4.2-2.3-3.6 0-7 3.5-7 7.7 0 3.7 2.5 5.7 5.7 5.7 1.8 0 3.5-1 4.5-2.3l-.3 1.8h4.4l5.6-24.4h-6.3zm19.8 11.2c-.2-3.1-2.9-4.8-6.1-4.8-5.3 0-8.9 3.5-8.9 8.2 0 4.8 3.5 8 8.6 8 3.5 0 6-1.5 7-4.1l-4.1-1.7c-.5 1-1.4 1.8-2.8 1.8-2 0-3.6-1.4-3.6-3.7h10.1c.1-.8.2-1.8.2-2.7 border-box;z-index: 1; overflow: visible;--color: #fff;fill: currentColor;m40.7 2.3zm-5.8 4.3c1.5 0 2.5.9 2.5 2.5 0 1.5-1 2.5-2.5 2.5s-2.5-1-2.5-2.5c0-1.6 1-2.5 2.5-2.5zM15 2.3L2 26.6h5l2.7-7.2h8.6l1 7.2h5L15 2.3zm-4.3 13.6L14 7l3.3 8.9h-6.6zm70.6-13.6h-5c-1.5 0-2.5 1-2.8 2.5l-8.6 21.8h5l2-5h7.6l1.3 5h4.6L81.3 2.3zm-6.2 15.6l2.3-7.2 2.3 7.2h-4.6z" />
                </svg>
              </div>

              {/* Mastercard Badge */}
              <div className="bg-white border border-gray-200 rounded px-2.5 py-1 flex items-center justify-center hover:bg-gray-50 transition h-[26px]">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    <div className="w-3 h-3 rounded-full bg-[#EB001B]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#F79E1B] opacity-90"></div>
                  </div>
                  <span className="text-[8.5px] font-bold text-gray-800 font-sans tracking-tight">Mastercard</span>
                </div>
              </div>

              {/* UnionPay Badge */}
              <div className="bg-white border border-gray-200 rounded px-2 py-1.5 flex items-center justify-center hover:bg-gray-50 transition h-[26px] text-sky-700 font-bold font-sans text-[8px] italic tracking-tight">
                UnionPay
              </div>

              {/* AMEX Badge */}
              <div className="bg-[#007cc3] text-white text-[8px] font-black tracking-widest px-2 py-1.5 rounded font-sans h-[26px] flex items-center">
                AMEX
              </div>

            </div>
          </div>

          {/* We are associated with Column */}
          <div className="flex flex-col gap-2.5 items-center md:items-center">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              We are associated with
            </span>
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-center">
              {affiliations && affiliations.length > 0 ? (
                affiliations.map((aff: { url: string; name: string }, idx: number) => (
                  <a
                    key={idx}
                    href={aff.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gray-200 rounded px-2.5 py-1 bg-gray-50 text-[9.5px] font-bold text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition"
                  >
                    {aff.name}
                  </a>
                ))
              ) : (
                <>
                  <span className="border border-gray-200 rounded px-2.5 py-1 bg-gray-50 text-[9.5px] font-bold text-gray-600">TAAN</span>
                  <span className="border border-gray-200 rounded px-2.5 py-1 bg-gray-50 text-[9.5px] font-bold text-gray-600">NMA</span>
                  <span className="border border-gray-200 rounded px-2.5 py-1 bg-gray-50 text-[9.5px] font-bold text-gray-600">NTB</span>
                  <span className="border border-gray-200 rounded px-2.5 py-1 bg-gray-50 text-[9.5px] font-bold text-gray-600">KEEP</span>
                  <span className="border border-gray-200 rounded px-2.5 py-1 bg-gray-50 text-[9.5px] font-bold text-gray-600">IPPG</span>
                </>
              )}
            </div>
          </div>

          {/* Connect with us Column */}
          <div className="flex flex-col gap-2.5 items-center md:items-end">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              Connect with us
            </span>
            <div className="flex gap-2">
              <a
                href={socialLinks?.youtube || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition"
                aria-label="YouTube"
              >
                <FaYoutube className="h-4 w-4" />
              </a>
              <a
                href={socialLinks?.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href={socialLinks?.facebook || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition"
                aria-label="Facebook"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
              <a
                href={socialLinks?.tiktok || "https://tiktok.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-[#000000] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition"
                aria-label="TikTok"
              >
                <FaTiktok className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Deep Teal Copyright Bottom Bar */}
      <footer className="bg-[#10251c] py-5 text-[11px] text-white/50 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="text-secondary font-medium">{siteName || "Nature Heaven Trekking & Expedition"}</span>.
              All Rights Reserved.
            </p>
            <p className="text-[10px] text-white/30 mt-1">
              Government Registration No. 4893. Bonded & insured through Everest Insurance. Authorized by Ministry of Tourism, Government of Nepal.
            </p>
          </div>
          <div className="md:max-w-md text-[10px] leading-relaxed text-white/40">
            The copyright to all content on this website, including photographs, belongs to{" "}
            {siteName || "Nature Heaven Trekking & Expedition"} and cannot be reproduced without our permission.
          </div>
        </div>
      </footer>
    </div>
  );
}
