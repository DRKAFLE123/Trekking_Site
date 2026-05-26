"use client";

import React, { useState } from "react";
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!recaptchaToken) {
      setStatus("error");
      setMessage("Please complete the reCAPTCHA validation.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, recaptchaToken }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setMessage("Thank you! You have successfully subscribed to our newsletter.");
        setEmail("");
      } else {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to subscribe. Please try again later.");
    }
  };

  return (
    <section className="bg-primary text-bgOffWhite relative overflow-hidden py-16 px-6 border-b border-secondary/10">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-8 border-secondary"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border-8 border-secondary"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
          Stay Connected
        </span>
        <h2 className="font-serif text-2xl md:text-4xl font-bold mb-4">
          Join Our Himalayan Adventure Newsletter
        </h2>
        <p className="text-sm md:text-base text-bgOffWhite/80 max-w-2xl mx-auto mb-8 leading-relaxed">
          Subscribe to receive custom private itineraries, travel guides, exclusive trek discounts, and live weather updates from Everest, Annapurna, and beyond.
        </p>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={status === "loading"}
            className="grow px-5 py-3.5 rounded-xl bg-black/20 border border-secondary/35 text-white placeholder-bgOffWhite/50 focus:outline-none focus:border-secondary transition-all text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading" || !recaptchaToken}
            className="bg-secondary text-primary font-bold px-6 py-3.5 rounded-xl hover:bg-secondary-light transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 active:scale-95 shrink-0"
          >
            <span>{status === "loading" ? "Subscribing..." : "Subscribe Now"}</span>
            <FaPaperPlane className="h-3 w-3" />
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "dummy_key"}
            onChange={(token) => setRecaptchaToken(token)}
            theme="dark"
          />
        </div>

        {/* Message Status */}
        {status === "success" && (
          <div className="mt-4 flex items-center justify-center gap-2 text-green-300 text-sm animate-fade-in-up">
            <FaCheckCircle className="shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-300 text-sm animate-fade-in-up">
            <FaExclamationCircle className="shrink-0" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </section>
  );
}
