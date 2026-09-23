import { getPayload } from "payload";
import { unstable_cache } from "next/cache";
import config from "@/payload/payload.config";
import HeaderClient from "./HeaderClient";
import type { NavData, MenuItem, Rep, RegionGroup, TrekLite } from "./types";

// Server half of the site header. Everything the menu needs is fetched here
// and handed to the client component as plain data, so the full navigation —
// every region, trek and travel-info link — is in the HTML Google reads. The
// previous header fetched all of this in the browser after load, which is why
// it exposed 4 crawlable links while competitors exposed 55–166.

const REGION_ORDER = [
  "everest", "annapurna", "manaslu", "langtang", "mustang", "ganesh-himal",
  "kanchenjunga", "makalu", "dolpa", "tour-in-nepal", "expedition-in-nepal",
  "peak-climbing-in-nepal", "jungle-safari-in-nepal", "river-rafting-in-nepal",
  "bungee-jumping-in-nepal", "paragliding-in-nepal",
];

const COUNTRY_META: Record<string, { name: string; slug: string }> = {
  nepal: { name: "Nepal", slug: "nepal" },
  tibet: { name: "Tibet", slug: "tibet" },
  bhutan: { name: "Bhutan", slug: "bhutan" },
};

// Used when the CMS has not categorised travel-info pages into all three
// columns (today every page is tagged "essential").
const TRAVEL_INFO_FALLBACK = [
  { title: "Essential Planning", items: [
    { slug: "travel-guide-for-nepal", title: "Ultimate Travel Guide to Nepal" },
    { slug: "getting-to-nepal-and-visas", title: "Nepal Arrival & Visas" },
    { slug: "trekking-permits-and-fees", title: "Permit Rules & Fees" },
    { slug: "currency-and-payments", title: "Currency & Payments" },
    { slug: "weather-and-climate", title: "Weather & Climate" },
    { slug: "what-to-do-before-coming", title: "Travel Preparation Guide" },
    { slug: "transportation-in-nepal", title: "How Transportation Works" },
  ] },
  { title: "Safety & Accommodation", items: [
    { slug: "altitude-acclimatization", title: "Altitude Acclimatization Rules" },
    { slug: "safety-while-travelling", title: "Guidelines for Safe Travel" },
    { slug: "health-safety-risk-prevention", title: "Health & Risk Prevention" },
    { slug: "accommodation-in-nepal", title: "Accommodation Facilities" },
    { slug: "food-and-beverages", title: "Beverages and Food" },
    { slug: "guides-mandatory-for-trekkers", title: "Why Guides are Mandatory?" },
  ] },
  { title: "Destinations & Culture", items: [
    { slug: "regions-in-nepal", title: "Trekking Regions in Nepal" },
    { slug: "attractions-in-nepal", title: "Famous Destinations" },
    { slug: "private-treks-in-nepal", title: "Tailor-Made Private Treks" },
    { slug: "why-travel-to-nepal", title: "What Makes Nepal Special?" },
    { slug: "facts-about-mt-everest", title: "Lesser-Known Facts of Everest" },
    { slug: "fact-about-lord-buddha", title: "Facts About Lord Buddha" },
    { slug: "know-festival-in-nepal", title: "Festivals in Nepal" },
  ] },
];

