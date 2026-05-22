import React from "react";
import { Metadata } from "next";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Nature Heaven Trekking & Expedition",
  description: "Get in touch with Nature Heaven Trekking & Expedition Kathmandu office. Call us, email us, or send a WhatsApp message to start customizing your private Himalayan trek.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#fcfbfa] min-h-screen pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Start Your Journey
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary mb-4">
            Contact An Expert
          </h1>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80 leading-relaxed">
            Have questions about acclimatization, customized itineraries, or booking deposits? Contact our local Sherpa team directly.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Column 1: Info Cards (1/3 width) */}
          <div className="flex flex-col gap-6">
            
            {/* Phone & Whatsapp */}
            <div className="bg-white border border-secondary/10 p-6 rounded-2xl shadow-sm flex flex-col gap-3">
              <h4 className="font-serif font-bold text-primary text-base border-b border-primary/5 pb-2">
                Phone & Chat Support
              </h4>
              <div className="flex flex-col gap-3.5 text-xs text-charcoal/80">
                <a
                  href="tel:+9779851218358"
                  className="flex items-center gap-2.5 hover:text-secondary transition font-semibold"
                >
                  <FaPhoneAlt className="text-secondary text-sm shrink-0" />
                  <span>Office/Mobile: +977 9851218358</span>
                </a>
                <a
                  href="https://wa.me/9779851218358"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-green-700 hover:text-green-800 transition font-bold"
                >
                  <FaWhatsapp className="text-green-500 text-base shrink-0" />
                  <span>WhatsApp: +977 9851218358</span>
                </a>
              </div>
            </div>

            {/* Email Inbox */}
            <div className="bg-white border border-secondary/10 p-6 rounded-2xl shadow-sm flex flex-col gap-3">
              <h4 className="font-serif font-bold text-primary text-base border-b border-primary/5 pb-2">
                Email Inquiries
              </h4>
              <div className="flex flex-col gap-3 text-xs text-charcoal/80">
                <a
                  href="mailto:info@natureheaventrek.com"
                  className="flex items-center gap-2.5 hover:text-secondary transition font-semibold"
                >
                  <FaEnvelope className="text-secondary text-sm shrink-0" />
                  <span>info@natureheaventrek.com</span>
                </a>
                <a
                  href="mailto:natureheaventrek@gmail.com"
                  className="flex items-center gap-2.5 hover:text-secondary transition font-semibold"
                >
                  <FaEnvelope className="text-secondary text-sm shrink-0" />
                  <span>natureheaventrek@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Address HQ */}
            <div className="bg-white border border-secondary/10 p-6 rounded-2xl shadow-sm flex flex-col gap-3">
              <h4 className="font-serif font-bold text-primary text-base border-b border-primary/5 pb-2">
                Headquarters Office
              </h4>
              <div className="flex items-start gap-2.5 text-xs text-charcoal/80 leading-relaxed font-semibold">
                <FaMapMarkerAlt className="text-secondary text-base shrink-0 mt-0.5" />
                <div>
                  <span>Nature Heaven Treks and Expedition Pvt. Ltd.</span>
                  <br />
                  <span>Pakjonal Marga -16, Thamel</span>
                  <br />
                  <span>Kathmandu, Nepal</span>
                </div>
              </div>
            </div>

          </div>

          {/* Column 2: Form (2/3 width) */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}
