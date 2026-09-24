/**
 * Dev aid: render the trek brochure outside Next.
 *   npx tsx scripts/render-brochure.tsx everest-base-camp-trek [--omit a,b] [--skip logo,hero,map,gallery] [--out file.pdf]
 * Reads the trek + site settings from a running server (BASE, default http://localhost:3207).
 */
import React from "react";
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { Font, renderToBuffer } from "@react-pdf/renderer";
import sharp from "sharp";
import { getMediaUrl } from "../lib/cloudinary-loader";
import TrekBrochure, { pdfImageUrl, type BrochureAssets, type BrochureSite, type PdfImage } from "../components/pdf/TrekBrochure";

const BASE = process.env.BASE || "http://localhost:3207";
const PUBLIC = path.join(process.cwd(), "public");
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--")) || "everest-base-camp-trek";
const opt = (k: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : ""; };
const omit = opt("omit").split(",").filter(Boolean);
const skip = opt("skip").split(",").filter(Boolean);
const out = opt("out") || `scripts/out-${slug}.pdf`;
const infoSlice = opt("info"); // "a:b" -> tripInfoSections.slice(a,b)
const faqN = opt("faqs");

Font.register({
  family: "DM Sans",
  fonts: [400, 500, 700].map((w) => ({ src: path.join(PUBLIC, "fonts", `DMSans-${w}.ttf`), fontWeight: w as 400 | 500 | 700 })),
});
Font.registerHyphenationCallback((w) => [w]);

async function localImage(publicPath: string): Promise<PdfImage | null> {
  try {
    const file = path.join(PUBLIC, decodeURIComponent(publicPath.replace(/^\//, "")));
    if (/\.(png|jpe?g)$/i.test(file)) return { data: await readFile(file), format: /\.png$/i.test(file) ? "png" : "jpg" };
    return { data: await sharp(file).resize({ width: 1400, withoutEnlargement: true }).png().toBuffer(), format: "png" };
  } catch (e: any) { console.warn("local image skipped", publicPath, e.message); return null; }
}
const resolveImage = (url: string, w: number) => (!url ? Promise.resolve(null) : url.startsWith("/") ? localImage(url) : Promise.resolve(pdfImageUrl(url, w)));

(async () => {
  const t0 = Date.now();
  const trekRes = await fetch(`${BASE}/api/treks?where[slug][equals]=${slug}&depth=1&limit=1`).then((r) => r.json());
  const trek = trekRes.docs?.[0];
  if (!trek) throw new Error("trek not found via API");
  if (infoSlice) { const [a,b]=infoSlice.split(":").map(Number); trek.tripInfoSections=(trek.tripInfoSections||[]).slice(a,b); }
  if (faqN) trek.faqs=(trek.faqs||[]).slice(0,Number(faqN));
  const ssRes = await fetch(`${BASE}/api/siteSettings?depth=0&limit=1`).then((r) => r.json()).catch(() => ({}));
  const ss: any = ssRes.docs?.[0] || {};
  const site: BrochureSite = {
    name: ss.siteName || "Nature Heaven Treks & Expedition",
    phone: ss.contactInfo?.phone || "+977-9851218358",
    whatsApp: ss.headerSettings?.expertWhatsApp || "+977 9851218358",
    email: ss.contactInfo?.email || "info@natureheaventreks.com",
    address: ss.contactInfo?.address || "Thamel, Kathmandu, Nepal",
    website: "natureheaventreks.com",
    registrationNo: ss.trust?.registrationNo,
    foundedYear: Number(ss.trust?.foundedYear) || undefined,
    tripAdvisorReviews: Number(ss.trust?.tripAdvisorReviews) || undefined,
    tripAdvisorRating: ss.trust?.tripAdvisorRating || undefined,
  };
  const mapUrl = getMediaUrl(trek.mapImage) || (slug.includes("everest-base-camp") ? "/Map Image/ebc-map.webp" : "");
  const galleryUrls: string[] = (trek.gallery || []).map((g: any) => getMediaUrl(g?.image ?? g)).filter(Boolean);
  const [logo, hero, map, ...gallery] = await Promise.all([
    localImage("/brand/logo-pdf.png"),
    resolveImage(getMediaUrl(trek.heroImage), 1200),
    resolveImage(mapUrl, 1400),
    ...galleryUrls.slice(0, 4).map((u) => resolveImage(u, 600)),
  ]);
  const assets: BrochureAssets = {
    logo: skip.includes("logo") ? null : logo,
    hero: skip.includes("hero") ? null : hero,
    map: skip.includes("map") ? null : map,
    gallery: skip.includes("gallery") ? [] : (gallery.filter(Boolean) as PdfImage[]),
  };
  const buf = await renderToBuffer(<TrekBrochure trek={trek} site={site} assets={assets} omit={omit} tripUrl={`https://natureheaventreks.com/trips/${slug}`} /> as any);
  await writeFile(out, buf);
  console.log(`OK ${out} ${Math.round(buf.length / 1024)} KB in ${Date.now() - t0} ms (omit=${omit.join(",") || "-"} skip=${skip.join(",") || "-"})`);
})().catch((e) => { console.error("FAIL", e.message); process.exit(1); });
