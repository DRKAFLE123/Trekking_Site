import React from "react";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import VideoGalleryClient from "./VideoGalleryClient";
import { DEFAULT_VIDEOS } from "../config/defaultVideos";

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
