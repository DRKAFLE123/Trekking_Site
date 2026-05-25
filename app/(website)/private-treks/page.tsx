import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  FaQuestionCircle, 
  FaArrowRight, 
  FaRunning, 
  FaUserShield, 
  FaCalendarAlt, 
  FaHotel, 
  FaUserCheck, 
  FaShieldAlt,
  FaWhatsapp,
  FaCheckCircle
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Exclusive Private Treks in Nepal | Nature Heaven Trekking & Expedition",
  description: "Enjoy fully personalized private treks in Nepal with flexible itineraries, dedicated native Sherpa guides, and customized schedules built for your pace.",
};

export default function PrivateTreksPage() {
  const benefits = [
    {
      title: "100% Control of Your Pace",
      desc: "No pressure to keep up with strangers or wait for slower hikers. Set a comfortable speed that matches your fitness level. If you feel tired or want to spend more time taking photos, your guide adjusts the daily schedule instantly.",
      icon: <FaRunning className="h-6 w-6 text-[#c8922a]" />,
    },
    {
      title: "Native Sherpa Guide & Porter Crew",
      desc: "Get undivided, one-on-one attention from your native Sherpa guide. In private treks, communication is clear and highly personal. Learn about local traditions, Buddhist culture, and Himalayan peaks directly from local experts.",
      icon: <FaUserShield className="h-6 w-6 text-[#c8922a]" />,
    },
    {
      title: "Choose Any Start Date",
      desc: "Unlike fixed departures that limit your planning, you can choose any calendar date that perfectly coordinates with your international flights, holiday schedules, and seasonal preferences.",
      icon: <FaCalendarAlt className="h-6 w-6 text-[#c8922a]" />,
    },
    {
      title: "Customizable Lodging & Route upgrades",
      desc: "Upgrade or downgrade your accommodation package. Want to stay in luxury boutique mountain resorts in Namche Bazaar, or stick to classic rustic teahouses? On a private trek, customizing your trail comfort is fully in your hands.",
      icon: <FaHotel className="h-6 w-6 text-[#c8922a]" />,
    },
    {
      title: "Solo Traveler Welcomed & Supported",
      desc: "We proudly organize private treks for single solo travelers, providing them with a dedicated private guide for safety, guidance, and companionship. Feel safe and supported throughout your Himalayan journey.",
      icon: <FaUserCheck className="h-6 w-6 text-[#c8922a]" />,
    },
    {
      title: "Altitude Safety First",
      desc: "Altitude sickness affects everyone differently. On a private trek, decisions to stop, rest, acclimatize, or descend are made exclusively based on your group's health and well-being rather than a mixed group's schedule.",
      icon: <FaShieldAlt className="h-6 w-6 text-[#c8922a]" />,
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Pick Your Himalayan Route",
      desc: "Select from our world-renowned itineraries including Everest Base Camp, Annapurna Circuit, Manaslu, or Langtang Valley. We support all regions.",
    },
    {
      step: "02",
      title: "Choose Your Dates & Companions",
      desc: "Select your preferred start date. Trek solo, as a couple, or with your family, friends, or colleagues. We do not mix you with strangers.",
    },
    {
      step: "03",
      title: "Customize & Personalize",
      desc: "Speak with our Himalayan specialists. Adjust the daily trek duration, add rest days, choose hotel standards, or add helicopter return upgrades.",
    },
    {
      step: "04",
      title: "Confirm & Pack Your Bags",
      desc: "Secure your trek with a flexible 10% deposit. Receive detailed packing checklists and prepare for an unforgettable personalized journey.",
    },
  ];

  return (
    <div className="bg-[#fcfbfa] min-h-screen">
      {/* Hero Header */}
      <div className="relative w-full bg-[#1a2e1f] py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.25,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-[#c8922a]/20 text-[#c8922a] border border-[#c8922a]/30 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
            🏔️ 100% Personalized Journeys
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-5">
            Exclusive Private Treks in Nepal
          </h1>
          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            Enjoy fully personalized private treks tailored exclusively to your speed, interest, and group size. We never mix you with strangers — just you and your chosen companions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/plan-a-trip"
              className="w-full sm:w-auto bg-[#c8922a] hover:bg-[#b07820] text-white font-bold py-3.5 px-8 rounded-xl text-sm transition shadow-lg hover:scale-[1.02] active:scale-95"
            >
              Plan Custom Itinerary
            </Link>
            <a
              href="https://wa.me/9779851218358"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 px-8 rounded-xl text-sm transition shadow-lg hover:scale-[1.02] active:scale-95"
            >
              <FaWhatsapp className="text-lg" /> Chat with Expert
            </a>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="text-xs text-[#6B6B6B] flex items-center gap-1.5 font-semibold flex-wrap">
          <Link href="/" className="hover:text-[#2E7D32] transition">Home</Link>
          <span className="text-[#D0D0D0]">/</span>
          <span className="text-[#6B6B6B]">Travel Info</span>
          <span className="text-[#D0D0D0]">/</span>
          <span className="text-[#1A1A2E] font-medium">Private Treks</span>
        </div>
      </div>

      {/* Intro section */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-[#1a2e1f] mb-5 leading-tight">
              Trek on Your Own Terms. No Strangers. No Compromises.
            </h2>
            <div className="h-0.5 w-16 bg-[#c8922a] mb-6"></div>
            <p className="text-sm md:text-base text-charcoal/80 leading-relaxed mb-4">
              Most treks in Nepal last longer than a week. This means the companions you walk and share teahouses with will heavily impact your overall mountain experience. 
            </p>
            <p className="text-sm md:text-base text-charcoal/80 leading-relaxed mb-4">
              Our <strong>Exclusive Private Treks</strong> remove the uncertainty of trekking with strangers. Instead of adjusting to mismatched walking speeds or conflicting group dynamics, you enjoy Nepal’s trails at your own pace with people you already know and trust. 
            </p>
            <p className="text-sm md:text-base text-charcoal/80 leading-relaxed">
              We specialize in custom itineraries and personal service, ensuring every detail is built for your comfort, acclimatization, and safety.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-[#c8922a]/10">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800"
              alt="Trekkers viewing mountains"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1f]/90 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <p className="text-xs text-[#c8922a] font-bold tracking-wider uppercase mb-1">Safety & Comfort First</p>
                <h4 className="font-serif font-bold text-lg">Your Safety is Our Single Priority</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Private Treks Grid */}
      <section className="bg-white border-y border-secondary/10 py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#c8922a] uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
              The Private Advantage
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary">
              Why Choose a Private Trek in Nepal?
            </h2>
            <div className="h-0.5 w-16 bg-[#c8922a] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, idx) => (
              <div key={idx} className="bg-[#fdfbf7] border border-secondary/10 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300">
                <div className="h-12 w-12 bg-[#c8922a]/10 border border-[#c8922a]/20 flex items-center justify-center rounded-xl mb-5">
                  {b.icon}
                </div>
                <h3 className="font-serif font-bold text-primary text-lg mb-3">{b.title}</h3>
                <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed font-light">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Steps */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#c8922a] uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            Simplifying Your Booking
          </span>
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary">
            How to Plan Your Private Trek
          </h2>
          <div className="h-0.5 w-16 bg-[#c8922a] mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => (
            <div key={idx} className="relative p-6 bg-white border border-secondary/10 rounded-2xl flex flex-col justify-between h-full shadow-sm">
              <span className="absolute -top-6 left-6 text-5xl font-black text-[#c8922a]/10 select-none font-serif">{s.step}</span>
              <div className="mt-4">
                <h4 className="font-serif font-bold text-primary text-base md:text-lg mb-2">{s.title}</h4>
                <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-[#1a2e1f] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <h3 className="font-serif font-black text-2xl md:text-4xl text-white mb-3">
                Ready to Plan Your Private Adventure?
              </h3>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                Connect with our local expert Kafle today to customize your itinerary, check permit costs, and arrange flexible payment gateways.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-xs font-semibold text-[#c8922a]">
                <span className="flex items-center gap-1.5"><FaCheckCircle className="text-white text-xs" /> Free Customization</span>
                <span className="flex items-center gap-1.5"><FaCheckCircle className="text-white text-xs" /> 10% Deposit to Book</span>
                <span className="flex items-center gap-1.5"><FaCheckCircle className="text-white text-xs" /> Local Sherpa Rates</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">
              <Link
                href="/plan-a-trip"
                className="w-full sm:w-auto text-center bg-[#c8922a] hover:bg-[#b07820] text-white font-bold py-3.5 px-8 rounded-xl text-sm transition shadow-lg hover:scale-105 active:scale-95"
              >
                Inquire Now
              </Link>
              <a
                href="https://wa.me/9779851218358"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 px-8 rounded-xl text-sm transition shadow-lg hover:scale-105 active:scale-95"
              >
                <FaWhatsapp className="text-lg" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
