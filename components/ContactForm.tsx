"use client";

import React, { useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setStatusMessage("Thank you! Your message has been received. Our team will get back to you within 6 to 12 hours.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.error || "Failed to submit message. Please try again.");
      }
    } catch (err: any) {
      setStatus("error");
      setStatusMessage(err.message || "Something went wrong. Please check your network and try again.");
    }
  };

  return (
    <div className="bg-white border border-secondary/15 shadow-xl rounded-2xl p-6 md:p-8">
      {status === "success" ? (
        <div className="text-center py-10 flex flex-col gap-4 animate-fade-in-up">
          <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h3 className="font-serif font-bold text-xl text-primary">Message Sent!</h3>
          <p className="text-sm text-charcoal/80 leading-relaxed max-w-sm mx-auto bg-green-50 p-4 rounded-xl border border-green-200">
            {statusMessage}
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-xs text-primary font-bold hover:underline mt-2"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h3 className="font-serif font-bold text-primary text-xl md:text-2xl border-b border-primary/5 pb-3">
            Send Us a Message
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-charcoal/70">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="bg-bgOffWhite border border-secondary/15 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-secondary"
              />
            </div>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-charcoal/70">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="bg-bgOffWhite border border-secondary/15 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-charcoal/70">Subject</label>
            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="e.g. Everest Base Camp customization"
              className="bg-bgOffWhite border border-secondary/15 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-charcoal/70">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="How can we help you plan your Himalayan adventure?"
              className="bg-bgOffWhite border border-secondary/15 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-secondary resize-none"
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
            className="w-full bg-secondary text-primary font-bold py-3.5 rounded-xl border border-secondary hover:bg-transparent hover:text-secondary hover:scale-[1.02] active:scale-95 transition-all duration-300 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{status === "loading" ? "Sending..." : "Send Message"}</span>
          </button>

          {status === "error" && (
            <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl text-xs">
              <FaExclamationCircle className="shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
