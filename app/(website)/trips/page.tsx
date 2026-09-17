import React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import TripsPageContent from "@/components/TripsPageContent";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { TREK_CARD_SELECT } from "@/lib/payload-select";
import { Trek, Region } from "@/types";

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "Trekking Packages in Nepal | Nature Heaven Trekking & Expedition",
  description: "Browse our private, customized trekking packages in Everest, Annapurna, and Manaslu. Search by difficulty, duration, and region to find your perfect hike.",
  alternates: { canonical: "/trips" },
};

// Reading searchParams opts the route into dynamic rendering. TripsPageContent
// calls useSearchParams(); on a statically prerendered route Next bails that
// Suspense boundary out to client-only rendering, so only 5 of the trek links
// reached the HTML Google reads. Same fix as /blogs.
export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await searchParams;
  let treks: Trek[] = [];
  let regions: Region[] = [];
  try {
    const payload = await getPayload({ config });
    const [treksRes, regionsRes] = await Promise.all([
      payload.find({
        collection: "treks",
        depth: 1,
        limit: 100,
        select: TREK_CARD_SELECT,
      }),
      payload.find({
        collection: "regions",
        depth: 1,
      }),
    ]);
    treks = treksRes.docs as unknown as Trek[];
    regions = regionsRes.docs as unknown as Region[];
  } catch (err: any) {
    console.warn("[Trips Page] Failed to fetch treks/regions (relation may not exist yet during build):", err.message);
  }

  return (
    <Suspense fallback={<div className="pt-24 md:pt-32 bg-[#fcfbfa] min-h-screen flex items-center justify-center"><span className="text-xl">Loading trips...</span></div>}>
      <TripsPageContent initialTreks={treks} regions={regions} />
    </Suspense>
  );
}
