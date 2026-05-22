"use client";

import React from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface VideoItem {
  id: string;
  title: string;
  trekName: string;
}

export default function VideoGallery() {
  const videos: VideoItem[] = [
    {
      id: "h1F7Tj2_H0Q",
      title: "Hiking 50 miles to Everest Base Camp",
      trekName: "Everest Base Camp Trek",
    },
    {
      id: "5uV6xH7V69Q",
      title: "Annapurna Circuit Trek: Nepal's Thorong La Pass",
      trekName: "Annapurna Circuit Trek",
    },
    {
      id: "AigtGxV3XPQ",
      title: "Walking Through the Himalayas | Taksindu to Gokyo Trek",
      trekName: "EBC via Gokyo Lakes",
    },
    {
      id: "PYaviq4rFtQ",
      title: "The Annapurna Base Camp Trek - Amazing Annapurna",
      trekName: "Annapurna Base Camp Trek",
    },
    {
      id: "lq0h-p0iPj8",
      title: "The Manaslu Circuit at 80. Hiking Nepal's Most Underrated Trek",
      trekName: "Manaslu Circuit Trek",
    },
    {
      id: "Jg6gQo5rNq4",
      title: "Hiking Alone in Nepal (Mardi Himal Trek)",
      trekName: "Mardi Himal Trek",
    },
  ];

  return (
    <section className="py-20 px-6 bg-white border-b border-secondary/10">
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
            Get a firsthand look at what it is like to trek through remote mountain passes, local teahouses, and snow-capped peaks with Nature Heaven Trekking & Expedition.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((vid, idx) => (
            <div
              key={idx}
              className="bg-bgOffWhite rounded-xl overflow-hidden border border-secondary/10 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
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

      </div>
    </section>
  );
}
