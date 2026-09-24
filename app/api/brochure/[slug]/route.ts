import React from "react";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { renderToBuffer } from "@react-pdf/renderer";
import config from "@/payload/payload.config";
import { getMediaUrl } from "@/lib/cloudinary-loader";
import TrekBrochure, { pdfImageUrl, type BrochureSite } from "@/components/pdf/TrekBrochure";

const SITE_URL = "https://natureheaventreks.com";

// Builds the trip brochure PDF on demand from the CMS record, so it is always
// in step with the page. Cached at the edge for an hour.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
  };

  const pdf = await renderToBuffer(
    React.createElement(TrekBrochure, {
      trek,
      site,
      heroUrl: pdfImageUrl(getMediaUrl(trek.heroImage)),
      tripUrl: `${SITE_URL}/trips/${trek.slug}`,
    }) as any
  );

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${trek.slug}-brochure.pdf"`,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
