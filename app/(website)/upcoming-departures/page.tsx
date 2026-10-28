import React from "react";
import UpcomingDepartures from "@/components/UpcomingDepartures";

import type { Metadata } from "next";
import { pageSeoMetadata } from "@/lib/cms-seo";
const baseMetadata: Metadata = {
  title: "Upcoming Group Departures | Nature Heaven Trek & Expedition",
  description: "View our scheduled group tour departures for 2026 and 2027 in Nepal, Tibet, and Bhutan. Join a group and save on your trekking packages.",
  alternates: { canonical: "/upcoming-departures" },
};

// Google title/description are edited in the CMS; baseMetadata is the fallback.
export async function generateMetadata(): Promise<Metadata> {
  return pageSeoMetadata("/upcoming-departures", baseMetadata);
}

export const revalidate = 3600;

export default function UpcomingDeparturesPage() {
  return (
    <div className="w-full pt-28 pb-16 bg-[#fcfbfa]">
      <UpcomingDepartures asPageHeading />
    </div>
  );
}
