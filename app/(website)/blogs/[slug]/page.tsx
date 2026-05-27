import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { renderLexical, extractHeadings } from "@/lib/lexical-renderer";
import { getMediaUrl } from "@/lib/cloudinary-loader";
import BlogDetailClient from "@/components/BlogDetailClient";

export const revalidate = 60; // Revalidate every minute

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "blogPosts",
      where: { slug: { equals: slug } },
      depth: 1,
    });
    const blog = (res.docs[0] || null) as unknown as BlogPost | null;

    if (!blog) {
      return {
        title: "Article Not Found | Nature Heaven Trekking & Expedition",
      };
    }

    return {
      title: `${blog.title} | Nature Heaven Chronicles`,
      description: blog.excerpt,
    };
  } catch (err: any) {
    return {
      title: "Nature Heaven Chronicles | Nature Heaven Trekking & Expedition",
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let blog: BlogPost | null = null;
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "blogPosts",
      where: { slug: { equals: slug } },
      depth: 2,
    });
    blog = (res.docs[0] || null) as unknown as BlogPost | null;
  } catch (err: any) {
    console.warn("[Blog Detail Page] Failed to query blog details:", err.message);
  }

  if (!blog) {
    notFound();
  }

  const headings = extractHeadings(blog.body);
  const bodyContent = renderLexical(blog.body);

  // Pre-generate the Related Treks Card widget to pass as prop
  const relatedTreksCard = blog.relatedTreks && blog.relatedTreks.length > 0 ? (
    <div className="bg-white border border-secondary/10 shadow-md rounded-2xl p-6 flex flex-col gap-4">
      <h4 className="font-serif font-bold text-primary text-base border-b border-primary/5 pb-2 flex items-center gap-2">
        <span>🏔️</span>
        <span>Related Treks</span>
      </h4>
      <div className="flex flex-col gap-4">
        {blog.relatedTreks.map((relTrek, idx) => {
          const price = relTrek.discountedPrice || relTrek.price;
          const trekHeroUrl = getMediaUrl(relTrek.heroImage);
          return (
            <Link
              key={idx}
              href={`/trips/${relTrek.slug}`}
              className="group flex gap-3.5 hover:bg-bgOffWhite/30 p-2 rounded-xl transition duration-300 border border-transparent hover:border-secondary/15"
            >
              {trekHeroUrl && (
                <div className="relative h-16 w-20 rounded-lg overflow-hidden shrink-0 bg-primary/10">
                  <Image
                    src={trekHeroUrl}
                    alt={relTrek.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1 overflow-hidden">
                <h5 className="font-serif font-bold text-primary group-hover:text-secondary transition text-xs md:text-sm leading-snug truncate">
                  {relTrek.title}
                </h5>
                <div className="flex items-center gap-3 text-[10px] text-charcoal/70">
                  <span>{relTrek.duration} Days</span>
                  <span>•</span>
                  <span className="font-bold text-primary">${price} USD</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <BlogDetailClient
      blog={blog}
      headings={headings}
      bodyContent={bodyContent}
      relatedTreksCard={relatedTreksCard}
    />
  );
}
