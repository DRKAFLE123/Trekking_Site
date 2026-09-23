"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes, FaWhatsapp, FaChevronDown, FaSearch, FaPaperPlane, FaBullhorn } from "react-icons/fa";
import type { NavData, MenuItem, Rep } from "./types";

// Interactive half of the header. All menu panels are always in the DOM and
// toggled with CSS classes — never conditionally rendered — so the links are
// server-rendered and crawlable. Hover opens on desktop, click/tap toggles
// everywhere, Escape and outside-click close.

const BRAND = "#1a3c2e";
const AMBER = "#c8922a";

const TZ_TO_COUNTRY: [RegExp, string][] = [
  [/^Asia\/Kathmandu/, "np"], [/^Europe\/(London|Dublin|Belfast)/, "gb"],
  [/^America\//, "us"], [/^Australia\//, "au"], [/^Asia\/(Kolkata|Calcutta)/, "in"],
  [/^Europe\//, "gb"], [/^Pacific\/Auckland/, "nz"],
];

const waHref = (n: string) =>
  `https://wa.me/${n.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello Nature Heaven Treks, I'd like to plan a trip.")}`;

function Flag({ code, className = "" }: { code: string; className?: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={20} height={15} alt="" aria-hidden="true"
      className={`inline-block rounded-[2px] shrink-0 ${className}`}
    />
  );
}

export default function HeaderClient({ data }: { data: NavData }) {
  const pathname = usePathname();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState<string | null>(null);      // desktop panel key
  const [region, setRegion] = useState(data.regions[0]?.slug || "");
  const [compact, setCompact] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [drawerSection, setDrawerSection] = useState<string | null>(null);
  const [repOpen, setRepOpen] = useState(false);
  const [rep, setRep] = useState<Rep>(data.reps.find((r) => r.isDefault) || data.reps[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  // ---- effects -------------------------------------------------------------
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(null); setDrawer(false); setRepOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) { setOpen(null); setRepOpen(false); }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(null); setRepOpen(false); setDrawer(false); setSearchOpen(false); }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, []);

  // Pick the representative nearest the visitor: remembered choice first, then
  // timezone, then the CMS default.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nh-rep");
      const bySaved = saved && data.reps.find((r) => r.code === saved);
      if (bySaved) { setRep(bySaved); return; }
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const guess = TZ_TO_COUNTRY.find(([re]) => re.test(tz))?.[1];
      const byTz = guess && data.reps.find((r) => r.code === guess);
      if (byTz) setRep(byTz);
    } catch {}
  }, [data.reps]);

  useEffect(() => { document.body.style.overflow = drawer || searchOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [drawer, searchOpen]);

  // ---- handlers ------------------------------------------------------------
  const enter = (key: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(key); setRepOpen(false); };
  const leave = () => { if (closeTimer.current) clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(null), 220); };
  const toggle = (key: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen((o) => (o === key ? null : key)); setRepOpen(false); };
  const chooseRep = (r: Rep) => { setRep(r); setRepOpen(false); try { localStorage.setItem("nh-rep", r.code); } catch {} };
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/trips?search=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false); setQ("");
  };

  const isActive = useCallback((m: MenuItem) => {
    switch (m.kind) {
      case "link": return m.href ? pathname === m.href || (m.href !== "/" && pathname.startsWith(m.href)) : false;
      case "treks": return /^\/(trips|regions|countries)/.test(pathname);
      case "travel-info": return /^\/(travel-info|faqs|visa-info|packing-list|travel-insurance)/.test(pathname);
      case "company": return /^\/(about-us|our-team|why-us|csr|gallery|video-gallery|legal-documents|terms-and-condition|privacy-policy|company)/.test(pathname);
      default: return false;
    }
  }, [pathname]);

  const activeRegion = data.regions.find((r) => r.slug === region) || data.regions[0];
  const barH = compact ? "h-[60px]" : "h-[72px]";

  // ---- panels ----------------------------------------------------------------
  const panelBase = "absolute top-full z-40 bg-white border border-black/[0.08] shadow-[0_18px_50px_rgba(20,35,26,0.14)] rounded-[5px] overflow-hidden";
  const show = (key: string) => (open === key ? "block" : "hidden");
  const linkCls = "flex items-center min-h-[40px] px-3 rounded-[5px] text-[14px] text-[#3b463f] hover:text-[#1a3c2e] hover:bg-[#f2f6f3] transition-colors";
  const eyebrow = "text-[11px] font-bold uppercase tracking-[0.14em] text-[#7c8a82] mb-2 px-3";

  function TreksPanel() {
    return (
      <div className={`${panelBase} ${show("treks")} left-1/2 -translate-x-1/2 w-[min(1180px,96vw)]`} role="region" aria-label="Trips menu">
        <div className="grid grid-cols-[250px_1fr]">
          <div className="bg-[#f6f8f6] border-r border-black/[0.06] py-5 px-3">
            <div className={eyebrow}>Destinations</div>
            <ul className="mb-4">
              {data.countries.map((c) => (
                <li key={c.slug}>
                  <Link href={`/countries/${c.slug}`} className={`${linkCls} justify-between font-semibold text-[#1a3c2e]`} onClick={() => setOpen(null)}>
                    <span className="flex items-center gap-2"><Flag code={c.slug === "nepal" ? "np" : c.slug === "tibet" ? "cn" : "bt"} />{c.name}</span>
                    {c.count > 3 && <span className="text-[12px] text-[#7c8a82] font-medium">{c.count} trips</span>}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={eyebrow}>Nepal by region</div>
            <ul className="max-h-[360px] overflow-y-auto">
              {data.regions.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/regions/${r.slug}`}
                    onMouseEnter={() => setRegion(r.slug)}
                    onFocus={() => setRegion(r.slug)}
                    onClick={() => setOpen(null)}
                    className={`${linkCls} justify-between ${region === r.slug ? "bg-white text-[#1a3c2e] font-semibold shadow-sm" : ""}`}
                  >
                    <span>{r.name}</span>
                    <span className="text-[12px] text-[#7c8a82]">{r.treks.length}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="py-5 px-6">
            {data.regions.map((r) => (
              <div key={r.slug} className={r.slug === activeRegion?.slug ? "block" : "hidden"}>
                <div className="flex items-baseline justify-between border-b border-black/[0.06] pb-2 mb-3 px-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: AMBER }}>{r.name}</span>
                  <Link href={`/regions/${r.slug}`} className="text-[13px] font-semibold hover:underline" style={{ color: BRAND }} onClick={() => setOpen(null)}>View all {r.name} →</Link>
                </div>
                <ul className="grid grid-cols-2 gap-x-4 max-h-[400px] overflow-y-auto">
                  {r.treks.map((t) => (
                    <li key={t.slug}><Link href={`/trips/${t.slug}`} className={linkCls} onClick={() => setOpen(null)}>{t.title}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-black/[0.06] px-3">
              <Link href="/trips" className="text-[13px] font-semibold hover:underline" style={{ color: BRAND }} onClick={() => setOpen(null)}>Browse all trips →</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function TravelInfoPanel() {
    return (
      <div className={`${panelBase} ${show("travel-info")} left-0 w-[820px] max-w-[96vw] p-6`} role="region" aria-label="Travel information menu">
        <div className="grid grid-cols-3 gap-6">
          {data.travelInfo.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] border-b border-black/[0.06] pb-2 mb-2 px-3" style={{ color: AMBER }}>{col.title}</div>
              <ul>{col.items.map((i) => (
                <li key={i.slug}><Link href={`/travel-info/${i.slug}`} className={linkCls} onClick={() => setOpen(null)}>{i.title}</Link></li>
              ))}</ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ListPanel({ k, items }: { k: string; items: { label: string; href: string }[] }) {
    return (
      <div className={`${panelBase} ${show(k)} left-0 w-[260px] p-2`} role="region">
        <ul>{items.map((i) => (
          <li key={i.href}><Link href={i.href} className={`${linkCls} ${pathname === i.href ? "bg-[#f2f6f3] text-[#1a3c2e] font-semibold" : ""}`} onClick={() => setOpen(null)}>{i.label}</Link></li>
        ))}</ul>
      </div>
    );
  }

  function TopTreksPanel() {
    return (
      <div className={`${panelBase} ${show("top-treks")} left-0 w-[340px] p-2`} role="region" aria-label="Top treks">
        <div className={`${eyebrow} pt-2`}>Bestseller Himalayan treks</div>
        <ul className="max-h-[420px] overflow-y-auto">
          {data.topTreks.map((t) => (
            <li key={t.slug}>
              <Link href={`/trips/${t.slug}`} className={`${linkCls} flex-col items-start py-2`} onClick={() => setOpen(null)}>
                <span className="font-semibold text-[#1a3c2e] leading-snug">{t.title}</span>
                <span className="text-[12px] text-[#7c8a82]">
                  {t.duration ? `${t.duration} days` : ""}{t.difficulty ? ` · ${t.difficulty}` : ""}{t.price ? ` · from US$${(t.discountedPrice || t.price).toLocaleString()}` : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Called as plain functions, not <Components/>: as locally defined components
  // they would remount on every state change, recreating the panel DOM under
  // the cursor and firing spurious mouseleave events mid-hover.
  const panelFor = (m: MenuItem, key: string) => {
    switch (m.kind) {
      case "treks": return TreksPanel();
      case "travel-info": return TravelInfoPanel();
      case "company": return ListPanel({ k: key, items: data.company });
      case "custom": return ListPanel({ k: key, items: m.items || [] });
      case "top-treks": return TopTreksPanel();
      default: return null;
    }
  };
  const keyFor = (m: MenuItem, i: number) => (m.kind === "custom" ? `custom-${i}` : m.kind);

  // ---- render ----------------------------------------------------------------
  return (
    <div ref={rootRef} className="relative z-50">
      {/* Announcement strip — CMS text, always shown while enabled (no dismiss),
          as the client asked for it to be a permanent fixture like before. */}
      {data.promo && (
        <div className="bg-[#1a3c2e] text-white text-[13px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[38px] flex items-center justify-center gap-3">
            <FaBullhorn className="h-3.5 w-3.5 shrink-0" style={{ color: AMBER }} aria-hidden="true" />
            <span className="text-center font-medium">{data.promo.text}</span>
            {data.promo.linkHref && data.promo.linkLabel && (
              <Link href={data.promo.linkHref} className="shrink-0 rounded-[5px] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white hover:brightness-110" style={{ backgroundColor: AMBER }}>{data.promo.linkLabel}</Link>
            )}
          </div>
        </div>
      )}

      <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/[0.06] transition-[height] duration-200`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 ${barH} transition-[height] duration-200`}>

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 min-w-0 rounded-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8922a]" aria-label="Nature Heaven Treks & Expedition — home">
            <img src="/logo/emblem.svg" alt="" width={74} height={44} className="shrink-0 transition-all duration-200 h-[38px] sm:h-[44px] w-auto" style={compact ? { height: 34 } : undefined} />
            {/* Wordmark hides on the narrowest phones so the icons on the right keep room */}
            <span className="hidden min-[400px]:flex flex-col leading-none">
              <span className="font-serif font-extrabold tracking-wide text-[15px] whitespace-nowrap" style={{ color: BRAND }}>NATURE HEAVEN</span>
              <span className="text-[10px] font-bold tracking-[0.18em] mt-[3px] whitespace-nowrap" style={{ color: AMBER }}>TREKS &amp; EXPEDITION</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden xl:flex items-center self-stretch shrink-0" aria-label="Main">
            <ul className="flex items-stretch gap-1">
              {data.menu.map((m, i) => {
                const key = keyFor(m, i);
                const active = isActive(m);
                const itemCls = `flex items-center gap-1.5 h-full px-3 text-[14px] font-semibold whitespace-nowrap border-b-2 transition-colors ${active || open === key ? "text-[#1a3c2e] border-[#c8922a]" : "text-[#3b463f] border-transparent hover:text-[#1a3c2e]"}`;
                if (m.kind === "link") {
                  return <li key={key} className="flex"><Link href={m.href || "/"} className={itemCls}>{m.title}</Link></li>;
                }
                const wide = m.kind === "treks";
                return (
                  <li key={key} className={`flex ${wide ? "" : "relative"}`} onMouseEnter={() => enter(key)} onMouseLeave={leave}>
                    <button type="button" className={itemCls} aria-haspopup="true" aria-expanded={open === key} onClick={() => toggle(key)}>
                      {m.title}
                      <FaChevronDown className={`h-2.5 w-2.5 transition-transform ${open === key ? "rotate-180" : ""}`} style={{ color: AMBER }} />
                    </button>
                    <div onMouseEnter={() => enter(key)} onMouseLeave={leave}>{panelFor(m, key)}</div>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search trips" className="h-11 w-11 flex items-center justify-center rounded-[5px] text-[#3b463f] hover:bg-[#f2f6f3] hover:text-[#1a3c2e] transition-colors">
              <FaSearch className="h-4 w-4" />
            </button>

            {/* Representative dropdown (desktop) */}
            <div className="relative hidden md:block">
              <button
                type="button" onClick={() => { setRepOpen((v) => !v); setOpen(null); }}
                aria-haspopup="listbox" aria-expanded={repOpen}
                className="h-11 flex items-center gap-2 px-3 rounded-[5px] hover:bg-[#f2f6f3] transition-colors"
              >
                <Flag code={rep.code} />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c8a82]">{rep.country}</span>
                  <span className="text-[14px] font-bold" style={{ color: BRAND }}>{rep.whatsApp}</span>
                </span>
                <FaChevronDown className={`h-2.5 w-2.5 transition-transform ${repOpen ? "rotate-180" : ""}`} style={{ color: AMBER }} />
              </button>
              <div className={`${panelBase} ${repOpen ? "block" : "hidden"} right-0 w-[320px] p-2`} role="listbox" aria-label="Choose your nearest representative">
                <div className={`${eyebrow} pt-2`}>Talk to us in your region</div>
                <ul>
                  {data.reps.map((r) => (
                    <li key={r.code}>
                      <button type="button" role="option" aria-selected={r.code === rep.code} onClick={() => chooseRep(r)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[5px] text-left hover:bg-[#f2f6f3] ${r.code === rep.code ? "bg-[#f2f6f3]" : ""}`}>
                        <Flag code={r.code} />
                        <span className="flex-1 leading-tight">
                          <span className="block text-[14px] font-semibold" style={{ color: BRAND }}>{r.country} <span className="font-normal text-[#7c8a82]">· {r.name}</span></span>
                          <span className="block text-[12px] text-[#7c8a82]">{r.whatsApp}{r.hours ? ` · ${r.hours}` : ""}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <a href={waHref(rep.whatsApp)} target="_blank" rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-2 h-11 rounded-[5px] bg-[#25D366] text-white text-[14px] font-bold hover:bg-[#1fb85a] transition-colors">
                  <FaWhatsapp className="h-4 w-4" /> WhatsApp {rep.name.split(" ")[0]}
                </a>
              </div>
            </div>

            <Link href="/plan-a-trip" className="hidden sm:flex items-center gap-2 h-11 px-4 rounded-[5px] text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#153226]" style={{ backgroundColor: BRAND }}>
              <FaPaperPlane className="h-3.5 w-3.5" /> Plan Your Trip
            </Link>

            <a href={waHref(rep.whatsApp)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="md:hidden h-11 w-11 flex items-center justify-center rounded-[5px] text-[#25D366] hover:bg-[#f2f6f3]">
              <FaWhatsapp className="h-5 w-5" />
            </a>
            <button type="button" onClick={() => setDrawer(true)} aria-label="Open menu" className="xl:hidden h-11 w-11 flex items-center justify-center rounded-[5px] text-[#1a3c2e] hover:bg-[#f2f6f3]">
              <FaBars className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className={`fixed inset-0 z-[10000] bg-[#0f1a14]/95 flex items-center justify-center p-6 ${searchOpen ? "block" : "hidden"}`} role="dialog" aria-modal="true" aria-label="Search trips">
        <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="absolute top-5 right-5 h-11 w-11 flex items-center justify-center rounded-[5px] text-white/80 hover:text-white hover:bg-white/10"><FaTimes className="h-6 w-6" /></button>
        <form onSubmit={submitSearch} className="w-full max-w-2xl">
          <label htmlFor="hdr-search" className="block text-center text-white/70 text-[13px] font-semibold uppercase tracking-[0.18em] mb-4">Find your trek</label>
          <div className="relative">
            <input id="hdr-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Everest, Annapurna, Manaslu…"
              className="w-full h-14 bg-white rounded-[5px] pl-5 pr-14 text-[17px] text-[#1a3c2e] placeholder:text-[#9aa5a0] focus:outline-none focus:ring-2 focus:ring-[#c8922a]" />
            <button type="submit" aria-label="Search" className="absolute right-2 top-2 h-10 w-10 rounded-[5px] flex items-center justify-center text-white" style={{ backgroundColor: BRAND }}><FaSearch className="h-4 w-4" /></button>
          </div>
        </form>
      </div>

      {/* Mobile / tablet drawer */}
      <div className={`fixed inset-0 z-[10000] xl:hidden ${drawer ? "" : "pointer-events-none"}`} aria-hidden={!drawer}>
        <div onClick={() => setDrawer(false)} className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${drawer ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute right-0 top-0 bottom-0 w-[88%] max-w-[380px] bg-white shadow-2xl flex flex-col transition-transform duration-250 ease-out ${drawer ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between px-4 h-[64px] border-b border-black/[0.06]">
            <span className="flex items-center gap-2"><img src="/logo/emblem.svg" alt="" style={{ height: 34, width: "auto" }} /><span className="font-serif font-extrabold text-[14px]" style={{ color: BRAND }}>NATURE HEAVEN</span></span>
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="h-11 w-11 flex items-center justify-center rounded-[5px] hover:bg-[#f2f6f3]"><FaTimes className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2">
            <ul>
              {data.menu.map((m, i) => {
                const key = keyFor(m, i);
                if (m.kind === "link") return <li key={key}><Link href={m.href || "/"} className="flex items-center min-h-[48px] px-3 text-[15px] font-semibold text-[#1a3c2e] rounded-[5px] hover:bg-[#f2f6f3]">{m.title}</Link></li>;
                const isOpen = drawerSection === key;
                let rows: { label: string; href: string }[] = [];
                if (m.kind === "treks") rows = [...data.countries.map((c) => ({ label: c.name, href: `/countries/${c.slug}` })), ...data.regions.map((r) => ({ label: r.name, href: `/regions/${r.slug}` })), { label: "All trips", href: "/trips" }];
                if (m.kind === "travel-info") rows = data.travelInfo.flatMap((c) => c.items.map((it) => ({ label: it.title, href: `/travel-info/${it.slug}` })));
                if (m.kind === "company") rows = data.company;
                if (m.kind === "custom") rows = m.items || [];
                if (m.kind === "top-treks") rows = data.topTreks.map((t) => ({ label: t.title, href: `/trips/${t.slug}` }));
                return (
                  <li key={key}>
                    <button type="button" onClick={() => setDrawerSection(isOpen ? null : key)} aria-expanded={isOpen}
                      className="w-full flex items-center justify-between min-h-[48px] px-3 text-[15px] font-semibold text-[#1a3c2e] rounded-[5px] hover:bg-[#f2f6f3]">
                      {m.title}<FaChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} style={{ color: AMBER }} />
                    </button>
                    <ul className={`${isOpen ? "block" : "hidden"} pl-3 pb-2`}>
                      {rows.map((r) => <li key={r.href}><Link href={r.href} className="flex items-center min-h-[44px] px-3 text-[14px] text-[#3b463f] rounded-[5px] hover:bg-[#f2f6f3]">{r.label}</Link></li>)}
                    </ul>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 px-3">
              <div className={eyebrow.replace("px-3", "")}>Talk to us in your region</div>
              <ul className="border border-black/[0.08] rounded-[5px] divide-y divide-black/[0.06]">
                {data.reps.map((r) => (
                  <li key={r.code}>
                    <a href={waHref(r.whatsApp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-3 hover:bg-[#f2f6f3]">
                      <Flag code={r.code} />
                      <span className="flex-1 leading-tight">
                        <span className="block text-[14px] font-semibold" style={{ color: BRAND }}>{r.country} · {r.name}</span>
                        <span className="block text-[12px] text-[#7c8a82]">{r.whatsApp}{r.hours ? ` · ${r.hours}` : ""}</span>
                      </span>
                      <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="p-4 border-t border-black/[0.06]">
            <Link href="/plan-a-trip" className="flex items-center justify-center gap-2 h-12 rounded-[5px] text-white text-[14px] font-bold uppercase tracking-wide" style={{ backgroundColor: BRAND }}><FaPaperPlane className="h-4 w-4" /> Plan Your Trip</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
