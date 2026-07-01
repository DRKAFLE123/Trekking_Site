import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import PhotoGalleryMasonry from "@/components/PhotoGalleryMasonry";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Himalayan Photo Gallery | Nature Heaven Trekking & Expedition",
  description:
    "Explore stunning photographs from our Everest, Annapurna, Manaslu, Langtang, and other private Himalayan treks — captured by our native Sherpa guides and clients.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  let galleryItems: any[] = [];
  try {
    const payload = await getPayload({ config });
    const galleryRes = await payload.find({
      collection: "gallery",
      depth: 2,
      limit: 50,
      overrideAccess: true,
    });
    galleryItems = galleryRes.docs as any[];
  } catch (err: any) {
    console.warn("[Gallery Page] Failed to fetch gallery (relation may not exist yet during build):", err.message);
  }

  return (
    <div className="min-h-screen bg-[#fcfbfa]">
      {/* Page Hero Banner */}
      <div className="bg-primary text-bgOffWhite py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200')] bg-cover bg-center" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-4 block">
            Our Journey Together
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black mb-4 leading-tight">
            Photo Gallery
          </h1>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6" />
          <p className="text-bgOffWhite/80 text-base md:text-lg font-sans font-light max-w-xl mx-auto">
            Relive the magic of the Himalayas through the eyes of our adventurers. Every photo tells a story of courage, culture, and pure joy.
          </p>
        </div>
      </div>

      {/* Gallery Grid Section */}
      <PhotoGalleryMasonry items={galleryItems} />

      {/* Admin note for clients */}
      <div className="text-center py-8 px-6 text-sm text-charcoal/50 font-sans border-t border-secondary/10">
        📸 Gallery managed via{" "}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/admin/collections/gallery" className="underline text-secondary hover:text-primary transition">
          Payload Admin → Gallery
        </a>
      </div>
    </div>
  );
}
