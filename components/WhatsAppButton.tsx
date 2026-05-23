"use client";

import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState("9779851218358");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/site-settings");
        const data = await res.json();
        if (data?.headerSettings?.expertWhatsApp) {
          // Keep only numbers
          const cleanNum = data.headerSettings.expertWhatsApp.replace(/[^0-9]/g, "");
          if (cleanNum) {
            setWhatsappNumber(cleanNum);
          }
        }
      } catch (err) {
        console.error("Failed to fetch WhatsApp number for float button:", err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl hover:bg-green-600 hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="h-8 w-8" />
    </a>
  );
}
