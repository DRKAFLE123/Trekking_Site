import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@/payload/payload.config";

// Dynamic sitemap. Lists every public-facing route Google should crawl:
// the static info pages, plus every Trek, Blog Post, Region, Company Page,
// Contact Page, and CMS Pages doc that's been published.
//
// Uses a permissive fallback so a CMS hiccup never produces an empty
// sitemap (Google penalizes that).
export const revalidate = 3600; // re-build at most once per hour

const SITE_URL = "https://natureheaventreks.com";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/trips", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blogs", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/our-team", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/private-treks", changeFrequency: "monthly", priority: 0.7 },
  { path: "/visa-info", changeFrequency: "monthly", priority: 0.6 },
  { path: "/travel-insurance", changeFrequency: "monthly", priority: 0.6 },
  { path: "/packing-list", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.5 },
  { path: "/csr", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-and-condition", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal-documents", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const payload = await getPayload({ config });

    const safeFind = async <T extends string>(
      collection: T,
      prefix: string,
      changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: number,
    ): Promise<MetadataRoute.Sitemap> => {
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
