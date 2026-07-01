import React from "react";
import UpcomingDepartures from "@/components/UpcomingDepartures";

export const metadata = {
  title: "Upcoming Group Departures | Nature Heaven Trek & Expedition",
  description: "View our scheduled group tour departures for 2026 and 2027 in Nepal, Tibet, and Bhutan. Join a group and save on your trekking packages.",
  alternates: { canonical: "/upcoming-departures" },
};

export default function UpcomingDeparturesPage() {
  return (
    <div className="w-full pt-28 pb-16 bg-[#fcfbfa]">
      <UpcomingDepartures />
    </div>
  );
}
