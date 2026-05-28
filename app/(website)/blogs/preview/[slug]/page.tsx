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

  const blogTyped = blog as unknown as BlogPost;
  return {
    title: `[DRAFT PREVIEW] ${blogTyped.title || 'Untitled Draft'} | Nature Heaven Chronicles`,
    description: blogTyped.excerpt,
    robots: {
      index: false,
      follow: false,
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
