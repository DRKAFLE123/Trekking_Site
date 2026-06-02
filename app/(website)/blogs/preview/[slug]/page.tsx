import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaRegClock, FaEye } from "react-icons/fa";
import { BlogPost } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { renderLexical } from "@/lib/lexical-renderer";
import { getMediaUrl } from "@/lib/cloudinary-loader";
import { BlogPreviewClient } from "./BlogPreviewClient";

interface BlogPreviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });
  
  let blog = null;
  const res = await payload.find({
    collection: "blogPosts",
    where: { slug: { equals: slug } },
    depth: 2,
    draft: true,
  });
  if (res.docs[0]) {
    blog = res.docs[0];
  } else {
    try {
      blog = await payload.findByID({
        collection: "blogPosts",
        id: slug,
        depth: 2,
        draft: true,
      });
    } catch (e) {}
  }

  if (!blog) {
    return {
      title: "Preview Article Not Found | Nature Heaven Trekking & Expedition",
    };
  }

  const blogTyped = blog as any;

  // Determine fallback social share image
  let metaImageUrl = "";
  if (blogTyped.seo?.metaImage && typeof blogTyped.seo.metaImage === "object") {
    metaImageUrl = blogTyped.seo.metaImage.url || "";
  } else if (blogTyped.seo?.metaImage && typeof blogTyped.seo.metaImage === "string") {
    metaImageUrl = blogTyped.seo.metaImage;
  }

  if (!metaImageUrl && blogTyped.coverImage) {
    if (typeof blogTyped.coverImage === "object") {
      metaImageUrl = blogTyped.coverImage.url || "";
    } else if (typeof blogTyped.coverImage === "string") {
      metaImageUrl = blogTyped.coverImage;
    }
  }

  const title = `[DRAFT PREVIEW] ${blogTyped.title || 'Untitled Draft'} | Nature Heaven Chronicles`;
  const description = blogTyped.excerpt;
  const openGraphImages = metaImageUrl ? [{ url: metaImageUrl, alt: blogTyped.title || "Preview" }] : [];

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: metaImageUrl ? [metaImageUrl] : [],
    },
  };
}

export default async function BlogPreviewPage({ params }: BlogPreviewPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  
  let blog = null;
  const res = await payload.find({
    collection: "blogPosts",
    where: { slug: { equals: slug } },
    depth: 2,
    draft: true,
  });
  if (res.docs[0]) {
    blog = res.docs[0];
  } else {
    try {
      blog = await payload.findByID({
        collection: "blogPosts",
        id: slug,
        depth: 2,
        draft: true,
      });
    } catch (e) {}
  }

  if (!blog) {
    notFound();
  }
  
  return (
    <BlogPreviewClient
      initialBlog={blog as unknown as BlogPost}
      serverURL={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}
    />
  );
}
