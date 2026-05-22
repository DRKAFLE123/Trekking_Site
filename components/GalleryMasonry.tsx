"use client";

import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

// Images live in public/gallery/ folder.
const images = [
  '/gallery/happy_face1.png',
  '/gallery/happy_face2.png',
  '/gallery/happy_face3.png',
  '/gallery/happy_face4.png',
  '/gallery/happy_face5.png',
  '/gallery/happy_face6.png',
  '/gallery/happy_face7.png',
  '/gallery/happy_face8.png',
];

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export default function GalleryMasonry() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openLightbox = (idx: number) => {
    setPhotoIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <section className="my-12 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-6 text-[#1a2e1f] font-serif">
        Happy Moments
      </h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto"
        columnClassName="bg-clip-padding"
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer overflow-hidden rounded-lg mb-4 shadow-sm hover:shadow-md transition-shadow"
            onClick={() => openLightbox(idx)}
          >
            <Image
              src={src}
              alt={`Happy face ${idx + 1}`}
              width={400}
              height={300}
              className="object-cover w-full h-auto transform hover:scale-105 transition-transform"
              unoptimized
            />
          </div>
        ))}
      </Masonry>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={photoIndex}
        slides={images.map((src) => ({ src }))}
      />
    </section>
  );
}
