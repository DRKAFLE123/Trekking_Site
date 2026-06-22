import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trek, Testimonial, Faq } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import TrekDetailClient from "@/components/TrekDetailClient";
import cloudinaryLoader, { getMediaUrl } from "@/lib/cloudinary-loader";

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
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "treks",
      where: { slug: { equals: slug } },
      depth: 2,
    });
    const trek = (res.docs[0] || null) as unknown as Trek | null;
    if (!trek) {
      return { title: "Trip Not Found | Nature Heaven Trekking & Expedition" };
    }

    // Determine fallback social share image
    let heroImageUrl = "";
    const rawImage = getMediaUrl(trek.heroImage);
    if (rawImage) {
      heroImageUrl = cloudinaryLoader({ src: rawImage, width: 1200 });
    } else {
      heroImageUrl = "/Manaslu-Circuit-Trek.jpg"; // fallback
    }

    const title = trek.metaTitle || `${trek.title} - ${trek.duration} Days | Nature Heaven Trekking & Expedition`;
    const description = trek.metaDescription || `Join our private, customizable ${trek.duration}-day ${trek.title}. Guided by native Sherpa experts with optimized adaptation schedules.`;
    const openGraphImages = heroImageUrl ? [{ url: heroImageUrl, alt: trek.title }] : [];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `/trips/${trek.slug}`,
        images: openGraphImages,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: heroImageUrl ? [heroImageUrl] : [],
      },
    };
  } catch (err: any) {
    return {
      title: "Nature Heaven Trekking & Expedition",
    };
  }
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { slug } = await params;
  let trek: Trek | null = null;
  let similarTreks: Trek[] = [];
  let displayTestimonials: Testimonial[] = [];
  let faqs: Faq[] = [];

  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "treks",
      where: { slug: { equals: slug } },
      depth: 2,
    });
    trek = (res.docs[0] || null) as unknown as Trek | null;

    if (trek) {
      // Fetch similar treks (same region, exclude current trek) in parallel with testimonials and FAQs
      const [allTreksRes, testimonialsRes, faqsRes] = await Promise.all([
        payload.find({
          collection: "treks",
          depth: 1,
        }),
        payload.find({
          collection: "testimonials",
          depth: 1,
        }),
        payload.find({
          collection: "faqs",
          depth: 0,
          limit: 500, // Fetch all to filter in JS safely
        })
      ]);

      const allTreks = allTreksRes.docs as unknown as Trek[];
      similarTreks = allTreks
        .filter((t) => t.region?.slug === trek!.region?.slug && t.slug !== trek!.slug)
        .slice(0, 3);

      const testimonials = testimonialsRes.docs as unknown as Testimonial[];
      const relatedTestimonials = testimonials
        .filter((t) => t.trek?.slug === trek!.slug)
        .slice(0, 3);
      displayTestimonials = relatedTestimonials.length > 0 ? relatedTestimonials : testimonials.slice(0, 3);

      // Filter FAQs: matches if treks array contains this trek ID OR showOnAllTreks is true
      const generalAndCategoryFaqs = faqsRes.docs.filter((faq: any) => {
        if (faq.showOnAllTreks === true) return true;
        if (faq.treks && faq.treks.length > 0) {
          const trekIds = faq.treks.map((t: any) => typeof t === 'object' ? t.id : t);
          return trekIds.includes(trek!.id);
        }
        return false;
      }) as unknown as Faq[];

      // Map trek-specific nested FAQs into the Faq interface format
      const trekSpecificFaqs = (trek.faqs || []).map((faq: any, idx: number) => ({
        id: `trek-faq-${idx}`,
        question: faq.question,
        category: faq.category || "general",
        answer: faq.answer,
      })) as unknown as Faq[];

      // Merge trek-specific FAQs first, then general/category FAQs
      faqs = [...trekSpecificFaqs, ...generalAndCategoryFaqs];
    }
  } catch (err: any) {
    console.warn("[Trip Detail Page] Failed to query trip details:", err.message);
  }

  if (!trek) {
    notFound();
  }

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(trekSchema).replace(/</g, "\\u003c"),
        }}
      />

      <TrekDetailClient
        trek={trek}
        similarTreks={similarTreks}
        testimonials={displayTestimonials}
        faqs={faqs}
      />
    </>
  );
}


