"use client";

import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaSearchPlus } from "react-icons/fa";

interface Certificate {
  title: string;
  imageUrl: string;
}

interface CertificateGalleryProps {
  certificates?: Certificate[];
}

const DEFAULT_CERTIFICATES: Certificate[] = [
  {
    title: "Government Tourism License (Ministry of Tourism)",
    imageUrl: "/legal_license_mockup.png",
  },
  {
    title: "Trekking Agencies Association of Nepal (TAAN) Active Member Certificate",
    imageUrl: "/legal_license_mockup.png",
  },
  {
    title: "Nepal Mountaineering Association (NMA) Registered Operator License",
    imageUrl: "/legal_license_mockup.png",
  },
  {
    title: "Central Bank of Nepal (Foreign Exchange Transaction Authorization)",
    imageUrl: "/legal_license_mockup.png",
  },
  {
    title: "Kathmandu Environmental Education Project (KEEP) Eco-Tourism Certificate",
    imageUrl: "/legal_license_mockup.png",
  },
];

export default function CertificateGallery({ certificates = [] }: CertificateGalleryProps) {
  const [index, setIndex] = useState(-1);

  // Use CMS uploaded certificates if present, otherwise fall back to dummy mockup images
  const list = certificates.length > 0 ? certificates : DEFAULT_CERTIFICATES;

  // Prepare slides for Lightbox
  const slides = list.map((cert) => ({
    src: cert.imageUrl,
    alt: cert.title,
  }));

  return (
    <div className="flex flex-col gap-6 mt-8">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-serif text-2xl font-bold text-[#1a2e1f]">
          Official Licenses &amp; Certificates
        </h3>
        <p className="text-sm text-gray-500 font-sans mt-1">
          Click on any certificate to view it in full screen.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((cert, idx) => (
          <div
            key={idx}
            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#2E7D32] transition duration-300 flex flex-col cursor-pointer"
            onClick={() => setIndex(idx)}
          >
            {/* Image Wrapper */}
            <div className="relative aspect-[4/3] w-full bg-[#fbfbfc] overflow-hidden">
              <Image
                src={cert.imageUrl}
                alt={cert.title}
                fill
                className="object-contain p-4 group-hover:scale-105 transition duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Zoom overlay */}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#2E7D32] text-lg shadow-md group-hover:scale-110 transition duration-300">
                  <FaSearchPlus />
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 border-t border-gray-50 flex-1 flex flex-col justify-center bg-gray-50/30">
              <h4 className="font-sans text-xs font-bold text-[#1a2e1f] text-center leading-snug group-hover:text-[#2E7D32] transition duration-200">
                {cert.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
      />
    </div>
  );
}
