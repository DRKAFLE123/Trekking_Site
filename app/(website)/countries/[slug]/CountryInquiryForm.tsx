"use client";

import React, { useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaPaperPlane } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { Trek } from "@/types";


interface CountryInquiryFormProps {
  countryName: string;
  treks: Trek[];
}

export default function CountryInquiryForm({ countryName, treks }: CountryInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    startDate: "",
    travelers: 1,
    trek: treks[0]?._id || treks[0]?.id || "", // Fallback to first trek since DB requires reference or we made it optional
    message: `Hi Kafle, I am planning a custom, private adventure to ${countryName} and would like to customize an itinerary!`,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "travelers" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setStatus("error");
      setStatusMessage("Please complete the reCAPTCHA validation.");
      return;
    }
    setStatus("loading");

    try {
      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setStatusMessage(`Thank you! Your custom ${countryName} inquiry has been logged. Our Himalayan travel expert will email you a custom itinerary and quotes in 6 to 12 hours.`);
      } else {
        throw new Error(data.errors?.[0]?.message || "Failed to submit inquiry. Please try again.");
      }
    } catch (err: any) {
      setStatus("error");
      setStatusMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full text-left font-sans">
      {status === "success" ? (
        <div className="text-center py-8 flex flex-col gap-4 animate-fade-in-up">
          <FaCheckCircle className="h-12 w-12 text-[#25D366] mx-auto animate-pulse" />
          <h3 className="font-serif font-bold text-xl text-primary">Inquiry Received!</h3>
          <p className="text-sm text-charcoal/80 leading-relaxed bg-secondary/10 p-5 rounded-xl border border-secondary/20">
            {statusMessage}
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-xs text-primary font-bold hover:underline mt-2"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h3 className="font-serif font-bold text-primary text-lg border-b border-primary/5 pb-2">
            Tailor-Made {countryName} Planning
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-charcoal/70">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Jane Doe"
                className="bg-bgOffWhite border border-secondary/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-secondary"
              />
            </div>
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-charcoal/70">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jane@example.com"
                className="bg-bgOffWhite border border-secondary/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-charcoal/70">Phone / WhatsApp</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 555-0199"
                className="bg-bgOffWhite border border-secondary/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-secondary"
              />
            </div>
            {/* Nationality */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-charcoal/70">Your Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="United States"
                className="bg-bgOffWhite border border-secondary/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Travel Date */}
            <div className="flex flex-col gap-1 sm:col-span-1">
              <label className="text-[11px] font-bold text-charcoal/70">Travel Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="bg-bgOffWhite border border-secondary/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-secondary"
              />
            </div>
            {/* Travelers */}
            <div className="flex flex-col gap-1 sm:col-span-1">
              <label className="text-[11px] font-bold text-charcoal/70">No. of Travelers</label>
              <input
                type="number"
                name="travelers"
                min={1}
                max={50}
                value={formData.travelers}
                onChange={handleInputChange}
                className="bg-bgOffWhite border border-secondary/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-secondary"
              />
            </div>
            {/* Reference Trek */}
            <div className="flex flex-col gap-1 sm:col-span-1">
              <label className="text-[11px] font-bold text-charcoal/70">Ref Package</label>
              <select
                name="trek"
                value={formData.trek}
                onChange={handleInputChange}
                className="bg-bgOffWhite border border-secondary/15 rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-secondary"
              >
                {treks.map((t) => (
                  <option key={t.id} value={t._id || t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Message */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-charcoal/70">Special Requests / Message *</label>
            <textarea
              name="message"
              required
              rows={3}
              value={formData.message}
              onChange={handleInputChange}
              className="bg-bgOffWhite border border-secondary/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-secondary resize-none leading-relaxed"
            ></textarea>
          </div>



          {/* ReCAPTCHA */}
          <div className="flex justify-center my-2">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "dummy_key"}
              onChange={(token) => setRecaptchaToken(token)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading" || !recaptchaToken}
            className="w-full bg-secondary text-primary font-bold py-3.5 rounded-xl border border-secondary hover:bg-transparent hover:text-secondary hover:scale-[1.01] transition-all duration-300 text-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
          >
            <FaPaperPlane className="h-3 w-3" />
            <span>{status === "loading" ? "Submitting Inquiry..." : `Request Tailor-Made ${countryName} Plan`}</span>
          </button>

          {status === "error" && (
            <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl text-[11px]">
              <FaExclamationCircle className="shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
