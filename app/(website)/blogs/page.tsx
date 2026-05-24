import React from "react";
import { Metadata } from "next";
import BlogsPageContent from "@/components/BlogsPageContent";
import { BlogPost } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "Trekking Guides & Travel Tips | Nature Heaven Trekking & Expedition",
  description: "Read expert trekking guidelines, physical training tips, packing checklists, and cultural insights for traveling in Nepal.",
};

export default async function BlogsPage() {
  let blogs: BlogPost[] = [];
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "blogPosts",
      depth: 1,
    });
    blogs = res.docs as unknown as BlogPost[];
  } catch (err: any) {
    console.warn("[Blogs Page] Failed to fetch blogs (relation may not exist yet during build):", err.message);
  }

  return (
    <div className="pt-24 md:pt-32 bg-[#fcfbfa] min-h-screen">
      <BlogsPageContent blogs={blogs} />
    </div>
  );
}
