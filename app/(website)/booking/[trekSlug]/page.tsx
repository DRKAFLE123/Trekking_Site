import React from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import BookingStepper from "@/components/BookingStepper";

interface BookingPageProps {
  params: Promise<{ trekSlug: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { trekSlug } = await params;
  const payload = await getPayload({ config });

  // Fetch the trek details
  const res = await payload.find({
    collection: "treks",
    where: { slug: { equals: trekSlug } },
    depth: 1,
  });

  const trek = res.docs[0];
  if (!trek) {
    notFound();
  }

  // Group discounts fallback setup
  const groupDiscounts = trek.groupDiscounts && trek.groupDiscounts.length > 0
    ? trek.groupDiscounts
    : [
        { minPersons: 1, maxPersons: 1, pricePerPerson: trek.discountedPrice || trek.price },
        { minPersons: 2, maxPersons: 3, pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.96) },
        { minPersons: 4, maxPersons: 7, pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.92) },
        { minPersons: 8, maxPersons: 13, pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.88) },
        { minPersons: 14, maxPersons: 25, pricePerPerson: Math.round((trek.discountedPrice || trek.price) * 0.84) },
      ];

  return (
    <div className="bg-[#F8F7F4] min-h-screen py-16 font-sans text-[#3D3D3D]">
      <div className="max-w-4xl mx-auto px-6">
        <BookingStepper
          trek={{
            id: trek.id,
            title: trek.title,
            slug: trek.slug,
            duration: trek.duration,
            price: trek.price,
            discountedPrice: trek.discountedPrice || undefined,
            groupDiscounts
          }}
        />
      </div>
    </div>
  );
}
