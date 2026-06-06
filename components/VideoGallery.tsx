import React from "react";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import VideoGalleryClient from "./VideoGalleryClient";

export default async function VideoGallery() {
  let videos: any[] = [];
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
      }

      let hasCmsVideos = false;
      // Use CMS videos if at least one has been configured
      if (settings && settings.videoGallery && settings.videoGallery.length > 0) {
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
        hasCmsVideos = true;
      }

      if (!hasCmsVideos) {
        // Query treks that have a youtubeVideoId from CMS
        const treksRes = await payload.find({
          collection: 'treks',
          where: {
            youtubeVideoId: {
              exists: true,
            },
          },
          limit: 12,
          depth: 0,
        });
        const dbTreksWithVideos = (treksRes.docs || []).filter((t: any) => t.youtubeVideoId && t.youtubeVideoId.trim().length > 0);
        if (dbTreksWithVideos.length > 0) {
          videos = dbTreksWithVideos.map((t: any) => ({
            id: t.youtubeVideoId,
            title: t.title + " Journey",
            trekName: t.title,
            description: "Watch action footage captured by our Sherpa guides on the trails.",
            duration: t.duration ? `${t.duration} Days` : null,
            maxAltitude: t.maxAltitude ? `${t.maxAltitude.toLocaleString()}m` : null,
            bestSeason: t.bestSeason || "Mar - May, Sep - Nov",
          }));
        }
      }
  } catch (err: any) {
    console.warn("[Video Gallery] Failed to fetch homepage settings:", err.message);
  }

  if (!videos || videos.length === 0) {
    return null;
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
