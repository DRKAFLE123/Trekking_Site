import React from "react";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import VideoGalleryClient from "./VideoGalleryClient";

// Default fallback videos (used when no videos are set in Admin → Site Settings)
const DEFAULT_VIDEOS = [
  {
    id: "h1F7Tj2_H0Q",
    title: "Hiking 50 miles to Everest Base Camp",
    trekName: "Everest Base Camp Trek",
  },
  {
    id: "5uV6xH7V69Q",
    title: "Annapurna Circuit Trek: Nepal's Thorong La Pass",
    trekName: "Annapurna Circuit Trek",
  },
  {
    id: "h1F7Tj2_H0Q",
    title: "Walking Through the Himalayas | Taksindu to Gokyo Trek",
    trekName: "EBC via Gokyo Lakes",
  },
  {
    id: "5uV6xH7V69Q",
    title: "The Annapurna Base Camp Trek - Amazing Annapurna",
    trekName: "Annapurna Base Camp Trek",
  },
  {
    id: "h1F7Tj2_H0Q",
    title: "The Manaslu Circuit. Hiking Nepal's Most Underrated Trek",
    trekName: "Manaslu Circuit Trek",
  },
  {
    id: "5uV6xH7V69Q",
    title: "Hiking Alone in Nepal (Mardi Himal Trek)",
    trekName: "Mardi Himal Trek",
  },
];

export default async function VideoGallery() {
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

    // Use CMS videos if at least one has been configured
    if (settings?.videoGallery && settings.videoGallery.length > 0) {
      videos = settings.videoGallery.map((v: any) => ({
        id: v.youtubeId,
        title: v.title,
        trekName: v.trekName || "Nepal Trek",
      }));
    }
  } catch {
    // Fallback to defaults silently
  }

  return <VideoGalleryClient videos={videos} />;
}
