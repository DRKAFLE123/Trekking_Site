import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trek, Testimonial } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import TrekDetailClient from "@/components/TrekDetailClient";

export const revalidate = 86400; // Revalidate every 24 hours (86400 seconds) as requested

interface TripDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all treks to pre-render pages
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "treks",
      limit: 200,
      depth: 0,
    });
    return res.docs.map((trek: any) => ({
      slug: trek.slug,
    }));
  } catch (err: any) {
    console.warn("[Trips Page] generateStaticParams bypassed (normal for a fresh database during build):", err.message);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: TripDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: "treks",
    where: { slug: { equals: slug } },
    depth: 1,
  });
  const trek = (res.docs[0] || null) as unknown as Trek | null;
  if (!trek) {
    return { title: "Trip Not Found | Nature Heaven Trekking & Expedition" };
  }
  return {
    title: trek.metaTitle || `${trek.title} - ${trek.duration} Days | Nature Heaven Trekking & Expedition`,
    description:
      trek.metaDescription ||
      `Join our private, customizable ${trek.duration}-day ${trek.title}. Guided by native Sherpa experts with optimized adaptation schedules.`,
  };
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  
  const res = await payload.find({
    collection: "treks",
    where: { slug: { equals: slug } },
    depth: 1,
  });
  const trek = (res.docs[0] || null) as unknown as Trek | null;
  if (!trek) {
    notFound();
  }

  // Fetch similar treks (same region, exclude current trek)
  const allTreksRes = await payload.find({
    collection: "treks",
    depth: 1,
  });
  const allTreks = allTreksRes.docs as unknown as Trek[];
  
  const similarTreks = allTreks
    .filter((t) => t.region?.slug === trek.region?.slug && t.id !== trek.id)
    .slice(0, 2);

  // Fetch testimonials for reviews footer
  const testimonialsRes = await payload.find({
    collection: "testimonials",
    depth: 1,
  });
  const testimonials = testimonialsRes.docs as unknown as Testimonial[];

  // Filter testimonials that completed this specific trek
  const relatedTestimonials = testimonials
    .filter((t) => t.trek?.slug === trek.slug)
    .slice(0, 3);

  // Fallback to general testimonials if no specific reviews found
  const displayTestimonials = relatedTestimonials.length > 0 ? relatedTestimonials : testimonials.slice(0, 3);

  // Schema: Breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://natureheaventrek.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Trips",
        "item": "https://natureheaventrek.com/trips"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": trek.title,
        "item": `https://natureheaventrek.com/trips/${trek.slug}`
      }
    ]
  };

  // Schema: Product (TouristTrip)
  const trekSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": trek.title,
    "image": trek.heroImage || "",
    "description": trek.metaDescription || `Join our ${trek.duration}-day ${trek.title} in Nepal.`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": trek.discountedPrice || trek.price,
      "availability": "https://schema.org/InStock",
      "url": `https://natureheaventrek.com/trips/${trek.slug}`
    }
  };

  return (
    <>
      {/* Inject Schema tags dynamically */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trekSchema) }}
      />
      
      <TrekDetailClient
        trek={trek}
        similarTreks={similarTreks}
        testimonials={displayTestimonials}
      />
    </>
  );
}


