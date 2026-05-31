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

const defaultBlogs = [
  {
    id: "db1",
    title: "Ultimate Guide to Everest Base Camp Altitude Adaptation",
    category: "Trekking Guides",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
    excerpt: "Acclimatization is key to a successful Everest trek. Learn how to climb high, sleep low, and pace yourself like a professional mountain guide.",
    publishedAt: "2026-05-15T00:00:00.000Z",
    readTime: "6 min read",
    slug: "everest-base-camp-acclimatization-guide"
  },
  {
    id: "db2",
    title: "Best Trekking Seasons in Nepal: When to Go",
    category: "Travel Info",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
    excerpt: "Should you trek in Spring or Autumn? We break down the weather patterns, trail crowds, and photography conditions for every season in the Himalayas.",
    publishedAt: "2026-05-10T00:00:00.000Z",
    readTime: "5 min read",
    slug: "best-trekking-seasons-in-nepal"
  },
  {
    id: "db3",
    title: "How to Choose Between Everest and Annapurna Circuits",
    category: "Comparison",
    coverImage: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=800",
    excerpt: "Deciding between the two most iconic treks in the world? We compare the altitude profiles, tea house cultures, and scenery to help you choose.",
    publishedAt: "2026-05-02T00:00:00.000Z",
    readTime: "8 min read",
    slug: "everest-vs-annapurna-circuit"
  },
  {
    id: "db4",
    title: "Nepal Trekking Packing List: Essential Gear Guide",
    category: "Trekking Guides",
    coverImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800",
    excerpt: "What should you pack for a high-altitude Himalayan trek? Here is our comprehensive gear checklist, covering clothing layers, boots, sleeping bags, and medicine.",
    publishedAt: "2026-04-20T00:00:00.000Z",
    readTime: "7 min read",
    slug: "nepal-trekking-packing-list-guide"
  },
  {
    id: "db5",
    title: "Manaslu Circuit Trek: Complete Preparation & Permit Guide",
    category: "Trekking Guides",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    excerpt: "All you need to know about the special restricted area permit for the Manaslu region, and physical training recommendations for Larke La Pass.",
    publishedAt: "2026-04-10T00:00:00.000Z",
    readTime: "6 min read",
    slug: "manaslu-circuit-trek-preparation"
  }
];

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

  // Use default blogs if no blogs exist in the database yet
  const displayBlogs = blogs && blogs.length > 0 ? blogs : (defaultBlogs as unknown as BlogPost[]);

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
