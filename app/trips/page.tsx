import React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import TripsPageContent from "@/components/TripsPageContent";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { Trek, Region } from "@/types";

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "Trekking Packages in Nepal | Nature Heaven Trekking & Expedition",
  description: "Browse our private, customized trekking packages in Everest, Annapurna, and Manaslu. Search by difficulty, duration, and region to find your perfect hike.",
};

export default async function TripsPage() {
  const payload = await getPayload({ config });
  const [treksRes, regionsRes] = await Promise.all([
    payload.find({
      collection: "treks",
      depth: 1,
    }),
    payload.find({
      collection: "regions",
      depth: 1,
    }),
  ]);
  const treks = treksRes.docs as unknown as Trek[];
  const regions = regionsRes.docs as unknown as Region[];

  return (
    <Suspense fallback={<div className="pt-24 md:pt-32 bg-[#fcfbfa] min-h-screen flex items-center justify-center"><span className="text-xl">Loading trips...</span></div>}>
      <TripsPageContent initialTreks={treks} regions={regions} />
    </Suspense>
  );
}
