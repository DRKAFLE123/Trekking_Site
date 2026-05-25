import React from "react";
import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import VideoGalleryPageClient from "./VideoGalleryPageClient";
import { DEFAULT_VIDEOS } from "../../../config/defaultVideos";

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "Himalayan Video Gallery | Nature Heaven Trekking & Expedition",
  description: "Watch video highlights from our Everest Base Camp, Annapurna, Mardi Himal and Manaslu treks in the Nepal Himalayas.",
};

export default async function VideoGalleryPage() {
  let videos = DEFAULT_VIDEOS;

  try {
    const payload = await getPayload({ config });
    const settingsRes = await payload.find({
      collection: "siteSettings",
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    const settings = settingsRes.docs[0] as any;

    if (settings?.videoGallery && settings.videoGallery.length > 0) {
      videos = settings.videoGallery.map((v: any) => ({
        id: v.youtubeId,
        title: v.title,
        trekName: v.trekName || "Nepal Trek",
      }));
    }
  } catch (err: any) {
    console.warn("[Video Gallery Page] Failed to query videos from CMS:", err.message);
  }

  return <VideoGalleryPageClient initialVideos={videos} />;
}
