"use client";

import React from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface VideoItem {
  id: string;
  title: string;
  trekName: string;
}

interface VideoGalleryClientProps {
  videos: VideoItem[];
}

export default function VideoGalleryClient({ videos }: VideoGalleryClientProps) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white border-b border-secondary/10">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Watch the Journey
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
            Himalayan Trek Experience
          </h2>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80">
            Get a firsthand look at what it is like to trek through remote mountain passes, local teahouses, and snow-capped peaks with Nature Heaven Trekking &amp; Expedition.
          </p>
        </div>

        {/* Video Grid (Slider on mobile, standard grid on desktop) */}
        <div className="flex overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 -mx-4 px-4 md:mx-0 md:px-0">
          {videos.map((vid, idx) => (
            <div
              key={idx}
              className="bg-bgOffWhite rounded-xl overflow-hidden border border-secondary/10 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full w-[290px] md:w-auto shrink-0 snap-align-start"
            >
              {/* Lazy Embedded Player */}
              <div className="aspect-video w-full overflow-hidden bg-black relative shadow-inner">
                <LiteYouTubeEmbed
                  id={vid.id}
                  title={vid.title}
                  poster="maxresdefault"
                  noCookie={true}
                />
              </div>

              {/* Title info */}
              <div className="p-4 md:p-5 flex flex-col justify-between grow">
                <span className="text-[10px] text-secondary font-bold tracking-wider uppercase mb-1.5 block">
                  {vid.trekName}
                </span>
                <h3 className="font-serif font-bold text-primary text-sm md:text-base leading-snug line-clamp-2">
                  {vid.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Admin hint */}
        <p className="text-center text-xs text-charcoal/40 mt-10 font-sans">
          Manage videos via{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/admin" className="underline hover:text-secondary transition">
            Admin → Site Settings → Video Gallery
          </a>
        </p>

      </div>
    </section>
  );
}
