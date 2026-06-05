import React from "react";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import VideoGalleryClient from "./VideoGalleryClient";
import { DEFAULT_VIDEOS } from "../config/defaultVideos";

export default async function VideoGallery() {
  let videos: any[] = DEFAULT_VIDEOS.map((v) => ({
    id: v.id,
    title: v.title,
    trekName: v.trekName,
    // Add realistic default specs for fallback default videos
    duration: v.trekName.includes("Everest") ? "14 Days" : v.trekName.includes("Annapurna") ? "16 Days" : v.trekName.includes("Mardi") ? "6 Days" : v.trekName.includes("Manaslu") ? "14 Days" : "10 Days",
    maxAltitude: v.trekName.includes("Everest") ? "5,364m" : v.trekName.includes("Annapurna") ? "5,416m" : v.trekName.includes("Mardi") ? "3,580m" : v.trekName.includes("Manaslu") ? "5,106m" : "3,870m",
    bestSeason: "Mar - May, Sep - Nov",
    description: "Experience the ultimate Himalayan adventure through remote trails, high-altitude passes, and pristine alpine lakes.",
  }));
  let kicker = "Watch the Journey";
  let title = "Himalayan Trek Experience";
  let description = "Watch real journeys through Nepal's most iconic mountain trails.";

  try {
    const payload = await getPayload({ config });
    const settingsRes = await payload.find({
      collection: "homepageSettings",
      limit: 1,
      depth: 2, // Fetch with depth 2 to populate the linked trek!
      overrideAccess: true,
    });

    const settings = settingsRes.docs[0] as any;

    if (settings) {
      if (settings.featuredVideoKicker) kicker = settings.featuredVideoKicker;
      if (settings.featuredVideoTitle) title = settings.featuredVideoTitle;
      if (settings.featuredVideoDescription) description = settings.featuredVideoDescription;

      // Use CMS videos if at least one has been configured
      if (settings.videoGallery && settings.videoGallery.length > 0) {
        videos = settings.videoGallery.map((v: any) => {
          const trekDoc = v.trek && typeof v.trek === "object" ? v.trek : null;
          return {
            id: v.youtubeId,
            title: v.title,
            trekName: v.trekName || trekDoc?.title || "Nepal Trek",
            description: v.description || trekDoc?.overview || "Watch action footage captured by our Sherpa guides on the trails.",
            duration: trekDoc?.duration ? `${trekDoc.duration} Days` : null,
            maxAltitude: trekDoc?.maxAltitude ? `${trekDoc.maxAltitude.toLocaleString()}m` : null,
            bestSeason: trekDoc?.bestSeason || "Mar - May, Sep - Nov",
          };
        });
      }
    }
  } catch (err: any) {
    console.warn("[Video Gallery] Failed to fetch homepage settings:", err.message);
  }

  return (
    <VideoGalleryClient
      kicker={kicker}
      title={title}
      description={description}
      videos={videos}
    />
  );
}
