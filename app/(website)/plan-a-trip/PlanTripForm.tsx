"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaExclamationCircle, FaPaperPlane, FaUserFriends, FaCalendarAlt, FaChevronRight, FaChevronLeft, FaHiking, FaCompass } from "react-icons/fa";
import { Trek } from "@/types";
import ReCAPTCHA from "react-google-recaptcha";

interface PlanTripFormProps {
  treks: Trek[];
}

type Step = 1 | 2 | 3;

export default function PlanTripForm({ treks }: PlanTripFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    startDate: "",
    travelers: 1,
    trek: treks[0]?._id || treks[0]?.id || "", // Reference trek
    // Plan Trip Extra fields (injected into message for DB collection structure)
    destination: "Nepal",
    style: "Trekking",
    accommodation: "Deluxe Guesthouses",
    duration: "10-14 Days",
    message: "",
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

  const selectDestination = (val: string) => {
    setFormData((prev) => ({ ...prev, destination: val }));
  };

  const selectStyle = (val: string) => {
    setFormData((prev) => ({ ...prev, style: val }));
  };

  const selectAccommodation = (val: string) => {
    setFormData((prev) => ({ ...prev, accommodation: val }));
  };

  const selectDuration = (val: string) => {
    setFormData((prev) => ({ ...prev, duration: val }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setStatus("error");
      setStatusMessage("Please complete the reCAPTCHA validation.");
      return;
    }

    setStatus("loading");

    // Formulate a beautiful, highly detailed message for Kafle and the team containing all custom specs!
    const customMessage = `
========================================
🌟 INTERACTIVE TRIP PLANNING REQUEST 🌟
========================================
🗺️ Destination Selected: ${formData.destination}
🎒 Travel Style: ${formData.style}
🏨 Accommodation: ${formData.accommodation}
⏳ Target Duration: ${formData.duration}
👥 Total Travelers: ${formData.travelers} Persons
📅 Planned Start Date: ${formData.startDate || "Flexible / Not Decided"}

📝 SPECIAL CUSTOM REQUESTS:
${formData.message || "No special requests listed. Design a premium, standard custom outline for me!"}
`.trim();

    const payloadData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      startDate: formData.startDate || undefined,
      travelers: formData.travelers,
      trek: formData.trek || undefined,
      message: customMessage,
      recaptchaToken,
    };

    try {
      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadData),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setStatusMessage(`Thank you, ${formData.name}! Your custom travel plan inquiry has been received. Our native expert Kafle and the Sherpa team will draft a detailed daily itinerary and customize pricing according to your specifications. Expect an email outline inside 6 to 12 hours.`);
      } else {
        throw new Error(data.errors?.[0]?.message || "Failed to submit inquiry. Please try again.");
      }
    } catch (err: any) {
      setStatus("error");
      setStatusMessage(err.message || "An unexpected error occurred while communicating with the database. Please try again.");
    }
  };

  return (
    <div className="w-full bg-white border border-secondary/10 shadow-2xl rounded-3xl p-6 md:p-10 font-sans text-charcoal">
      {status === "success" ? (
        <div className="text-center py-12 flex flex-col gap-6 animate-fade-in-up">
          <FaCheckCircle className="h-16 w-16 text-[#25D366] mx-auto animate-pulse" />
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-primary">Your Journey Begins!</h2>
          <div className="max-w-md mx-auto text-sm sm:text-base leading-relaxed bg-secondary/10 p-6 rounded-2xl border border-secondary/20">
            {statusMessage}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link
              href="/"
              className="w-full sm:w-auto bg-primary text-white font-bold px-8 py-3.5 rounded-xl hover:bg-transparent hover:text-primary border border-primary transition-all duration-300 text-sm flex items-center justify-center"
            >
              Return to Homepage
            </Link>
            <a
              href={`https://wa.me/9779851218358`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-green-600 transition-all duration-300 text-sm flex items-center justify-center gap-2"
            >
              WhatsApp expert directly
            </a>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-8">
          {/* Stepper Steps UI */}
          <div className="w-full flex justify-between items-center relative mb-4">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-gray-150 z-0">
              <div 
                className="h-full bg-secondary transition-all duration-500" 
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>

            {[1, 2, 3].map((step) => (
              <button
                key={step}
                type="button"
                disabled={step > currentStep}
                onClick={() => setCurrentStep(step as Step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm relative z-10 transition-all duration-500 border-2 ${
                  currentStep === step
                    ? "bg-secondary border-secondary text-primary scale-110 shadow-lg"
                    : currentStep > step
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {step}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-xs font-bold text-charcoal/60 -mt-5 px-1 uppercase tracking-wider">
            <span>1. Destination</span>
            <span>2. Preferences</span>
            <span>3. Contact details</span>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
            {/* STEP 1: Select Country */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div>
                  <h3 className="font-serif font-black text-primary text-xl sm:text-2xl mb-2">
                    Where would you like to travel?
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal/70">
                    Select your dream destination. We specialize in private, custom itineraries across the high Himalayas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Nepal Card */}
                  <button
                    type="button"
                    onClick={() => selectDestination("Nepal")}
                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition duration-300 ${
                      formData.destination === "Nepal"
                        ? "bg-secondary/10 border-secondary text-secondary shadow-md scale-[1.02]"
                        : "bg-white border-gray-200 hover:border-secondary/50 text-charcoal/80"
                    }`}
                  >
                    <svg className="w-12 h-12 stroke-current" viewBox="0 0 64 64" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 48 C 14 32, 50 32, 50 48 Z" />
                      <path d="M8 48 h 48" />
                      <path d="M4 54 h 56" />
                      <rect x="26" y="22" width="12" height="10" />
                      <circle cx="30" cy="27" r="1.5" fill="currentColor" />
                      <circle cx="34" cy="27" r="1.5" fill="currentColor" />
                      <path d="M32 29 Q 32.5 30.5, 32 31" />
                      <path d="M32 22 V 10" />
                      <path d="M28 10 h 8" />
                      <path d="M32 10 V 4" />
                    </svg>
                    <span className="font-bold text-xs uppercase tracking-wider">Nepal</span>
                  </button>

                  {/* Tibet Card */}
                  <button
                    type="button"
                    onClick={() => selectDestination("Tibet")}
                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition duration-300 ${
                      formData.destination === "Tibet"
                        ? "bg-secondary/10 border-secondary text-secondary shadow-md scale-[1.02]"
                        : "bg-white border-gray-200 hover:border-secondary/50 text-charcoal/80"
                    }`}
                  >
                    <svg className="w-12 h-12 stroke-current" viewBox="0 0 64 64" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 50 h 40" />
                      <path d="M16 50 L 18 38 h 28 L 50 50" />
                      <path d="M18 38 C 16 38, 16 35, 18 35 h 28 C 50 35, 50 38, 48 38" />
                      <path d="M22 35 L 24 24 h 16 L 42 35" />
                      <path d="M24 24 C 22 24, 22 21, 24 21 h 16 C 42 21, 42 24, 40 24" />
                      <path d="M28 14 Q 32 8, 36 14 Z" />
                      <path d="M32 8 V 4" />
                    </svg>
                    <span className="font-bold text-xs uppercase tracking-wider">Tibet</span>
                  </button>

                  {/* Bhutan Card */}
                  <button
                    type="button"
                    onClick={() => selectDestination("Bhutan")}
                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition duration-300 ${
                      formData.destination === "Bhutan"
                        ? "bg-secondary/10 border-secondary text-secondary shadow-md scale-[1.02]"
                        : "bg-white border-gray-200 hover:border-secondary/50 text-charcoal/80"
                    }`}
                  >
                    <svg className="w-12 h-12 stroke-current" viewBox="0 0 64 64" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 52 h 52" />
                      <path d="M10 52 L 14 30 h 36 L 54 52" />
                      <line x1="20" y1="44" x2="20" y2="40" />
                      <line x1="32" y1="44" x2="32" y2="40" />
                      <line x1="44" y1="44" x2="44" y2="40" />
                      <path d="M18 30 h 28" />
                      <path d="M18 24 h 28" />
                      <path d="M16 24 C 14 24, 14 20, 18 20 h 28 C 50 20, 50 24, 48 24" />
                      <path d="M22 20 L 25 12 h 14 L 37 20" />
                      <path d="M32 12 V 4" />
                    </svg>
                    <span className="font-bold text-xs uppercase tracking-wider">Bhutan</span>
                  </button>

                  {/* Multi Country Card */}
                  <button
                    type="button"
                    onClick={() => selectDestination("Multi-Country (Nepal + Tibet / Bhutan)")}
                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition duration-300 ${
                      formData.destination.includes("Multi")
                        ? "bg-secondary/10 border-secondary text-secondary shadow-md scale-[1.02]"
                        : "bg-white border-gray-200 hover:border-secondary/50 text-charcoal/80"
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      <FaCompass className="w-10 h-10" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider">Multi-Country</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Preferences & Style */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div>
                  <h3 className="font-serif font-black text-primary text-xl sm:text-2xl mb-2">
                    Define Your Travel Style
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal/70">
                    Tell us what kind of experience you are looking for. All plans are private and customized.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Style selectors */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-charcoal/70 uppercase">Trip Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Trekking", "Peak Climbing", "Cultural Sightseeing", "Jungle Safari", "Heli Tour"].map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => selectStyle(style)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                            formData.style === style
                              ? "bg-primary border-primary text-white font-bold"
                              : "bg-bgOffWhite border-gray-200 hover:border-primary/45"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accommodation selectors */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-charcoal/70 uppercase">Accommodation Preference</label>
                    <div className="flex flex-col gap-2">
                      {[
                        { name: "Standard Teahouses", desc: "Basic mountain lodges, authentic & local" },
                        { name: "Deluxe Guesthouses", desc: "Upgraded attached bathroom rooms where available" },
                        { name: "Luxury Boutique Hotels", desc: "Elite 4-5★ boutique resorts in main hubs" }
                      ].map((acc) => (
                        <button
                          key={acc.name}
                          type="button"
                          onClick={() => selectAccommodation(acc.name)}
                          className={`px-4 py-3 rounded-xl border text-left transition flex justify-between items-center ${
                            formData.accommodation === acc.name
                              ? "bg-secondary/10 border-secondary text-secondary font-bold"
                              : "bg-bgOffWhite border-gray-200 hover:border-secondary/45"
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold">{acc.name}</div>
                            <div className="text-[10px] text-charcoal/60 mt-0.5">{acc.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-charcoal/70 uppercase">Ideal Duration</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Short (<10 Days)", "Medium (10-14 Days)", "Long (14+ Days)"].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => selectDuration(dur)}
                          className={`px-3 py-3 rounded-xl border text-[11px] font-semibold text-center transition ${
                            formData.duration === dur
                              ? "bg-primary border-primary text-white font-bold"
                              : "bg-bgOffWhite border-gray-200 hover:border-primary/45"
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reference Trek dropdown */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-charcoal/70 uppercase">Preferred Base Package (Optional)</label>
                    <select
                      name="trek"
                      value={formData.trek}
                      onChange={handleInputChange}
                      className="bg-bgOffWhite border border-gray-200 rounded-xl px-4 py-3 text-xs text-charcoal focus:outline-none focus:border-secondary"
                    >
                      <option value="">-- No specific package, plan completely from scratch --</option>
                      {treks.map((t) => (
                        <option key={t.id} value={t._id || t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Contact details */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div>
                  <h3 className="font-serif font-black text-primary text-xl sm:text-2xl mb-2">
                    Contact & Traveler Logistics
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal/70">
                    Please provide your contact information. Kafle and the team will email you a tailored PDF proposal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-charcoal/70">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="bg-bgOffWhite border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-secondary"
                    />
                  </div>
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-charcoal/70">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="bg-bgOffWhite border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-secondary"
                    />
                  </div>
                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-charcoal/70">Phone / WhatsApp</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 555-0199"
                      className="bg-bgOffWhite border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-secondary"
                    />
                  </div>
                  {/* Country */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-charcoal/70">Country of Residence</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Canada"
                      className="bg-bgOffWhite border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-secondary"
                    />
                  </div>
                  {/* Travelers Count */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-charcoal/70 flex items-center gap-1.5">
                      <FaUserFriends className="text-secondary" />
                      <span>Number of Travelers</span>
                    </label>
                    <input
                      type="number"
                      name="travelers"
                      min={1}
                      max={40}
                      required
                      value={formData.travelers}
                      onChange={handleInputChange}
                      className="bg-bgOffWhite border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-secondary"
                    />
                  </div>
                  {/* Start Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-charcoal/70 flex items-center gap-1.5">
                      <FaCalendarAlt className="text-secondary" />
                      <span>Planned Start Date</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="bg-bgOffWhite border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-xs font-bold text-charcoal/70">Custom Requests / Accommodating Altitude Pace</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="e.g. I need custom acclimatization days, prefer standard rooms, want to include peak climbing permits, or have food dietary requirements..."
                    className="bg-bgOffWhite border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-secondary resize-none leading-relaxed"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex justify-between items-center border-t border-gray-150 pt-6 mt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-transparent border-2 border-primary text-primary font-bold px-6 py-3 rounded-xl hover:bg-bgOffWhite transition flex items-center gap-2 text-xs uppercase tracking-wider"
                >
                  <FaChevronLeft className="h-3 w-3" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-primary text-white font-bold px-6 py-3.5 rounded-xl border border-primary hover:bg-transparent hover:text-primary transition flex items-center gap-2 text-xs uppercase tracking-wider shadow-md"
                >
                  <span>Next Step</span>
                  <FaChevronRight className="h-3 w-3" />
                </button>
              ) : (
                <div className="flex flex-col gap-4 items-end">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "dummy_key"}
                    onChange={(token) => setRecaptchaToken(token)}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading" || !recaptchaToken}
                    className="bg-secondary text-primary font-bold px-8 py-3.5 rounded-xl border border-secondary hover:bg-transparent hover:text-secondary transition flex items-center gap-2 text-xs uppercase tracking-wider shadow-lg disabled:opacity-50"
                  >
                    <FaPaperPlane className="h-3.5 w-3.5 animate-pulse" />
                    <span>{status === "loading" ? "Designing Plan..." : "Submit Travel Plan"}</span>
                  </button>
                </div>
              )}
            </div>

            {status === "error" && (
              <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl text-xs mt-4">
                <FaExclamationCircle className="shrink-0 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
