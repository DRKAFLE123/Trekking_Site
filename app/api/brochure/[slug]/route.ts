import React from "react";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { Font, renderToBuffer } from "@react-pdf/renderer";
import config from "@/payload/payload.config";
import { getMediaUrl } from "@/lib/cloudinary-loader";
import TrekBrochure, { pdfImageUrl, type BrochureAssets, type BrochureSite, type PdfImage } from "@/components/pdf/TrekBrochure";

const SITE_URL = "https://natureheaventreks.com";
const PUBLIC = path.join(process.cwd(), "public");

let fontsReady = false;
function registerFonts() {
  if (fontsReady) return;
  Font.register({
    family: "DM Sans",
    fonts: [
      { src: path.join(PUBLIC, "fonts", "DMSans-400.ttf"), fontWeight: 400 },
      { src: path.join(PUBLIC, "fonts", "DMSans-500.ttf"), fontWeight: 500 },
      { src: path.join(PUBLIC, "fonts", "DMSans-700.ttf"), fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((w) => [w]);
  fontsReady = true;
}

/** Local /public images (often WebP, which react-pdf can't decode) become PNG bytes via sharp. */
async function localImage(publicPath: string): Promise<PdfImage | null> {
  try {
    const file = path.join(PUBLIC, decodeURIComponent(publicPath.replace(/^\//, "")));
    if (/\.(png|jpe?g)$/i.test(file)) {
      return { data: await readFile(file), format: /\.png$/i.test(file) ? "png" : "jpg" };
    }
    const sharp = (await import("sharp")).default;
    const data = await sharp(file).resize({ width: 1400, withoutEnlargement: true }).png().toBuffer();
    return { data, format: "png" };
  } catch (err: any) {
    console.warn("[brochure] local image skipped:", publicPath, err?.message);
    return null;
  }
}

async function resolveImage(url: string, width: number): Promise<PdfImage | null> {
  if (!url) return null;
  if (url.startsWith("/")) return localImage(url);
  return pdfImageUrl(url, width);
}

// Builds the trip brochure PDF on demand from the CMS record, so it is always
// in step with the page. Cached at the edge for an hour.
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = new URL(req.url).searchParams;
  const omit = (q.get("omit") || "").split(",").filter(Boolean);
  const skip = (q.get("skip") || "").split(",").filter(Boolean);
  try {
    registerFonts();
    const payload = await getPayload({ config });

    const [trekRes, siteRes] = await Promise.all([
      payload.find({ collection: "treks", where: { slug: { equals: slug } }, depth: 1, limit: 1 }),
      payload.find({ collection: "siteSettings", depth: 0, limit: 1 }),
    ]);
    const trek: any = trekRes.docs[0];
    if (!trek) return NextResponse.json({ error: "Trek not found" }, { status: 404 });

    const ss: any = siteRes.docs[0] || {};
    const site: BrochureSite = {
      name: ss.siteName || "Nature Heaven Treks & Expedition",
      phone: ss.contactInfo?.phone || "+977-9851218358",
      whatsApp: ss.headerSettings?.expertWhatsApp || ss.contactInfo?.whatsapp || "+977 9851218358",
      email: ss.contactInfo?.email || "info@natureheaventreks.com",
      address: ss.contactInfo?.address || "Thamel, Kathmandu, Nepal",
      website: SITE_URL.replace(/^https?:\/\//, ""),
      registrationNo: ss.trust?.registrationNo || undefined,
      foundedYear: Number(ss.trust?.foundedYear) || undefined,
      tripAdvisorReviews: Number(ss.trust?.tripAdvisorReviews) || undefined,
      tripAdvisorRating: ss.trust?.tripAdvisorRating || undefined,
    };

    // Same fallbacks as the trek page's route-map block.
    const mapUrl =
      getMediaUrl(trek.mapImage) ||
      (trek.slug?.includes("everest-base-camp") ? "/Map Image/ebc-map.webp" : "") ||
      (trek.slug?.includes("manaslu") ? "/Map Image/manslu trek.webp" : "");

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

    const pdf = await renderToBuffer(
      React.createElement(TrekBrochure, { trek, site, assets, omit, tripUrl: `${SITE_URL}/trips/${trek.slug}` }) as any
    );

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${trek.slug}-brochure.pdf"`,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: any) {
    console.error("[brochure] failed for", slug, err);
    return NextResponse.json(
      { error: "Brochure generation failed", detail: String(err?.message || err) },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
