import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaHiking } from "react-icons/fa";
// Data fetching handled via internal API routes
import { Region, Trek } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import TrekCard from "@/components/TrekCard";


export const revalidate = 60; // Revalidate every minute

interface RegionDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RegionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "regions",
      where: { slug: { equals: slug } },
      depth: 1,
    });
    const region = (res.docs[0] || null) as unknown as Region | null;

    if (!region) {
      return {
        title: "Region Not Found | Nature Heaven Trekking & Expedition",
      };
    }

    return {
      title: `${region.name} Region Trekking | Nature Heaven Trekking & Expedition`,
      description:
        region.description ||
        `Explore private, customized trekking routes in the beautiful ${region.name} region of the Nepal Himalayas. Guided by local experts.`,
    };
  } catch (err: any) {
    return {
      title: "Region Trekking | Nature Heaven Trekking & Expedition",
    };
  }
}

export default async function RegionDetailPage({ params }: RegionDetailPageProps) {
  const { slug } = await params;
  let region: Region | null = null;
  let treks: Trek[] = [];

  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "regions",
      where: { slug: { equals: slug } },
      depth: 1,
    });
    region = (res.docs[0] || null) as unknown as Region | null;

    if (region) {
      treks = region.treks || [];
      if (!treks || treks.length === 0) {
        const resAll = await payload.find({
          collection: "treks",
          depth: 1,
        });
        const allTreks = resAll.docs as unknown as Trek[];
        treks = allTreks.filter((t) => t.region?.slug === region!.slug);
      }
    }
  } catch (err: any) {
    console.warn("[Region Detail Page] Failed to query region detail:", err.message);
  }

  if (!region) {
    notFound();
  }

  return (
    <div className="bg-[#fcfbfa] min-h-screen">
      {/* Hero Header */}
      <section className="relative w-full h-[55vh] min-h-[350px] bg-primary overflow-hidden flex items-end">
        {/* Background Image and overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/45 z-10 bg-gradient-to-t from-black/80 via-black/10 to-black/30"></div>
          {region.coverImage ? (
            <Image
              src={region.coverImage}
              alt={region.name}
              fill
              priority

              className="object-cover object-center"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/40 font-serif">
              Nature Heaven Trekking
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-20 w-full text-bgOffWhite flex flex-col gap-4">
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary-light tracking-wider uppercase mb-2 mr-auto"
          >
            <FaArrowLeft />
            <span>Back to All Treks</span>
          </Link>
          
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black max-w-4xl leading-tight">
            {region.name} Region
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-bgOffWhite/90 max-w-xl leading-relaxed">
            {region.description}
          </p>
        </div>
      </section>

      {/* Region Treks list */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col gap-8">
          <div className="border-b border-primary/5 pb-4">
            <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
              <FaHiking className="text-secondary" />
              <span>Available Treks in {region.name}</span>
            </h2>
            <p className="text-xs text-charcoal/70 mt-1">
              Select one of our private, fully customized trekking itineraries in the {region.name} region.
            </p>
          </div>

          {treks && treks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {treks.map((trek) => (
                <TrekCard key={trek.id || trek._id} trek={trek} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-secondary/10 rounded-2xl p-8 flex flex-col items-center gap-3">
              <span className="text-4xl">🏔️</span>
              <h3 className="font-serif font-bold text-lg text-primary">No treks listed in this region yet</h3>
              <p className="text-xs text-charcoal/70 max-w-xs">
                We are currently crafting custom itineraries for the {region.name} region. Please contact us to design a custom trip.
              </p>
              <Link
                href="/contact-us"
                className="bg-secondary text-primary font-bold px-5 py-2 rounded-xl text-xs hover:scale-105 active:scale-95 transition"
              >
                Inquire Custom Trek
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
