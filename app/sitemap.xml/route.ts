import { getPayload } from "payload";
import config from "@/payload/payload.config";

// Dynamic sitemap. Lists every public-facing route Google should crawl:
// the static info pages, plus every Trek, Blog Post, Region, Company Page,
// Contact Page, and CMS Pages doc that's been published.
//
// A custom route handler (instead of app/sitemap.ts) so the XML can carry an
// xml-stylesheet instruction — /sitemap.xsl renders it as a branded, readable
// page for humans. Crawlers ignore the stylesheet and read the same XML.
//
// Uses a permissive fallback so a CMS hiccup never produces an empty
// sitemap (Google penalizes that).
export const revalidate = 3600; // re-build at most once per hour

const SITE_URL = "https://natureheaventreks.com";

type Entry = {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
};

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: string;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/trips", changeFrequency: "weekly", priority: 0.9 },
  { path: "/regions", changeFrequency: "weekly", priority: 0.85 },
  { path: "/countries", changeFrequency: "weekly", priority: 0.85 },
  { path: "/countries/nepal", changeFrequency: "weekly", priority: 0.8 },
  { path: "/countries/tibet", changeFrequency: "weekly", priority: 0.8 },
  { path: "/countries/bhutan", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blogs", changeFrequency: "weekly", priority: 0.8 },
  { path: "/plan-a-trip", changeFrequency: "monthly", priority: 0.8 },
  { path: "/upcoming-departures", changeFrequency: "weekly", priority: 0.75 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/why-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/our-team", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/private-treks", changeFrequency: "monthly", priority: 0.7 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.6 },
  { path: "/video-gallery", changeFrequency: "monthly", priority: 0.55 },
  { path: "/visa-info", changeFrequency: "monthly", priority: 0.6 },
  { path: "/travel-insurance", changeFrequency: "monthly", priority: 0.6 },
  { path: "/packing-list", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.5 },
  { path: "/csr", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-and-condition", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal-documents", changeFrequency: "yearly", priority: 0.3 },
];

async function buildEntries(): Promise<Entry[]> {
  const now = new Date();

  const staticEntries: Entry[] = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let dynamicEntries: Entry[] = [];

  try {
    const payload = await getPayload({ config });

    const safeFind = async (
      collection: string,
      prefix: string,
      changeFrequency: string,
      priority: number,
    ): Promise<Entry[]> => {
      try {
        const res = await payload.find({
          collection: collection as any,
          depth: 0,
          limit: 500,
          overrideAccess: true,
        });
        return (res.docs || [])
          .filter((d: any) => d?.slug)
          .map((d: any) => ({
            url: `${SITE_URL}${prefix}/${d.slug}`,
            lastModified: d.updatedAt ? new Date(d.updatedAt) : now,
            changeFrequency,
            priority,
          }));
      } catch {
        return [];
      }
    };

    const [treks, blogs, regions, companyPages, pages, contactPages] =
      await Promise.all([
        safeFind("treks", "/trips", "weekly", 0.9),
        safeFind("blogPosts", "/blogs", "weekly", 0.7),
        safeFind("regions", "/regions", "monthly", 0.7),
        safeFind("companyPages", "/company", "monthly", 0.6),
        safeFind("pages", "/travel-info", "monthly", 0.5),
        safeFind("contactPages", "/contact-us", "monthly", 0.5),
      ]);

    dynamicEntries = [
      ...treks,
      ...blogs,
      ...regions,
      ...companyPages,
      ...pages,
      ...contactPages,
    ];
  } catch (err) {
    console.error("[sitemap] Payload init failed; returning static-only sitemap", err);
  }

  return [...staticEntries, ...dynamicEntries];
}

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const entries = await buildEntries();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <lastmod>${e.lastModified.toISOString().slice(0, 10)}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority.toFixed(2)}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}