const COMPANY_FALLBACK = [
  { label: "About Us", href: "/about-us" },
  { label: "Our Team", href: "/our-team" },
  { label: "Why Choose Us", href: "/why-us" },
  { label: "Responsible Tourism", href: "/csr" },
  { label: "Gallery", href: "/gallery" },
  { label: "Video Gallery", href: "/video-gallery" },
  { label: "Legal Documents", href: "/legal-documents" },
  { label: "Terms & Conditions", href: "/terms-and-condition" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

// Seven CMS company pages are served at root-level static routes.
const STATIC_COMPANY = new Set(["about-us", "why-us", "csr", "our-team", "terms-and-condition", "privacy-policy", "legal-documents"]);

const FALLBACK_MENU: MenuItem[] = [
  { title: "Nepal Trips", kind: "treks" },
  { title: "Travel Info", kind: "travel-info" },
  { title: "Company", kind: "company" },
  { title: "Blog", kind: "link", href: "/blogs" },
  { title: "Top 10 Treks", kind: "top-treks" },
];

const FALLBACK: NavData = {
  logoUrl: null,
  menu: FALLBACK_MENU,
  countries: [{ name: "Nepal", slug: "nepal", count: 0 }],
  regions: [],
  travelInfo: TRAVEL_INFO_FALLBACK,
  company: COMPANY_FALLBACK,
  topTreks: [],
  reps: [{ country: "Nepal", code: "np", name: "Kathmandu office", whatsApp: "+977 9851218358", hours: "9am–6pm Nepal time", isDefault: true }],
  promo: null,
};

const trekLite = (t: any): TrekLite => ({
  title: t.title, slug: t.slug, duration: t.duration ?? undefined,
  difficulty: t.difficulty ?? undefined, price: t.price ?? undefined,
  discountedPrice: t.discountedPrice ?? undefined,
});

// The header renders on every page. Without this cache each of the 93
// prerendered pages fired these five queries in parallel during the build and
// exhausted the database connection pool. Navigation changes rarely; five
// minutes of staleness is fine.
const getNavData = unstable_cache(loadNavData, ["header-nav-data"], { revalidate: 300, tags: ["header"] });

export default async function Header() {
  const data = await getNavData();
  return <HeaderClient data={data} />;
}

async function loadNavData(): Promise<NavData> {
  let data: NavData = FALLBACK;
  try {
    const payload = await getPayload({ config });
    const [navRes, regionsRes, treksRes, pagesRes, companyRes] = await Promise.all([
      payload.find({
        collection: "navbarSettings", limit: 1, depth: 1, overrideAccess: true,
        populate: { treks: { title: true, slug: true, duration: true, difficulty: true, price: true, discountedPrice: true } },
      }),
      payload.find({ collection: "regions", limit: 100, depth: 0, overrideAccess: true, select: { name: true, slug: true, country: true } as any }),
      payload.find({
        collection: "treks", limit: 200, depth: 0, sort: "title", overrideAccess: true,
        select: { title: true, slug: true, region: true, duration: true, difficulty: true, price: true, discountedPrice: true, isBestSeller: true } as any,
      }),
      payload.find({ collection: "pages", limit: 100, depth: 0, overrideAccess: true, select: { title: true, slug: true, navbarCategory: true, navbarOrder: true, showInNavbar: true } as any }).catch(() => ({ docs: [] as any[] })),
      payload.find({ collection: "companyPages", limit: 50, depth: 0, overrideAccess: true, select: { title: true, slug: true } as any }).catch(() => ({ docs: [] as any[] })),
    ]);

    const nav: any = navRes.docs[0] || {};
    const regionsRaw: any[] = regionsRes.docs;
    const treks: any[] = treksRes.docs;

    // Treks grouped by region id (depth 0 => relation is the id)
    const byRegion = new Map<number, any[]>();
    for (const t of treks) {
      const rid = typeof t.region === "object" ? t.region?.id : t.region;
      if (rid == null) continue;
      if (!byRegion.has(rid)) byRegion.set(rid, []);
      byRegion.get(rid)!.push(t);
    }

    const countryCounts: Record<string, number> = {};
    for (const r of regionsRaw) {
      const key = (r.country || "nepal").toLowerCase();
      countryCounts[key] = (countryCounts[key] || 0) + (byRegion.get(r.id)?.length || 0);
    }
    const countries = Object.keys(COUNTRY_META)
      .filter((k) => regionsRaw.some((r) => (r.country || "nepal").toLowerCase() === k))
      .map((k) => ({ ...COUNTRY_META[k], count: countryCounts[k] || 0 }));

    const order = (slug: string) => { const i = REGION_ORDER.indexOf(slug); return i === -1 ? 99 : i; };
    const regions: RegionGroup[] = regionsRaw
      .filter((r) => (r.country || "nepal").toLowerCase() === "nepal" && (byRegion.get(r.id)?.length || 0) > 0)
      .sort((a, b) => order(a.slug) - order(b.slug))
      .map((r) => ({
        name: r.name, slug: r.slug,
        treks: (byRegion.get(r.id) || []).map((t) => ({ title: t.title, slug: t.slug })),
      }));

    // Travel info: CMS categories if all three columns are populated, else the
    // curated fallback (same rule the old header used).
    const pages: any[] = (pagesRes as any).docs.filter((p: any) => p.showInNavbar !== false);
    const col = (cat: string) => pages
      .filter((p) => p.navbarCategory === cat)
      .sort((a, b) => (a.navbarOrder ?? 10) - (b.navbarOrder ?? 10))
      .map((p) => ({ slug: p.slug, title: p.title }));
    const [ess, saf, des] = [col("essential"), col("safety"), col("destinations")];
    const travelInfo = ess.length && saf.length && des.length
      ? [
          { title: "Essential Planning", items: ess },
          { title: "Safety & Accommodation", items: saf },
          { title: "Destinations & Culture", items: des },
        ]
      : TRAVEL_INFO_FALLBACK;

    const companyDocs: any[] = (companyRes as any).docs;
    const company = companyDocs.length
      ? companyDocs.map((p) => ({ label: p.title, href: STATIC_COMPANY.has(p.slug) ? `/${p.slug}` : `/company/${p.slug}` }))
      : COMPANY_FALLBACK;

    // Menu from CMS rows; each dropdown style maps to a panel kind.
    const rows: any[] = Array.isArray(nav.navigationMenu) ? nav.navigationMenu.filter((r: any) => !r.hide) : [];
    let topTreks: TrekLite[] = [];
    const menu: MenuItem[] = rows.length ? rows.map((r: any): MenuItem => {
      if (r.type === "single-link") return { title: r.title, kind: "link", href: r.href || "/" };
      switch (r.dropdownStyle) {
        case "regions-grid": return { title: r.title, kind: "treks" };
        case "travel-info": return { title: r.title, kind: "travel-info" };
        case "company-pages": return { title: r.title, kind: "company" };
        case "contact-pages": return { title: r.title, kind: "link", href: "/contact-us" };
        case "treks-list": {
          const featured = (r.featuredTreks || []).filter((t: any) => t && typeof t === "object").map(trekLite);
          topTreks = featured.length ? featured : treks.filter((t) => t.isBestSeller).slice(0, 10).map(trekLite);
          if (!topTreks.length) topTreks = treks.slice(0, 10).map(trekLite);
          return { title: r.title, kind: "top-treks" };
        }
        default: {
          const items = (r.customLinks || []).filter((l: any) => !l.hide).map((l: any) => ({ label: l.label, href: l.href }));
          return items.length ? { title: r.title, kind: "custom", items } : { title: r.title, kind: "company" };
        }
      }
    }) : FALLBACK_MENU;
    if (!topTreks.length && menu.some((m) => m.kind === "top-treks")) {
      topTreks = treks.filter((t) => t.isBestSeller).slice(0, 10).map(trekLite);
    }

    const reps: Rep[] = (nav.representatives || []).map((r: any) => ({
      country: r.country, code: String(r.countryCode || "").toLowerCase(), name: r.name,
      whatsApp: r.whatsApp, hours: r.hours || undefined, isDefault: !!r.isDefault,
    }));

    const promo = nav.promoBar?.enabled && nav.promoBar?.text
      ? { text: nav.promoBar.text, linkLabel: nav.promoBar.linkLabel || undefined, linkHref: nav.promoBar.linkHref || undefined }
      : null;

    data = {
      logoUrl: typeof nav.logo === "object" && nav.logo?.url ? nav.logo.url : null,
      menu, countries, regions, travelInfo, company, topTreks,
      reps: reps.length ? reps : FALLBACK.reps,
      promo,
    };
  } catch (err: any) {
    console.warn("[Header] falling back to static navigation:", err?.message);
  }
  return data;
}
