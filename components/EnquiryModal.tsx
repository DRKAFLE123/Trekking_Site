"use client";

import React, { useState } from "react";
import { FaTimes, FaCheckCircle, FaExclamationCircle, FaLock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  defaultPrice: number;
}

export default function EnquiryModal({ isOpen, onClose, tripTitle, defaultPrice }: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const calculateCost = () => {
    let unitPrice = defaultPrice;
    if (guests === 1) unitPrice = defaultPrice + 50; // single supplement
    else if (guests >= 4 && guests <= 7) unitPrice = Math.max(defaultPrice - 50, 100);
    else if (guests >= 8) unitPrice = Math.max(defaultPrice - 100, 100);
    return unitPrice * guests;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setStatusMsg("");

    const totalCost = calculateCost();

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          date: startDate,
          guests,
          message: message ? `${message}${phone ? ` (Phone: ${phone})` : ""}` : `Standard booking query. Phone: ${phone || "N/A"}`,
          tripTitle,
          totalCost,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setStatusMsg("Thank you! Your enquiry has been received. Our specialist will contact you shortly.");
        // Reset fields
        setName("");
        setEmail("");
        setPhone("");
        setStartDate("");
        setGuests(2);
        setMessage("");
      } else {
        throw new Error(data.error || "Failed to submit booking.");
      }
    } catch (err: any) {
      setStatus("error");
      setStatusMsg(err.message || "Something went wrong. Please check your connection and try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          ></motion.div>

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 md:p-8 z-10 flex flex-col gap-6 text-[#3D3D3D] max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[#E5E5E5] pb-4">
              <div>
                <span className="text-[10px] text-[#E84C1E] uppercase font-bold tracking-widest block mb-0.5">Himalayan Enquiry</span>
                <h3 className="font-serif text-lg md:text-xl font-black text-[#1A2E44] leading-tight">
                  {tripTitle}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-100 rounded-full"
                aria-label="Close modal"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            {status === "success" ? (
              <div className="flex flex-col gap-5 text-center py-8">
                <FaCheckCircle className="h-14 w-14 text-green-500 mx-auto" />
                <h4 className="font-serif font-black text-xl text-[#1A2E44]">Booking Enquiry Sent!</h4>
                <p className="text-sm text-[#3D3D3D] leading-relaxed bg-green-50 border border-green-200 p-4 rounded-xl">
                  {statusMsg}
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    onClose();
                  }}
                  className="bg-[#1a3c2e] hover:bg-[#1a3c2e]/90 text-white font-bold py-3 px-6 rounded-xl transition text-xs uppercase tracking-wider self-center mt-2 shadow-md"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#1A2E44] uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-50 border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#1A2E44] focus:outline-none focus:border-[#E84C1E] transition"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#1A2E44] uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-50 border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#1A2E44] focus:outline-none focus:border-[#E84C1E] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#1A2E44] uppercase">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-slate-50 border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#1A2E44] focus:outline-none focus:border-[#E84C1E] transition"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#1A2E44] uppercase">Start Date *</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-slate-50 border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs text-[#1A2E44] focus:outline-none focus:border-[#E84C1E] cursor-pointer transition"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#1A2E44] uppercase">Number of Guests *</label>
                  <div className="flex items-center border border-[#E5E5E5] rounded-xl overflow-hidden bg-slate-50 h-[38px] max-w-[150px]">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-full bg-slate-100 hover:bg-slate-200 border-r border-[#E5E5E5] flex items-center justify-center font-bold text-sm focus:outline-none"
                    >
                      -
                    </button>
                    <span className="grow text-center text-xs font-black text-[#1A2E44] select-none">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(Math.min(30, guests + 1))}
                      className="w-10 h-full bg-slate-100 hover:bg-slate-200 border-l border-[#E5E5E5] flex items-center justify-center font-bold text-sm focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#1A2E44] uppercase">Custom Message / Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Describe any dietary needs, flight preferences, or customized duration demands..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-slate-50 border border-[#E5E5E5] rounded-xl px-4 py-2 text-xs text-[#1A2E44] focus:outline-none focus:border-[#E84C1E] resize-none transition"
                  ></textarea>
                </div>

                <div className="bg-[#1a3c2e] text-white p-4 rounded-xl flex items-center justify-between text-xs font-semibold mt-1">
                  <span className="text-white/80">Estimated Price ({guests} Pax):</span>
                  <span className="text-[#4FA3E0] font-black text-sm font-sans">${calculateCost()} USD</span>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#E84C1E] hover:bg-[#C03A12] text-white font-bold py-3.5 rounded-xl border border-transparent transition duration-300 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 mt-2"
                >
                  <span>{status === "loading" ? "Submitting Request..." : "Send Secure Enquiry"}</span>
                </button>

                {status === "error" && (
                  <div className="flex items-start gap-2 text-red-800 bg-red-50 border border-red-200 p-3 rounded-xl text-xs">
                    <FaExclamationCircle className="shrink-0 mt-0.5" />
                    <span>{statusMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#6B6B6B] font-bold">
                  <FaLock className="text-amber-500" />
                  <span>Your information is protected by industry standard encryption.</span>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
