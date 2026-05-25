"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { FaVideo, FaSpinner } from "react-icons/fa";

interface VideoItem {
  id: string;
  title: string;
  trekName: string;
}

interface VideoGalleryPageClientProps {
  initialVideos: VideoItem[];
}

export default function VideoGalleryPageClient({ initialVideos }: VideoGalleryPageClientProps) {
  // Initially show 6 videos as highlights
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = visibleCount < initialVideos.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    // Simulate minor delay for smooth loading animation
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 6, initialVideos.length));
      setIsLoading(false);
    }, 600);
  }, [isLoading, hasMore, initialVideos.length]);

  // Load more automatically when scrolling close to the bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || isLoading) return;

      const threshold = 300; // load more when 300px from the bottom
      const totalHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.innerHeight + window.scrollY;

      if (totalHeight - scrollPosition < threshold) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, loadMore]);

  const visibleVideos = initialVideos.slice(0, visibleCount);

  return (
    <div className="bg-[#fcfbfa] min-h-screen">
      {/* Hero Header */}
      <div className="relative w-full bg-[#1a2e1f] py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.25,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-[#c8922a]/20 text-[#c8922a] border border-[#c8922a]/30 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
            <FaVideo className="text-[10px]" /> Video Hub
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            Himalayan Trek Experience
          </h1>
          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Explore our collection of mountain journey highlights. Get a firsthand view of remote trails, high-altitude passes, Sherpa guides, and rustic teahouses in the Nepal Himalayas.
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="text-xs text-[#6B6B6B] flex items-center gap-1.5 font-semibold flex-wrap">
          <Link href="/" className="hover:text-[#2E7D32] transition">Home</Link>
          <span className="text-[#D0D0D0]">/</span>
          <span className="text-[#6B6B6B]">Travel Info</span>
          <span className="text-[#D0D0D0]">/</span>
          <span className="text-[#1A1A2E] font-medium font-sans">Video Gallery</span>
        </div>
      </div>

      {/* Video Grid Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleVideos.map((vid, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-secondary/15 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full animate-in fade-in slide-in-from-bottom-3 duration-300"
            >
              {/* Lazy Embed YouTube Player */}
              <div className="aspect-video w-full overflow-hidden bg-black relative shadow-inner">
                <LiteYouTubeEmbed
                  id={vid.id}
                  title={vid.title}
                  poster="maxresdefault"
                  noCookie={true}
                />
              </div>

              {/* Video Info Detail */}
              <div className="p-5 flex flex-col justify-between grow">
                <div>
                  <span className="text-[10px] text-[#c8922a] font-bold tracking-wider uppercase mb-1.5 block">
                    {vid.trekName}
                  </span>
                  <h3 className="font-serif font-bold text-[#1a2e1f] text-sm md:text-base leading-snug line-clamp-2">
                    {vid.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}

          {/* Skeleton Pulse Loaders */}
          {isLoading && (
            <>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl overflow-hidden border border-secondary/15 shadow-sm flex flex-col h-full animate-pulse"
                >
                  <div className="aspect-video w-full bg-gray-200" />
                  <div className="p-5 flex flex-col justify-between grow space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-14">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="bg-[#1a2e1f] text-white hover:bg-[#c8922a] font-bold px-8 py-4 rounded-xl text-sm transition shadow-lg hover:scale-105 active:scale-95 duration-200 cursor-pointer inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Loading Videos...</span>
                </>
              ) : (
                <span>Load More Videos</span>
              )}
            </button>
          </div>
        )}

        {/* No Videos Found Fallback */}
        {initialVideos.length === 0 && (
          <div className="text-center py-20 text-charcoal/50 bg-white border border-secondary/10 rounded-2xl">
            <FaVideo className="text-5xl mx-auto mb-4 opacity-20 text-[#c8922a]" />
            <p className="font-semibold">No trekking videos found.</p>
            <p className="text-xs text-charcoal/40 mt-1">Configure your YouTube highlight videos in the CMS panel settings.</p>
          </div>
        )}
      </section>

      {/* Still Have Questions Box */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-[#1a2e1f] text-white rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div>
            <h3 className="font-serif font-black text-2xl text-white mb-2">
              Want a Tailored Himalayan Video Guide?
            </h3>
            <p className="text-white/60 text-sm max-w-lg leading-relaxed">
              Our native Sherpa guides carry action cameras on many treks. Contact us to receive raw drone clips or trail footage from the specific route you plan to trek.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0 z-10">
            <Link
              href="/contact-us"
              className="w-full sm:w-auto text-center bg-[#c8922a] hover:bg-[#b07820] text-white font-bold py-3.5 px-8 rounded-xl text-sm transition shadow-lg hover:scale-105 active:scale-95"
            >
              Inquire Custom Trek
            </Link>
            <a
              href="https://wa.me/9779851218358"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 px-8 rounded-xl text-sm transition shadow-lg hover:scale-105 active:scale-95"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
