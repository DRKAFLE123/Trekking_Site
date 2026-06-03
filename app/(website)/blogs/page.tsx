import React, { Suspense } from "react";
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
  let siteSettings: any = null;
  let blogSettings: any = null;
  try {
    const payload = await getPayload({ config });
    const [blogsRes, siteSettingsRes, blogSettingsRes] = await Promise.all([
      payload.find({
        collection: "blogPosts",
        depth: 1,
      }),
      payload.find({
        collection: "siteSettings",
        depth: 1,
      }),
      payload.find({
        collection: "blogSettings",
        depth: 1,
      }),
    ]);
    blogs = blogsRes.docs as unknown as BlogPost[];
    siteSettings = siteSettingsRes.docs[0] || null;
    blogSettings = blogSettingsRes.docs[0] || null;
  } catch (err: any) {
    console.warn("[Blogs Page] Failed to fetch data (relation may not exist yet during build):", err.message);
  }

  // Use backend blogs or empty array if none exist
  const displayBlogs = blogs && blogs.length > 0 ? blogs : [];

  return (
    <div className="pt-24 md:pt-32 bg-[#fcfbfa] min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center py-32 text-charcoal/50 text-xs font-semibold uppercase tracking-wider">
          Loading Himalayan Chronicles...
        </div>
      }>
        <BlogsPageContent blogs={displayBlogs} siteSettings={siteSettings} blogSettings={blogSettings} />
      </Suspense>
    </div>
  );
}
