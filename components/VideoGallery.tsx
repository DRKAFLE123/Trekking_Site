import React from "react";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import VideoGalleryClient from "./VideoGalleryClient";

// Default fallback videos (used when no videos are set in Admin → Site Settings)
const DEFAULT_VIDEOS = [
  {
    id: "fAsw_vB3JpI",
    title: "Hiking 50 Miles to Everest Base Camp",
    trekName: "Everest Base Camp Trek",
  },
  {
    id: "k7vY2y2UoKs",
    title: "Annapurna Circuit Trek: Crossing Thorong La Pass (5,416m)",
    trekName: "Annapurna Circuit Trek",
  },
  {
    id: "f9N1oX1jK4w",
    title: "Hiking Alone in Nepal: The Mardi Himal Trek",
    trekName: "Mardi Himal Trek",
  },
  {
    id: "kYv9y_Ff37I",
    title: "Hiking 100 Miles on the Manaslu Circuit Trek",
    trekName: "Manaslu Circuit Trek",
  },
  {
    id: "B9_M2Jt_b6s",
    title: "Walking Through the Himalayas: EBC & Gokyo Lakes",
    trekName: "EBC via Gokyo Lakes",
  },
  {
    id: "PYaviq4rFtQ",
    title: "The Annapurna Base Camp Trek: Sanctuary & Machapuchare",
    trekName: "Annapurna Base Camp Trek",
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
