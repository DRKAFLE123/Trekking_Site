"use client";

import React from "react";

interface HeroVideoProps {
  videoUrl?: string;
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  // If it's already an 11-char ID
  if (url.length === 11 && !url.includes("/") && !url.includes(".")) {
    return url;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * HeroVideo – renders a YouTube iframe as background video.
 * Only mounts after client hydration to prevent React hydration mismatch.
 * Falls back to animated gradient while loading.
 */
export default function HeroVideo({ videoUrl }: HeroVideoProps) {
  const [mounted, setMounted] = React.useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = React.useState("https://www.youtube.com/watch?v=UiPPGu2gZbY");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const ytId = getYouTubeId(activeVideoUrl);

  React.useEffect(() => {
    let url = videoUrl || "https://www.youtube.com/watch?v=UiPPGu2gZbY";
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    // Pre-emptively detect and rewrite Cloudinary cloud name if set in env
    if (url.includes("res.cloudinary.com")) {
      if (cloudName) {
        const match = url.match(/res\.cloudinary\.com\/([^\/]+)\//);
        if (match && match[1] !== cloudName) {
          console.log(`Rewriting Cloudinary cloud name in URL from '${match[1]}' to '${cloudName}'`);
          url = url.replace(`res.cloudinary.com/${match[1]}`, `res.cloudinary.com/${cloudName}`);
        }
      } else {
        console.log("Cloudinary cloud name is not set in env. Defaulting to fallback YouTube video.");
        url = "https://www.youtube.com/watch?v=UiPPGu2gZbY";
      }
    }
    setActiveVideoUrl(url);
  }, [videoUrl]);

  return (
    <>
      {/* Animated CSS gradient fallback - always visible behind video */}
      <div
        className="absolute inset-0 hero-gradient-anim"
        style={{ zIndex: 0 }}
      />

      {/* YouTube iframe: only rendered client-side after mount to avoid hydration mismatch */}
      {mounted && ytId && (
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`}
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-full min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 object-cover scale-[1.15]"
            allow="autoplay; encrypted-media; picture-in-picture"
            title="Hero background video"
            style={{ border: "none" }}
          />
        </div>
      )}

      {/* Local video fallback for non-YouTube URLs */}
      {mounted && !ytId && activeVideoUrl && (
        <video
          key={activeVideoUrl} // Remount video player when the URL swaps
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ zIndex: 1 }}
          onError={() => {
            if (activeVideoUrl !== "https://www.youtube.com/watch?v=UiPPGu2gZbY") {
              console.log("Video player error. Falling back to default YouTube video.");
              setActiveVideoUrl("https://www.youtube.com/watch?v=UiPPGu2gZbY");
            }
          }}
        >
          <source 
            src={activeVideoUrl} 
            type="video/mp4" 
            onError={() => {
              if (activeVideoUrl !== "https://www.youtube.com/watch?v=UiPPGu2gZbY") {
                console.log("Source tag load error. Falling back to default YouTube video.");
                setActiveVideoUrl("https://www.youtube.com/watch?v=UiPPGu2gZbY");
              }
            }}
          />
        </video>
      )}

      {/* Floating mountain particles for extra depth */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="hero-particle hero-particle-1" />
        <div className="hero-particle hero-particle-2" />
        <div className="hero-particle hero-particle-3" />
        <div className="hero-particle hero-particle-4" />
        <div className="hero-particle hero-particle-5" />
      </div>
    </>
  );
}
