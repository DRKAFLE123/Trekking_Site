import React from "react";
import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import VideoGalleryPageClient from "./VideoGalleryPageClient";

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "Himalayan Video Gallery | Nature Heaven Trekking & Expedition",
  description: "Watch video highlights from our Everest Base Camp, Annapurna, Mardi Himal and Manaslu treks in the Nepal Himalayas.",
  alternates: { canonical: "/video-gallery" },
};

export default async function VideoGalleryPage() {
  let videos: any[] = [];

  try {
    const payload = await getPayload({ config });
    const settingsRes = await payload.find({
      collection: "homepageSettings",
      limit: 1,
      depth: 2,
      overrideAccess: true,
    });

    const settings = settingsRes.docs[0] as any;

    let hasCmsVideos = false;
    if (settings?.videoGallery && settings.videoGallery.length > 0) {
      videos = settings.videoGallery.map((v: any) => {
        const trekDoc = v.trek && typeof v.trek === "object" ? v.trek : null;
        return {
          id: v.youtubeId,
          title: v.title,
          trekName: v.trekName || trekDoc?.title || "Nepal Trek",
        };
      });
      hasCmsVideos = true;
    }

    if (!hasCmsVideos) {
      const treksRes = await payload.find({
        collection: 'treks',
        where: {
          youtubeVideoId: {
            exists: true,
          },
        },
        limit: 100,
        depth: 0,
      });
      const dbTreksWithVideos = (treksRes.docs || []).filter((t: any) => t.youtubeVideoId && t.youtubeVideoId.trim().length > 0);
      if (dbTreksWithVideos.length > 0) {
        videos = dbTreksWithVideos.map((t: any) => ({
          id: t.youtubeVideoId,
          title: t.title + " Journey",
          trekName: t.title,
        }));
      }
    }
  } catch (err: any) {
    console.warn("[Video Gallery Page] Failed to query videos from CMS:", err.message);
  }

  return <VideoGalleryPageClient initialVideos={videos} />;
}
