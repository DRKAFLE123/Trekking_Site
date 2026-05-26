"use client";

import React, { useState } from "react";
import { FaCalendarAlt, FaUsers, FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

interface BookingFormProps {
  price: number;
  discountedPrice?: number;
  tripTitle: string;
}

export default function BookingForm({ price, discountedPrice, tripTitle }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    guests: 1,
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const unitPrice = discountedPrice || price;
  const originalPrice = price;
  const hasDiscount = !!discountedPrice && discountedPrice < price;

  const totalCost = unitPrice * formData.guests;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Math.max(1, parseInt(value) || 1) : value,
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
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tripTitle,
          totalCost,
          recaptchaToken,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setStatusMessage("Thank you! Your private trek enquiry has been submitted. A Sherpa travel expert will contact you via email or WhatsApp within 12 hours.");
        setFormData({ name: "", email: "", date: "", guests: 1, message: "" });
      } else {
        throw new Error(data.error || "Failed to submit booking. Please try again.");
      }
    } catch (err: any) {
      setStatus("error");
      setStatusMessage(err.message || "Something went wrong. Please check your network and try again.");
    }
  };

  return (
    <div className="bg-white border-2 border-secondary/20 shadow-xl rounded-2xl p-6 flex flex-col gap-6 sticky top-28">
      {/* Price section */}
      <div className="border-b border-primary/5 pb-4">
        <span className="text-xs text-muted uppercase tracking-wider font-semibold block mb-1">
          Private Trek Cost
        </span>
        <div className="flex items-baseline gap-2">
          {hasDiscount && (
            <span className="text-base text-muted line-through font-medium">${originalPrice}</span>
          )}
          <span className="text-3xl font-black text-primary font-sans">${unitPrice}</span>
          <span className="text-xs text-muted font-semibold">USD / Person</span>
        </div>
        <p className="text-[10px] text-green-700 font-bold mt-1.5 flex items-center gap-1">
          <span>✓</span> 100% Customized Private Departures (Any Date)
        </p>
      </div>

      {/* Booking Form */}
      {status === "success" ? (
        <div className="flex flex-col gap-4 text-center py-6 animate-fade-in-up">
          <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h4 className="font-serif font-bold text-lg text-primary">Enquiry Submitted!</h4>
          <p className="text-xs text-charcoal/80 leading-relaxed bg-green-50 p-4 rounded-xl border border-green-200">
            {statusMessage}
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-xs text-primary font-bold hover:underline"
          >
            Send Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h4 className="font-serif font-bold text-primary text-base">Check Availability & Book</h4>
          
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-charcoal/70">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
              className="bg-bgOffWhite border border-secondary/15 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-charcoal/70">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. john@example.com"
              className="bg-bgOffWhite border border-secondary/15 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Grid: Start Date & Guests */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-charcoal/70 flex items-center gap-1">
                <FaCalendarAlt className="text-secondary text-[10px]" />
                <span>Start Date</span>
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                className="bg-bgOffWhite border border-secondary/15 rounded-xl px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:border-secondary cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-charcoal/70 flex items-center gap-1">
                <FaUsers className="text-secondary text-[10px]" />
                <span>Trekkers</span>
              </label>
              <input
                type="number"
                name="guests"
                required
                min={1}
                value={formData.guests}
                onChange={handleInputChange}
                className="bg-bgOffWhite border border-secondary/15 rounded-xl px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          {/* Message / Customizations */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-charcoal/70">Customization Requirements</label>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Mention dietary needs, hotel preference, or itinerary extensions..."
              className="bg-bgOffWhite border border-secondary/15 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-secondary resize-none"
            ></textarea>
          </div>

          {/* Dynamic Price Summary */}
          {formData.guests > 1 && (
            <div className="bg-bgOffWhite border border-secondary/10 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold">
              <span className="text-charcoal/70">Est. Total ({formData.guests} guests)</span>
              <span className="text-primary font-bold font-sans text-sm">${totalCost} USD</span>
            </div>
          )}

          {/* ReCAPTCHA */}
          <div className="flex justify-center my-1">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "dummy_key"}
              onChange={(token) => setRecaptchaToken(token)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading" || !recaptchaToken}
            className="w-full bg-secondary text-primary font-bold py-3.5 rounded-xl border border-secondary hover:bg-transparent hover:text-secondary hover:scale-[1.02] active:scale-95 transition-all duration-300 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{status === "loading" ? "Submitting..." : "Send Enquiry Request"}</span>
          </button>

          {status === "error" && (
            <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl text-xs">
              <FaExclamationCircle className="shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted font-medium mt-1">
            <FaLock className="text-secondary" />
            <span>Secure SSL communication. No upfront payment required.</span>
          </div>
        </form>
      )}
    </div>
  );
}
