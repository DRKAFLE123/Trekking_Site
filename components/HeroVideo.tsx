"use client";

import React from "react";

/**
 * HeroVideo – renders a high-quality local HTML5 video background.
 * Falls back to an animated gradient if the video cannot load.
 */
export default function HeroVideo() {
  return (
    <>
      {/* Background video motion */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
        style={{ zIndex: 1 }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Animated CSS gradient fallback (always visible behind video) */}
      <div
        className="absolute inset-0 hero-gradient-anim"
        style={{ zIndex: 0 }}
      />

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
